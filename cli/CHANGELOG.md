# omni-dsh-plugins

## 1.0.2 — 2026-08-29

### Catalog

- `search`, `info` and `discover` read the published catalog by default instead of an empty
  placeholder snapshot.
- The installer now lives beside the catalog it reads.
- Public catalog entries are validated against strict public ID conventions; degenerate
  snapshots are rejected.
- The file-count and byte ceilings for `catalog validate` were raised for a catalog past 2,048
  entries, up to 20,000.
- The docs gate now splits an exact-count check (on `main`) from a no-regression check (on pull
  requests); the skip-count test keeps the source kind as a literal.

### Packaging & release

- Published under the unscoped name `omni-dsh-plugins`.
- The packaging test builds with `npm`, not a workspace filter.
- Release artifacts are built from the tagged commit, never from `main`'s tip, and published via
  npm Trusted Publishing (OIDC) with provenance.

### Reliability

- The boundary guard now scans every source file; private review IDs no longer leak into it.
- The reap liveness guard no longer races the scheduler.
- The bundle-purity test builds its own bundle in a private temp dir, removing a race against
  `dist/bin.js`.

## 1.0.1 — 2026-08-21

- First unscoped release as `omni-dsh-plugins`.
