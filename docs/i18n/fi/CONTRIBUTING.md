# Osallistuminen

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei ole DeepSeekin tytäryhtiö, hyväksymä tai sponsoroima.**
> DeepSeekin nimet ja tavaramerkit kuuluvat niiden omistajille.

Kiitos, että parannat luetteloa. Osallistumisissa luoja on etusijalla: käytä alkuperäisen
repositorion todisteita, säilytä tekijätiedot ja pidä jokainen liitännäinen itsenäisesti
arvioitavana. Luettelo alkaa tarkoituksella tyhjänä; yhtään merkintää ei hyväksytä ilman sen omaa
arvioitua pull requestia.

## Aloita luojasta

Liitännäisen luojan tai omistavan organisaation suoraan avaama pull request on aina ensisijainen.
Jos luoja on valmis osallistumaan, käytä hänen branchiaan ja pull requestiaan sen sijaan, että
luot hänen työnsä uudelleen kuraattori- tai automaatiobranchissa.

Yhteisön kuratointi on tervetullutta, kun se auttaa luojaa, joka ei ole vielä avannut pull
requestia. Se ei luo omistusoikeutta eikä etusijaa myöhempään luojan suoraan osallistumiseen
nähden.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Yksi liitännäinen per branch ja pull request

Luo oma branch yhtä liitännäistä varten ja avaa yksi pull request kyseisestä branchista. Branchin
ja pull requestin on luotava tai muutettava täsmälleen yksi YAML-tiedosto hakemistossa
`catalog/plugins/`. Älä sekoita liitännäisiä, dokumentaation siivousta, generoituja indeksejä tai
muuta niihin liittymätöntä ylläpitoa samaan branchiin tai pull requestiin.

Merkinnän ID:n ja tiedostonimen on oltava sama pienaakkosin kirjoitettu kebab-case-arvo.
Ylläpitäjät tarkastavat ja yhdistävät (merge) jokaisen liitännäisen pull requestin erikseen; useita
liitännäisiä sisältävää erää ei jaeta osiin eikä yhdistetä osittain.

## Selvitä alkuperäinen lähde

Jokainen julkinen kenttä on rakennettava uudelleen luojan alkuperäisestä repositoriosta, paketista,
manifestista, README-tiedostosta, lisenssistä tai julkaisusta kiinnitetyssä commitissa. Älä
kopioi toisen luettelon tai kokoajan tekstiä, kategoriamäärityksiä, kuvakaappauksia, sijoitusta,
merkkejä tai generoitua metadataa. Kattoprojektista, markkinapaikasta, listasta tai kokoajasta
löytynyt linkki on vain vihje, ei todiste eikä liitännäisen lähde.

Älä koskaan lähetä kattoprojektia, kokoajaa, markkinapaikkaa, asennusluetteloa tai listaa
luettelomerkintänä, vaikka se olisikin itsenäisesti asennettavissa. Käytä sitä vain vihjeenä ja
selvitä jokainen itsenäisesti asennettava lapsi-liitännäinen sen todelliseen luojaan ja
alkuperäiseen repositorioon. Liitännäinen luojansa todellisessa monorepossa voidaan lähettää sen
tarkasta alipolusta, mutta sen on noudatettava alla olevaa monorepon tähtikäytäntöä.

## Vaadittavat todisteet

Toimita kaikki seuraavat pull requestissa:

- Alkuperäisen repositorion kanoninen julkinen URL-osoite ja sen muuttumaton repositorion
  solmutunnus (node ID). Ylläpitäjät selvittävät solmutunnuksen ja hylkäävät URL-ristiriidat
  erillisessä alkuperän tarkastusportissa.
- Luojan julkinen GitHub-tunnus ja siihen vastaava julkinen profiilin URL-osoite. YAML tallentaa
  tunnuksen kerran; profiilin URL johdetaan muodossa `https://github.com/<handle>`.
- Täydellinen 40-merkkinen lähdecommitin OID ja liitännäisen tarkka alipolku, tai `null`
  repositorion juuressa olevalle liitännäiselle.
