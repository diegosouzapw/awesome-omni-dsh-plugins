import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, realpath, rm } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

import type { PublicCatalogEntry } from "../model.js";
import { sanitizedErrorMessage, CliSafetyError } from "../errors.js";
import {
  openArtifactDeliveryChannel,
  type ArtifactDeliveryChannel,
} from "../dsh/artifactChannel.js";
import {
  EMPTY_INSTALL_STATE,
  readInstallState,
  resolveDshHome,
  writeInstallState,
  type InstallState,
  type InstallStateWriteOptions,
  type ArtifactRecoveryReference,
  type RecoveryProcessTreeIdentity,
  type RecoveryRequiredMarker,
} from "../dsh/installState.js";
import { acquireProfileLock, type ProfileLock } from "../dsh/profileLock.js";
import {
  beginProfileTransaction,
  finalizeProfileTransactionRecovery,
  profileFingerprint,
  recoverProfileTransaction,
  type ProfileTransaction,
  type ProfileTransactionOptions,
  type ProfileTransactionRecoveryReference,
} from "../dsh/profileTransaction.js";
import { fingerprintInstallState } from "../dsh/stateEvidence.js";
import {
  createMutationRecoveryJournal,
  MutationRecoveryJournalAuthorityUnknownError,
  MutationRecoveryJournalDurabilityAmbiguousError,
  readMutationRecoveryJournal,
  removeCompletedMutationRecoveryJournal,
  updateMutationRecoveryJournal,
  type MutationRecoveryJournal,
  type MutationRecoveryJournalInput,
  type MutationRecoveryJournalPatch,
} from "../dsh/mutationRecoveryJournal.js";
import {
  assertSafeProfileName,
  ensureCanonicalHome,
  ensureContainedDirectory,
  isPathWithin,
} from "../dsh/paths.js";
import {
  DshExecutionUncertainError,
  isDshProcessTreeAlive,
  runDsh,
  type RunDshDependencies,
} from "../dsh/runDsh.js";
import {
  stageCatalogEntry,
  type StagedArtifactLease,
  type StagedCatalogInstall,
} from "../dsh/staging.js";

export type PluginMutationOperation = "add" | "update" | "remove";

export interface PluginMutationOptions {
  readonly operation: PluginMutationOperation;
  readonly entry?: PublicCatalogEntry;
  readonly id?: string;
  readonly profile: string;
  readonly dryRun: boolean;
  readonly allowCodeExecution: boolean;
}

export interface RecoveryDependencies {
  readonly platform: NodeJS.Platform;
  readonly dshHome: string;
  readonly acquireLock: (home: string, profile: string) => Promise<ProfileLock>;
  readonly readState: (home: string) => Promise<InstallState>;
  readonly writeState: (
    home: string,
    state: InstallState,
    options: InstallStateWriteOptions,
  ) => Promise<InstallState | void>;
  readonly isProcessTreeAlive: (identity: RecoveryProcessTreeIdentity) => Promise<boolean>;
  readonly recoverTransaction: (
    home: string,
    reference: ProfileTransactionRecoveryReference,
    assertLockOwned: () => Promise<void>,
  ) => Promise<void>;
  readonly finalizeRecoveredTransaction: (
    home: string,
    reference: ProfileTransactionRecoveryReference,
    assertLockOwned: () => Promise<void>,
  ) => Promise<void>;
  readonly releaseRecoveredArtifact: (
    home: string,
    reference: ArtifactRecoveryReference,
  ) => Promise<void>;
  readonly readRecoveryJournal: (home: string) => Promise<MutationRecoveryJournal | null>;
  readonly updateRecoveryJournal: (
    home: string,
    expected: MutationRecoveryJournal,
    patch: MutationRecoveryJournalPatch,
  ) => Promise<MutationRecoveryJournal>;
  readonly removeRecoveryJournal: (
    home: string,
    expected: MutationRecoveryJournal,
  ) => Promise<void>;
  readonly stdout: (value: string) => void;
  readonly stderr: (value: string) => void;
  readonly fingerprintActiveProfile: (dshHome: string, profile: string) => Promise<string>;
}

