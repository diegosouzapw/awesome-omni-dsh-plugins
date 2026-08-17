# Catalog Categories

Each catalog entry has one artifact kind, one primary capability category and zero or more tags.
The primary category determines where the entry appears; tags provide cross-category search
without duplicating the entry.

## Artifact kinds

<!-- catalog-policy:aggregators-never-entries -->

| Value | Meaning | Star-ranked as a plugin |
|---|---|---:|
| `plugin` | Installable native DSH bundle | Only when every ranking condition is met |
| `plugin-family` | Repository containing multiple DSH plugins | No; separate section |
| `skin-theme` | DSH UI skin or visual theme | No; separate section |
| `skill` | Agent skill with DSH support | No |
| `preset-profile` | DSH profile or preset | No |
| `client-interface` | Desktop, TUI, editor or remote client | No |
| `bridge-adapter` | Integration from another product into DSH | No |
| `ecosystem-project` | Broader project containing a DSH integration | No |

An umbrella repository, aggregator, marketplace, installer catalog or list is never a catalog
entry, even when the aggregator itself is installable. It may only be used as a lead. Follow each
lead to an independently installable child artifact and resolve that artifact's actual creator,
original repository, package and source subpath before submitting it. A genuine creator monorepo
may be the original repository for a child plugin, but the child must use that exact subpath and
the monorepo stars policy.

The `kind` field is the canonical DSH artifact discriminator. There is no separate
integration kind: `plugin` already means a native DSH bundle, while
`ecosystem-project` already means a broader project with DSH integration. This prevents
contradictory classification pairs.

## Primary capability categories

| Value | Display label |
|---|---|
| `user-interface-dashboards` | User interface and dashboards |
| `memory-rag` | Memory and RAG |
| `search-research` | Search and research |
| `coding-developer-tools` | Coding and developer tools |
| `browser-automation` | Browser and automation |
| `vision-audio-multimodal` | Vision, audio and multimodal |
| `sessions-productivity` | Sessions and productivity |
| `security-permissions-approvals` | Security, permissions and approvals |
| `diagnostics-observability` | Diagnostics and observability |
| `models-providers-routing` | Models, providers and routing |
| `messaging-notifications` | Messaging and notifications |
| `data-external-services` | Data and external services |
| `entertainment-customization` | Entertainment and customization |

Choose the category that best represents the plugin's primary job, not the category most likely
to increase visibility.

## Interface tags

Standard interface tags include `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` and `theme`. Additional lowercase kebab-case
capability tags are allowed when they describe evidence visible in the pinned original source.

## Repository scope

Use `dedicated` only when repository stars belong to the exact cataloged plugin. Use `monorepo`
when the plugin is a subpath or package inside a broader project. A monorepo entry must use
`popularity.starsPolicy: undefined-parent-repository` and `popularity.stars: null`.
