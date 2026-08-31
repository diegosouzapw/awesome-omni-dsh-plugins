# Marejeo ya Schema ya Kiingilio cha Katalogi

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Kiswahili**

> **Mradi usio rasmi wa jamii. Hauhusiani na, haujaidhinishwa na, wala haujafadhiliwa na DeepSeek.**
> Majina na alama za DeepSeek ni mali ya wamiliki wao husika.

Haya ni marejeo ya sehemu-kwa-sehemu ya [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
JSON Schema ya umma (draft 2020-12) ambayo kila faili chini ya `catalog/plugins/` lazima itimize.
Faili la schema lenyewe ndilo chanzo cha ukweli; wakati ukurasa huu na schema zinapopingana,
schema ndiyo inayoshinda.

Tabaka mbili za uthibitishaji zinatumika. Schema ya umma hutekeleza *maumbo salama* yenye ukomo
(patterns na urefu unaokataa thamani zinazofanana na chaguo au zisizo na ukomo). Juu yake,
`catalog validate` hutumia vichambuzi vya kisemantiki vya lazima: SemVer halisi kwa matoleo, SRI ya
SHA-512 kwa thamani za integrity, uchambuzi wa usemi wa SPDX kwa leseni, na kukataliwa kwa funguo rudufu. Thamani inaweza kulingana na pattern ya schema na bado kukataliwa kisemantiki.

Kanuni za ngazi ya juu: ingizo ni kitu kimoja cha YAML, `additionalProperties: false`
(sehemu zisizojulikana hukataliwa), na sehemu zote zilizo hapa chini ni za lazima isipokuwa
`media` — sehemu pekee ya hiari.

## Sehemu za ngazi ya juu

| Sehemu            | Aina    | Inahitajika | Muhtasari                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ndiyo    | Lazima iwe `1` haswa                                           |
| `id`              | string  |   ndiyo    | ID ya kiingilio ya kebab-case ya herufi ndogo; lazima ilingane na jina la faili        |
| `name`            | string  |   ndiyo    | Jina la kuonyesha, herufi 1–120                                |
| `description`     | object  |   ndiyo    | Muhtasari wa Kiingereza uliokusanywa pamoja na njia yake ya ushahidi                |
| `unofficial`      | const   |   ndiyo    | Lazima iwe `true` haswa                                        |
| `kind`            | enum    |   ndiyo    | Kitambuzi rasmi cha aina ya zao                              |
| `primaryCategory` | enum    |   ndiyo    | Jamii moja kuu ya uwezo                            |
| `tags`            | array   |   ndiyo    | Lebo za kipekee za kebab-case ya herufi ndogo (zinaweza kuwa tupu)               |
| `source`          | object  |   ndiyo    | Hazina asili, ID ya node, subpath na commit iliyobandikwa       |
| `creator`         | object  |   ndiyo    | Handle ya umma ya GitHub ya muumba                                |
| `package`         | object  |   ndiyo    | Kielezi rasmi cha usakinishaji (npm **au** chanzo)              |
| `dsh`             | object  |   ndiyo    | Wasifu za DSH na njia ya ushahidi wa muunganisho asilia             |
| `repositoryScope` | enum    |   ndiyo    | `dedicated` au `monorepo`                                     |
| `popularity`      | object  |   ndiyo    | Sera ya nyota na idadi ya nyota (inategemea wigo)            |
| `license`         | object  |   ndiyo    | Usemi wa leseni ya SPDX ya upstream                              |
| `verification`    | object  |   ndiyo    | Hali ya uthibitishaji, muda wa ukaguzi, utambulisho na jaribio la moshi      |
| `provenance`      | object  |   ndiyo    | URL za Discussion/maoni ya umma au `null`                      |
| `media`           | array   |    hapana    | Hadi picha za skrini/video 6, kila URL imebandikwa kwenye `source.commit` |

### `schemaVersion`

Thabiti `1`. Hutambua toleo la 1 la schema ya umma; thamani nyingine yoyote ni batili.

### `id`

String inayolingana na `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case ya herufi ndogo, bila hyphen ya
mwanzo/mwisho au mbili mbili. Kulingana na [CONTRIBUTING.md](../../CONTRIBUTING.md), faili ya kiingilio
lazima iitwe `catalog/plugins/<id>.yaml` kwa thamani ile ile; kithibitishaji hukataa kutolingana
(`id-filename-mismatch`). ID pia lazima ianze na namespace ya muumba: handle ya `creator.github` kwa
herufi ndogo, na kila mtiririko wa herufi nje ya `[a-z0-9]` ukikunjwa kuwa `-` moja, ikifuatiwa na `-`
(`id-creator-prefix`).

### `name`

Jina la kuonyesha la fomu huru, `minLength: 1`, `maxLength: 120`.

### `description`

Kitu chenye sifa mbili tu zinazohitajika (hakuna nyingine zinazoruhusiwa):

| Sifa           | Aina   | Kanuni                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Muhtasari wa Kiingereza, herufi 20–320                                    |
| `evidencePath` | string | Pattern ya njia ya hazina ya uwiano; hakuna `/` ya mwanzo, hakuna backslash, hakuna sehemu za `.`/`..` |

Muhtasari wa Kiingereza lazima ukusanywe kutoka faili lililo kwenye `evidencePath` kama lilivyo kwenye
`source.commit` — si kunakiliwa kutoka katalogi nyingine.

### `unofficial`

Thabiti `true`. Alama inayosomeka na mashine kwamba orodha hiyo si rasmi.

### `kind`

Kitambuzi cha **pekee** cha aina ya zao (hakuna sehemu ya pili ya aina ya muunganisho). Moja ya:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Maana na matokeo ya upangaji yamefafanuliwa katika [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Moja ya jamii kumi na nne za uwezo:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Lebo za kuonyesha na mwongozo wa uchaguzi ziko katika [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Safu ya string za kipekee, kila moja ikilingana na `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case ya herufi
ndogo). Hakuna idadi ya chini inayowekwa na schema.

