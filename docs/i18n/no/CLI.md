# CLI-referanse — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Norsk**

> **Uoffisielt community-prosjekt. Ikke tilknyttet, godkjent av eller sponset av DeepSeek.**
> DeepSeek-navn og -merker tilhører sine respektive eiere.

Denne siden dokumenterer den publiserte CLI-en nøyaktig slik den oppfører seg i versjon
`1.0.1`. Hver synopsis og hvert flagg nedenfor kommer fra den publiserte kommandoens egen
`--help`-utdata; ingenting her beskriver ikke-utgitt atferd. CLI-en utvikles i dette
repositoriet under [`cli/`](../../cli) og utgis til npm som
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), med en provenance
attestation som knytter hver build til kommitten og workflow-kjøringen som produserte den.

```bash
npx omni-dsh-plugins --help
```

## Designprinsipper i v1.0.1

- **Skrivebeskyttet som standard.** `catalog`, `search`, `info`, `list` og `doctor` endrer
  aldri profiler, skriver filer eller starter pluginkode.
- **Samtykkesperre for kodekjøring.** `add`, `update` og `remove` nekter å kjøre
  DSH/pnpm-livssykluskode med mindre du sender `--allow-code-execution`. Uten den, bruk
  `--dry-run` for å se den verifiserte planen.
- **Nativ Windows-policy.** Nativ Windows `add`/`update`/`remove` med kodekjøring er
  deaktivert i v1.0.1; bruk WSL. Dry-run og de skrivebeskyttede kommandoene forblir
  tilgjengelige, og native Windows-gjenopprettingsmarkører krever dokumentert manuell
  gjenoppretting.
- **Fastpinnede inndata.** Kataloginndata kan være en lokal katalog, en snapshot-fil eller en
  fastpinnet offentlig snapshot-URL, valgfritt låst til en eksakt 40-tegns revisjon.

## Vanlige opsjoner

