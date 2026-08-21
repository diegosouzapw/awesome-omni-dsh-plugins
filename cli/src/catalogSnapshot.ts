import { constants } from "node:fs";
import {
  lstat,
  mkdir,
  mkdtemp,
  open,
  opendir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { TextDecoder } from "node:util";

import {
  runSupervisedChild,
  type ChildSpawn,
  type ProcessGroupSignaler,
} from "./dsh/childSupervisor.js";
import { CliSafetyError } from "./errors.js";

export const CATALOG_SNAPSHOT_FORMAT_V1 = "omni-dsh-catalog-snapshot-v1" as const;
export const PUBLIC_CATALOG_RAW_ORIGIN =
  "https://raw.githubusercontent.com/diegosouzapw/awesome-omni-dsh-plugins";
// A snapshot committed to the catalog repository can never declare its own commit, so the
// raw.githubusercontent form is unreachable in practice (REV-44). The site publishes the
// generated snapshot at this stable URL instead; the user-supplied --revision stays the trust
// anchor because parseSnapshot rejects any envelope whose declared revision differs from it.
export const PUBLIC_SNAPSHOT_SITE_URL =
  "https://dsh-plugins.omniroute.online/catalog.snapshot.json";

export const CATALOG_SNAPSHOT_LIMITS = Object.freeze({
  snapshotBytes: 10 * 1024 * 1024,
  totalFileBytes: 8 * 1024 * 1024,
  fileBytes: 1024 * 1024,
  files: 2_048,
  directoryEntries: 4_096,
  pathBytes: 512,
  redirects: 3,
  gitOutputBytes: 64 * 1024,
  gitTreeBytes: 2 * 1024 * 1024,
  pathDepth: 16,
});

export const CATALOG_DEADLINE_DEFAULTS = Object.freeze({
  fetchTimeoutMs: 10_000,
  gitTimeoutMs: 5_000,
  gitKillGraceMs: 250,
  gitReapTimeoutMs: 500,
  maximumTimeoutMs: 5 * 60_000,
});

const SHA40 = /^[0-9a-f]{40}$/;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });

export interface CatalogSnapshotV1 {
  readonly format: typeof CATALOG_SNAPSHOT_FORMAT_V1;
  readonly revision: string;
  readonly files: Readonly<Record<string, string>>;
}

export type CatalogMaterializationSelection =
  | {
      readonly kind: "directory";
      readonly root: string;
      readonly revision?: string;
    }
  | {
      readonly kind: "snapshot-file";
      readonly path: string;
      readonly revision?: string;
    }
  | {
      readonly kind: "snapshot-url";
      readonly url: string;
      // Optional: the default catalog has no pin to assert against, and the envelope carries
      // the revision it actually is. Supplying one turns the fetch into an exact-commit demand.
      readonly revision?: string;
    };

export interface MaterializedDirectoryCatalog {
  readonly kind: "directory";
  readonly root: string;
  cleanup(): Promise<void>;
}

export interface MaterializedSnapshotCatalog {
  readonly kind: "snapshot";
  readonly root: string;
  readonly revision: string;
  cleanup(): Promise<void>;
}

export type MaterializedCatalog = MaterializedDirectoryCatalog | MaterializedSnapshotCatalog;

export type CatalogSnapshotFetch = (url: string, init: RequestInit) => Promise<Response>;

export type CatalogGitSpawn = ChildSpawn;

export interface CatalogMaterializationDependencies {
  readonly fetch?: CatalogSnapshotFetch;
  readonly fetchTimeoutMs?: number;
  readonly gitTimeoutMs?: number;
  readonly gitKillGraceMs?: number;
  readonly gitReapTimeoutMs?: number;
  readonly signal?: AbortSignal;
  readonly gitExecutable?: string;
  readonly gitArgumentPrefix?: readonly string[];
  readonly spawnGit?: ChildSpawn;
  readonly signalProcessGroup?: ProcessGroupSignaler;
}

interface ParsedSnapshot {
  readonly revision: string;
  readonly files: ReadonlyArray<readonly [string, string]>;
}

interface DirectoryBudget {
  entries: number;
  files: number;
  bytes: number;
}

