# CLI-referentie — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Nederlands**

> **Onofficieel communityproject. Niet verbonden aan, goedgekeurd door of gesponsord door DeepSeek.**
> DeepSeek-namen en -merken zijn eigendom van hun respectieve eigenaar.

Deze pagina documenteert de gepubliceerde CLI precies zoals die zich gedraagt in versie
`1.0.1`. Elke synopsis en vlag hieronder komt uit de eigen `--help`-uitvoer van het
gepubliceerde commando; niets hier beschrijft niet-uitgebracht gedrag. De CLI wordt ontwikkeld
in deze repository onder [`cli/`](../../cli) en uitgebracht naar npm als
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), met een
herkomstattestatie die elke build koppelt aan de commit en workflowrun die deze heeft
geproduceerd.

```bash
npx omni-dsh-plugins --help
```

## Ontwerpprincipes in v1.0.1

- **Standaard alleen-lezen.** `catalog`, `search`, `info`, `list` en `doctor` wijzigen nooit
  profielen, schrijven geen bestanden en starten geen pluginscode.
- **Toestemmingscontrole voor codeuitvoering.** `add`, `update` en `remove` weigeren
  DSH/pnpm-levenscycluscode uit te voeren tenzij u `--allow-code-execution` opgeeft. Gebruik
  zonder dit `--dry-run` om het geverifieerde plan te zien.
- **Beleid voor nativief Windows.** Nativief Windows `add`/`update`/`remove` met codeuitvoering
  is uitgeschakeld in v1.0.1; gebruik WSL. Dry-run en de alleen-lezen-commando's blijven overal
  beschikbaar, en herstelmarkeringen op nativief Windows vereisen gedocumenteerd handmatig
  herstel.
- **Vastgepinde invoer.** Catalogusinvoer kan een lokale map, een snapshotbestand of een
  vastgepinde publieke snapshot-URL zijn, optioneel vergrendeld op een exacte revisie van 40
  tekens.

## Gemeenschappelijke opties

Deze opties verschijnen op de commando's die de catalogus raadplegen (`catalog validate`,
`search`, `info`, `add`, `update`, `remove`, `doctor`):

| Optie                     | Betekenis                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| `--catalog <path-or-url>` | Lokale catalogusmap, snapshotbestand of vastgepinde publieke snapshot-URL |
| `--revision <sha>`        | Exacte snapshotrevisie van 40 tekens                                    |
| `--json`                  | Geeft stabiele JSON-uitvoer                                             |

Globale opties: `-V, --version` toont de CLI-versie; `-h, --help` toont hulp voor elk commando
(`dsh-plugins help [command]` werkt ook).

## Afsluitcodes

De CLI gebruikt conventionele proces-afsluitcodes:

| Afsluitcode | Betekenis                                                                    |
| ----------: | -------------------------------------------------------------------------- |
| `0`         | Succes (inclusief "leeg maar geldig"-resultaten zoals een lege catalogus)   |
| `1`         | Mislukking: validatiefout, invoer niet gevonden, ontbrekende verplichte optie, of een diagnostische controle die een fout meldt |

Voorbeelden waargenomen bij v1.0.1: `catalog validate` op een geldige lege catalogus sluit af
met `0` en de melding `0 entries valid; catalog is empty`; `info <unknown-id>` sluit af met `1`
en de melding `Plugin not found`; `doctor` sluit af met `1` wanneer een controle (zoals een
ontbrekend `dsh`-uitvoerbaar bestand) een fout meldt.

## Commando's

### `catalog` — de publieke catalogusoppervlakken valideren

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — valideert catalogus-YAML en semantiek: veilige YAML-parsing, het
  publieke schema, SPDX-expressie-parsing, exacte SemVer, SHA-512 SRI, en afwijzing van
  dubbele ID's / repository-node-plus-subpad-combinaties. Het is lokaal en alleen-lezen: het
  benadert GitHub niet, herleidt geen repository-identiteit en inspecteert geen bewijs op de
  vastgepinde commit. Dit is exact het commando dat de CI-taak `catalog-validation` uitvoert
  op elke catalogus-pull-request.
- **`catalog docs-check [root]`** — controleert of de vereiste publieke catalogusdocumentatie
  bestaat en of Markdown-fences in balans zijn.
- **`catalog github-forms-check [root]`** — controleert de gestructureerde publieke
  GitHub-issue-formulieren (claim, correctie, verwijdering).

