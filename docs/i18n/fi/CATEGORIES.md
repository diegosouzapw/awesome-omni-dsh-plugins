# Katalogikategoriat

> 🌐 [English](../../docs/CATEGORIES.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei liity DeepSeekiin eikä DeepSeek ole hyväksynyt tai sponsoroinut sitä.**
> DeepSeekin nimet ja tunnukset kuuluvat niiden omistajalle.

Jokaisella katalogimerkinnällä on yksi artefaktin kind, yksi ensisijainen ominaisuuskategoria ja
nolla tai useampi tagi. Ensisijainen kategoria määrää, missä merkintä näkyy; tagit tarjoavat
kategorioiden välisen haun merkintää monistamatta.

## Artefaktien kindit

<!-- catalog-policy:aggregators-never-entries -->

| Arvo | Merkitys | Tähtijärjestys liitännäisenä |
|---|---|---:|
| `plugin` | Asennettava natiivi DSH-paketti | Vain kun kaikki järjestysvaatimukset täyttyvät |
| `plugin-family` | Useita DSH-liitännäisiä sisältävä repositorio | Ei; erillinen osio |
| `skin-theme` | DSH-käyttöliittymäskin tai visuaalinen teema | Ei; erillinen osio |
| `skill` | Agenttitaito DSH-tuella | Ei |
| `preset-profile` | DSH-profiili tai preset | Ei |
| `client-interface` | Työpöytä-, TUI-, editori- tai etäasiakasohjelma | Ei |
| `bridge-adapter` | Integraatio toisesta tuotteesta DSH:han | Ei |
| `ecosystem-project` | Laajempi projekti, joka sisältää DSH-integraation | Ei |

Kattoprojekti, kokoaja, markkinapaikka, asennuskatalogi tai lista ei koskaan ole
katalogimerkintä, vaikka kokoaja itsessään olisikin asennettavissa. Sitä saa käyttää vain
vihjeenä. Seuraa jokaista vihjettä itsenäisesti asennettavaan lapsiartefaktiin ja selvitä kyseisen
artefaktin todellinen luoja, alkuperäinen repositorio, paketti ja lähdealipolku ennen sen
lähettämistä. Luojan aito monorepo voi olla lapsiliitännäisen alkuperäinen repositorio, mutta
lapsen on käytettävä juuri sitä alipolkua ja monorepon tähtikäytäntöä.

`kind`-kenttä on kanoninen DSH-artefaktin erottelija. Erillistä integraatiokindiä ei ole:
`plugin` tarkoittaa jo natiivia DSH-pakettia, kun taas `ecosystem-project` tarkoittaa jo laajempaa
projektia, jolla on DSH-integraatio. Tämä estää ristiriitaiset luokitteluparit.

## Ensisijaiset ominaisuuskategoriat

| Arvo | Näyttönimi |
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

Valitse kategoria, joka kuvaa parhaiten liitännäisen päätehtävää, ei sitä kategoriaa, joka
todennäköisimmin lisää näkyvyyttä.

## Käyttöliittymätagit

Vakiokäyttöliittymätagit sisältävät `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` ja `theme`. Muita pienaakkosin kirjoitettuja
kebab-case-muotoisia ominaisuustageja sallitaan, kun ne kuvaavat kiinnitetystä alkuperäisestä
lähteestä näkyvää todistusaineistoa.

## Repositorion laajuus

Käytä `dedicated` vain, kun repositorion tähdet kuuluvat juuri katalogoituun liitännäiseen. Käytä
`monorepo`, kun liitännäinen on alipolku tai paketti laajemman projektin sisällä.
Monorepo-merkinnän on käytettävä arvoja `popularity.starsPolicy: undefined-parent-repository` ja
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
