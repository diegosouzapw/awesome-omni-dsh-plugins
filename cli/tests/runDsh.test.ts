import { EventEmitter } from "node:events";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { executePluginMutation } from "../src/commands/mutate.js";
import { beginProfileTransaction } from "../src/dsh/profileTransaction.js";
import {
  DshExecutionUncertainError,
  runDsh,
  type DshProcessTreeIdentity,
} from "../src/dsh/runDsh.js";
import { stageCatalogEntry, type StagedCatalogInstall } from "../src/dsh/staging.js";
import type { InstallState, StagedInstall } from "../src/dsh/installState.js";
import type { PublicCatalogEntry } from "../src/model.js";

const roots: string[] = [];

function tempRoot(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

function npmEntry(
  overrides: Partial<PublicCatalogEntry> = {},
): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "vision-helper",
    name: "Vision Helper",
    description: { en: "A creator-built vision workflow for DSH users.", evidencePath: "README.md" },
    unofficial: true,
    kind: "plugin",
    primaryCategory: "vision-audio-multimodal",
    tags: ["vision"],
    source: {
      repository: "https://github.com/creator/vision-helper",
      repositoryNodeId: "R_vision",
      subpath: null,
      commit: "b".repeat(40),
    },
    creator: { github: "creator" },
    package: {
      ecosystem: "npm",
      name: "@creator/vision-helper",
      version: "1.2.3",
      integrity:
        "sha512-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
    },
    dsh: { profiles: ["web"], evidencePath: "package.json" },
    repositoryScope: "dedicated",
    popularity: { starsPolicy: "exact-repository", stars: 10 },
    license: { spdx: "MIT" },
    verification: {
      status: "eligible",
      checkedAt: "2026-08-16T00:00:00Z",
      repositoryIdentity: "resolved",
      smokeTest: null,
    },
    provenance: { discussion: null, comment: null },
    canonicalKey: "R_vision:.",
    ...overrides,
  };
}

function exitingChild(code: number): EventEmitter {
  const child = new EventEmitter();
  queueMicrotask(() => child.emit("close", code, null));
  return child;
}

describe("literal DSH delegation", () => {
  it("passes injection-shaped profile and source values as argv with shell disabled", async () => {
    const spawn = vi.fn(() => exitingChild(0));
    expect(
      await runDsh("web;touch /tmp/no", ["add", "pkg && whoami"], { spawn: spawn as never }),
    ).toBe(0);
    expect(spawn).toHaveBeenCalledWith(
      "dsh",
      ["plugin", "--profile", "web;touch /tmp/no", "add", "pkg && whoami"],
      expect.objectContaining({ shell: false, stdio: "inherit" }),
    );
  });
});

describe("verified staging", () => {
  it("downloads an allowlisted exact npm version and atomically stages only matching SHA-512", async () => {
    const home = tempRoot("dsh-plugins-npm-");
    const bytes = Buffer.from("fixture package tarball");
    const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
    const entry = npmEntry({
      package: { ecosystem: "npm", name: "@creator/vision-helper", version: "1.2.3", integrity },
    });
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("%40creator%2Fvision-helper")) {
        return new Response(JSON.stringify({
          versions: {
            "1.2.3": {
              dist: {
                integrity,
                tarball: "https://registry.npmjs.org/@creator/vision-helper/-/vision-helper-1.2.3.tgz",
              },
            },
          },
        }), { status: 200, headers: { "content-type": "application/json" } });
      }
      return new Response(bytes, { status: 200, headers: { "content-length": String(bytes.length) } });
    });

    const staged = await stageCatalogEntry(entry, { dshHome: home, fetchImpl: fetchImpl as typeof fetch });
    expect(staged.packageName).toBe("@creator/vision-helper");
    expect(staged.installTarget.endsWith(".tgz")).toBe(true);
    expect(readFileSync(staged.installTarget)).toEqual(bytes);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("rejects checksum mismatch before publishing a cache target", async () => {
    const home = tempRoot("dsh-plugins-checksum-");
    const integrity = `sha512-${createHash("sha512").update("expected").digest("base64")}`;
    const entry = npmEntry({
      package: { ecosystem: "npm", name: "fixture", version: "1.0.0", integrity },
    });
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      if (String(input).endsWith("/fixture")) {
        return new Response(JSON.stringify({
          versions: { "1.0.0": { dist: { integrity, tarball: "https://registry.npmjs.org/fixture/-/fixture-1.0.0.tgz" } } },
        }), { status: 200 });
      }
      return new Response("different", { status: 200 });
    });
    await expect(
      stageCatalogEntry(entry, { dshHome: home, fetchImpl: fetchImpl as typeof fetch }),
    ).rejects.toThrow("checksum verification failed");
  });

  it("blocks non-GitHub source URLs, traversal and symlink escapes", async () => {
    const home = tempRoot("dsh-plugins-source-");
    const sourceBase = npmEntry({ package: { ecosystem: "source" } });
    await expect(stageCatalogEntry({
      ...sourceBase,
      source: { ...sourceBase.source, repository: "https://example.com/creator/plugin" },
    }, { dshHome: home })).rejects.toThrow("source repository is not allowlisted");
    await expect(stageCatalogEntry({
      ...sourceBase,
      source: { ...sourceBase.source, subpath: "../escape" },
    }, { dshHome: home })).rejects.toThrow("source subpath is unsafe");

    const outside = tempRoot("dsh-plugins-outside-");
    const runProcess = vi.fn(async (request: { args: readonly string[]; cwd: string }) => {
      if (request.args.includes("checkout")) {
        writeFileSync(join(request.cwd, "package.json"), JSON.stringify({ name: "source-plugin" }));
        symlinkSync(outside, join(request.cwd, "escape"));
      }
      return request.args.includes("rev-parse") ? `${sourceBase.source.commit}\n` : "";
    });
    await expect(stageCatalogEntry(sourceBase, { dshHome: home, runProcess })).rejects.toThrow(
      "source tree contains a symlink escape",
    );
  });
});

