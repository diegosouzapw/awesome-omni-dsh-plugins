<!-- catalog-policy:one-plugin-per-branch-and-pr -->
<!-- creator-first:direct-pr-supersedes-curation-and-automation -->
<!-- creator-first:source-bound-git-identity -->

## Plugin scope and source

- Plugin ID:
- Dedicated branch:
- Submission type (`creator`, `owning organization`, `creator-approved`, or `community curation`):
- Created by `handle`:
- Creator profile (`https://github.com/<handle>`):
- Original source repository:
- Repository node ID:
- Source commit (40-character OID):
- Plugin subpath (`null` only for a repository-root plugin):
- Artifact kind, primary category and tags:
- Curated English description evidence path:
- SPDX license evidence at the pinned commit:
- Canonical exact-version package or pinned-source descriptor:
- Native DSH integration evidence at the pinned commit:
- Existing smoke evidence for the exact pin, or `not run`:
- Repository scope and star evidence (`null` policy for monorepos):
- Existing entry/open-PR collision search result:
- Original repository link and one respectful creator mention (curated PRs only):

## Checklist

- [ ] I used one dedicated branch and this PR changes exactly one plugin entry.
- [ ] The source is the original creator repository, not an umbrella, aggregator or other catalog.
- [ ] The source commit is a full 40-character OID.
- [ ] The creator handle/profile, node ID, subpath, DSH integration, install pin and license are evidenced.
- [ ] Smoke evidence is linked, or the entry uses `eligible` with `smokeTest: null` for `not run`.
- [ ] I did not execute plugin or package lifecycle code to prepare this contribution.
- [ ] Dedicated stars are verifiable, or monorepo stars are `null` with `undefined-parent-repository`.
- [ ] I checked for the same canonical repository/subpath, package and install target.
- [ ] I understand that a direct creator PR supersedes an open curated or automation PR.
- [ ] Creator Git authorship is source-bound and verified, or curator authorship keeps visible creator credit.
- [ ] The entry is explicitly unofficial.
- [ ] This PR contains no credentials, private contact details or other secrets.

> This is an unofficial community project. It is not affiliated with, endorsed by, or sponsored
> by DeepSeek. DeepSeek names and marks belong to their respective owner.