interface LocalSnapshotContents {
  readonly canonicalPath: string;
  readonly text: string;
}

interface OperationDeadline {
  readonly signal: AbortSignal;
  dispose(): void;
}

interface GitTreeEntry {
  readonly mode: string;
  readonly type: string;
  readonly oid: string;
  readonly size: number | null;
  readonly path: string;
}

interface LocalGitPin {
  readonly topLevel: string;
}

function safety(message: string): CliSafetyError {
  return new CliSafetyError(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertRevision(revision: string): void {
  if (!SHA40.test(revision)) {
    throw safety("catalog revision must be a lowercase SHA40 commit");
  }
}

function configuredTimeout(value: number | undefined, fallback: number): number {
  const timeout = value ?? fallback;
  if (
    !Number.isSafeInteger(timeout) ||
    timeout < 1 ||
    timeout > CATALOG_DEADLINE_DEFAULTS.maximumTimeoutMs
  ) {
    throw safety("catalog operation deadline is invalid");
  }
  return timeout;
}

function createDeadline(timeoutMs: number, parent?: AbortSignal): OperationDeadline {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, timeoutMs);
  timer.unref();

  if (parent?.aborted === true) {
    abort();
  } else {
    parent?.addEventListener("abort", abort, { once: true });
  }

  return {
    signal: controller.signal,
    dispose: () => {
      clearTimeout(timer);
      parent?.removeEventListener("abort", abort);
    },
  };
}

function waitForAbortable<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) {
    return Promise.reject(safety("catalog operation deadline was exceeded"));
  }
  return new Promise<T>((resolvePromise, rejectPromise) => {
    const aborted = () => {
      rejectPromise(safety("catalog operation deadline was exceeded"));
    };
    signal.addEventListener("abort", aborted, { once: true });
    operation.then(
      (value) => {
        signal.removeEventListener("abort", aborted);
        resolvePromise(value);
      },
      (error: unknown) => {
        signal.removeEventListener("abort", aborted);
        rejectPromise(error);
      },
    );
  });
}

function isContained(root: string, candidate: string): boolean {
  const child = relative(root, candidate);
  return child === "" || (!isAbsolute(child) && child !== ".." && !child.startsWith(`..${sep}`));
}

function assertSafePublicPath(path: string): void {
  const pathSegments = path.split("/");
  const isPublicSchema = pathSegments[0] === "schemas" && pathSegments.length >= 2;
  const isPublicPlugin =
    pathSegments[0] === "catalog" &&
    pathSegments[1] === "plugins" &&
    pathSegments.length >= 3;

  if (
    path.length === 0 ||
    Buffer.byteLength(path) > CATALOG_SNAPSHOT_LIMITS.pathBytes ||
    isAbsolute(path) ||
    path.includes("\\") ||
    path.includes("%") ||
    path.includes("\0") ||
    /[\x00-\x1f\x7f]/.test(path) ||
    pathSegments.length > CATALOG_SNAPSHOT_LIMITS.pathDepth ||
    pathSegments.some(
      (segment) =>
        segment.length === 0 ||
        segment === "." ||
        segment === ".." ||
        Buffer.byteLength(segment) > 255,
    ) ||
    (!isPublicSchema && !isPublicPlugin)
  ) {
    throw safety("catalog snapshot contains an unsafe public file path");
  }
}

function decodeUtf8(bytes: Uint8Array): string {
  try {
    return UTF8_DECODER.decode(bytes);
  } catch {
    throw safety("catalog snapshot is not valid UTF-8");
  }
}

