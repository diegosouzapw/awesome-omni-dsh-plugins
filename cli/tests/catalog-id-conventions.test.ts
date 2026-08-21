// The public catalog has one naming convention that every merged entry already follows but
// nothing enforced: the public ID is the file's basename, and it starts with the creator's
// GitHub login normalized as a slug (lowercase, every run of non-[a-z0-9] collapsed to "-")
// followed by "-". These tests pin that convention as loadCatalog diagnostics so a new entry
// cannot drift from it.
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { afterEach, describe, expect, it } from "vitest";

import { loadCatalog } from "../src/catalog/index.js";

const publicRoot = fileURLToPath(new URL("../../", import.meta.url));
const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function realEntry(): Promise<Record<string, unknown>> {
  const entryDirectory = join(publicRoot, "catalog/plugins");
  const files = (await readdir(entryDirectory)).filter((file) => file.endsWith(".yaml")).sort();
  const first = files[0]!;
  return parseYaml(await readFile(join(entryDirectory, first), "utf8")) as Record<
    string,
    unknown
  >;
}

async function fixtureRoot(
  entries: Record<string, Record<string, unknown>>,
): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "dsh-id-conventions-"));
  temporaryRoots.push(root);
  await mkdir(join(root, "schemas"), { recursive: true });
  await writeFile(
    join(root, "schemas/plugin.schema.yaml"),
    await readFile(join(publicRoot, "schemas/plugin.schema.yaml"), "utf8"),
  );
  await mkdir(join(root, "catalog/plugins"), { recursive: true });
  for (const [fileName, entry] of Object.entries(entries)) {
    await writeFile(join(root, "catalog/plugins", fileName), stringifyYaml(entry));
  }
  return root;
}

describe("public ID conventions", () => {
  it("rejects an entry whose ID does not match its file basename", async () => {
    const entry = await realEntry();
    const id = entry.id as string;
    const root = await fixtureRoot({ [`${id}-renamed.yaml`]: entry });

    const snapshot = await loadCatalog(root);

    expect(snapshot.diagnostics).toContainEqual(
      expect.objectContaining({
        file: `catalog/plugins/${id}-renamed.yaml`,
        code: "id-filename-mismatch",
      }),
    );
    expect(snapshot.entries).toHaveLength(0);
  });

  it("rejects an ID that does not start with the creator's slug followed by a dash", async () => {
    const entry = await realEntry();
    const forged = { ...entry, id: "someone-else-plugin" };
    const root = await fixtureRoot({ "someone-else-plugin.yaml": forged });

    const snapshot = await loadCatalog(root);

    expect(snapshot.diagnostics).toContainEqual(
      expect.objectContaining({
        file: "catalog/plugins/someone-else-plugin.yaml",
        code: "id-creator-prefix",
      }),
    );
    expect(snapshot.entries).toHaveLength(0);
  });

  it("normalizes the creator login as a slug: lowercase, non-alphanumeric runs become one dash", async () => {
    // The schema already restricts creator.github to the GitHub login charset
    // ([A-Za-z0-9-]), so the transforms the slug performs on real data are lowercasing and
    // collapsing dash runs; "2nd--1st-X" exercises both within the schema-legal charset.
    const entry = await realEntry();
    const accepted = {
      ...entry,
      id: "2nd-1st-x-example-plugin",
      creator: { github: "2nd--1st-X" },
    };
    const root = await fixtureRoot({ "2nd-1st-x-example-plugin.yaml": accepted });

    const snapshot = await loadCatalog(root);

    expect(snapshot.diagnostics).toEqual([]);
    expect(snapshot.entries).toHaveLength(1);
  });

  it("accepts every published entry — the convention was measured against the live catalog", async () => {
    const snapshot = await loadCatalog(publicRoot);

    expect(snapshot.diagnostics).toEqual([]);
    expect(snapshot.entries.length).toBeGreaterThanOrEqual(483);
  });
});
