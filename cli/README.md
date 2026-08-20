# omni-dsh-plugins

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

`omni-dsh-plugins` is a thin catalog client and safety boundary for public DeepSeek
Harness (DSH) plugin entries. Its canonical invocation is:

```bash
npx omni-dsh-plugins --help
```

The npm artifact is MIT-licensed executable JavaScript built from the sources in
[`cli/`](https://github.com/diegosouzapw/awesome-omni-dsh-plugins/tree/main/cli) of this
repository, published with npm provenance attestation — so the binary you install can be traced
back to the commit and workflow run that produced it. It carries no credentials and no source
maps, and the curation engine that assembles the catalog is a separate, private system that
never ships here.

## Requirements

- Node.js 20 or newer.
- The official `dsh` executable on `PATH` for add, update and remove operations.
- A public catalog snapshot for discovery. Version `1.0.0` defaults to catalog revision
  `f01d1d2d22b80222c121db6dfc0fd4035c24b390` (160 entries); `--revision` overrides it and stays
  the trust anchor, because a fetched snapshot whose declared revision differs is rejected.

## Discover and validate

```bash
npx omni-dsh-plugins search vision
npx omni-dsh-plugins info example-plugin
npx omni-dsh-plugins catalog validate --catalog ./awesome-omni-dsh-plugins
npx omni-dsh-plugins catalog validate \
  --catalog ./awesome-omni-dsh-plugins \
  --revision <40-character-commit>
npx omni-dsh-plugins catalog docs-check ./awesome-omni-dsh-plugins
npx omni-dsh-plugins catalog github-forms-check ./awesome-omni-dsh-plugins
```

An empty catalog is valid and reports `0 entries valid; catalog is empty`. `catalog validate`
performs local structural and semantic validation: safe YAML, the public schema, SPDX, exact
SemVer, SHA-512 SRI and duplicate identity checks.
It does not prove repository identity or pinned-source evidence. Those remain a separate
maintainer provenance gate. The revision is a declared local pin because the public layout has no
signed snapshot manifest.

## Safe installation boundary

Preview an operation without downloads, file changes or subprocesses:

```bash
npx omni-dsh-plugins add example-plugin --profile web --dry-run
```

Dry-run is strictly syntactic. It does not load a local or remote catalog and does not read or
write install state, profiles, cache files, locks or subprocesses. No network request is made.

The official DSH command delegates plugin management to pnpm. Package lifecycle or prepare code
may execute during that delegated step. The CLI therefore refuses mutation unless you provide
explicit consent:

```bash
npx omni-dsh-plugins add example-plugin \
  --profile web \
  --allow-code-execution
npx omni-dsh-plugins update example-plugin \
  --profile web \
  --allow-code-execution
npx omni-dsh-plugins remove example-plugin \
  --profile web \
  --allow-code-execution
```

Native Windows policy for v1.0.0: code-executing `add`, `update`, and `remove` are disabled
before any profile, state, cache, or subprocess access because complete descendant containment
cannot be proven. Use WSL for mutations. `--dry-run` and the read-only catalog, `search`, `info`,
`list`, and `doctor` commands remain available. A native Windows recovery marker is never
auto-cleared; `doctor` reports that documented manual recovery is required.

Before delegation, the CLI:

- accepts only catalog entries in `eligible` or `verified` state for installation;
- blocks unavailable, archived, stale and quarantined entries;
- requires an exact npm version with matching SHA-512 integrity, or an allowlisted GitHub source
  repository with a full 40-character commit pin;
- stages content under a canonical private cache using temporary paths and atomic rename;
- rejects path traversal and symlink escapes;
- reads package metadata without loading or executing plugin code;
- snapshots the complete DSH profile and restores it if DSH returns a failure;
- serializes every profile behind one canonical DSH-home mutation lease and global fencing lock;
- stores catalog-managed install state atomically with generation and fencing-token CAS;
- records old and intended install-state fingerprints before spawn, then makes a durable
  roll-forward decision only after DSH success and an active-profile fingerprint;
- invokes `dsh plugin --profile <name> ...` with a literal argument array and `shell: false`.

Add and update use a private per-transaction artifact lease and an immutable bounded loopback byte
channel. A normal or fully reaped POSIX child releases that lease only after close. If the POSIX
process group cannot be reaped, the CLI retains the profile backup, journal, private artifact and
global mutation lock; the durable pre-spawn barrier blocks every later mutation. Native Windows
code-executing mutations are disabled rather than claiming unproven descendant containment.
Explicit POSIX recovery is available with:

```bash
npx omni-dsh-plugins recover
```

Recovery does not load the catalog. Before durable DSH success it rolls back; after durable DSH
success it verifies the active profile and rolls the intended state forward. Profile finalization,
artifact release, and marker removal are separate idempotent phases, and the marker is removed
last. Native Windows markers remain fail-closed for documented manual recovery. `doctor` reports
the boundary and never performs recovery itself.

Add and update converge on the catalog pin and are idempotent. Removing an entry that is not
catalog-managed is also a successful no-op.

## Inspect the local environment

```bash
npx omni-dsh-plugins list --profile web
npx omni-dsh-plugins doctor
```

These commands are read-only. Output never intentionally includes tokens, credentials, stack
traces or absolute DSH-home paths.

## Security scope

A catalog listing is not an endorsement, certification or guarantee. `eligible` means structural
and integration checks passed. Only `verified` means an installation smoke test passed for the
pinned artifact. Review the original repository, commit, license and package behavior before
granting `--allow-code-execution`.

## Pinned catalog snapshots

`--catalog` accepts a local catalog directory, a local
`omni-dsh-catalog-snapshot-v1` JSON file, or one of two allowlisted HTTPS URLs: the stable
site-hosted snapshot `https://dsh-plugins.omniroute.online/catalog.snapshot.json` (the
operational remote source) or the raw GitHub form embedding the revision in its path.
Remote snapshots require `--revision <40-character-commit-sha>` and the snapshot document must
declare exactly that SHA. Redirects, alternate hosts, traversal, symlinks, oversized inputs,
and revision mismatches are rejected before catalog validation.

```bash
npx omni-dsh-plugins search tui \
  --catalog https://dsh-plugins.omniroute.online/catalog.snapshot.json \
  --revision <published-catalog-revision>
```
