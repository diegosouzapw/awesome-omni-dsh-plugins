# Jamii za Katalogi

Kila kiingilio cha katalogi kina aina moja ya zao, jamii moja kuu ya uwezo na lebo sifuri au zaidi.
Jamii kuu huamua kiingilio kinaonekana wapi; lebo hutoa utafutaji wa kuvuka jamii bila kurudia
kiingilio.

## Aina za mazao

<!-- catalog-policy:aggregators-never-entries -->

| Thamani | Maana | Hupangwa kwa nyota kama programu-jalizi |
|---|---|---:|
| `plugin` | Kifungashio asilia cha DSH kinachoweza kusakinishwa | Tu wakati kila sharti la upangaji limetimizwa |
| `plugin-family` | Hazina iliyo na programu-jalizi nyingi za DSH | Hapana; sehemu tofauti |
| `skin-theme` | Ngozi ya UI ya DSH au mandhari ya kuona | Hapana; sehemu tofauti |
| `skill` | Ujuzi wa wakala wenye msaada wa DSH | Hapana |
| `preset-profile` | Wasifu au preset ya DSH | Hapana |
| `client-interface` | Desktop, TUI, kihariri au mteja wa mbali | Hapana |
| `bridge-adapter` | Muunganisho kutoka bidhaa nyingine kwenda DSH | Hapana |
| `ecosystem-project` | Mradi pana zaidi ulio na muunganisho wa DSH | Hapana |

Hazina mwavuli, mkusanyaji, soko, katalogi ya visakinishi au orodha kamwe si kiingilio cha katalogi,
hata ikiwa mkusanyaji wenyewe unaweza kusakinishwa. Inaweza tu kutumika kama dokezo. Fuata kila
dokezo hadi kwa zao ndogo linaloweza kusakinishwa kwa uhuru na kutatua muumba halisi wa zao hilo,
hazina asili, kifurushi na subpath ya chanzo kabla ya kuliwasilisha. Monorepo halisi ya muumba
inaweza kuwa hazina asili ya programu-jalizi ndogo, lakini ndogo lazima itumie subpath hiyo halisi na
sera ya nyota za monorepo.

Sehemu ya `kind` ndiyo kitambuzi rasmi cha zao la DSH. Hakuna aina tofauti ya muunganisho: `plugin`
tayari inamaanisha kifungashio asilia cha DSH, wakati `ecosystem-project` tayari inamaanisha mradi
pana zaidi wenye muunganisho wa DSH. Hii huzuia jozi za uainishaji zinazopingana.

## Jamii kuu za uwezo

| Thamani | Lebo ya kuonyesha |
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

Chagua jamii inayowakilisha vizuri zaidi kazi kuu ya programu-jalizi, si jamii ambayo huenda
ikaongeza mwonekano.

## Lebo za kiolesura

Lebo za kawaida za kiolesura ni pamoja na `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` na `theme`. Lebo za ziada za uwezo za kebab-case ya herufi
ndogo zinaruhusiwa zinapoelezea ushahidi unaoonekana katika chanzo asili kilichobandikwa.

## Wigo wa hazina

Tumia `dedicated` tu wakati nyota za hazina ni za programu-jalizi halisi iliyokatalogiwa. Tumia
`monorepo` wakati programu-jalizi ni subpath au kifurushi ndani ya mradi pana zaidi. Kiingilio cha
monorepo lazima kitumie `popularity.starsPolicy: undefined-parent-repository` na
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
