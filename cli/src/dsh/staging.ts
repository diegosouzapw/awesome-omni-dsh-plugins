import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { once } from "node:events";
import {
  closeSync,
  constants as fsConstants,
  createWriteStream,
  fstatSync,
  openSync,
  readSync,
} from "node:fs";
import {
  lstat,
  mkdir,
  mkdtemp,
  open,
  readlink,
  readdir,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { devNull } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

import {
  canonicalPublicId,
  parseExactSemver,
  parseSha512Integrity,
} from "../catalog/index.js";

import { CliSafetyError } from "../errors.js";
import type { PublicCatalogEntry } from "../model.js";
import type { StagedInstall } from "./installState.js";
import {
  runSupervisedChild,
  type ChildSupervisorDependencies,
} from "./childSupervisor.js";
import {
  ensureCanonicalHome,
  ensureContainedDirectory,
  isPathWithin,
} from "./paths.js";

const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u;
const SOURCE_REPOSITORY = /^https:\/\/github\.com\/[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/[A-Za-z0-9._-]{1,100}$/u;
const SOURCE_SUBPATH = /^(?!\/)(?!.*\\)(?!\.{1,2}(?:\/|$))(?!.*(?:\/\.{1,2})(?:\/|$))[A-Za-z0-9._@+-]+(?:\/[A-Za-z0-9._@+-]+)*$/u;
const SHA40 = /^[0-9a-fA-F]{40}$/u;
const LFS_POINTER = "version https://git-lfs.github.com/spec/v1";
const NO_FOLLOW = typeof fsConstants.O_NOFOLLOW === "number" ? fsConstants.O_NOFOLLOW : 0;

export interface StageBudgets {
  readonly metadataBytes: number;
  readonly tarballBytes: number;
  readonly sourceBytes: number;
  readonly sourceFiles: number;
  readonly sourceDepth: number;
  readonly processOutputBytes: number;
  readonly fetchTimeoutMs: number;
  readonly gitTimeoutMs: number;
  readonly killGraceMs: number;
  readonly gitReapTimeoutMs: number;
}

export const DEFAULT_STAGE_BUDGETS: Readonly<StageBudgets> = Object.freeze({
  metadataBytes: 1024 * 1024,
  tarballBytes: 64 * 1024 * 1024,
  sourceBytes: 128 * 1024 * 1024,
  sourceFiles: 20_000,
  sourceDepth: 32,
  processOutputBytes: 2 * 1024 * 1024,
  fetchTimeoutMs: 30_000,
  gitTimeoutMs: 120_000,
  killGraceMs: 2_000,
  gitReapTimeoutMs: 5_000,
});

export interface ProcessRequest {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly signal?: AbortSignal;
  readonly outputBytes?: number;
  readonly killGraceMs?: number;
  readonly timeoutMs?: number;
  readonly reapTimeoutMs?: number;
  readonly resourceBudget?: Pick<StageBudgets, "sourceBytes" | "sourceFiles" | "sourceDepth">;
}

export type ProcessRunner = (request: ProcessRequest) => Promise<string>;

export interface StageOptions {
  readonly dshHome: string;
  readonly fetchImpl?: typeof fetch;
  readonly runProcess?: ProcessRunner;
  readonly signal?: AbortSignal;
  readonly offline?: boolean;
  readonly budgets?: Partial<StageBudgets>;
  readonly childSupervisor?: ChildSupervisorDependencies;
}

export class GitProcessUnreapedError extends CliSafetyError {
  readonly reaped = false;
  readonly recoveryRequired = true;

  constructor() {
    super("git process tree was not reaped; recovery required");
    this.name = "GitProcessUnreapedError";
  }
}

interface NpmCacheArtifact {
  readonly kind: "npm";
  readonly integrity: string;
  readonly bytes: number;
}

interface SourceCacheArtifact {
  readonly kind: "source";
  readonly commit: string;
  readonly treeSha512: string;
  readonly bytes: number;
  readonly files: number;
}

interface CacheMetadata {
  readonly version: 2;
  readonly fingerprint: string;
  readonly descriptorHash: string;
  readonly packageName: string;
  readonly installRelativePath: string;
  readonly artifact: NpmCacheArtifact | SourceCacheArtifact;
}

interface StagedMetadata {
  readonly packageName: string;
  readonly installRelativePath: string;
  readonly artifact: NpmCacheArtifact | SourceCacheArtifact;
}

interface TreeMeasurement {
  readonly bytes: number;
  readonly files: number;
  readonly digest: string;
}

export interface ArtifactRecoveryReference {
  readonly relativePath: string;
  readonly sha512: string;
  readonly bytes: number;
  readonly packageName: string;
}

export interface StagedArtifactLease {
  readonly recoveryReference: ArtifactRecoveryReference;
  revalidate(): Promise<void>;
  readVerifiedBytes(): Promise<Buffer>;
  release(): Promise<void>;
}

export interface StagedCatalogInstall extends StagedInstall {
  readonly artifactLease: StagedArtifactLease;
}

interface NpmVerifiedCache {
  readonly kind: "npm";
  readonly path: string;
  readonly expectedDigest: Buffer;
  readonly bytes: number;
}

interface SourceVerifiedCache {
  readonly kind: "source";
  readonly sourceRoot: string;
  readonly pluginRoot: string;
  readonly tree: TreeMeasurement;
}

const VERIFIED_CACHE = Symbol("verified-cache");

interface VerifiedCachedInstall extends StagedInstall {
  readonly [VERIFIED_CACHE]: NpmVerifiedCache | SourceVerifiedCache;
}

function stageBudgets(overrides: Partial<StageBudgets> | undefined): StageBudgets {
  const budgets = { ...DEFAULT_STAGE_BUDGETS, ...overrides };
  for (const [name, value] of Object.entries(budgets)) {
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new CliSafetyError(`staging budget ${name} is invalid`);
    }
  }
  return budgets;
}

function descriptorFor(entry: PublicCatalogEntry): string {
  return entry.package.ecosystem === "npm"
    ? `npm\0${entry.package.name}\0${entry.package.version}\0${entry.package.integrity ?? ""}`
    : `source\0${entry.source.repository}\0${entry.source.commit.toLowerCase()}\0${entry.source.subpath ?? "."}`;
}

function descriptorHash(entry: PublicCatalogEntry): string {
  return createHash("sha256").update(descriptorFor(entry)).digest("hex");
}

function assertAllowlistedHttps(urlValue: string, hosts: readonly string[]): URL {
  let url: URL;
  try {
    url = new URL(urlValue);
  } catch {
    throw new CliSafetyError("download URL is invalid");
  }
  if (
    url.protocol !== "https:" ||
    url.username !== "" ||
    url.password !== "" ||
    url.port !== "" ||
    !hosts.includes(url.hostname)
  ) {
    throw new CliSafetyError("download source is not allowlisted");
  }
  return url;
}

async function boundedOperation<T>(
  timeoutMs: number,
  graceMs: number,
  parentSignal: AbortSignal | undefined,
  timeoutMessage: string,
  operation: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  if (parentSignal?.aborted === true) {
    throw new CliSafetyError("staging was cancelled");
  }
  const controller = new AbortController();
  let timedOut = false;
  let cancelled = false;
  let rejectBoundary: ((error: Error) => void) | undefined;
  let graceTimer: NodeJS.Timeout | undefined;
  const boundary = new Promise<never>((_resolve, reject) => {
    rejectBoundary = reject;
  });
  const finishAbort = (message: string): void => {
    controller.abort();
    graceTimer = setTimeout(() => rejectBoundary?.(new CliSafetyError(message)), graceMs);
    graceTimer.unref?.();
  };
  const timeout = setTimeout(() => {
    timedOut = true;
    finishAbort(timeoutMessage);
  }, timeoutMs);
  timeout.unref?.();
  const onParentAbort = (): void => {
    cancelled = true;
    finishAbort("staging was cancelled");
  };
  parentSignal?.addEventListener("abort", onParentAbort, { once: true });
  try {
    return await Promise.race([operation(controller.signal), boundary]);
  } catch (error) {
    if (timedOut) throw new CliSafetyError(timeoutMessage);
    if (cancelled) {
      throw new CliSafetyError("staging was cancelled");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    if (graceTimer !== undefined) clearTimeout(graceTimer);
    parentSignal?.removeEventListener("abort", onParentAbort);
  }
}

async function fetchAllowlisted(
  initial: string,
  hosts: readonly string[],
  fetchImpl: typeof fetch,
  signal: AbortSignal,
): Promise<Response> {
  let current = assertAllowlistedHttps(initial, hosts);
  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const response = await fetchImpl(current, {
      redirect: "manual",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal,
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => undefined);
      if (location === null || redirect === 3) {
        throw new CliSafetyError("download redirect was rejected");
      }
      current = assertAllowlistedHttps(new URL(location, current).href, hosts);
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new CliSafetyError(`download failed with HTTP ${response.status}`);
    }
    return response;
  }
  throw new CliSafetyError("download redirect was rejected");
}

async function responseBytes(response: Response, limit: number, signal: AbortSignal): Promise<Buffer> {
  const declaredValue = response.headers.get("content-length");
  let declared: number | undefined;
  if (declaredValue !== null) {
    if (!/^(?:0|[1-9][0-9]*)$/u.test(declaredValue)) {
      await response.body?.cancel().catch(() => undefined);
      throw new CliSafetyError("download Content-Length is invalid");
    }
    declared = Number(declaredValue);
    if (!Number.isSafeInteger(declared)) {
      await response.body?.cancel().catch(() => undefined);
      throw new CliSafetyError("download Content-Length is invalid");
    }
    if (declared > limit) {
      await response.body?.cancel().catch(() => undefined);
      throw new CliSafetyError("download exceeds the safe size limit");
    }
  }
  if (response.body === null) {
    if (declared !== undefined && declared !== 0) {
      throw new CliSafetyError("download Content-Length is invalid");
    }
    return Buffer.alloc(0);
  }

  const reader = response.body.getReader();
  let capacity = Math.max(1, Math.min(declared ?? 8192, limit));
  let output = Buffer.allocUnsafe(capacity);
  let length = 0;
  let cancelled = false;
  try {
    while (true) {
      if (signal.aborted) throw new CliSafetyError("download was cancelled");
      const part = await reader.read();
      if (part.done) break;
      const nextLength = length + part.value.byteLength;
      if (nextLength > limit) {
        cancelled = true;
        await reader.cancel().catch(() => undefined);
        throw new CliSafetyError("download exceeds the safe size limit");
      }
      if (nextLength > capacity) {
        let nextCapacity = capacity;
        while (nextCapacity < nextLength) nextCapacity = Math.min(limit, nextCapacity * 2);
        const grown = Buffer.allocUnsafe(nextCapacity);
        output.copy(grown, 0, 0, length);
        output = grown;
        capacity = nextCapacity;
      }
      output.set(part.value, length);
      length = nextLength;
    }
    if (declared !== undefined && declared !== length) {
      throw new CliSafetyError("download Content-Length is invalid");
    }
    return output.subarray(0, length);
  } finally {
    if (signal.aborted && !cancelled) await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

function sameFile(
  first: { dev: number; ino: number; size: number; ctimeMs: number },
  second: { dev: number; ino: number; size: number; ctimeMs: number },
): boolean {
  return first.dev === second.dev && first.ino === second.ino &&
    first.size === second.size && first.ctimeMs === second.ctimeMs;
}

async function readRegularFile(path: string, limit: number, unsafeMessage: string): Promise<Buffer> {
  let handle;
  try {
    const pathInfo = await lstat(path);
    if (pathInfo.isSymbolicLink() || !pathInfo.isFile() || pathInfo.size > limit) {
      throw new CliSafetyError(unsafeMessage);
    }
    handle = await open(path, fsConstants.O_RDONLY | NO_FOLLOW);
    const before = await handle.stat();
    if (!before.isFile() || !sameFile(pathInfo, before) || before.size > limit) {
      throw new CliSafetyError(unsafeMessage);
    }
    const bytes = Buffer.allocUnsafe(before.size);
    let offset = 0;
    while (offset < bytes.length) {
      const result = await handle.read(bytes, offset, bytes.length - offset, offset);
      if (result.bytesRead === 0) throw new CliSafetyError(unsafeMessage);
      offset += result.bytesRead;
    }
    const extra = Buffer.allocUnsafe(1);
    if ((await handle.read(extra, 0, 1, offset)).bytesRead !== 0) {
      throw new CliSafetyError(unsafeMessage);
    }
    const after = await handle.stat();
    if (!sameFile(before, after)) throw new CliSafetyError(unsafeMessage);
    return bytes;
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError(unsafeMessage);
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

async function hashRegularFile(
  path: string,
  limit: number,
  unsafeMessage: string,
): Promise<{ digest: Buffer; bytes: number; prefix: string }> {
  let handle;
  try {
    const pathInfo = await lstat(path);
    if (pathInfo.isSymbolicLink() || !pathInfo.isFile() || pathInfo.size > limit) {
      throw new CliSafetyError(unsafeMessage);
    }
    handle = await open(path, fsConstants.O_RDONLY | NO_FOLLOW);
    const before = await handle.stat();
    if (!before.isFile() || !sameFile(pathInfo, before) || before.size > limit) {
      throw new CliSafetyError(unsafeMessage);
    }
    const hash = createHash("sha512");
    const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, Math.max(1, before.size)));
    const prefixChunks: Buffer[] = [];
    let prefixBytes = 0;
    let offset = 0;
    while (offset < before.size) {
      const result = await handle.read(buffer, 0, Math.min(buffer.length, before.size - offset), offset);
      if (result.bytesRead === 0) throw new CliSafetyError(unsafeMessage);
      const chunk = buffer.subarray(0, result.bytesRead);
      hash.update(chunk);
      if (prefixBytes < 128) {
        const take = Math.min(128 - prefixBytes, chunk.length);
        prefixChunks.push(Buffer.from(chunk.subarray(0, take)));
        prefixBytes += take;
      }
      offset += result.bytesRead;
    }
    const extra = Buffer.allocUnsafe(1);
    if ((await handle.read(extra, 0, 1, offset)).bytesRead !== 0) {
      throw new CliSafetyError(unsafeMessage);
    }
    const after = await handle.stat();
    if (!sameFile(before, after)) throw new CliSafetyError(unsafeMessage);
    return {
      digest: hash.digest(),
      bytes: before.size,
      prefix: Buffer.concat(prefixChunks).toString("utf8"),
    };
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError(unsafeMessage);
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

function tarOctal(buffer: Buffer, offset: number, length: number, value: number): void {
  const encoded = value.toString(8);
  if (encoded.length > length - 1) throw new CliSafetyError("source archive value is unsafe");
  buffer.write(`${encoded.padStart(length - 1, "0")}\0`, offset, length, "ascii");
}

function tarPath(path: string): { name: string; prefix: string } {
  if (Buffer.byteLength(path) <= 100) return { name: path, prefix: "" };
  for (let separator = path.lastIndexOf("/"); separator > 0; separator = path.lastIndexOf("/", separator - 1)) {
    const prefix = path.slice(0, separator);
    const name = path.slice(separator + 1);
    if (Buffer.byteLength(prefix) <= 155 && Buffer.byteLength(name) <= 100) {
      return { name, prefix };
    }
  }
  throw new CliSafetyError("source archive path exceeds the safe limit");
}

function tarHeader(path: string, size: number, mode: number, type: "file" | "directory"): Buffer {
  const header = Buffer.alloc(512);
  const split = tarPath(path);
  header.write(split.name, 0, 100, "utf8");
  tarOctal(header, 100, 8, mode);
  tarOctal(header, 108, 8, 0);
  tarOctal(header, 116, 8, 0);
  tarOctal(header, 124, 12, size);
  tarOctal(header, 136, 12, 0);
  header.fill(0x20, 148, 156);
  header.write(type === "directory" ? "5" : "0", 156, 1, "ascii");
  header.write("ustar\0", 257, 6, "ascii");
  header.write("00", 263, 2, "ascii");
  header.write(split.prefix, 345, 155, "utf8");
  let checksum = 0;
  for (const byte of header) checksum += byte;
  header.write(`${checksum.toString(8).padStart(6, "0")}\0 `, 148, 8, "ascii");
  return header;
}

async function copyVerifiedNpmArtifact(
  source: string,
  destination: string,
  limit: number,
  expectedDigest: Buffer,
  expectedBytes: number,
): Promise<{ digest: Buffer; bytes: number }> {
  let sourceHandle;
  let destinationHandle;
  try {
    const sourcePathInfo = await lstat(source);
    if (sourcePathInfo.isSymbolicLink() || !sourcePathInfo.isFile() || sourcePathInfo.size > limit) {
      throw new CliSafetyError("verified cache changed before private materialization");
    }
    sourceHandle = await open(source, fsConstants.O_RDONLY | NO_FOLLOW);
    const sourceBefore = await sourceHandle.stat();
    if (!sameFile(sourcePathInfo, sourceBefore) || sourceBefore.size !== expectedBytes) {
      throw new CliSafetyError("verified cache changed before private materialization");
    }
    destinationHandle = await open(
      destination,
      fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_EXCL | NO_FOLLOW,
      0o400,
    );
    const hash = createHash("sha512");
    const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, Math.max(1, sourceBefore.size)));
    let position = 0;
    while (position < sourceBefore.size) {
      const read = await sourceHandle.read(
        buffer,
        0,
        Math.min(buffer.length, sourceBefore.size - position),
        position,
      );
      if (read.bytesRead === 0) {
        throw new CliSafetyError("verified cache changed before private materialization");
      }
      const chunk = buffer.subarray(0, read.bytesRead);
      hash.update(chunk);
      let written = 0;
      while (written < chunk.length) {
        const result = await destinationHandle.write(
          chunk,
          written,
          chunk.length - written,
          position + written,
        );
        if (result.bytesWritten === 0) {
          throw new CliSafetyError("private artifact materialization failed");
        }
        written += result.bytesWritten;
      }
      position += read.bytesRead;
    }
    const extra = Buffer.allocUnsafe(1);
    if ((await sourceHandle.read(extra, 0, 1, position)).bytesRead !== 0) {
      throw new CliSafetyError("verified cache changed before private materialization");
    }
    const sourceAfter = await sourceHandle.stat();
    if (!sameFile(sourceBefore, sourceAfter)) {
      throw new CliSafetyError("verified cache changed before private materialization");
    }
    await destinationHandle.sync();
    const actualDigest = hash.digest();
    if (actualDigest.length !== expectedDigest.length || !timingSafeEqual(actualDigest, expectedDigest)) {
      throw new CliSafetyError("verified cache changed before private materialization");
    }
    return { digest: actualDigest, bytes: position };
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("private artifact materialization failed");
  } finally {
    await destinationHandle?.close().catch(() => undefined);
    await sourceHandle?.close().catch(() => undefined);
  }
}

async function createDeterministicSourceArchive(
  sourceRoot: string,
  pluginRoot: string,
  destination: string,
  budgets: StageBudgets,
  expectedTree: TreeMeasurement,
): Promise<{ digest: Buffer; bytes: number }> {
  const before = await inspectSourceTree(sourceRoot, budgets);
  if (
    before.digest !== expectedTree.digest ||
    before.bytes !== expectedTree.bytes ||
    before.files !== expectedTree.files
  ) {
    throw new CliSafetyError("verified source cache changed before private materialization");
  }
  const gzip = createGzip({ level: 9 });
  const output = createWriteStream(destination, { flags: "wx", mode: 0o400 });
  const completion = pipeline(gzip, output);
  const emit = async (chunk: Buffer): Promise<void> => {
    if (!gzip.write(chunk)) await once(gzip, "drain");
  };
  let archivedBytes = 0;
  try {
    await emit(tarHeader("package/", 0, 0o755, "directory"));
    const visit = async (directory: string, relativeDirectory: string): Promise<void> => {
      const entries = await readdir(directory, { withFileTypes: true });
      entries.sort((left, right) => Buffer.from(left.name).compare(Buffer.from(right.name)));
      for (const entry of entries) {
        const candidate = join(directory, entry.name);
        const relativePath = relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;
        const archivePath = `package/${relativePath}`;
        const info = await lstat(candidate);
        if (info.isSymbolicLink()) {
          throw new CliSafetyError("source archive contains a symlink");
        }
        if (info.isDirectory()) {
          await emit(tarHeader(`${archivePath}/`, 0, 0o755, "directory"));
          await visit(candidate, relativePath);
          continue;
        }
        if (!info.isFile()) throw new CliSafetyError("source archive contains an unsafe file type");
        const bytes = await readRegularFile(
          candidate,
          budgets.sourceBytes,
          "source changed during private archive materialization",
        );
        if (bytes.subarray(0, 128).toString("utf8").startsWith(LFS_POINTER)) {
          throw new CliSafetyError("source tree contains Git LFS content");
        }
        archivedBytes += bytes.length;
        if (archivedBytes > budgets.sourceBytes) {
          throw new CliSafetyError("source archive exceeds the byte limit");
        }
        const mode = (info.mode & 0o111) === 0 ? 0o644 : 0o755;
        await emit(tarHeader(archivePath, bytes.length, mode, "file"));
        await emit(bytes);
        const padding = (512 - (bytes.length % 512)) % 512;
        if (padding !== 0) await emit(Buffer.alloc(padding));
      }
    };
    await visit(pluginRoot, "");
    await emit(Buffer.alloc(1024));
    gzip.end();
    await completion;
  } catch (error) {
    gzip.destroy();
    output.destroy();
    await completion.catch(() => undefined);
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("private source archive materialization failed");
  }
  const after = await inspectSourceTree(sourceRoot, budgets);
  if (
    after.digest !== expectedTree.digest ||
    after.bytes !== expectedTree.bytes ||
    after.files !== expectedTree.files
  ) {
    throw new CliSafetyError("verified source cache changed during private materialization");
  }
  const artifact = await hashRegularFile(
    destination,
    budgets.tarballBytes,
    "private source archive is unsafe",
  );
  return { digest: artifact.digest, bytes: artifact.bytes };
}

async function createArtifactLease(
  cached: VerifiedCachedInstall,
  home: string,
  budgets: StageBudgets,
): Promise<StagedCatalogInstall> {
  const leasesRoot = await ensureContainedDirectory(home, ".dsh-plugins", "artifact-leases");
  const leaseRoot = await mkdtemp(join(leasesRoot, ".lease-"));
  const destination = join(leaseRoot, "artifact.tgz");
  let heldFd: number | undefined;
  try {
    const cache = cached[VERIFIED_CACHE];
    const materialized = cache.kind === "npm"
      ? await copyVerifiedNpmArtifact(
          cache.path,
          destination,
          budgets.tarballBytes,
          cache.expectedDigest,
          cache.bytes,
        )
      : await createDeterministicSourceArchive(
          cache.sourceRoot,
          cache.pluginRoot,
          destination,
          budgets,
          cache.tree,
        );
    const copied = await hashRegularFile(
      destination,
      budgets.tarballBytes,
      "private transaction artifact is unsafe",
    );
    if (
      copied.bytes !== materialized.bytes ||
      copied.digest.length !== materialized.digest.length ||
      !timingSafeEqual(copied.digest, materialized.digest)
    ) {
      throw new CliSafetyError("private artifact verification failed");
    }
    heldFd = openSync(destination, fsConstants.O_RDONLY | NO_FOLLOW);
    const heldInfo = fstatSync(heldFd);
    const pathInfo = await lstat(destination);
    if (!heldInfo.isFile() || !sameFile(pathInfo, heldInfo)) {
      throw new CliSafetyError("private artifact verification failed");
    }
    let released = false;
    const recoveryRelativePath = relative(home, destination).split(sep).join("/");
    const artifactLease: StagedArtifactLease = {
      recoveryReference: {
        relativePath: recoveryRelativePath,
        sha512: `sha512-${materialized.digest.toString("base64")}`,
        bytes: materialized.bytes,
        packageName: cached.packageName,
      },
      revalidate: async () => {
        if (released) throw new CliSafetyError("transaction artifact changed; recovery required");
        try {
          const currentPath = await lstat(destination);
          const currentHandle = heldFd === undefined ? undefined : fstatSync(heldFd);
          if (
            currentHandle === undefined ||
            currentPath.isSymbolicLink() ||
            !currentPath.isFile() ||
            !sameFile(currentPath, currentHandle) ||
            !sameFile(heldInfo, currentHandle)
          ) {
            throw new CliSafetyError("transaction artifact changed; recovery required");
          }
          const current = await hashRegularFile(
            destination,
            budgets.tarballBytes,
            "transaction artifact changed; recovery required",
          );
          if (
            current.bytes !== materialized.bytes ||
            current.digest.length !== materialized.digest.length ||
            !timingSafeEqual(current.digest, materialized.digest)
          ) {
            throw new CliSafetyError("transaction artifact changed; recovery required");
          }
        } catch (error) {
          if (error instanceof CliSafetyError) throw error;
          throw new CliSafetyError("transaction artifact changed; recovery required");
        }
      },
      readVerifiedBytes: async () => {
        if (released || heldFd === undefined) {
          throw new CliSafetyError("transaction artifact changed; recovery required");
        }
        try {
          const before = fstatSync(heldFd);
          if (!before.isFile() || !sameFile(heldInfo, before) || before.size !== materialized.bytes) {
            throw new CliSafetyError("transaction artifact changed; recovery required");
          }
          const bytes = Buffer.alloc(materialized.bytes);
          let offset = 0;
          while (offset < bytes.byteLength) {
            const count = readSync(heldFd, bytes, offset, bytes.byteLength - offset, offset);
            if (count === 0) break;
            offset += count;
          }
          const after = fstatSync(heldFd);
          const digest = createHash("sha512").update(bytes).digest();
          if (
            offset !== materialized.bytes || !sameFile(heldInfo, after) ||
            digest.length !== materialized.digest.length ||
            !timingSafeEqual(digest, materialized.digest)
          ) {
            throw new CliSafetyError("transaction artifact changed; recovery required");
          }
          return bytes;
        } catch (error) {
          if (error instanceof CliSafetyError) throw error;
          throw new CliSafetyError("transaction artifact changed; recovery required");
        }
      },
      release: async () => {
        if (released) return;
        released = true;
        if (heldFd !== undefined) {
          try {
            closeSync(heldFd);
          } catch {
            // A concurrent recovery may already have closed the descriptor.
          }
        }
        heldFd = undefined;
        await rm(leaseRoot, { recursive: true, force: true });
      },
    };
    return {
      fingerprint: cached.fingerprint,
      installTarget: destination,
      displayTarget: "$DSH_HOME/.dsh-plugins/artifact-leases/<private>/artifact.tgz",
      packageName: cached.packageName,
      cacheRelativePath: cached.cacheRelativePath,
      artifactLease,
    };
  } catch (error) {
    if (heldFd !== undefined) {
      try {
        closeSync(heldFd);
      } catch {
        // Preserve the primary materialization error.
      }
    }
    await rm(leaseRoot, { recursive: true, force: true }).catch(() => undefined);
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("private artifact materialization failed");
  }
}

function assertTreeBudget(
  bytes: number,
  files: number,
  depth: number,
  budgets: Pick<StageBudgets, "sourceBytes" | "sourceFiles" | "sourceDepth">,
): void {
  if (bytes > budgets.sourceBytes) throw new CliSafetyError("source tree exceeds the byte limit");
  if (files > budgets.sourceFiles) throw new CliSafetyError("source tree exceeds the file limit");
  if (depth > budgets.sourceDepth) throw new CliSafetyError("source tree exceeds the depth limit");
}

async function inspectSourceTree(
  root: string,
  budgets: Pick<StageBudgets, "sourceBytes" | "sourceFiles" | "sourceDepth">,
): Promise<TreeMeasurement> {
  const hash = createHash("sha512");
  hash.update("dsh-source-tree-v1\0");
  let bytes = 0;
  let files = 0;

  const visit = async (directory: string, depth: number): Promise<void> => {
    assertTreeBudget(bytes, files, depth, budgets);
    const before = await lstat(directory);
    if (before.isSymbolicLink() || !before.isDirectory()) {
      throw new CliSafetyError("source tree changed during verification");
    }
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => Buffer.from(left.name).compare(Buffer.from(right.name)));
    for (const entry of entries) {
      const candidate = join(directory, entry.name);
      const relativePath = relative(root, candidate).split(sep).join("/");
      const candidateDepth = relativePath.split("/").length;
      assertTreeBudget(bytes, files, candidateDepth, budgets);
      if (entry.name === ".gitmodules") {
        throw new CliSafetyError("source tree contains submodules");
      }
      const info = await lstat(candidate);
      if (info.isSymbolicLink()) {
        files += 1;
        const target = await readlink(candidate);
        const resolvedTarget = resolve(dirname(candidate), target);
        if (!isPathWithin(root, resolvedTarget)) {
          throw new CliSafetyError("source tree contains a symlink escape");
        }
        try {
          const canonical = await realpath(candidate);
          if (!isPathWithin(root, canonical)) {
            throw new CliSafetyError("source tree contains a symlink escape");
          }
        } catch (error) {
          if (error instanceof CliSafetyError) throw error;
          throw new CliSafetyError("source tree contains a symlink escape");
        }
        const after = await lstat(candidate);
        if (!sameFile(info, after)) throw new CliSafetyError("source tree changed during verification");
        bytes += Buffer.byteLength(target);
        assertTreeBudget(bytes, files, candidateDepth, budgets);
        hash.update(`L\0${relativePath}\0${target}\0`);
      } else if (info.isDirectory()) {
        hash.update(`D\0${relativePath}\0`);
        await visit(candidate, depth + 1);
      } else if (info.isFile()) {
        files += 1;
        const remaining = Math.max(0, budgets.sourceBytes - bytes);
        const file = await hashRegularFile(candidate, remaining, "source tree changed during verification");
        if (file.prefix.startsWith(LFS_POINTER)) {
          throw new CliSafetyError("source tree contains Git LFS content");
        }
        bytes += file.bytes;
        assertTreeBudget(bytes, files, candidateDepth, budgets);
        hash.update(`F\0${relativePath}\0${file.bytes}\0`);
        hash.update(file.digest);
      } else {
        throw new CliSafetyError("source tree contains an unsafe file type");
      }
    }
    const after = await lstat(directory);
    if (!sameFile(before, after)) throw new CliSafetyError("source tree changed during verification");
  };

  await visit(root, 0);
  return { bytes, files, digest: `sha512-${hash.digest("base64")}` };
}

async function measureCheckout(
  root: string,
  budgets: Pick<StageBudgets, "sourceBytes" | "sourceFiles" | "sourceDepth">,
): Promise<void> {
  let bytes = 0;
  let files = 0;
  const visit = async (directory: string, depth: number): Promise<void> => {
    assertTreeBudget(bytes, files, depth, budgets);
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const candidate = join(directory, entry.name);
      const candidateDepth = depth + 1;
      const info = await lstat(candidate);
      if (info.isDirectory() && !info.isSymbolicLink()) {
        await visit(candidate, candidateDepth);
      } else {
        files += 1;
        bytes += info.size;
        assertTreeBudget(bytes, files, candidateDepth, budgets);
      }
    }
  };
  await visit(root, 0);
}

async function defaultProcessRunner(
  request: ProcessRequest,
  dependencies: ChildSupervisorDependencies = {},
): Promise<string> {
  const controller = new AbortController();
  let resourceFailure: CliSafetyError | undefined;
  let measuring = false;
  const onAbort = (): void => controller.abort();
  request.signal?.addEventListener("abort", onAbort, { once: true });
  if (request.signal?.aborted === true) controller.abort();
  const monitor = request.resourceBudget === undefined
    ? undefined
    : setInterval(() => {
        if (measuring) return;
        measuring = true;
        void measureCheckout(
          request.cwd,
          request.resourceBudget as NonNullable<ProcessRequest["resourceBudget"]>,
        )
          .catch((error: unknown) => {
            resourceFailure = error instanceof CliSafetyError
              ? error
              : new CliSafetyError("source tree exceeds the byte limit");
            controller.abort();
          })
          .finally(() => { measuring = false; });
      }, 25);
  monitor?.unref?.();
  try {
    const result = await runSupervisedChild({
      command: "git",
      args: request.args,
      cwd: request.cwd,
      env: {
        PATH: process.env.PATH,
        SystemRoot: process.env.SystemRoot,
        WINDIR: process.env.WINDIR,
        GIT_TERMINAL_PROMPT: "0",
        GIT_CONFIG_GLOBAL: devNull,
        GIT_CONFIG_SYSTEM: devNull,
        GIT_LFS_SKIP_SMUDGE: "1",
      },
      timeoutMs: request.timeoutMs ?? DEFAULT_STAGE_BUDGETS.gitTimeoutMs,
      termGraceMs: request.killGraceMs ?? DEFAULT_STAGE_BUDGETS.killGraceMs,
      reapTimeoutMs: request.reapTimeoutMs ?? DEFAULT_STAGE_BUDGETS.gitReapTimeoutMs,
      maxOutputBytes: request.outputBytes ?? DEFAULT_STAGE_BUDGETS.processOutputBytes,
      processGroup: process.platform !== "win32",
      signal: controller.signal,
    }, dependencies);
    if (!result.reaped) throw new GitProcessUnreapedError();
    if (resourceFailure !== undefined) throw resourceFailure;
    if (result.reason === "spawn-error") {
      throw new CliSafetyError("git executable was not found");
    }
    if (result.reason === "timeout" || result.reason === "aborted") {
      throw new CliSafetyError("git operation timed out");
    }
    if (result.reason === "output-limit") {
      throw new CliSafetyError("git output exceeds the safe size limit");
    }
    if (result.exitCode !== 0) throw new CliSafetyError("pinned source checkout failed");
    return result.stdout.toString("utf8");
  } finally {
    if (monitor !== undefined) clearInterval(monitor);
    request.signal?.removeEventListener("abort", onAbort);
  }
}

async function runGit(
  runner: ProcessRunner,
  request: Omit<ProcessRequest, "signal" | "outputBytes" | "killGraceMs" | "resourceBudget">,
  budgets: StageBudgets,
  parentSignal: AbortSignal | undefined,
): Promise<string> {
  if (parentSignal?.aborted === true) throw new CliSafetyError("staging was cancelled");
  const output = await runner({
    ...request,
    ...(parentSignal === undefined ? {} : { signal: parentSignal }),
    outputBytes: budgets.processOutputBytes,
    killGraceMs: budgets.killGraceMs,
    timeoutMs: budgets.gitTimeoutMs,
    reapTimeoutMs: budgets.gitReapTimeoutMs,
    resourceBudget: budgets,
  });
  if (Buffer.byteLength(output) > budgets.processOutputBytes) {
    throw new CliSafetyError("git output exceeds the safe size limit");
  }
  await measureCheckout(request.cwd, budgets);
  return output;
}

function safeSourceSubpath(subpath: string | null): string {
  if (subpath === null) return ".";
  if (!SOURCE_SUBPATH.test(subpath)) throw new CliSafetyError("source subpath is unsafe");
  return subpath;
}

function verifyTreeListing(output: string, budgets: StageBudgets): void {
  let bytes = 0;
  let files = 0;
  for (const line of output.split("\n")) {
    if (line === "") continue;
    const tab = line.indexOf("\t");
    if (tab < 0) throw new CliSafetyError("pinned source tree listing is invalid");
    const [mode, type, _object, size] = line.slice(0, tab).split(/\s+/u);
    const path = line.slice(tab + 1);
    if (mode === "160000" || type === "commit") {
      throw new CliSafetyError("source tree contains submodules");
    }
    if (type !== "blob" || !/^[0-9]+$/u.test(size ?? "")) {
      throw new CliSafetyError("pinned source tree listing is invalid");
    }
    files += 1;
    bytes += Number(size);
    assertTreeBudget(bytes, files, path.split("/").length, budgets);
  }
}

async function stageNpm(
  entry: PublicCatalogEntry & { package: Extract<PublicCatalogEntry["package"], { ecosystem: "npm" }> },
  temporary: string,
  fetchImpl: typeof fetch,
  budgets: StageBudgets,
  signal: AbortSignal | undefined,
): Promise<StagedMetadata> {
  parseExactSemver(entry.package.version);
  if (entry.package.integrity === undefined) {
    throw new CliSafetyError("npm entry has no SHA-512 integrity pin");
  }
  const expected = Buffer.from(parseSha512Integrity(entry.package.integrity));
  const metadataUrl = `https://registry.npmjs.org/${encodeURIComponent(entry.package.name)}`;
  const metadataBytes = await boundedOperation(
    budgets.fetchTimeoutMs,
    budgets.killGraceMs,
    signal,
    "download timed out",
    async (requestSignal) => responseBytes(
      await fetchAllowlisted(metadataUrl, ["registry.npmjs.org"], fetchImpl, requestSignal),
      budgets.metadataBytes,
      requestSignal,
    ),
  );
  let metadata: unknown;
  try {
    metadata = JSON.parse(metadataBytes.toString("utf8")) as unknown;
  } catch {
    throw new CliSafetyError("npm registry metadata is invalid");
  }
  const version = (metadata as { versions?: Record<string, { dist?: { integrity?: unknown; tarball?: unknown } }> })
    .versions?.[entry.package.version];
  const registryIntegrity = version?.dist?.integrity;
  const tarball = version?.dist?.tarball;
  if (typeof registryIntegrity !== "string" || typeof tarball !== "string") {
    throw new CliSafetyError("pinned npm version is unavailable");
  }
  let registryDigest: Buffer;
  try {
    registryDigest = Buffer.from(parseSha512Integrity(registryIntegrity));
  } catch {
    throw new CliSafetyError("registry integrity is invalid");
  }
  if (registryDigest.length !== expected.length || !timingSafeEqual(registryDigest, expected)) {
    throw new CliSafetyError("catalog and registry checksums disagree");
  }
  const bytes = await boundedOperation(
    budgets.fetchTimeoutMs,
    budgets.killGraceMs,
    signal,
    "download timed out",
    async (requestSignal) => responseBytes(
      await fetchAllowlisted(tarball, ["registry.npmjs.org"], fetchImpl, requestSignal),
      budgets.tarballBytes,
      requestSignal,
    ),
  );
  const actual = createHash("sha512").update(bytes).digest();
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new CliSafetyError("checksum verification failed");
  }
  const artifact = "artifact.tgz";
  await writeFile(join(temporary, artifact), bytes, { mode: 0o600, flag: "wx" });
  return {
    packageName: entry.package.name,
    installRelativePath: artifact,
    artifact: { kind: "npm", integrity: entry.package.integrity, bytes: bytes.length },
  };
}

