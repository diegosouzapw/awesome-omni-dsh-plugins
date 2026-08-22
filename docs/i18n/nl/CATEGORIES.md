# Catalogus­categorieën

> 🌐 [English](../../docs/CATEGORIES.md) · **Nederlands**

Elke catalogusinvoer heeft één artefacttype, één primaire capaciteitscategorie en nul of meer
tags. De primaire categorie bepaalt waar de invoer verschijnt; tags bieden zoeken over
categorieën heen zonder de invoer te dupliceren.

## Artefacttypen

<!-- catalog-policy:aggregators-never-entries -->

| Waarde | Betekenis | Als plugin gerangschikt op sterren |
|---|---|---:|
| `plugin` | Installeerbaar native DSH-bundel | Alleen wanneer aan elke rangschikkingsvoorwaarde wordt voldaan |
| `plugin-family` | Repository met meerdere DSH-plugins | Nee; aparte sectie |
| `skin-theme` | DSH-UI-skin of visueel thema | Nee; aparte sectie |
| `skill` | Agent-skill met DSH-ondersteuning | Nee |
| `preset-profile` | DSH-profiel of preset | Nee |
| `client-interface` | Desktop-, TUI-, editor- of remote-client | Nee |
| `bridge-adapter` | Integratie van een ander product in DSH | Nee |
| `ecosystem-project` | Breder project met een DSH-integratie | Nee |

Een overkoepelend repository, aggregator, marktplaats, installatiecatalogus of lijst is nooit
een catalogusinvoer, zelfs niet wanneer de aggregator zelf installeerbaar is. Het mag alleen
worden gebruikt als aanwijzing. Volg elke aanwijzing naar een onafhankelijk installeerbaar
kindartefact en herleid de werkelijke maker, het oorspronkelijke repository, het package en het
bronsubpad van dat artefact voordat u het indient. Een echt monorepo van een maker kan het
oorspronkelijke repository zijn voor een kindplugin, maar de kindplugin moet dat exacte subpad
en het monorepo-sterrenbeleid gebruiken.

Het veld `kind` is de canonieke discriminator voor DSH-artefacten. Er bestaat geen apart
integratietype: `plugin` betekent al een native DSH-bundel, terwijl `ecosystem-project` al een
breder project met DSH-integratie betekent. Dit voorkomt tegenstrijdige classificatieparen.

## Primaire capaciteitscategorieën

| Waarde | Weergavelabel |
|---|---|
| `user-interface-dashboards` | Gebruikersinterface en dashboards |
| `memory-rag` | Geheugen en RAG |
| `search-research` | Zoeken en onderzoek |
| `coding-developer-tools` | Coderen en ontwikkelaarstools |
| `browser-automation` | Browser en automatisering |
| `vision-audio-multimodal` | Vision, audio en multimodaal |
| `sessions-productivity` | Sessies en productiviteit |
| `security-permissions-approvals` | Beveiliging, rechten en goedkeuringen |
| `diagnostics-observability` | Diagnostiek en observability |
| `models-providers-routing` | Modellen, providers en routering |
| `messaging-notifications` | Berichten en meldingen |
| `data-external-services` | Data en externe diensten |
| `entertainment-customization` | Entertainment en aanpassing |

Kies de categorie die de primaire taak van de plugin het beste weergeeft, niet de categorie die
de zichtbaarheid het meest waarschijnlijk vergroot.

## Interfacetags

Standaard interfacetags omvatten `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` en `theme`. Aanvullende
kleine-letters-kebab-case-capaciteitstags zijn toegestaan wanneer ze bewijs beschrijven dat
zichtbaar is in de vastgepinde oorspronkelijke bron.

## Repository-omvang

Gebruik `dedicated` alleen wanneer repositorysterren tot de exacte gecatalogiseerde plugin
behoren. Gebruik `monorepo` wanneer de plugin een subpad of package is binnen een breder
project. Een monorepo-invoer moet `popularity.starsPolicy: undefined-parent-repository` en
`popularity.stars: null` gebruiken.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
