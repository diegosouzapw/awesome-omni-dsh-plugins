import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { runCli, type CliDependencies } from "../src/app.js";
import { loadDefaultCatalog } from "../src/catalogSource.js";

const manifestVersion = (
  JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
    version: string;
  }
).version;

function harness() {
  let stdout = "";
  let stderr = "";
  const dependencies: CliDependencies = {
    loadCatalog: loadDefaultCatalog,
    stdout: (value) => {
      stdout += value;
    },
    stderr: (value) => {
      stderr += value;
    },
  };
  return { dependencies, output: () => ({ stdout, stderr }) };
}

describe("the version the CLI reports", () => {
  // npm versions are immutable: a release whose binary reports a different version than the
  // tarball it shipped in can never be corrected in place, only superseded. The manifest is the
  // single source of truth, so nothing may restate the number independently.
  it("matches the published package manifest", async () => {
    const { dependencies, output } = harness();

    const exitCode = await runCli(["--version"], dependencies);

    expect(exitCode).toBe(0);
    expect(output().stdout.trim()).toBe(manifestVersion);
  });

  // The help footer used to name the version inline ("disabled in v0.1.0"), which is the same
  // hardcoding one level removed: it silently ages into a false claim at the next release.
  it("never states a version number in help text", async () => {
    const { dependencies, output } = harness();

    await runCli(["--help"], dependencies);

    expect(output().stdout).not.toMatch(/v?\d+\.\d+\.\d+/u);
  });
});
