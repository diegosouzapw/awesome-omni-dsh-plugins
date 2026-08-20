import { randomUUID } from "node:crypto";
import { hostname as localHostname } from "node:os";
import { join } from "node:path";
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";

import { CliSafetyError } from "../errors.js";
import {
  assertSafeProfileName,
  ensureCanonicalHome,
  ensureContainedDirectory,
} from "./paths.js";

const DEFAULT_LEASE_MS = 30_000;
const DEFAULT_HEARTBEAT_MS = 10_000;
const DEFAULT_ACQUIRE_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY_MS = 50;
const SAFE_TOKEN = /^[A-Za-z0-9_-]{1,100}$/u;

interface LockOwnerRecord {
  readonly version: 1;
  readonly ownerToken: string;
  readonly fencingToken: number;
  readonly profile: string;
  readonly acquiredAt: number;
  readonly leaseMs: number;
  readonly pid: number;
  readonly hostname: string;
}

export interface AcquireProfileLockOptions {
  readonly leaseMs?: number;
  readonly heartbeatMs?: number;
  readonly acquireTimeoutMs?: number;
  readonly retryMs?: number;
  readonly now?: () => number;
  readonly ownerToken?: () => string;
  readonly pid?: number;
  readonly hostname?: string;
  readonly isProcessAlive?: (pid: number) => boolean;
}

export interface ProfileLock {
  readonly canonicalHome: string;
  readonly profile: string;
  readonly ownerToken: string;
  readonly fencingToken: number;
  readonly assertOwned: () => Promise<void>;
  readonly heartbeat: () => Promise<void>;
  readonly release: () => Promise<void>;
}

export class ProfileLockBusyError extends CliSafetyError {
  constructor() {
    super("profile mutation lock is busy");
    this.name = "ProfileLockBusyError";
  }
}

export class ProfileLockOwnershipError extends CliSafetyError {
  constructor() {
    super("profile mutation lock ownership changed; recovery required");
    this.name = "ProfileLockOwnershipError";
  }
}

function finiteDuration(value: number | undefined, fallback: number, allowZero: boolean): number {
  const duration = value ?? fallback;
  if (!Number.isFinite(duration) || (allowZero ? duration < 0 : duration <= 0)) {
    throw new CliSafetyError("profile mutation lock configuration is invalid");
  }
  return duration;
}

function processAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== "ESRCH";
  }
}

function errorCode(error: unknown): string | undefined {
  return (error as NodeJS.ErrnoException).code;
}

async function readOwner(lockPath: string): Promise<LockOwnerRecord | null> {
  try {
    const info = await lstat(lockPath);
    if (info.isSymbolicLink() || !info.isDirectory()) {
      throw new CliSafetyError("profile mutation lock path is unsafe");
    }
    const source = await readFile(join(lockPath, "owner.json"), "utf8");
    if (source.length > 4_096) throw new Error("oversized-owner");
    const value = JSON.parse(source) as Partial<LockOwnerRecord>;
    if (
      value.version !== 1 ||
      typeof value.ownerToken !== "string" ||
      !SAFE_TOKEN.test(value.ownerToken) ||
      !Number.isSafeInteger(value.fencingToken) ||
      (value.fencingToken ?? 0) < 0 ||
      typeof (value as { profile?: unknown }).profile !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test((value as { profile: string }).profile) ||
      !Number.isFinite(value.acquiredAt) ||
      !Number.isFinite(value.leaseMs) ||
      !Number.isSafeInteger(value.pid) ||
      (value.pid ?? 0) <= 0 ||
      typeof value.hostname !== "string" ||
      value.hostname.length === 0 ||
      value.hostname.length > 255
    ) {
      throw new Error("invalid-owner");
    }
    return value as LockOwnerRecord;
  } catch (error) {
    if (errorCode(error) === "ENOENT") return null;
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("profile mutation lock metadata is invalid");
  }
}

