# Referencia schémy záznamu katalógu

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Slovenčina**

> **Neoficiálny komunitný projekt. Nie je prepojený s DeepSeek, nie je ním podporovaný ani sponzorovaný.**
> Názvy a značky DeepSeek patria ich príslušnému vlastníkovi.

Toto je referencia pole po poli pre [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
verejnú JSON schému (draft 2020-12), ktorú musí spĺňať každý súbor v priečinku `catalog/plugins/`.
Samotný súbor schémy je zdrojom pravdy; keď sa táto stránka a schéma rozchádzajú, platí schéma.

Platia dve vrstvy validácie. Verejná schéma vynucuje ohraničené *bezpečné tvary* (regulárne výrazy a
dĺžky, ktoré odmietajú hodnoty vyzerajúce ako prepínače alebo neohraničené hodnoty). Navyše
`catalog validate` uplatňuje povinné sémantické parsery: presné SemVer pre verzie, SHA-512 SRI pre
hodnoty integrity, parsovanie SPDX výrazov pre licencie a odmietanie duplicitných kľúčov. Hodnota
môže vyhovovať regulárnemu výrazu schémy a predsa byť sémanticky odmietnutá.

Pravidlá najvyššej úrovne: záznam je jediný objekt YAML, `additionalProperties: false`
(neznáme polia sa odmietajú) a všetky nižšie uvedené polia sú povinné okrem `media` —
jediného voliteľného poľa.

## Polia najvyššej úrovne

| Pole              | Typ     | Povinné | Zhrnutie                                                        |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   áno    | Musí byť presne `1`                                           |
| `id`              | string  |   áno    | ID záznamu v kebab-case malými písmenami; musí sa zhodovať s názvom súboru        |
| `name`            | string  |   áno    | Zobrazovaný názov, 1–120 znakov                                |
| `description`     | object  |   áno    | Kurátorsky spracovaný anglický súhrn a jeho cesta dôkazu                |
| `unofficial`      | const   |   áno    | Musí byť presne `true`                                        |
| `kind`            | enum    |   áno    | Kanonický diskriminátor druhu artefaktu                              |
| `primaryCategory` | enum    |   áno    | Jedna primárna kategória schopností                            |
| `tags`            | array   |   áno    | Unikátne značky v kebab-case malými písmenami (môžu byť prázdne)               |
| `source`          | object  |   áno    | Pôvodný repozitár, ID uzla, podcesta a pripnutý commit       |
| `creator`         | object  |   áno    | Verejný GitHub handle tvorcu                                |
| `package`         | object  |   áno    | Kanonický inštalačný deskriptor (npm **alebo** zdroj)              |
| `dsh`             | object  |   áno    | DSH profily a cesta dôkazu natívnej integrácie             |
| `repositoryScope` | enum    |   áno    | `dedicated` alebo `monorepo`                                     |
| `popularity`      | object  |   áno    | Politika hviezdičiek a počet hviezdičiek (podľa rozsahu)            |
| `license`         | object  |   áno    | Upstream SPDX licenčný výraz                              |
| `verification`    | object  |   áno    | Stav overenia, čas kontroly, identita a smoke test      |
| `provenance`      | object  |   áno    | Verejné URL Discussion/komentára alebo `null`                      |
| `media`           | array   |    nie    | Až 6 snímok obrazovky/videí, každá URL pripnutá k `source.commit` |

### `schemaVersion`

Konštanta `1`. Identifikuje verziu 1 verejnej schémy; akákoľvek iná hodnota je neplatná.

### `id`

Reťazec zodpovedajúci `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case malými písmenami, bez úvodnej,
koncovej ani zdvojenej pomlčky. Podľa [CONTRIBUTING.md](../../CONTRIBUTING.md) musí byť súbor
záznamu pomenovaný `catalog/plugins/<id>.yaml` s identickou hodnotou; validátor odmieta nezhodu
(`id-filename-mismatch`). ID musí tiež začínať menným priestorom tvorcu: handle `creator.github`
malými písmenami, pričom každá postupnosť znakov mimo `[a-z0-9]` sa zbalí do jednej `-`,
nasledovaná `-` (`id-creator-prefix`).

### `name`

Voľný zobrazovaný názov, `minLength: 1`, `maxLength: 120`.

### `description`

Objekt s presne dvoma povinnými vlastnosťami (žiadne iné nie sú povolené):

| Vlastnosť      | Typ    | Pravidlá                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Anglický súhrn, 20–320 znakov                                    |
| `evidencePath` | string | Regulárny výraz relatívnej cesty v repozitári; bez úvodného `/`, bez spätných lomiek, bez segmentov `.`/`..` |

Anglický súhrn musí byť kurátorsky spracovaný zo súboru na `evidencePath` tak, ako existuje na
`source.commit` — nie skopírovaný z iného katalógu.

### `unofficial`

Konštanta `true`. Strojovo čitateľná značka, že záznam je neoficiálny.

### `kind`

**Jediný** diskriminátor typu artefaktu (neexistuje druhé pole druhu integrácie). Jedna z hodnôt:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Významy a dôsledky pre rebríček sú definované v [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Jedna zo štrnástich kategórií schopností:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Zobrazované označenia a usmernenie pre výber sú v [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Pole unikátnych reťazcov, každý zodpovedajúci `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case malými
písmenami). Schéma nevyžaduje minimálny počet.

