# Catalog Categories

Each catalog entry has one artifact kind, one primary capability category and zero or more tags.
The primary category determines where the entry appears; tags provide cross-category search
without duplicating the entry.

## Artifact kinds

| Value | Meaning | Star-ranked as a plugin |
|---|---|---:|
| `plugin` | Installable native DSH bundle | Only when every ranking condition is met |
| `plugin-family` | Repository containing multiple DSH plugins | No; separate section |
| `skin-theme` | DSH UI skin or visual theme | No; separate section |
| `skill` | Agent skill with DSH support | No |
| `preset-profile` | DSH profile or preset | No |
| `client-interface` | Desktop, TUI, editor or remote client | No |
| `bridge-adapter` | Integration from another product into DSH | No |
| `marketplace-catalog` | Catalog or installer marketplace | No |
| `ecosystem-project` | Broader project containing a DSH integration | No |

An umbrella repository is not treated as one plugin merely because it contains many plugins.
Catalog the independently installable child artifacts and preserve their actual creator, package
and source subpath.

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

