# Referenční příručka CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Čeština**

> **Neoficiální komunitní projekt. Není přidružen k DeepSeek, DeepSeek jej neschvaluje ani nesponzoruje.**
> Názvy a značky DeepSeek náleží jejich příslušným vlastníkům.

Tato stránka dokumentuje publikované CLI přesně tak, jak se chová ve verzi `1.0.1`. Každá
synopse a přepínač níže pochází přímo z výstupu `--help` publikovaného příkazu; nic zde nepopisuje
nevydané chování. CLI je vyvíjeno v tomto repozitáři pod [`cli/`](../../cli) a vydáváno do npm
jako [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), s attestací původu
(provenance), která každé sestavení váže na commit a běh workflow, které jej vytvořily.

```bash
npx omni-dsh-plugins --help
```

## Návrhové principy ve v1.0.1

- **Ve výchozím stavu pouze pro čtení.** `catalog`, `search`, `info`, `list` a `doctor` nikdy
  neupravují profily, nezapisují soubory ani nespouštějí kód pluginu.
- **Brána souhlasu pro spouštění kódu.** `add`, `update` a `remove` odmítnou spustit kód
  životního cyklu DSH/pnpm, pokud nepředáte `--allow-code-execution`. Bez toho použijte
  `--dry-run` k zobrazení ověřeného plánu.
- **Politika pro nativní Windows.** Nativní Windows `add`/`update`/`remove` se spouštěním kódu
  jsou ve v1.0.1 zakázány; použijte WSL. Dry-run a příkazy pouze pro čtení zůstávají dostupné a
  markery obnovy pro nativní Windows vyžadují dokumentovanou ruční obnovu.
- **Fixované vstupy.** Vstup katalogu může být lokální adresář, soubor snapshotu, nebo fixovaná
  veřejná URL snapshotu, volitelně uzamčená na přesnou 40znakovou revizi.

## Společné volby

