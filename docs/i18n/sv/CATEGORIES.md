# Katalogkategorier

> 🌐 [English](../../docs/CATEGORIES.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Varje katalogpost har en artefaktkind, en primär förmågekategori och noll eller flera taggar.
Den primära kategorin avgör var posten visas; taggar ger sökning på tvärs över kategorier utan
att duplicera posten.

## Artefakttyper

<!-- catalog-policy:aggregators-never-entries -->

| Värde | Betydelse | Stjärnrankad som plugin |
|---|---|---:|
| `plugin` | Installerbar native DSH-bundle | Endast när varje rankningsvillkor är uppfyllt |
| `plugin-family` | Repository som innehåller flera DSH-plugins | Nej; separat sektion |
| `skin-theme` | DSH-UI-skin eller visuellt tema | Nej; separat sektion |
| `skill` | Agent-skill med DSH-stöd | Nej |
| `preset-profile` | DSH-profil eller preset | Nej |
| `client-interface` | Skrivbords-, TUI-, redigerar- eller fjärrklient | Nej |
| `bridge-adapter` | Integration från en annan produkt in i DSH | Nej |
| `ecosystem-project` | Bredare projekt som innehåller en DSH-integration | Nej |

Ett paraply-repository, en aggregator, en marknadsplats, en installationskatalog eller en lista är
aldrig en katalogpost, även när aggregatoren själv är installerbar. Den får endast användas som en
ledtråd. Följ varje ledtråd till en självständigt installerbar underartefakt och lös den
artefaktens faktiska skapare, ursprungliga repository, paket och källunderstig innan du skickar in
den. Ett äkta skaparmonorepo kan vara det ursprungliga repositoryt för en underplugin, men
underpluginet måste använda den exakta understigen och monorepo-stjärnpolicyn.

Fältet `kind` är den kanoniska DSH-artefaktsärskiljaren. Det finns ingen separat
integrationstyp: `plugin` betyder redan en native DSH-bundle, medan
`ecosystem-project` redan betyder ett bredare projekt med DSH-integration. Detta förhindrar
motsägelsefulla klassificeringspar.

## Primära förmågekategorier

| Värde | Visningsetikett |
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

Välj den kategori som bäst representerar pluginets huvuduppgift, inte den kategori som med störst
sannolikhet ökar synligheten.

## Gränssnittstaggar

Standardgränssnittstaggar inkluderar `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` och `theme`. Ytterligare förmågetaggar i lowercase
kebab-case tillåts när de beskriver bevis som är synliga i den fastnålade ursprungliga källan.

## Repository-omfattning

Använd `dedicated` endast när repository-stjärnorna tillhör exakt den katalogiserade pluginen.
Använd `monorepo` när pluginet är en understig eller ett paket inuti ett bredare projekt. En
monorepo-post måste använda `popularity.starsPolicy: undefined-parent-repository` och
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