function parseSnapshot(text: string, requestedRevision?: string): ParsedSnapshot {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw safety("catalog snapshot is not valid JSON");
  }

  if (!isRecord(value)) {
    throw safety("catalog snapshot has an invalid v1 envelope");
  }
  const keys = Object.keys(value).sort();
  if (
    keys.length !== 3 ||
    keys[0] !== "files" ||
    keys[1] !== "format" ||
    keys[2] !== "revision" ||
    value.format !== CATALOG_SNAPSHOT_FORMAT_V1 ||
    typeof value.revision !== "string" ||
    !isRecord(value.files)
  ) {
    throw safety("catalog snapshot has an invalid v1 envelope");
  }

  assertRevision(value.revision);
  if (requestedRevision !== undefined) {
    assertRevision(requestedRevision);
    if (value.revision !== requestedRevision) {
      throw safety("catalog snapshot revision does not match the requested commit");
    }
  }

  const entries = Object.entries(value.files);
  if (entries.length > CATALOG_SNAPSHOT_LIMITS.files) {
    throw safety("catalog snapshot exceeds the public file count limit");
  }

  const caseInsensitivePaths = new Set<string>();
  const allPaths = new Set(entries.map(([path]) => path));
  let totalBytes = 0;
  for (const [path, content] of entries) {
    assertSafePublicPath(path);
    if (typeof content !== "string") {
      throw safety("catalog snapshot public files must contain UTF-8 text");
    }

    const foldedPath = path.toLowerCase();
    if (caseInsensitivePaths.has(foldedPath)) {
      throw safety("catalog snapshot contains colliding public file paths");
    }
    caseInsensitivePaths.add(foldedPath);

    const pathSegments = path.split("/");
    for (let index = 1; index < pathSegments.length; index += 1) {
      if (allPaths.has(pathSegments.slice(0, index).join("/"))) {
        throw safety("catalog snapshot contains a conflicting public file layout");
      }
    }

    const fileBytes = Buffer.byteLength(content);
    if (fileBytes > CATALOG_SNAPSHOT_LIMITS.fileBytes) {
      throw safety("catalog snapshot contains an oversized public file");
    }
    totalBytes += fileBytes;
    if (totalBytes > CATALOG_SNAPSHOT_LIMITS.totalFileBytes) {
      throw safety("catalog snapshot exceeds the public file byte limit");
    }
  }

  return {
    revision: value.revision,
    files: entries as ReadonlyArray<readonly [string, string]>,
  };
}

async function readLocalSnapshot(path: string): Promise<LocalSnapshotContents> {
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    const before = await lstat(path);
    if (
      before.isSymbolicLink() ||
      !before.isFile() ||
      before.size > CATALOG_SNAPSHOT_LIMITS.snapshotBytes
    ) {
      throw safety("local catalog snapshot is not a safe bounded file");
    }

    const noFollow = typeof constants.O_NOFOLLOW === "number" ? constants.O_NOFOLLOW : 0;
    handle = await open(path, constants.O_RDONLY | noFollow);
    const opened = await handle.stat();
    if (
      !opened.isFile() ||
      opened.size > CATALOG_SNAPSHOT_LIMITS.snapshotBytes ||
      opened.dev !== before.dev ||
      opened.ino !== before.ino
    ) {
      throw safety("local catalog snapshot changed during safe opening");
    }

    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let position = 0;
    while (true) {
      const remainingProbe = CATALOG_SNAPSHOT_LIMITS.snapshotBytes + 1 - totalBytes;
      const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, remainingProbe));
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
      if (bytesRead === 0) break;
      totalBytes += bytesRead;
      position += bytesRead;
      if (totalBytes > CATALOG_SNAPSHOT_LIMITS.snapshotBytes) {
        throw safety("local catalog snapshot exceeds the byte limit");
      }
      chunks.push(buffer.subarray(0, bytesRead));
    }
    const canonicalPath = await realpath(path);
    return {
      canonicalPath,
      text: decodeUtf8(Buffer.concat(chunks, totalBytes)),
    };
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw safety("local catalog snapshot could not be read safely");
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

function validatePublicSnapshotUrl(rawUrl: string, revision?: string): URL {
  if (revision !== undefined) assertRevision(revision);
  if (rawUrl.includes("\\") || rawUrl.includes("%")) {
    throw safety("catalog snapshot URL is outside the public allowlist");
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw safety("catalog snapshot URL is invalid");
  }

  // Without a revision there is no pinned raw URL to construct, so the stable site URL is the
  // only address left in the allowlist — the allowlist never widens, it only loses one member.
  const expected =
    revision === undefined
      ? PUBLIC_SNAPSHOT_SITE_URL
      : `${PUBLIC_CATALOG_RAW_ORIGIN}/${revision}/catalog.snapshot.json`;
  if (
    url.protocol !== "https:" ||
    url.username !== "" ||
    url.password !== "" ||
    url.port !== "" ||
    url.search !== "" ||
    url.hash !== "" ||
    (url.href !== expected && url.href !== PUBLIC_SNAPSHOT_SITE_URL)
  ) {
    throw safety("catalog snapshot URL is outside the public allowlist");
  }
  return url;
}