- Rajattu englanninkielinen kuvaus ja sen todistepolku kyseisessä kiinnitetyssä commitissa.
- Artefaktin `kind`, ensisijainen kategoria ja tagit valittuna kohdasta
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Täydellinen ylävirran SPDX-lisenssilauseke todistettuna kiinnitetyssä commitissa.
- Kanoninen asennuskuvaus kiinnitettynä tarkkaan npm-versioon tai lähderepositorioon,
  täydelliseen commitiin ja alipolkuun. Kuvaus on dataa, ei koskaan shell-komento.
- Todiste natiivista DSH-integraatiosta ja sen polku kiinnitetyssä commitissa.
- Olemassa oleva, ei-arkaluonteinen smoke-todiste juuri kyseiselle artefaktin pinnille, tai
  eksplisiittinen arvo `not run`. Älä asenna liitännäistä äläkä suorita `preinstall`, `install`,
  `postinstall`, `prepare` tai muuta paketin/liitännäisen elinkaarikoodia pelkästään
  luettelo-osallistumisen valmistelemiseksi.
- Omistetun repositorion tapauksessa todennettavissa oleva tähtimäärä juuri kyseiselle
  repositoriolle sekä julkinen lähde ja tarkistusaika. Monorepo-liitännäiselle käytä alla
  vaadittua null-käytäntöä.
- Julkinen Discussion- tai kommenttialkuperä, kun sellainen on olemassa; muutoin käytä arvoa
  `null`.
- Koneellisesti luettava arvo `unofficial: true`.

Jos kelpaavaa smoke-testiä ei vielä ole olemassa, käytä arvoja `verification.status: eligible` ja
`verification.smokeTest: null`. Käytä arvoa `verified` vain silloin, kun tarkastettavissa oleva
smoke-todiste on olemassa juuri kyseiselle pinnille. Kumpikaan tila ei ole suositus eikä
tietoturvasertifiointi.

Älä koskaan lähetä tunnuksia, evästeitä, yksityisiä sähköpostiosoitteita, julkaisematonta
lähdekoodia tai muita salaisuuksia.

## YAML- ja schema-säännöt

Luo `catalog/plugins/<plugin-id>.yaml` ja validoi se schemaa
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) vasten. `id`:n on oltava sama kuin
tiedoston perusnimi, ja sen on alettava nimiavaruudellasi: pienaakkosin kirjoitettu
`creator.github`-tunnuksesi (mikä tahansa merkkijakso `[a-z0-9]`-joukon ulkopuolelta muuttuu
yksittäiseksi `-`-merkiksi), jota seuraa `-`, esimerkiksi `some-creator-my-plugin` tunnukselle
`Some-Creator`. Luettelon validointi valvoo molempia. Schema on totuuden lähde kenttänimille ja
sallituille arvoille; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) määrittää,
miten valitaan ainoa artefaktin kind, ensisijainen kategoria, tagit ja repositorion laajuus.

npm-kuvauksen on sisällettävä kelvollinen paketin nimi ja tarkka versio. Julkinen schema hylkää
optioiden kaltaiset ja rajaamattomat arvot, mutta ei toteuta uudelleen SemVeriä tai SRI:tä:
luettelon validoinnin on jäsennettävä versio, vaadittava tarkka SemVer ja jäsennettävä mikä tahansa
integrity-arvo kelvollisena SHA-512 SRI:nä. Source-kuvaus on sidottu kenttiin `source.repository`,
`source.commit` ja `source.subpath` monistamatta muuttuvia lähdearvoja.

