# Catalog Governance

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

How the public catalog is governed: who decides what enters, in which order competing
contributions are honored, which checks run automatically, and which judgments remain human.
The policies referenced here live in [CONTRIBUTING.md](../CONTRIBUTING.md),
[docs/CREDIT.md](CREDIT.md) and [docs/RANKING.md](RANKING.md); this page describes how they fit
together.

## Principles

1. **Creator-first.** The catalog exists to make creators' work discoverable, never to take
   ownership of it. For the same canonical plugin, a direct creator pull request supersedes any
   open community curation or automation pull request — full precedence order and Git identity
   rules in [docs/CREDIT.md](CREDIT.md).
2. **One plugin, one reviewed pull request.** No batch merges, no generated bulk imports into
   the public catalog. Each entry earns its own review.
3. **Evidence over trust.** Every public field traces to the original creator repository at a
   pinned commit. A green automated check is never accepted as proof of origin.
4. **Unofficial, always.** No catalog state is presented as DeepSeek review, certification or
   endorsement.

## How changes land on `main`

All changes reach `main` through reviewed pull requests — there are no direct pushes. The
working policy for the default branch:

- **Pull requests only.** Catalog entries, documentation and schema changes all enter through a
  PR; catalog PRs must follow the one-plugin-per-branch rule in
  [CONTRIBUTING.md](../CONTRIBUTING.md).
- **Linear history.** PRs are integrated so `main` keeps a linear, auditable history; merged
  public history is not rewritten. If a curated entry merged before a creator came forward, the
  creator claims or corrects it in a follow-up contribution instead of a history rewrite.
- **Review-thread resolution.** Review conversations are resolved before merge; unresolved
  feedback blocks integration.
- **Maintainer merge.** Only a maintainer merges a plugin entry, and only after every gate in
  [CONTRIBUTING.md](../CONTRIBUTING.md) → "Review gates, collisions and merge" passes on the
  current PR commit.

## The `catalog-validation` check

Every pull request touching `catalog/plugins/`, `schemas/` or the workflow itself runs the
`catalog-validation` job (`.github/workflows/validate-catalog.yml`), pinned to the published
CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**What it validates** — local structure and semantics only:

- Safe YAML parsing of every entry under `catalog/plugins/`.
- Conformance to the public schema (see [docs/SCHEMA.md](SCHEMA.md)).
- SPDX expression parsing, exact SemVer versions, valid SHA-512 SRI integrity values.
- Duplicate rejection: no repeated entry IDs and no repeated canonical
  repository-node-plus-subpath keys.
- The intentional zero-entry catalog passes (`0 entries valid; catalog is empty`).

**What it does NOT validate** — and therefore what a green check never proves:

- Remote repository identity: it does not contact GitHub or resolve the repository node ID
  against the URL.
- Evidence at the pinned commit: descriptions, licenses, DSH integration and smoke evidence are
  not fetched or inspected.
- Creator ownership, star counts, or collision with open pull requests.

Those judgments belong to the maintainers' separate provenance gates, applied before merge and
described in [CONTRIBUTING.md](../CONTRIBUTING.md). The local check is the floor, not the bar.

## Verification states

Verification is recorded per entry against its exact pinned commit, using the states defined in
the public schema (`eligible`, `verified`, `stale`, `unavailable`, `archived`, `quarantined`).
The two positive states are deliberately narrow:

- `eligible` — the public structure and native DSH integration were validated.
- `verified` — additionally, an installation smoke test passed for the pinned source or
  package; the schema requires the smoke-test record to be present.

Neither state — nor any other — is an endorsement, guarantee or security certification. The
full semantics, including how states interact with ranking, are in
[docs/RANKING.md](RANKING.md); the record shape is in [docs/SCHEMA.md](SCHEMA.md).

## Claims, corrections and removals

Structured GitHub issue forms (`.github/ISSUE_TEMPLATE/`) are the governed path for changing an
entry you did not submit:

| Form           | Who uses it                              | Outcome                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Claim**      | A creator whose plugin was curated by someone else | Ownership is bound to the original source; the creator can then contribute directly |
| **Correction** | Anyone who spots inaccurate public metadata | A reviewed fix to the affected entry             |
| **Removal**    | A creator who wants their listing removed, or a reporter of a policy violation | Reviewed removal or quarantine of the entry |

Rules that apply to all three flows:

- Ownership claims must be supported by verifiable public evidence (repository ownership,
  package authorship, manifest metadata or pinned source history) — commenting on a Discussion
  does not establish creatorship ([docs/CREDIT.md](CREDIT.md)).
- Security problems in a listed plugin go to that plugin's own maintainer first; the catalog
  side then handles correction or quarantine without publishing exploit detail
  ([SECURITY.md](../SECURITY.md)).
- Never include credentials, private contact details or other secrets in a form.

## Roles

- **Creators** own their plugins and their listings' precedence. They can contribute directly,
  approve community curation, or claim/correct/remove an existing entry.
- **Community contributors** may curate entries for creators who have not contributed yet,
  under the respectful-contact and credit rules in [docs/CREDIT.md](CREDIT.md). Curation never
  outranks a later direct creator contribution.
- **Maintainers** review, apply the provenance gates, resolve collisions and merge. They also
  maintain the website ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online))
  and the published CLI from private source; this repository's public data, schema and policies
  are what those surfaces consume.
