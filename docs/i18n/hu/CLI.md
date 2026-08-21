# CLI Referencia — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · **Magyar**

> **Nem hivatalos közösségi projekt. Nem áll kapcsolatban a DeepSeekkel, és nem az ő jóváhagyásával vagy támogatásával készült.**
> A DeepSeek nevek és védjegyek a megfelelő tulajdonosaik tulajdonát képezik.

Ez az oldal a publikált CLI-t dokumentálja pontosan úgy, ahogyan a `1.0.0` verzióban viselkedik.
Minden alábbi szinopszis és flag a publikált parancs saját `--help` kimenetéből származik; semmi
itt nem ír le meg nem jelent viselkedést. A CLI privát forrásból van karbantartva, és az npm-re
`omni-dsh-plugins` scope-olt csomagként kerül kiadásra
([`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins)).

```bash
npx omni-dsh-plugins --help
```

## Tervezési elvek a v1.0.1-ban

- **Alapértelmezésben csak olvasható.** A `catalog`, `search`, `info`, `list` és `doctor`
  parancsok soha nem módosítanak profilokat, nem írnak fájlokat, és nem indítanak
  bővítménykódot.
- **Hozzájárulási kapu a kódvégrehajtáshoz.** Az `add`, `update` és `remove` parancsok
  megtagadják a DSH/pnpm életciklus-kód futtatását, hacsak nem adod meg a
  `--allow-code-execution` kapcsolót. Enélkül használd a `--dry-run` kapcsolót az ellenőrzött
  terv megtekintéséhez.
- **Natív Windows-szabályzat.** A natív Windowson futó `add`/`update`/`remove` kódvégrehajtással
  le van tiltva a v1.0.1-ban; használj WSL-t. A dry-run és a csak olvasható parancsok
  elérhetők maradnak, és a natív Windows helyreállítási jelzők dokumentált manuális
  helyreállítást igényelnek.
- **Rögzített bemenetek.** A katalógusbemenet lehet egy helyi könyvtár, egy snapshot-fájl, vagy
  egy rögzített nyilvános snapshot-URL, opcionálisan egy pontos, 40 karakteres revízióhoz
  zárva.

## Közös opciók

Ezek az opciók a katalógust fogyasztó parancsokon jelennek meg (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Opció                     | Jelentés                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Helyi katalógus-könyvtár, snapshot-fájl, vagy rögzített nyilvános snapshot-URL |
| `--revision <sha>`        | Pontos, 40 karakteres snapshot-revízió                              |
| `--json`                  | Stabil JSON-kimenetet ad                                            |

Globális opciók: a `-V, --version` kiírja a CLI verzióját; a `-h, --help` kiírja bármely parancs
súgóját (a `dsh-plugins help [command]` is működik).

## Kilépési kódok

A CLI hagyományos folyamat-kilépési kódokat használ:

| Kilépési kód | Jelentés                                                                   |
| -----------: | -------------------------------------------------------------------------- |
| `0`          | Siker (beleértve az "üres, de érvényes" eredményeket, mint egy üres katalógus) |
| `1`          | Hiba: validációs hiba, nem található bejegyzés, hiányzó kötelező opció, vagy egy diagnosztikai ellenőrzés hibát jelent |

A v1.0.1-nál megfigyelt példák: a `catalog validate` egy érvényes üres katalóguson `0`-val lép
ki, `0 entries valid; catalog is empty` üzenettel; az `info <unknown-id>` `1`-gyel lép ki,
`Plugin not found` üzenettel; a `doctor` `1`-gyel lép ki, ha bármely ellenőrzés (mint egy
hiányzó `dsh` futtatható) hibát jelent.

## Parancsok

### `catalog` — validálja a katalógus nyilvános felületeit

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validálja a katalógus YAML-ját és szemantikáját: biztonságos
  YAML-interpretálás, a nyilvános séma, SPDX-kifejezés-interpretálás, pontos SemVer, SHA-512
  SRI, és a duplikált ID / repository-node-plusz-subpath elutasítása. Helyi és csak olvasható:
  nem lép kapcsolatba a GitHubbal, nem oldja fel a repository-identitást, és nem vizsgálja a
  bizonyítékokat a rögzített commiton. Ez pontosan az a parancs, amelyet a
  `catalog-validation` CI job futtat minden katalógus pull requesten.
- **`catalog docs-check [root]`** — ellenőrzi, hogy a kötelező nyilvános katalógus-dokumentáció
  létezik-e, és hogy a Markdown-kerítések kiegyensúlyozottak-e.
- **`catalog github-forms-check [root]`** — ellenőrzi a strukturált nyilvános GitHub
  issue-űrlapokat (igénylés, korrekció, eltávolítás).

```bash
# A repository gyökeréből:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — nyilvános katalógusmezők helyi keresése

```text
dsh-plugins search [options] <query...>
```

Helyben keres a nyilvános katalógusmezőkben a kiválasztott katalógusbemeneten. Kiírja az
egyező bejegyzéseket, vagy a `No plugins found.` üzenetet (kilépés `0`-val), ha semmi sem
egyezik.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — bővítmények keresése a katalógoson túl

```text
dsh-plugins discover [options] <query...>
```

> **Nincs benne a publikált `1.0.0`-ban.** A `discover` az `1.0.0`-ban jelenik meg; az oldal
> minden más parancsa az npm-en jelenleg elérhető verzióval működik. Ha a `@1.0.0` ellen
> futtatod, ismeretlen paranccsal hibázik.

Először a kurált katalógusban keres, majd — hacsak nem adod meg a `--offline` kapcsolót — az
élő GitHub `dsh-plugin` topicon, így egy még be nem nyújtott bővítmény is megtalálható. A
katalógus-eredmények a katalógus bizonyítékát hordozzák (rögzített commit, alkotó, licenc); a
közösségi eredmények ebből semmit nem hordoznak, és így vannak megjelölve, mert velük
kapcsolatban semmi nem lett átvizsgálva.

A `--limit <n>` korlátozza a szintenkénti eredményeket (alapértelmezett `8`). A `--json` a
stabil gépi formát adja, amely soha nincs lokalizálva.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — egy nyilvános katalógusbejegyzés megjelenítése

```text
dsh-plugins info [options] <id>
```

Megjelenít egy nyilvános katalógusbejegyzést a kanonikus bővítmény-ID alapján. `1`-gyel lép ki,
`Plugin not found: <id>` üzenettel, ha az ID nincs a katalógusban.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — egy katalógus-bővítmény hozzáadása hivatalos DSH-delegáláson keresztül

```text
dsh-plugins add [options] <id>
```

| Opció                    | Jelentés                                                             |
| ------------------------ | -------------------------------------------------------------------- |
| `--profile <name>`       | A módosítandó DSH-profil (gyakorlatban kötelező; a parancs hiba nélküle) |
| `--dry-run`              | Megjeleníti az ellenőrzött tervet fájlok vagy alfolyamatok nélkül     |
| `--allow-code-execution` | Hozzájárulás a DSH/pnpm életciklus-kódhoz (natív Windowson letiltva; használj WSL-t) |
| `--catalog` / `--revision` / `--json` | A fenti közös opciók                                    |

A dry-run szemantikája ebben a verzióban: a parancs feloldja és ellenőrzi a rögzített bejegyzés
tervét, és kiírja azt, fájlok létrehozása és alfolyamatok indítása nélkül. A tényleges telepítés
a hivatalos DSH-eszközökre delegál, és csak a `--allow-code-execution` megadásával folytatódik.

```bash
# Csak előnézet — semmi nem íródik, semmi nem fut:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Valódi telepítés — explicit hozzájárulás az életciklus-kódhoz:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — egy katalógus-bővítmény frissítése hivatalos DSH-delegáláson keresztül

```text
dsh-plugins update [options] <id>
```

Ugyanazok az opciók és hozzájárulási szemantika, mint az `add`-nál: `--profile <name>`,
`--dry-run`, `--allow-code-execution`, plusz a közös katalógusopciók.

### `remove` — egy katalógus által kezelt bővítmény eltávolítása hivatalos DSH-delegáláson keresztül

```text
dsh-plugins remove [options] <id>
```

Ugyanazok az opciók és hozzájárulási szemantika, mint az `add`-nál. Csak a katalógus által
kezelt telepítések kerülnek eltávolításra.

### `recover` — egy megőrzött POSIX-mutáció helyreállítása

```text
dsh-plugins recover
```

Helyreállít egy megőrzött POSIX-mutációt egy megszakított `add`/`update`/`remove` után. Ha
nincs függőben lévő mutáció, kiírja a `No mutation recovery is pending.` üzenetet, és `0`-val
lép ki. A natív Windows-helyreállítás manuális marad, a dokumentált szabályzat szerint.

### `list` — katalógus által kezelt telepítések listázása

```text
dsh-plugins list [--profile <name>] [--json]
```

Felsorolja a katalógus által kezelt telepítéseket a profilok módosítása nélkül. A `--profile
<name>` DSH-profil szerint szűr. Telepítések nélkül kiírja a `No catalog-managed plugins
installed.` üzenetet, és `0`-val lép ki.

### `doctor` — csak olvasható diagnosztika

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Csak olvasható Node-, DSH-, natív Windows-szabályzat- és katalógus-diagnosztikát futtat. Minden
ellenőrzés `ok`-t vagy `error`-t jelent; bármely `error` a teljes kilépési kódot `1`-re
állítja. Példa kimenet egy olyan gépen, amelyen nincs `dsh` futtatható:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Amit a helyi validáció nem bizonyít

Egy zöld `catalog validate` futás csak a struktúrát és a helyi szemantikát erősíti meg. Nem
bizonyítja a távoli repository-identitást, az alkotói tulajdonjogot, vagy a bizonyítékot a
rögzített commiton — a mantenedorok ezeket a külön proveniencia-kapukat alkalmazzák bármely
egyesítés előtt, ahogyan az a [CONTRIBUTING.md](../../CONTRIBUTING.md) és a
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) fájlban le van írva.

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