Asentimien on käytettävä argumenttitaulukoita, poistettava shell-suoritus käytöstä ja sijoitettava
option-terminaattori ennen luettelon toimittamia positionaalisia arvoja, kun kutsuttava komento
tukee sitä. Lähetyksen validointi ei saa kutsua asenninta tai liitännäisen elinkaarta.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` on paikallinen, vain luku -tyyppinen rakenteellinen ja semanttinen tarkistus.
Se jäsentää turvallista YAML:ia, validoi julkisen skeeman, jäsentää SPDX-lausekkeet, vaatii tarkan
SemVerin ja kelvollisen SHA-512 SRI:n, ja hylkää päällekkäiset ID:t sekä kanoniset
repositorion-solmu-plus-alipolku-avaimet. Se ei ota yhteyttä GitHubiin, ei selvitä repositorion
identiteettiä eikä tarkista todistepolkuja kiinnitetyssä commitissa.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Ennen kuin merkintä saavuttaa tilan `eligible`, ylläpitäjät selvittävät erikseen kanonisen
repositorion ja solmutunnuksen, sitovat luojan alkuperäiseen lähteeseen sekä tarkastavat
ilmoitetun kuvauksen, lisenssin, DSH-integraation ja smoke-todisteen kohdassa `source.commit`.
Paikallinen vihreä validointitulos ei ole todiste alkuperästä tai lähteestä.

## Repositorion tähdet

Vain todennettavasti juuri kyseiseen omistettuun liitännäisen repositorioon kuuluvat tähdet saa
tallentaa. Emoprojektin tähtiä ei koskaan saa liittää liitännäiseen, joka sijaitsee laajemmassa
monorepossa. Monorepo-merkintä pysyy kelpoisena luettelon toiminnallisiin osioihin, mutta sen on
ilmoitettava:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Omistettu merkintä käyttää arvoja `repositoryScope: dedicated`, `starsPolicy: exact-repository` ja
ei-negatiivista tähtimäärää, joka havaitaan samassa repositoriossa. Lue
[docs/RANKING.md](../../docs/RANKING.md) ennen suosiotietojen lähettämistä.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Luojan etusija ja kunnioittava yhteydenotto

Saman kanonisen liitännäisen kohdalla etusijajärjestys on:

1. Luojan tai omistavan organisaation avaama pull request.
2. Yhteisön pull request, jonka luoja on nimenomaisesti hyväksynyt.
3. Olemassa oleva kelvollinen yhteisön kuratointi-pull-request.
4. Luettelon automaation pull request.

Luojan suora pull request syrjäyttää minkä tahansa avoimen kuratointi- tai automaatio-pull-
requestin riippumatta siitä, kumpi avattiin ensin tai on pidemmällä. Luojan pull requestista tulee
tarkastuksen väline; ylläpitäjät eivät tee force-pushia luojan branchiin eivätkä siirrä hänen
työtään kuratoituun pull requestiin. Jos kuratoitu merkintä on jo yhdistetty (merge), julkista
historiaa ei kirjoiteta uudelleen. Luoja voi käyttää vaatimus- tai korjauspyyntöä ja sen jälkeen
osallistua suoraan seuranta-pull-requestilla.

Kuratoidun pull requestin tulisi käyttää yhtä kunnioittavaa julkista `@luoja`-mainintaa
kuvauksessaan, alkuperäiseen repositorioon johtavan linkin vieressä, kutsuen luojaa tarkastamaan
sen tai korvaamaan se suoralla pull requestilla. Älä toista mainintaa, avaa mainosluontoisia
issueja, cross-postaa, lähetä pyytämättömiä suoria viestejä tai muutoin spämmää luojaa.

<!-- creator-first:source-bound-git-identity -->

Luojan kirjoittamat pull requestit ja commitit säilyttävät luojan tekijätiedot luonnostaan.
Kuratoidut commitit voivat käyttää luojan Git-tekijyyttä tai `Co-authored-by`-riviä vain
lähteeseen sidotulla, julkisesti todennettavissa olevalla identiteetillä. Älä koskaan keksi tai
arvaa sähköpostiosoitetta. Kun todennettua Git-identiteettiä ei ole saatavilla, kuraattori
kirjoittaa commitin ja antaa eksplisiittisen `Created by @handle` -maininnan alkuperäisen
repositorion linkillä YAML:ssa ja pull requestissa. Ylläpitäjä- tai automaatiotili voi olla
committer tai todennettu yhteistekijä, mutta se ei saa korvata luojan tekijyyttä. Katso
[docs/CREDIT.md](../../docs/CREDIT.md) täydellistä käytäntöä varten.

## Validointikomennot ja saatavuus

npm-CLI on julkaistu nimellä `omni-dsh-plugins@1.0.1`, joten alla olevat komennot ovat
saatavilla `npx`:n kautta jo nyt. Käytä niitä täsmälleen sellaisina kuin ne on kirjoitettu;
osallistujien ei tule keksiä korvaavia komentoja.

Suorita nämä komennot repositorion juuresta:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` suorittaa vain yllä kuvatut paikalliset YAML-, schema-, SPDX-, tarkka SemVer-,
SHA-512 SRI- ja duplikaattitarkistukset, ja hyväksyy tarkoituksellisesti tyhjän luettelon. Se ei
todista etärepositorion identiteettiä tai kiinnitetyn lähteen todistetta. Muut komennot
tarkistavat vaaditun julkisen dokumentaation ja jäsennellyt GitHub-issue-lomakkeet. Näiden
komentojen läpäiseminen paikallisesti ei lievennä todistevaatimuksia; ylläpitäjät soveltavat silti
jokaista vastaavaa julkaisuporttia ennen yhdistämistä.

