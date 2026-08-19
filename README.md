# Awesome Omni DSH Plugins

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

Creator-first discovery and one-command installation for DeepSeek Harness (DSH) plugins.

This repository is the public source of truth for the catalog. Every listing is one YAML file
under `catalog/plugins/`, validated against a published JSON Schema, added through one
individually reviewed pull request, and always credited to the plugin's original creator.
Nothing in the catalog is generated from another catalog or list: each entry is reconstructed
from the original creator repository at a pinned commit.

## At a glance

| Surface     | What it is                                                       | Where                                                                    |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Catalog** | One YAML file per plugin, the single source of truth             | [`catalog/plugins/`](catalog/plugins)                                    |
| **Schema**  | Public JSON Schema (draft 2020-12) every entry validates against | [`schemas/plugin.schema.yaml`](schemas/plugin.schema.yaml)               |
| **CLI**     | Search, inspect, validate and install from the catalog           | [`@diegosouza.pw/dsh-plugins`](https://www.npmjs.com/package/@diegosouza.pw/dsh-plugins) |
| **Website** | Rendered catalog browser                                         | [dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)     |

The website and the CLI are maintained from private source; this repository carries the public
catalog data, schema and policies they consume.

## Catalog status

**9 plugins merged.** Every plugin enters through an individually reviewed pull request.

The catalog intentionally starts empty. Entries are added one at a time from the original
creator repository, with a pinned source commit and explicit attribution.

## Install the CLI

```bash
npx @diegosouza.pw/dsh-plugins --help
```

The scoped package is published as `@diegosouza.pw/dsh-plugins@0.1.0` and the command above is
the canonical invocation today; no installer script is hosted here.

## Use the CLI today

Version 0.1.0 ships read-only discovery and validation commands plus consent-gated install
commands. The full command reference, including flags, exit codes and the code-execution
consent gate, is in [docs/CLI.md](docs/CLI.md).

| Command                        | What it does                                                        | Touches your system?                    |
| ------------------------------ | ------------------------------------------------------------------- | --------------------------------------- |
| `catalog validate --catalog .` | Validate catalog YAML, schema and local semantics                   | No — read-only                          |
| `search <query...>`            | Search public catalog fields locally                                | No — read-only                          |
| `info <id>`                    | Show one public catalog entry                                       | No — read-only                          |
| `list`                         | List catalog-managed installs without modifying profiles            | No — read-only                          |
| `doctor`                       | Read-only Node, DSH, native Windows policy and catalog diagnostics  | No — read-only                          |
| `add <id> --profile <name> --dry-run` | Show the verified install plan without files or subprocesses | No — dry-run                            |
| `add <id> --profile <name> --allow-code-execution` | Install through official DSH delegation        | Yes — only with explicit consent flag   |

```bash
# Validate the catalog in this repository (what CI runs):
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog validate --catalog .

# Search and inspect locally, without installing anything:
npx @diegosouza.pw/dsh-plugins@0.1.0 search memory --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 info <plugin-id> --catalog .

# Preview an install plan; nothing is written and no subprocess runs:
npx @diegosouza.pw/dsh-plugins@0.1.0 add <plugin-id> --profile default --dry-run
```

Mutating commands (`add`, `update`, `remove`) never execute plugin lifecycle code unless you
pass `--allow-code-execution`. On native Windows those mutations are disabled in v0.1.0; use
WSL. Read-only and dry-run commands work everywhere.

## How a plugin enters the catalog

1. **One plugin, one branch, one pull request.** The PR adds or changes exactly one YAML file
   under `catalog/plugins/`.
2. **Creator-first.** A PR opened by the plugin's creator or owning organization always takes
   precedence over community curation or automation for the same plugin — see
   [docs/CREDIT.md](docs/CREDIT.md).
3. **Evidence from the original source.** Every field is reconstructed from the creator's
   repository at a pinned 40-character commit: description, license, DSH integration, install
   descriptor, stars.
4. **Local validation.** `catalog validate` checks structure and local semantics; it is the same
   check the `catalog-validation` CI job runs on the PR.
5. **Maintainer gates.** Before merge, maintainers separately verify repository identity,
   creator binding and pinned evidence. A green local validation is necessary, never sufficient.

The complete contract — required evidence, YAML rules, stars policy, collision handling and the
review gates — is in [CONTRIBUTING.md](CONTRIBUTING.md). How decisions are made and by whom is
in [docs/GOVERNANCE.md](docs/GOVERNANCE.md).

## Anatomy of an entry

Each entry is one YAML file named after its ID. The example below validates against the current
schema (field-by-field reference in [docs/SCHEMA.md](docs/SCHEMA.md)):

```yaml
schemaVersion: 1
id: example-notes-search
name: Example Notes Search
description:
  en: >-
    Searches a local Markdown notes folder from DSH sessions and returns
    matching snippets with file paths.
  evidencePath: README.md
unofficial: true
kind: plugin
primaryCategory: search-research
tags:
  - search
  - notes
  - cli
source:
  repository: https://github.com/example-creator/example-notes-search
  repositoryNodeId: R_kgDOExample01
  subpath: null
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: example-creator
package:
  ecosystem: npm
  name: example-notes-search
  version: 1.4.2
dsh:
  profiles:
    - default
  evidencePath: dsh-plugin.json
repositoryScope: dedicated
popularity:
  starsPolicy: exact-repository
  stars: 128
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: "2026-08-18T12:00:00Z"
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

Key invariants enforced by the schema:

- `unofficial: true` and `schemaVersion: 1` are constants.
- A monorepo plugin must use `stars: null` — parent-project stars are never inherited.
- The install descriptor is either an exact-version npm package or the pinned source itself;
  it is data, never a shell command.
- `verified` status requires reviewable smoke-test evidence; otherwise the entry is `eligible`
  with `smokeTest: null`.

## Catalog sections

The catalog will be rendered from merged YAML entries only. Each artifact appears once in its
primary section and can be discovered through tags.

- Native plugins by capability: no entries yet.
- Plugin families: no entries yet.
- Themes and skins: no entries yet.
- Clients and interfaces: no entries yet.
- Skills and presets: no entries yet.
- Bridges and ecosystem integrations: no entries yet.
- Alphabetical index: no entries yet.

A star-ranked table is not shown until an eligible plugin is merged. It becomes **Top 10** only
after ten entries satisfy the public ranking predicate.

## What belongs here

This repository catalogs independently published integrations for DeepSeek Harness (DSH),
including native plugins, plugin families, themes, skills, clients and bridges. Artifact kinds,
capability categories and interface tags are defined in [docs/CATEGORIES.md](docs/CATEGORIES.md).

Each public record is one YAML file under `catalog/plugins/` and must validate against
`schemas/plugin.schema.yaml`. A listing means the documented eligibility or verification checks
were completed; it is not a security certification or DeepSeek endorsement.

## Ranking and verification

Only dedicated, native, eligible or verified plugin repositories with stars belonging to that
exact repository can enter a star ranking. Integrations stored inside broader monorepos remain
discoverable but use `stars: null` and never inherit parent-project stars. See
[docs/RANKING.md](docs/RANKING.md) for the complete predicate.

Public verification states distinguish structural eligibility from an installation smoke test.
No state represents absolute safety. Review a plugin's repository, pinned commit, license and
installation behavior before using it.

## Contribute or claim an entry

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. A pull request must add or
change exactly one plugin entry and must cite the original creator repository rather than another
catalog. Creator-authored pull requests take precedence over automated catalog pull requests.

Structured issue forms are available for creator claims, corrections and removals. Never submit
credentials, private contact details or other secrets.

## Documentation

| Document                                     | What it covers                                                       |
| -------------------------------------------- | -------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | The full contribution contract: evidence, YAML rules, review gates    |
| [SECURITY.md](SECURITY.md)                   | Reporting plugin or catalog vulnerabilities; secrets policy           |
| [docs/SCHEMA.md](docs/SCHEMA.md)             | Field-by-field reference for `schemas/plugin.schema.yaml`             |
| [docs/CLI.md](docs/CLI.md)                   | CLI command reference for `@diegosouza.pw/dsh-plugins@0.1.0`          |
| [docs/GOVERNANCE.md](docs/GOVERNANCE.md)     | How the catalog is governed: precedence, gates, claims and removals   |
| [docs/CATEGORIES.md](docs/CATEGORIES.md)     | Artifact kinds, primary capability categories, tags, repository scope |
| [docs/CREDIT.md](docs/CREDIT.md)             | Creator credit, PR precedence and Git identity policy                 |
| [docs/RANKING.md](docs/RANKING.md)           | The public ranking predicate and verification states                  |
| [docs/UNOFFICIAL.md](docs/UNOFFICIAL.md)     | Unofficial status and trademark posture                               |

## Language roadmap

The launch documentation is English-only. Support for the complete 43-locale OmniRoute language
set is an explicit post-MVP backlog item; empty or machine-filled locale pages are not shipped.

## License and attribution

Documentation and repository templates are licensed under the [MIT License](LICENSE). Original
catalog facts and editorial YAML metadata are dedicated under [CC0-1.0](LICENSE-CATALOG).
Upstream code, names, logos and screenshots remain under their original owners and licenses.
See [docs/CREDIT.md](docs/CREDIT.md) and [docs/UNOFFICIAL.md](docs/UNOFFICIAL.md).