### `source`

Objekt s presne štyrmi povinnými vlastnosťami:

| Vlastnosť          | Typ            | Pravidlá                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL `https://github.com/<owner>/<repo>`; vlastník sa riadi pravidlami GitHub používateľských mien, názov repozitára 1–100 znakov, nesmie byť `.`/`..` ani končiť na `.git` |
| `repositoryNodeId` | string         | Nemenné ID uzla GitHub repozitára, neprázdne                         |
| `subpath`          | string alebo null | Podcesta pluginu v repozitári (rovnaký bezpečný regulárny výraz relatívnej cesty ako `evidencePath`), alebo `null` pre plugin v koreni repozitára |
| `commit`           | string         | Úplný 40-znakový hexadecimálny OID commitu                               |

Validácia katalógu musí dohľadať `repositoryNodeId` a odmietnuť nezhodu URL repozitára — toto
dohľadanie je brána na strane správcov, nie súčasť lokálnej štrukturálnej kontroly.

### `creator`

Objekt s jedinou povinnou vlastnosťou:

| Vlastnosť | Typ    | Pravidlá                                             |
| --------- | ------ | ------------------------------------------------- |
| `github`  | string | GitHub používateľské meno (1–39 znakov, pravidlá GitHub handle) |

Verejná URL profilu sa vždy odvodzuje ako `https://github.com/<handle>`; neukladá sa druhé pole
profilu, takže tieto dve hodnoty sa nikdy nemôžu rozísť.

### `package`

Kanonický inštalačný deskriptor. Sú to dáta, nikdy nie shellový príkaz, a má presne jednu z dvoch
podôb (`oneOf`):

**npm balík** — povinné `ecosystem`, `name`, `version`; voliteľné `integrity`:

| Vlastnosť   | Typ   | Pravidlá                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Tvar názvu npm balíka (voliteľne so scope), max. 214 znakov                 |
| `version`   | string | Presný tvar verzie `x.y.z` (voliteľný prerelease/build); rozsahy sa odmietajú. Sémantická vrstva navyše vyžaduje parsovateľné, presné SemVer |
| `integrity` | string | Voliteľný tvar SRI `sha512-…`, 8–256 znakov. Sémantická vrstva ho musí spracovať ako platné SHA-512 SRI |

**zdrojová inštalácia** — povinné iba `ecosystem`:

| Vlastnosť   | Typ   | Pravidlá    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Zdrojový deskriptor zámerne neukladá nič iné: repozitár, commit a podcesta sa odvodzujú zo
`source`, takže meniteľné hodnoty sa nikdy neduplikujú.

### `dsh`

Dôkaz natívnej DSH integrácie:

| Vlastnosť      | Typ    | Pravidlá                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Aspoň jeden unikátny názov profilu zodpovedajúci `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Bezpečná relatívna cesta k dôkazu DSH integrácie na `source.commit` |

### `repositoryScope`

Buď `dedicated` (hviezdičky repozitára patria presne tomuto pluginu) alebo `monorepo` (plugin je
podcestou alebo balíkom v širšom projekte). Táto hodnota riadi podmienené pravidlá popularity
nižšie.

### `popularity`

| Vlastnosť      | Typ             | Pravidlá                                                |
| -------------- | --------------- | ---------------------------------------------------- |
| `starsPolicy`  | enum            | `exact-repository` alebo `undefined-parent-repository`  |
| `stars`        | integer alebo null | Nezáporné celé číslo alebo `null`                      |

Podmienené pravidlá (vynucované blokmi `allOf` schémy):

- `repositoryScope: monorepo` **vynucuje** `starsPolicy: undefined-parent-repository` a
  `stars: null`. Hviezdičky nadradeného projektu sa nikdy nepripisujú pluginu v monorepe.
- `repositoryScope: dedicated` **vynucuje** `starsPolicy: exact-repository` a celé číslo
  `stars >= 0`.

Pozri [docs/RANKING.md](../../docs/RANKING.md), ako tieto hodnoty vstupujú do predikátu rebríčka.

### `license`

| Vlastnosť | Typ    | Pravidlá                                                          |
| --------- | ------ | -------------------------------------------------------------- |
| `spdx`    | string | Tvar SPDX výrazu, 2–256 znakov, bez úvodnej pomlčky          |

Schéma vynucuje iba bezpečný tvar znakov; validácia katalógu musí hodnotu spracovať a
normalizovať skutočným parserom SPDX výrazov. Zaznamenajte úplný upstream výraz s dôkazom na
pripnutom commite (napríklad `Apache-2.0` alebo `MIT OR GPL-3.0-only`).

### `verification`

Overenie sa vzťahuje na `source.commit`. Objekt so štyrmi povinnými vlastnosťami:

| Vlastnosť            | Typ            | Pravidlá                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Časová značka kontroly vo formáte `date-time`           |
| `repositoryIdentity` | const          | Musí byť `resolved`                                     |
| `smokeTest`          | object alebo null | Záznam smoke testu, alebo `null`, keď neexistuje kvalifikujúci test |

Ak je prítomný, `smokeTest` vyžaduje:

| Vlastnosť       | Typ    | Pravidlá                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — odkazuje na `package` alebo pripnutý zdroj bez duplikácie meniteľných hodnôt |
| `check`         | object | Povinné `name` (tvar názvu balíka) a `version` (tvar presnej verzie) |
| `result`        | const  | `passed` — neúspešný smoke test sa nezaznamenáva ako smoke test    |

Podmienené pravidlo: `status: verified` **vyžaduje** nenulový objekt `smokeTest`. Záznamy bez
preskúmateľného dôkazu zo smoke testu používajú `status: eligible` a `smokeTest: null`. Žiadny
stav nie je odporúčaním ani bezpečnostnou certifikáciou — pozri [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Verejné odkazy pôvodu, každý je URI alebo `null`:

| Vlastnosť    | Typ            | Pravidlá                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string alebo null | Verejná URL Discussion, ak existuje            |
| `comment`    | string alebo null | Verejná URL komentára, ak existuje               |

### `media`

Jediné voliteľné pole. Pole s najviac **6** položkami, z ktorých každá opisuje jednu snímku obrazovky alebo krátke video pluginu:

| Vlastnosť | Typ | Pravidlá |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` alebo `video` |
| `url`    | string | Nemenná URL GitHubu, najviac 2048 znakov (pozri nižšie) |
| `alt`    | string | Alternatívny text, 1–120 znakov |

URL tu musí byť rovnako nemenná ako `source.commit`. Cesta `raw.githubusercontent.com`
s názvom vetvy (`.../main/docs/shot.png`) ukazuje to, čo vetva obsahuje dnes, takže záznam by
zverejnil neskontrolovaný obrázok v deň, keď sa vetva pohne. Prijímajú sa dve podoby:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — raw cesta pripnutá ku commitu;
- `https://github.com/<owner>/<repo>/assets/…` — obsahom adresovaná URL nahratia GitHubu, pre položky `video`.

Schéma vynucuje len bezpečný tvar (host, 40-znakový hexadecimálny odkaz, obmedzená dĺžka).
Zvyšok vynucuje `catalog validate` sémanticky: URL musí pripínať `source.commit` **samotného
záznamu** v repozitári **samotného záznamu** a URL vetvy sa odmieta s
`media[n].url must pin the entry commit, not a branch`.

Pole úplne vynechajte, keď niet čo ukázať — `media: []` nie je platný spôsob, ako povedať „žiadne
snímky obrazovky“. Pole je aditívne: záznamy zverejnené predtým, než existovalo, zostávajú platné
a konzument, ktorý ho ignoruje, číta každý záznam presne ako predtým.

## Záznamy `kind: skill`

Verzia 1 schémy definuje aj druhý, samostatný kontrakt záznamu pre `kind: skill`, zverejnený
ako [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01, fáza 0). Nikdy sa
nedotýka vyššie uvedenej schémy pluginov: záznamy s `kind: plugin` sa naďalej validujú presne
ako doteraz a súbor schémy skillov je zdrojom pravdy pre záznamy skillov rovnako, ako je schéma
pluginov pre záznamy pluginov.