describe("profile transaction", () => {
  it("restores the complete observable profile after a failed mutation", async () => {
    const home = tempRoot("dsh-plugins-profile-");
    const profile = join(home, "profiles", "web");
    mkdirSync(profile, { recursive: true });
    writeFileSync(join(profile, "package.json"), "before\n");
    const transaction = await beginProfileTransaction(home, "web");
    writeFileSync(join(profile, "package.json"), "after\n");
    writeFileSync(join(profile, "pnpm-lock.yaml"), "changed\n");
    await transaction.rollback();
    expect(readFileSync(join(profile, "package.json"), "utf8")).toBe("before\n");
    expect(existsSync(join(profile, "pnpm-lock.yaml"))).toBe(false);
  });

  it("rejects traversal-shaped profile names before touching disk", async () => {
    const home = tempRoot("dsh-plugins-profile-name-");
    await expect(beginProfileTransaction(home, "../outside")).rejects.toThrow("profile name is unsafe");
  });
});

describe("idempotent mutation orchestration", () => {
  const stagedInstall: StagedInstall = {
    fingerprint: "sha256:fixture",
    installTarget: "/safe/cache/plugin.tgz",
    displayTarget: "$DSH_HOME/.dsh-plugins/cache/vision-helper/plugin.tgz",
    packageName: "@creator/vision-helper",
    cacheRelativePath: "vision-helper/fixture/plugin.tgz",
  };

  function fixtureDependencies(state: InstallState = { version: 1, installs: [] }) {
    let stdout = "";
    let stderr = "";
    const artifactLease = {
      recoveryReference: {
        relativePath: ".dsh-plugins/artifact-leases/.lease-fixture/artifact.tgz",
        sha512: `sha512-${"A".repeat(86)}==`,
        bytes: 128,
        packageName: "@creator/vision-helper",
      },
      revalidate: vi.fn(async () => undefined),
      readVerifiedBytes: vi.fn(async () => Buffer.alloc(128)),
      release: vi.fn(async () => undefined),
    };
    const staged: StagedCatalogInstall = { ...stagedInstall, artifactLease };
    const transaction = {
      recoveryReference: {
        profile: "web",
        fencingToken: 1,
        existed: true,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-fixture.json",
        backupRelativePath: "profiles/.dsh-plugins-backup-web-fixture",
      },
      commit: vi.fn(async () => undefined),
      rollback: vi.fn(async () => undefined),
    };
    const lock = {
      canonicalHome: "/canonical/home",
      profile: "web",
      ownerToken: "mutation-owner",
      fencingToken: 1,
      assertOwned: vi.fn(async () => undefined),
      heartbeat: vi.fn(async () => undefined),
      release: vi.fn(async () => undefined),
    };
    const channel = {
      installTarget: "http://127.0.0.1:43123/secret/artifact.tgz",
      descriptor: {
        kind: "loopback-buffer-v1" as const,
        sha512: artifactLease.recoveryReference.sha512,
        bytes: artifactLease.recoveryReference.bytes,
        sourceFingerprint: staged.fingerprint,
      },
      close: vi.fn(async () => undefined),
    };
    const dependencies = {
      dshHome: tempRoot("dsh-plugins-mutation-"),
      acquireLock: vi.fn(async () => lock),
      readRecoveryJournal: vi.fn(async () => null),
      stageEntry: vi.fn(async () => staged),
      runDsh: vi.fn(async () => 0),
      readState: vi.fn(async () => state),
      fingerprintActiveProfile: vi.fn(async () => artifactLease.recoveryReference.sha512),
      writeState: vi.fn(async () => undefined),
      beginTransaction: vi.fn(async () => transaction),
      openArtifactChannel: vi.fn(async () => channel),
      createRecoveryJournal: vi.fn(async (_home, input) => ({
        version: 1 as const,
        revision: 1,
        status: "in_progress" as const,
        phase: "needs_restore" as const,
        ...input,
      })),
      updateRecoveryJournal: vi.fn(async (_home, current, patch) => ({
        ...current,
        ...patch,
        revision: current.revision + 1,
      })),
      removeRecoveryJournal: vi.fn(async () => undefined),
      stdout: (value: string) => { stdout += value; },
      stderr: (value: string) => { stderr += value; },
    };
    return { dependencies, transaction, lock, artifactLease, output: () => ({ stdout, stderr }) };
  }

  it("makes dry-run process-free and requires explicit code-execution consent", async () => {
    const dry = fixtureDependencies();
    expect(await executePluginMutation({
      operation: "add", entry: npmEntry(), profile: "web", dryRun: true, allowCodeExecution: false,
    }, dry.dependencies)).toBe(0);
    expect(dry.dependencies.stageEntry).not.toHaveBeenCalled();
    expect(dry.dependencies.runDsh).not.toHaveBeenCalled();
    expect(dry.output().stdout).toContain("Dry run: no files or processes changed.");

    const blocked = fixtureDependencies();
    expect(await executePluginMutation({
      operation: "add", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: false,
    }, blocked.dependencies)).toBe(2);
    expect(blocked.dependencies.stageEntry).not.toHaveBeenCalled();
    expect(blocked.dependencies.runDsh).not.toHaveBeenCalled();
    expect(blocked.output().stderr).toContain("--allow-code-execution");
  });

  it("shows the unofficial notice in the pre-spawn code-execution consent message", async () => {
    const test = fixtureDependencies();
    expect(await executePluginMutation({
      operation: "add", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: false,
    }, test.dependencies)).toBe(2);
    expect(test.dependencies.runDsh).not.toHaveBeenCalled();
    expect(test.output().stderr).toBe(
      "Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.\n" +
        "Consent required: rerun with --allow-code-execution because DSH delegates to pnpm " +
        "and may execute package lifecycle code.\n",
    );
  });

  it("blocks quarantined and unavailable entries before staging", async () => {
    for (const status of ["quarantined", "unavailable"] as const) {
      const test = fixtureDependencies();
      const entry = npmEntry({ verification: { ...npmEntry().verification, status } });
      expect(await executePluginMutation({
        operation: "add", entry, profile: "web", dryRun: false, allowCodeExecution: true,
      }, test.dependencies)).toBe(1);
      expect(test.dependencies.stageEntry).not.toHaveBeenCalled();
      expect(test.output().stderr).toContain(`is ${status} and cannot be installed`);
    }
  });

  it("does not spawn when the exact staged fingerprint is already installed", async () => {
    const test = fixtureDependencies({
      version: 1,
      installs: [{
        id: "vision-helper",
        profile: "web",
        packageName: stagedInstall.packageName,
        fingerprint: stagedInstall.fingerprint,
        cacheRelativePath: stagedInstall.cacheRelativePath,
        installedAt: "2026-08-16T00:00:00.000Z",
      }],
    });
    expect(await executePluginMutation({
      operation: "update", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: true,
    }, test.dependencies)).toBe(0);
    expect(test.dependencies.runDsh).not.toHaveBeenCalled();
    expect(test.dependencies.beginTransaction).not.toHaveBeenCalled();
    expect(test.output().stdout).toContain("already matches the pinned catalog artifact");
  });

  it("rolls the profile back and leaves state untouched on DSH failure", async () => {
    const test = fixtureDependencies();
    test.dependencies.runDsh.mockResolvedValue(1);
    expect(await executePluginMutation({
      operation: "add", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: true,
    }, test.dependencies)).toBe(1);
    expect(test.transaction.rollback).toHaveBeenCalledOnce();
    expect(test.transaction.commit).not.toHaveBeenCalled();
    expect(test.dependencies.writeState).not.toHaveBeenCalled();
    expect(test.artifactLease.release).toHaveBeenCalledOnce();
    expect(test.lock.release).toHaveBeenCalledOnce();
  });

  it("rolls back an ambiguous timed-out DSH mutation and requires recovery", async () => {
    const test = fixtureDependencies();
    test.dependencies.runDsh.mockRejectedValue(new DshExecutionUncertainError("timeout", true));

    expect(await executePluginMutation({
      operation: "add", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: true,
    }, test.dependencies)).toBe(1);

    expect(test.transaction.rollback).toHaveBeenCalledOnce();
    expect(test.transaction.commit).not.toHaveBeenCalled();
    expect(test.dependencies.writeState).not.toHaveBeenCalled();
    expect(test.artifactLease.release).toHaveBeenCalledOnce();
    expect(test.lock.release).toHaveBeenCalledOnce();
    expect(test.output().stderr).toBe(
      "dsh execution timed out; result is ambiguous; recovery required\n",
    );
  });

  it("revalidates the private artifact only after backup and immediately before DSH", async () => {
    const test = fixtureDependencies();
    const order: string[] = [];
    test.dependencies.beginTransaction.mockImplementation(async () => {
      order.push("backup");
      return test.transaction;
    });
    test.artifactLease.revalidate.mockImplementation(async () => {
      order.push("revalidate");
    });
    test.dependencies.runDsh.mockImplementation(async () => {
      order.push("spawn");
      return 0;
    });
    test.artifactLease.release.mockImplementation(async () => {
      order.push("release");
    });

    expect(await executePluginMutation({
      operation: "add", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: true,
    }, test.dependencies)).toBe(0);
    expect(order).toEqual(["backup", "revalidate", "spawn", "release"]);
    expect(test.dependencies.runDsh).toHaveBeenCalledWith(
      "web",
      ["add", "http://127.0.0.1:43123/secret/artifact.tgz"],
      expect.objectContaining({ onSpawn: expect.any(Function) }),
    );
  });

  it.each(["timeout", "aborted"] as const)(
    "retains every recovery resource when a %s leaves the DSH tree unreaped",
    async (reason) => {
      const test = fixtureDependencies({ version: 1, generation: 0, fencingToken: 0, installs: [] });
      const processTree: DshProcessTreeIdentity = {
        pid: 7_777,
        processGroupId: 7_777,
        treeIdentity: "linux:987654",
        processStartIdentity: "linux:987654",
        platform: "linux",
      };
      test.dependencies.runDsh.mockRejectedValue(
        new DshExecutionUncertainError(reason, false, processTree),
      );

      expect(await executePluginMutation({
        operation: "add", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: true,
      }, test.dependencies)).toBe(1);

      expect(test.transaction.rollback).not.toHaveBeenCalled();
      expect(test.transaction.commit).not.toHaveBeenCalled();
      expect(test.artifactLease.release).not.toHaveBeenCalled();
      expect(test.lock.release).not.toHaveBeenCalled();
      expect(test.dependencies.writeState).toHaveBeenCalledWith(
        test.dependencies.dshHome,
        expect.objectContaining({
          recoveryRequired: expect.objectContaining({
            status: "recovery_required",
            profile: "web",
            fencingToken: 1,
            processTree,
            artifact: test.artifactLease.recoveryReference,
            transaction: test.transaction.recoveryReference,
          }),
        }),
        expect.objectContaining({ expectedGeneration: 0, fencingToken: 1 }),
      );
    },
  );

  it("treats removal of an absent catalog-managed install as success", async () => {
    const test = fixtureDependencies();
    expect(await executePluginMutation({
      operation: "remove", entry: npmEntry(), profile: "web", dryRun: false, allowCodeExecution: false,
    }, test.dependencies)).toBe(0);
    expect(test.dependencies.stageEntry).not.toHaveBeenCalled();
    expect(test.dependencies.runDsh).not.toHaveBeenCalled();
    expect(test.output().stdout).toContain("is not installed by dsh-plugins");
  });
});
