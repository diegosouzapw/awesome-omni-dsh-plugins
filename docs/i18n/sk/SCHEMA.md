# Referencia schémy záznamu katalógu

> 🌐 [English](../../docs/SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文](../zh-CN/SCHEMA.md) · **Slovenčina**

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

Pravidlá najvyššej úrovne: záznam je jeden YAML objekt, `additionalProperties: false` (neznáme polia
sa odmietajú) a **všetky** nasledujúce polia sú povinné.

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

Jedna z trinástich kategórií schopností:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## Čo schéma nekontroluje

Schéma je zámerne lokálna a štrukturálna. **Neoveruje**, že repozitár existuje, že ID uzla sa
zhoduje s URL, že cesty dôkazov existujú na pripnutom commite, že počet hviezdičiek je presný, ani
že tvorca vlastní zdroj. Tieto kontroly patria do brán posúdenia správcov popísaných v
[CONTRIBUTING.md](../../CONTRIBUTING.md) a [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
