import { randomUUID } from "node:crypto";
import { homedir, hostname as localHostname } from "node:os";
import { join, resolve } from "node:path";
import { lstat, mkdir, readFile, readdir, realpath, rename, rm, writeFile } from "node:fs/promises";

import { CliSafetyError } from "../errors.js";
import {
  assertSafeCacheSegment,
  assertSafeProfileName,
  ensureCanonicalHome,
  ensureContainedDirectory,
  isPathWithin,
} from "./paths.js";

export interface StagedInstall {
  readonly fingerprint: string;
  readonly installTarget: string;
  readonly displayTarget: string;
  readonly packageName: string;
  readonly cacheRelativePath: string;
}

export interface InstalledPlugin {
  readonly id: string;
  readonly profile: string;
  readonly packageName: string;
  readonly fingerprint: string;
  readonly cacheRelativePath: string;
  readonly installedAt: string;
}

export interface InstallState {
  readonly version: 1;
  readonly generation?: number;
  readonly fencingToken?: number;
  readonly installs: readonly InstalledPlugin[];
  readonly recoveryRequired?: RecoveryRequiredMarker;
}

export interface ArtifactRecoveryReference {
  readonly relativePath: string;
  readonly sha512: string;
  readonly bytes: number;
  readonly packageName: string;
}

export interface RecoveryProcessTreeIdentity {
  readonly pid: number;
  readonly processGroupId: number | null;
  readonly treeIdentity: string;
  readonly processStartIdentity: string | null;
  readonly platform: NodeJS.Platform;
}

export interface ProfileTransactionRecoveryReference {
  readonly profile: string;
  readonly fencingToken: number;
  readonly existed: boolean;
  readonly journalRelativePath: string;
  readonly backupRelativePath: string;
}

export interface RecoveryRequiredMarker {
  readonly status: "recovery_required";
  readonly profile: string;
  readonly fencingToken: number;
  readonly processTree: RecoveryProcessTreeIdentity;
  readonly artifact: ArtifactRecoveryReference | null;
  readonly transaction: ProfileTransactionRecoveryReference;
}

export const EMPTY_INSTALL_STATE: InstallState = {
  version: 1,
  generation: 0,
  fencingToken: 0,
  installs: [],
};

export interface InstallStateWriterContext {
  readonly ownerToken: string;
  readonly fencingToken: number;
}

export interface InstallStateWriterOptions {
  readonly leaseMs?: number;
  readonly heartbeatMs?: number;
  readonly acquireTimeoutMs?: number;
  readonly retryMs?: number;
  readonly now?: () => number;
  readonly ownerToken?: () => string;
  readonly pid?: number;
  readonly processStartIdentity?: string;
  readonly hostname?: string;
  readonly isProcessAlive?: (
    pid: number,
    processStartIdentity: string,
  ) => boolean | Promise<boolean>;
  readonly beforeRename?: (context: InstallStateWriterContext) => Promise<void>;
}

export interface InstallStateWriteOptions {
  readonly expectedGeneration: number;
  readonly fencingToken: number;
  readonly assertLockOwned: () => Promise<void>;
  readonly writer?: InstallStateWriterOptions;
}

export class InstallStateGenerationError extends CliSafetyError {
  constructor() {
    super("install state generation changed; recovery required");
    this.name = "InstallStateGenerationError";
  }
}

export class InstallStateFencingError extends CliSafetyError {
  constructor() {
    super("install state fencing token is stale; recovery required");
    this.name = "InstallStateFencingError";
  }
}

export class InstallStateWriterBusyError extends CliSafetyError {
  constructor() {
    super("install state publication lock is busy");
    this.name = "InstallStateWriterBusyError";
  }
}

export class InstallStateWriterOwnershipError extends CliSafetyError {
  constructor() {
    super("install state publication ownership changed; recovery required");
    this.name = "InstallStateWriterOwnershipError";
  }
}

interface StateWriterOwnerRecord {
  readonly version: 1;
  readonly ownerToken: string;
  readonly fencingToken: number;
  readonly acquiredAt: number;
  readonly leaseMs: number;
  readonly pid: number;
  readonly processStartIdentity: string;
  readonly hostname: string;
}