async function stageSource(
  entry: PublicCatalogEntry,
  temporary: string,
  runProcess: ProcessRunner,
  budgets: StageBudgets,
  signal: AbortSignal | undefined,
): Promise<StagedMetadata> {
  if (!SOURCE_REPOSITORY.test(entry.source.repository)) {
    throw new CliSafetyError("source repository is not allowlisted");
  }
  if (!SHA40.test(entry.source.commit)) throw new CliSafetyError("source commit pin is invalid");
  const subpath = safeSourceSubpath(entry.source.subpath);
  const source = join(temporary, "source");
  await mkdir(source, { mode: 0o700 });
  await runGit(runProcess, { args: ["init", "--quiet"], cwd: source }, budgets, signal);
  await runGit(
    runProcess,
    { args: ["remote", "add", "origin", entry.source.repository], cwd: source },
    budgets,
    signal,
  );
  await runGit(runProcess, {
    args: [
      "-c",
      "credential.helper=",
      "-c",
      "submodule.recurse=false",
      "fetch",
      "--quiet",
      "--depth",
      "1",
      "--filter=blob:none",
      "--no-tags",
      "--no-recurse-submodules",
      "origin",
      entry.source.commit,
    ],
    cwd: source,
  }, budgets, signal);
  const listing = await runGit(
    runProcess,
    { args: ["ls-tree", "-r", "-l", "--full-tree", "FETCH_HEAD"], cwd: source },
    budgets,
    signal,
  );
  verifyTreeListing(listing, budgets);
  await runGit(runProcess, {
    args: ["-c", "submodule.recurse=false", "checkout", "--quiet", "--detach", "--force", "FETCH_HEAD"],
    cwd: source,
  }, budgets, signal);
  const checkedCommit = (await runGit(
    runProcess,
    { args: ["rev-parse", "HEAD"], cwd: source },
    budgets,
    signal,
  )).trim();
  if (checkedCommit.toLowerCase() !== entry.source.commit.toLowerCase()) {
    throw new CliSafetyError("source checkout does not match the commit pin");
  }
  await rm(join(source, ".git"), { recursive: true, force: true });
  const tree = await inspectSourceTree(source, budgets);
  const pluginRoot = resolve(source, subpath);
  const expectedRelativePath = subpath === "." ? "source" : `source/${subpath}`;
  if (!isPathWithin(source, pluginRoot)) throw new CliSafetyError("source subpath is unsafe");
  let canonicalPluginRoot: string;
  try {
    canonicalPluginRoot = await realpath(pluginRoot);
    const info = await lstat(canonicalPluginRoot);
    if (!info.isDirectory() || !isPathWithin(source, canonicalPluginRoot)) {
      throw new CliSafetyError("source subpath is unsafe");
    }
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("source subpath is unavailable");
  }
  const installRelativePath = relative(temporary, canonicalPluginRoot).split(sep).join("/");
  if (installRelativePath !== expectedRelativePath) {
    throw new CliSafetyError("source subpath is unsafe");
  }
  let packageName: unknown;
  try {
    packageName = (JSON.parse((await readRegularFile(
      join(canonicalPluginRoot, "package.json"),
      budgets.metadataBytes,
      "source package manifest is unsafe",
    )).toString("utf8")) as { name?: unknown }).name;
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("source package manifest is invalid");
  }
  if (typeof packageName !== "string" || !PACKAGE_NAME.test(packageName)) {
    throw new CliSafetyError("source package name is invalid");
  }
  return {
    packageName,
    installRelativePath,
    artifact: {
      kind: "source",
      commit: entry.source.commit.toLowerCase(),
      treeSha512: tree.digest,
      bytes: tree.bytes,
      files: tree.files,
    },
  };
}