async function readResponseBody(response: Response, signal: AbortSignal): Promise<string> {
  const declaredLength = response.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^(0|[1-9][0-9]*)$/.test(declaredLength)) {
      throw safety("catalog snapshot response has an invalid content length");
    }
    const parsedLength = Number(declaredLength);
    if (
      !Number.isSafeInteger(parsedLength) ||
      parsedLength > CATALOG_SNAPSHOT_LIMITS.snapshotBytes
    ) {
      throw safety("catalog snapshot response exceeds the byte limit");
    }
  }

  if (response.body === null) {
    throw safety("catalog snapshot response has no body");
  }

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await waitForAbortable(reader.read(), signal);
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > CATALOG_SNAPSHOT_LIMITS.snapshotBytes) {
        await reader.cancel().catch(() => undefined);
        throw safety("catalog snapshot response exceeds the byte limit");
      }
      chunks.push(Buffer.from(value));
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    if (error instanceof CliSafetyError) throw error;
    throw safety("catalog snapshot response could not be read safely");
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Cancellation can settle a pending read after the lock is released.
    }
  }
  return decodeUtf8(Buffer.concat(chunks, totalBytes));
}

async function downloadSnapshot(
  rawUrl: string,
  revision: string | undefined,
  dependencies: CatalogMaterializationDependencies,
): Promise<string> {
  const timeoutMs = configuredTimeout(
    dependencies.fetchTimeoutMs,
    CATALOG_DEADLINE_DEFAULTS.fetchTimeoutMs,
  );
  const deadline = createDeadline(timeoutMs, dependencies.signal);
  const fetchSnapshot: CatalogSnapshotFetch =
    dependencies.fetch ?? ((url, init) => globalThis.fetch(url, init));
  let current = validatePublicSnapshotUrl(rawUrl, revision);
  try {
    for (
      let redirectCount = 0;
      redirectCount <= CATALOG_SNAPSHOT_LIMITS.redirects;
      redirectCount += 1
    ) {
      let response: Response;
      try {
        response = await waitForAbortable(
          fetchSnapshot(current.href, {
            redirect: "manual",
            credentials: "omit",
            referrerPolicy: "no-referrer",
            headers: { accept: "application/json" },
            signal: deadline.signal,
          }),
          deadline.signal,
        );
      } catch (error) {
        if (error instanceof CliSafetyError) throw error;
        throw safety("catalog snapshot download failed safely");
      }

      if (REDIRECT_STATUSES.has(response.status)) {
        await response.body?.cancel().catch(() => undefined);
        const location = response.headers.get("location");
        if (location === null || redirectCount === CATALOG_SNAPSHOT_LIMITS.redirects) {
          throw safety("catalog snapshot redirect was rejected");
        }
        let redirected: URL;
        try {
          redirected = new URL(location, current);
        } catch {
          throw safety("catalog snapshot redirect was rejected");
        }
        current = validatePublicSnapshotUrl(redirected.href, revision);
        continue;
      }

      if (!response.ok) {
        await response.body?.cancel().catch(() => undefined);
        throw safety("catalog snapshot download returned an unsuccessful status");
      }
      return await readResponseBody(response, deadline.signal);
    }
    throw safety("catalog snapshot redirect limit was exceeded");
  } finally {
    deadline.dispose();
  }
}

function gitEnvironment(): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = {
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_OPTIONAL_LOCKS: "0",
    GIT_PAGER: "cat",
    GIT_TERMINAL_PROMPT: "0",
    LC_ALL: "C",
  };
  for (const name of ["PATH", "SystemRoot", "SYSTEMROOT", "ComSpec", "PATHEXT", "TMPDIR", "TEMP", "TMP"]) {
    const value = process.env[name];
    if (value !== undefined) environment[name] = value;
  }
  return environment;
}

