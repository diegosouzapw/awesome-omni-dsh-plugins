# CLI-referens — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Denna sida dokumenterar det publicerade CLI:t exakt så som det beter sig i version `1.0.1`. Varje
synopsis och flagga nedan kommer från det publicerade kommandots egen `--help`-output; inget här
beskriver opublicerat beteende. CLI:t utvecklas i detta repository under [`cli/`](../../cli) och
släpps till npm som [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) med en
proveniensattestering som binder varje bygge till den commit och det workflow-körning som
producerade det.

```bash
npx omni-dsh-plugins --help
```

## Designprinciper i v1.0.1

- **Skrivskyddat som standard.** `catalog`, `search`, `info`, `list` och `doctor` ändrar aldrig
  profiler, skriver aldrig filer och startar aldrig pluginkod.
- **Samtyckesspärr för kodkörning.** `add`, `update` och `remove` vägrar köra DSH/pnpm-livscykelkod
  om du inte skickar med `--allow-code-execution`. Utan den, använd `--dry-run` för att se den
  verifierade planen.
- **Native Windows-policy.** Native Windows `add`/`update`/`remove` med kodkörning är inaktiverade
  i v1.0.1; använd WSL. Dry-run och de skrivskyddade kommandona förblir tillgängliga, och native
  Windows-återställningsmarkörer kräver dokumenterad manuell återställning.
- **Fastnålade indata.** Katalogindata kan vara en lokal katalog, en snapshot-fil eller en
  fastnålad offentlig snapshot-URL, valfritt låst till en exakt 40-teckens revision.

## Gemensamma optioner

Dessa optioner finns på de katalogkonsumerande kommandona (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Option                    | Betydelse                                                          |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokal katalogmapp, snapshot-fil eller fastnålad offentlig snapshot-URL |
| `--revision <sha>`        | Exakt 40-teckens snapshot-revision                                 |
| `--json`                  | Skriver ut stabil JSON-output                                      |

Globala optioner: `-V, --version` skriver ut CLI-versionen; `-h, --help` skriver ut hjälp för
vilket kommando som helst (`dsh-plugins help [command]` fungerar också).

## Avslutningskoder

CLI:t använder konventionella processavslutningskoder:

| Avslutningskod | Betydelse                                                                |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Framgång (inklusive "tomma men giltiga" resultat som en tom katalog)     |
| `1`       | Fel: valideringsfel, posten hittades inte, obligatorisk option saknas, eller en diagnostikkontroll som rapporterar ett fel |

Exempel observerade med v1.0.1: `catalog validate` på en giltig tom katalog avslutas med `0` och
`0 entries valid; catalog is empty`; `info <unknown-id>` avslutas med `1` och `Plugin not found`;
`doctor` avslutas med `1` när någon kontroll (såsom en saknad körbar `dsh`-fil) rapporterar ett
fel.

## Kommandon

### `catalog` — validera den offentliga katalogens ytor

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validerar katalogens YAML och semantik: säker YAML-parsning, det
  offentliga schemat, SPDX-uttrycksparsning, exakt SemVer, SHA-512 SRI och avvisning av
  dubblett-ID:n / repository-nod-plus-understig. Den är lokal och skrivskyddad: den kontaktar inte
  GitHub, löser inte repository-identitet och inspekterar inte bevis vid den fastnålade commiten.
  Detta är exakt det kommando som CI-jobbet `catalog-validation` kör på varje katalog-pull-request.
- **`catalog docs-check [root]`** — kontrollerar att den nödvändiga offentliga
  katalogdokumentationen finns och att Markdown-kodblock är balanserade.
- **`catalog github-forms-check [root]`** — kontrollerar de strukturerade offentliga
  GitHub-issue-formulären (claim, correction, removal).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — sök i offentliga katalogfält lokalt

```text
dsh-plugins search [options] <query...>
```

Söker i offentliga katalogfält lokalt mot den valda katalogindatan. Skriver ut matchande poster,
eller `No plugins found.` (avslutning `0`) när inget matchar.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — hitta plugins bortom katalogen

```text
dsh-plugins discover [options] <query...>
```

> `discover` skeppas i `1.0.0`, den första utgåvan under detta paketnamn.

Söker först i den kuraterade katalogen, sedan — såvida inte `--offline` anges — i det levande
GitHub-ämnet `dsh-plugin`, så att en plugin som ännu inte har skickats in fortfarande går att
hitta. Katalogresultat bär de bevis som katalogen har (fastnålad commit, skapare, licens);
community-resultat bär inga av dem och är märkta som sådana, eftersom inget om dem har
granskats.

`--limit <n>` begränsar resultat per nivå (standard `8`). `--json` skriver ut den stabila
maskinformen, som aldrig lokaliseras.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — visa en offentlig katalogpost

```text
dsh-plugins info [options] <id>
```

Visar en offentlig katalogpost efter kanoniskt plugin-ID. Avslutas med `1` och
`Plugin not found: <id>` när ID:t inte finns i katalogen.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — lägg till en katalogplugin via officiell DSH-delegering

```text
dsh-plugins add [options] <id>
```

| Option                   | Betydelse                                                          |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | DSH-profil att ändra (i praktiken obligatorisk; kommandot felar utan den) |
| `--dry-run`              | Visa den verifierade planen utan filer eller underprocesser        |
| `--allow-code-execution` | Samtycke till DSH/pnpm-livscykelkod (native Windows inaktiverat; använd WSL) |
| `--catalog` / `--revision` / `--json` | Gemensamma optioner ovan                              |

Dry-run-semantik i denna version: kommandot löser och verifierar planen för den fastnålade posten
och skriver ut den, utan att skapa filer och utan att starta underprocesser. Den faktiska
installationen delegeras till officiella DSH-verktyg och fortsätter endast med
`--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — uppdatera en katalogplugin via officiell DSH-delegering

```text
dsh-plugins update [options] <id>
```

Samma optioner och samtyckesemantik som `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus de gemensamma katalogoptionerna.

### `remove` — ta bort en katalogstyrd plugin via officiell DSH-delegering

```text
dsh-plugins remove [options] <id>
```

Samma optioner och samtyckesemantik som `add`. Endast katalogstyrda installationer tas bort.

### `recover` — återställ en kvarhållen POSIX-mutation

```text
dsh-plugins recover
```

Återställer en kvarhållen POSIX-mutation efter en avbruten `add`/`update`/`remove`. När inget
väntar skriver den `No mutation recovery is pending.` och avslutas med `0`. Native
Windows-återställning förblir manuell, enligt den dokumenterade policyn.

### `list` — lista katalogstyrda installationer

```text
dsh-plugins list [--profile <name>] [--json]
```

Listar katalogstyrda installationer utan att ändra profiler. `--profile <name>` filtrerar efter
DSH-profil. Utan installationer skriver den `No catalog-managed plugins installed.` och avslutas
med `0`.

### `doctor` — skrivskyddad diagnostik

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Kör skrivskyddad Node-, DSH-, native Windows-policy- och katalogdiagnostik. Varje kontroll
rapporterar `ok` eller `error`; varje `error` gör den totala avslutningskoden till `1`. Exempel på
output på en maskin utan den körbara `dsh`-filen:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Vad lokal validering inte bevisar

En grön körning av `catalog validate` bekräftar endast struktur och lokal semantik. Den bevisar
inte fjärrrepository-identitet, skaparens ägandeskap eller bevis vid den fastnålade commiten —
underhållare tillämpar dessa separata proveniensgrindar före varje sammanslagning, enligt
beskrivning i [CONTRIBUTING.md](../../CONTRIBUTING.md) och
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
