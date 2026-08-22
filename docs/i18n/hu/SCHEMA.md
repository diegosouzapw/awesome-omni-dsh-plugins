# Katalógusbejegyzés-séma referencia

> 🌐 [English](../../docs/SCHEMA.md) · **Magyar**

> **Nem hivatalos közösségi projekt. Nem áll kapcsolatban a DeepSeekkel, és nem az ő jóváhagyásával vagy támogatásával készült.**
> A DeepSeek nevek és védjegyek a megfelelő tulajdonosaik tulajdonát képezik.

Ez a mezőnkénti referencia a [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml)
fájlhoz, a nyilvános JSON Schema-hoz (draft 2020-12), amelynek minden fájl meg kell feleljen a
`catalog/plugins/` alatt. Maga a séma-fájl a hiteles forrás; ha ez az oldal és a séma
eltérnek, a séma nyer.

Két validációs réteg érvényes. A nyilvános séma korlátozott *biztonságos formákat* kényszerít ki
(mintákat és hosszakat, amelyek elutasítják az opció-szerű vagy nem korlátozott értékeket). Erre
épülve a `catalog validate` kötelező szemantikai interpretálókat alkalmaz: pontos SemVert a
verziókhoz, SHA-512 SRI-t az integritás-értékekhez, SPDX-kifejezés-interpretálást a
licencekhez, és duplikált kulcs elutasítást. Egy érték megfelelhet a séma mintájának, és mégis
elutasításra kerülhet szemantikailag.

Legfelső szintű szabályok: a bejegyzés egyetlen YAML-objektum, `additionalProperties: false`
(ismeretlen mezők elutasításra kerülnek), és a következő mezők **mindegyike** kötelező.

## Legfelső szintű mezők

| Mező              | Típus   | Kötelező | Összefoglaló                                                       |
| ----------------- | ------- | :------: | -------------------------------------------------------------- |
| `schemaVersion`   | const   |   igen   | Pontosan `1` kell legyen                                        |
| `id`              | string  |   igen   | Kisbetűs kebab-case bejegyzés-ID; meg kell egyeznie a fájlnévvel |
| `name`            | string  |   igen   | Megjelenítendő név, 1–120 karakter                               |
| `description`     | object  |   igen   | Kurált angol összefoglaló és annak bizonyíték-útvonala           |
| `unofficial`      | const   |   igen   | Pontosan `true` kell legyen                                      |
| `kind`            | enum    |   igen   | Kanonikus artefaktum-diszkrimináló                                |
| `primaryCategory` | enum    |   igen   | Egyetlen elsődleges képességkategória                            |
| `tags`            | array   |   igen   | Egyedi, kisbetűs kebab-case címkék (lehet üres)                  |
| `source`          | object  |   igen   | Eredeti repository, node-ID, subpath és rögzített commit         |
| `creator`         | object  |   igen   | Az alkotó nyilvános GitHub handle-je                              |
| `package`         | object  |   igen   | Kanonikus telepítési deszkriptor (npm **vagy** source)            |
| `dsh`             | object  |   igen   | DSH-profilok és natív integrációs bizonyíték-útvonal              |
| `repositoryScope` | enum    |   igen   | `dedicated` vagy `monorepo`                                      |
| `popularity`      | object  |   igen   | Csillag-szabályzat és csillagszám (a hatókörtől függően)          |
| `license`         | object  |   igen   | Upstream SPDX licenckifejezés                                    |
| `verification`    | object  |   igen   | Verifikációs állapot, ellenőrzés időpontja, identitás és smoke-teszt |
| `provenance`      | object  |   igen   | Nyilvános Discussion/komment URL-ek vagy `null`                  |

### `schemaVersion`

Konstans `1`. A nyilvános séma 1-es verzióját azonosítja; bármely más érték érvénytelen.

### `id`

String, amely megfelel a `^[a-z0-9]+(?:-[a-z0-9]+)*$` mintának — kisbetűs kebab-case, kezdő/záró
vagy dupla kötőjelek nélkül. A [CONTRIBUTING.md](../../CONTRIBUTING.md) szerint a bejegyzés
fájljának `catalog/plugins/<id>.yaml` néven kell szerepelnie, az azonos értékkel; a validáló
elutasítja az eltérést (`id-filename-mismatch`). Az ID-nak az alkotó névterével is kell
kezdődnie: a `creator.github` handle kisbetűsített formájával, ahol az `[a-z0-9]`-on kívüli
karakterek minden sorozata egyetlen `-`-ba vonódik össze, majd egy `-`-lel folytatva
(`id-creator-prefix`).

### `name`

Szabad formátumú megjelenítendő név, `minLength: 1`, `maxLength: 120`.