async function runGitBytes(
  args: readonly string[],
  cwd: string,
  dependencies: CatalogMaterializationDependencies,
  maxOutputBytes = CATALOG_SNAPSHOT_LIMITS.gitOutputBytes,
): Promise<Buffer> {
  const timeoutMs = configuredTimeout(
    dependencies.gitTimeoutMs,
    CATALOG_DEADLINE_DEFAULTS.gitTimeoutMs,
  );
  const killGraceMs = configuredTimeout(
    dependencies.gitKillGraceMs,
    CATALOG_DEADLINE_DEFAULTS.gitKillGraceMs,
  );
  const reapTimeoutMs = configuredTimeout(
    dependencies.gitReapTimeoutMs,
    CATALOG_DEADLINE_DEFAULTS.gitReapTimeoutMs,
  );
  const executable = dependencies.gitExecutable ?? "git";
  if (executable.length === 0 || executable.includes("\0")) {
    throw safety("local Git executable is invalid");
  }
  const result = await runSupervisedChild(
    {
      command: executable,
      args: [
        ...(dependencies.gitArgumentPrefix ?? []),
        "-c",
        "core.fsmonitor=false",
        ...args,
      ],
      cwd,
      env: gitEnvironment(),
      timeoutMs,
      termGraceMs: killGraceMs,
      reapTimeoutMs,
      maxOutputBytes,
      processGroup: true,
      ...(dependencies.signal === undefined ? {} : { signal: dependencies.signal }),
    },
    {
      ...(dependencies.spawnGit === undefined ? {} : { spawn: dependencies.spawnGit }),
      ...(dependencies.signalProcessGroup === undefined
        ? {}
        : { signalProcessGroup: dependencies.signalProcessGroup }),
    },
  );
  if (!result.reaped) {
    throw safety("local Git process could not be reaped safely");
  }
  if (result.reason !== "exit" || result.exitCode !== 0) {
    throw safety("local Git proof failed safely");
  }
  return result.stdout;
}

async function runGit(
  args: readonly string[],
  cwd: string,
  dependencies: CatalogMaterializationDependencies,
  maxOutputBytes = CATALOG_SNAPSHOT_LIMITS.gitOutputBytes,
): Promise<string> {
  return decodeUtf8(await runGitBytes(args, cwd, dependencies, maxOutputBytes));
}

function singleGitLine(output: string): string {
  const value = output.replace(/\r?\n$/, "");
  if (value.length === 0 || value.includes("\n") || value.includes("\r") || value.includes("\0")) {
    throw safety("local Git proof returned an invalid value");
  }
  return value;
}

async function proveLocalGitRevision(
  input: { readonly kind: "directory" | "snapshot-file"; readonly path: string },
  revision: string,
  dependencies: CatalogMaterializationDependencies,
): Promise<LocalGitPin> {
  assertRevision(revision);
  const probeDirectory = input.kind === "directory" ? input.path : dirname(input.path);
  const topLevelOutput = await runGit(["rev-parse", "--show-toplevel"], probeDirectory, dependencies);
  let topLevel: string;
  try {
    topLevel = await realpath(singleGitLine(topLevelOutput));
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw safety("local Git top-level could not be canonicalized");
  }

  if (input.kind === "directory") {
    if (topLevel !== input.path) {
      throw safety("pinned local catalog must be the Git top-level");
    }
  } else {
    if (!isContained(topLevel, input.path)) {
      throw safety("pinned local snapshot is outside the Git top-level");
    }
    const snapshotRelativePath = relative(topLevel, input.path);
    if (snapshotRelativePath === ".git" || snapshotRelativePath.startsWith(`.git${sep}`)) {
      throw safety("pinned local snapshot is inside Git metadata");
    }
  }

  await runGit(["cat-file", "-e", `${revision}^{commit}`], topLevel, dependencies);
  return { topLevel };
}

