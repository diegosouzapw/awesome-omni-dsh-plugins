import { randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import {
  lstat,
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  rm,
} from "node:fs/promises";
import { join } from "node:path";

import { CliSafetyError } from "../errors.js";
import type { ArtifactChannelDescriptor } from "./artifactChannel.js";
import type { InstalledPlugin } from "./installState.js";
import { ensureCanonicalHome, ensureContainedDirectory } from "./paths.js";
import type { ProfileTransactionRecoveryReference } from "./profileTransaction.js";
import type { DshProcessTreeIdentity } from "./runDsh.js";
import type { ArtifactRecoveryReference } from "./staging.js";

export type MutationRecoveryPhase =
  | "needs_restore"
  | "profile_restored"
  | "dsh_succeeded"
  | "state_published"
  | "profile_finalized"
  | "artifact_released"
  | "completed";

export type MutationDecision = "undecided" | "rollback" | "roll_forward";

export interface MutationStateEvidence {
  readonly oldGeneration: number;
  readonly oldFingerprint: string;
  readonly oldInstalls: readonly InstalledPlugin[];
  readonly intendedFingerprint: string;
  readonly intendedInstalls: readonly InstalledPlugin[];
}

export interface MutationRecoveryJournal {
  readonly version: 1;
  readonly revision: number;
  readonly status: "in_progress" | "recovery_required" | "completed";
  readonly phase: MutationRecoveryPhase;
  readonly decision?: MutationDecision;
  readonly stateEvidence?: MutationStateEvidence;
  readonly activeFingerprint?: string;
  readonly ownerToken: string;
  readonly fencingToken: number;
  readonly profile: string;
  readonly transaction: ProfileTransactionRecoveryReference;
  readonly artifact: ArtifactRecoveryReference | null;
  readonly channel: ArtifactChannelDescriptor | null;
  readonly processTree?: DshProcessTreeIdentity;
  readonly createdAt: string;
}

export interface MutationRecoveryJournalInput {
  readonly ownerToken: string;
  readonly fencingToken: number;
  readonly profile: string;
  readonly transaction: ProfileTransactionRecoveryReference;
  readonly artifact: ArtifactRecoveryReference | null;
  readonly channel: ArtifactChannelDescriptor | null;
  readonly createdAt: string;
  readonly decision?: MutationDecision;
  readonly stateEvidence?: MutationStateEvidence;
  readonly activeFingerprint?: string;
}

export interface MutationRecoveryJournalPatch {
  readonly status?: MutationRecoveryJournal["status"];
  readonly phase?: MutationRecoveryPhase;
  readonly ownerToken?: string;
  readonly fencingToken?: number;
  readonly processTree?: DshProcessTreeIdentity;
  readonly decision?: MutationDecision;
  readonly activeFingerprint?: string;
}

export interface MutationRecoveryJournalIoDependencies {
  readonly syncDirectory?: (path: string) => Promise<void>;
  readonly beforeRename?: () => Promise<void>;
  readonly afterRename?: () => Promise<void>;
}

export class MutationRecoveryJournalDurabilityAmbiguousError extends CliSafetyError {
  readonly possiblyPublished = true;

  constructor(operation: "update" | "remove") {
    super(
      operation === "update"
        ? "mutation recovery journal update may already be visible; reconcile from disk"
        : "mutation recovery journal removal may already be visible; reconcile from disk",
    );
    this.name = "MutationRecoveryJournalDurabilityAmbiguousError";
  }
}

export class MutationRecoveryJournalAuthorityUnknownError extends CliSafetyError {
  readonly authorityUnknown = true;

  constructor() {
    super("mutation recovery journal authority is unknown; recovery resources remain retained");
    this.name = "MutationRecoveryJournalAuthorityUnknownError";
  }
}

interface JournalPaths {
  readonly recoveryRoot: string;
  readonly active: string;
  readonly marker: string;
}

const SRI = /^sha512-[A-Za-z0-9+/]{86}==$/u;
const SAFE_TOKEN = /^[A-Za-z0-9._:-]{1,256}$/u;
const PHASES = new Set<MutationRecoveryPhase>([
  "needs_restore",
  "profile_restored",
  "dsh_succeeded",
  "state_published",
  "profile_finalized",
  "artifact_released",
  "completed",
]);

const STATE_FINGERPRINT = /^sha256:[0-9a-f]{64}$/u;

function isInstalledPlugin(value: unknown): value is InstalledPlugin {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && record.id.length <= 128 &&
    typeof record.profile === "string" && record.profile.length <= 64 &&
    typeof record.packageName === "string" && record.packageName.length <= 256 &&
    typeof record.fingerprint === "string" && record.fingerprint.length <= 512 &&
    typeof record.cacheRelativePath === "string" && record.cacheRelativePath.length <= 1024 &&
    typeof record.installedAt === "string" && Number.isFinite(Date.parse(record.installedAt));
}

function validateStateEvidence(record: Record<string, unknown>): void {
  const decision = record.decision;
  const evidence = record.stateEvidence;
  const activeFingerprint = record.activeFingerprint;
  if (decision === undefined && evidence === undefined && activeFingerprint === undefined) return;
  if (
    !["undecided", "rollback", "roll_forward"].includes(String(decision)) ||
    typeof evidence !== "object" || evidence === null || Array.isArray(evidence)
  ) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
  const state = evidence as Record<string, unknown>;
  if (
    !Number.isSafeInteger(state.oldGeneration) || Number(state.oldGeneration) < 0 ||
    typeof state.oldFingerprint !== "string" || !STATE_FINGERPRINT.test(state.oldFingerprint) ||
    typeof state.intendedFingerprint !== "string" ||
      !STATE_FINGERPRINT.test(state.intendedFingerprint) ||
    !Array.isArray(state.oldInstalls) || state.oldInstalls.length > 10_000 ||
    state.oldInstalls.some((install) => !isInstalledPlugin(install)) ||
    !Array.isArray(state.intendedInstalls) || state.intendedInstalls.length > 10_000 ||
    state.intendedInstalls.some((install) => !isInstalledPlugin(install)) ||
    !(activeFingerprint === undefined ||
      (typeof activeFingerprint === "string" && SRI.test(activeFingerprint)))
  ) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
}

async function syncDirectory(path: string): Promise<void> {
  try {
    const handle = await open(path, fsConstants.O_RDONLY);
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (process.platform !== "win32" || !["EINVAL", "EPERM", "EISDIR"].includes(code ?? "")) {
      throw error;
    }
  }
}

async function createPaths(home: string): Promise<JournalPaths> {
  const canonicalHome = await ensureCanonicalHome(home);
  const recoveryRoot = await ensureContainedDirectory(canonicalHome, ".dsh-plugins", "recovery");
  return {
    recoveryRoot,
    active: join(recoveryRoot, "active"),
    marker: join(recoveryRoot, "active", "marker.json"),
  };
}

async function existingPaths(home: string): Promise<JournalPaths | null> {
  let canonicalHome: string;
  try {
    canonicalHome = await realpath(home);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new CliSafetyError("mutation recovery journal could not be inspected safely");
  }
  const dshPlugins = join(canonicalHome, ".dsh-plugins");
  const recoveryRoot = join(dshPlugins, "recovery");
  const active = join(recoveryRoot, "active");
  try {
    for (const path of [dshPlugins, recoveryRoot, active]) {
      const info = await lstat(path);
      if (info.isSymbolicLink() || !info.isDirectory()) {
        throw new CliSafetyError("mutation recovery journal requires manual recovery");
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("mutation recovery journal could not be inspected safely");
  }
  return { recoveryRoot, active, marker: join(active, "marker.json") };
}

function safeRelative(value: unknown, prefix: string): value is string {
  return typeof value === "string" && value.startsWith(prefix) &&
    !value.includes("\\") && !value.includes("..") && !value.startsWith("/");
}

function parseProcessTree(value: unknown): DshProcessTreeIdentity | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
  const record = value as Record<string, unknown>;
  if (
    !Number.isSafeInteger(record.pid) || Number(record.pid) <= 0 ||
    !(record.processGroupId === null ||
      (Number.isSafeInteger(record.processGroupId) && Number(record.processGroupId) > 0)) ||
    typeof record.treeIdentity !== "string" || record.treeIdentity.length > 512 ||
    !(record.processStartIdentity === null || typeof record.processStartIdentity === "string") ||
    typeof record.platform !== "string"
  ) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
  const members = record.members;
  if (members !== undefined && (!Array.isArray(members) || members.some((member) => {
    if (typeof member !== "object" || member === null || Array.isArray(member)) return true;
    const candidate = member as Record<string, unknown>;
    return !Number.isSafeInteger(candidate.pid) || Number(candidate.pid) <= 0 ||
      typeof candidate.creationIdentity !== "string" || candidate.creationIdentity.length > 256;
  }))) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
  return record as unknown as DshProcessTreeIdentity;
}

function parseJournal(value: unknown): MutationRecoveryJournal {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
  const record = value as Record<string, unknown>;
  const transaction = record.transaction as Record<string, unknown> | undefined;
  const artifact = record.artifact as Record<string, unknown> | null | undefined;
  const channel = record.channel as Record<string, unknown> | null | undefined;
  if (
    record.version !== 1 || !Number.isSafeInteger(record.revision) || Number(record.revision) <= 0 ||
    !["in_progress", "recovery_required", "completed"].includes(String(record.status)) ||
    !PHASES.has(record.phase as MutationRecoveryPhase) ||
    typeof record.ownerToken !== "string" || !SAFE_TOKEN.test(record.ownerToken) ||
    !Number.isSafeInteger(record.fencingToken) || Number(record.fencingToken) <= 0 ||
    typeof record.profile !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u.test(record.profile) ||
    typeof record.createdAt !== "string" || !Number.isFinite(Date.parse(record.createdAt)) ||
    transaction === undefined || transaction.profile !== record.profile ||
    (Number(record.revision) === 1 && transaction.fencingToken !== record.fencingToken) ||
    typeof transaction.existed !== "boolean" ||
    !safeRelative(transaction.journalRelativePath, "profiles/.dsh-plugins-transaction-") ||
    !safeRelative(transaction.backupRelativePath, "profiles/.dsh-plugins-backup-") ||
    !(transaction.backupFingerprint === null ||
      (typeof transaction.backupFingerprint === "string" && SRI.test(transaction.backupFingerprint))) ||
    !(artifact === null || artifact !== undefined &&
      safeRelative(artifact.relativePath, ".dsh-plugins/artifact-leases/.lease-") &&
      typeof artifact.sha512 === "string" && SRI.test(artifact.sha512) &&
      Number.isSafeInteger(artifact.bytes) && Number(artifact.bytes) > 0 &&
      typeof artifact.packageName === "string") ||
    !(channel === null || channel !== undefined && channel.kind === "loopback-buffer-v1" &&
      typeof channel.sha512 === "string" && SRI.test(channel.sha512) &&
      Number.isSafeInteger(channel.bytes) && Number(channel.bytes) > 0 &&
      typeof channel.sourceFingerprint === "string" && channel.sourceFingerprint.length <= 256)
  ) {
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
  parseProcessTree(record.processTree);
  validateStateEvidence(record);
  return record as unknown as MutationRecoveryJournal;
}

async function writeMarker(
  paths: JournalPaths,
  value: MutationRecoveryJournal,
  dependencies: MutationRecoveryJournalIoDependencies = {},
): Promise<void> {
  const temporary = join(paths.active, `.marker-${randomUUID()}.tmp`);
  const handle = await open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(value)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  await rename(temporary, paths.marker);
  try {
    await (dependencies.syncDirectory ?? syncDirectory)(paths.active);
  } catch {
    throw new MutationRecoveryJournalDurabilityAmbiguousError("update");
  }
}

export async function readMutationRecoveryJournal(
  home: string,
): Promise<MutationRecoveryJournal | null> {
  const paths = await existingPaths(home);
  if (paths === null) return null;
  try {
    return parseJournal(JSON.parse(await readFile(paths.marker, "utf8")) as unknown);
  } catch (error) {
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("mutation recovery journal requires manual recovery");
  }
}

export async function createMutationRecoveryJournal(
  home: string,
  input: MutationRecoveryJournalInput,
): Promise<MutationRecoveryJournal> {
  const paths = await createPaths(home);
  try {
    await mkdir(paths.active, { mode: 0o700 });
    await syncDirectory(paths.recoveryRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new CliSafetyError("recovery is required before any new mutation can run");
    }
    throw new CliSafetyError("durable recovery intent could not be created");
  }
  const value = parseJournal({
    version: 1,
    revision: 1,
    status: "in_progress",
    phase: "needs_restore",
    ...input,
  });
  try {
    await writeMarker(paths, value);
    return value;
  } catch {
    // The active directory deliberately remains as a fail-closed barrier.
    throw new CliSafetyError("durable recovery intent could not be published");
  }
}

export async function updateMutationRecoveryJournal(
  home: string,
  expected: MutationRecoveryJournal,
  patch: MutationRecoveryJournalPatch,
  dependencies: MutationRecoveryJournalIoDependencies = {},
): Promise<MutationRecoveryJournal> {
  const paths = await existingPaths(home);
  if (paths === null) throw new CliSafetyError("durable recovery intent is missing");
  const current = await readMutationRecoveryJournal(home);
  if (
    current === null || current.revision !== expected.revision ||
    current.ownerToken !== expected.ownerToken || current.fencingToken !== expected.fencingToken
  ) {
    throw new CliSafetyError("durable recovery intent ownership changed; recovery required");
  }
  const next = parseJournal({ ...current, ...patch, revision: current.revision + 1 });
  await writeMarker(paths, next, dependencies);
  return next;
}

export async function removeCompletedMutationRecoveryJournal(
  home: string,
  expected: MutationRecoveryJournal,
  dependencies: MutationRecoveryJournalIoDependencies = {},
): Promise<void> {
  if (expected.phase !== "completed" || expected.status !== "completed") {
    throw new CliSafetyError("durable recovery intent cannot be removed yet");
  }
  const paths = await existingPaths(home);
  if (paths === null) return;
  const current = await readMutationRecoveryJournal(home);
  if (
    current === null || current.revision !== expected.revision ||
    current.ownerToken !== expected.ownerToken || current.fencingToken !== expected.fencingToken ||
    current.phase !== "completed"
  ) {
    throw new CliSafetyError("durable recovery intent ownership changed; recovery required");
  }
  const completed = join(paths.recoveryRoot, `.completed-${randomUUID()}`);
  await dependencies.beforeRename?.();
  await rename(paths.active, completed);
  try {
    await dependencies.afterRename?.();
    await (dependencies.syncDirectory ?? syncDirectory)(paths.recoveryRoot);
    await rm(completed, { recursive: true, force: true });
  } catch {
    throw new MutationRecoveryJournalDurabilityAmbiguousError("remove");
  }
}