### `description`

Objektum pontosan két kötelező tulajdonsággal (más nem megengedett):

| Tulajdonság    | Típus  | Szabályok                                                             |
| -------------- | ------ | ---------------------------------------------------------------------- |
| `en`           | string | Angol összefoglaló, 20–320 karakter                                    |
| `evidencePath` | string | Relatív repository-útvonal minta; nincs kezdő `/`, nincs backslash, nincs `.`/`..` szegmens |

Az angol összefoglalót az `evidencePath`-nál lévő fájlból kell kurálni, ahogyan az a
`source.commit`-on létezik — nem másolható másik katalógusból.

### `unofficial`

Konstans `true`. Géppel olvasható jelző, hogy a listázás nem hivatalos.

### `kind`

Az **egyetlen** artefaktum-típus-diszkrimináló (nincs második integrációs-kind mező). Az alábbiak
egyike:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

A jelentéseket és a rangsorolási következményeket a [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
határozza meg.

### `primaryCategory`

A tizenhárom képességkategória egyike:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

A megjelenítendő címkék és a kiválasztási útmutató a [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
fájlban találhatók.

### `tags`

Egyedi stringek tömbje, mindegyik megfelel a `^[a-z0-9]+(?:-[a-z0-9]+)*$` mintának (kisbetűs
kebab-case). A séma nem ír elő minimális darabszámot.

### `source`

Objektum pontosan négy kötelező tulajdonsággal:

| Tulajdonság        | Típus            | Szabályok                                                              |
| ------------------ | ---------------- | ------------------------------------------------------------------------ |
| `repository`       | string           | `https://github.com/<owner>/<repo>` URL; az owner követi a GitHub felhasználónév-szabályokat, a repo neve 1–100 karakter, nem lehet `.`/`..`, és nem végződhet `.git`-re |
| `repositoryNodeId` | string           | Megváltoztathatatlan GitHub repository-node-ID, nem üres                 |
| `subpath`          | string vagy null | A bővítmény subpathja a repositoryn belül (ugyanaz a biztonságos relatív útvonal minta, mint az `evidencePath`), vagy `null` egy repository-gyökér bővítményhez |
| `commit`           | string           | Teljes, 40 karakteres hexadecimális commit-OID                          |

A katalógus-validációnak fel kell oldania a `repositoryNodeId`-t, és el kell utasítania a
repository-URL-eltérést — ez a feloldás karbantartói oldali kapu, nem része a helyi strukturális
ellenőrzésnek.

### `creator`

Objektum egyetlen kötelező tulajdonsággal:

| Tulajdonság | Típus  | Szabályok                                              |
| ----------- | ------ | ------------------------------------------------------- |
| `github`    | string | GitHub-felhasználónév (1–39 karakter, GitHub handle-szabályok) |

A nyilvános profil URL-je mindig `https://github.com/<handle>` formában van levezetve; nem
tárolódik második profil-mező, így a kettő soha nem térhet el egymástól.

### `package`

A kanonikus telepítési deszkriptor. Adat, soha nem shell-parancs, és pontosan két forma
(`oneOf`) egyikét veszi fel:

**npm-csomag** — kötelező `ecosystem`, `name`, `version`; opcionális `integrity`:

| Tulajdonság | Típus  | Szabályok                                                                      |
| ----------- | ------ | -------------------------------------------------------------------------------- |
| `ecosystem` | const  | `npm`                                                                             |
| `name`      | string | npm-csomagnév-forma (opcionálisan scope-olt), max 214 karakter                    |
| `version`   | string | Pontos `x.y.z` verzió-forma (opcionális prerelease/build); tartományok elutasítva. A szemantikai réteg emellett megkövetel egy interpretálható, pontos SemVert |
| `integrity` | string | Opcionális `sha512-…` SRI-forma, 8–256 karakter. A szemantikai rétegnek érvényes SHA-512 SRI-ként kell interpretálnia |

**source-telepítés** — csak `ecosystem` kötelező:

| Tulajdonság | Típus  | Szabályok |
| ----------- | ------ | -------- |
| `ecosystem` | const  | `source` |

Egy source-deszkriptor szándékosan semmi mást nem tárol: a repository, a commit és a subpath a
`source`-ból van levezetve, így a mutable értékek soha nem duplikálódnak.

### `dsh`

Natív DSH-integrációs bizonyíték:

| Tulajdonság    | Típus  | Szabályok                                                                 |
| -------------- | ------ | -------------------------------------------------------------------------- |
| `profiles`     | array  | Legalább egy egyedi profilnév, amely megfelel a `^[A-Za-z0-9][A-Za-z0-9._-]*$` mintának |
| `evidencePath` | string | Biztonságos relatív útvonal a DSH-integrációs bizonyítékhoz a `source.commit`-on |

### `repositoryScope`

Vagy `dedicated` (a repository csillagai pontosan ehhez a bővítményhez tartoznak), vagy
`monorepo` (a bővítmény egy subpath vagy csomag egy szélesebb projekten belül). Ez az érték
vezérli a lenti feltételes népszerűségi szabályokat.

### `popularity`

| Tulajdonság    | Típus              | Szabályok                                                |
| --------------- | ------------------- | -------------------------------------------------------- |
| `starsPolicy`   | enum                | `exact-repository` vagy `undefined-parent-repository`    |
| `stars`         | integer vagy null   | Nem negatív egész szám, vagy `null`                       |

Feltételes szabályok (a séma `allOf` blokkjai kényszerítik ki):

- A `repositoryScope: monorepo` **kikényszeríti** a `starsPolicy: undefined-parent-repository`
  és a `stars: null` értéket. A szülőprojekt csillagai soha nem tulajdoníthatók egy
  monorepo-bővítménynek.
- A `repositoryScope: dedicated` **kikényszeríti** a `starsPolicy: exact-repository` és egy
  `stars >= 0` egész értéket.

Lásd a [docs/RANKING.md](../../docs/RANKING.md) fájlt arról, hogyan táplálják ezek az értékek a
rangsorolási predikátumot.

### `license`

| Tulajdonság | Típus  | Szabályok                                                       |
| ----------- | ------ | ----------------------------------------------------------------- |
| `spdx`      | string | SPDX-kifejezés-forma, 2–256 karakter, kezdő kötőjel nélkül         |

A séma csak egy biztonságos karakter-formát kényszerít ki; a katalógus-validációnak valódi
SPDX-kifejezés-interpretálóval kell interpretálnia és normalizálnia az értéket. Rögzítsd a teljes
upstream kifejezést, bizonyítva a rögzített commiton (például `Apache-2.0` vagy
`MIT OR GPL-3.0-only`).

### `verification`

A verifikáció a `source.commit`-ra vonatkozik. Objektum négy kötelező tulajdonsággal:

| Tulajdonság          | Típus            | Szabályok                                                |
| --------------------- | ----------------- | ----------------------------------------------------------- |
| `status`               | enum              | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`            | string            | Az ellenőrzés `date-time` formátumú időbélyege               |
| `repositoryIdentity`   | const             | `resolved` kell legyen                                       |
| `smokeTest`            | object vagy null  | Smoke-teszt-rekord, vagy `null`, ha nem létezik megfelelő teszt |

Ha jelen van, a `smokeTest` a következőket követeli meg:

| Tulajdonság      | Típus  | Szabályok                                                              |
| ----------------- | ------ | -------------------------------------------------------------------------- |
| `installTarget`    | const  | `canonical-install-descriptor` — a `package`-re vagy a rögzített source-ra hivatkozik, mutable értékek duplikálása nélkül |
| `check`             | object | Kötelező `name` (csomagnév-forma) és `version` (pontos verzió-forma)      |
| `result`            | const  | `passed` — egy sikertelen smoke-teszt nem kerül rögzítésre smoke-tesztként |

Feltételes szabály: a `status: verified` **megkövetel** egy nem null `smokeTest` objektumot.
Az átvizsgálható smoke-bizonyítékkal nem rendelkező bejegyzések a `status: eligible` és a
`smokeTest: null` értéket használják. Egyik állapot sem jóváhagyás vagy biztonsági
tanúsítvány — lásd a [docs/RANKING.md](../../docs/RANKING.md) fájlt.

### `provenance`

Nyilvános proveniencia-linkek, mindegyik URI vagy `null`:

| Tulajdonság   | Típus            | Szabályok                                          |
| -------------- | ----------------- | ---------------------------------------------------- |
| `discussion`   | string vagy null  | Nyilvános Discussion URL, ha létezik                  |
| `comment`      | string vagy null  | Nyilvános komment-URL, ha létezik                     |

## Amit a séma nem ellenőriz

A séma szándékosan helyi és strukturális. **Nem** ellenőrzi, hogy a repository létezik-e, hogy a
node-ID megfelel-e az URL-nek, hogy a bizonyíték-útvonalak léteznek-e a rögzített commiton, hogy
a csillagszám pontos-e, vagy hogy az alkotó a forrás tulajdonosa-e. Ezek az ellenőrzések a
[CONTRIBUTING.md](../../CONTRIBUTING.md) és a [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)
fájlban leírt karbantartói átvizsgálási kapukhoz tartoznak.

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