Tyto volby se objevují u příkazů, které konzumují katalog (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Volba                     | Význam                                                             |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokální adresář katalogu, soubor snapshotu, nebo fixovaná veřejná URL snapshotu |
| `--revision <sha>`        | Přesná 40znaková revize snapshotu                                  |
| `--json`                  | Vypíše stabilní JSON výstup                                        |

Globální volby: `-V, --version` vypíše verzi CLI; `-h, --help` vypíše nápovědu pro libovolný
příkaz (funguje i `dsh-plugins help [command]`).

## Návratové kódy

CLI používá konvenční návratové kódy procesu:

| Návratový kód | Význam                                                                     |
| ------------: | --------------------------------------------------------------------------- |
| `0`           | Úspěch (včetně výsledků „prázdné, ale platné“, jako je prázdný katalog)    |
| `1`           | Selhání: chyba validace, záznam nenalezen, chybí povinná volba, nebo diagnostická kontrola hlásí chybu |

Příklady pozorované u v1.0.1: `catalog validate` na platném prázdném katalogu skončí s `0` a
hlášením `0 entries valid; catalog is empty`; `info <unknown-id>` skončí s `1` a hlášením
`Plugin not found`; `doctor` skončí s `1`, pokud jakákoli kontrola (například chybějící
spustitelný soubor `dsh`) hlásí chybu.

## Příkazy

### `catalog` — validuje veřejné povrchy katalogu

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validuje YAML a sémantiku katalogu: bezpečné parsování YAML,
  veřejné schéma, parsování výrazu SPDX, přesný SemVer, SHA-512 SRI a odmítnutí duplicitního
  ID / kombinace uzel-repozitáře-plus-podcesta. Je lokální a pouze pro čtení: nekontaktuje
  GitHub, neřeší identitu repozitáře ani nekontroluje důkazy ve fixovaném commitu. Toto je
  přesně příkaz, který spouští CI job `catalog-validation` u každého pull requestu s katalogem.
- **`catalog docs-check [root]`** — kontroluje, že existuje požadovaná veřejná dokumentace
  katalogu a že jsou vyvážená ohraničení Markdown (fences).
- **`catalog github-forms-check [root]`** — kontroluje strukturované veřejné formuláře GitHub
  issue (nárokování, oprava, odstranění).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — lokálně prohledává veřejná pole katalogu

```text
dsh-plugins search [options] <query...>
```

Lokálně prohledává veřejná pole katalogu proti zvolenému vstupu katalogu. Vypíše odpovídající
záznamy, nebo `No plugins found.` (návratový kód `0`), pokud nic neodpovídá.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — najde pluginy nad rámec katalogu

```text
dsh-plugins discover [options] <query...>
```

> `discover` je dodáváno od verze `1.0.0`, prvního vydání pod tímto názvem balíčku.

Nejprve prohledá kurátorovaný katalog, poté — pokud není zadáno `--offline` — živé téma
(topic) `dsh-plugin` na GitHubu, takže plugin, který ještě nebyl podán, je stále dohledatelný.
Výsledky z katalogu nesou důkazy, které katalog obsahuje (fixovaný commit, tvůrce, licence);
výsledky z komunity žádné z nich nenesou a jsou takto označeny, protože z nich zatím nic
nebylo posouzeno.

`--limit <n>` omezí počet výsledků na úroveň (výchozí `8`). `--json` vypíše stabilní strojový
tvar, který se nikdy nelokalizuje.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — zobrazí jeden veřejný záznam katalogu

```text
dsh-plugins info [options] <id>
```

Zobrazí jeden veřejný záznam katalogu podle kanonického ID pluginu. Skončí s `1` a hlášením
`Plugin not found: <id>`, pokud dané ID není v katalogu.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — přidá jeden plugin z katalogu prostřednictvím oficiální delegace na DSH

```text
dsh-plugins add [options] <id>
```

| Volba                                 | Význam                                                             |
| -------------------------------------- | ------------------------------------------------------------------ |
| `--profile <name>`                     | Profil DSH, který se má upravit (v praxi povinné; bez něj příkaz skončí chybou) |
| `--dry-run`                            | Zobrazí ověřený plán bez souborů nebo subprocesů                   |
| `--allow-code-execution`               | Souhlas s kódem životního cyklu DSH/pnpm (nativní Windows zakázán; použijte WSL) |
| `--catalog` / `--revision` / `--json`  | Společné volby výše                                                |

Sémantika dry-run v této verzi: příkaz vyřeší a ověří plán pro fixovaný záznam a vypíše jej,
aniž by vytvořil soubory nebo spustil subprocesy. Skutečná instalace deleguje na oficiální
nástroje DSH a pokračuje pouze s `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — aktualizuje jeden plugin z katalogu prostřednictvím oficiální delegace na DSH

```text
dsh-plugins update [options] <id>
```

Stejné volby a sémantika souhlasu jako u `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus společné volby katalogu.

### `remove` — odstraní jeden plugin spravovaný katalogem prostřednictvím oficiální delegace na DSH

```text
dsh-plugins remove [options] <id>
```

Stejné volby a sémantika souhlasu jako u `add`. Odstraněny jsou pouze instalace spravované
katalogem.

### `recover` — obnoví zachovanou POSIX mutaci

```text
dsh-plugins recover
```

Obnoví zachovanou POSIX mutaci po přerušeném `add`/`update`/`remove`. Pokud nic nečeká na
vyřízení, vypíše `No mutation recovery is pending.` a skončí s `0`. Obnova pro nativní Windows
zůstává ruční, podle dokumentované politiky.

### `list` — vypíše instalace spravované katalogem

```text
dsh-plugins list [--profile <name>] [--json]
```

Vypíše instalace spravované katalogem, aniž by upravoval profily. `--profile <name>` filtruje
podle profilu DSH. Pokud neexistují žádné instalace, vypíše `No catalog-managed plugins
installed.` a skončí s `0`.

### `doctor` — diagnostika pouze pro čtení

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Spustí diagnostiku pouze pro čtení pro Node, DSH, politiku nativního Windows a katalog. Každá
kontrola hlásí `ok` nebo `error`; jakýkoli `error` způsobí, že celkový návratový kód je `1`.
Příklad výstupu na stroji bez spustitelného souboru `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Co lokální validace neprokazuje

Zelený běh `catalog validate` potvrzuje pouze strukturu a lokální sémantiku. Neprokazuje
identitu vzdáleného repozitáře, vlastnictví tvůrce ani důkaz ve fixovaném commitu — správci
uplatňují tyto samostatné brány pro provenance před jakýmkoli sloučením, jak je popsáno v
[CONTRIBUTING.md](../../CONTRIBUTING.md) a [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
