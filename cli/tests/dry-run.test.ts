import { describe, expect, it, vi } from "vitest";

import { runCli, type CliDependencies } from "../src/app.js";
import { executePluginMutation } from "../src/commands/mutate.js";
import type { CatalogSnapshot, PublicCatalogEntry } from "../src/model.js";

function entry(): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "fixture-plugin",
    name: "Fixture Plugin",
    description: { en: "A detailed fixture plugin used for strict dry-run tests.", evidencePath: "README.md" },
    unofficial: true,
    kind: "plugin",
    primaryCategory: "coding-developer-tools",
    tags: ["coding"],
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

function snapshot(entries: readonly PublicCatalogEntry[]): CatalogSnapshot {
  return {
    source: {
      kind: "snapshot",
      declaredRevision: "c".repeat(40),
      pinStatus: "declared-local",
    },
    entries,
    diagnostics: [],
  };
}

function forbidden(): ReturnType<typeof vi.fn> {
  return vi.fn(() => {
    throw new Error("strict dry-run touched a forbidden dependency");
  });
}

function forbiddenMutationDependencies() {
  return {
    acquireLock: forbidden() as never,
    readState: forbidden() as never,
    writeState: forbidden() as never,
    stageEntry: forbidden() as never,
    beginTransaction: forbidden() as never,
    runDsh: forbidden() as never,
    now: forbidden() as never,
  };
}

function appHarness(loadCatalog: ReturnType<typeof vi.fn>) {
  let stdout = "";
  let stderr = "";
  const mutationDependencies = forbiddenMutationDependencies();
  const dependencies: CliDependencies = {
    loadCatalog: loadCatalog as never,
    stdout: (value) => {
      stdout += value;
    },
    stderr: (value) => {
      stderr += value;
    },
    mutationDependencies,
  };
  return {
    dependencies,
    mutationDependencies,
    output: () => ({ stdout, stderr }),
  };
}

describe("strict dry-run", () => {
  it("prints the resolved plan before lock, state, staging, transaction, network or process access", async () => {
    let stdout = "";
    let stderr = "";
    const acquireLock = forbidden();
    const readState = forbidden();
    const writeState = forbidden();
    const stageEntry = forbidden();
    const beginTransaction = forbidden();
    const runDsh = forbidden();
    const now = forbidden();

    expect(await executePluginMutation({
      operation: "add",
      entry: entry(),
      profile: "web",
      dryRun: true,
      allowCodeExecution: false,
    }, {
      dshHome: "/must-not-be-touched",
      acquireLock: acquireLock as never,
      readState: readState as never,
      writeState: writeState as never,
      stageEntry: stageEntry as never,
      beginTransaction: beginTransaction as never,
      runDsh: runDsh as never,
      now: now as never,
      stdout: (value) => {
        stdout += value;
      },
      stderr: (value) => {
        stderr += value;
      },
    })).toBe(0);

    for (const dependency of [
      acquireLock,
      readState,
      writeState,
      stageEntry,
      beginTransaction,
      runDsh,
      now,
    ]) {
      expect(dependency).not.toHaveBeenCalled();
    }
    expect(stdout).toContain("Plugin: fixture-plugin (Fixture Plugin)");
    expect(stdout).toContain("Creator: @creator");
    expect(stdout).toContain(
      "DSH command: dsh plugin --profile web add <catalog-artifact:fixture-plugin>",
    );
    expect(stdout).toContain(
      "install state, profile, cache, and subprocesses were not accessed",
    );
    expect(stdout).toContain("Dry run: no files or processes changed.");
    expect(stderr).toBe("");
  });

  it("rejects a dry-run entry that fails installability validation without mutation access", async () => {
    let stdout = "";
    let stderr = "";
    const quarantined: PublicCatalogEntry = {
      ...entry(),
      verification: { ...entry().verification, status: "quarantined" },
    };
    const stageEntry = forbidden();
    const runDsh = forbidden();

    expect(await executePluginMutation({
      operation: "add",
      entry: quarantined,
      profile: "web",
      dryRun: true,
      allowCodeExecution: false,
    }, {
      stageEntry: stageEntry as never,
      runDsh: runDsh as never,
      stdout: (value) => {
        stdout += value;
      },
      stderr: (value) => {
        stderr += value;
      },
    })).toBe(1);

    expect(stageEntry).not.toHaveBeenCalled();
    expect(runDsh).not.toHaveBeenCalled();
    expect(stderr).toContain("is quarantined and cannot be installed");
    expect(stdout).not.toContain("DSH command:");
  });

  it("resolves the requested catalog selection during dry-run without mutation side effects", async () => {
    const loadCatalog = vi.fn(async () => snapshot([entry()]));
    const { dependencies, mutationDependencies, output } = appHarness(loadCatalog);

    expect(await runCli([
      "add",
      "fixture-plugin",
      "--profile",
      "web",
      "--catalog",
      "/tmp/example-catalog",
      "--revision",
      "d".repeat(40),
      "--dry-run",
    ], dependencies)).toBe(0);

    expect(loadCatalog).toHaveBeenCalledExactlyOnceWith({
      root: "/tmp/example-catalog",
      revision: "d".repeat(40),
    });
    for (const dependency of Object.values(mutationDependencies)) {
      expect(dependency).not.toHaveBeenCalled();
    }
    expect(output().stdout).toContain("Plugin: fixture-plugin (Fixture Plugin)");
    expect(output().stdout).toContain("Dry run: no files or processes changed.");
    expect(output().stderr).toBe("");
  });

  it("fails a dry-run for a plugin the resolved catalog does not contain", async () => {
    const loadCatalog = vi.fn(async () => snapshot([entry()]));
    const { dependencies, mutationDependencies, output } = appHarness(loadCatalog);

    expect(await runCli([
      "add",
      "missing-plugin",
      "--profile",
      "web",
      "--dry-run",
    ], dependencies)).toBe(1);

    expect(loadCatalog).toHaveBeenCalledOnce();
    for (const dependency of Object.values(mutationDependencies)) {
      expect(dependency).not.toHaveBeenCalled();
    }
    expect(output().stderr).toContain("Plugin not found: missing-plugin");
    expect(output().stdout).not.toContain("DSH command:");
  });

  it("keeps remove dry-run available for ids outside the resolved catalog", async () => {
    const loadCatalog = vi.fn(async () => snapshot([entry()]));
    const { dependencies, mutationDependencies, output } = appHarness(loadCatalog);

    expect(await runCli([
      "remove",
      "not-in-catalog",
      "--profile",
      "web",
      "--dry-run",
    ], dependencies)).toBe(0);

    expect(loadCatalog).toHaveBeenCalledOnce();
    for (const dependency of Object.values(mutationDependencies)) {
      expect(dependency).not.toHaveBeenCalled();
    }
    expect(output().stdout).toContain("Plugin: not-in-catalog");
    expect(output().stdout).toContain(
      "DSH command: dsh plugin --profile web remove <catalog-artifact:not-in-catalog>",
    );
    expect(output().stdout).toContain("Dry run: no files or processes changed.");
    expect(output().stderr).toBe("");
  });
});
