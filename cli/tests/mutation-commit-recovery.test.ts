import { createHash } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import {
  executePluginMutation,
  recoverPluginMutation,
  type MutationDependencies,
} from "../src/commands/mutate.js";
import type { InstallState, InstalledPlugin } from "../src/dsh/installState.js";
import {
  MutationRecoveryJournalDurabilityAmbiguousError,
  type MutationRecoveryJournal,
} from "../src/dsh/mutationRecoveryJournal.js";
import type { PublicCatalogEntry } from "../src/model.js";

const entry: PublicCatalogEntry = {
  schemaVersion: 1,
  id: "fixture-plugin",
  name: "Fixture Plugin",
  description: { en: "Commit protocol fixture.", evidencePath: "README.md" },
  unofficial: true,
  kind: "plugin",
  primaryCategory: "developer-tools",
  tags: ["fixture"],
  source: {
    repository: "https://github.com/creator/fixture-plugin",
    repositoryNodeId: "R_fixture",
    subpath: null,
    commit: "a".repeat(40),
  },
  creator: { github: "creator" },
  package: { ecosystem: "npm", name: "fixture-plugin", version: "1.0.0" },
  dsh: { profiles: ["web"], evidencePath: "package.json" },
  repositoryScope: "dedicated",
  popularity: { starsPolicy: "exact-repository", stars: 1 },
  license: { spdx: "MIT" },
  verification: {
    status: "eligible",
    checkedAt: "2026-08-16T00:00:00.000Z",
    repositoryIdentity: "resolved",
    smokeTest: null,
  },
  provenance: { discussion: null, comment: null },
  canonicalKey: "R_fixture:.",
};

const oldInstall: InstalledPlugin = {
  id: "fixture-plugin",
  profile: "web",
  packageName: "fixture-plugin",
  fingerprint: "sha256:old",
  cacheRelativePath: "fixture/old.tgz",
  installedAt: "2026-08-15T00:00:00.000Z",
};

const newInstall: InstalledPlugin = {
  ...oldInstall,
  fingerprint: "sha256:new",
  cacheRelativePath: "fixture/new.tgz",
  installedAt: "2026-08-16T00:00:00.000Z",
};

function stateFingerprint(installs: readonly InstalledPlugin[]): string {
  return `sha256:${createHash("sha256").update(JSON.stringify({ version: 1, installs })).digest("hex")}`;
}

