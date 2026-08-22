# Katalogin hallinnointi

> 🌐 [English](../../docs/GOVERNANCE.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei liity DeepSeekiin eikä DeepSeek ole hyväksynyt tai sponsoroinut sitä.**
> DeepSeekin nimet ja tunnukset kuuluvat niiden omistajalle.

Miten julkista katalogia hallinnoidaan: kuka päättää, mitä pääsee sisään, missä järjestyksessä
kilpailevat osallistumiset huomioidaan, mitkä tarkistukset ajetaan automaattisesti ja mitkä
arviot jäävät ihmisille. Tässä viitatut käytännöt ovat tiedostoissa
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) ja
[docs/RANKING.md](../../docs/RANKING.md); tämä sivu kuvaa, miten ne muodostavat kokonaisuuden.

## Periaatteet

1. **Luoja etusijalla.** Katalogi on olemassa tehdäkseen luojien työn löydettäväksi, ei koskaan
   ottaakseen sen omistajuuden. Saman kanonisen liitännäisen kohdalla luojan suora pull request
   syrjäyttää minkä tahansa avoimen yhteisön kuratointi- tai automaatio-pull-requestin — täydellinen
   etusijajärjestys ja Git-identiteettisäännöt ovat tiedostossa
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Yksi liitännäinen, yksi tarkastettu pull request.** Ei eräyhdistämisiä, ei generoituja
   massatuonteja julkiseen katalogiin. Jokainen merkintä ansaitsee oman tarkastuksensa.
3. **Todisteet ennen luottamusta.** Jokainen julkinen kenttä jäljittyy luojan alkuperäiseen
   repositorioon kiinnitetyssä commitissa. Vihreää automaattista tarkistusta ei koskaan hyväksytä
   alkuperätodisteeksi.
4. **Epävirallinen, aina.** Mitään katalogin tilaa ei esitetä DeepSeekin tarkastuksena,
   sertifiointina tai suosituksena.

## Miten muutokset päätyvät `main`-haaraan

Kaikki muutokset saavuttavat `main`-haaran tarkastettujen pull requestien kautta — suoria
pushauksia ei ole. Oletushaaran toimintakäytäntö:

- **Vain pull requestit.** Katalogimerkinnät, dokumentaatio ja skeemamuutokset tulevat kaikki
  PR:n kautta; katalogi-PR:ien on noudatettava yhtä liitännäistä per branch -sääntöä tiedostossa
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Lineaarinen historia.** PR:t integroidaan niin, että `main` säilyttää lineaarisen,
  auditoitavan historian; yhdistettyä julkista historiaa ei kirjoiteta uudelleen. Jos kuratoitu
  merkintä yhdistettiin ennen kuin luoja ilmaantui, luoja vaatii sen omakseen tai korjaa sen
  jatko-osallistumisessa historian uudelleenkirjoituksen sijaan.
- **Tarkastusketjujen ratkaisu.** Tarkastuskeskustelut ratkaistaan ennen yhdistämistä; ratkaisematon
  palaute estää integroinnin.
