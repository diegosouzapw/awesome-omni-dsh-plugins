# Katalogkategorier

> 🌐 [English](../../docs/CATEGORIES.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeek-navne og -mærker tilhører deres respektive ejer.

Hver katalogpost har én artefakt-kind, én primær kapacitetskategori og nul eller flere tags.
Den primære kategori bestemmer, hvor posten vises; tags giver søgning på tværs af kategorier uden
at duplikere posten.

## Artefakt-kinds

<!-- catalog-policy:aggregators-never-entries -->

| Værdi | Betydning | Stjernerangeret som plugin |
|---|---|---:|
| `plugin` | Installerbar native DSH-bundle | Kun når alle rangeringsbetingelser er opfyldt |
| `plugin-family` | Repository med flere DSH-plugins | Nej; separat sektion |
| `skin-theme` | DSH-UI-skin eller visuelt tema | Nej; separat sektion |
| `skill` | Agent-skill med DSH-understøttelse | Nej |
| `preset-profile` | DSH-profil eller preset | Nej |
| `client-interface` | Desktop-, TUI-, editor- eller fjernklient | Nej |
| `bridge-adapter` | Integration fra et andet produkt ind i DSH | Nej |
| `ecosystem-project` | Bredere projekt, der indeholder en DSH-integration | Nej |

Et paraply-repository, en aggregator, en markedsplads, et installationskatalog eller en liste er
aldrig en katalogpost, selv når aggregatoren selv kan installeres. Det må kun bruges som et spor.
Følg hvert spor til et uafhængigt installerbart underartefakt, og find frem til det artefakts
faktiske skaber, oprindelige repository, pakke og kilde-understi, før du indsender det. Et ægte
skaber-monorepo kan være det oprindelige repository for et underplugin, men underpluginnet skal
bruge den præcise understi og monorepo-stjernepolitikken.

Feltet `kind` er det kanoniske DSH-artefakt-diskriminatorsymbol. Der findes ingen separat
integrationskind: `plugin` betyder allerede en native DSH-bundle, mens
`ecosystem-project` allerede betyder et bredere projekt med DSH-integration. Dette forhindrer
modsigende klassifikationspar.

## Primære kapacitetskategorier

| Værdi | Visningsnavn |
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

Vælg den kategori, der bedst repræsenterer pluginnets primære funktion, ikke den kategori, der med
størst sandsynlighed øger synligheden.

## Interface-tags

Standard-interface-tags inkluderer `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` og `theme`. Yderligere lowercase kebab-case
kapacitets-tags er tilladt, når de beskriver dokumentation, der er synlig i den fastlåste
oprindelige kilde.

## Repository-omfang

Brug kun `dedicated`, når repository-stjernerne tilhører det præcise katalogiserede plugin. Brug
`monorepo`, når pluginnet er en understi eller en pakke inde i et bredere projekt. En
monorepo-post skal bruge `popularity.starsPolicy: undefined-parent-repository` og
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