## Tarkastusportit, törmäykset ja yhdistäminen

Ylläpitäjät soveltavat jokaista porttia nykyiseen pull requestin commitiin ennen yhdistämistä:

1. **Laajuus:** yksi oma branch, yksi liitännäisen YAML-tiedosto eikä muita liittymättömiä
   muutoksia.
2. **Alkuperäinen identiteetti:** luoja, kanoninen repositorio, solmutunnus, täydellinen commit ja
   alipolku täsmäävät.
3. **Schema ja todisteet:** YAML, kategoriat, SPDX, asennuksen pin, DSH-todiste ja smoke-status
   ovat sisäisesti johdonmukaisia ilman liitännäisen elinkaarikoodin suorittamista.
4. **Suosio:** omistetut tähdet ovat todennettavissa juuri kyseisessä repositoriossa, tai
   monorepon tähdet ovat `null` yhdessä arvon `undefined-parent-repository` kanssa.
5. **Dokumentaatio ja lomakkeet:** julkinen dokumentaatio, Markdown-koodilohkot ja jäsennellyt
   lomakkeet pysyvät kelvollisina.
6. **Törmäys ja deduplikointi:** mikään yhdistetty merkintä tai avoin pull request ei edusta samaa
   kanonista liitännäistä.

Eri nimet tai ID:t eivät tee duplikaattiliitännäisistä erillisiä. Käsittele sama repositorion
solmutunnus ja alipolku, sama kanoninen paketti tai muu todistettavasti identtinen asennuskohde
törmäyksenä. Ratkaise aliakset ja kilpailevat pull requestit ennen yhdistämistä. Luojan suora pull
request voittaa törmäyksen kuratointia tai automaatiota vastaan; muutoin ylläpitäjät valitsevat
yhden tarkastuksen välineen ja sulkevat tai ohjaavat duplikaatit uudelleen sen sijaan, että
yhdistäisivät molemmat.

Vain ylläpitäjä yhdistää liitännäisen sen jälkeen, kun kaikki portit on läpäisty. Jokainen
hyväksytty liitännäinen yhdistetään erikseen; validointi, kuratointi tai automaatio ei tarkoita
automaattista tai eräyhdistämistä.

## Pull requestin tarkistuslista

- [ ] Käytin yhtä omaa branchia, ja tämä PR muuttaa täsmälleen yhtä liitännäisen merkintää.
- [ ] Lähde on luojan alkuperäinen repositorio, ei kattoprojekti tai kokoaja.
- [ ] Luojan tunnus/profiili, repositorio, solmutunnus, alipolku ja täydellinen commit on
      todistettu.
- [ ] Kind, kategoria ja tagit noudattavat tiedostoa `docs/CATEGORIES.md`.
- [ ] SPDX-lisenssi ja kiinnitetty asennuskuvaus on todistettu.
- [ ] Natiivi DSH-integraatio ja smoke-tulos tai `not run` -tila on todistettu.
- [ ] En suorittanut liitännäisen tai paketin elinkaarikoodia tämän osallistumisen
      valmistelemiseksi.
- [ ] Omistetut tähdet ovat todennettavissa, tai monorepon tähdet käyttävät vaadittua
      null-käytäntöä.
- [ ] Tarkistin, onko samalle kanoniselle liitännäiselle jo olemassa merkintä ja avoin pull
      request.
- [ ] Merkintä on nimenomaisesti epävirallinen eikä sisällä salaisuuksia tai yksityisiä
      henkilötietoja.

## Kielikäytäntö

Julkaisudokumentaatio ja luettelon kuvaukset ovat vain englanniksi. 43 kielialueen käyttöönotto on
edelleen MVP:n jälkeinen backlog-kohta; älä lisää tyhjiä kielialuedokumentteja äläkä automaattisia
massakäännöksiä.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
