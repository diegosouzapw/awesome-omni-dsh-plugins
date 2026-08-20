import { describe, expect, it } from "vitest";

import { runCli, type CliDependencies } from "../src/app.js";

const entry = {
  schemaVersion: 1 as const,
  id: "vision-helper",
  name: "Vision Helper",
  description: { en: "A creator-built vision workflow for DSH users.", evidencePath: "README.md" },
  unofficial: true as const,
  kind: "plugin" as const,
  primaryCategory: "vision-audio-multimodal",
  tags: ["vision", "web-ui"],
  source: {
    repository: "https://github.com/creator/vision-helper",
    repositoryNodeId: "R_vision",
    subpath: "packages/dsh",
    commit: "b".repeat(40),
  },
  creator: { github: "creator" },
  package: {
    ecosystem: "npm" as const,
    name: "@creator/vision-helper",
    version: "1.2.3",
    integrity:
      "sha512-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
  },
  dsh: { profiles: ["web"], evidencePath: "packages/dsh/package.json" },
  repositoryScope: "monorepo" as const,
  popularity: { starsPolicy: "undefined-parent-repository" as const, stars: null },
  license: { spdx: "MIT" },
  verification: {
    status: "eligible" as const,
    checkedAt: "2026-08-16T00:00:00Z",
    repositoryIdentity: "resolved" as const,
    smokeTest: null,
  },
  provenance: { discussion: null, comment: null },
  canonicalKey: "R_vision:packages/dsh",
};

function harness() {
  let stdout = "";
  let stderr = "";
  const dependencies: CliDependencies = {
    loadCatalog: async () => ({
      source: { kind: "snapshot", declaredRevision: "a".repeat(40), pinStatus: "declared-local" },
      entries: [entry],
      diagnostics: [],
    }),
    stdout: (value) => {
      stdout += value;
    },
    stderr: (value) => {
      stderr += value;
    },
  };
  return { dependencies, output: () => ({ stdout, stderr }) };
}

describe("catalog discovery", () => {
  it("searches tokenized public fields locally", async () => {
    const test = harness();
    expect(await runCli(["search", "creator vision"], test.dependencies)).toBe(0);
    expect(test.output().stdout).toContain("vision-helper\tVision Helper\t@creator\teligible");
    expect(test.output().stderr).toBe("");
  });

  it("prints creator, package, license, verification and monorepo stars honestly", async () => {
    const test = harness();
    expect(await runCli(["info", "vision-helper"], test.dependencies)).toBe(0);
    expect(test.output().stdout).toContain("Name: Vision Helper");
    expect(test.output().stdout).toContain("Creator: @creator");
    expect(test.output().stdout).toContain("Package: @creator/vision-helper@1.2.3");
    expect(test.output().stdout).toContain("License: MIT");
    expect(test.output().stdout).toContain("Verification: eligible (not installation-tested)");
    expect(test.output().stdout).toContain("Stars: undefined (parent repository)");
  });

  it("reports a missing entry without leaking its catalog source", async () => {
    const test = harness();
    expect(await runCli(["info", "missing-plugin"], test.dependencies)).toBe(1);
    expect(test.output()).toEqual({ stdout: "", stderr: "Plugin not found: missing-plugin\n" });
  });
});