- **Ylläpitäjän yhdistäminen.** Vain ylläpitäjä yhdistää liitännäismerkinnän, ja vasta kun jokainen
  portti tiedostossa [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Tarkastusportit, törmäykset ja
  yhdistäminen" on läpäisty nykyisellä PR-commitilla.

## `catalog-validation`-tarkistus

Jokainen pull request, joka koskee hakemistoa `catalog/plugins/`, `schemas/` tai workflow'ta
itseään, ajaa `catalog-validation`-työn (`.github/workflows/validate-catalog.yml`), kiinnitettynä
julkaistuun CLI:in:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Mitä se validoi** — vain paikallinen rakenne ja semantiikka:

- Turvallinen YAML-jäsennys jokaiselle merkinnälle hakemistossa `catalog/plugins/`.
- Yhdenmukaisuus julkisen skeeman kanssa (katso [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX-lausekkeiden jäsennys, tarkat SemVer-versiot, kelvolliset SHA-512 SRI -integrity-arvot.
- Duplikaattien hylkäys: ei toistuvia merkintä-ID:itä eikä toistuvia kanonisia
  repositorion-solmu-plus-alipolku-avaimia.
- Tarkoituksellisesti tyhjä katalogi läpäisee (`0 entries valid; catalog is empty`).

**Mitä se EI validoi** — ja siten mitä vihreä tarkistus ei koskaan todista:

- Etärepositorion identiteetti: se ei ota yhteyttä GitHubiin eikä selvitä repositorion
  solmutunnusta URL:aa vasten.
- Todisteet kiinnitetyssä commitissa: kuvauksia, lisenssejä, DSH-integraatiota ja
  smoke-todisteita ei haeta eikä tarkasteta.
- Luojan omistajuus, tähtimäärät tai törmäys avointen pull requestien kanssa.

Nämä arviot kuuluvat ylläpitäjien erillisiin alkuperäportteihin, joita sovelletaan ennen
yhdistämistä ja jotka kuvataan tiedostossa [CONTRIBUTING.md](../../CONTRIBUTING.md). Paikallinen
tarkistus on lattiataso, ei vaatimustaso.

## Varmennustilat

Varmennus kirjataan merkintäkohtaisesti sen tarkkaa kiinnitettyä committia vasten käyttäen
julkisessa skeemassa määriteltyjä tiloja (`eligible`, `verified`, `stale`, `unavailable`,
`archived`, `quarantined`). Kaksi positiivista tilaa ovat tarkoituksellisen kapeita:

- `eligible` — julkinen rakenne ja natiivi DSH-integraatio validoitiin.
- `verified` — lisäksi asennuksen smoke-testi läpäistiin kiinnitetylle lähteelle tai paketille;
  skeema vaatii smoke-testitietueen olevan läsnä.

Mikään tila — eikä mikään muukaan — ole suositus, takuu tai tietoturvasertifikaatti. Täydellinen
semantiikka, mukaan lukien miten tilat ovat vuorovaikutuksessa järjestyksen kanssa, on tiedostossa
[docs/RANKING.md](../../docs/RANKING.md); tietueen muoto on tiedostossa
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Omaksi vaatimukset, korjaukset ja poistot

Strukturoidut GitHub-issue-lomakkeet (`.github/ISSUE_TEMPLATE/`) ovat hallinnoitu tie muuttaa
merkintää, jota et itse lähettänyt:

| Lomake         | Kuka käyttää                                 | Lopputulos                                          |
| -------------- | -------------------------------------------- | --------------------------------------------------- |
| **Claim**      | Luoja, jonka liitännäisen joku muu on kuratoinut | Omistajuus sidotaan alkuperäiseen lähteeseen; luoja voi sen jälkeen osallistua suoraan |
| **Correction** | Kuka tahansa, joka huomaa epätarkkaa julkista metadataa | Tarkastettu korjaus asianomaiseen merkintään |
| **Removal**    | Luoja, joka haluaa listauksensa poistettavaksi, tai käytäntörikkomuksen ilmoittaja | Tarkastettu merkinnän poisto tai karanteeni |

Säännöt, jotka pätevät kaikkiin kolmeen prosessiin:

- Omistajuusvaatimuksia on tuettava todennettavissa olevilla julkisilla todisteilla (repositorion
  omistajuus, paketin tekijyys, manifestin metadata tai kiinnitetty lähdehistoria) —
  Discussionissa kommentointi ei osoita luojuutta ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Listatun liitännäisen tietoturvaongelmat menevät ensin kyseisen liitännäisen omalle
  ylläpitäjälle; katalogipuoli käsittelee sen jälkeen korjauksen tai karanteenin julkaisematta
  exploit-yksityiskohtia ([SECURITY.md](../../SECURITY.md)).
- Älä koskaan sisällytä tunnuksia, yksityisiä yhteystietoja tai muita salaisuuksia lomakkeeseen.

## Roolit

- **Luojat** omistavat liitännäisensä ja listauksiensa etusijan. He voivat osallistua suoraan,
  hyväksyä yhteisön kuratoinnin tai vaatia olemassa olevan merkinnän omakseen, korjata tai poistaa
  sen.
- **Yhteisön osallistujat** saavat kuratoida merkintöjä luojille, jotka eivät ole vielä
  osallistuneet, tiedoston [docs/CREDIT.md](../../docs/CREDIT.md) kunnioittavan yhteydenoton ja
  tunnustamisen sääntöjen mukaisesti. Kuratointi ei koskaan ohita myöhempää luojan suoraa
  osallistumista.
- **Ylläpitäjät** tarkastavat, soveltavat alkuperäportteja, ratkaisevat törmäyksiä ja yhdistävät.
  He myös ylläpitävät verkkosivustoa
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) ja julkaistua CLI:tä
  yksityisestä lähteestä; tämän repositorion julkinen data, skeema ja käytännöt ovat sitä, mitä
  nämä pinnat käyttävät.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
