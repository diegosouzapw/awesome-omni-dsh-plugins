/**
 * What marks a native DSH bundle on disk.
 *
 * Every runtime-validated plugin — and every entry in this catalog — ships its cordis static
 * patch as `cordis.patch.yml`; `cordis.patch.yaml` is the accepted spelling variant. Anything
 * that keys off a different name will disagree with the catalog about what a plugin even is,
 * so these two names are the whole answer.
 */
export const DSH_BUNDLE_MARKER_FILENAMES = [
  "cordis.patch.yml",
  "cordis.patch.yaml",
] as const;

/**
 * Fixture-era patch companion. No real repository ever used it; it is kept
 * only so existing fixture snapshots remain readable. Never emit it in new
 * fixtures — model them on the real `cordis.patch.yml` layout instead.
 */
export const LEGACY_DSH_PATCH_FILENAME = "dsh.patch";

/**
 * Every filename accepted as the bundle patch companion, in precedence order:
 * the real markers first, the legacy fixture companion last.
 */
export const DSH_BUNDLE_PATCH_CANDIDATE_FILENAMES = [
  ...DSH_BUNDLE_MARKER_FILENAMES,
  LEGACY_DSH_PATCH_FILENAME,
] as const;

const markerBasenames: ReadonlySet<string> = new Set<string>(DSH_BUNDLE_MARKER_FILENAMES);

function basenameOf(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1).toLowerCase();
}

/**
 * Whether a repository-relative path is a native DSH bundle marker
 * (`cordis.patch.yml` / `cordis.patch.yaml`, case-insensitive, at the root or
 * in any subdirectory). This is the predicate the live pipeline keys off.
 */
export function isDshBundleMarkerPath(path: string): boolean {
  return markerBasenames.has(basenameOf(path));
}

/**
 * Repository-relative candidate paths for the bundle patch companion of a
 * bundle rooted at `directory` (`""` or `"."` meaning the repository root),
 * in precedence order.
 */
export function dshBundlePatchCandidatePaths(directory: string): readonly string[] {
  const base = directory === "" || directory === "." ? "" : `${directory}/`;
  return DSH_BUNDLE_PATCH_CANDIDATE_FILENAMES.map((name) => `${base}${name}`);
}
