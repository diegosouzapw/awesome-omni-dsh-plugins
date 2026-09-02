import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { parseManifestVersion, runCli, type CliDependencies } from "../src/app.js";
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

  // A relocated bundle resolves `../package.json` onto whatever package root sits above it, so the
  // read can succeed against the wrong file — while developing this suite it hit /tmp/package.json.
  // Announcing that file's version, or `undefined` (which crashed commander several calls later,
  // far from the cause), is worse than refusing.
  it.each([
    { label: "no version field", raw: '{"name":"unrelated"}' },
    { label: "a range instead of an exact version", raw: '{"version":"^1.2.3"}' },
    { label: "a non-string version", raw: '{"version":100}' },
    { label: "a truncated version", raw: '{"version":"1.2"}' },
  ])("refuses a manifest with $label", ({ raw }) => {
    expect(() => parseManifestVersion(raw)).toThrow(/exact version/u);
  });

  it("accepts the exact and prerelease forms a release can carry", () => {
    expect(parseManifestVersion('{"version":"1.0.2"}')).toBe("1.0.2");
    expect(parseManifestVersion('{"version":"1.1.0-rc.1"}')).toBe("1.1.0-rc.1");
  });

  // The end-to-end contract — an unreadable manifest still failing sanitized rather than printing
  // a V8 stack — needs the real bundle, so it lives in package-contents.test.ts, which already
  // owns dist/. Rebuilding it from here races that suite's `npm pack` (`build` starts with
  // `rm -rf dist`) and drops dist/bin.js from the packed set mid-run.
});
