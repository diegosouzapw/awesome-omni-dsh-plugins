# Contributing

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

Thank you for improving the catalog. Contributions are creator-first: use original repository
evidence, preserve attribution and keep each plugin independently reviewable. The catalog starts
empty by design; no entry is accepted without its own reviewed pull request.

## Start with the creator

A pull request opened directly by the plugin creator or owning organization is always preferred.
If the creator is ready to contribute, use their branch and pull request instead of recreating
their work in a curator or automation branch.

Community curation is welcome when it helps a creator who has not opened a pull request. It does
not establish ownership or priority over a later direct creator contribution.

## One plugin per branch and pull request

Create a dedicated branch for one plugin and open one pull request from that branch. The branch
and pull request must create or change exactly one YAML file under `catalog/plugins/`. Do not mix
plugins, documentation cleanup, generated indexes or unrelated maintenance into that branch or
pull request.

The entry ID and filename must be the same lowercase kebab-case value. Maintainers review and
merge each plugin pull request individually; a batch containing multiple plugins is not split or
partially merged.

## Resolve the original source

Every public field must be reconstructed from the original creator repository, package, manifest,
README, license or release at the pinned commit. Do not copy another catalog or aggregator's
prose, category assignment, screenshots, ranking, badges or generated metadata. A link found in
an umbrella project, marketplace, list or aggregator is only a lead, not evidence and not the
plugin source.

Do not submit an umbrella or aggregator as a substitute for its plugins. Resolve each
independently installable plugin to its actual creator and original repository. A plugin in its
creator's real monorepo can be submitted from its exact subpath, but it must follow the monorepo
stars policy below.

## Required evidence

Provide all of the following in the pull request:

- The canonical public URL of the original repository and its immutable repository node ID.
  Catalog validation resolves the node ID and rejects a URL mismatch.
- The creator's public GitHub handle and matching public profile URL. YAML stores the handle once;
  the profile URL is derived as `https://github.com/<handle>`.
- A full 40-character source commit OID and the exact plugin subpath, or `null` for a
  repository-root plugin.
- A bounded English description and its evidence path at that pinned commit.
- The artifact `kind`, primary category and tags selected from
  [docs/CATEGORIES.md](docs/CATEGORIES.md).
- The complete upstream SPDX license expression evidenced at the pinned commit.
- A canonical install descriptor pinned to an exact npm version, or to the source repository,
  full commit and subpath. The descriptor is data, never a shell command.
- Native DSH integration evidence and its path at the pinned commit.
- Existing, non-sensitive smoke evidence for that exact artifact pin, or the explicit value
  `not run`. Do not install the plugin or execute `preinstall`, `install`, `postinstall`,
  `prepare` or other package/plugin lifecycle code merely to prepare a catalog contribution.
- For a dedicated repository, the verifiable star count for that exact repository, together with
  the public source and check time. For a monorepo plugin, use the required null policy below.
- Public Discussion or comment provenance when it exists; otherwise use `null`.
- The machine-readable `unofficial: true` value.

If no qualifying smoke test already exists, use `verification.status: eligible` and
`verification.smokeTest: null`. Use `verified` only when reviewable smoke evidence for the exact
pin exists. Neither state is an endorsement or security certification.

Never submit credentials, cookies, private email addresses, unpublished source or other secrets.

## YAML and schema rules

Create `catalog/plugins/<plugin-id>.yaml` and validate it against
[`schemas/plugin.schema.yaml`](schemas/plugin.schema.yaml). The schema is the source of truth for
field names and allowed values; [docs/CATEGORIES.md](docs/CATEGORIES.md) defines how to choose the
single artifact kind, primary category, tags and repository scope.

An npm descriptor must contain a valid package name and exact version. The public schema rejects
option-like and unbounded values but does not reimplement SemVer or SRI: catalog validation must
parse the version, require exact SemVer and parse any integrity value as valid SHA-512 SRI. A
source descriptor is bound to `source.repository`, `source.commit` and `source.subpath` without
duplicating mutable source values.

Installers must use argument arrays, disable shell execution and place an option terminator before
catalog-provided positional values where the invoked command supports it. Submission validation
must not invoke an installer or plugin lifecycle.

Catalog validation also resolves repository identity, confirms the canonical repository URL,
parses the complete SPDX expression, inspects declared evidence paths at `source.commit` and
rejects identity or provenance mismatches before an entry reaches `eligible`.

## Repository stars

Only stars verifiably belonging to the exact dedicated plugin repository may be recorded. A
parent project's stars must never be attributed to a plugin stored inside a broader monorepo. A
monorepo entry remains eligible for functional catalog sections but must declare:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