### `source`

Kitu chenye sifa nne tu zinazohitajika:

| Sifa               | Aina           | Kanuni                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL ya `https://github.com/<owner>/<repo>`; mmiliki anafuata kanuni za jina la mtumiaji za GitHub, jina la hazina herufi 1–100, haliwezi kuwa `.`/`..` au kuishia na `.git` |
| `repositoryNodeId` | string         | ID ya node ya hazina ya GitHub isiyobadilika, isiyo tupu                         |
| `subpath`          | string au null | Subpath ya programu-jalizi ndani ya hazina (pattern ile ile salama ya njia ya uwiano kama `evidencePath`), au `null` kwa programu-jalizi ya mizizi ya hazina |
| `commit`           | string         | OID kamili ya commit ya herufi 40 za hexadecimal                               |

Uthibitishaji wa katalogi lazima utatue `repositoryNodeId` na kukataa kutolingana kwa URL ya hazina —
utatuaji huo ni lango la upande wa wasimamizi, si sehemu ya ukaguzi wa kimuundo wa kienyeji.

### `creator`

Kitu chenye sifa moja tu inayohitajika:

| Sifa     | Aina   | Kanuni                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | Jina la mtumiaji la GitHub (herufi 1–39, kanuni za handle za GitHub) |

URL ya umma ya wasifu daima hutokana kama `https://github.com/<handle>`; hakuna sehemu ya pili ya
wasifu inayohifadhiwa, kwa hivyo mbili haziwezi kamwe kutofautiana.

### `package`

Kielezi rasmi cha usakinishaji. Ni data, kamwe si amri ya shell, na huchukua moja haswa ya maumbo
mawili (`oneOf`):

**Kifurushi cha npm** — `ecosystem`, `name`, `version` zinahitajika; `integrity` ni hiari:

| Sifa        | Aina  | Kanuni                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Umbo la jina la kifurushi cha npm (hiari ikiwa na scope), hadi herufi 214                 |
| `version`   | string | Umbo halisi la toleo la `x.y.z` (prerelease/build ya hiari); masafa hukataliwa. Tabaka la kisemantiki pia linahitaji SemVer halisi inayoweza kuchambuliwa |
| `integrity` | string | Umbo la hiari la SRI la `sha512-…`, herufi 8–256. Tabaka la kisemantiki lazima lichambue kama SRI halali ya SHA-512 |

**Usakinishaji wa chanzo** — `ecosystem` pekee ndiyo inahitajika:

| Sifa        | Aina  | Kanuni    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Kielezi cha chanzo kwa makusudi hakihifadhi kitu kingine: hazina, commit na subpath hutokana na
`source`, kwa hivyo thamani zinazobadilika kamwe hazirudiwi.

### `dsh`

Ushahidi wa muunganisho asilia wa DSH:

| Sifa           | Aina   | Kanuni                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Angalau jina moja la kipekee la wasifu linalolingana na `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Njia salama ya uwiano ya ushahidi wa muunganisho wa DSH kwenye `source.commit` |

### `repositoryScope`

Ama `dedicated` (nyota za hazina ni za programu-jalizi hii halisi) au `monorepo` (programu-jalizi ni
subpath au kifurushi ndani ya mradi pana zaidi). Thamani hii huendesha kanuni za umaarufu za masharti
hapa chini.

### `popularity`

| Sifa         | Aina            | Kanuni                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` au `undefined-parent-repository`  |
| `stars`      | integer au null | Nambari kamili isiyo hasi, au `null`                      |

Kanuni za masharti (zinazotekelezwa na vitalu vya `allOf` vya schema):

- `repositoryScope: monorepo` **hulazimisha** `starsPolicy: undefined-parent-repository` na
  `stars: null`. Nyota za mradi mzazi kamwe hazihusishwi na programu-jalizi ya monorepo.
- `repositoryScope: dedicated` **hulazimisha** `starsPolicy: exact-repository` na `stars >= 0`
  ya nambari kamili.

Angalia [docs/RANKING.md](../../docs/RANKING.md) kwa jinsi thamani hizi zinavyolisha kigezo cha upangaji.

### `license`

| Sifa     | Aina   | Kanuni                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | Umbo la usemi wa SPDX, herufi 2–256, hakuna hyphen ya mwanzo          |

Schema hutekeleza tu umbo salama la herufi; uthibitishaji wa katalogi lazima uchambue na kusanifisha
thamani kwa kichambuzi halisi cha usemi wa SPDX. Rekodi usemi kamili wa upstream ulio na ushahidi
kwenye commit iliyobandikwa (kwa mfano `Apache-2.0` au `MIT OR GPL-3.0-only`).

### `verification`

Uthibitishaji hutumika kwa `source.commit`. Kitu chenye sifa nne zinazohitajika:

| Sifa                 | Aina           | Kanuni                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Stempu ya muda ya ukaguzi katika muundo wa `date-time`           |
| `repositoryIdentity` | const          | Lazima iwe `resolved`                                     |
| `smokeTest`          | object au null | Rekodi ya jaribio la moshi, au `null` wakati hakuna jaribio linalostahili |

Likiwepo, `smokeTest` linahitaji:

| Sifa            | Aina   | Kanuni                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — hurejelea `package` au chanzo kilichobandikwa bila kurudia thamani zinazobadilika |
| `check`         | object | `name` (umbo la jina la kifurushi) na `version` (umbo halisi la toleo) zinazohitajika |
| `result`        | const  | `passed` — jaribio la moshi lililoshindwa halirekodiwi kama jaribio la moshi    |

