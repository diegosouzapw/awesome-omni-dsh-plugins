import { lstat } from "node:fs/promises";

import { canonicalPluginKey, loadCatalog } from "./catalog/index.js";

import {
  materializeCatalog,
  type CatalogMaterializationDependencies,
  type MaterializedCatalog,
} from "./catalogSnapshot.js";
import { CliSafetyError } from "./errors.js";
import type { CatalogSelection, CatalogSnapshot } from "./model.js";

export const DEFAULT_CATALOG_REVISION = "f01d1d2d22b80222c121db6dfc0fd4035c24b390";

const DEFAULT_EMPTY_SNAPSHOT: CatalogSnapshot = {
  source: {
    kind: "snapshot",
    declaredRevision: DEFAULT_CATALOG_REVISION,
    pinStatus: "declared-local",
  },
  entries: [],
  diagnostics: [],
};

export async function loadDefaultCatalog(
  selection?: CatalogSelection,
  dependencies: CatalogMaterializationDependencies = {},
): Promise<CatalogSnapshot> {
  if (selection?.root === undefined) {
    if (selection?.revision !== undefined && selection.revision !== DEFAULT_CATALOG_REVISION) {
      throw new CliSafetyError("default catalog revision is invalid");
    }
    return DEFAULT_EMPTY_SNAPSHOT;
  }

  const materialized = await materializeSelection(selection, dependencies);
  try {
    const loaded =
      materialized.kind === "snapshot"
        ? await loadCatalog({
            kind: "snapshot",
            root: materialized.root,
            revision: materialized.revision,
          })
        : await loadCatalog({ kind: "directory", root: materialized.root });
    return {
      source: loaded.source,
      diagnostics: loaded.diagnostics,
      entries: loaded.entries.map((entry) => ({
        ...entry,
        canonicalKey: canonicalPluginKey(entry.source.repositoryNodeId, entry.source.subpath),
      })),
    };
  } finally {
    await materialized.cleanup();
  }
}

async function materializeSelection(
  selection: CatalogSelection,
  dependencies: CatalogMaterializationDependencies,
): Promise<MaterializedCatalog> {
  const root = selection.root;
  if (root === undefined) {
    throw new CliSafetyError("catalog source is unavailable");
  }
  if (root.startsWith("https://")) {
    if (selection.revision === undefined) {
      throw new CliSafetyError("remote catalog snapshots require an exact revision");
    }
    return materializeCatalog(
      { kind: "snapshot-url", url: root, revision: selection.revision },
      dependencies,
    );
  }
  if (root.includes("://")) {
    throw new CliSafetyError("catalog source URL is not allowed");
  }

  let status;
  try {
    status = await lstat(root);
  } catch {
    throw new CliSafetyError("catalog source is unavailable");
  }
  if (status.isSymbolicLink()) {
    throw new CliSafetyError("catalog source path is unsafe");
  }
  if (status.isDirectory()) {
    return materializeCatalog(
      selection.revision === undefined
        ? { kind: "directory", root }
        : { kind: "directory", root, revision: selection.revision },
      dependencies,
    );
  }
  if (status.isFile()) {
    return materializeCatalog(
      selection.revision === undefined
        ? { kind: "snapshot-file", path: root }
        : { kind: "snapshot-file", path: root, revision: selection.revision },
      dependencies,
    );
  }
  throw new CliSafetyError("catalog source path is unsafe");
}