async function readCached(
  finalRoot: string,
  id: string,
  hash: string,
  entry: PublicCatalogEntry,
  budgets: StageBudgets,
): Promise<VerifiedCachedInstall> {
  try {
    const rootInfo = await lstat(finalRoot);
    if (rootInfo.isSymbolicLink() || !rootInfo.isDirectory()) {
      throw new CliSafetyError("staging cache path is unsafe");
    }
    const canonicalRoot = await realpath(finalRoot);
    if (canonicalRoot !== resolve(finalRoot) || basename(canonicalRoot) !== hash ||
        basename(dirname(canonicalRoot)) !== id) {
      throw new CliSafetyError("staging cache key is invalid");
    }
    const metadata = JSON.parse((await readRegularFile(
      join(canonicalRoot, "metadata.json"),
      budgets.metadataBytes,
      "staging cache metadata is unsafe",
    )).toString("utf8")) as CacheMetadata;
    const fingerprint = `sha256:${hash}`;
    if (
      metadata.version !== 2 ||
      metadata.fingerprint !== fingerprint ||
      metadata.descriptorHash !== hash ||
      typeof metadata.packageName !== "string" ||
      !PACKAGE_NAME.test(metadata.packageName) ||
      typeof metadata.installRelativePath !== "string"
    ) {
      throw new CliSafetyError("staging cache metadata is invalid");
    }
    const targetPath = resolve(canonicalRoot, metadata.installRelativePath);
    if (!isPathWithin(canonicalRoot, targetPath)) throw new CliSafetyError("staging cache target is unsafe");

    let installTarget: string;
    let verifiedCache: NpmVerifiedCache | SourceVerifiedCache;
    if (entry.package.ecosystem === "npm") {
      if (
        metadata.artifact.kind !== "npm" ||
        metadata.packageName !== entry.package.name ||
        metadata.installRelativePath !== "artifact.tgz" ||
        metadata.artifact.integrity !== entry.package.integrity ||
        !Number.isSafeInteger(metadata.artifact.bytes) ||
        metadata.artifact.bytes < 0
      ) {
        throw new CliSafetyError("staging cache metadata is invalid");
      }
      if (entry.package.integrity === undefined) {
        throw new CliSafetyError("npm entry has no SHA-512 integrity pin");
      }
      const expected = Buffer.from(parseSha512Integrity(entry.package.integrity));
      const actual = await hashRegularFile(
        targetPath,
        budgets.tarballBytes,
        "staging cache artifact is unsafe",
      );
      if (actual.bytes !== metadata.artifact.bytes || actual.digest.length !== expected.length ||
          !timingSafeEqual(actual.digest, expected)) {
        throw new CliSafetyError("staging cache checksum verification failed");
      }
      installTarget = targetPath;
      verifiedCache = {
        kind: "npm",
        path: targetPath,
        expectedDigest: expected,
        bytes: actual.bytes,
      };
    } else {
      const subpath = safeSourceSubpath(entry.source.subpath);
      const expectedRelativePath = subpath === "." ? "source" : `source/${subpath}`;
      if (
        metadata.artifact.kind !== "source" ||
        metadata.artifact.commit !== entry.source.commit.toLowerCase() ||
        metadata.installRelativePath !== expectedRelativePath
      ) {
        throw new CliSafetyError("staging cache metadata is invalid");
      }
      const sourceRoot = join(canonicalRoot, "source");
      const tree = await inspectSourceTree(sourceRoot, budgets);
      if (
        tree.digest !== metadata.artifact.treeSha512 ||
        tree.bytes !== metadata.artifact.bytes ||
        tree.files !== metadata.artifact.files
      ) {
        throw new CliSafetyError("staging cache tree verification failed");
      }
      const canonicalTarget = await realpath(targetPath);
      if (!isPathWithin(sourceRoot, canonicalTarget)) {
        throw new CliSafetyError("staging cache target is unsafe");
      }
      const packageInfo = JSON.parse((await readRegularFile(
        join(canonicalTarget, "package.json"),
        budgets.metadataBytes,
        "staging cache package manifest is unsafe",
      )).toString("utf8")) as { name?: unknown };
      if (packageInfo.name !== metadata.packageName) {
        throw new CliSafetyError("staging cache package identity is invalid");
      }
      installTarget = `file:${canonicalTarget}`;
      verifiedCache = {
        kind: "source",
        sourceRoot,
        pluginRoot: canonicalTarget,
        tree,
      };
    }
    const cacheRelativePath = `${id}/${hash}/${metadata.installRelativePath}`;
    const result: StagedInstall = {
      fingerprint: `sha256:${hash}`,
      installTarget,
      displayTarget: `$DSH_HOME/.dsh-plugins/cache/${cacheRelativePath}`,
      packageName: metadata.packageName,
      cacheRelativePath,
    };
    Object.defineProperty(result, VERIFIED_CACHE, {
      configurable: false,
      enumerable: false,
      value: verifiedCache,
      writable: false,
    });
    return result as VerifiedCachedInstall;
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("staging cache is invalid");
  }
}

