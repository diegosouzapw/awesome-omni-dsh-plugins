# Contributing

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

Thank you for improving the catalog. Contributions are creator-first: use original repository
evidence, preserve attribution and keep each pull request small enough to review independently.

## One plugin per pull request

A pull request must create or change exactly one YAML file under `catalog/plugins/`. Do not mix
documentation cleanup, generated indexes or another plugin into the same pull request. The entry
ID and filename must be the same lowercase kebab-case value.

The catalog starts empty by design. No entry is accepted without its own reviewed pull request.

## Use the original source

Every public field must be reconstructed from the original creator repository, package, manifest,
README, license or release at the pinned commit. Do not copy a catalog or aggregator's prose,
category assignment, screenshots, ranking, badges or generated metadata. A link found elsewhere
is only a lead; it is not evidence for the final public entry.

Provide:

- The original public repository URL and immutable repository node ID.
- The exact plugin subpath, or `null` for a repository-root plugin.
- A full 40-character source commit OID.
- The creator's public GitHub handle and profile.
- Package and native DSH integration evidence at that commit.
- The upstream SPDX license expression.
- Public Discussion or comment provenance when it exists; otherwise use `null`.

Never submit credentials, cookies, private email addresses, unpublished source or other secrets.

## Creator precedence

For the same canonical plugin, precedence is: creator or owning-organization PR; creator-approved
community PR; existing valid community PR; catalog automation PR. A creator PR supersedes an open
automation PR after validation. Maintainers must not force-push the creator's branch, overwrite
their commits or invent author/co-author identity data.

If an automated entry has already merged, public history is not rewritten. The creator may use a
claim or correction request and then contribute a follow-up pull request directly.

## Repository stars

Parent-project stars must never be attributed to a plugin stored inside a broader monorepo. Such
an entry remains eligible for functional catalog sections but must declare:

`@yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
`@

Read [docs/RANKING.md](docs/RANKING.md) before submitting popularity data.

## Pull request checklist

- [ ] This PR changes exactly one plugin entry.
- [ ] The source is the original creator repository, not another catalog.
- [ ] The source commit is a full 40-character OID.
- [ ] The DSH integration, package, subpath and license are evidenced.
- [ ] Parent-project stars are undefined for a monorepo plugin.
- [ ] The entry is explicitly unofficial.

## Language policy

Launch documentation and catalog descriptions are English-only. The 43-locale rollout remains a
post-MVP backlog item; do not add empty locale documents or automatic bulk translations.

