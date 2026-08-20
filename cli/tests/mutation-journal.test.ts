import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { executePluginMutation } from "../src/commands/mutate.js";
import {
  createMutationRecoveryJournal,
  readMutationRecoveryJournal,
  type MutationRecoveryJournal,
} from "../src/dsh/mutationRecoveryJournal.js";
import type { PublicCatalogEntry } from "../src/model.js";

const roots: string[] = [];

function home(): string {
  const root = mkdtempSync(join(tmpdir(), "dsh-durable-intent-"));
  roots.push(root);
  mkdirSync(join(root, "profiles", "web"), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

const entry: PublicCatalogEntry = {
  schemaVersion: 1,
  id: "fixture-plugin",
  name: "Fixture Plugin",
  description: { en: "Durable recovery intent fixture.", evidencePath: "README.md" },
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

function journalInput(homePath: string) {
  return {
    ownerToken: "owner-token",
    fencingToken: 7,
    profile: "web",
    transaction: {
      profile: "web",
      fencingToken: 7,
      existed: true,
      journalRelativePath: "profiles/.dsh-plugins-transaction-web-test.json",
      backupRelativePath: "profiles/.dsh-plugins-backup-web-test",
      backupFingerprint: `sha512-${"A".repeat(86)}==`,
    },
    artifact: {
      relativePath: ".dsh-plugins/artifact-leases/.lease-test/artifact.tgz",
      sha512: `sha512-${"B".repeat(86)}==`,
      bytes: 128,
      packageName: "fixture-plugin",
    },
    channel: {
      kind: "loopback-buffer-v1" as const,
      sha512: `sha512-${"B".repeat(86)}==`,
      bytes: 128,
      sourceFingerprint: "sha256:pinned-source",
    },
    createdAt: "2026-08-16T00:00:00.000Z",
    home: homePath,
  };
}

describe("durable pre-spawn mutation intent", () => {
  it("publishes an in-progress fail-closed journal before a child can exist", async () => {
    const root = home();
    const created = await createMutationRecoveryJournal(root, journalInput(root));

    expect(created).toMatchObject({
      status: "in_progress",
      phase: "needs_restore",
      revision: 1,
      ownerToken: "owner-token",
      fencingToken: 7,
    });
    expect(await readMutationRecoveryJournal(root)).toEqual(created);
  });

  it("does not spawn when durable pre-spawn publication fails", async () => {
    const root = home();
    const runDsh = vi.fn(async () => 0);
    const rollback = vi.fn(async () => undefined);
    const lock = {
      canonicalHome: root,
      profile: "web",
      ownerToken: "owner-token",
      fencingToken: 7,
      assertOwned: vi.fn(async () => undefined),
      heartbeat: vi.fn(async () => undefined),
      release: vi.fn(async () => undefined),
    };
    const artifactLease = {
      recoveryReference: journalInput(root).artifact,
      revalidate: vi.fn(async () => undefined),
      readVerifiedBytes: vi.fn(async () => Buffer.from("verified")),
      release: vi.fn(async () => undefined),
    };

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, {
      dshHome: root,
      acquireLock: vi.fn(async () => lock),
      readRecoveryJournal: vi.fn(async () => null),
      readState: vi.fn(async () => ({ version: 1 as const, generation: 0, installs: [] })),
      stageEntry: vi.fn(async () => ({
        fingerprint: "sha256:pinned-source",
        installTarget: join(root, "artifact.tgz"),
        displayTarget: "<private>",
        packageName: "fixture-plugin",
        cacheRelativePath: "fixture/cache.tgz",
        artifactLease,
      })),
      beginTransaction: vi.fn(async () => ({
        recoveryReference: journalInput(root).transaction,
        commit: vi.fn(async () => undefined),
        rollback,
      })),
      openArtifactChannel: vi.fn(async () => ({
        installTarget: "http://127.0.0.1:1/secret/artifact.tgz",
        descriptor: journalInput(root).channel,
        close: vi.fn(async () => undefined),
      })),
      createRecoveryJournal: vi.fn(async () => {
        throw new Error("disk full");
      }),
      runDsh,
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(1);

    expect(runDsh).not.toHaveBeenCalled();
    expect(rollback).toHaveBeenCalledOnce();
  });

  it("blocks a later process from staging when an in-progress journal survives lease expiry", async () => {
    const root = home();
    const pending = {
      version: 1,
      revision: 1,
      status: "in_progress",
      phase: "needs_restore",
      ...journalInput(root),
    } as MutationRecoveryJournal;
    const stageEntry = vi.fn();
    const runDsh = vi.fn();

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, {
      dshHome: root,
      acquireLock: vi.fn(async () => ({
        canonicalHome: root,
        profile: "web",
        ownerToken: "later-owner",
        fencingToken: 8,
        assertOwned: vi.fn(async () => undefined),
        heartbeat: vi.fn(async () => undefined),
        release: vi.fn(async () => undefined),
      })),
      readRecoveryJournal: vi.fn(async () => pending),
      readState: vi.fn(async () => ({ version: 1 as const, installs: [] })),
      stageEntry,
      runDsh,
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(1);

    expect(stageEntry).not.toHaveBeenCalled();
    expect(runDsh).not.toHaveBeenCalled();
  });

  it("remains fail-closed when both the timeout update and state mirror publication fail", async () => {
    const root = home();
    const processTree = {
      pid: 9_009,
      processGroupId: 9_009,
      treeIdentity: "linux:created",
      processStartIdentity: "linux:created",
      platform: "linux" as const,
    };
    const input = journalInput(root);
    let durable: MutationRecoveryJournal = {
      version: 1,
      revision: 1,
      status: "in_progress",
      phase: "needs_restore",
      ...input,
    };
    const lock = {
      canonicalHome: root,
      profile: "web",
      ownerToken: "owner-token",
      fencingToken: 7,
      assertOwned: vi.fn(async () => undefined),
      heartbeat: vi.fn(async () => undefined),
      release: vi.fn(async () => undefined),
    };
    const artifactLease = {
      recoveryReference: input.artifact,
      revalidate: vi.fn(async () => undefined),
      readVerifiedBytes: vi.fn(async () => Buffer.from("verified")),
      release: vi.fn(async () => undefined),
    };
    const channel = {
      installTarget: "http://127.0.0.1:1/secret/artifact.tgz",
      descriptor: input.channel,
      close: vi.fn(async () => undefined),
    };
    const updateRecoveryJournal = vi.fn(async (_home: string, current: MutationRecoveryJournal, patch: object) => {
      if ("status" in patch && (patch as { status?: string }).status === "recovery_required") {
        throw new Error("injected durable update failure");
      }
      durable = { ...current, ...patch, revision: current.revision + 1 } as MutationRecoveryJournal;
      return durable;
    });
    const runDsh = vi.fn(async (_profile: string, _args: readonly string[], options?: {
      onSpawn?: (identity: typeof processTree) => Promise<void>;
    }) => {
      await options?.onSpawn?.(processTree);
      const { DshExecutionUncertainError } = await import("../src/dsh/runDsh.js");
      throw new DshExecutionUncertainError("timeout", false, processTree);
    });

    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, {
      dshHome: root,
      acquireLock: vi.fn(async () => lock),
      readRecoveryJournal: vi.fn(async () => null),
      readState: vi.fn(async () => ({ version: 1 as const, generation: 0, installs: [] })),
      writeState: vi.fn(async () => { throw new Error("state rename failed"); }),
      stageEntry: vi.fn(async () => ({
        fingerprint: "sha256:pinned-source",
        installTarget: join(root, "artifact.tgz"),
        displayTarget: "<private>",
        packageName: "fixture-plugin",
        cacheRelativePath: "fixture/cache.tgz",
        artifactLease,
      })),
      beginTransaction: vi.fn(async () => ({
        recoveryReference: input.transaction,
        commit: vi.fn(async () => undefined),
        rollback: vi.fn(async () => undefined),
      })),
      openArtifactChannel: vi.fn(async () => channel),
      createRecoveryJournal: vi.fn(async () => durable),
      updateRecoveryJournal,
      runDsh,
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(1);

    expect(durable.status).toBe("in_progress");
    expect(durable.processTree).toEqual(processTree);
    expect(artifactLease.release).not.toHaveBeenCalled();
    expect(channel.close).not.toHaveBeenCalled();
    expect(lock.release).not.toHaveBeenCalled();

    const laterStage = vi.fn();
    const laterRun = vi.fn();
    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, {
      dshHome: root,
      acquireLock: vi.fn(async () => ({ ...lock, ownerToken: "later-owner", fencingToken: 8 })),
      readRecoveryJournal: vi.fn(async () => durable),
      readState: vi.fn(async () => ({ version: 1 as const, installs: [] })),
      stageEntry: laterStage,
      runDsh: laterRun,
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(1);
    expect(laterStage).not.toHaveBeenCalled();
    expect(laterRun).not.toHaveBeenCalled();
  });
});
