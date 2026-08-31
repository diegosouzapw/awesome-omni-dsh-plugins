# Katalogimerkinnän skeemareferenssi

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei liity DeepSeekiin eikä DeepSeek ole hyväksynyt tai sponsoroinut sitä.**
> DeepSeekin nimet ja tunnukset kuuluvat niiden omistajalle.

Tämä on kenttäkohtainen referenssi tiedostolle
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), julkiselle JSON Schemalle
(draft 2020-12), jonka jokaisen hakemiston `catalog/plugins/` tiedoston on täytettävä.
Skeematiedosto itse on totuuden lähde; kun tämä sivu ja skeema ovat ristiriidassa, skeema voittaa.

Kaksi validointikerrosta ovat käytössä. Julkinen skeema pakottaa rajatut *turvalliset muodot*
(kuviot ja pituudet, jotka hylkäävät optioiden kaltaiset tai rajaamattomat arvot). Sen päällä
`catalog validate` soveltaa pakollisia semanttisia jäsentimiä: tarkka SemVer versioille, SHA-512
SRI integrity-arvoille, SPDX-lausekkeiden jäsennys lisensseille ja duplikaattiavainten hylkäys.
Arvo voi vastata skeeman kuviota ja silti tulla hylätyksi semanttisesti.

Ylätason säännöt: merkintä on yksi YAML-objekti, `additionalProperties: false`
(tuntemattomat kentät hylätään), ja kaikki alla olevat kentät ovat pakollisia paitsi `media`,
ainoa valinnainen kenttä.

## Päätason kentät

| Kenttä            | Tyyppi  | Vaadittu | Yhteenveto                                                    |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   kyllä  | On oltava täsmälleen `1`                                      |
| `id`              | string  |   kyllä  | Pienaakkosin kirjoitettu kebab-case-merkintä-ID; vastattava tiedostonimeä |
| `name`            | string  |   kyllä  | Näyttönimi, 1–120 merkkiä                                     |
| `description`     | object  |   kyllä  | Kuratoitu englanninkielinen yhteenveto ja sen todistepolku    |
| `unofficial`      | const   |   kyllä  | On oltava täsmälleen `true`                                   |
| `kind`            | enum    |   kyllä  | Kanoninen artefaktin erottelija                               |
| `primaryCategory` | enum    |   kyllä  | Yksi ensisijainen ominaisuuskategoria                         |
| `tags`            | array   |   kyllä  | Uniikit pienaakkosin kirjoitetut kebab-case-tagit (saa olla tyhjä) |
| `source`          | object  |   kyllä  | Alkuperäinen repositorio, solmutunnus, alipolku ja kiinnitetty commit |
| `creator`         | object  |   kyllä  | Luojan julkinen GitHub-tunnus                                 |
| `package`         | object  |   kyllä  | Kanoninen asennuskuvaaja (npm **tai** source)                 |
| `dsh`             | object  |   kyllä  | DSH-profiilit ja natiivi-integraation todistepolku            |
| `repositoryScope` | enum    |   kyllä  | `dedicated` tai `monorepo`                                    |
| `popularity`      | object  |   kyllä  | Tähtikäytäntö ja tähtimäärä (ehdollinen laajuudesta)          |
| `license`         | object  |   kyllä  | Upstreamin SPDX-lisenssilauseke                               |
| `verification`    | object  |   kyllä  | Varmennustila, tarkistusaika, identiteetti ja smoke-test      |
| `provenance`      | object  |   kyllä  | Julkiset Discussion-/kommentti-URL:t tai `null`               |
| `media`           | array   |    ei    | Enintään 6 kuvakaappausta/videota, jokainen URL kiinnitetty `source.commit`iin |

### `schemaVersion`

Vakio `1`. Yksilöi julkisen skeeman version 1; mikä tahansa muu arvo on virheellinen.

### `id`

