# Awesome Omni DSH Plugins

> **Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.**
> DeepSeek names and marks belong to their respective owner.

Creator-first discovery and one-command installation for DeepSeek Harness plugins.

## Catalog status

**0 plugins merged.** Every plugin enters through an individually reviewed pull request.

The catalog intentionally starts empty. Entries are added one at a time from the original
creator repository, with a pinned source commit and explicit attribution.

## Install the CLI

```bash
npx @diegosouzapw/dsh-plugins --help
```

The scoped package is released through a separate publication gate. The command above is the
canonical invocation once that release is available; no installer script is hosted here.

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

## Language roadmap

The launch documentation is English-only. Support for the complete 43-locale OmniRoute language
set is an explicit post-MVP backlog item; empty or machine-filled locale pages are not shipped.

## License and attribution

Documentation and repository templates are licensed under the [MIT License](LICENSE). Original
catalog facts and editorial YAML metadata are dedicated under [CC0-1.0](LICENSE-CATALOG).
Upstream code, names, logos and screenshots remain under their original owners and licenses.
See [docs/CREDIT.md](docs/CREDIT.md) and [docs/UNOFFICIAL.md](docs/UNOFFICIAL.md).
