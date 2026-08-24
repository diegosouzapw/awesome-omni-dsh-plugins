# Referenční příručka schématu záznamu katalogu

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Čeština**

> **Neoficiální komunitní projekt. Není přidružen k DeepSeek, DeepSeek jej neschvaluje ani nesponzoruje.**
> Názvy a značky DeepSeek náleží jejich příslušným vlastníkům.

Toto je referenční příručka pole po poli pro
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), veřejné JSON Schema
(draft 2020-12), které musí splňovat každý soubor v `catalog/plugins/`. Zdrojem pravdy je
samotný soubor schématu; pokud se tato stránka a schéma rozcházejí, platí schéma.

Uplatňují se dvě vrstvy validace. Veřejné schéma vynucuje omezené *bezpečné tvary* (vzory a
délky, které odmítají hodnoty připomínající volby nebo neomezené hodnoty). Nad tím `catalog
validate` uplatňuje povinné sémantické parsery: přesný SemVer pro verze, SHA-512 SRI pro
hodnoty integrity, parsování výrazu SPDX pro licence a odmítnutí duplicitních klíčů. Hodnota
může odpovídat vzoru schématu, a přesto být sémanticky odmítnuta.

Pravidla na nejvyšší úrovni: záznam je jeden objekt YAML, `additionalProperties: false`
(neznámá pole jsou odmítnuta) a **všechna** následující pole jsou povinná.

## Pole na nejvyšší úrovni

| Pole              | Typ     | Povinné | Shrnutí                                                        |
| ----------------- | ------- | :-----: | ---------------------------------------------------------------- |
| `schemaVersion`   | const   |   ano   | Musí být přesně `1`                                              |
| `id`              | string  |   ano   | ID záznamu v malých písmenech kebab-case; musí odpovídat názvu souboru |
| `name`            | string  |   ano   | Zobrazovaný název, 1–120 znaků                                   |
| `description`     | object  |   ano   | Kurátorované anglické shrnutí plus cesta k důkazu                |
| `unofficial`      | const   |   ano   | Musí být přesně `true`                                           |
| `kind`            | enum    |   ano   | Kanonický diskriminátor artefaktu                                |
| `primaryCategory` | enum    |   ano   | Jediná primární kategorie schopnosti                             |
| `tags`            | array   |   ano   | Jedinečné tagy v malých písmenech kebab-case (může být prázdné)  |
| `source`          | object  |   ano   | Původní repozitář, ID uzlu, podcesta a fixovaný commit           |
| `creator`         | object  |   ano   | Veřejný GitHub handle tvůrce                                     |
| `package`         | object  |   ano   | Kanonický instalační deskriptor (npm **nebo** source)            |
| `dsh`             | object  |   ano   | Profily DSH a cesta k důkazu nativní integrace                   |
| `repositoryScope` | enum    |   ano   | `dedicated` nebo `monorepo`                                      |
| `popularity`      | object  |   ano   | Politika hvězdiček a počet hvězdiček (podmíněno rozsahem)        |
| `license`         | object  |   ano   | Upstream výraz licence SPDX                                      |
| `verification`    | object  |   ano   | Stav verifikace, čas kontroly, identita a smoke test             |
| `provenance`      | object  |   ano   | Veřejné URL adresy Discussion/komentáře nebo `null`               |

### `schemaVersion`

Konstanta `1`. Identifikuje veřejné schéma verze 1; jakákoli jiná hodnota je neplatná.

### `id`

Řetězec odpovídající `^[a-z0-9]+(?:-[a-z0-9]+)*$` — malá písmena kebab-case, bez úvodních/
koncových nebo dvojitých pomlček. Podle [CONTRIBUTING.md](../../CONTRIBUTING.md) musí být
soubor záznamu pojmenován `catalog/plugins/<id>.yaml` se stejnou hodnotou; validátor nesoulad
odmítá (`id-filename-mismatch`). ID musí také začínat jmenným prostorem (namespace) tvůrce:
handle `creator.github` malými písmeny, kde každá posloupnost znaků mimo `[a-z0-9]` je stažena
do jedné `-`, následovaná `-` (`id-creator-prefix`).

### `name`

Volně formátovaný zobrazovaný název, `minLength: 1`, `maxLength: 120`.

### `description`

