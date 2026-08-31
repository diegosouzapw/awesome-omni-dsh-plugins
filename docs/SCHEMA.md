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
fields are rejected), and every field below is required except `media`, the one optional field.

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
| `media`           | array   |    no    | Up to 6 screenshots/videos, every URL pinned to `source.commit` |

### `schemaVersion`

Constant `1`. Identifies public schema version 1; any other value is invalid.

### `id`

String matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, no leading/trailing or
double hyphens. Per [CONTRIBUTING.md](../CONTRIBUTING.md), the entry file must be named
`catalog/plugins/<id>.yaml` with the identical value; the validator rejects a mismatch
(`id-filename-mismatch`). The ID must also start with the creator's namespace: the
`creator.github` handle lowercased, with every run of characters outside `[a-z0-9]` collapsed
into a single `-`, followed by `-` (`id-creator-prefix`).

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

One of the fourteen capability categories:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` ·
`finance-trading`

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

### `media`

The only optional field. An array of at most **6** items, each describing one screenshot or short
video of the plugin:

| Property | Type   | Rules                                                                   |
| -------- | ------ | ----------------------------------------------------------------------- |
| `kind`   | enum   | `screenshot` or `video`                                                 |
| `url`    | string | Immutable GitHub URL, max 2048 chars (see below)                        |
| `alt`    | string | Alternative text, 1–120 characters                                      |

A URL here must be as immutable as `source.commit`. A `raw.githubusercontent.com` path carrying a
branch name (`.../main/docs/shot.png`) shows whatever that branch holds today, so the entry would
publish an unreviewed picture the day the branch moves. Two shapes are accepted:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — the pinned raw path;
- `https://github.com/<owner>/<repo>/assets/…` — GitHub's content-addressed upload URL, for
  `video` items.

The schema enforces the safe shape (host, a 40-character hexadecimal ref, bounded length).
`catalog validate` enforces the rest semantically: the URL must pin **this entry's own**
`source.commit` in **this entry's own** repository, and a branch URL is rejected with
`media[n].url must pin the entry commit, not a branch`.

Omit the field entirely when there is nothing to show — `media: []` is not a valid way to say
"no screenshots". The field is additive: entries published before it existed remain valid, and a
consumer that ignores it reads every entry exactly as before.

## `kind: skill` entries

Schema version 1 also defines a second, self-contained entry contract for `kind: skill`,
published as [`schemas/skill.schema.yaml`](../schemas/skill.schema.yaml) (SKL-01 phase 0). It
never touches the plugin schema above: entries with `kind: plugin` keep validating exactly as
before, and the skill schema file is the source of truth for skill entries the same way the
plugin schema is for plugin entries.

A skill is not installed, it is **loaded** by the harness, so the plugin-only install
descriptors (`package`, `dsh`) do not exist on a skill entry and are replaced by `usage` +
`compat`. A skill also frequently lives in a subdirectory of a repository that hosts many
skills, so identity and dedupe is `source.repository` + `source.subpath` rather than the
repository alone. A skill entry admits no `media` gallery: a skill is text the harness loads,
so there is nothing to screenshot (`additionalProperties: false` is what enforces it).

These fields keep exactly the shape and rules documented for plugin entries above:
`schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Every field is required
except `triggers`, the one optional skill field.

### Skill-specific fields

| Field                | Type   | Required | Rules                                                       |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   yes    | Must be exactly `skill`                                     |
| `skillScope`         | enum   |   yes    | `repository` (the whole repository **is** the skill) or `subdirectory` (the skill lives at `source.subpath`) |
| `triggers`           | array  |    no    | When the skill fires — the text a user evaluates before loading it. At least 1 unique string, each 3–200 characters; omit the field entirely when there are none (`triggers: []` is invalid) |
| `usage.load`         | string |   yes    | How the harness loads the skill, 1–200 characters; a skill is loaded, never installed |
| `usage.evidencePath` | string |   yes    | Safe relative path (same pattern as `description.evidencePath`) to the load evidence at `source.commit` |
| `compat.harnessMin`  | string |   yes    | Minimum harness version the skill was verified against; exact `x.y.z` shape (optional prerelease/build), max 64 chars. Semantic layer additionally requires a parseable, exact SemVer |

Conditional rules (enforced by the skill schema's `allOf` blocks):

- `skillScope: subdirectory` **forces** `source.subpath` to be a safe relative path string —
  a skill hosted in a subdirectory must pin that subdirectory.
- `skillScope: repository` **forces** `source.subpath: null` — a whole-repository skill must
  not declare a subpath.

`verification` keeps the plugin shape (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), but `smokeTest` must be exactly `null`: a skill has no install smoke test, and
content review is the admission gate. The skill schema carries no `status: verified` →
`smokeTest` conditional and no `repositoryScope` → `popularity` conditionals; those couplings
are plugin-schema rules only.

### Semantic layer for skills

On top of the schema, catalog validation applies the same mandatory semantic parsers as for
plugins where the fields exist: `license.spdx` must parse as a valid SPDX expression
(`invalid-spdx`), and `compat.harnessMin` must be an exact SemVer (`invalid-semver`). There is
no `invalid-sri` case — a skill has no `package.integrity`.

### Skill identity and dedupe

The canonical key of a skill is `skill:<source.repositoryNodeId>:<normalized subpath>`. The
subpath is normalized for identity purposes only: backslashes become `/`, empty and `.`
segments are dropped, and an empty result (or `subpath: null`) becomes `.` — the whole
repository. A subpath containing NUL bytes or `..` segments is rejected, never "cleaned". Two
skills of the same repository are two entries; the same repository + subpath twice is a
collision.

### Minimal skill example

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## What the schema does not check

The schema is intentionally local and structural. It does **not** verify that the repository
exists, that the node ID matches the URL, that evidence paths exist at the pinned commit, that
the star count is accurate, or that the creator owns the source. Those checks belong to the
maintainer review gates described in [CONTRIBUTING.md](../CONTRIBUTING.md) and
[docs/GOVERNANCE.md](GOVERNANCE.md).
