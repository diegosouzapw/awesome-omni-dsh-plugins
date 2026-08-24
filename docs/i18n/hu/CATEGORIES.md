# Katalóguskategóriák

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Magyar**

Minden katalógusbejegyzésnek egy artefaktum-`kind`-ja, egy elsődleges képességkategóriája és nulla
vagy több címkéje van. Az elsődleges kategória határozza meg, hogy a bejegyzés hol jelenik meg; a
címkék kategóriák közti keresést biztosítanak a bejegyzés duplikálása nélkül.

## Artefaktumtípusok

<!-- catalog-policy:aggregators-never-entries -->

| Érték | Jelentés | Csillag-rangsorban bővítményként szerepel |
|---|---|---:|
| `plugin` | Telepíthető natív DSH-csomag | Csak akkor, ha minden rangsorolási feltétel teljesül |
| `plugin-family` | Több DSH-bővítményt tartalmazó repository | Nem; külön szekció |
| `skin-theme` | DSH UI-skin vagy vizuális téma | Nem; külön szekció |
| `skill` | DSH-támogatással rendelkező agent-skill | Nem |
| `preset-profile` | DSH-profil vagy preset | Nem |
| `client-interface` | Asztali, TUI-, szerkesztő- vagy távoli kliens | Nem |
| `bridge-adapter` | Integráció egy másik termékből a DSH felé | Nem |
| `ecosystem-project` | Szélesebb projekt, amely DSH-integrációt tartalmaz | Nem |

Egy ernyő-repository, aggregátor, marketplace, telepítő-katalógus vagy lista soha nem lehet
katalógusbejegyzés, még akkor sem, ha maga az aggregátor telepíthető. Csak nyomként használható.
Kövesd végig minden nyomig az önállóan telepíthető gyermek-artefaktumokig, és oldd fel annak az
artefaktumnak a valódi alkotóját, eredeti repository-ját, csomagját és forrás-subpath-ját, mielőtt
benyújtanád. Egy valódi alkotói monorepo lehet egy gyermek-bővítmény eredeti repository-ja, de a
gyermeknek azt a pontos subpath-ot és a monorepo-csillagszabályzatot kell használnia.

A `kind` mező a kanonikus DSH-artefaktum-diszkrimináló. Nincs külön integrációs kind: a `plugin`
már natív DSH-csomagot jelent, míg az `ecosystem-project` már egy szélesebb projektet jelent
DSH-integrációval. Ez megakadályozza az ellentmondásos besorolási párokat.

## Elsődleges képességkategóriák

| Érték | Megjelenítendő címke |
|---|---|
| `user-interface-dashboards` | Felhasználói felület és irányítópultok |
| `memory-rag` | Memória és RAG |
| `search-research` | Keresés és kutatás |
| `coding-developer-tools` | Kódolás és fejlesztői eszközök |
| `browser-automation` | Böngésző és automatizálás |
| `vision-audio-multimodal` | Látás, hang és multimédia |
| `sessions-productivity` | Munkamenetek és produktivitás |
| `security-permissions-approvals` | Biztonság, jogosultságok és jóváhagyások |
| `diagnostics-observability` | Diagnosztika és megfigyelhetőség |
| `models-providers-routing` | Modellek, szolgáltatók és útválasztás |
| `messaging-notifications` | Üzenetküldés és értesítések |
| `data-external-services` | Adat és külső szolgáltatások |
| `entertainment-customization` | Szórakozás és testreszabás |

Válaszd azt a kategóriát, amely a legjobban képviseli a bővítmény elsődleges feladatát, nem azt,
amely valószínűleg a legnagyobb láthatóságot adja.

## Interfész-címkék

A szabványos interfész-címkék között szerepel a `web-ui`, `sidebar`, `settings`, `tui`, `cli`,
`desktop`, `mobile`, `remote`, `editor`, `headless` és `theme`. További kisbetűs kebab-case
képességcímkék is megengedettek, ha a rögzített eredeti forráson látható bizonyítékot írnak le.

## Repository-hatókör

A `dedicated` értéket csak akkor használd, ha a repository csillagai pontosan a katalogizált
bővítményhez tartoznak. A `monorepo` értéket akkor használd, ha a bővítmény egy subpath vagy
csomag egy szélesebb projekten belül. Egy monorepo-bejegyzésnek a
`popularity.starsPolicy: undefined-parent-repository` és a `popularity.stars: null` értéket kell
használnia.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
