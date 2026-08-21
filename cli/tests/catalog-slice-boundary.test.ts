// The CLI is a CONSUMER of the public catalog. The code under src/catalog/ was vendored from the
// private curation engine when the CLI moved into this repository, and the boundary that keeps
// curation out of a published binary is not self-enforcing: someone vendoring "one more helper"
// from the same origin is how an engine leaks into a client.
//
// So this suite asserts the boundary on the two artifacts that matter — the vendored sources and
// the bundle that actually ships.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const cliRoot = fileURLToPath(new URL("../", import.meta.url));
const sliceDirectory = `${cliRoot}src/catalog`;

// This very file is the denylist, so it is the one source that legitimately spells every
// forbidden identifier. Everything else under src/ and tests/ is fair game for the scan.
const GUARD_FILE = fileURLToPath(import.meta.url);

function listTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => path !== GUARD_FILE)
    .sort();
}

// Exactly the closure the CLI needs to read and validate a catalog entry. Adding a file here is
// a deliberate act that has to be argued for in review, which is the entire point.
const ALLOWED_SLICE = [
  "bundleMarker.ts",
  "canonical.ts",
  "index.ts",
  "loadCatalog.ts",
  "publicCatalogValidator.ts",
  "publicSchema.ts",
  "types.ts",
];

// Identifiers that only exist to CURATE a catalog — deciding which candidate is an upstream copy,
// which is a duplicate, where a harvest cursor stopped — plus the names of the private review
// process itself (its review ids and its pipeline components). A client never needs any of them.
const CURATION_IDENTIFIERS: readonly (string | RegExp)[] = [
  "isUpstreamHarness",
  "UPSTREAM_HARNESS",
  "isUpstreamCopy",
  "annotateDuplicates",
  "isRepositoryFixture",
  "cursorProgress",
  "harvest",
  "candidateLedger",
  "manual-approvals",
  "qualification-report",
  "clone-inventory",
  "ApprovedWriteBatch",
  "preparePullRequest",
  // Private review-finding ids (REV-nn) and process/component names from the curation side.
  /REV-\d/u,
  "publication-runner",
  "pr-orchestrator",
  "intelligence",
];

function findLeaks(content: string): (string | RegExp)[] {
  return CURATION_IDENTIFIERS.filter((identifier) =>
    typeof identifier === "string" ? content.includes(identifier) : identifier.test(content),
  );
}

describe("the vendored catalog slice stays a reading contract", () => {
  it("contains exactly the agreed files", () => {
    expect(readdirSync(sliceDirectory).sort()).toEqual(ALLOWED_SLICE);
  });

  it("carries no curation logic", () => {
    const sources = readdirSync(sliceDirectory)
      .map((name) => readFileSync(`${sliceDirectory}/${name}`, "utf8"))
      .join("\n");

    expect(findLeaks(sources)).toEqual([]);
  });

  it("reaches nothing outside the CLI", () => {
    const sources = readdirSync(sliceDirectory)
      .map((name) => readFileSync(`${sliceDirectory}/${name}`, "utf8"))
      .join("\n");

    // A relative import climbing past src/ would silently re-couple the slice to whatever sits
    // beside it, and a workspace specifier would resurrect the dependency this move removed.
    expect(sources).not.toContain("@omni-dsh/");
    expect(sources).not.toMatch(/from "\.\.\/\.\./u);
  });
});

describe("every source and test file", () => {
  // The slice-only scan above is how the first leak slipped through: comments referencing the
  // private review process landed in files OUTSIDE src/catalog/ and nothing looked at them.
  // So the denylist also sweeps the whole CLI — all of src/ and tests/ — excluding only this
  // guard, which necessarily spells the forbidden identifiers to ban them.
  it("names nothing from the private curation process", () => {
    const files = [...listTypeScriptFiles(`${cliRoot}src`), ...listTypeScriptFiles(`${cliRoot}tests`)];
    expect(files.length).toBeGreaterThan(30);

    const leaks = files.flatMap((path) => {
      const found = findLeaks(readFileSync(path, "utf8"));
      return found.length > 0
        ? [`${relative(cliRoot, path).split(sep).join("/")}: ${found.map(String).join(", ")}`]
        : [];
    });

    expect(leaks).toEqual([]);
  });
});

describe("the shipped bundle", () => {
  it("contains no curation identifier", () => {
    // Source-level purity is not enough: the binary is what people install, and esbuild decides
    // what survives. Build it if it is not already there so the assertion is never vacuous.
    const bundle = `${cliRoot}dist/bin.js`;
    if (!existsSync(bundle)) {
      execFileSync("npm", ["run", "build"], { cwd: cliRoot, stdio: "ignore" });
    }
    const built = readFileSync(bundle, "utf8");
    expect(built.length).toBeGreaterThan(100_000);

    expect(findLeaks(built)).toEqual([]);
  });
});