interface StateWriterLease {
  readonly context: InstallStateWriterContext;
  readonly assertOwned: () => Promise<void>;
  readonly release: () => Promise<void>;
}

const DEFAULT_WRITER_LEASE_MS = 30_000;
const DEFAULT_WRITER_HEARTBEAT_MS = 10_000;
const DEFAULT_WRITER_ACQUIRE_TIMEOUT_MS = 5_000;
const DEFAULT_WRITER_RETRY_MS = 10;
const SAFE_WRITER_TOKEN = /^[A-Za-z0-9_-]{1,100}$/u;
const SAFE_PROCESS_IDENTITY = /^[A-Za-z0-9._:-]{1,200}$/u;
const CURRENT_PROCESS_STARTED_AT = Math.floor(Date.now() - process.uptime() * 1_000);

const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u;
const FINGERPRINT = /^sha256:[0-9a-f]{64}$/u;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u;
const SHA512_REFERENCE = /^sha512-[A-Za-z0-9+/]{86}==$/u;
const SAFE_IDENTITY = /^[A-Za-z0-9._:-]{1,240}$/u;

function safeRecoveryPath(value: string, expectedPrefix: string): boolean {
  if (!value.startsWith(expectedPrefix) || value.startsWith("/") || value.includes("\\")) {
    return false;
  }
  return value.split("/").every((segment) => segment !== "" && segment !== "." && segment !== "..");
}

function parseRecoveryMarker(value: unknown): RecoveryRequiredMarker | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new CliSafetyError("install state recovery marker is invalid");
  }
  const marker = value as Record<string, unknown>;
  const profile = marker.profile;
  const fencingToken = marker.fencingToken;
  const processTree = marker.processTree;
  const transaction = marker.transaction;
  const artifact = marker.artifact;
  if (
    marker.status !== "recovery_required" ||
    typeof profile !== "string" ||
    !Number.isSafeInteger(fencingToken) ||
    Number(fencingToken) <= 0 ||
    typeof processTree !== "object" || processTree === null ||
    typeof transaction !== "object" || transaction === null
  ) {
    throw new CliSafetyError("install state recovery marker is invalid");
  }
  assertSafeProfileName(profile);
  const tree = processTree as Record<string, unknown>;
  if (
    !Number.isSafeInteger(tree.pid) || Number(tree.pid) <= 0 ||
    !(tree.processGroupId === null ||
      (Number.isSafeInteger(tree.processGroupId) && Number(tree.processGroupId) > 0)) ||
    typeof tree.treeIdentity !== "string" || !SAFE_IDENTITY.test(tree.treeIdentity) ||
    !(tree.processStartIdentity === null ||
      (typeof tree.processStartIdentity === "string" &&
        SAFE_IDENTITY.test(tree.processStartIdentity))) ||
    typeof tree.platform !== "string" || !SAFE_IDENTITY.test(tree.platform)
  ) {
    throw new CliSafetyError("install state recovery marker is invalid");
  }
  const transactionRecord = transaction as Record<string, unknown>;
  if (
    transactionRecord.profile !== profile ||
    transactionRecord.fencingToken !== fencingToken ||
    typeof transactionRecord.existed !== "boolean" ||
    typeof transactionRecord.journalRelativePath !== "string" ||
    !safeRecoveryPath(
      transactionRecord.journalRelativePath,
      `profiles/.dsh-plugins-transaction-${profile}-`,
    ) ||
    !transactionRecord.journalRelativePath.endsWith(".json") ||
    typeof transactionRecord.backupRelativePath !== "string" ||
    !safeRecoveryPath(
      transactionRecord.backupRelativePath,
      `profiles/.dsh-plugins-backup-${profile}-`,
    )
  ) {
    throw new CliSafetyError("install state recovery marker is invalid");
  }
  let artifactReference: ArtifactRecoveryReference | null = null;
  if (artifact !== null) {
    if (typeof artifact !== "object") {
      throw new CliSafetyError("install state recovery marker is invalid");
    }
    const artifactRecord = artifact as Record<string, unknown>;
    if (
      typeof artifactRecord.relativePath !== "string" ||
      !safeRecoveryPath(
        artifactRecord.relativePath,
        ".dsh-plugins/artifact-leases/.lease-",
      ) ||
      !artifactRecord.relativePath.endsWith("/artifact.tgz") ||
      typeof artifactRecord.sha512 !== "string" ||
      !SHA512_REFERENCE.test(artifactRecord.sha512) ||
      !Number.isSafeInteger(artifactRecord.bytes) || Number(artifactRecord.bytes) <= 0 ||
      typeof artifactRecord.packageName !== "string" || !PACKAGE_NAME.test(artifactRecord.packageName)
    ) {
      throw new CliSafetyError("install state recovery marker is invalid");
    }
    artifactReference = {
      relativePath: artifactRecord.relativePath,
      sha512: artifactRecord.sha512,
      bytes: Number(artifactRecord.bytes),
      packageName: artifactRecord.packageName,
    };
  }
  return {
    status: "recovery_required",
    profile,
    fencingToken: Number(fencingToken),
    processTree: {
      pid: Number(tree.pid),
      processGroupId: tree.processGroupId === null ? null : Number(tree.processGroupId),
      treeIdentity: tree.treeIdentity,
      processStartIdentity: tree.processStartIdentity as string | null,
      platform: tree.platform as NodeJS.Platform,
    },
    artifact: artifactReference,
    transaction: {
      profile,
      fencingToken: Number(fencingToken),
      existed: transactionRecord.existed,
      journalRelativePath: transactionRecord.journalRelativePath,
      backupRelativePath: transactionRecord.backupRelativePath,
    },
  };
}