A dedicated entry uses `repositoryScope: dedicated`, `starsPolicy: exact-repository` and the
non-negative star count observed on that same repository. Read
[docs/RANKING.md](docs/RANKING.md) before submitting popularity data.

## Creator precedence and respectful contact

For the same canonical plugin, precedence is:

1. A pull request opened by the creator or owning organization.
2. A community pull request explicitly approved by the creator.
3. An existing valid community curation pull request.
4. A catalog automation pull request.

A direct creator pull request supersedes any open curation or automation pull request, regardless
of which opened first or is further along. The creator pull request becomes the review vehicle;
maintainers do not force-push the creator's branch or transplant their work into the curated pull
request. If a curated entry already merged, public history is not rewritten. The creator may use
a claim or correction request and then contribute a follow-up pull request directly.

A curated pull request should use one respectful public `@creator` mention in its description,
next to a link to the original repository, inviting the creator to review or replace it with a
direct pull request. Do not repeat the mention, open promotional issues, cross-post, send
unsolicited direct messages or otherwise spam the creator.

Creator-authored pull requests and commits preserve creator credit naturally. Curated commits may
use creator Git authorship or a `Co-authored-by` trailer only with a source-bound, publicly
verifiable identity. Never invent or guess an email. When no verified Git identity is available,
the curator authors the commit and gives explicit `Created by @handle` credit with the original
repository link in the YAML and pull request. A maintainer or automation account may be committer
or verified co-author, but must not replace the creator's authorship. See
[docs/CREDIT.md](docs/CREDIT.md) for the complete policy.

## Validation commands and availability

The npm CLI has not been released yet. The commands below are implemented, but they become
available through `npx` only after `@diegosouzapw/dsh-plugins` is published. They are not a claim
that a public CI workflow or install path is currently available, and contributors should not
invent substitute commands.

After the npm release, run these commands from the repository root:

```bash
npx @diegosouzapw/dsh-plugins catalog validate --catalog .
npx @diegosouzapw/dsh-plugins catalog docs-check .
npx @diegosouzapw/dsh-plugins catalog github-forms-check .
```

`catalog validate` validates YAML, the public schema and semantic rules, and accepts the
intentional zero-entry catalog. The other commands check the required public documentation and
structured GitHub issue forms. Until the package is released, maintainers apply the corresponding
release gates; the absence of a published command does not relax the evidence requirements.

## Review gates, collisions and merge

Maintainers apply every gate to the current pull request commit before merging:

1. **Scope:** one dedicated branch, one plugin YAML file and no unrelated changes.
2. **Original identity:** creator, canonical repository, node ID, full commit and subpath agree.
3. **Schema and evidence:** YAML, categories, SPDX, install pin, DSH evidence and smoke status are
   internally consistent without executing plugin lifecycle code.
4. **Popularity:** dedicated stars are verifiable on the exact repository, or monorepo stars are
   `null` with `undefined-parent-repository`.
5. **Documentation and forms:** public docs, Markdown fences and structured forms remain valid.
6. **Collision and deduplication:** no merged entry or open pull request represents the same
   canonical plugin.

Different names or IDs do not make duplicate plugins distinct. Treat the same repository node ID
and subpath, the same canonical package, or another demonstrably identical install target as a
collision. Resolve aliases and competing pull requests before merge. A direct creator pull
request wins a collision with curation or automation; otherwise maintainers select one review
vehicle and close or redirect duplicates rather than merging both.

Only a maintainer merges a plugin after all gates pass. Each accepted plugin is merged
individually; validation, curation or automation does not imply automatic or batch merge.

## Pull request checklist

- [ ] I used one dedicated branch and this PR changes exactly one plugin entry.
- [ ] The source is the original creator repository, not an umbrella or aggregator.
- [ ] The creator handle/profile, repository, node ID, subpath and full commit are evidenced.
- [ ] The kind, category and tags follow `docs/CATEGORIES.md`.
- [ ] The SPDX license and pinned install descriptor are evidenced.
- [ ] Native DSH integration and the smoke result or `not run` status are evidenced.
- [ ] I did not execute plugin or package lifecycle code to prepare this contribution.
- [ ] Dedicated stars are verifiable, or monorepo stars use the required null policy.
- [ ] I checked for an existing entry and open pull request for the same canonical plugin.
- [ ] The entry is explicitly unofficial and contains no secrets or private personal data.

## Language policy

Launch documentation and catalog descriptions are English-only. The 43-locale rollout remains a
post-MVP backlog item; do not add empty locale documents or automatic bulk translations.