Objekt s přesně dvěma povinnými vlastnostmi (žádné jiné nejsou povoleny):

| Vlastnost      | Typ    | Pravidla                                                              |
| -------------- | ------ | ------------------------------------------------------------------------ |
| `en`           | string | Anglické shrnutí, 20–320 znaků                                            |
| `evidencePath` | string | Vzor relativní cesty v repozitáři; bez úvodního `/`, bez zpětných lomítek, bez segmentů `.`/`..` |

Anglické shrnutí musí být kurátorováno ze souboru na `evidencePath` tak, jak existuje v
`source.commit` — nikoli zkopírováno z jiného katalogu.

### `unofficial`

Konstanta `true`. Strojově čitelný marker, že se jedná o neoficiální záznam.

### `kind`

**Jediný** diskriminátor typu artefaktu (neexistuje žádné druhé pole typu integrace). Jedno z:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Významy a důsledky pro žebříček jsou definovány v
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Jedna ze třinácti kategorií schopností:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Zobrazované popisky a pokyny pro výběr jsou v
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Pole jedinečných řetězců, každý odpovídající `^[a-z0-9]+(?:-[a-z0-9]+)*$` (malá písmena
kebab-case). Schéma nevyžaduje žádný minimální počet.

### `source`

Objekt s přesně čtyřmi povinnými vlastnostmi:

| Vlastnost           | Typ             | Pravidla                                                                  |
| -------------------- | --------------- | ---------------------------------------------------------------------------- |
| `repository`          | string          | URL `https://github.com/<owner>/<repo>`; owner se řídí pravidly uživatelských jmen GitHubu, název repa má 1–100 znaků, nesmí být `.`/`..` ani končit na `.git` |
| `repositoryNodeId`     | string          | Neměnné ID uzlu repozitáře GitHub, neprázdné                                  |
| `subpath`              | string nebo null | Podcesta pluginu uvnitř repozitáře (stejný bezpečný vzor relativní cesty jako `evidencePath`), nebo `null` pro plugin v kořeni repozitáře |
| `commit`               | string          | Úplné 40znakové hexadecimální OID commitu                                     |

Validace katalogu musí vyřešit `repositoryNodeId` a odmítnout nesoulad URL repozitáře — toto
rozřešení je bránou na straně správce, nikoli součástí lokální strukturální kontroly.

### `creator`

Objekt s jedinou povinnou vlastností:

| Vlastnost | Typ    | Pravidla                                              |
| ---------- | ------ | -------------------------------------------------------- |
| `github`   | string | Uživatelské jméno GitHub (1–39 znaků, pravidla handlu GitHub) |

Veřejná URL profilu je vždy odvozena jako `https://github.com/<handle>`; neukládá se žádné
druhé pole profilu, takže se tyto dvě hodnoty nikdy nemohou rozejít.

### `package`

Kanonický instalační deskriptor. Jsou to data, nikdy shellový příkaz, a nabývá přesně jednoho
ze dvou tvarů (`oneOf`):

**balíček npm** — povinné `ecosystem`, `name`, `version`; volitelné `integrity`:

| Vlastnost   | Typ    | Pravidla                                                                        |
| ------------ | ------ | ------------------------------------------------------------------------------------ |
| `ecosystem`  | const  | `npm`                                                                                 |
| `name`       | string | Tvar názvu balíčku npm (volitelně s scope), max. 214 znaků                          |
| `version`    | string | Tvar přesné verze `x.y.z` (volitelné prerelease/build); rozsahy jsou odmítnuty. Sémantická vrstva navíc vyžaduje rozparsovatelný, přesný SemVer |
| `integrity`  | string | Volitelný tvar SRI `sha512-…`, 8–256 znaků. Sémantická vrstva jej musí rozparsovat jako platné SHA-512 SRI |

**instalace ze source** — povinné pouze `ecosystem`:

| Vlastnost   | Typ    | Pravidla |
| ------------ | ------ | -------- |
| `ecosystem`  | const  | `source` |

Deskriptor source záměrně neukládá nic dalšího: repozitář, commit a podcesta jsou odvozeny z
`source`, takže proměnlivé hodnoty se nikdy neduplikují.

### `dsh`

Důkaz nativní integrace s DSH:

| Vlastnost      | Typ    | Pravidla                                                                    |
| --------------- | ------ | -------------------------------------------------------------------------------- |
| `profiles`       | array  | Alespoň jeden jedinečný název profilu odpovídající `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath`    | string | Bezpečná relativní cesta k důkazu integrace s DSH v `source.commit`                |

### `repositoryScope`

Buď `dedicated` (hvězdičky repozitáře patří přesně tomuto pluginu), nebo `monorepo` (plugin je
podcesta nebo balíček uvnitř širšího projektu). Tato hodnota řídí níže uvedená podmíněná
pravidla popularity.

### `popularity`

| Vlastnost     | Typ                | Pravidla                                               |
| -------------- | ------------------- | ----------------------------------------------------------- |
| `starsPolicy`   | enum                | `exact-repository` nebo `undefined-parent-repository`       |
| `stars`         | integer nebo null   | Nezáporné celé číslo, nebo `null`                             |

Podmíněná pravidla (vynucená bloky `allOf` schématu):

- `repositoryScope: monorepo` **vynucuje** `starsPolicy: undefined-parent-repository` a
  `stars: null`. Hvězdičky nadřazeného projektu se nikdy nepřiřazují pluginu v monorepu.
- `repositoryScope: dedicated` **vynucuje** `starsPolicy: exact-repository` a celé číslo
  `stars >= 0`.

Jak tyto hodnoty vstupují do predikátu žebříčku, najdete v
[docs/RANKING.md](../../docs/RANKING.md).

### `license`

| Vlastnost | Typ    | Pravidla                                                         |
| ---------- | ------ | ------------------------------------------------------------------- |
| `spdx`      | string | Tvar výrazu SPDX, 2–256 znaků, bez úvodní pomlčky                    |

Schéma vynucuje pouze bezpečný tvar znaků; validace katalogu musí hodnotu rozparsovat a
normalizovat pomocí skutečného parseru výrazů SPDX. Zaznamenejte úplný upstream výraz doložený
ve fixovaném commitu (například `Apache-2.0` nebo `MIT OR GPL-3.0-only`).

### `verification`

Verifikace se vztahuje na `source.commit`. Objekt se čtyřmi povinnými vlastnostmi:

| Vlastnost            | Typ             | Pravidla                                                |
| ---------------------- | ----------------- | -------------------------------------------------------------- |
| `status`                | enum              | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`             | string            | Časové razítko kontroly ve formátu `date-time`                  |
| `repositoryIdentity`    | const             | Musí být `resolved`                                             |
| `smokeTest`             | object nebo null   | Záznam smoke testu, nebo `null`, pokud neexistuje kvalifikující test |

Pokud je přítomen, `smokeTest` vyžaduje:

| Vlastnost      | Typ    | Pravidla                                                                  |
| --------------- | ------ | -------------------------------------------------------------------------------- |
| `installTarget`  | const  | `canonical-install-descriptor` — odkazuje na `package` nebo fixovaný source, aniž by duplikoval proměnlivé hodnoty |
| `check`           | object | Povinné `name` (tvar názvu balíčku) a `version` (tvar přesné verze)                |
| `result`          | const  | `passed` — neúspěšný smoke test se jako smoke test nezaznamenává                  |

Podmíněné pravidlo: `status: verified` **vyžaduje** neprázdný (non-null) objekt `smokeTest`.
Záznamy bez posouditelného důkazu smoke testu používají `status: eligible` a
`smokeTest: null`. Žádný stav není doporučením ani bezpečnostní certifikací — viz
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Veřejné odkazy na provenance, každý URI nebo `null`:

| Vlastnost    | Typ              | Pravidla                                          |
| ------------- | ------------------ | ---------------------------------------------------- |
| `discussion`   | string nebo null   | Veřejná URL Discussion, pokud existuje                |
| `comment`      | string nebo null   | Veřejná URL komentáře, pokud existuje                 |

## Co schéma nekontroluje

Schéma je záměrně lokální a strukturální. **Neověřuje**, zda repozitář existuje, zda ID uzlu
odpovídá URL, zda cesty k důkazům existují ve fixovaném commitu, zda je počet hvězdiček
přesný, ani zda tvůrce vlastní zdroj. Tyto kontroly patří k bránám posouzení správců
popsaným v [CONTRIBUTING.md](../../CONTRIBUTING.md) a
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