export function resolveDshHome(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.DSH_HOME?.trim();
  return resolve(configured === undefined || configured === "" ? join(homedir(), ".dsh") : configured);
}

function safeRelativeCachePath(value: string): boolean {
  const segments = value.split("/");
  return segments.length >= 3 && segments.every((segment) => {
    if (segment.endsWith(".tgz")) {
      return SAFE_FILE.test(segment);
    }
    return /^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(segment) && segment !== "." && segment !== "..";
  });
}

const SAFE_FILE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/u;

function parseState(value: unknown): InstallState {
  if (typeof value !== "object" || value === null) {
    throw new CliSafetyError("install state is invalid");
  }
  const record = value as {
    version?: unknown;
    generation?: unknown;
    fencingToken?: unknown;
    installs?: unknown;
    recoveryRequired?: unknown;
  };
  if (record.version !== 1 || !Array.isArray(record.installs)) {
    throw new CliSafetyError("install state is invalid");
  }
  const generation = record.generation ?? 0;
  const fencingToken = record.fencingToken ?? 0;
  if (
    !Number.isSafeInteger(generation) ||
    Number(generation) < 0 ||
    !Number.isSafeInteger(fencingToken) ||
    Number(fencingToken) < 0
  ) {
    throw new CliSafetyError("install state is invalid");
  }
  const keys = new Set<string>();
  const installs: InstalledPlugin[] = [];
  for (const item of record.installs) {
    if (typeof item !== "object" || item === null) {
      throw new CliSafetyError("install state is invalid");
    }
    const candidate = item as Record<string, unknown>;
    const id = candidate.id;
    const profile = candidate.profile;
    const packageName = candidate.packageName;
    const fingerprint = candidate.fingerprint;
    const cacheRelativePath = candidate.cacheRelativePath;
    const installedAt = candidate.installedAt;
    if (
      typeof id !== "string" ||
      typeof profile !== "string" ||
      typeof packageName !== "string" ||
      typeof fingerprint !== "string" ||
      typeof cacheRelativePath !== "string" ||
      typeof installedAt !== "string"
    ) {
      throw new CliSafetyError("install state is invalid");
    }
    assertSafeCacheSegment(id, "installed plugin ID");
    assertSafeProfileName(profile);
    if (!PACKAGE_NAME.test(packageName) || !FINGERPRINT.test(fingerprint) ||
        !safeRelativeCachePath(cacheRelativePath) || !ISO_DATE.test(installedAt)) {
      throw new CliSafetyError("install state is invalid");
    }
    const key = `${profile}\0${id}`;
    if (keys.has(key)) {
      throw new CliSafetyError("install state contains duplicate records");
    }
    keys.add(key);
    installs.push({ id, profile, packageName, fingerprint, cacheRelativePath, installedAt });
  }
  installs.sort((left, right) => left.profile.localeCompare(right.profile) || left.id.localeCompare(right.id));
  const recoveryRequired = parseRecoveryMarker(record.recoveryRequired);
  return {
    version: 1,
    generation: Number(generation),
    fencingToken: Number(fencingToken),
    installs,
    ...(recoveryRequired === undefined ? {} : { recoveryRequired }),
  };
}

