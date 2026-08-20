// The CLI is a CONSUMER of the public catalog. The code under src/catalog/ was vendored from the
// private curation engine when the CLI moved into this repository, and the boundary that keeps
// curation out of a published binary is not self-enforcing: someone vendoring "one more helper"
// from the same origin is how an engine leaks into a client.
//
// So this suite asserts the boundary on the two artifacts that matter — the vendored sources and
// the bundle that actually ships.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const cliRoot = fileURLToPath(new URL("../", import.meta.url));
const sliceDirectory = `${cliRoot}src/catalog`;

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
// which is a duplicate, where a harvest cursor stopped. A client never needs to answer these.
const CURATION_IDENTIFIERS = [
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
];

describe("the vendored catalog slice stays a reading contract", () => {
  it("contains exactly the agreed files", () => {
    expect(readdirSync(sliceDirectory).sort()).toEqual(ALLOWED_SLICE);
  });

  it("carries no curation logic", () => {
    const sources = readdirSync(sliceDirectory)
      .map((name) => readFileSync(`${sliceDirectory}/${name}`, "utf8"))
      .join("\n");

    for (const identifier of CURATION_IDENTIFIERS) {
      expect(sources).not.toContain(identifier);
    }
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

    for (const identifier of CURATION_IDENTIFIERS) {
      expect(built).not.toContain(identifier);
    }
  });
});
