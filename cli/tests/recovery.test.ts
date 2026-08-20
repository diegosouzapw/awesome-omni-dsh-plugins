import { describe, expect, it, vi } from "vitest";

import { runCli } from "../src/app.js";
import {
  executePluginMutation,
  recoverPluginMutation,
} from "../src/commands/mutate.js";
import type {
  InstallState,
  RecoveryRequiredMarker,
} from "../src/dsh/installState.js";
import type { ProfileLock } from "../src/dsh/profileLock.js";
import type { PublicCatalogEntry } from "../src/model.js";

const marker: RecoveryRequiredMarker = {
  status: "recovery_required",
  profile: "web",
  fencingToken: 7,
  processTree: {
    pid: 4_242,
    processGroupId: 4_242,
    treeIdentity: "linux:123456",
    processStartIdentity: "linux:123456",
    platform: "linux",
  },
  artifact: {
    relativePath: ".dsh-plugins/artifact-leases/.lease-recovery/artifact.tgz",
    sha512: `sha512-${"A".repeat(86)}==`,
    bytes: 512,
    packageName: "fixture-plugin",
  },
  transaction: {
    profile: "web",
    fencingToken: 7,
    existed: true,
    journalRelativePath: "profiles/.dsh-plugins-transaction-web-recovery.json",
    backupRelativePath: "profiles/.dsh-plugins-backup-web-recovery",
  },
};

const recoveryState: InstallState = {
  version: 1,
  generation: 9,
  fencingToken: 7,
  installs: [],
  recoveryRequired: marker,
};

function recoveryHarness(treeAlive: boolean) {
  let stdout = "";
  let stderr = "";
  const order: string[] = [];
  const lock: ProfileLock = {
    canonicalHome: "/canonical/home",
    profile: "web",
    ownerToken: "recovery-owner",
    fencingToken: 8,
    assertOwned: vi.fn(async () => undefined),
    heartbeat: vi.fn(async () => undefined),
    release: vi.fn(async () => {
      order.push("release-lock");
    }),
  };
  const dependencies = {
    dshHome: "/canonical/home",
    acquireLock: vi.fn(async () => lock),
    readState: vi.fn(async () => recoveryState),
    writeState: vi.fn(async () => {
      order.push("clear-marker");
      return undefined;
    }),
    isProcessTreeAlive: vi.fn(async () => treeAlive),
    recoverTransaction: vi.fn(async () => {
      order.push("restore-profile");
    }),
    releaseRecoveredArtifact: vi.fn(async () => {
      order.push("release-artifact");
    }),
    stdout: (value: string) => { stdout += value; },
    stderr: (value: string) => { stderr += value; },
  };
  return { dependencies, lock, order, output: () => ({ stdout, stderr }) };
}

function entry(): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "fixture-plugin",
    name: "Fixture Plugin",
    description: { en: "A detailed fixture plugin for recovery tests.", evidencePath: "README.md" },
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
}

describe("explicit mutation recovery", () => {
  it("blocks every new mutation at the recovery marker before staging or spawn", async () => {
    const lock = recoveryHarness(false).lock;
    const stageEntry = vi.fn();
    const runDsh = vi.fn();

    expect(await executePluginMutation({
      operation: "add",
      entry: entry(),
      profile: "web",
      dryRun: false,
      allowCodeExecution: true,
    }, {
      dshHome: "/canonical/home",
      acquireLock: vi.fn(async () => lock),
      readState: vi.fn(async () => recoveryState),
      stageEntry,
      runDsh,
      stderr: vi.fn(),
    })).toBe(1);

    expect(stageEntry).not.toHaveBeenCalled();
    expect(runDsh).not.toHaveBeenCalled();
  });

  it("does not restore, clean or release anything while the process tree is alive", async () => {
    const test = recoveryHarness(true);

    expect(await recoverPluginMutation(test.dependencies)).toBe(1);
    expect(test.dependencies.isProcessTreeAlive).toHaveBeenCalledWith(marker.processTree);
    expect(test.dependencies.recoverTransaction).not.toHaveBeenCalled();
    expect(test.dependencies.releaseRecoveredArtifact).not.toHaveBeenCalled();
    expect(test.dependencies.writeState).not.toHaveBeenCalled();
    expect(test.lock.release).not.toHaveBeenCalled();
    expect(test.output().stderr).toBe(
      "Recovery is pending because the DSH process tree is still alive.\n",
    );
  });

  it("restores and clears fenced recovery state only after the whole tree is dead", async () => {
    const test = recoveryHarness(false);

    expect(await recoverPluginMutation(test.dependencies)).toBe(0);
    expect(test.dependencies.recoverTransaction).toHaveBeenCalledWith(
      test.dependencies.dshHome,
      marker.transaction,
      test.lock.assertOwned,
    );
    expect(test.dependencies.releaseRecoveredArtifact).toHaveBeenCalledWith(
      test.dependencies.dshHome,
      marker.artifact,
    );
    expect(test.dependencies.writeState).toHaveBeenCalledWith(
      test.dependencies.dshHome,
      { version: 1, installs: [] },
      expect.objectContaining({ expectedGeneration: 9, fencingToken: 8 }),
    );
    expect(test.order).toEqual([
      "restore-profile",
      "release-artifact",
      "clear-marker",
      "release-lock",
    ]);
  });

  it("wires recover without loading a catalog", async () => {
    const test = recoveryHarness(false);
    const loadCatalog = vi.fn(async () => {
      throw new Error("catalog must not load");
    });

    expect(await runCli(["recover"], {
      loadCatalog,
      stdout: test.dependencies.stdout,
      stderr: test.dependencies.stderr,
      mutationDependencies: test.dependencies,
    })).toBe(0);
    expect(loadCatalog).not.toHaveBeenCalled();
  });
});