export async function readInstallState(home: string): Promise<InstallState> {
  const absoluteHome = resolve(home);
  let canonicalHome: string;
  try {
    const homeInfo = await lstat(absoluteHome);
    if (homeInfo.isSymbolicLink() || !homeInfo.isDirectory()) {
      throw new CliSafetyError("DSH home is not a safe directory");
    }
    canonicalHome = await realpath(absoluteHome);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return EMPTY_INSTALL_STATE;
    }
    throw error;
  }
  const statePath = join(canonicalHome, ".dsh-plugins", "state.json");
  try {
    const info = await lstat(statePath);
    if (info.isSymbolicLink() || !info.isFile()) {
      throw new CliSafetyError("install state path is unsafe");
    }
    const canonicalState = await realpath(statePath);
    if (!isPathWithin(canonicalHome, canonicalState)) {
      throw new CliSafetyError("install state path is unsafe");
    }
    const content = await readFile(canonicalState, "utf8");
    if (content.length > 1024 * 1024) {
      throw new CliSafetyError("install state is too large");
    }
    return parseState(JSON.parse(content) as unknown);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return EMPTY_INSTALL_STATE;
    }
    if (error instanceof CliSafetyError) {
      throw error;
    }
    throw new CliSafetyError("install state is invalid");
  }
}

function stateWriterErrorCode(error: unknown): string | undefined {
  return (error as NodeJS.ErrnoException).code;
}

function writerDuration(value: number | undefined, fallback: number, allowZero: boolean): number {
  const duration = value ?? fallback;
  if (!Number.isFinite(duration) || (allowZero ? duration < 0 : duration <= 0)) {
    throw new CliSafetyError("install state writer configuration is invalid");
  }
  return duration;
}

async function linuxProcessStartIdentity(pid: number): Promise<string | null> {
  try {
    const source = await readFile(`/proc/${pid}/stat`, "utf8");
    const commandEnd = source.lastIndexOf(")");
    if (commandEnd < 0) return null;
    const fields = source.slice(commandEnd + 1).trim().split(/\s+/u);
    const startTicks = fields[19];
    return startTicks !== undefined && /^\d+$/u.test(startTicks) ? `linux:${startTicks}` : null;
  } catch {
    return null;
  }
}

async function defaultProcessStartIdentity(pid: number): Promise<string> {
  return await linuxProcessStartIdentity(pid) ??
    `node:${pid}:${pid === process.pid ? CURRENT_PROCESS_STARTED_AT : "unknown"}`;
}

async function defaultProcessAlive(pid: number, expectedIdentity: string): Promise<boolean> {
  const currentIdentity = await linuxProcessStartIdentity(pid);
  if (currentIdentity !== null) return currentIdentity === expectedIdentity;
  if (
    pid === process.pid &&
    expectedIdentity === `node:${pid}:${CURRENT_PROCESS_STARTED_AT}`
  ) {
    return true;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return stateWriterErrorCode(error) !== "ESRCH";
  }
}