Kanuni ya sharti: `status: verified` **inahitaji** kitu cha `smokeTest` kisicho null. Viingilio
visivyo na ushahidi wa moshi unaoweza kukaguliwa hutumia `status: eligible` na `smokeTest: null`.
Hakuna hali iliyo idhini wala cheti cha usalama — angalia [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Viungo vya asili vya umma, kila kimoja ni URI au `null`:

| Sifa         | Aina           | Kanuni                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string au null | URL ya Discussion ya umma ikiwepo            |
| `comment`    | string au null | URL ya maoni ya umma ikiwepo               |

### `media`

Sehemu pekee ya hiari. Safu yenye vipengele visivyozidi **6**, kila kimoja kikieleza picha moja ya skrini au video fupi ya programu-jalizi:

| Sifa | Aina | Kanuni |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` au `video` |
| `url`    | string | URL isiyobadilika ya GitHub, isiyozidi herufi 2048 (ona hapa chini) |
| `alt`    | string | Maandishi mbadala, herufi 1–120 |

URL hapa lazima isibadilike kama `source.commit`. Njia ya `raw.githubusercontent.com` yenye jina
la tawi (`.../main/docs/shot.png`) huonyesha kile tawi hilo linacho leo, hivyo ingizo lingechapisha
picha ambayo haijakaguliwa siku tawi linapohama. Maumbo mawili yanakubaliwa:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — njia ya raw iliyobandikwa kwenye commit;
- `https://github.com/<owner>/<repo>/assets/…` — URL ya upakiaji ya GitHub inayoshughulikiwa kwa maudhui, kwa vipengele vya `video`.

Skimu hulazimisha umbo salama pekee (mwenyeji, rejeleo la heksadesimali la herufi 40, urefu
uliowekewa mipaka). Mengine hulazimishwa na `catalog validate` kimaana: URL lazima ibandike
`source.commit` **ya ingizo lenyewe** katika hifadhi **ya ingizo lenyewe**, na URL ya tawi
hukataliwa kwa `media[n].url must pin the entry commit, not a branch`.

Acha sehemu hii kabisa wakati hakuna cha kuonyesha — `media: []` si njia halali ya kusema "hakuna
picha za skrini". Sehemu hii ni ya nyongeza: maingizo yaliyochapishwa kabla haijakuwepo yanabaki
halali, na mtumiaji anayeipuuza husoma kila ingizo kama zamani kabisa.

## Viingilio vya `kind: skill`

Toleo la 1 la schema pia linafafanua mkataba wa pili wa kiingilio unaojitegemea kwa
`kind: skill`, uliochapishwa kama [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml)
(SKL-01 awamu ya 0). Kamwe haugusi schema ya programu-jalizi hapo juu: viingilio vyenye
`kind: plugin` vinaendelea kuthibitishwa kama zamani kabisa, na faili la schema ya skill ndilo
chanzo cha ukweli kwa viingilio vya skill kama vile schema ya programu-jalizi ilivyo kwa
viingilio vya programu-jalizi.

Skill haisakinishwi, bali **inapakiwa** na harness, kwa hivyo vielezi vya usakinishaji vya
programu-jalizi pekee (`package`, `dsh`) havipo kwenye kiingilio cha skill na vinabadilishwa na
`usage` + `compat`. Skill pia mara nyingi huishi katika saraka ndogo ya hazina inayohifadhi
skill nyingi, kwa hivyo utambulisho na uondoaji-nakala ni `source.repository` + `source.subpath`
badala ya hazina pekee. Kiingilio cha skill hakiruhusu maonyesho ya `media`: skill ni maandishi
ambayo harness hupakia, kwa hivyo hakuna cha kupiga picha ya skrini
(`additionalProperties: false` ndiyo inayolazimisha hilo).

Sehemu hizi zinahifadhi haswa umbo na kanuni zilizoandikwa kwa viingilio vya programu-jalizi
hapo juu: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`,
`tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`. Kila sehemu ni ya
lazima isipokuwa `triggers`, sehemu pekee ya hiari ya skill.

### Sehemu mahususi za skill

| Sehemu               | Aina   | Inahitajika | Kanuni                                                      |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   ndiyo    | Lazima iwe `skill` haswa                                     |
| `skillScope`         | enum   |   ndiyo    | `repository` (hazina nzima **ndiyo** skill) au `subdirectory` (skill inaishi kwenye `source.subpath`) |
| `triggers`           | array  |    hapana    | Wakati skill inapowashwa — maandishi ambayo mtumiaji hutathmini kabla ya kuipakia. Angalau string 1 ya kipekee, kila moja herufi 3–200; acha sehemu hii kabisa wakati hakuna zozote (`triggers: []` ni batili) |
| `usage.load`         | string |   ndiyo    | Jinsi harness inavyopakia skill, herufi 1–200; skill hupakiwa, kamwe haisakinishwi |
| `usage.evidencePath` | string |   ndiyo    | Njia salama ya uwiano (pattern ile ile kama `description.evidencePath`) ya ushahidi wa upakiaji kwenye `source.commit` |
| `compat.harnessMin`  | string |   ndiyo    | Toleo la chini la harness ambalo skill ilithibitishwa dhidi yake; umbo halisi la `x.y.z` (prerelease/build ya hiari), hadi herufi 64. Tabaka la kisemantiki pia linahitaji SemVer halisi inayoweza kuchambuliwa |

Kanuni za masharti (zinazotekelezwa na vitalu vya `allOf` vya schema ya skill):

- `skillScope: subdirectory` **hulazimisha** `source.subpath` kuwa string ya njia salama ya
  uwiano — skill inayoishi katika saraka ndogo lazima ibandike saraka ndogo hiyo.
- `skillScope: repository` **hulazimisha** `source.subpath: null` — skill ya hazina nzima
  haipaswi kutangaza subpath.

`verification` inahifadhi umbo la programu-jalizi (`status`, `checkedAt`,
`repositoryIdentity`, `smokeTest`), lakini `smokeTest` lazima iwe `null` haswa: skill haina
jaribio la moshi la usakinishaji, na ukaguzi wa maudhui ndilo lango la kukubaliwa. Schema ya
skill haibebi sharti la `status: verified` → `smokeTest` wala masharti ya `repositoryScope` →
`popularity`; miunganisho hiyo ni kanuni za schema ya programu-jalizi pekee.

### Tabaka la kisemantiki kwa skill

Juu ya schema, uthibitishaji wa katalogi hutumia vichambuzi vile vile vya kisemantiki vya
lazima kama kwa programu-jalizi pale sehemu zilipo: `license.spdx` lazima ichambuliwe kama
usemi halali wa SPDX (`invalid-spdx`), na `compat.harnessMin` lazima iwe SemVer halisi
(`invalid-semver`). Hakuna kesi ya `invalid-sri` — skill haina `package.integrity`.

### Utambulisho na uondoaji-nakala wa skill

Ufunguo rasmi wa skill ni `skill:<source.repositoryNodeId>:<normalized subpath>`. Subpath
husanifishwa kwa madhumuni ya utambulisho pekee: backslash huwa `/`, sehemu tupu na za `.`
huondolewa, na matokeo matupu (au `subpath: null`) huwa `.` — hazina nzima. Subpath yenye baiti
za NUL au sehemu za `..` hukataliwa, kamwe "haisafishwi". Skill mbili za hazina ile ile ni
viingilio viwili; hazina ile ile + subpath mara mbili ni mgongano.

### Mfano mdogo wa skill

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

## Schema haikague nini

Schema kwa makusudi ni ya kienyeji na kimuundo. **Hai**thibitishi kwamba hazina ipo, kwamba ID ya node
inalingana na URL, kwamba njia za ushahidi zipo kwenye commit iliyobandikwa, kwamba idadi ya nyota ni
sahihi, au kwamba muumba ndiye mmiliki wa chanzo. Ukaguzi huo ni wa malango ya ukaguzi ya wasimamizi
yaliyoelezwa katika [CONTRIBUTING.md](../../CONTRIBUTING.md) na [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