function assertSafeGitRelativePath(path: string): void {
  const segments = path.split("/");
  if (
    path.length === 0 ||
    Buffer.byteLength(path) > CATALOG_SNAPSHOT_LIMITS.pathBytes ||
    isAbsolute(path) ||
    path.includes("\\") ||
    path.includes("%") ||
    /[\x00-\x1f\x7f]/.test(path) ||
    segments.length > CATALOG_SNAPSHOT_LIMITS.pathDepth ||
    segments.some(
      (segment) =>
        segment.length === 0 ||
        segment === "." ||
        segment === ".." ||
        Buffer.byteLength(segment) > 255,
    )
  ) {
    throw safety("local Git tree contains an unsafe path");
  }
}

function parseGitTree(bytes: Buffer): GitTreeEntry[] {
  if (bytes.byteLength === 0) return [];
  const text = decodeUtf8(bytes);
  if (!text.endsWith("\0")) {
    throw safety("local Git tree inventory is truncated");
  }

  return text.slice(0, -1).split("\0").map((record) => {
    const separator = record.indexOf("\t");
    if (separator < 1) {
      throw safety("local Git tree inventory is invalid");
    }
    const metadata = record.slice(0, separator);
    const path = record.slice(separator + 1);
    const match = /^([0-9]{6}) ([^ ]+) ([0-9a-f]{40}) +([0-9]+|-)$/.exec(metadata);
    if (match === null) {
      throw safety("local Git tree inventory is invalid");
    }
    const sizeText = match[4];
    const size = sizeText === "-" || sizeText === undefined ? null : Number(sizeText);
    if (size !== null && (!Number.isSafeInteger(size) || size < 0)) {
      throw safety("local Git tree contains an invalid blob size");
    }
    return {
      mode: match[1] ?? "",
      type: match[2] ?? "",
      oid: match[3] ?? "",
      size,
      path,
    };
  });
}

function assertRegularGitBlob(entry: GitTreeEntry): asserts entry is GitTreeEntry & { size: number } {
  if (
    entry.type !== "blob" ||
    (entry.mode !== "100644" && entry.mode !== "100755") ||
    entry.size === null
  ) {
    throw safety("local Git tree contains a non-regular catalog entry");
  }
}

function validatePublicGitTree(entries: readonly GitTreeEntry[]): void {
  if (entries.length > CATALOG_SNAPSHOT_LIMITS.files) {
    throw safety("local Git tree exceeds the public file count limit");
  }
  const paths = new Set(entries.map((entry) => entry.path));
  const foldedPaths = new Set<string>();
  let totalBytes = 0;
  for (const entry of entries) {
    assertSafePublicPath(entry.path);
    assertRegularGitBlob(entry);
    if (entry.size > CATALOG_SNAPSHOT_LIMITS.fileBytes) {
      throw safety("local Git tree contains an oversized public file");
    }
    totalBytes += entry.size;
    if (totalBytes > CATALOG_SNAPSHOT_LIMITS.totalFileBytes) {
      throw safety("local Git tree exceeds the public file byte limit");
    }

    const foldedPath = entry.path.toLowerCase();
    if (foldedPaths.has(foldedPath)) {
      throw safety("local Git tree contains colliding public file paths");
    }
    foldedPaths.add(foldedPath);

    const segments = entry.path.split("/");
    for (let index = 1; index < segments.length; index += 1) {
      if (paths.has(segments.slice(0, index).join("/"))) {
        throw safety("local Git tree contains a conflicting public file layout");
      }
    }
  }
}

async function readGitBlob(
  entry: GitTreeEntry & { readonly size: number },
  topLevel: string,
  dependencies: CatalogMaterializationDependencies,
): Promise<Buffer> {
  const bytes = await runGitBytes(
    ["cat-file", "blob", entry.oid],
    topLevel,
    dependencies,
    entry.size + 1,
  );
  if (bytes.byteLength !== entry.size) {
    throw safety("local Git blob size does not match its tree entry");
  }
  return bytes;
}

