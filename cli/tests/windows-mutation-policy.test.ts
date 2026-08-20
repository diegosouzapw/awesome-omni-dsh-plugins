import { describe, expect, it, vi } from "vitest";

import {
  executePluginMutation,
  recoverPluginMutation,
} from "../src/commands/mutate.js";
import type { MutationRecoveryJournal } from "../src/dsh/mutationRecoveryJournal.js";
import type { PublicCatalogEntry } from "../src/model.js";

const entry: PublicCatalogEntry = {
  schemaVersion: 1,
  id: "fixture-plugin",
  name: "Fixture Plugin",
  description: { en: "Windows policy fixture.", evidencePath: "README.md" },
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

describe("Windows mutation safety policy", () => {
  it("blocks add/update/remove before lock, state, staging, or spawn and points to WSL", async () => {
    for (const operation of ["add", "update", "remove"] as const) {
      const stderr = vi.fn();
      const acquireLock = vi.fn();
      const readState = vi.fn();
      const stageEntry = vi.fn();
      const runDsh = vi.fn();
      expect(await executePluginMutation({
        operation,
        ...(operation === "remove" ? { id: "fixture-plugin" } : { entry }),
        profile: "web",
        dryRun: false,
        allowCodeExecution: true,
      }, {
        platform: "win32",
        acquireLock,
        readState,
        stageEntry,
        runDsh,
        stdout: vi.fn(),
        stderr,
      })).toBe(1);
      expect(acquireLock).not.toHaveBeenCalled();
      expect(readState).not.toHaveBeenCalled();
      expect(stageEntry).not.toHaveBeenCalled();
      expect(runDsh).not.toHaveBeenCalled();
      expect(stderr).toHaveBeenCalledWith(expect.stringMatching(/Windows.*WSL/iu));
    }
  });

  it("keeps dry-run available without touching mutation dependencies", async () => {
    const acquireLock = vi.fn();
    expect(await executePluginMutation({
      operation: "add",
      entry,
      profile: "web",
      dryRun: true,
      allowCodeExecution: false,
    }, {
      platform: "win32",
      acquireLock,
      stdout: vi.fn(),
      stderr: vi.fn(),
    })).toBe(0);
    expect(acquireLock).not.toHaveBeenCalled();
  });

  it("never automatically clears a Windows recovery marker with incomplete membership proof", async () => {
    const marker = {
      version: 1,
      revision: 4,
      status: "recovery_required",
      phase: "needs_restore",
      ownerToken: "old-owner",
      fencingToken: 7,
      profile: "web",
      transaction: {
        profile: "web",
        fencingToken: 7,
        existed: true,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-windows.json",
        backupRelativePath: "profiles/.dsh-plugins-backup-web-windows",
        backupFingerprint: `sha512-${"A".repeat(86)}==`,
      },
      artifact: null,
      channel: null,
      processTree: {
        pid: 4_001,
        processGroupId: null,
        treeIdentity: "win32:incomplete",
        processStartIdentity: "root-created",
        platform: "win32",
        members: [{ pid: 4_001, creationIdentity: "root-created" }],
      },
      createdAt: "2026-08-16T00:00:00.000Z",
    } as MutationRecoveryJournal;
    const recoverTransaction = vi.fn();
    const removeRecoveryJournal = vi.fn();
    const isProcessTreeAlive = vi.fn(async () => false);
    const stderr = vi.fn();

    expect(await recoverPluginMutation({
      dshHome: "/canonical/home",
      platform: "win32",
      acquireLock: vi.fn(async () => ({
        canonicalHome: "/canonical/home",
        profile: "web",
        ownerToken: "new-owner",
        fencingToken: 8,
        assertOwned: vi.fn(async () => undefined),
        heartbeat: vi.fn(async () => undefined),
        release: vi.fn(async () => undefined),
      })),
      readRecoveryJournal: vi.fn(async () => marker),
      isProcessTreeAlive,
      recoverTransaction,
      removeRecoveryJournal,
      stdout: vi.fn(),
      stderr,
    })).toBe(1);

    expect(isProcessTreeAlive).not.toHaveBeenCalled();
    expect(recoverTransaction).not.toHaveBeenCalled();
    expect(removeRecoveryJournal).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith(expect.stringMatching(/Windows.*manual/iu));
  });
});