async function writeOwner(lockPath: string, owner: LockOwnerRecord): Promise<void> {
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
    throw new CliSafetyError("profile mutation lock metadata could not be published");
  }
}

async function readFence(path: string): Promise<number> {
  try {
    const value = JSON.parse(await readFile(path, "utf8")) as { version?: unknown; value?: unknown };
    if (value.version !== 1 || !Number.isSafeInteger(value.value) || Number(value.value) < 0) {
      throw new Error("invalid-fence");
    }
    return Number(value.value);
  } catch (error) {
    if (errorCode(error) === "ENOENT") return 0;
    throw new CliSafetyError("profile mutation fence is invalid");
  }
}

async function writeFence(path: string, value: number): Promise<void> {
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
    throw new CliSafetyError("profile mutation fence could not be published");
  }
}

async function readLegacyFenceMaximum(lockDirectory: string): Promise<number> {
  let maximum = 0;
  try {
    for (const entry of await readdir(lockDirectory, { withFileTypes: true })) {
      if (!entry.isFile() || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.fence\.json$/u.test(entry.name)) {
        continue;
      }
      maximum = Math.max(maximum, await readFence(join(lockDirectory, entry.name)));
    }
  } catch (error) {
    if (errorCode(error) !== "ENOENT") {
      throw new CliSafetyError("legacy profile mutation fences are unreadable");
    }
  }
  return maximum;
}

async function latestHeartbeat(lockPath: string, owner: LockOwnerRecord): Promise<number> {
  let latest = owner.acquiredAt;
  const prefix = `heartbeat-${owner.ownerToken}-`;
  try {
    for (const entry of await readdir(lockPath, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith(prefix)) continue;
      const timestamp = Number(entry.name.slice(prefix.length));
      if (Number.isFinite(timestamp)) latest = Math.max(latest, timestamp);
    }
  } catch (error) {
    if (errorCode(error) !== "ENOENT") {
      throw new CliSafetyError("profile mutation heartbeat is unreadable");
    }
  }
  return latest;
}