Merkkijono, joka vastaa kuviota `^[a-z0-9]+(?:-[a-z0-9]+)*$` — pienaakkosin kirjoitettu
kebab-case, ei alussa, lopussa tai peräkkäisiä väliviivoja. Tiedoston
[CONTRIBUTING.md](../../CONTRIBUTING.md) mukaan merkintätiedoston nimen on oltava
`catalog/plugins/<id>.yaml` täsmälleen samalla arvolla; validoija hylkää ristiriidan
(`id-filename-mismatch`). ID:n on myös alettava luojan nimiavaruudella: pienoissaakkosiin
muunnettu `creator.github`-tunnus, jossa jokainen `[a-z0-9]`-joukon ulkopuolinen merkkijakso
tiivistetään yksittäiseksi `-`-merkiksi, jota seuraa `-` (`id-creator-prefix`).

### `name`

Vapaa näyttönimi, `minLength: 1`, `maxLength: 120`.

### `description`

Objekti, jolla on täsmälleen kaksi vaadittua ominaisuutta (muita ei sallita):

| Ominaisuus     | Tyyppi | Säännöt                                                               |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Englanninkielinen yhteenveto, 20–320 merkkiä                          |
| `evidencePath` | string | Suhteellisen repositoriopolun kuvio; ei alussa `/`, ei kenoviivoja, ei `.`/`..`-segmenttejä |

Englanninkielinen yhteenveto on kuratoitava tiedostosta `evidencePath` sellaisena kuin se on
`source.commit`-hetkellä — ei kopioituna toisesta katalogista.

### `unofficial`

Vakio `true`. Koneellisesti luettava merkki siitä, että listaus on epävirallinen.

### `kind`