function harness(state: InstallState) {
  let journalInput: Record<string, unknown> | undefined;
  let journal: MutationRecoveryJournal = {
    version: 1,
    revision: 1,
    status: "in_progress",
    phase: "needs_restore",
    ownerToken: "owner",
    fencingToken: 7,
    profile: "web",
    transaction: {
      profile: "web",
      fencingToken: 7,
      existed: true,
      journalRelativePath: "profiles/.dsh-plugins-transaction-web-state.json",
      backupRelativePath: "profiles/.dsh-plugins-backup-web-state",
      backupFingerprint: `sha512-${"A".repeat(86)}==`,
    },
    artifact: {
      relativePath: ".dsh-plugins/artifact-leases/.lease-state/artifact.tgz",
      sha512: `sha512-${"B".repeat(86)}==`,
      bytes: 128,
      packageName: "fixture-plugin",
    },
    channel: {
      kind: "loopback-buffer-v1",
      sha512: `sha512-${"B".repeat(86)}==`,
      bytes: 128,
      sourceFingerprint: "sha256:new",
    },
    createdAt: "2026-08-16T00:00:00.000Z",
  };
  const artifactLease = {
    recoveryReference: journal.artifact!,
    revalidate: vi.fn(async () => undefined),
    readVerifiedBytes: vi.fn(async () => Buffer.alloc(128)),
    release: vi.fn(async () => undefined),
  };
  const transaction = {
    recoveryReference: journal.transaction,
    commit: vi.fn(async () => undefined),
    rollback: vi.fn(async () => undefined),
  };
  const lock = {
    canonicalHome: "/canonical/home",
    profile: "web",
    ownerToken: "owner",
    fencingToken: 7,
    assertOwned: vi.fn(async () => undefined),
    heartbeat: vi.fn(async () => undefined),
    release: vi.fn(async () => undefined),
  };
  const artifactChannel = {
    installTarget: "http://127.0.0.1:43123/secret/artifact.tgz",
    descriptor: journal.channel!,
    close: vi.fn(async () => undefined),
  };
  const dependencies = {
    dshHome: "/canonical/home",
    platform: "linux" as const,
    acquireLock: vi.fn(async () => lock),
    readRecoveryJournal: vi.fn(async () => null),
    readState: vi.fn(async () => state),
    writeState: vi.fn(async () => undefined),
    stageEntry: vi.fn(async () => ({
      fingerprint: newInstall.fingerprint,
      installTarget: "/private/artifact.tgz",
      displayTarget: "<private>",
      packageName: newInstall.packageName,
      cacheRelativePath: newInstall.cacheRelativePath,
      artifactLease,
    })),
    beginTransaction: vi.fn(async () => transaction),
    fingerprintActiveProfile: vi.fn(async () => `sha512-${"C".repeat(86)}==`),
    openArtifactChannel: vi.fn(async () => artifactChannel),
    createRecoveryJournal: vi.fn(async (_home: string, input: object) => {
      journalInput = input as Record<string, unknown>;
      journal = { ...journal, ...input } as MutationRecoveryJournal;
      return journal;
    }),
    updateRecoveryJournal: vi.fn(async (_home: string, current: MutationRecoveryJournal, patch: object) => {
      journal = { ...current, ...patch, revision: current.revision + 1 } as MutationRecoveryJournal;
      return journal;
    }),
    removeRecoveryJournal: vi.fn(async () => undefined),
    runDsh: vi.fn<MutationDependencies["runDsh"]>(async () => 0),
    now: () => new Date("2026-08-16T00:00:00.000Z"),
    stdout: vi.fn(),
    stderr: vi.fn(),
  };
  return {
    dependencies,
    transaction,
    artifactLease,
    artifactChannel,
    lock,
    journal: () => journal,
    journalInput: () => journalInput,
  };
}

