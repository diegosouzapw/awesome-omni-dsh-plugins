# Mga Kategorya ng Katalogo

Ang bawat entry ng katalogo ay may isang uri ng artifact, isang pangunahing kategorya ng
kakayahan, at zero o higit pang tag. Ang pangunahing kategorya ang nagtatakda kung saan
lalabas ang entry; ang mga tag ay nagbibigay ng paghahanap sa iba't ibang kategorya nang
hindi dinodoble ang entry.

## Mga uri ng artifact

<!-- catalog-policy:aggregators-never-entries -->

| Halaga | Kahulugan | Niraranggo ng bituin bilang plugin |
|---|---|---:|
| `plugin` | Nai-install na native DSH bundle | Kapag lamang natupad ang bawat kundisyon ng ranggo |
| `plugin-family` | Repository na naglalaman ng maraming DSH plugin | Hindi; hiwalay na seksyon |
| `skin-theme` | DSH UI skin o visual theme | Hindi; hiwalay na seksyon |
| `skill` | Agent skill na may suporta sa DSH | Hindi |
| `preset-profile` | DSH profile o preset | Hindi |
| `client-interface` | Desktop, TUI, editor, o remote client | Hindi |
| `bridge-adapter` | Integrasyon mula sa ibang produkto patungo sa DSH | Hindi |
| `ecosystem-project` | Mas malawak na proyekto na naglalaman ng DSH integration | Hindi |

Ang umbrella repository, aggregator, marketplace, installer catalog, o listahan ay hindi
kailanman magiging entry ng katalogo, kahit na ang aggregator mismo ay nai-install. Maaari
lamang itong gamitin bilang bakas. Sundin ang bawat bakas patungo sa isang independiyenteng
mai-install na child artifact at lutasin ang totoong lumikha, orihinal na repository,
package, at source subpath ng artifact na iyon bago ito isumite. Ang isang totoong monorepo
ng lumikha ay maaaring maging orihinal na repository ng isang child plugin, ngunit ang child
ay dapat gumamit ng eksaktong subpath na iyon at ng patakaran ng mga bituin ng monorepo.

Ang field na `kind` ang canonical na panukoy ng DSH artifact. Walang hiwalay na uri ng
integrasyon: ang `plugin` ay nangangahulugang native DSH bundle, habang ang
`ecosystem-project` ay nangangahulugang mas malawak na proyekto na may DSH integration.
Pinipigilan nito ang mga magkasalungat na pares ng klasipikasyon.

## Mga pangunahing kategorya ng kakayahan

| Halaga | Label na ipinapakita |
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

Piliin ang kategoryang pinakakumakatawan sa pangunahing trabaho ng plugin, hindi ang
kategoryang pinakamalamang magpapataas ng visibility.

## Mga interface tag

Kasama sa mga karaniwang interface tag ang `web-ui`, `sidebar`, `settings`, `tui`, `cli`,
`desktop`, `mobile`, `remote`, `editor`, `headless`, at `theme`. Pinahihintulutan ang mga
karagdagang lowercase kebab-case capability tag kapag inilalarawan nila ang ebidensyang
nakikita sa nakapirming orihinal na source.

## Saklaw ng repository

Gamitin ang `dedicated` kapag lamang ang mga bituin ng repository ay pag-aari ng eksaktong
kinakatalogong plugin. Gamitin ang `monorepo` kapag ang plugin ay isang subpath o package sa
loob ng mas malawak na proyekto. Ang monorepo entry ay dapat gumamit ng
`popularity.starsPolicy: undefined-parent-repository` at `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
