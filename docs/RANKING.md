# Ranking Methodology

Rankings are transparent views over merged public catalog entries. They never use a hidden
combined score and never treat stars from a broad parent project as plugin popularity.

## Top Plugins by Stars predicate

An entry qualifies only when every condition below is true:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Qualifying entries use `popularity.starsPolicy: exact-repository` and a non-negative integer in
`popularity.stars`. Ties use the case-insensitive plugin ID as a deterministic display order; the
tie-break does not imply a quality difference.

`kind` is the only artifact-type discriminator. The schema intentionally does not store
a second DSH integration kind that could contradict it.

## Explicit exclusions

A plugin inside a broader monorepo remains catalog-eligible, but its parent stars are undefined for
plugin ranking. It must use `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` and `popularity.stars: null`. It appears in
functional sections and is excluded from every star-based ranking.

Plugin families, themes, skins, skills, presets, clients, interfaces, bridges, marketplaces and
broader ecosystem projects do not appear in Top Plugins by Stars. They receive separate sections
where comparable data exists.

## Ranking views

The project may publish distinct views for stars, 24-hour growth, 7-day growth, recent updates,
verified installs, plugin families, themes and skins, clients and interfaces, and ecosystem
integrations. Each view must disclose its own inclusion rule and snapshot time.

At zero eligible entries, Top Plugins is not rendered. The first eligible merge creates a Top
Plugins view; the label changes to Top 10 only after ten qualifying entries exist. No placeholder
or fabricated ranking is allowed.

## Verification is not endorsement

`eligible` means the public structure and DSH integration were validated. `verified` additionally
means an installation smoke test passed for the pinned source or package. Neither status is an
endorsement, guarantee or absolute security certification.
