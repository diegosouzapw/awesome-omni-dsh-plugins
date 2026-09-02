import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

interface PackFile {
  path: string;
  size: number;
  mode: number;
}

interface PackResult {
  id: string;
  name: string;
  version: string;
  filename: string;
  files: PackFile[];
}

const cliRoot = fileURLToPath(new URL("../", import.meta.url));
const manifestVersion = (
  JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8")) as {
    version: string;
  }
).version;
// The repository root, one level above the CLI now that it lives inside the catalog repo. Used
// only to assert the bundle embeds no absolute build path.
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "dsh-plugins-pack-"));
let dryRun: PackResult;
let packed: PackResult;
let tarball = "";

function npmPack(args: readonly string[]): PackResult {
  const raw = execFileSync("npm", ["pack", "--json", ...args], {
    cwd: cliRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  // npm 11 emits an array of reports; npm 12 keys the same reports by package name. Accept both,
  // or every contributor whose npm is one major ahead of CI's starts from a red baseline.
  const parsed = JSON.parse(raw) as PackResult[] | Record<string, PackResult>;
  const report = Array.isArray(parsed) ? parsed[0] : Object.values(parsed)[0];
  if (report === undefined) {
    throw new Error(`npm pack --json returned no report: ${raw.slice(0, 200)}`);
  }
  return report;
}

// The build + double npm pack competes with the rest of the suite for CPU;
// 30s flaked under full-suite load (same class of flake as the npx smoke below).
beforeAll(() => {
  // Plain npm in the CLI directory: this package is no longer a member of a pnpm workspace, and
  // invoking a package manager the environment may not have is a failure that only shows up off
  // the author's machine.
  execFileSync("npm", ["run", "build"], { cwd: cliRoot, stdio: "pipe" });
  dryRun = npmPack(["--dry-run"]);
  packed = npmPack(["--pack-destination", output]);
  tarball = join(output, packed.filename);
}, 60_000);

afterAll(() => {
  rmSync(output, { recursive: true, force: true });
});

describe("packed public CLI", () => {
  it("contains only package metadata, public docs and the executable bundle", () => {
    // The tarball must declare the same identity the manifest does. Asserting a literal version
    // here made every release red for shipping a new version.
    expect(packed.name).toBe("omni-dsh-plugins");
    expect(packed.version).toBe(manifestVersion);
    expect(packed.version).toMatch(/^\d+\.\d+\.\d+$/u);
    const paths = dryRun.files.map((file) => file.path).sort();
    expect(paths).toEqual(["LICENSE", "README.md", "dist/bin.js", "package.json"]);
    const bin = packed.files.find((file) => file.path === "dist/bin.js");
    expect(bin).toBeDefined();
    expect((bin?.mode ?? 0) & 0o111).not.toBe(0);
    const readme = readFileSync(join(cliRoot, "README.md"), "utf8");
    expect(readme).toContain("local structural and semantic validation");
    expect(readme).toContain("does not prove repository identity or pinned-source evidence");
  });

  it("ships no source maps, private source, ledgers, fixtures or absolute build paths", () => {
    const paths = packed.files.map((file) => file.path).join("\n");
    expect(paths).not.toMatch(/(?:^|\/)(?:src|tests|fixtures|private-data|\.superpowers)(?:\/|$)/u);
    expect(paths).not.toMatch(/\.map$/mu);
    const bundle = readFileSync(join(cliRoot, "dist/bin.js"), "utf8");
    expect(bundle).not.toContain("sourceMappingURL");
    expect(bundle).not.toContain(repoRoot);
    // Built by concatenation so this test file never spells the private terms itself —
    // otherwise the negative assertion would be the very source the boundary guard flags.
    expect(bundle).not.toContain("discussion-" + "harv" + "ester");
    expect(bundle).not.toContain("private-data");
    expect(bundle).not.toContain("packages/" + "ledger");
  });

  // The npx smoke installs the packed tarball and spawns the binary; the 10s
  // suite default flaked under full-suite load, so give it an explicit budget.
  it("runs the packed scoped binary through npx", { timeout: 60_000 }, () => {
    const smoke = join(output, "smoke");
    mkdirSync(smoke);
    execFileSync(
      "npm",
      ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
      { cwd: smoke, stdio: ["ignore", "pipe", "pipe"], timeout: 30_000 },
    );
    // The binary must announce the version it actually shipped as. The tarball metadata above
    // agreeing with the manifest is not enough: 1.0.0 packed correctly while the executable
    // inside still answered 0.1.0, and an immutable npm version cannot be corrected afterwards.
    const reported = execFileSync("npx", ["--no-install", "dsh-plugins", "--version"], {
      cwd: smoke,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 30_000,
    });
    expect(reported.trim()).toBe(manifestVersion);

    const help = execFileSync("npx", ["--no-install", "dsh-plugins", "--help"], {
      cwd: smoke,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 30_000,
    });
    expect(help).toContain("Usage: dsh-plugins");
    for (const command of [
      "catalog",
      "search",
      "info",
      "add",
      "update",
      "remove",
      "list",
      "doctor",
    ]) {
      expect(help).toContain(command);
    }
    expect(help).toContain("Unofficial community project");
  });

  // Reading the version from the manifest replaced a string literal, which could not fail, with
  // file I/O, which can — and it runs while the command tree is built, outside the parse
  // try/catch. Lives here rather than beside the other version assertions because it needs
  // dist/bin.js, and this file already owns the single build. One spawn, not one per failure
  // mode: the content cases (missing/invalid version) are covered in process against
  // parseManifestVersion in reported-version.test.ts, and extra subprocesses are pure concurrent
  // load on an already timing-sensitive suite.
  it("fails sanitized, not with a raw stack, when the manifest cannot be read", () => {
    // The bundle goes one level below a temp root we own, mirroring its real dist/ position, so
    // the parent it resolves is ours and never a real package root above the OS temp dir.
    const orphan = mkdtempSync(join(tmpdir(), "dsh-plugins-orphan-"));
    const nested = join(orphan, "dist");
    mkdirSync(nested);
    const bin = join(nested, "bin.js");
    copyFileSync(join(cliRoot, "dist/bin.js"), bin);

    // stderr and status keep their initial values when the command does not throw; stdout is
    // overwritten by the first statement either way, so it starts undeclared.
    let stdout: string;
    let stderr = "";
    let status: number | null = 0;
    try {
      stdout = execFileSync(process.execPath, [bin, "--help"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 30_000,
      });
    } catch (error) {
      const failure = error as { stderr?: string; stdout?: string; status?: number };
      stderr = failure.stderr ?? "";
      stdout = failure.stdout ?? "";
      status = failure.status ?? null;
    }
    rmSync(orphan, { recursive: true, force: true });

    expect(status).toBe(1);
    expect(stderr).toContain("Command failed safely; no changes were made.");
    // Stack-frame marker: a leaked V8 stack always renders " at /abs/path".
    expect(stderr).not.toContain(" at /");
    expect(stdout).not.toContain(" at /");
    expect(stderr).not.toContain("ENOENT");
  }, 60_000);
});
