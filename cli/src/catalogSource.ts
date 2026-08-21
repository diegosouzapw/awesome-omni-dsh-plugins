import { lstat } from "node:fs/promises";

import { canonicalPluginKey, loadCatalog } from "./catalog/index.js";

import {
  PUBLIC_SNAPSHOT_SITE_URL,
  materializeCatalog,
  type CatalogMaterializationDependencies,
  type MaterializedCatalog,
} from "./catalogSnapshot.js";
import { CliSafetyError } from "./errors.js";
import type { CatalogSelection, CatalogSnapshot } from "./model.js";

/**
 * The revision this build was cut against. It is NOT what the default catalog resolves to —
 * the published snapshot moves every time a plugin is merged, and a CLI that demanded one exact
 * commit would go blind the moment the catalog grew. It is kept as a record of the tree these
 * sources were written for, and as the value `--revision` is checked against when someone wants
 * the strict, exact-commit fetch.
 */
export const DEFAULT_CATALOG_REVISION = "bcf6a89f12dadee801dee32aa22f8396756a0e95";

export async function loadDefaultCatalog(
  selection?: CatalogSelection,
  dependencies: CatalogMaterializationDependencies = {},
): Promise<CatalogSnapshot> {
  // With no --catalog, read the snapshot the site publishes. Until now this returned an EMPTY
  // catalog: correct while the public catalog had zero entries, and a silent lie afterwards —
  // `search` answered "No plugins found" against 160 published plugins, and nothing said why.
  //
  // The URL is the only address in the allowlist that carries no pin, it is fetched over TLS
  // from our own origin, and the envelope is validated like any other. Passing --revision still
  // demands that exact commit; omitting it accepts the revision the site declares, which is what
  // lets the CLI keep working as the catalog grows instead of needing a release per merge.
  const materialized =
    selection?.root === undefined
      ? await materializeCatalog(
          {
            kind: "snapshot-url",
            url: PUBLIC_SNAPSHOT_SITE_URL,
            ...(selection?.revision === undefined ? {} : { revision: selection.revision }),
          },
          dependencies,
        )
      : await materializeSelection(selection, dependencies);
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