export interface MutationDependencies extends RecoveryDependencies {
  readonly stageEntry: (
    entry: PublicCatalogEntry,
    options: { dshHome: string },
  ) => Promise<StagedCatalogInstall>;
  readonly runDsh: (
    profile: string,
    args: readonly string[],
    dependencies?: Pick<RunDshDependencies, "onSpawn">,
  ) => Promise<number>;
  readonly beginTransaction: (
    home: string,
    profile: string,
    options: ProfileTransactionOptions,
  ) => Promise<ProfileTransaction>;
  readonly openArtifactChannel: (
    lease: StagedArtifactLease,
    options: { sourceFingerprint: string },
  ) => Promise<ArtifactDeliveryChannel>;
  readonly createRecoveryJournal: (
    home: string,
    input: MutationRecoveryJournalInput,
  ) => Promise<MutationRecoveryJournal>;
  readonly now: () => Date;
}

async function releaseRecoveredArtifact(
  home: string,
  reference: ArtifactRecoveryReference,
): Promise<void> {
  const canonicalHome = await ensureCanonicalHome(home);
  const leasesRoot = await ensureContainedDirectory(
    canonicalHome,
    ".dsh-plugins",
    "artifact-leases",
  );
  const artifact = resolve(canonicalHome, reference.relativePath);
  const leaseRoot = dirname(artifact);
  if (
    !isPathWithin(leasesRoot, artifact) ||
    dirname(leaseRoot) !== leasesRoot ||
    !basename(leaseRoot).startsWith(".lease-") ||
    basename(artifact) !== "artifact.tgz"
  ) {
    throw new CliSafetyError("artifact recovery reference is unsafe");
  }
  try {
    const leaseInfo = await lstat(leaseRoot);
    const artifactInfo = await lstat(artifact);
    const canonicalArtifact = await realpath(artifact);
    if (
      leaseInfo.isSymbolicLink() || !leaseInfo.isDirectory() ||
      artifactInfo.isSymbolicLink() || !artifactInfo.isFile() ||
      artifactInfo.size !== reference.bytes ||
      !isPathWithin(leasesRoot, canonicalArtifact)
    ) {
      throw new CliSafetyError("artifact recovery reference is unsafe");
    }
    const hash = createHash("sha512");
    let bytes = 0;
    for await (const chunk of createReadStream(artifact)) {
      const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += data.byteLength;
      if (bytes > reference.bytes) throw new CliSafetyError("recovery artifact changed");
      hash.update(data);
    }
    if (bytes !== reference.bytes || `sha512-${hash.digest("base64")}` !== reference.sha512) {
      throw new CliSafetyError("recovery artifact changed");
    }
    await rm(leaseRoot, { recursive: true, force: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("recovery artifact could not be released safely");
  }
}

const defaultRecoveryDependencies: RecoveryDependencies = {
  platform: process.platform,
  dshHome: resolveDshHome(),
  acquireLock: acquireProfileLock,
  readState: readInstallState,
  writeState: writeInstallState,
  isProcessTreeAlive: isDshProcessTreeAlive,
  recoverTransaction: recoverProfileTransaction,
  finalizeRecoveredTransaction: finalizeProfileTransactionRecovery,
  releaseRecoveredArtifact,
  readRecoveryJournal: readMutationRecoveryJournal,
  updateRecoveryJournal: updateMutationRecoveryJournal,
  removeRecoveryJournal: removeCompletedMutationRecoveryJournal,
  stdout: (value) => process.stdout.write(value),
  stderr: (value) => process.stderr.write(value),
  fingerprintActiveProfile: async (home, profile) =>
    profileFingerprint(resolve(home, "profiles", profile)),
};

const defaultDependencies: MutationDependencies = {
  ...defaultRecoveryDependencies,
  stageEntry: stageCatalogEntry,
  runDsh,
  beginTransaction: beginProfileTransaction,
  openArtifactChannel: openArtifactDeliveryChannel,
  createRecoveryJournal: createMutationRecoveryJournal,
  now: () => new Date(),
};

function expectedJournalAfterPatch(
  expected: MutationRecoveryJournal,
  patch: MutationRecoveryJournalPatch,
): MutationRecoveryJournal {
  return {
    ...expected,
    ...patch,
    revision: expected.revision + 1,
  };
}

export async function updateJournalAuthoritatively(
  dependencies: RecoveryDependencies,
  home: string,
  expected: MutationRecoveryJournal,
  patch: MutationRecoveryJournalPatch,
): Promise<MutationRecoveryJournal> {
  const update = dependencies.updateRecoveryJournal;
  try {
    return await update(home, expected, patch);
  } catch (error) {
    if (
      !(error instanceof MutationRecoveryJournalDurabilityAmbiguousError) ||
      error.possiblyPublished !== true
    ) {
      throw error;
    }
    let visible: MutationRecoveryJournal | null;
    try {
      visible = await dependencies.readRecoveryJournal(home);
    } catch {
      throw new MutationRecoveryJournalAuthorityUnknownError();
    }
    if (
      visible !== null &&
      isDeepStrictEqual(visible, expectedJournalAfterPatch(expected, patch))
    ) {
      return visible;
    }
    throw new MutationRecoveryJournalAuthorityUnknownError();
  }
}

function describeEntry(entry: PublicCatalogEntry | undefined, id: string): string[] {
  if (entry === undefined) return [`Plugin: ${id}`];
  return [
    `Plugin: ${entry.id} (${entry.name})`,
    `Creator: @${entry.creator.github}`,
    `Repository: ${entry.source.repository}@${entry.source.commit}`,
    `License: ${entry.license.spdx}`,
    `Verification: ${entry.verification.status}`,
  ];
}

function planVerb(operation: PluginMutationOperation): "add" | "remove" {
  return operation === "remove" ? "remove" : "add";
}

function writeDryRunPlan(
  dependencies: MutationDependencies,
  options: PluginMutationOptions,
  id: string,
): void {
  for (const line of describeEntry(options.entry, id)) dependencies.stdout(`${line}\n`);
  dependencies.stdout(
    `DSH command: dsh plugin --profile ${options.profile} ` +
      `${planVerb(options.operation)} <catalog-artifact:${id}>\n`,
  );
  dependencies.stdout(
    "Dry run: install state, profile, cache, and subprocesses were not accessed.\n",
  );
  dependencies.stdout("Dry run: no files or processes changed.\n");
}

function validateInstallableEntry(
  options: PluginMutationOptions,
  id: string,
  dependencies: MutationDependencies,
): boolean {
  if (options.operation === "remove") return true;
  if (options.entry === undefined) {
    dependencies.stderr(`Plugin not found: ${id}\n`);
    return false;
  }
  if (options.entry.kind !== "plugin") {
    dependencies.stderr(`${id} is not an installable native plugin.\n`);
    return false;
  }
  if (!options.entry.dsh.profiles.includes(options.profile)) {
    dependencies.stderr(`${id} does not declare support for profile ${options.profile}.\n`);
    return false;
  }
  if (
    options.entry.verification.status !== "eligible" &&
    options.entry.verification.status !== "verified"
  ) {
    dependencies.stderr(
      `Plugin ${id} is ${options.entry.verification.status} and cannot be installed.\n`,
    );
    return false;
  }
  return true;
}

export async function executePluginMutation(
  options: PluginMutationOptions,
  overrides: Partial<MutationDependencies> = {},
): Promise<number> {
  const dependencies: MutationDependencies = { ...defaultDependencies, ...overrides };
  const id = options.entry?.id ?? options.id;
  if (id === undefined || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) {
    dependencies.stderr("Plugin ID is unsafe.\n");
    return 1;
  }
  try {
    assertSafeProfileName(options.profile);
  } catch (error) {
    dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
    return 1;
  }

  if (options.dryRun) {
    if (!validateInstallableEntry(options, id, dependencies)) return 1;
    writeDryRunPlan(dependencies, options, id);
    return 0;
  }
  if (dependencies.platform === "win32") {
    dependencies.stderr(
      "Plugin mutations with code execution are disabled on native Windows " +
        "because complete process-tree containment cannot be proven. Use WSL.\n",
    );
    return 1;
  }
  let staged: StagedCatalogInstall | undefined;
  let artifactLease: StagedArtifactLease | undefined;
  let artifactChannel: ArtifactDeliveryChannel | undefined;
  let recoveryJournal: MutationRecoveryJournal | undefined;
  let retainArtifact = false;
  let retainChannel = false;
  let retainLock = false;
  let lock: ProfileLock;
  try {
    lock = await dependencies.acquireLock(dependencies.dshHome, options.profile);
  } catch (error) {
    dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
    return 1;
  }

  try {
    try {
      const pending = await dependencies.readRecoveryJournal(dependencies.dshHome);
      if (pending !== null) {
        dependencies.stderr("Recovery is required before any new plugin mutation can run.\n");
        return 1;
      }
    } catch (error) {
      dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
      return 1;
    }
    let state: InstallState;
    try {
      state = await dependencies.readState(dependencies.dshHome);
    } catch (error) {
      dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
      return 1;
    }
    if (state.recoveryRequired !== undefined) {
      dependencies.stderr(
        "Recovery is required before any new plugin mutation can run.\n",
      );
      return 1;
    }
    const current = state.installs.find(
      (install) => install.id === id && install.profile === options.profile,
    );
    if (options.operation === "remove" && current === undefined) {
      dependencies.stdout(`${id} is not installed by dsh-plugins in profile ${options.profile}.\n`);
      return 0;
    }
    if (!options.allowCodeExecution) {
      dependencies.stderr(
        "Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.\n" +
          "Consent required: rerun with --allow-code-execution because DSH delegates to pnpm " +
          "and may execute package lifecycle code.\n",
      );
      return 2;
    }
    if (!validateInstallableEntry(options, id, dependencies)) return 1;
    try {
      if (options.operation !== "remove") {
        if (options.entry === undefined) throw new CliSafetyError("catalog entry is required");
        staged = await dependencies.stageEntry(options.entry, { dshHome: dependencies.dshHome });
        artifactLease = staged.artifactLease;
      }
    } catch (error) {
      dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
      return 1;
    }
    if (options.operation !== "remove" && current?.fingerprint === staged?.fingerprint) {
      dependencies.stdout(
        `${id} already matches the pinned catalog artifact in profile ${options.profile}.\n`,
      );
      return 0;
    }

    const intendedInstalls = state.installs.filter(
      (install) => !(install.id === id && install.profile === options.profile),
    );
    if (options.operation !== "remove") {
      if (staged === undefined) throw new CliSafetyError("verified staging is unavailable");
      intendedInstalls.push({
        id,
        profile: options.profile,
        packageName: staged.packageName,
        fingerprint: staged.fingerprint,
        cacheRelativePath: staged.cacheRelativePath,
        installedAt: dependencies.now().toISOString(),
      });
    }
    intendedInstalls.sort(
      (left, right) =>
        left.profile.localeCompare(right.profile) || left.id.localeCompare(right.id),
    );
    const oldFingerprint = fingerprintInstallState(state.installs);
    const intendedFingerprint = fingerprintInstallState(intendedInstalls);

    for (const line of describeEntry(options.entry, id)) dependencies.stdout(`${line}\n`);
    const target = options.operation === "remove"
      ? current?.packageName ?? id
      : staged?.displayTarget ?? `<verified-staging:${id}>`;
    dependencies.stdout(
      `DSH command: dsh plugin --profile ${options.profile} ` +
        `${planVerb(options.operation)} ${target}\n`,
    );

    let transaction: ProfileTransaction | undefined;
    let rollForwardDecided = false;
    try {
      transaction = await dependencies.beginTransaction(dependencies.dshHome, options.profile, {
        fencingToken: lock.fencingToken,
        committedFencingToken: state.fencingToken ?? 0,
        assertLockOwned: lock.assertOwned,
      });
      await artifactLease?.revalidate();
      if (artifactLease !== undefined && staged !== undefined) {
        artifactChannel = await dependencies.openArtifactChannel(artifactLease, {
          sourceFingerprint: staged.fingerprint,
        });
      }
      recoveryJournal = await dependencies.createRecoveryJournal(dependencies.dshHome, {
        ownerToken: lock.ownerToken,
        fencingToken: lock.fencingToken,
        profile: options.profile,
        transaction: transaction.recoveryReference,
        artifact: artifactLease?.recoveryReference ?? null,
        channel: artifactChannel?.descriptor ?? null,
        createdAt: dependencies.now().toISOString(),
        decision: "undecided",
        stateEvidence: {
          oldGeneration: state.generation ?? 0,
          oldFingerprint,
          oldInstalls: state.installs,
          intendedFingerprint,
          intendedInstalls,
        },
      });
      const args = options.operation === "remove"
        ? ["remove", current?.packageName ?? id]
        : ["add", artifactChannel?.installTarget ?? ""];
      const exitCode = await dependencies.runDsh(options.profile, args, {
        onSpawn: async (processTree) => {
          if (recoveryJournal === undefined) {
            throw new CliSafetyError("durable recovery intent is missing");
          }
          recoveryJournal = await updateJournalAuthoritatively(dependencies, 
            dependencies.dshHome,
            recoveryJournal,
            { processTree },
          );
        },
      });
      if (exitCode !== 0) {
        if (recoveryJournal === undefined) {
          throw new CliSafetyError("durable recovery intent is missing");
        }
        recoveryJournal = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          recoveryJournal,
          { decision: "rollback", status: "recovery_required" },
        );
        await transaction.rollback();
        recoveryJournal = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          recoveryJournal,
          { phase: "profile_restored", status: "recovery_required" },
        );
        recoveryJournal = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          recoveryJournal,
          { phase: "profile_finalized", status: "recovery_required" },
        );
        await artifactChannel?.close();
        artifactChannel = undefined;
        await artifactLease?.release();
        artifactLease = undefined;
        recoveryJournal = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          recoveryJournal,
          { phase: "artifact_released", status: "recovery_required" },
        );
        recoveryJournal = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          recoveryJournal,
          { status: "completed", phase: "completed" },
        );
        await dependencies.removeRecoveryJournal(dependencies.dshHome, recoveryJournal);
        recoveryJournal = undefined;
        if (exitCode === 127) {
          // POSIX shells report "command not found" as exit 127 — the dsh
          // wrapper (or the pnpm it delegates to) is missing from PATH.
          dependencies.stderr(
            "DSH (or pnpm) was not found on PATH (exit 127); install DeepSeek Harness and " +
              "make sure the 'dsh' command resolves, then retry. " +
              "The previous profile was restored.\n",
          );
        } else {
          dependencies.stderr("DSH rejected the mutation; the previous profile was restored.\n");
        }
        return 1;
      }

      if (recoveryJournal === undefined) {
        throw new CliSafetyError("durable recovery intent is missing");
      }
      const activeFingerprint = await dependencies.fingerprintActiveProfile(
        dependencies.dshHome,
        options.profile,
      );
      recoveryJournal = await updateJournalAuthoritatively(dependencies, 
        dependencies.dshHome,
        recoveryJournal,
        {
          decision: "roll_forward",
          phase: "dsh_succeeded",
          status: "recovery_required",
          activeFingerprint,
        },
      );
      rollForwardDecided = true;
      await lock.assertOwned();
      await dependencies.writeState(
        dependencies.dshHome,
        { version: 1, installs: intendedInstalls },
        {
          expectedGeneration: state.generation ?? 0,
          fencingToken: lock.fencingToken,
          assertLockOwned: lock.assertOwned,
        },
      );
      recoveryJournal = await updateJournalAuthoritatively(dependencies, 
        dependencies.dshHome,
        recoveryJournal,
        { phase: "state_published", status: "recovery_required" },
      );
      await transaction.commit();
      recoveryJournal = await updateJournalAuthoritatively(dependencies, 
        dependencies.dshHome,
        recoveryJournal,
        { phase: "profile_finalized", status: "recovery_required" },
      );
      await artifactChannel?.close();
      artifactChannel = undefined;
      await artifactLease?.release();
      artifactLease = undefined;
      recoveryJournal = await updateJournalAuthoritatively(dependencies, 
        dependencies.dshHome,
        recoveryJournal,
        { phase: "artifact_released", status: "recovery_required" },
      );
      recoveryJournal = await updateJournalAuthoritatively(dependencies, 
        dependencies.dshHome,
        recoveryJournal,
        { status: "completed", phase: "completed" },
      );
      await dependencies.removeRecoveryJournal(dependencies.dshHome, recoveryJournal);
      recoveryJournal = undefined;
      dependencies.stdout(
        `${id} ${options.operation === "remove" ? "removed from" : "installed in"} ` +
          `profile ${options.profile}.\n`,
      );
      return 0;
    } catch (error) {
      if (error instanceof MutationRecoveryJournalAuthorityUnknownError) {
        retainArtifact = true;
        retainChannel = true;
        retainLock = true;
        dependencies.stderr(
          "Recovery journal authority is unknown; profile, journal, artifact, and lock remain retained.\n",
        );
        return 1;
      }
      if (
        error instanceof DshExecutionUncertainError &&
        error.reaped === false
      ) {
        retainArtifact = true;
        retainChannel = true;
        retainLock = true;
        if (recoveryJournal !== undefined) {
          const emergencyUpdate = updateJournalAuthoritatively(dependencies, 
            dependencies.dshHome,
            recoveryJournal,
            {
              status: "recovery_required",
              ...(error.processTree === null ? {} : { processTree: error.processTree }),
            },
          ).then((next) => {
            recoveryJournal = next;
            return true;
          }, () => false);
          const persisted = await Promise.race([
            emergencyUpdate,
            new Promise<false>((resolveTimeout) => {
              const timer = setTimeout(() => resolveTimeout(false), 1_000);
              timer.unref?.();
            }),
          ]);
          if (!persisted) {
            dependencies.stderr(
              "Recovery journal update failed; the durable pre-spawn barrier remains active.\n",
            );
          }
        }
        if (transaction !== undefined && error.processTree !== null) {
          const recoveryRequired: RecoveryRequiredMarker = {
            status: "recovery_required",
            profile: options.profile,
            fencingToken: lock.fencingToken,
            processTree: error.processTree,
            artifact: artifactLease?.recoveryReference ?? null,
            transaction: transaction.recoveryReference,
          };
          try {
            await lock.assertOwned();
            await dependencies.writeState(
              dependencies.dshHome,
              { ...state, recoveryRequired },
              {
                expectedGeneration: state.generation ?? 0,
                fencingToken: lock.fencingToken,
                assertLockOwned: lock.assertOwned,
              },
            );
          } catch {
            dependencies.stderr(
              "Recovery marker could not be published; all recovery resources remain retained.\n",
            );
          }
        }
        dependencies.stderr(`${error.message}\n`);
        return 1;
      }
      if (
        recoveryJournal?.phase === "completed" &&
        recoveryJournal.status === "completed"
      ) {
        dependencies.stderr(
          "Mutation completed; final recovery journal cleanup is pending and can be retried.\n",
        );
        return 1;
      }
      if (rollForwardDecided || recoveryJournal?.decision === "roll_forward") {
        retainArtifact = true;
        if (recoveryJournal !== undefined) {
          try {
            recoveryJournal = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              recoveryJournal,
              { status: "recovery_required" },
            );
          } catch {
            dependencies.stderr(
              "Recovery journal update failed; the durable success decision remains active.\n",
            );
          }
        }
        dependencies.stderr(
          "DSH succeeded, but finalization requires recovery; rerun dsh-plugins recover.\n",
        );
        return 1;
      }
      if (transaction !== undefined) {
        try {
          await transaction.rollback();
          if (recoveryJournal !== undefined) {
            recoveryJournal = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              recoveryJournal,
              {
                decision: "rollback",
                status: "recovery_required",
                phase: "profile_restored",
              },
            );
            recoveryJournal = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              recoveryJournal,
              { status: "recovery_required", phase: "profile_finalized" },
            );
            await artifactChannel?.close();
            artifactChannel = undefined;
            await artifactLease?.release();
            artifactLease = undefined;
            recoveryJournal = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              recoveryJournal,
              { status: "recovery_required", phase: "artifact_released" },
            );
            recoveryJournal = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              recoveryJournal,
              { status: "completed", phase: "completed" },
            );
            await dependencies.removeRecoveryJournal(dependencies.dshHome, recoveryJournal);
            recoveryJournal = undefined;
          }
        } catch {
          retainArtifact = recoveryJournal !== undefined;
          if (error instanceof DshExecutionUncertainError) {
            dependencies.stderr(`${error.message}\n`);
          }
          dependencies.stderr(
            "Rollback requires manual recovery from the retained profile backup.\n",
          );
          return 1;
        }
      }
      dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
      return 1;
    }
  } finally {
    if (!retainChannel) await artifactChannel?.close().catch(() => undefined);
    if (!retainArtifact) await artifactLease?.release().catch(() => undefined);
    if (!retainLock) await lock.release().catch(() => undefined);
  }
}

