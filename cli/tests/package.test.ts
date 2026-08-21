import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

interface PackageManifest {
  name: string;
  version: string;
  type: string;
  license: string;
  engines: { node: string };
  bin: Record<string, string>;
  files: string[];
  publishConfig: { access: string };
  scripts: Record<string, string>;
  dependencies?: Record<string, string>;
}

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as PackageManifest;

describe("published CLI package metadata", () => {
  it("owns the exact scoped package and executable", () => {
    expect(pkg.name).toBe("omni-dsh-plugins");
    // Not a frozen literal: the version moves every release, and freezing it means the release
    // itself fails the test for doing the one thing a release does. What must hold is that it is
    // exact semver — a range or a prerelease tag here would publish something npm resolves
    // differently from what the tag claims.
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/u);
    expect(pkg.type).toBe("module");
    expect(pkg.bin).toEqual({ "dsh-plugins": "dist/bin.js" });
    expect(pkg.license).toBe("MIT");
    expect(pkg.engines.node).toBe(">=20");
  });

  it("publishes only built code and public package documents", () => {
    expect(pkg.files).toEqual(["dist", "README.md", "LICENSE"]);
    // Owner decision (2026-08-18): provenance stays OFF until trusted publishing
    // lands; with it present every local npm publish would fail unless
    // --provenance=false were passed manually.
    expect(pkg.publishConfig).toEqual({ access: "public" });
    expect(pkg.scripts.build).toContain("esbuild");
    expect(pkg.scripts.build).not.toContain("sourcemap");
    expect(pkg.dependencies ?? {}).not.toHaveProperty("@omni-dsh/catalog-core");
  });
});