```bash
# Vanuit de root van de repository:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — publieke catalogusvelden lokaal doorzoeken

```text
dsh-plugins search [options] <query...>
```

Doorzoekt publieke catalogusvelden lokaal tegen de geselecteerde catalogusinvoer. Print
overeenkomende invoeren, of `No plugins found.` (afsluitcode `0`) wanneer niets overeenkomt.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — plugins vinden buiten de catalogus

```text
dsh-plugins discover [options] <query...>
```

> `discover` wordt geleverd in `1.0.0`, de eerste release onder deze packagenaam.

Doorzoekt eerst de gecureerde catalogus, en dan — tenzij `--offline` is opgegeven — het live
GitHub-onderwerp `dsh-plugin`, zodat een plugin die nog niet is ingediend toch vindbaar is.
Catalogusresultaten dragen het bewijs dat de catalogus bevat (vastgepinde commit, maker,
licentie); communityresultaten dragen niets daarvan en worden als zodanig gelabeld, omdat er
niets aan is beoordeeld.

`--limit <n>` begrenst resultaten per laag (standaard `8`). `--json` geeft de stabiele
machinevorm, die nooit gelokaliseerd wordt.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — één publieke catalogusinvoer tonen

```text
dsh-plugins info [options] <id>
```

Toont één publieke catalogusinvoer op canonieke plugin-ID. Sluit af met `1` en
`Plugin not found: <id>` wanneer de ID niet in de catalogus staat.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — één catalogusplugin toevoegen via officiële DSH-delegatie

```text
dsh-plugins add [options] <id>
```

| Optie                     | Betekenis                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| `--profile <name>`        | Te muteren DSH-profiel (in de praktijk verplicht; het commando geeft zonder dit een fout) |
| `--dry-run`               | Toont het geverifieerde plan zonder bestanden of subprocessen           |
| `--allow-code-execution`  | Toestemming voor DSH/pnpm-levenscycluscode (nativief Windows uitgeschakeld; gebruik WSL) |
| `--catalog` / `--revision` / `--json` | Gemeenschappelijke opties hierboven                        |

Dry-run-semantiek in deze versie: het commando herleidt en verifieert het plan voor de
vastgepinde invoer en print dit, zonder bestanden aan te maken of subprocessen te starten. De
werkelijke installatie delegeert naar officiële DSH-tooling en gaat alleen door met
`--allow-code-execution`.

```bash
# Alleen voorbeeld — er wordt niets geschreven, niets uitgevoerd:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Echte installatie — expliciete toestemming voor levenscycluscode:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — één catalogusplugin bijwerken via officiële DSH-delegatie

```text
dsh-plugins update [options] <id>
```

Dezelfde opties en toestemmingssemantiek als `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus de gemeenschappelijke catalogusopties.

### `remove` — één door de catalogus beheerde plugin verwijderen via officiële DSH-delegatie

```text
dsh-plugins remove [options] <id>
```

Dezelfde opties en toestemmingssemantiek als `add`. Alleen door de catalogus beheerde
installaties worden verwijderd.

### `recover` — een behouden POSIX-mutatie herstellen

```text
dsh-plugins recover
```

Herstelt een behouden POSIX-mutatie na een onderbroken `add`/`update`/`remove`. Zonder iets
in behandeling print het `No mutation recovery is pending.` en sluit het af met `0`. Herstel
op nativief Windows blijft handmatig, volgens het gedocumenteerde beleid.

### `list` — door de catalogus beheerde installaties weergeven

```text
dsh-plugins list [--profile <name>] [--json]
```

Geeft door de catalogus beheerde installaties weer zonder profielen te wijzigen.
`--profile <name>` filtert op DSH-profiel. Zonder installaties print het
`No catalog-managed plugins installed.` en sluit het af met `0`.

### `doctor` — alleen-lezen diagnostiek

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Voert alleen-lezen diagnostiek uit voor Node, DSH, het beleid voor nativief Windows en de
catalogus. Elke controle meldt `ok` of `error`; elke `error` maakt de algehele afsluitcode `1`.
Voorbeelduitvoer op een machine zonder het `dsh`-uitvoerbaar bestand:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Wat lokale validatie niet bewijst

Een groene `catalog validate`-run bevestigt alleen structuur en lokale semantiek. Het bewijst
geen identiteit van een extern repository, eigenaarschap van de maker, of bewijs op de
vastgepinde commit — beheerders passen die aparte herkomstcontroles toe vóór elke merge, zoals
beschreven in [CONTRIBUTING.md](../../CONTRIBUTING.md) en
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
