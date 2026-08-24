# Katalógus-irányítás

> 🌐 [English](../../GOVERNANCE.md) · [Português (Brasil)](../pt-BR/GOVERNANCE.md) · [中文（简体）](../zh-CN/GOVERNANCE.md) · **Magyar**

> **Nem hivatalos közösségi projekt. Nem áll kapcsolatban a DeepSeekkel, és nem az ő jóváhagyásával vagy támogatásával készült.**
> A DeepSeek nevek és védjegyek a megfelelő tulajdonosaik tulajdonát képezik.

Hogyan irányítják a nyilvános katalógust: ki dönt arról, mi kerül be, milyen sorrendben
érvényesülnek a versengő hozzájárulások, mely ellenőrzések futnak automatikusan, és mely ítéletek
maradnak emberi kézben. Az itt hivatkozott szabályzatok a [CONTRIBUTING.md](../../CONTRIBUTING.md),
a [docs/CREDIT.md](../../docs/CREDIT.md) és a [docs/RANKING.md](../../docs/RANKING.md) fájlokban találhatók; ez az
oldal azt írja le, hogyan illeszkednek egymáshoz.

## Elvek

1. **Alkotó-elsőbbség.** A katalógus azért létezik, hogy az alkotók munkáját felfedezhetővé
   tegye, soha nem azért, hogy átvegye annak tulajdonjogát. Ugyanahhoz a kanonikus bővítményhez
   egy közvetlen alkotói pull request felülírja bármely nyitott közösségi kurátori vagy
   automatizálási pull requestet — a teljes elsőbbségi sorrend és a Git-identitás-szabályok a
   [docs/CREDIT.md](../../docs/CREDIT.md) fájlban találhatók.
2. **Egy bővítmény, egy átvizsgált pull request.** Nincs köteges egyesítés, nincs generált
   tömeges import a nyilvános katalógusba. Minden bejegyzés kiérdemli a saját átvizsgálását.
3. **Bizonyíték a bizalom helyett.** Minden nyilvános mező az eredeti alkotó repository-jáig
   követhető, egy rögzített commitnál. Egy zöld automatikus ellenőrzés soha nem fogadható el
   eredetbizonyítékként.
4. **Mindig nem hivatalos.** Semmilyen katalógusállapot nem jelenik meg DeepSeek-átvizsgálásként,
   tanúsításként vagy jóváhagyásként.

## Hogyan kerülnek a változások a `main`-re

Minden változás átvizsgált pull requesteken keresztül éri el a `main`-t — közvetlen push nincs. A
default branch működési szabályzata:

- **Csak pull request.** Katalógusbejegyzések, dokumentáció és sémaváltozások mind PR-en
  keresztül kerülnek be; a katalógus-PR-eknek követniük kell a branch-enkénti egy bővítmény
  szabályt a [CONTRIBUTING.md](../../CONTRIBUTING.md) fájlban.
- **Lineáris történelem.** A PR-ek úgy integrálódnak, hogy a `main` lineáris, auditálható
  történelmet tartson fenn; az egyesített nyilvános történelmet nem írják át. Ha egy kurált
  bejegyzés egyesítve lett, mielőtt az alkotó jelentkezett volna, az alkotó egy későbbi
  hozzájárulásban igényli vagy javítja azt, történelem-átírás helyett.
- **Átvizsgálási szálak lezárása.** Az átvizsgálási beszélgetéseket egyesítés előtt lezárják; a
  lezáratlan visszajelzés blokkolja az integrációt.