export async function recoverPluginMutation(
  overrides: Partial<RecoveryDependencies> = {},
): Promise<number> {
  const dependencies: RecoveryDependencies = { ...defaultRecoveryDependencies, ...overrides };
  let durable: MutationRecoveryJournal | null;
  try {
    durable = await dependencies.readRecoveryJournal(dependencies.dshHome);
  } catch {
    dependencies.stderr("Recovery journal could not be read safely.\n");
    return 1;
  }
  if (durable !== null) {
    if (dependencies.platform === "win32" || durable.processTree?.platform === "win32") {
      dependencies.stderr(
        "Native Windows recovery remains fail-closed because complete descendant containment " +
          "cannot be proven. Use WSL or perform documented manual recovery.\n",
      );
      return 1;
    }
    let lock: ProfileLock;
    try {
      lock = await dependencies.acquireLock(dependencies.dshHome, durable.profile);
    } catch (error) {
      dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
      return 1;
    }
    let releaseLock = false;
    try {
      const current = await dependencies.readRecoveryJournal(dependencies.dshHome);
      if (current === null) {
        releaseLock = true;
        dependencies.stdout("No mutation recovery is pending.\n");
        return 0;
      }
      durable = current;
      if (durable.phase !== "completed") {
        if (durable.processTree === undefined) {
          dependencies.stderr(
            "Recovery remains fail-closed because the spawned process tree was not durably identified.\n",
          );
          return 1;
        }
        let treeAlive: boolean;
        try {
          treeAlive = await dependencies.isProcessTreeAlive(durable.processTree);
        } catch {
          dependencies.stderr("Recovery process tree could not be inspected safely.\n");
          return 1;
        }
        if (treeAlive) {
          dependencies.stderr(
            "Recovery is pending because the DSH process tree is still alive.\n",
          );
          return 1;
        }
        durable = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          durable,
          { ownerToken: lock.ownerToken, fencingToken: lock.fencingToken },
        );
      }
      if (durable.decision !== undefined || durable.stateEvidence !== undefined) {
        if (durable.decision === undefined || durable.stateEvidence === undefined) {
          throw new CliSafetyError("recovery state evidence is incomplete; manual recovery required");
        }
        const evidence = durable.stateEvidence;
        let state = await dependencies.readState(dependencies.dshHome);
        const stateFingerprint = fingerprintInstallState(state.installs);
        if ((state.generation ?? 0) < evidence.oldGeneration) {
          throw new CliSafetyError("recovery state generation moved backwards; manual recovery required");
        }

        if (durable.decision === "roll_forward") {
          if (durable.activeFingerprint === undefined) {
            throw new CliSafetyError("successful profile fingerprint is missing; manual recovery required");
          }
          const observedActive = await dependencies.fingerprintActiveProfile(
            dependencies.dshHome,
            durable.profile,
          );
          if (observedActive !== durable.activeFingerprint) {
            throw new CliSafetyError("successful profile fingerprint changed; manual recovery required");
          }
          if (durable.phase === "dsh_succeeded") {
            if (stateFingerprint === evidence.oldFingerprint) {
              await dependencies.writeState(
                dependencies.dshHome,
                { version: 1, installs: [...evidence.intendedInstalls] },
                {
                  expectedGeneration: state.generation ?? 0,
                  fencingToken: lock.fencingToken,
                  assertLockOwned: lock.assertOwned,
                },
              );
              state = await dependencies.readState(dependencies.dshHome);
            } else if (stateFingerprint !== evidence.intendedFingerprint) {
              throw new CliSafetyError("install state does not match recovery evidence");
            }
            durable = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              durable,
              { phase: "state_published", status: "recovery_required" },
            );
          }
          if (
            durable.phase === "state_published" &&
            fingerprintInstallState(state.installs) !== evidence.intendedFingerprint
          ) {
            throw new CliSafetyError("published install state does not match recovery evidence");
          }
          if (durable.phase === "state_published") {
            await dependencies.finalizeRecoveredTransaction(
              dependencies.dshHome,
              durable.transaction,
              lock.assertOwned,
            );
            durable = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              durable,
              { phase: "profile_finalized", status: "recovery_required" },
            );
          }
        } else {
          if (stateFingerprint !== evidence.oldFingerprint) {
            throw new CliSafetyError("rollback state does not match recovery evidence");
          }
          if (durable.phase === "needs_restore") {
            await lock.assertOwned();
            await dependencies.recoverTransaction(
              dependencies.dshHome,
              durable.transaction,
              lock.assertOwned,
            );
            durable = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              durable,
              {
                decision: "rollback",
                phase: "profile_restored",
                status: "recovery_required",
              },
            );
          }
          if (durable.phase === "profile_restored") {
            await dependencies.finalizeRecoveredTransaction(
              dependencies.dshHome,
              durable.transaction,
              lock.assertOwned,
            );
            durable = await updateJournalAuthoritatively(dependencies, 
              dependencies.dshHome,
              durable,
              { phase: "profile_finalized", status: "recovery_required" },
            );
          }
        }

        if (durable.phase === "profile_finalized") {
          if (durable.artifact !== null) {
            await dependencies.releaseRecoveredArtifact(dependencies.dshHome, durable.artifact);
          }
          durable = await updateJournalAuthoritatively(dependencies, 
            dependencies.dshHome,
            durable,
            { phase: "artifact_released", status: "recovery_required" },
          );
        }
        if (durable.phase === "artifact_released") {
          state = await dependencies.readState(dependencies.dshHome);
          const expected = durable.decision === "roll_forward"
            ? evidence.intendedFingerprint
            : evidence.oldFingerprint;
          if (fingerprintInstallState(state.installs) !== expected) {
            throw new CliSafetyError("final install state does not match recovery evidence");
          }
          if (state.recoveryRequired !== undefined) {
            await dependencies.writeState(
              dependencies.dshHome,
              { version: 1, installs: state.installs },
              {
                expectedGeneration: state.generation ?? 0,
                fencingToken: lock.fencingToken,
                assertLockOwned: lock.assertOwned,
              },
            );
          }
          durable = await updateJournalAuthoritatively(dependencies, 
            dependencies.dshHome,
            durable,
            { phase: "completed", status: "completed" },
          );
        }
        await dependencies.removeRecoveryJournal(dependencies.dshHome, durable);
        releaseLock = true;
        dependencies.stdout(`Recovery completed for profile ${durable.profile}.\n`);
        return 0;
      }
      if (durable.phase === "needs_restore") {
        await lock.assertOwned();
        await dependencies.recoverTransaction(
          dependencies.dshHome,
          durable.transaction,
          lock.assertOwned,
        );
        durable = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          durable,
          { phase: "profile_restored", status: "recovery_required" },
        );
      }
      if (durable.phase === "profile_restored") {
        await dependencies.finalizeRecoveredTransaction(
          dependencies.dshHome,
          durable.transaction,
          lock.assertOwned,
        );
        if (durable.artifact !== null) {
          await dependencies.releaseRecoveredArtifact(dependencies.dshHome, durable.artifact);
        }
        durable = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          durable,
          { phase: "artifact_released", status: "recovery_required" },
        );
      }
      if (durable.phase === "artifact_released") {
        const state = await dependencies.readState(dependencies.dshHome);
        if (state.recoveryRequired !== undefined) {
          await dependencies.writeState(
            dependencies.dshHome,
            { version: 1, installs: state.installs },
            {
              expectedGeneration: state.generation ?? 0,
              fencingToken: lock.fencingToken,
              assertLockOwned: lock.assertOwned,
            },
          );
        }
        durable = await updateJournalAuthoritatively(dependencies, 
          dependencies.dshHome,
          durable,
          { phase: "completed", status: "completed" },
        );
      }
      await dependencies.removeRecoveryJournal(dependencies.dshHome, durable);
      releaseLock = true;
      dependencies.stdout(`Recovery completed for profile ${durable.profile}.\n`);
      return 0;
    } catch (error) {
      dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
      return 1;
    } finally {
      if (releaseLock) await lock.release().catch(() => undefined);
    }
  }
  let observed: InstallState;
  try {
    observed = await dependencies.readState(dependencies.dshHome);
  } catch {
    dependencies.stderr("Recovery state could not be read safely.\n");
    return 1;
  }
  if (observed.recoveryRequired === undefined) {
    dependencies.stdout("No mutation recovery is pending.\n");
    return 0;
  }

  if (
    dependencies.platform === "win32" ||
    observed.recoveryRequired.processTree.platform === "win32"
  ) {
    dependencies.stderr(
      "Native Windows recovery remains fail-closed because complete descendant containment " +
        "cannot be proven. Use WSL or perform documented manual recovery.\n",
    );
    return 1;
  }

  let lock: ProfileLock;
  try {
    lock = await dependencies.acquireLock(
      dependencies.dshHome,
      observed.recoveryRequired.profile,
    );
  } catch (error) {
    dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
    return 1;
  }
  let releaseLock = false;
  try {
    const state = await dependencies.readState(dependencies.dshHome);
    const marker = state.recoveryRequired;
    if (marker === undefined) {
      releaseLock = true;
      dependencies.stdout("No mutation recovery is pending.\n");
      return 0;
    }
    let treeAlive: boolean;
    try {
      treeAlive = await dependencies.isProcessTreeAlive(marker.processTree);
    } catch {
      dependencies.stderr("Recovery process tree could not be inspected safely.\n");
      return 1;
    }
    if (treeAlive) {
      dependencies.stderr(
        "Recovery is pending because the DSH process tree is still alive.\n",
      );
      return 1;
    }
    await lock.assertOwned();
    await dependencies.recoverTransaction(
      dependencies.dshHome,
      marker.transaction,
      lock.assertOwned,
    );
    if (marker.artifact !== null) {
      await dependencies.releaseRecoveredArtifact(dependencies.dshHome, marker.artifact);
    }
    await lock.assertOwned();
    await dependencies.writeState(
      dependencies.dshHome,
      { version: 1, installs: state.installs },
      {
        expectedGeneration: state.generation ?? 0,
        fencingToken: lock.fencingToken,
        assertLockOwned: lock.assertOwned,
      },
    );
    releaseLock = true;
    dependencies.stdout(`Recovery completed for profile ${marker.profile}.\n`);
    return 0;
  } catch (error) {
    dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
    return 1;
  } finally {
    if (releaseLock) await lock.release().catch(() => undefined);
  }
}

export { EMPTY_INSTALL_STATE };