**Ainoa** artefaktityypin erottelija (toista integraatiokenttää ei ole). Yksi seuraavista:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Merkitykset ja järjestysvaikutukset määritellään tiedostossa
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Yksi neljästätoista ominaisuuskategoriasta:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Näyttönimet ja valintaohjeet ovat tiedostossa [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Taulukko uniikkeja merkkijonoja, joista jokainen vastaa kuviota
`^[a-z0-9]+(?:-[a-z0-9]+)*$` (pienaakkosin kirjoitettu kebab-case). Skeema ei aseta vähimmäismäärää.

### `source`

Objekti, jolla on täsmälleen neljä vaadittua ominaisuutta:

| Ominaisuus         | Tyyppi         | Säännöt                                                                |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>`-URL; owner noudattaa GitHubin käyttäjänimisääntöjä, repositorion nimi 1–100 merkkiä, ei saa olla `.`/`..` eikä päättyä `.git` |
| `repositoryNodeId` | string         | Muuttumaton GitHub-repositorion solmutunnus, ei tyhjä                  |
| `subpath`          | string tai null | Liitännäisen alipolku repositorion sisällä (sama turvallinen suhteellisen polun kuvio kuin `evidencePath`), tai `null` repositorion juuressa olevalle liitännäiselle |
| `commit`           | string         | Täydellinen 40-merkkinen heksadesimaalinen commit-OID                  |

Katalogin validoinnin on selvitettävä `repositoryNodeId` ja hylättävä repositorion
URL-ristiriita — tämä selvitys on ylläpitäjäpuolen portti, ei osa paikallista rakenteellista
tarkistusta.

### `creator`

Objekti, jolla on yksi vaadittu ominaisuus:

| Ominaisuus | Tyyppi | Säännöt                                           |
| ---------- | ------ | ------------------------------------------------- |
| `github`   | string | GitHub-käyttäjänimi (1–39 merkkiä, GitHub-tunnussäännöt) |

Julkinen profiili-URL johdetaan aina muodossa `https://github.com/<handle>`; toista
profiilikenttää ei tallenneta, joten ne eivät voi koskaan erota toisistaan.

### `package`

Kanoninen asennuskuvaaja. Se on dataa, ei koskaan shell-komento, ja se on täsmälleen yhtä kahdesta
muodosta (`oneOf`):

**npm-paketti** — vaaditut `ecosystem`, `name`, `version`; valinnainen `integrity`:

| Ominaisuus  | Tyyppi | Säännöt                                                                    |
| ----------- | ------ | -------------------------------------------------------------------------- |
| `ecosystem` | const  | `npm`                                                                      |
| `name`      | string | npm-paketin nimen muoto (valinnaisesti scoped), enintään 214 merkkiä       |
| `version`   | string | Tarkka `x.y.z`-version muoto (valinnainen prerelease/build); vaihteluvälit hylätään. Semanttinen kerros vaatii lisäksi jäsennettävän, tarkan SemVerin |
| `integrity` | string | Valinnainen `sha512-…`-SRI-muoto, 8–256 merkkiä. Semanttisen kerroksen on jäsennettävä se kelvolliseksi SHA-512 SRI:ksi |

**source-asennus** — vain vaadittu `ecosystem`:

| Ominaisuus  | Tyyppi | Säännöt  |
| ----------- | ------ | -------- |
| `ecosystem` | const  | `source` |

Source-kuvaaja ei tarkoituksella tallenna mitään muuta: repositorio, commit ja alipolku
johdetaan kentästä `source`, joten muuttuvia arvoja ei koskaan monisteta.

### `dsh`

Natiivin DSH-integraation todiste:

| Ominaisuus     | Tyyppi | Säännöt                                                        |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Vähintään yksi uniikki profiilinimi, joka vastaa kuviota `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Turvallinen suhteellinen polku DSH-integraatiotodisteeseen kohdassa `source.commit` |

### `repositoryScope`

Joko `dedicated` (repositorion tähdet kuuluvat juuri tälle liitännäiselle) tai `monorepo`
(liitännäinen on alipolku tai paketti laajemman projektin sisällä). Tämä arvo ohjaa alla olevia
ehdollisia suosiosääntöjä.

### `popularity`

| Ominaisuus   | Tyyppi          | Säännöt                                              |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` tai `undefined-parent-repository` |
| `stars`      | kokonaisluku tai null | Ei-negatiivinen kokonaisluku, tai `null`      |

Ehdolliset säännöt (skeeman `allOf`-lohkojen pakottamina):

- `repositoryScope: monorepo` **pakottaa** arvot `starsPolicy: undefined-parent-repository` ja
  `stars: null`. Emoprojektin tähtiä ei koskaan liitetä monorepo-liitännäiseen.
- `repositoryScope: dedicated` **pakottaa** arvon `starsPolicy: exact-repository` ja
  kokonaisluvun `stars >= 0`.

Katso tiedostosta [docs/RANKING.md](../../docs/RANKING.md), miten nämä arvot syötetään
järjestysehtoon.

### `license`

| Ominaisuus | Tyyppi | Säännöt                                                        |
| ---------- | ------ | -------------------------------------------------------------- |
| `spdx`     | string | SPDX-lausekkeen muoto, 2–256 merkkiä, ei väliviivaa alussa     |

Skeema pakottaa vain turvallisen merkkimuodon; katalogin validoinnin on jäsennettävä ja
normalisoitava arvo oikealla SPDX-lausekejäsentimellä. Tallenna täydellinen upstream-lauseke,
joka on todistettu kiinnitetyssä commitissa (esimerkiksi `Apache-2.0` tai
`MIT OR GPL-3.0-only`).

### `verification`

Varmennus sovelletaan kohteeseen `source.commit`. Objekti, jolla on neljä vaadittua ominaisuutta:

| Ominaisuus           | Tyyppi         | Säännöt                                                |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | `date-time`-muotoinen aikaleima tarkistuksesta         |
| `repositoryIdentity` | const          | On oltava `resolved`                                   |
| `smokeTest`          | objekti tai null | Smoke-testitietue, tai `null` kun kelpuutettua testiä ei ole |

Kun `smokeTest` on läsnä, se vaatii:

| Ominaisuus      | Tyyppi | Säännöt                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — viittaa `package`-kenttään tai kiinnitettyyn lähteeseen monistamatta muuttuvia arvoja |
| `check`         | object | Vaaditut `name` (paketin nimen muoto) ja `version` (tarkan version muoto) |
| `result`        | const  | `passed` — epäonnistunutta smoke-testiä ei kirjata smoke-testiksi   |

Ehdollinen sääntö: `status: verified` **vaatii** ei-nullin `smokeTest`-objektin. Merkinnät,
joilla ei ole tarkastettavissa olevaa smoke-todistetta, käyttävät arvoja `status: eligible` ja
`smokeTest: null`. Mikään tila ei ole suositus tai tietoturvasertifikaatti — katso
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Julkiset alkuperälinkit, jokainen URI tai `null`:

| Ominaisuus   | Tyyppi        | Säännöt                                          |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string tai null | Julkinen Discussion-URL, kun sellainen on      |
| `comment`    | string tai null | Julkinen kommentti-URL, kun sellainen on       |

### `media`

Ainoa valinnainen kenttä. Taulukko, jossa on enintään **6** kohdetta, joista kukin kuvaa yhtä kuvakaappausta tai lyhyttä videota lisäosasta:

| Ominaisuus | Tyyppi | Säännöt |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` tai `video` |
| `url`    | string | Muuttumaton GitHub-URL, enintään 2048 merkkiä (katso alta) |
| `alt`    | string | Vaihtoehtoinen teksti, 1–120 merkkiä |

URL-osoitteen on oltava yhtä muuttumaton kuin `source.commit`. Haaran nimen sisältävä
`raw.githubusercontent.com`-polku (`.../main/docs/shot.png`) näyttää sen, mitä haara sisältää
tänään, joten merkintä julkaisisi tarkastamattoman kuvan sinä päivänä, kun haara siirtyy. Kaksi
muotoa hyväksytään:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — kiinnitetty raw-polku;
- `https://github.com/<owner>/<repo>/assets/…` — GitHubin sisältöosoitteinen lataus-URL, `video`-kohteille.

Skeema vaatii turvallisen muodon (isäntä, 40 merkin heksadesimaaliviite, rajattu pituus).
`catalog validate` vaatii loput semanttisesti: URL-osoitteen on kiinnitettävä **merkinnän oman**
`source.commit` **merkinnän omassa** repositoriossa, ja haaran URL hylätään virheellä
`media[n].url must pin the entry commit, not a branch`.

Jätä kenttä kokonaan pois, kun näytettävää ei ole — `media: []` ei ole pätevä tapa sanoa "ei
kuvakaappauksia". Kenttä on lisäävä: ennen sen olemassaoloa julkaistut merkinnät pysyvät
pätevinä, ja kuluttaja, joka jättää sen huomiotta, lukee jokaisen merkinnän täsmälleen kuten ennen.

## `kind: skill` -merkinnät

Skeemaversio 1 määrittelee myös toisen, itsenäisen merkintäsopimuksen arvolle `kind: skill`,
julkaistuna tiedostona [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01,
vaihe 0). Se ei koskaan kosketa yllä olevaa plugin-skeemaa: merkinnät, joilla on
`kind: plugin`, validoituvat täsmälleen kuten ennenkin, ja skill-skeematiedosto on totuuden
lähde skill-merkinnöille samalla tavalla kuin plugin-skeema on plugin-merkinnöille.

Skilliä ei asenneta, vaan harness **lataa** sen, joten vain plugineille kuuluvat
asennuskuvaimet (`package`, `dsh`) eivät ole olemassa skill-merkinnässä, ja niiden tilalla ovat
`usage` + `compat`. Skill asuu myös usein sellaisen repositorion alihakemistossa, joka isännöi
monia skillejä, joten identiteetti ja deduplikointi on `source.repository` + `source.subpath`
pelkän repositorion sijaan. Skill-merkintä ei salli `media`-galleriaa: skill on tekstiä, jonka
harness lataa, joten kuvakaapattavaa ei ole (`additionalProperties: false` on se, mikä tämän
pakottaa).

Nämä kentät säilyttävät täsmälleen yllä plugin-merkinnöille dokumentoidun muodon ja säännöt:
`schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Jokainen kenttä on vaadittu
paitsi `triggers`, ainoa valinnainen skill-kenttä.

### Skill-kohtaiset kentät

| Kenttä               | Tyyppi | Vaadittu | Säännöt                                                     |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   kyllä  | On oltava täsmälleen `skill`                                |
| `skillScope`         | enum   |   kyllä  | `repository` (koko repositorio **on** skilli) tai `subdirectory` (skill asuu polussa `source.subpath`) |
| `triggers`           | array  |    ei    | Milloin skill laukeaa — teksti, jonka käyttäjä arvioi ennen sen lataamista. Vähintään 1 uniikki merkkijono, kukin 3–200 merkkiä; jätä kenttä kokonaan pois, kun laukaisimia ei ole (`triggers: []` on epäkelpo) |
| `usage.load`         | string |   kyllä  | Miten harness lataa skillin, 1–200 merkkiä; skill ladataan, ei koskaan asenneta |
| `usage.evidencePath` | string |   kyllä  | Turvallinen suhteellinen polku (sama kuvio kuin `description.evidencePath`) lataustodisteeseen commitissa `source.commit` |
| `compat.harnessMin`  | string |   kyllä  | Harnessin vähimmäisversio, jota vasten skill varmistettiin; täsmällinen `x.y.z`-muoto (valinnainen prerelease/build), enintään 64 merkkiä. Semanttinen kerros vaatii lisäksi jäsennettävän, täsmällisen SemVerin |

Ehdolliset säännöt (skill-skeeman `allOf`-lohkojen pakottamat):

- `skillScope: subdirectory` **pakottaa** kentän `source.subpath` olemaan turvallinen
  suhteellinen polkumerkkijono — alihakemistossa isännöidyn skillin on kiinnitettävä se
  alihakemisto.
- `skillScope: repository` **pakottaa** arvon `source.subpath: null` — koko repositorion
  kattava skill ei saa ilmoittaa subpathia.

`verification` säilyttää plugin-muodon (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), mutta `smokeTest`in on oltava täsmälleen `null`: skillillä ei ole asennuksen
smoke-testiä, ja sisältökatselmointi on hyväksymisportti. Skill-skeema ei sisällä ehtoa
`status: verified` → `smokeTest` eikä ehtoja `repositoryScope` → `popularity`; nuo kytkennät
ovat vain plugin-skeeman sääntöjä.

### Semanttinen kerros skilleille

Skeeman päälle katalogin validointi soveltaa samoja pakollisia semanttisia jäsentimiä kuin
plugineille siellä, missä kentät ovat olemassa: `license.spdx`in on jäsennyttävä kelvolliseksi
SPDX-lausekkeeksi (`invalid-spdx`), ja `compat.harnessMin`in on oltava täsmällinen SemVer
(`invalid-semver`). `invalid-sri`-tapausta ei ole — skillillä ei ole `package.integrity`ä.

### Skillin identiteetti ja deduplikointi

Skillin kanoninen avain on `skill:<source.repositoryNodeId>:<normalized subpath>`. Subpath
normalisoidaan vain identiteettiä varten: kenoviivoista tulee `/`, tyhjät ja `.`-segmentit
pudotetaan, ja tyhjästä tuloksesta (tai arvosta `subpath: null`) tulee `.` — koko repositorio.
NUL-tavuja tai `..`-segmenttejä sisältävä subpath hylätään, ei koskaan "siivota". Kaksi saman
repositorion skilliä ovat kaksi merkintää; sama repositorio + subpath kahdesti on törmäys.

### Minimaalinen skill-esimerkki

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## Mitä skeema ei tarkista

Skeema on tarkoituksellisesti paikallinen ja rakenteellinen. Se **ei** varmista, että repositorio
on olemassa, että solmutunnus vastaa URL:aa, että todistepolut ovat olemassa kiinnitetyssä
commitissa, että tähtimäärä on oikea tai että luoja omistaa lähteen. Nämä tarkistukset kuuluvat
ylläpitäjien tarkastusporteille, jotka kuvataan tiedostoissa
[CONTRIBUTING.md](../../CONTRIBUTING.md) ja [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
