/**
 * The slice of catalog contract the CLI needs to read and validate entries.
 *
 * These modules were vendored from the private engine when the CLI moved into this repository:
 * the CLI is a consumer of the public catalog, so the code that defines what a catalog entry IS
 * belongs beside it. Curation logic — deciding which repository is a
 * copy of another, ranking duplicates, tracking a sweep's position — stayed private and is
 * intentionally absent; none of it was ever reachable from the published binary.
 */
export { isDshBundleMarkerPath, DSH_BUNDLE_MARKER_FILENAMES } from "./bundleMarker.js";
export { canonicalPluginKey, canonicalPublicId, publicEntryPath } from "./types.js";
export type { CanonicalPluginKey } from "./types.js";
export { loadCatalog } from "./loadCatalog.js";
export type {
  CatalogDiagnostic,
  CatalogDiagnosticCode,
  CatalogDirectoryInput,
  CatalogLoadInput,
  CatalogSnapshot,
  CatalogSnapshotSource,
  PinnedCatalogInput,
} from "./loadCatalog.js";
export type { PublicCatalogEntry } from "./publicSchema.js";
export { parseExactSemver, parseSha512Integrity, parseSpdx } from "./publicCatalogValidator.js";
