// A materialized snapshot is the published catalog: it always carries plugin entries. A
// snapshot that validates its schema and then yields ZERO entries with ZERO diagnostics is not
// "an empty catalog" — it is a broken or truncated snapshot, and treating it as valid let
// `search` exit 0 with "No plugins found" against 483 published plugins. A local development
// tree, on the other hand, may legitimately be empty while an author bootstraps it.
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { loadCatalog } from "../src/catalog/index.js";

const REVISION = "a".repeat(40);
const publicRoot = fileURLToPath(new URL("../../", import.meta.url));
const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function schemaOnlyRoot(options: { withEmptyEntryDirectory: boolean }): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "dsh-degenerate-snapshot-"));
  temporaryRoots.push(root);
  await mkdir(join(root, "schemas"), { recursive: true });
  await writeFile(
    join(root, "schemas/plugin.schema.yaml"),
    await readFile(join(publicRoot, "schemas/plugin.schema.yaml"), "utf8"),
  );
  if (options.withEmptyEntryDirectory) {
    await mkdir(join(root, "catalog/plugins"), { recursive: true });
  }
  return root;
}

describe("degenerate snapshots", () => {
  it("rejects a snapshot whose entry directory is missing", async () => {
    const root = await schemaOnlyRoot({ withEmptyEntryDirectory: false });

    const snapshot = await loadCatalog({ kind: "snapshot", root, revision: REVISION });

    expect(snapshot.entries).toHaveLength(0);
    expect(snapshot.diagnostics).toContainEqual(
      expect.objectContaining({ code: "degenerate-snapshot" }),
    );
  });

  it("rejects a snapshot that yields zero entries without any other diagnostic", async () => {
    const root = await schemaOnlyRoot({ withEmptyEntryDirectory: true });

    const snapshot = await loadCatalog({ kind: "snapshot", root, revision: REVISION });

    expect(snapshot.entries).toHaveLength(0);
    expect(snapshot.diagnostics).toContainEqual(
      expect.objectContaining({ code: "degenerate-snapshot" }),
    );
  });

  it("still allows an empty local development tree", async () => {
    const root = await schemaOnlyRoot({ withEmptyEntryDirectory: true });

    const snapshot = await loadCatalog({ kind: "directory", root });

    expect(snapshot.entries).toHaveLength(0);
    expect(snapshot.diagnostics).toEqual([]);
  });

  it("still allows a local development tree without the entry directory", async () => {
    const root = await schemaOnlyRoot({ withEmptyEntryDirectory: false });

    const snapshot = await loadCatalog({ kind: "directory", root });

    expect(snapshot.entries).toHaveLength(0);
    expect(snapshot.diagnostics).toEqual([]);
  });
});