- **Karbantartói egyesítés.** Csak karbantartó egyesíthet bővítménybejegyzést, és is csak azután,
  hogy a [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Átvizsgálási kapuk, ütközések és egyesítés"
  minden kapuja teljesült az aktuális PR-commiton.

## A `catalog-validation` ellenőrzés

Minden pull request, amely a `catalog/plugins/`, a `schemas/` vagy maga a workflow-hoz nyúl,
lefuttatja a `catalog-validation` jobot (`.github/workflows/validate-catalog.yml`), amely a
publikált CLI-hez van rögzítve:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Mit validál** — csak helyi struktúrát és szemantikát:

- Biztonságos YAML-interpretálás minden bejegyzésen a `catalog/plugins/` alatt.
- Megfelelés a nyilvános sémának (lásd [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX-kifejezés-interpretálás, pontos SemVer-verziók, érvényes SHA-512 SRI-integritásértékek.
- Duplikátum-elutasítás: nincs ismétlődő bejegyzés-ID és nincs ismétlődő kanonikus
  repository-node-plusz-subpath kulcs.
- A szándékosan nulla bejegyzést tartalmazó katalógus átmegy (`0 entries valid; catalog is empty`).

**Mit NEM validál** — és ezért egy zöld ellenőrzés mit soha nem bizonyít:

- Távoli repository-azonosság: nem lép kapcsolatba a GitHubbal, és nem oldja fel a repository
  node ID-ját az URL ellenében.
- Bizonyíték a rögzített commitnál: a leírásokat, licenceket, DSH-integrációt és
  smoke-bizonyítékokat nem tölti le és nem vizsgálja meg.
- Alkotói tulajdonjog, csillagszámok vagy ütközés nyitott pull requestekkel.

Ezek az ítéletek a karbantartók külön eredetiség-kapuihoz tartoznak, amelyeket egyesítés előtt
alkalmaznak, és amelyek a [CONTRIBUTING.md](../../CONTRIBUTING.md) fájlban vannak leírva. A helyi
ellenőrzés a padló, nem a mérce.

## Verifikációs állapotok

A verifikáció bejegyzésenként kerül rögzítésre, annak pontos rögzített commitjára vonatkozóan, a
nyilvános séma által definiált állapotokkal (`eligible`, `verified`, `stale`, `unavailable`,
`archived`, `quarantined`). A két pozitív állapot szándékosan szűk:

- `eligible` — a nyilvános struktúra és a natív DSH-integráció validálva lett.
- `verified` — emellett egy telepítési smoke-teszt sikeresen lefutott a rögzített forráson vagy
  csomagon; a séma megköveteli a smoke-teszt-rekord jelenlétét.

Egyik állapot sem — sem bármely más — jóváhagyás, garancia vagy biztonsági tanúsítvány. A teljes
szemantika, beleértve azt, hogy az állapotok hogyan hatnak a rangsorolásra, a
[docs/RANKING.md](../../docs/RANKING.md) fájlban található; a rekord formája a [docs/SCHEMA.md](../../docs/SCHEMA.md)
fájlban.

## Igénylések, javítások és eltávolítások

A strukturált GitHub issue-űrlapok (`.github/ISSUE_TEMPLATE/`) az irányított út egy olyan
bejegyzés megváltoztatására, amelyet nem te nyújtottál be:

| Űrlap           | Ki használja                              | Eredmény                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Claim**      | Alkotó, akinek a bővítményét valaki más kurálta | A tulajdonjog az eredeti forráshoz kötődik; az alkotó ezután közvetlenül hozzájárulhat |
| **Correction** | Bárki, aki pontatlan nyilvános metaadatot észlel | Átvizsgált javítás az érintett bejegyzéshez             |
| **Removal**    | Alkotó, aki töröltetni szeretné a bejegyzését, vagy szabályszegés bejelentője | Átvizsgált eltávolítás vagy karanténba helyezés |

Szabályok, amelyek mindhárom folyamatra vonatkoznak:

- A tulajdonjogi igényeket verifikálható nyilvános bizonyítékkal kell alátámasztani
  (repository-tulajdonjog, csomagszerzőség, manifeszt-metaadat vagy rögzített forrástörténet) —
  egy Discussion-komment nem alapoz meg alkotóságot ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Egy katalogizált bővítmény biztonsági problémái először a bővítmény saját karbantartójához
  mennek; a katalógus oldal ezután kezeli a korrekciót vagy a karantént, exploit-részletek
  közzététele nélkül ([SECURITY.md](../../SECURITY.md)).
- Soha ne szerepeljenek hitelesítő adatok, privát elérhetőségek vagy más titkok egy űrlapban.

## Szerepek

- **Alkotók** tulajdonolják a bővítményeiket és a bejegyzéseik elsőbbségét. Hozzájárulhatnak
  közvetlenül, jóváhagyhatják a közösségi kurálást, vagy igényelhetik/javíthatják/töröltethetik
  egy meglévő bejegyzésüket.
- **Közösségi hozzájárulók** kurálhatnak bejegyzéseket olyan alkotóknak, akik még nem
  járultak hozzá, a [docs/CREDIT.md](../../docs/CREDIT.md) tiszteletteljes kapcsolatfelvételre és
  jóváírásra vonatkozó szabályai szerint. A kurálás soha nem előz meg egy későbbi közvetlen
  alkotói hozzájárulást.
- **Karbantartók** átvizsgálják, alkalmazzák az eredetiség-kapukat, feloldják az ütközéseket és
  egyesítenek. Ők tartják karban a weboldalt
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) és a publikált CLI-t is
  privát forrásból; ennek a repository-nak a nyilvános adatai, sémája és szabályzatai azok,
  amelyeket ezek a felületek fogyasztanak.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