Disse opsjonene finnes på katalogkonsumerende kommandoer (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Opsjon                    | Betydning                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokal katalogmappe, snapshot-fil eller fastpinnet offentlig snapshot-URL |
| `--revision <sha>`        | Eksakt 40-tegns snapshot-revisjon                               |
| `--json`                  | Avgi stabil JSON-utdata                                            |

Globale opsjoner: `-V, --version` skriver ut CLI-versjonen; `-h, --help` skriver ut hjelp for
enhver kommando (`dsh-plugins help [command]` fungerer også).

## Avslutningskoder

CLI-en bruker konvensjonelle prosessavslutningskoder:

| Avslutningskode | Betydning                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Suksess (inkludert «tomme men gyldige» resultater, som en tom katalog)     |
| `1`       | Feil: valideringsfeil, oppføring ikke funnet, manglende påkrevd opsjon, eller en diagnostikksjekk som rapporterer en feil |

Eksempler observert med v1.0.1: `catalog validate` på en gyldig tom katalog avslutter med `0`
med `0 entries valid; catalog is empty`; `info <unknown-id>` avslutter med `1` med
`Plugin not found`; `doctor` avslutter med `1` når noen sjekk (som en manglende
`dsh`-kjørbar fil) rapporterer en feil.

## Kommandoer

### `catalog` — valider de offentlige katalogoverflatene

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validerer katalog-YAML og semantikk: sikker YAML-parsing, det
  offentlige skjemaet, SPDX-uttrykks-parsing, eksakt SemVer, SHA-512 SRI og avvisning av
  duplikate ID-er / repository-node-pluss-understi. Den er lokal og skrivebeskyttet: den
  kontakter ikke GitHub, løser ikke repositorieidentitet og inspiserer ikke bevis ved den
  fastpinnede kommitten. Dette er den nøyaktige kommandoen CI-jobben `catalog-validation`
  kjører på hver katalog-pull-request.
- **`catalog docs-check [root]`** — sjekker at den påkrevde offentlige katalogdokumentasjonen
  finnes og at Markdown-fences er balanserte.
- **`catalog github-forms-check [root]`** — sjekker de strukturerte offentlige GitHub-issue-
  skjemaene (claim, correction, removal).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — søk i offentlige katalogfelt lokalt

```text
dsh-plugins search [options] <query...>
```

Søker i offentlige katalogfelt lokalt mot de valte kataloginndataene. Skriver ut samsvarende
oppføringer, eller `No plugins found.` (avslutning `0`) når ingenting samsvarer.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — finn plugins utenfor katalogen

```text
dsh-plugins discover [options] <query...>
```

> `discover` følger med i `1.0.0`, den første utgivelsen under dette pakkenavnet.

Søker først i den kuraterte katalogen, deretter — med mindre `--offline` er gitt — det levende
GitHub-`dsh-plugin`-topic-et, slik at en plugin som ennå ikke er sendt inn, fortsatt kan
finnes. Katalogresultater bærer bevisene katalogen har (fastpinnet kommit, skaper, lisens);
fellesskapsresultater bærer ingen av dem og er merket som sådanne, fordi ingenting om dem er
gjennomgått.

`--limit <n>` begrenser resultater per nivå (standard `8`). `--json` avgir den stabile
maskinformen, som aldri lokaliseres.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — vis én offentlig katalogoppføring

```text
dsh-plugins info [options] <id>
```

Viser én offentlig katalogoppføring etter kanonisk plugin-ID. Avslutter med `1` med
`Plugin not found: <id>` når ID-en ikke finnes i katalogen.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — legg til én katalogplugin gjennom offisiell DSH-delegering

```text
dsh-plugins add [options] <id>
```

| Opsjon                   | Betydning                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | DSH-profilen som skal muteres (i praksis påkrevd; kommandoen feiler uten den) |
| `--dry-run`              | Vis den verifiserte planen uten filer eller underprosesser               |
| `--allow-code-execution` | Samtykke til DSH/pnpm-livssykluskode (nativ Windows deaktivert; bruk WSL) |
| `--catalog` / `--revision` / `--json` | Vanlige opsjoner over                                  |

Dry-run-semantikk i denne versjonen: kommandoen løser og verifiserer planen for den
fastpinnede oppføringen og skriver den ut, uten å opprette filer og uten å starte
underprosesser. Selve installasjonen delegeres til offisielle DSH-verktøy og fortsetter bare
med `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — oppdater én katalogplugin gjennom offisiell DSH-delegering

```text
dsh-plugins update [options] <id>
```

Samme opsjoner og samtykkesemantikk som `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, pluss de vanlige katalogopsjonene.

### `remove` — fjern én katalogstyrt plugin gjennom offisiell DSH-delegering

```text
dsh-plugins remove [options] <id>
```

Samme opsjoner og samtykkesemantikk som `add`. Bare katalogstyrte installasjoner fjernes.

### `recover` — gjenopprett en beholdt POSIX-mutasjon

```text
dsh-plugins recover
```

Gjenoppretter en beholdt POSIX-mutasjon etter en avbrutt `add`/`update`/`remove`. Når
ingenting venter, skriver den ut `No mutation recovery is pending.` og avslutter med `0`.
Nativ Windows-gjenoppretting forblir manuell, i henhold til den dokumenterte policyen.

### `list` — list katalogstyrte installasjoner

```text
dsh-plugins list [--profile <name>] [--json]
```

Lister katalogstyrte installasjoner uten å endre profiler. `--profile <name>` filtrerer etter
DSH-profil. Når det ikke finnes installasjoner, skriver den ut
`No catalog-managed plugins installed.` og avslutter med `0`.

### `doctor` — skrivebeskyttet diagnostikk

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Kjører skrivebeskyttet Node-, DSH-, nativ Windows-policy- og katalogdiagnostikk. Hver sjekk
rapporterer `ok` eller `error`; enhver `error` gjør den samlede avslutningskoden til `1`.
Eksempelutdata på en maskin uten den kjørbare `dsh`-filen:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Hva lokal validering ikke beviser

En grønn `catalog validate`-kjøring bekrefter bare struktur og lokal semantikk. Den beviser
ikke ekstern repositorieidentitet, skapereierskap eller bevis ved den fastpinnede kommitten —
vedlikeholderne anvender disse separate opprinnelsesportene før enhver sammenslåing, som
beskrevet i [CONTRIBUTING.md](../../CONTRIBUTING.md) og
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
