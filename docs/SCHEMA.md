# Catalog Entry Schema Reference

> 🌐 **English** · [Português (Brasil)](i18n/pt-BR/SCHEMA.md) · [中文（简体）](i18n/zh-CN/SCHEMA.md)

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

This is the field-by-field reference for [`schemas/plugin.schema.yaml`](../schemas/plugin.schema.yaml),
the public JSON Schema (draft 2020-12) that every file under `catalog/plugins/` must satisfy.
The schema file itself is the source of truth; when this page and the schema disagree, the
schema wins.

Two layers of validation apply. The public schema enforces bounded *safe shapes* (patterns and
lengths that reject option-like or unbounded values). On top of it, `catalog validate` applies
mandatory semantic parsers: exact SemVer for versions, SHA-512 SRI for integrity values, SPDX
expression parsing for licenses, and duplicate-key rejection. A value can match the schema
pattern and still be rejected semantically.

Top-level rules: the entry is a single YAML object, `additionalProperties: false` (unknown
fields are rejected), and **all** of the following fields are required.

## Top-level fields

| Field             | Type    | Required | Summary                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   yes    | Must be exactly `1`                                           |
| `id`              | string  |   yes    | Lowercase kebab-case entry ID; must match the filename        |
| `name`            | string  |   yes    | Display name, 1–120 characters                                |
| `description`     | object  |   yes    | Curated English summary plus its evidence path                |
| `unofficial`      | const   |   yes    | Must be exactly `true`                                        |
| `kind`            | enum    |   yes    | Canonical artifact discriminator                              |
| `primaryCategory` | enum    |   yes    | Single primary capability category                            |
| `tags`            | array   |   yes    | Unique lowercase kebab-case tags (may be empty)               |
| `source`          | object  |   yes    | Original repository, node ID, subpath and pinned commit       |
| `creator`         | object  |   yes    | Creator's public GitHub handle                                |
| `package`         | object  |   yes    | Canonical install descriptor (npm **or** source)              |
| `dsh`             | object  |   yes    | DSH profiles and native-integration evidence path             |
| `repositoryScope` | enum    |   yes    | `dedicated` or `monorepo`                                     |
| `popularity`      | object  |   yes    | Stars policy and star count (conditional on scope)            |
| `license`         | object  |   yes    | Upstream SPDX license expression                              |
| `verification`    | object  |   yes    | Verification status, check time, identity and smoke test      |
| `provenance`      | object  |   yes    | Public Discussion/comment URLs or `null`                      |

### `schemaVersion`

Constant `1`. Identifies public schema version 1; any other value is invalid.

### `id`

String matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, no leading/trailing or
double hyphens. Per [CONTRIBUTING.md](../CONTRIBUTING.md), the entry file must be named
`catalog/plugins/<id>.yaml` with the identical value.

### `name`

Free-form display name, `minLength: 1`, `maxLength: 120`.

### `description`

Object with exactly two required properties (no others allowed):

| Property       | Type   | Rules                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | English summary, 20–320 characters                                    |
| `evidencePath` | string | Relative repo path pattern; no leading `/`, no backslashes, no `.`/`..` segments |

The English summary must be curated from the file at `evidencePath` as it exists at
`source.commit` — not copied from another catalog.

### `unofficial`

Constant `true`. Machine-readable marker that the listing is unofficial.

### `kind`

The **only** artifact-type discriminator (no second integration-kind field exists). One of:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Meanings and ranking consequences are defined in [docs/CATEGORIES.md](CATEGORIES.md).

### `primaryCategory`

One of the thirteen capability categories:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Display labels and selection guidance are in [docs/CATEGORIES.md](CATEGORIES.md).

### `tags`

Array of unique strings, each matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab-case).
No minimum count is imposed by the schema.

### `source`

Object with exactly four required properties:

| Property           | Type           | Rules                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` URL; owner follows GitHub username rules, repo name 1–100 chars, may not be `.`/`..` or end in `.git` |
| `repositoryNodeId` | string         | Immutable GitHub repository node ID, non-empty                         |
| `subpath`          | string or null | Plugin subpath inside the repository (same safe relative-path pattern as `evidencePath`), or `null` for a repository-root plugin |
| `commit`           | string         | Full 40-character hexadecimal commit OID                               |

Catalog validation must resolve `repositoryNodeId` and reject a repository URL mismatch — that
resolution is a maintainer-side gate, not part of the local structural check.

### `creator`

Object with a single required property:

| Property | Type   | Rules                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub username (1–39 chars, GitHub handle rules) |

The public profile URL is always derived as `https://github.com/<handle>`; no second profile
field is stored, so the two can never diverge.

### `package`

The canonical install descriptor. It is data, never a shell command, and takes exactly one of
two shapes (`oneOf`):

**npm package** — required `ecosystem`, `name`, `version`; optional `integrity`:

| Property    | Type  | Rules                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm package name shape (optionally scoped), max 214 chars                 |
| `version`   | string | Exact `x.y.z` version shape (optional prerelease/build); ranges rejected. Semantic layer additionally requires a parseable, exact SemVer |
| `integrity` | string | Optional `sha512-…` SRI shape, 8–256 chars. Semantic layer must parse it as valid SHA-512 SRI |

**source install** — required `ecosystem` only:

| Property    | Type  | Rules    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

A source descriptor deliberately stores nothing else: the repository, commit and subpath are
derived from `source`, so mutable values are never duplicated.

### `dsh`

Native DSH integration evidence:

| Property       | Type   | Rules                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | At least one unique profile name matching `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Safe relative path to the DSH integration evidence at `source.commit` |

### `repositoryScope`

Either `dedicated` (repository stars belong to this exact plugin) or `monorepo` (the plugin is
a subpath or package inside a broader project). This value drives the conditional popularity
rules below.

### `popularity`

| Property     | Type            | Rules                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` or `undefined-parent-repository`  |
| `stars`      | integer or null | Non-negative integer, or `null`                      |

Conditional rules (enforced by the schema's `allOf` blocks):

- `repositoryScope: monorepo` **forces** `starsPolicy: undefined-parent-repository` and
  `stars: null`. Parent-project stars are never attributed to a monorepo plugin.
- `repositoryScope: dedicated` **forces** `starsPolicy: exact-repository` and an integer
  `stars >= 0`.

See [docs/RANKING.md](RANKING.md) for how these values feed the ranking predicate.

### `license`

| Property | Type   | Rules                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | SPDX expression shape, 2–256 chars, no leading hyphen          |

The schema enforces only a safe character shape; catalog validation must parse and normalize
the value with a real SPDX expression parser. Record the complete upstream expression evidenced
at the pinned commit (for example `Apache-2.0` or `MIT OR GPL-3.0-only`).

### `verification`

Verification applies to `source.commit`. Object with four required properties:

| Property             | Type           | Rules                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | `date-time` formatted timestamp of the check           |
| `repositoryIdentity` | const          | Must be `resolved`                                     |
| `smokeTest`          | object or null | Smoke-test record, or `null` when no qualifying test exists |

When present, `smokeTest` requires:

| Property        | Type   | Rules                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — references `package` or the pinned source without duplicating mutable values |
| `check`         | object | Required `name` (package-name shape) and `version` (exact version shape) |
| `result`        | const  | `passed` — a failed smoke test is not recorded as a smoke test    |

Conditional rule: `status: verified` **requires** a non-null `smokeTest` object. Entries
without reviewable smoke evidence use `status: eligible` and `smokeTest: null`. No status is an
endorsement or security certification — see [docs/RANKING.md](RANKING.md).

### `provenance`

Public provenance links, each a URI or `null`:

| Property     | Type          | Rules                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string or null | Public Discussion URL when one exists            |
| `comment`    | string or null | Public comment URL when one exists               |

## What the schema does not check

The schema is intentionally local and structural. It does **not** verify that the repository
exists, that the node ID matches the URL, that evidence paths exist at the pinned commit, that
the star count is accurate, or that the creator owns the source. Those checks belong to the
maintainer review gates described in [CONTRIBUTING.md](../CONTRIBUTING.md) and
[docs/GOVERNANCE.md](GOVERNANCE.md).