Skill sa neinštaluje, harness ho **načítava**, takže inštalačné deskriptory určené len pre
pluginy (`package`, `dsh`) na zázname skillu neexistujú a nahrádzajú ich `usage` + `compat`.
Skill navyše často žije v podadresári repozitára, ktorý hostí mnoho skillov, takže identita a
deduplikácia je `source.repository` + `source.subpath`, nie samotný repozitár. Záznam skillu
nepripúšťa galériu `media`: skill je text, ktorý harness načítava, takže nie je čo odfotiť
(vynucuje to práve `additionalProperties: false`).

Tieto polia si zachovávajú presne tvar a pravidlá zdokumentované pre záznamy pluginov vyššie:
`schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Každé pole je povinné okrem
`triggers`, jediného voliteľného poľa skillu.

### Polia špecifické pre skill

| Pole                 | Typ    | Povinné | Pravidlá                                                    |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   áno    | Musí byť presne `skill`                                     |
| `skillScope`         | enum   |   áno    | `repository` (celý repozitár **je** skill) alebo `subdirectory` (skill žije na `source.subpath`) |
| `triggers`           | array  |    nie    | Kedy sa skill spúšťa — text, ktorý používateľ posudzuje pred jeho načítaním. Aspoň 1 unikátny reťazec, každý 3–200 znakov; pole úplne vynechajte, keď žiadne nie sú (`triggers: []` je neplatné) |
| `usage.load`         | string |   áno    | Ako harness skill načítava, 1–200 znakov; skill sa načítava, nikdy neinštaluje |
| `usage.evidencePath` | string |   áno    | Bezpečná relatívna cesta (rovnaký regulárny výraz ako `description.evidencePath`) k dôkazu načítania na `source.commit` |
| `compat.harnessMin`  | string |   áno    | Minimálna verzia harnessu, voči ktorej bol skill overený; presný tvar `x.y.z` (voliteľný prerelease/build), max. 64 znakov. Sémantická vrstva navyše vyžaduje parsovateľné, presné SemVer |

Podmienené pravidlá (vynucované blokmi `allOf` schémy skillov):

- `skillScope: subdirectory` **vynucuje**, aby `source.subpath` bol reťazec bezpečnej relatívnej
  cesty — skill hosťovaný v podadresári musí tento podadresár pripnúť.
- `skillScope: repository` **vynucuje** `source.subpath: null` — skill pokrývajúci celý
  repozitár nesmie deklarovať podcestu.

`verification` si zachováva tvar z pluginov (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), ale `smokeTest` musí byť presne `null`: skill nemá inštalačný smoke test a bránou
prijatia je posúdenie obsahu. Schéma skillov nenesie podmienku `status: verified` → `smokeTest`
ani podmienky `repositoryScope` → `popularity`; tieto väzby sú pravidlami výlučne schémy
pluginov.

### Sémantická vrstva pre skilly

Nad schémou uplatňuje validácia katalógu rovnaké povinné sémantické parsery ako pri pluginoch
tam, kde polia existujú: `license.spdx` sa musí dať spracovať ako platný SPDX výraz
(`invalid-spdx`) a `compat.harnessMin` musí byť presné SemVer (`invalid-semver`). Prípad
`invalid-sri` neexistuje — skill nemá `package.integrity`.

### Identita a deduplikácia skillov

Kanonickým kľúčom skillu je `skill:<source.repositoryNodeId>:<normalized subpath>`. Podcesta sa
normalizuje len na účely identity: spätné lomky sa menia na `/`, prázdne segmenty a segmenty
`.` sa zahadzujú a prázdny výsledok (alebo `subpath: null`) sa stáva `.` — celým repozitárom.
Podcesta obsahujúca bajty NUL alebo segmenty `..` sa odmieta, nikdy sa „nečistí“. Dva skilly
toho istého repozitára sú dva záznamy; ten istý repozitár + podcesta dvakrát je kolízia.

### Minimálny príklad skillu

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

## Čo schéma nekontroluje

Schéma je zámerne lokálna a štrukturálna. **Neoveruje**, že repozitár existuje, že ID uzla sa
zhoduje s URL, že cesty dôkazov existujú na pripnutom commite, že počet hviezdičiek je presný, ani
že tvorca vlastní zdroj. Tieto kontroly patria do brán posúdenia správcov popísaných v
[CONTRIBUTING.md](../../CONTRIBUTING.md) a [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