async function readPinnedDirectory(
  topLevel: string,
  revision: string,
  dependencies: CatalogMaterializationDependencies,
): Promise<ParsedSnapshot> {
  const treeBytes = await runGitBytes(
    [
      "--literal-pathspecs",
      "ls-tree",
      "-rz",
      "-l",
      "--full-tree",
      revision,
      "--",
      "schemas",
      "catalog/plugins",
    ],
    topLevel,
    dependencies,
    CATALOG_SNAPSHOT_LIMITS.gitTreeBytes,
  );
  const entries = parseGitTree(treeBytes);
  validatePublicGitTree(entries);

  const files: Array<readonly [string, string]> = [];
  for (const entry of [...entries].sort((left, right) => left.path.localeCompare(right.path))) {
    assertRegularGitBlob(entry);
    files.push([entry.path, decodeUtf8(await readGitBlob(entry, topLevel, dependencies))]);
  }
  return { revision, files };
}

async function readPinnedSnapshotFile(
  topLevel: string,
  absolutePath: string,
  revision: string,
  dependencies: CatalogMaterializationDependencies,
): Promise<string> {
  const snapshotPath = relative(topLevel, absolutePath).split(sep).join("/");
  assertSafeGitRelativePath(snapshotPath);
  const treeBytes = await runGitBytes(
    [
      "--literal-pathspecs",
      "ls-tree",
      "-z",
      "-l",
      "--full-tree",
      revision,
      "--",
      snapshotPath,
    ],
    topLevel,
    dependencies,
    CATALOG_SNAPSHOT_LIMITS.gitTreeBytes,
  );
  const entries = parseGitTree(treeBytes);
  if (entries.length !== 1 || entries[0]?.path !== snapshotPath) {
    throw safety("pinned local snapshot is not tracked by the selected commit");
  }
  const entry = entries[0];
  assertRegularGitBlob(entry);
  if (entry.size > CATALOG_SNAPSHOT_LIMITS.snapshotBytes) {
    throw safety("pinned local snapshot exceeds the byte limit");
  }
  return decodeUtf8(await readGitBlob(entry, topLevel, dependencies));
}

function ownedCleanup(root: string): () => Promise<void> {
  let cleanupPromise: Promise<void> | undefined;
  return () => {
    cleanupPromise ??= rm(root, { recursive: true, force: true }).catch(() => {
      throw safety("temporary catalog cleanup failed safely");
    });
    return cleanupPromise;
  };
}

async function materializeSnapshot(parsed: ParsedSnapshot): Promise<MaterializedSnapshotCatalog> {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "dsh-catalog-snapshot-"));
  try {
    for (const [path, content] of [...parsed.files].sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      const target = resolve(temporaryRoot, path);
      if (!isContained(temporaryRoot, target)) {
        throw safety("catalog snapshot public file escaped its temporary root");
      }
      await mkdir(dirname(target), { recursive: true, mode: 0o700 });
      await writeFile(target, content, { encoding: "utf8", flag: "wx", mode: 0o600 });
    }

    const canonicalRoot = await realpath(temporaryRoot);
    if (!isContained(canonicalRoot, canonicalRoot)) {
      throw safety("temporary catalog root is unsafe");
    }
    return {
      kind: "snapshot",
      root: canonicalRoot,
      revision: parsed.revision,
      cleanup: ownedCleanup(canonicalRoot),
    };
  } catch (error) {
    await rm(temporaryRoot, { recursive: true, force: true }).catch(() => undefined);
    if (error instanceof CliSafetyError) throw error;
    throw safety("catalog snapshot could not be materialized safely");
  }
}