async function quarantineCache(finalRoot: string, idRoot: string, hash: string): Promise<void> {
  const quarantine = join(idRoot, `.quarantine-${hash}-${randomUUID()}`);
  try {
    await rename(finalRoot, quarantine);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw new CliSafetyError("staging cache quarantine failed");
  }
  await rm(quarantine, { recursive: true, force: true }).catch(() => undefined);
}

export async function stageCatalogEntry(
  entry: PublicCatalogEntry,
  options: StageOptions,
): Promise<StagedCatalogInstall> {
  const id = canonicalPublicId(entry.id);
  const hash = descriptorHash(entry);
  const fingerprint = `sha256:${hash}`;
  const budgets = stageBudgets(options.budgets);
  const home = await ensureCanonicalHome(options.dshHome);
  const idRoot = await ensureContainedDirectory(home, ".dsh-plugins", "cache", id);
  const finalRoot = join(idRoot, hash);
  try {
    await lstat(finalRoot);
    try {
      return await createArtifactLease(
        await readCached(finalRoot, id, hash, entry, budgets),
        home,
        budgets,
      );
    } catch {
      if (options.offline === true) {
        throw new CliSafetyError("cached artifact failed verification while offline");
      }
      await quarantineCache(finalRoot, idRoot, hash);
    }
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (options.offline === true) {
    throw new CliSafetyError("pinned artifact is not cached and offline mode forbids retrieval");
  }

  const temporary = await mkdtemp(join(idRoot, ".stage-"));
  try {
    const staged = entry.package.ecosystem === "npm"
      ? await stageNpm(
          entry as PublicCatalogEntry & {
            package: Extract<PublicCatalogEntry["package"], { ecosystem: "npm" }>;
          },
          temporary,
          options.fetchImpl ?? fetch,
          budgets,
          options.signal,
        )
      : await stageSource(
          entry,
          temporary,
          options.runProcess ?? ((request) => defaultProcessRunner(request, options.childSupervisor)),
          budgets,
          options.signal,
        );
    const metadata: CacheMetadata = {
      version: 2,
      fingerprint,
      descriptorHash: hash,
      ...staged,
    };
    await writeFile(join(temporary, "metadata.json"), `${JSON.stringify(metadata)}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    try {
      await rename(temporary, finalRoot);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST" &&
          (error as NodeJS.ErrnoException).code !== "ENOTEMPTY") {
        throw error;
      }
      try {
        const winner = await readCached(finalRoot, id, hash, entry, budgets);
        await rm(temporary, { recursive: true, force: true });
        return await createArtifactLease(winner, home, budgets);
      } catch {
        await quarantineCache(finalRoot, idRoot, hash);
        await rename(temporary, finalRoot);
      }
    }
    return await createArtifactLease(
      await readCached(finalRoot, id, hash, entry, budgets),
      home,
      budgets,
    );
  } catch (error) {
    if (error instanceof GitProcessUnreapedError) {
      const quarantine = join(idRoot, `.unreaped-${hash}-${randomUUID()}`);
      await rename(temporary, quarantine).catch(() => undefined);
      throw error;
    }
    await rm(temporary, { recursive: true, force: true }).catch(() => undefined);
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("verified staging failed");
  }
}