async function readStateWriterOwner(lockPath: string): Promise<StateWriterOwnerRecord | null> {
  try {
    const info = await lstat(lockPath);
    if (info.isSymbolicLink() || !info.isDirectory()) {
      throw new CliSafetyError("install state publication lock path is unsafe");
    }
    const source = await readFile(join(lockPath, "owner.json"), "utf8");
    if (source.length > 4_096) throw new Error("oversized-owner");
    const value = JSON.parse(source) as Partial<StateWriterOwnerRecord>;
    if (
      value.version !== 1 ||
      typeof value.ownerToken !== "string" ||
      !SAFE_WRITER_TOKEN.test(value.ownerToken) ||
      !Number.isSafeInteger(value.fencingToken) ||
      (value.fencingToken ?? 0) < 0 ||
      !Number.isFinite(value.acquiredAt) ||
      !Number.isFinite(value.leaseMs) ||
      (value.leaseMs ?? 0) <= 0 ||
      !Number.isSafeInteger(value.pid) ||
      (value.pid ?? 0) <= 0 ||
      typeof value.processStartIdentity !== "string" ||
      !SAFE_PROCESS_IDENTITY.test(value.processStartIdentity) ||
      typeof value.hostname !== "string" ||
      value.hostname.length === 0 ||
      value.hostname.length > 255
    ) {
      throw new Error("invalid-owner");
    }
    return value as StateWriterOwnerRecord;
  } catch (error) {
    if (stateWriterErrorCode(error) === "ENOENT") return null;
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("install state publication lock metadata is invalid");
  }
}

async function readStateWriterFence(path: string): Promise<number> {
  try {
    const value = JSON.parse(await readFile(path, "utf8")) as { version?: unknown; value?: unknown };
    if (value.version !== 1 || !Number.isSafeInteger(value.value) || Number(value.value) < 0) {
      throw new Error("invalid-fence");
    }
    return Number(value.value);
  } catch (error) {
    if (stateWriterErrorCode(error) === "ENOENT") return 0;
    throw new CliSafetyError("install state publication fence is invalid");
  }
}