async function sleep(milliseconds: number): Promise<void> {
  if (milliseconds === 0) return;
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function acquireProfileLock(
  home: string,
  profile: string,
  options: AcquireProfileLockOptions = {},
): Promise<ProfileLock> {
  assertSafeProfileName(profile);
  const leaseMs = finiteDuration(options.leaseMs, DEFAULT_LEASE_MS, false);
  const heartbeatMs = finiteDuration(options.heartbeatMs, DEFAULT_HEARTBEAT_MS, false);
  const acquireTimeoutMs = finiteDuration(
    options.acquireTimeoutMs,
    DEFAULT_ACQUIRE_TIMEOUT_MS,
    true,
  );
  const retryMs = finiteDuration(options.retryMs, DEFAULT_RETRY_MS, true);
  const now = options.now ?? Date.now;
  const makeOwnerToken = options.ownerToken ?? randomUUID;
  const pid = options.pid ?? process.pid;
  const hostname = options.hostname ?? localHostname();
  const isProcessAlive = options.isProcessAlive ?? processAlive;
  const canonicalHome = await ensureCanonicalHome(home);
  const lockDirectory = await ensureContainedDirectory(canonicalHome, ".dsh-plugins", "locks");
  const lockPath = join(lockDirectory, "mutation.lock");
  const fencePath = join(lockDirectory, "mutation.fence.json");
  const startedAt = now();

  while (true) {
    const ownerToken = makeOwnerToken();
    if (!SAFE_TOKEN.test(ownerToken)) {
      throw new CliSafetyError("profile mutation owner token is invalid");
    }
    let fencingToken = 0;
    const candidate = join(lockDirectory, `.mutation.claim-${randomUUID()}`);
    const provisionalRecord: LockOwnerRecord = {
      version: 1,
      ownerToken,
      fencingToken: 0,
      profile,
      acquiredAt: now(),
      leaseMs,
      pid,
      hostname,
    };
    let claimed = false;

    try {
      await mkdir(candidate, { mode: 0o700 });
      await writeFile(join(candidate, "owner.json"), `${JSON.stringify(provisionalRecord)}\n`, {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx",
      });
      await rename(candidate, lockPath);
      claimed = true;
      fencingToken = Math.max(
        await readFence(fencePath),
        await readLegacyFenceMaximum(lockDirectory),
      ) + 1;
      await writeFence(fencePath, fencingToken);
      await writeOwner(lockPath, { ...provisionalRecord, fencingToken });
    } catch (error) {
      await rm(candidate, { recursive: true, force: true }).catch(() => undefined);
      if (claimed) {
        const failedPath = join(lockDirectory, `.mutation.failed-${randomUUID()}`);
        try {
          const current = await readOwner(lockPath);
          if (current?.ownerToken === ownerToken) {
            await rename(lockPath, failedPath);
            await rm(failedPath, { recursive: true, force: true });
          }
        } catch {
          // A failed claim remains fenced and can only be recovered as stale.
        }
        throw new CliSafetyError("profile mutation lock could not be acquired");
      }
      if (!["EEXIST", "ENOTEMPTY"].includes(errorCode(error) ?? "")) {
        throw new CliSafetyError("profile mutation lock could not be acquired");
      }

      const current = await readOwner(lockPath);
      if (current !== null) {
        const leaseExpired = now() - await latestHeartbeat(lockPath, current) > current.leaseMs;
        const localOwnerAlive = current.hostname === hostname && isProcessAlive(current.pid);
        if (leaseExpired && !localOwnerAlive) {
          const stalePath = join(lockDirectory, `.mutation.stale-${randomUUID()}`);
          try {
            await rename(lockPath, stalePath);
            await rm(stalePath, { recursive: true, force: true });
            continue;
          } catch (takeoverError) {
            if (!["ENOENT", "EEXIST", "ENOTEMPTY"].includes(errorCode(takeoverError) ?? "")) {
              throw new CliSafetyError("stale profile mutation lock could not be recovered");
            }
          }
        }
      }

      if (now() - startedAt >= acquireTimeoutMs) throw new ProfileLockBusyError();
      await sleep(retryMs);
      continue;
    }

    let released = false;
    let lost = false;
    const assertOwned = async (): Promise<void> => {
      if (released || lost) throw new ProfileLockOwnershipError();
      const current = await readOwner(lockPath);
      if (
        current === null ||
        current.ownerToken !== ownerToken ||
        current.fencingToken !== fencingToken ||
        current.profile !== profile
      ) {
        lost = true;
        throw new ProfileLockOwnershipError();
      }
    };
    const heartbeat = async (): Promise<void> => {
      await assertOwned();
      try {
        await mkdir(join(lockPath, `heartbeat-${ownerToken}-${now()}`), { mode: 0o700 });
      } catch (error) {
        if (errorCode(error) !== "EEXIST") {
          lost = true;
          throw new ProfileLockOwnershipError();
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
      const current = await readOwner(lockPath);
      if (
        current === null ||
        current.ownerToken !== ownerToken ||
        current.fencingToken !== fencingToken ||
        current.profile !== profile
      ) {
        return;
      }
      const releasePath = join(lockDirectory, `.mutation.release-${ownerToken}`);
      try {
        await rename(lockPath, releasePath);
        const detached = await readOwner(releasePath);
        if (
          detached?.ownerToken === ownerToken &&
          detached.fencingToken === fencingToken &&
          detached.profile === profile
        ) {
          await rm(releasePath, { recursive: true, force: true });
        } else {
          await rename(releasePath, lockPath).catch(() => undefined);
        }
      } catch (error) {
        if (errorCode(error) !== "ENOENT") {
          throw new CliSafetyError("profile mutation lock could not be released safely");
        }
      }
    };

    return {
      canonicalHome,
      profile,
      ownerToken,
      fencingToken,
      assertOwned,
      heartbeat,
      release,
    };
  }
}
