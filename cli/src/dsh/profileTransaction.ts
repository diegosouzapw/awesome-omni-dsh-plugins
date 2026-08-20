import { createHash, randomUUID } from "node:crypto";
import { join } from "node:path";
import { cp, lstat, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";

import { CliSafetyError } from "../errors.js";
import {
  assertSafeProfileName,
  ensureCanonicalHome,
  ensureContainedDirectory,
} from "./paths.js";

export interface ProfileTransaction {
  readonly recoveryReference: ProfileTransactionRecoveryReference;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface ProfileTransactionRecoveryReference {
  readonly profile: string;
  readonly fencingToken: number;
  readonly existed: boolean;
  readonly journalRelativePath: string;
  readonly backupRelativePath: string;
  readonly backupFingerprint?: string | null;
}

export interface ProfileTransactionOptions {
  readonly fencingToken?: number;
  readonly committedFencingToken?: number;
  readonly assertLockOwned?: () => Promise<void>;
}

interface TransactionJournal {
  readonly version: 1;
  readonly profile: string;
  readonly fencingToken: number;
  readonly existed: boolean;
  readonly backupName: string;
  readonly backupFingerprint?: string | null;
}

export async function profileFingerprint(root: string): Promise<string> {
  const hash = createHash("sha512");
  let files = 0;
  let bytes = 0;
  const visit = async (directory: string, prefix: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => Buffer.from(left.name).compare(Buffer.from(right.name)));
    for (const entry of entries) {
      const path = join(directory, entry.name);
      const relativePath = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
      const info = await lstat(path);
      if (info.isSymbolicLink()) throw new CliSafetyError("profile backup contains a symlink");
      if (info.isDirectory()) {
        hash.update(`D\0${relativePath}\0`);
        await visit(path, relativePath);
        continue;
      }
      if (!info.isFile()) throw new CliSafetyError("profile backup contains an unsafe file");
      files += 1;
      bytes += info.size;
      if (files > 20_000 || bytes > 512 * 1024 * 1024) {
        throw new CliSafetyError("profile backup exceeds the recovery fingerprint budget");
      }
      const content = await readFile(path);
      hash.update(`F\0${relativePath}\0${info.mode & 0o777}\0${content.byteLength}\0`);
      hash.update(content);
    }
  };
  await visit(root, "");
  return `sha512-${hash.digest("base64")}`;
}

async function activeExists(active: string): Promise<boolean> {
  try {
    const info = await lstat(active);
    if (info.isSymbolicLink() || !info.isDirectory()) {
      throw new CliSafetyError("profile path is unsafe");
    }
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

async function recoverTransactions(
  profiles: string,
  active: string,
  profile: string,
  committedFencingToken: number,
  assertLockOwned: () => Promise<void>,
): Promise<void> {
  const prefix = `.dsh-plugins-transaction-${profile}-`;
  const journals: Array<{ path: string; value: TransactionJournal }> = [];
  for (const entry of await readdir(profiles, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.startsWith(prefix) || !entry.name.endsWith(".json")) continue;
    try {
      const value = JSON.parse(await readFile(join(profiles, entry.name), "utf8")) as TransactionJournal;
      if (
        value.version !== 1 ||
        value.profile !== profile ||
        !Number.isSafeInteger(value.fencingToken) ||
        typeof value.existed !== "boolean" ||
        !value.backupName.startsWith(`.dsh-plugins-backup-${profile}-`) ||
        value.backupName.includes("/") ||
        value.backupName.includes("\\")
      ) {
        throw new Error("invalid-journal");
      }
      journals.push({ path: join(profiles, entry.name), value });
    } catch {
      throw new CliSafetyError("profile transaction journal requires manual recovery");
    }
  }
  journals.sort((left, right) => right.value.fencingToken - left.value.fencingToken);
  for (const journal of journals) {
    const backup = join(profiles, journal.value.backupName);
    if (journal.value.fencingToken <= committedFencingToken) {
      await rm(backup, { recursive: true, force: true }).catch(() => undefined);
      await rm(journal.path, { force: true }).catch(() => undefined);
      continue;
    }
    await assertLockOwned();
    try {
      await rm(active, { recursive: true, force: true });
      if (journal.value.existed) await rename(backup, active);
      else await rm(backup, { recursive: true, force: true });
      await rm(journal.path, { force: true });
    } catch {
      throw new CliSafetyError("profile rollback requires the retained recovery backup");
    }
  }
}

export async function beginProfileTransaction(
  home: string,
  profile: string,
  options: ProfileTransactionOptions = {},
): Promise<ProfileTransaction> {
  assertSafeProfileName(profile);
  const fencingToken = options.fencingToken ?? 0;
  const committedFencingToken = options.committedFencingToken ?? -1;
  const assertLockOwned = options.assertLockOwned ?? (async () => undefined);
  await assertLockOwned();
  const canonicalHome = await ensureCanonicalHome(home);
  const profiles = await ensureContainedDirectory(canonicalHome, "profiles");
  const active = join(profiles, profile);
  await recoverTransactions(
    profiles,
    active,
    profile,
    committedFencingToken,
    assertLockOwned,
  );

  const suffix = randomUUID();
  const backupName = `.dsh-plugins-backup-${profile}-${suffix}`;
  const backup = join(profiles, backupName);
  const journal = join(profiles, `.dsh-plugins-transaction-${profile}-${suffix}.json`);
  const journalTemporary = `${journal}.tmp`;
  const existed = await activeExists(active);
  let backupFingerprint: string | null = null;
  try {
    if (existed) {
      await cp(active, backup, {
        recursive: true,
        force: false,
        errorOnExist: true,
        dereference: false,
        preserveTimestamps: true,
      });
      backupFingerprint = await profileFingerprint(backup);
    }
    const value: TransactionJournal = {
      version: 1,
      profile,
      fencingToken,
      existed,
      backupName,
      backupFingerprint,
    };
    await writeFile(journalTemporary, `${JSON.stringify(value)}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    await rename(journalTemporary, journal);
  } catch (error) {
    await rm(journalTemporary, { force: true }).catch(() => undefined);
    await rm(backup, { recursive: true, force: true }).catch(() => undefined);
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("profile backup could not be prepared");
  }

  let finished = false;
  const recoveryReference: ProfileTransactionRecoveryReference = {
    profile,
    fencingToken,
    existed,
    journalRelativePath: `profiles/${journal.slice(profiles.length + 1)}`,
    backupRelativePath: `profiles/${backupName}`,
    backupFingerprint,
  };
  return {
    recoveryReference,
    async commit() {
      if (finished) return;
      await assertLockOwned();
      await rm(backup, { recursive: true, force: true });
      await rm(journal, { force: true });
      finished = true;
    },
    async rollback() {
      if (finished) return;
      await assertLockOwned();
      try {
        await rm(active, { recursive: true, force: true });
        if (existed) await rename(backup, active);
        else await rm(backup, { recursive: true, force: true });
        await rm(journal, { force: true });
        finished = true;
      } catch {
        throw new CliSafetyError("profile rollback could not restore its retained backup");
      }
    },
  };
}

export async function recoverProfileTransaction(
  home: string,
  reference: ProfileTransactionRecoveryReference,
  assertLockOwned: () => Promise<void>,
): Promise<void> {
  assertSafeProfileName(reference.profile);
  const journalPrefix = `profiles/.dsh-plugins-transaction-${reference.profile}-`;
  const backupPrefix = `profiles/.dsh-plugins-backup-${reference.profile}-`;
  if (
    !Number.isSafeInteger(reference.fencingToken) || reference.fencingToken <= 0 ||
    !reference.journalRelativePath.startsWith(journalPrefix) ||
    !reference.journalRelativePath.endsWith(".json") ||
    reference.journalRelativePath.includes("\\") ||
    reference.journalRelativePath.includes("..") ||
    !reference.backupRelativePath.startsWith(backupPrefix) ||
    reference.backupRelativePath.includes("\\") ||
    reference.backupRelativePath.includes("..")
  ) {
    throw new CliSafetyError("profile recovery reference is invalid");
  }
  const canonicalHome = await ensureCanonicalHome(home);
  const profiles = await ensureContainedDirectory(canonicalHome, "profiles");
  const journal = join(canonicalHome, reference.journalRelativePath);
  const backup = join(canonicalHome, reference.backupRelativePath);
  const active = join(profiles, reference.profile);
  const displaced = `${backup}.displaced`;
  let value: TransactionJournal;
  try {
    value = JSON.parse(await readFile(journal, "utf8")) as TransactionJournal;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw new CliSafetyError("profile transaction recovery journal is invalid");
  }
  if (
    value.version !== 1 ||
    value.profile !== reference.profile ||
    value.fencingToken !== reference.fencingToken ||
    value.existed !== reference.existed ||
    `profiles/${value.backupName}` !== reference.backupRelativePath ||
    (reference.backupFingerprint !== undefined &&
      value.backupFingerprint !== reference.backupFingerprint)
  ) {
    throw new CliSafetyError("profile transaction recovery journal is invalid");
  }
  await assertLockOwned();
  try {
    if (!reference.existed) {
      if (await activeExists(active)) await rename(active, displaced);
      return;
    }
    const expected = reference.backupFingerprint ?? value.backupFingerprint;
    if (typeof expected !== "string") {
      throw new CliSafetyError("profile recovery fingerprint is unavailable");
    }
    let backupPresent = false;
    try {
      backupPresent = await activeExists(backup);
    } catch {
      throw new CliSafetyError("profile recovery requires the retained backup");
    }
    if (backupPresent) {
      if (await profileFingerprint(backup) !== expected) {
        throw new CliSafetyError("profile recovery backup fingerprint changed");
      }
      if (await activeExists(active)) {
        if (await profileFingerprint(active) === expected) return;
        if (await activeExists(displaced)) {
          throw new CliSafetyError("profile recovery quarantine already exists");
        }
        await rename(active, displaced);
      }
      await rename(backup, active);
    }
    if (!await activeExists(active) || await profileFingerprint(active) !== expected) {
      throw new CliSafetyError("profile recovery requires the retained backup");
    }
  } catch {
    throw new CliSafetyError("profile recovery requires the retained backup");
  }
}

export async function finalizeProfileTransactionRecovery(
  home: string,
  reference: ProfileTransactionRecoveryReference,
  assertLockOwned: () => Promise<void>,
): Promise<void> {
  assertSafeProfileName(reference.profile);
  const canonicalHome = await ensureCanonicalHome(home);
  await ensureContainedDirectory(canonicalHome, "profiles");
  const journal = join(canonicalHome, reference.journalRelativePath);
  const backup = join(canonicalHome, reference.backupRelativePath);
  await assertLockOwned();
  await rm(backup, { recursive: true, force: true });
  await rm(`${backup}.displaced`, { recursive: true, force: true });
  await rm(journal, { force: true });
}