describe("durable profile/state commit decision", () => {
  it.each([
    ["add", { version: 1 as const, generation: 3, installs: [] }, [newInstall]],
    ["update", { version: 1 as const, generation: 3, installs: [oldInstall] }, [newInstall]],
    ["remove", { version: 1 as const, generation: 3, installs: [oldInstall] }, []],
  ] as const)("records deterministic old/new state evidence for %s", async (operation, state, intended) => {
    const test = harness(state);
    expect(await executePluginMutation({
      operation,
      ...(operation === "remove" ? { id: "fixture-plugin" } : { entry }),
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, test.dependencies)).toBe(0);

    expect(test.journalInput()).toMatchObject({
      decision: "undecided",
      stateEvidence: {
        oldGeneration: 3,
        oldFingerprint: stateFingerprint(state.installs),
        oldInstalls: state.installs,
        intendedFingerprint: stateFingerprint(intended),
        intendedInstalls: intended,
      },
    });
  });

  it("retains ambiguous success resources and a retry converges from the disk journal", async () => {
    const initialState: InstallState = { version: 1, generation: 3, installs: [] };
    const test = harness(initialState);
    const processTree = {
      pid: 7_777,
      processGroupId: 7_777,
      treeIdentity: "linux:created",
      processStartIdentity: "linux:created",
      platform: "linux" as const,
    };
    let published: MutationRecoveryJournal | undefined;
    test.dependencies.runDsh.mockImplementation(async (_profile, _args, runDependencies) => {
      await runDependencies?.onSpawn?.(processTree);
      return 0;
    });
    test.dependencies.updateRecoveryJournal.mockImplementation(async (_home, current, patch) => {
      const next = {
        ...current,
        ...patch,
        revision: current.revision + 1,
      } as MutationRecoveryJournal;
      if ((patch as Partial<MutationRecoveryJournal>).decision === "roll_forward") {
        published = next;
        throw new MutationRecoveryJournalDurabilityAmbiguousError("update");
      }
      return next;
    });
    test.dependencies.readRecoveryJournal
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error("published marker cannot be reread"));

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, test.dependencies)).toBe(1);

    expect(published).toMatchObject({
      decision: "roll_forward",
      phase: "dsh_succeeded",
      status: "recovery_required",
      processTree,
    });
    expect(test.transaction.rollback).not.toHaveBeenCalled();
    expect(test.transaction.commit).not.toHaveBeenCalled();
    expect(test.artifactLease.release).not.toHaveBeenCalled();
    expect(test.artifactChannel.close).not.toHaveBeenCalled();
    expect(test.lock.release).not.toHaveBeenCalled();
    expect(test.dependencies.removeRecoveryJournal).not.toHaveBeenCalled();
    expect(test.dependencies.writeState).not.toHaveBeenCalled();

    if (published === undefined) throw new Error("test fixture did not publish the journal");
    let durable: MutationRecoveryJournal | null = published;
    let recoveredState = initialState;
    const recoveryLock = {
      canonicalHome: "/canonical/home",
      profile: "web",
      ownerToken: "recovery-owner",
      fencingToken: 8,
      assertOwned: vi.fn(async () => undefined),
      heartbeat: vi.fn(async () => undefined),
      release: vi.fn(async () => undefined),
    };
    const finalizeRecoveredTransaction = vi.fn(async () => undefined);
    const releaseRecoveredArtifact = vi.fn(async () => undefined);

    expect(await recoverPluginMutation({
      dshHome: "/canonical/home",
      platform: "linux",
      acquireLock: vi.fn(async () => recoveryLock),
      readRecoveryJournal: vi.fn(async () => durable),
      updateRecoveryJournal: vi.fn(async (_home, current, patch) => {
        const next = {
          ...current,
          ...patch,
          revision: current.revision + 1,
        } as MutationRecoveryJournal;
        durable = next;
        return next;
      }),
      removeRecoveryJournal: vi.fn(async () => { durable = null; }),
      readState: vi.fn(async () => recoveredState),
      writeState: vi.fn(async (_home, next) => {
        recoveredState = {
          ...next,
          generation: (recoveredState.generation ?? 0) + 1,
          fencingToken: recoveryLock.fencingToken,
        };
        return recoveredState;
      }),
      isProcessTreeAlive: vi.fn(async () => false),
      fingerprintActiveProfile: vi.fn(async () => `sha512-${"C".repeat(86)}==`),
      recoverTransaction: vi.fn(async () => undefined),
      finalizeRecoveredTransaction,
      releaseRecoveredArtifact,
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(0);

    expect(recoveredState.installs).toEqual([newInstall]);
    expect(finalizeRecoveredTransaction).toHaveBeenCalledOnce();
    expect(releaseRecoveredArtifact).toHaveBeenCalledOnce();
    expect(recoveryLock.release).toHaveBeenCalledOnce();
    expect(durable).toBeNull();
  });

  it("never rolls back after the new state is published but the next journal phase fails", async () => {
    const test = harness({ version: 1, generation: 3, installs: [] });
    let statePublished = false;
    test.dependencies.writeState.mockImplementation(async () => {
      statePublished = true;
      return undefined;
    });
    test.dependencies.updateRecoveryJournal.mockImplementation(async (_home, current, patch) => {
      const candidate = { ...current, ...patch, revision: current.revision + 1 } as MutationRecoveryJournal;
      if (statePublished) throw new Error("crash after state rename");
      return candidate;
    });

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, test.dependencies)).toBe(1);

    expect(test.dependencies.writeState).toHaveBeenCalledOnce();
    expect(test.transaction.rollback).not.toHaveBeenCalled();
    expect(test.transaction.commit).not.toHaveBeenCalled();
    expect(test.artifactLease.release).not.toHaveBeenCalled();
  });

  it("rolls forward when state is already new even if the durable phase is still dsh_succeeded", async () => {
    const state: InstallState = { version: 1, generation: 4, fencingToken: 7, installs: [newInstall] };
    let durable = {
      version: 1,
      revision: 3,
      status: "recovery_required",
      phase: "dsh_succeeded",
      decision: "roll_forward",
      ownerToken: "old-owner",
      fencingToken: 7,
      profile: "web",
      transaction: {
        profile: "web",
        fencingToken: 7,
        existed: true,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-forward.json",
        backupRelativePath: "profiles/.dsh-plugins-backup-web-forward",
        backupFingerprint: `sha512-${"A".repeat(86)}==`,
      },
      artifact: {
        relativePath: ".dsh-plugins/artifact-leases/.lease-forward/artifact.tgz",
        sha512: `sha512-${"B".repeat(86)}==`,
        bytes: 128,
        packageName: "fixture-plugin",
      },
      channel: null,
      processTree: {
        pid: 7_777,
        processGroupId: 7_777,
        treeIdentity: "linux:created",
        processStartIdentity: "linux:created",
        platform: "linux",
      },
      stateEvidence: {
        oldGeneration: 3,
        oldFingerprint: stateFingerprint([]),
        oldInstalls: [],
        intendedFingerprint: stateFingerprint([newInstall]),
        intendedInstalls: [newInstall],
      },
      activeFingerprint: `sha512-${"C".repeat(86)}==`,
      createdAt: "2026-08-16T00:00:00.000Z",
    } as unknown as MutationRecoveryJournal;
    const order: string[] = [];
    const recoverTransaction = vi.fn(async () => undefined);
    const finalizeRecoveredTransaction = vi.fn(async () => { order.push("finalize-profile"); });

    expect(await recoverPluginMutation({
      dshHome: "/canonical/home",
      platform: "linux",
      acquireLock: vi.fn(async () => ({
        canonicalHome: "/canonical/home",
        profile: "web",
        ownerToken: "new-owner",
        fencingToken: 8,
        assertOwned: vi.fn(async () => undefined),
        heartbeat: vi.fn(async () => undefined),
        release: vi.fn(async () => { order.push("release-lock"); }),
      })),
      readRecoveryJournal: vi.fn(async () => durable),
      updateRecoveryJournal: vi.fn(async (_home, current, patch) => {
        durable = { ...current, ...patch, revision: current.revision + 1 } as typeof durable;
        return durable as unknown as MutationRecoveryJournal;
      }),
      removeRecoveryJournal: vi.fn(async () => { order.push("remove-marker"); }),
      readState: vi.fn(async () => state),
      writeState: vi.fn(async () => undefined),
      isProcessTreeAlive: vi.fn(async () => false),
      fingerprintActiveProfile: vi.fn(async () => `sha512-${"C".repeat(86)}==`),
      recoverTransaction,
      finalizeRecoveredTransaction,
      releaseRecoveredArtifact: vi.fn(async () => { order.push("release-artifact"); }),
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(0);

    expect(recoverTransaction).not.toHaveBeenCalled();
    expect(finalizeRecoveredTransaction).toHaveBeenCalledOnce();
    expect(order).toEqual([
      "finalize-profile",
      "release-artifact",
      "remove-marker",
      "release-lock",
    ]);
  });
});

describe("dsh missing-on-PATH exit UX", () => {
  it("explains exit 127 as DSH/pnpm missing from PATH instead of a generic rejection", async () => {
    const test = harness({ version: 1, generation: 3, installs: [] });
    test.dependencies.runDsh.mockImplementation(async () => 127);

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, test.dependencies)).toBe(1);

    const stderr = test.dependencies.stderr.mock.calls.map((call) => call[0]).join("");
    expect(stderr).toContain("DSH (or pnpm) was not found on PATH");
    expect(stderr).not.toContain("DSH rejected the mutation");
    expect(test.transaction.rollback).toHaveBeenCalledOnce();
  });

  it("keeps the generic rejection message for ordinary nonzero exits", async () => {
    const test = harness({ version: 1, generation: 3, installs: [] });
    test.dependencies.runDsh.mockImplementation(async () => 1);

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, test.dependencies)).toBe(1);

    const stderr = test.dependencies.stderr.mock.calls.map((call) => call[0]).join("");
    expect(stderr).toContain("DSH rejected the mutation; the previous profile was restored.");
    expect(stderr).not.toContain("was not found on PATH");
    expect(test.transaction.rollback).toHaveBeenCalledOnce();
  });
});
