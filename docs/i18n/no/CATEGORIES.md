# Katalogkategorier

Hver katalogoppføring har én artefakttype, én primær kapasitetskategori og null eller flere
tagger. Primærkategorien bestemmer hvor oppføringen vises; tagger gir søk på tvers av
kategorier uten å duplisere oppføringen.

## Artefakttyper

<!-- catalog-policy:aggregators-never-entries -->

| Verdi | Betydning | Stjernerangert som plugin |
|---|---|---:|
| `plugin` | Installerbar nativ DSH-pakke | Bare når alle rangeringsbetingelser er oppfylt |
| `plugin-family` | Repositorium som inneholder flere DSH-plugins | Nei; egen seksjon |
| `skin-theme` | DSH UI-skin eller visuelt tema | Nei; egen seksjon |
| `skill` | Agent-skill med DSH-støtte | Nei |
| `preset-profile` | DSH-profil eller forhåndsinnstilling | Nei |
| `client-interface` | Desktop-, TUI-, editor- eller fjernklient | Nei |
| `bridge-adapter` | Integrasjon fra et annet produkt inn i DSH | Nei |
| `ecosystem-project` | Bredere prosjekt som inneholder en DSH-integrasjon | Nei |

Et paraplyprosjekt, en aggregator, en markedsplass, en installerkatalog eller en liste er
aldri en katalogoppføring, selv når aggregatoren selv er installerbar. Den kan bare brukes som
et spor. Følg hvert spor til en uavhengig installerbar underordnet artefakt og løs opp den
artefaktens faktiske skaper, opprinnelige repositorium, pakke og kildeundersti før du sender
den inn. Et ekte skapermonorepo kan være det opprinnelige repositoriet for en underordnet
plugin, men den underordnede må bruke den eksakte understien og monorepo-stjernepolicyen.

`kind`-feltet er den kanoniske DSH-artefaktdiskriminatoren. Det finnes ingen separat
integrasjonstype: `plugin` betyr allerede en nativ DSH-pakke, mens `ecosystem-project`
allerede betyr et bredere prosjekt med DSH-integrasjon. Dette forhindrer motstridende
klassifiseringspar.

## Primære kapasitetskategorier

| Verdi | Visningsetikett |
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

Velg kategorien som best representerer pluginens primære jobb, ikke kategorien som mest
sannsynlig øker synligheten.

## Grensesnitt-tagger

Standard grensesnitt-tagger inkluderer `web-ui`, `sidebar`, `settings`, `tui`, `cli`,
`desktop`, `mobile`, `remote`, `editor`, `headless` og `theme`. Ytterligere kapasitetstagger i
kebab-case med små bokstaver er tillatt når de beskriver bevis som er synlig i den fastpinnede
opprinnelige kilden.

## Repositorieomfang

Bruk `dedicated` bare når repositoriets stjerner tilhører den eksakt katalogiserte pluginen.
Bruk `monorepo` når pluginen er en understi eller pakke inne i et bredere prosjekt. En
monorepo-oppføring må bruke `popularity.starsPolicy: undefined-parent-repository` og
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