async function writeStateWriterFence(path: string, value: number): Promise<void> {
  const temporary = `${path}.tmp-${randomUUID()}`;
  try {
    await writeFile(temporary, `${JSON.stringify({ version: 1, value })}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    await rename(temporary, path);
  } catch {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw new CliSafetyError("install state publication fence could not be published");
  }
}

async function writeStateWriterOwner(
  lockPath: string,
  owner: StateWriterOwnerRecord,
): Promise<void> {
  const temporary = join(lockPath, `.owner-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, `${JSON.stringify(owner)}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    await rename(temporary, join(lockPath, "owner.json"));
  } catch {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw new CliSafetyError("install state publication lock metadata could not be published");
  }
}

async function latestStateWriterHeartbeat(
  lockPath: string,
  owner: StateWriterOwnerRecord,
): Promise<number> {
  let latest = owner.acquiredAt;
  const prefix = `heartbeat-${owner.ownerToken}-`;
  try {
    for (const entry of await readdir(lockPath, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith(prefix)) continue;
      const timestamp = Number(entry.name.slice(prefix.length));
      if (Number.isFinite(timestamp)) latest = Math.max(latest, timestamp);
    }
  } catch (error) {
    if (stateWriterErrorCode(error) !== "ENOENT") {
      throw new CliSafetyError("install state publication heartbeat is unreadable");
    }
  }
  return latest;
}

async function writerSleep(milliseconds: number): Promise<void> {
  if (milliseconds === 0) return;
  await new Promise((complete) => setTimeout(complete, milliseconds));
}

async function acquireStateWriter(
  stateDirectory: string,
  options: InstallStateWriterOptions = {},
): Promise<StateWriterLease> {
  const leaseMs = writerDuration(options.leaseMs, DEFAULT_WRITER_LEASE_MS, false);
  const heartbeatMs = writerDuration(
    options.heartbeatMs,
    DEFAULT_WRITER_HEARTBEAT_MS,
    false,
  );
  const acquireTimeoutMs = writerDuration(
    options.acquireTimeoutMs,
    DEFAULT_WRITER_ACQUIRE_TIMEOUT_MS,
    true,
  );
  const retryMs = writerDuration(options.retryMs, DEFAULT_WRITER_RETRY_MS, true);
  const now = options.now ?? Date.now;
  const makeOwnerToken = options.ownerToken ?? randomUUID;
  const pid = options.pid ?? process.pid;
  const hostname = options.hostname ?? localHostname();
  const processStartIdentity = options.processStartIdentity ??
    await defaultProcessStartIdentity(pid);
  const isProcessAlive = options.isProcessAlive ?? defaultProcessAlive;
  if (
    !Number.isSafeInteger(pid) || pid <= 0 ||
    !SAFE_PROCESS_IDENTITY.test(processStartIdentity) ||
    hostname.length === 0 || hostname.length > 255
  ) {
    throw new CliSafetyError("install state writer identity is invalid");
  }
  const lockPath = join(stateDirectory, ".state-write.lock");
  const fencePath = join(stateDirectory, ".state-write.fence.json");
  const startedAt = now();

  while (true) {
    const ownerToken = makeOwnerToken();
    if (!SAFE_WRITER_TOKEN.test(ownerToken)) {
      throw new CliSafetyError("install state writer owner token is invalid");
    }
    const candidate = join(stateDirectory, `.state-write.claim-${randomUUID()}`);
    const provisionalOwner: StateWriterOwnerRecord = {
      version: 1,
      ownerToken,
      fencingToken: 0,
      acquiredAt: now(),
      leaseMs,
      pid,
      processStartIdentity,
      hostname,
    };
    let claimed = false;
    let fencingToken = 0;
    try {
      await mkdir(candidate, { mode: 0o700 });
      await writeFile(join(candidate, "owner.json"), `${JSON.stringify(provisionalOwner)}\n`, {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx",
      });
      await rename(candidate, lockPath);
      claimed = true;
      fencingToken = await readStateWriterFence(fencePath) + 1;
      await writeStateWriterFence(fencePath, fencingToken);
      await writeStateWriterOwner(lockPath, { ...provisionalOwner, fencingToken });
    } catch (error) {
      await rm(candidate, { recursive: true, force: true }).catch(() => undefined);
      if (claimed) {
        const failedPath = join(stateDirectory, `.state-write.failed-${randomUUID()}`);
        try {
          const current = await readStateWriterOwner(lockPath);
          if (current?.ownerToken === ownerToken) {
            await rename(lockPath, failedPath);
            await rm(failedPath, { recursive: true, force: true });
          }
        } catch {
          // The fenced failed claim is recoverable only after its lease expires.
        }
        throw new CliSafetyError("install state publication lock could not be acquired");
      }
      if (!["EEXIST", "ENOTEMPTY"].includes(stateWriterErrorCode(error) ?? "")) {
        throw new CliSafetyError("install state publication lock could not be acquired");
      }

      const current = await readStateWriterOwner(lockPath);
      if (current !== null) {
        const latestHeartbeat = await latestStateWriterHeartbeat(lockPath, current);
        const leaseExpired = now() - latestHeartbeat > current.leaseMs;
        let ownerProvenDead = false;
        if (leaseExpired && current.hostname === hostname) {
          try {
            ownerProvenDead = !(await isProcessAlive(
              current.pid,
              current.processStartIdentity,
            ));
          } catch {
            ownerProvenDead = false;
          }
        }
        if (leaseExpired && ownerProvenDead) {
          const confirmed = await readStateWriterOwner(lockPath);
          if (
            confirmed?.ownerToken === current.ownerToken &&
            confirmed.fencingToken === current.fencingToken &&
            now() - await latestStateWriterHeartbeat(lockPath, confirmed) > confirmed.leaseMs
          ) {
            const stalePath = join(stateDirectory, `.state-write.stale-${randomUUID()}`);
            try {
              await rename(lockPath, stalePath);
              const detached = await readStateWriterOwner(stalePath);
              if (
                detached?.ownerToken === current.ownerToken &&
                detached.fencingToken === current.fencingToken
              ) {
                await rm(stalePath, { recursive: true, force: true });
                continue;
              }
              await rename(stalePath, lockPath).catch(() => undefined);
            } catch (takeoverError) {
              if (![
                "ENOENT",
                "EEXIST",
                "ENOTEMPTY",
              ].includes(stateWriterErrorCode(takeoverError) ?? "")) {
                throw new CliSafetyError("stale install state publication lock is unsafe");
              }
            }
          }
        }
      }
      if (now() - startedAt >= acquireTimeoutMs) throw new InstallStateWriterBusyError();
      await writerSleep(retryMs);
    }

    let released = false;
    let lost = false;
    const assertOwned = async (): Promise<void> => {
      if (released || lost) throw new InstallStateWriterOwnershipError();
      const current = await readStateWriterOwner(lockPath);
      if (
        current === null ||
        current.ownerToken !== ownerToken ||
        current.fencingToken !== fencingToken ||
        current.processStartIdentity !== processStartIdentity
      ) {
        lost = true;
        throw new InstallStateWriterOwnershipError();
      }
    };
    const heartbeat = async (): Promise<void> => {
      await assertOwned();
      try {
        await mkdir(join(lockPath, `heartbeat-${ownerToken}-${now()}`), { mode: 0o700 });
      } catch (error) {
        if (stateWriterErrorCode(error) !== "EEXIST") {
          lost = true;
          throw new InstallStateWriterOwnershipError();
        }
      }
    };
    const timer = setInterval(() => {
      void heartbeat().catch(() => {
        lost = true;
      });
    }, heartbeatMs);
    timer.unref();

    const release = async (): Promise<void> => {
      if (released) return;
      released = true;
      clearInterval(timer);
      const current = await readStateWriterOwner(lockPath);
      if (
        current === null ||
        current.ownerToken !== ownerToken ||
        current.fencingToken !== fencingToken ||
        current.processStartIdentity !== processStartIdentity
      ) {
        return;
      }
      const releasePath = join(stateDirectory, `.state-write.release-${ownerToken}`);
      try {
        await rename(lockPath, releasePath);
        const detached = await readStateWriterOwner(releasePath);
        if (
          detached?.ownerToken === ownerToken &&
          detached.fencingToken === fencingToken &&
          detached.processStartIdentity === processStartIdentity
        ) {
          await rm(releasePath, { recursive: true, force: true });
        } else {
          await rename(releasePath, lockPath).catch(() => undefined);
        }
      } catch (error) {
        if (stateWriterErrorCode(error) !== "ENOENT") {
          throw new CliSafetyError("install state publication lock could not be released safely");
        }
      }
    };

    return {
      context: { ownerToken, fencingToken },
      assertOwned,
      release,
    };
  }
}

export async function writeInstallState(
  home: string,
  state: InstallState,
  options?: InstallStateWriteOptions,
): Promise<InstallState> {
  const normalized = parseState(state);
  const canonicalHome = await ensureCanonicalHome(home);
  const stateDirectory = await ensureContainedDirectory(canonicalHome, ".dsh-plugins");
  const writer = await acquireStateWriter(stateDirectory, options?.writer);
  const target = join(stateDirectory, "state.json");
  const temporary = join(stateDirectory, `.state-${randomUUID()}.tmp`);
  try {
    const current = await readInstallState(canonicalHome);
    const currentGeneration = current.generation ?? 0;
    const currentFence = current.fencingToken ?? 0;
    const expectedGeneration = options?.expectedGeneration ?? currentGeneration;
    const fencingToken = options?.fencingToken ?? Math.max(currentFence, normalized.fencingToken ?? 0);
    if (currentGeneration !== expectedGeneration) throw new InstallStateGenerationError();
    if (fencingToken < currentFence) throw new InstallStateFencingError();
    const next: InstallState = {
      version: 1,
      generation: expectedGeneration + 1,
      fencingToken,
      installs: normalized.installs,
      ...(normalized.recoveryRequired === undefined
        ? {}
        : { recoveryRequired: normalized.recoveryRequired }),
    };
    await writeFile(temporary, `${JSON.stringify(next, undefined, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    await options?.writer?.beforeRename?.(writer.context);
    const latest = await readInstallState(canonicalHome);
    let writerOwnershipError: InstallStateWriterOwnershipError | undefined;
    try {
      await writer.assertOwned();
    } catch (error) {
      if (error instanceof InstallStateWriterOwnershipError) {
        writerOwnershipError = error;
      } else {
        throw error;
      }
    }
    if (writerOwnershipError !== undefined) throw writerOwnershipError;
    const latestGeneration = latest.generation ?? 0;
    const latestFence = latest.fencingToken ?? 0;
    if (latestGeneration !== expectedGeneration) throw new InstallStateGenerationError();
    if (fencingToken < latestFence) throw new InstallStateFencingError();
    await options?.assertLockOwned();
    await writer.assertOwned();
    await rename(temporary, target);
    return { ...next, generation: latestGeneration + 1 };
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    if (error instanceof CliSafetyError) {
      throw error;
    }
    throw new CliSafetyError("install state could not be written atomically");
  } finally {
    await writer.release();
  }
}
