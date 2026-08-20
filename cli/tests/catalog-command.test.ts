import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { runCli, type CliDependencies } from "../src/app.js";
import { loadDefaultCatalog } from "../src/catalogSource.js";
import { CliSafetyError } from "../src/errors.js";

function git(root: string, args: readonly string[]): string {
  return execFileSync("git", [...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function commitCatalogFixture(root: string): string {
  git(root, ["init", "--quiet"]);
  git(root, ["config", "user.name", "Catalog Test"]);
  git(root, ["config", "user.email", "catalog-test@example.invalid"]);
  git(root, ["add", "-A"]);
  git(root, ["commit", "--quiet", "-m", "catalog fixture"]);
  return git(root, ["rev-parse", "HEAD"]);
}

function harness(snapshot: Awaited<ReturnType<CliDependencies["loadCatalog"]>>) {
  let stdout = "";
  let stderr = "";
  const dependencies: CliDependencies = {
    loadCatalog: async () => snapshot,
    stdout: (value) => {
      stdout += value;
    },
    stderr: (value) => {
      stderr += value;
    },
  };
  return {
    dependencies,
    output: () => ({ stdout, stderr }),
  };
}

describe("catalog validate", () => {
  it("loads a local directory without a revision only as a development catalog", async () => {
    // Hermetic fixture: pointing at the live public checkout made this test depend on
    // however many entries happen to be merged at the moment it runs.
    const root = mkdtempSync(join(tmpdir(), "dsh-plugins-directory-integration-"));
    temporaryRoots.push(root);
    // The catalog schema is a sibling now: the CLI lives inside the public catalog repository,
    // so this reads the very schema the entries beside it are validated against — no longer a
    // relative hop across two checkouts.
    const publicRoot = fileURLToPath(new URL("../../", import.meta.url));
    mkdirSync(join(root, "schemas"), { recursive: true });
    writeFileSync(
      join(root, "schemas/plugin.schema.yaml"),
      readFileSync(join(publicRoot, "schemas/plugin.schema.yaml"), "utf8"),
    );
    const snapshot = await loadDefaultCatalog({ root });
    expect(snapshot).toMatchObject({
      source: { kind: "directory" },
      entries: [],
      diagnostics: [],
    });
  });

  it("loads a clean exact-HEAD Git catalog as a declared pinned snapshot", async () => {
    const root = mkdtempSync(join(tmpdir(), "dsh-plugins-git-integration-"));
    temporaryRoots.push(root);
    // The catalog schema is a sibling now: the CLI lives inside the public catalog repository,
    // so this reads the very schema the entries beside it are validated against — no longer a
    // relative hop across two checkouts.
    const publicRoot = fileURLToPath(new URL("../../", import.meta.url));
    mkdirSync(join(root, "schemas"), { recursive: true });
    writeFileSync(
      join(root, "schemas/plugin.schema.yaml"),
      readFileSync(join(publicRoot, "schemas/plugin.schema.yaml"), "utf8"),
    );
    const revision = commitCatalogFixture(root);
    writeFileSync(join(root, "schemas/plugin.schema.yaml"), "not the committed schema\n");

    const snapshot = await loadDefaultCatalog({ root, revision });
    expect(snapshot).toMatchObject({
      source: { kind: "snapshot", declaredRevision: revision, pinStatus: "declared-local" },
      entries: [],
      diagnostics: [],
    });
  });

  it("rejects a declared revision for a non-Git local catalog", async () => {
    const root = mkdtempSync(join(tmpdir(), "dsh-plugins-non-git-integration-"));
    temporaryRoots.push(root);

    await expect(
      loadDefaultCatalog({ root, revision: "a".repeat(40) }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("loads a bounded local snapshot file through the same catalog-core validation", async () => {
    const root = mkdtempSync(join(tmpdir(), "dsh-plugins-snapshot-integration-"));
    temporaryRoots.push(root);
    // The catalog schema is a sibling now: the CLI lives inside the public catalog repository,
    // so this reads the very schema the entries beside it are validated against — no longer a
    // relative hop across two checkouts.
    const publicRoot = fileURLToPath(new URL("../../", import.meta.url));
    const snapshotPath = join(root, "catalog.snapshot.json");
    writeFileSync(snapshotPath, JSON.stringify({
      format: "omni-dsh-catalog-snapshot-v1",
      revision: "a".repeat(40),
      files: {
        "schemas/plugin.schema.yaml": readFileSync(
          join(publicRoot, "schemas/plugin.schema.yaml"),
          "utf8",
        ),
      },
    }));

    const snapshot = await loadDefaultCatalog({ root: snapshotPath });
    expect(snapshot).toMatchObject({
      source: {
        kind: "snapshot",
        declaredRevision: "a".repeat(40),
        pinStatus: "declared-local",
      },
      entries: [],
      diagnostics: [],
    });
  });

  it("rejects a pinned local snapshot file whose declared revision does not match the pin", async () => {
    const root = mkdtempSync(join(tmpdir(), "dsh-plugins-snapshot-pin-mismatch-"));
    temporaryRoots.push(root);
    const snapshotPath = join(root, "catalog.snapshot.json");
    writeFileSync(snapshotPath, JSON.stringify({
      format: "omni-dsh-catalog-snapshot-v1",
      revision: "a".repeat(40),
      files: {},
    }));
    const revision = commitCatalogFixture(root);
    expect(revision).not.toBe("a".repeat(40));

    await expect(loadDefaultCatalog({ root: snapshotPath, revision })).rejects.toMatchObject({
      name: "CliSafetyError",
      message: "catalog snapshot revision does not match the requested commit",
    });
  });

  it("does not consume ignored catalog files for a pinned directory", async () => {
    const root = mkdtempSync(join(tmpdir(), "dsh-plugins-ignored-integration-"));
    temporaryRoots.push(root);
    // The catalog schema is a sibling now: the CLI lives inside the public catalog repository,
    // so this reads the very schema the entries beside it are validated against — no longer a
    // relative hop across two checkouts.
    const publicRoot = fileURLToPath(new URL("../../", import.meta.url));
    writeFileSync(join(root, ".gitignore"), "schemas/\ncatalog/\n");
    writeFileSync(join(root, "README.md"), "# Ignored catalog fixture\n");
    const revision = commitCatalogFixture(root);
    mkdirSync(join(root, "schemas"), { recursive: true });
    mkdirSync(join(root, "catalog/plugins"), { recursive: true });
    writeFileSync(
      join(root, "schemas/plugin.schema.yaml"),
      readFileSync(join(publicRoot, "schemas/plugin.schema.yaml"), "utf8"),
    );
    writeFileSync(join(root, "catalog/plugins/ignored.yaml"), "not: a valid plugin\n");

    const snapshot = await loadDefaultCatalog({ root, revision });

    expect(snapshot.source).toMatchObject({ kind: "snapshot", declaredRevision: revision });
    expect(snapshot.entries).toEqual([]);
    expect(snapshot.diagnostics).toEqual([
      {
        file: "schemas/plugin.schema.yaml",
        code: "invalid-public-schema",
        message: "public catalog schema is missing or invalid",
      },
    ]);
  });

  it("accepts the intentional zero-entry catalog in text and JSON modes", async () => {
    const snapshot = {
      source: { kind: "snapshot" as const, declaredRevision: "a".repeat(40), pinStatus: "declared-local" as const },
      entries: [],
      diagnostics: [],
    };
    const text = harness(snapshot);
    expect(await runCli(["catalog", "validate"], text.dependencies)).toBe(0);
    expect(text.output()).toEqual({
      stdout: "0 entries valid; catalog is empty\n",
      stderr: "",
    });

    const json = harness(snapshot);
    expect(await runCli(["catalog", "validate", "--json"], json.dependencies)).toBe(0);
    expect(JSON.parse(json.output().stdout)).toEqual({
      valid: true,
      count: 0,
      empty: true,
      diagnostics: [],
    });
  });

  it("returns exit 1 with sorted file-specific diagnostics", async () => {
    const invalid = harness({
      source: { kind: "directory" as const },
      entries: [],
      diagnostics: [
        { file: "catalog/plugins/z.yaml", code: "schema", message: "/id must match pattern" },
        { file: "catalog/plugins/a.yaml", code: "yaml", message: "invalid YAML document" },
      ],
    });

    expect(await runCli(["catalog", "validate"], invalid.dependencies)).toBe(1);
    expect(invalid.output()).toEqual({
      stdout: "",
      stderr:
        "catalog/plugins/a.yaml [yaml]: invalid YAML document\n" +
        "catalog/plugins/z.yaml [schema]: /id must match pattern\n",
    });
  });
});

const temporaryRoots: string[] = [];

function publicRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "dsh-plugins-public-"));
  temporaryRoots.push(root);
  for (const directory of ["docs", ".github/ISSUE_TEMPLATE", "schemas", "catalog/plugins"]) {
    mkdirSync(join(root, directory), { recursive: true });
  }
  const notice = "Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.";
  const onePlugin = "<!-- catalog-policy:one-plugin-per-branch-and-pr -->";
  const precedence = "<!-- creator-first:direct-pr-supersedes-curation-and-automation -->";
  const sourceBound = "<!-- creator-first:source-bound-git-identity -->";
  const localValidation = "<!-- catalog-validation:local-structure-and-semantics-only -->";
  const provenance = "<!-- maintainer-gate:repository-origin-and-pinned-evidence -->";
  const aggregators = "<!-- catalog-policy:aggregators-never-entries -->";
  writeFileSync(join(root, "README.md"), `${notice}\n\n**0 plugins merged.**\n`);
  writeFileSync(
    join(root, "CONTRIBUTING.md"),
    [notice, onePlugin, precedence, sourceBound, localValidation, provenance, ""].join("\n"),
  );
  writeFileSync(join(root, "SECURITY.md"), "# Security Policy\n");
  writeFileSync(
    join(root, "docs/CATEGORIES.md"),
    `# Catalog Categories\n\n${aggregators}\n\n## Artifact kinds\n\n` +
      "| Value | Meaning |\n|---|---|\n| `plugin` | Plugin |\n| `skill` | Skill |\n\n" +
      "## Primary capability categories\n\n| Value | Label |\n|---|---|\n" +
      "| `coding-developer-tools` | Coding |\n",
  );
  writeFileSync(join(root, "docs/CREDIT.md"), `${precedence}\n${sourceBound}\n`);
  writeFileSync(join(root, "docs/RANKING.md"), "# Ranking Methodology\n");
  writeFileSync(join(root, "docs/UNOFFICIAL.md"), `${notice}\n`);
  writeFileSync(
    join(root, ".github/PULL_REQUEST_TEMPLATE.md"),
    `${onePlugin}\n${precedence}\n${sourceBound}\n`,
  );
  writeFileSync(
    join(root, "schemas/plugin.schema.yaml"),
    "type: object\nproperties:\n" +
      "  kind:\n    enum:\n      - plugin\n      - skill\n" +
      "  primaryCategory:\n    enum:\n      - coding-developer-tools\n",
  );
  for (const [name, materialField] of [
    ["claim", ""],
    ["correction", "correction"],
    ["removal", "action"],
  ] as const) {
    const material = materialField === "" ? "" :
      `  - type: ${materialField === "action" ? "dropdown" : "textarea"}\n` +
      `    id: ${materialField}\n    validations:\n      required: true\n`;
    writeFileSync(
      join(root, `.github/ISSUE_TEMPLATE/${name}.yml`),
      `name: ${name}\ndescription: ${name}\nbody:\n` +
        "  - type: markdown\n    attributes:\n      value: Unofficial community project, not affiliated with DeepSeek.\n" +
        "  - type: input\n    id: plugin_id\n    validations:\n      required: true\n" +
        "  - type: input\n    id: repository\n    validations:\n      required: true\n" +
        material +
        "  - type: textarea\n    id: evidence\n    validations:\n      required: true\n" +
        "  - type: checkboxes\n    id: confirmations\n    attributes:\n      options:\n" +
        "        - label: I confirm the material policy.\n          required: true\n",
    );
  }
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("public repository checks", () => {
  it("checks the required docs and their zero-entry statement", async () => {
    const root = publicRoot();
    const test = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });
    expect(await runCli(["catalog", "docs-check", root], test.dependencies)).toBe(0);
    expect(test.output()).toEqual({
      stdout: "Catalog documentation checks passed for 0 entries.\n",
      stderr: "",
    });
  });

  it("validates all three structured GitHub forms", async () => {
    const root = publicRoot();
    const test = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });
    expect(await runCli(["catalog", "github-forms-check", root], test.dependencies)).toBe(0);
    expect(test.output()).toEqual({ stdout: "3 GitHub issue forms valid.\n", stderr: "" });
  });

  it("fails closed when the unofficial notice is absent", async () => {
    const root = publicRoot();
    writeFileSync(join(root, "README.md"), "**0 plugins merged.**\n");
    const test = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });
    expect(await runCli(["catalog", "docs-check", root], test.dependencies)).toBe(1);
    expect(test.output().stderr).toBe("README.md: missing unofficial-project notice\n");
  });

  it.each([
    ["docs/CREDIT.md", "creator-first:source-bound-git-identity"],
    [".github/PULL_REQUEST_TEMPLATE.md", "catalog-policy:one-plugin-per-branch-and-pr"],
    ["CONTRIBUTING.md", "catalog-validation:local-structure-and-semantics-only"],
  ])("fails closed when %s loses the %s policy marker", async (file, marker) => {
    const root = publicRoot();
    const path = join(root, file);
    writeFileSync(path, readFileSync(path, "utf8").replace(`<!-- ${marker} -->`, ""));
    const test = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });

    expect(await runCli(["catalog", "docs-check", root], test.dependencies)).toBe(1);
    expect(test.output().stderr).toContain(file);
  });

  it("detects unbalanced Markdown fences and schema/category drift", async () => {
    const fenceRoot = publicRoot();
    writeFileSync(join(fenceRoot, "docs/CREDIT.md"), "```text\nunclosed\n");
    const fenceTest = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });
    expect(await runCli(["catalog", "docs-check", fenceRoot], fenceTest.dependencies)).toBe(1);
    expect(fenceTest.output().stderr).toContain("Markdown fence");

    const parityRoot = publicRoot();
    const schemaPath = join(parityRoot, "schemas/plugin.schema.yaml");
    writeFileSync(
      schemaPath,
      readFileSync(schemaPath, "utf8").replace("      - skill\n", "      - skill\n      - bridge-adapter\n"),
    );
    const parityTest = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });
    expect(await runCli(["catalog", "docs-check", parityRoot], parityTest.dependencies)).toBe(1);
    expect(parityTest.output().stderr).toContain("schema/category parity");
  });

  it.each([
    ["claim", "evidence"],
    ["correction", "correction"],
    ["removal", "action"],
    ["removal", "confirmations"],
  ])("rejects %s when required material field %s becomes optional", async (form, field) => {
    const root = publicRoot();
    const path = join(root, `.github/ISSUE_TEMPLATE/${form}.yml`);
    const content = readFileSync(path, "utf8");
    const start = content.indexOf(`    id: ${field}\n`);
    const required = content.indexOf("required: true", start);
    writeFileSync(
      path,
      `${content.slice(0, required)}required: false${content.slice(required + "required: true".length)}`,
    );
    const test = harness({ source: { kind: "directory" }, entries: [], diagnostics: [] });

    expect(await runCli(["catalog", "github-forms-check", root], test.dependencies)).toBe(1);
    expect(test.output().stderr).toContain(`.github/ISSUE_TEMPLATE/${form}.yml`);
  });
});