async function resolvePublicTree(
  canonicalRoot: string,
  segments: readonly string[],
): Promise<string | null> {
  let current = canonicalRoot;
  for (const segment of segments) {
    const candidate = join(current, segment);
    let info;
    try {
      info = await lstat(candidate);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
    if (info.isSymbolicLink() || !info.isDirectory()) {
      throw safety("local catalog contains an unsafe public directory");
    }
    const canonical = await realpath(candidate);
    if (!isContained(canonicalRoot, canonical)) {
      throw safety("local catalog public directory escapes its root");
    }
    current = canonical;
  }
  return current;
}

async function inspectPublicTree(
  canonicalRoot: string,
  relativeRoot: string,
  absoluteRoot: string,
  budget: DirectoryBudget,
): Promise<void> {
  const pending: Array<{ absolute: string; relative: string }> = [
    { absolute: absoluteRoot, relative: relativeRoot },
  ];
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined) break;
    const directory = await opendir(current.absolute);
    for await (const entry of directory) {
      budget.entries += 1;
      if (budget.entries > CATALOG_SNAPSHOT_LIMITS.directoryEntries) {
        throw safety("local catalog exceeds the public directory entry limit");
      }

      const relativePath = `${current.relative}/${entry.name}`;
      assertSafePublicPath(relativePath);
      const absolutePath = join(current.absolute, entry.name);
      const info = await lstat(absolutePath);
      if (info.isSymbolicLink()) {
        throw safety("local catalog contains an unsafe public symlink");
      }
      const canonicalPath = await realpath(absolutePath);
      if (!isContained(canonicalRoot, canonicalPath)) {
        throw safety("local catalog public path escapes its root");
      }

      if (info.isDirectory()) {
        pending.push({ absolute: canonicalPath, relative: relativePath });
        continue;
      }
      if (!info.isFile()) {
        throw safety("local catalog contains an unsafe public file type");
      }

      budget.files += 1;
      budget.bytes += info.size;
      if (budget.files > CATALOG_SNAPSHOT_LIMITS.files) {
        throw safety("local catalog exceeds the public file count limit");
      }
      if (info.size > CATALOG_SNAPSHOT_LIMITS.fileBytes) {
        throw safety("local catalog contains an oversized public file");
      }
      if (budget.bytes > CATALOG_SNAPSHOT_LIMITS.totalFileBytes) {
        throw safety("local catalog exceeds the public file byte limit");
      }
    }
  }
}

async function canonicalPinnedDirectory(root: string): Promise<string> {
  try {
    const info = await lstat(root);
    if (info.isSymbolicLink() || !info.isDirectory()) {
      throw safety("pinned local catalog root is not a safe directory");
    }
    return await realpath(root);
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw safety("pinned local catalog root could not be resolved safely");
  }
}

async function materializeDirectory(root: string): Promise<MaterializedDirectoryCatalog> {
  try {
    const rootInfo = await lstat(root);
    if (rootInfo.isSymbolicLink() || !rootInfo.isDirectory()) {
      throw safety("local catalog root is not a safe directory");
    }
    const canonicalRoot = await realpath(root);
    const budget: DirectoryBudget = { entries: 0, files: 0, bytes: 0 };
    for (const segments of [["schemas"], ["catalog", "plugins"]] as const) {
      const publicRoot = await resolvePublicTree(canonicalRoot, segments);
      if (publicRoot !== null) {
        await inspectPublicTree(canonicalRoot, segments.join("/"), publicRoot, budget);
      }
    }
    return {
      kind: "directory",
      root: canonicalRoot,
      cleanup: async () => undefined,
    };
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw safety("local catalog directory could not be inspected safely");
  }
}

export async function materializeCatalog(
  selection: CatalogMaterializationSelection,
  dependencies: CatalogMaterializationDependencies = {},
): Promise<MaterializedCatalog> {
  if (selection.kind === "directory") {
    if (selection.revision === undefined) return materializeDirectory(selection.root);
    const canonicalRoot = await canonicalPinnedDirectory(selection.root);
    const pin = await proveLocalGitRevision(
      { kind: "directory", path: canonicalRoot },
      selection.revision,
      dependencies,
    );
    return materializeSnapshot(
      await readPinnedDirectory(pin.topLevel, selection.revision, dependencies),
    );
  }

  if (selection.kind === "snapshot-file") {
    if (selection.revision === undefined) {
      const local = await readLocalSnapshot(selection.path);
      return materializeSnapshot(parseSnapshot(local.text));
    }
    const absolutePath = resolve(selection.path);
    const pin = await proveLocalGitRevision(
      { kind: "snapshot-file", path: absolutePath },
      selection.revision,
      dependencies,
    );
    const text = await readPinnedSnapshotFile(
      pin.topLevel,
      absolutePath,
      selection.revision,
      dependencies,
    );
    return materializeSnapshot(parseSnapshot(text, selection.revision));
  }

  const text = await downloadSnapshot(selection.url, selection.revision, dependencies);
  return materializeSnapshot(parseSnapshot(text, selection.revision));
}
