# Referencia CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Slovenčina**

> **Neoficiálny komunitný projekt. Nie je prepojený s DeepSeek, nie je ním podporovaný ani sponzorovaný.**
> Názvy a značky DeepSeek patria ich príslušnému vlastníkovi.

Táto stránka dokumentuje publikované CLI presne tak, ako sa správa vo verzii `1.0.1`. Každý
prehľad a prepínač nižšie pochádza z vlastného výstupu `--help` publikovaného príkazu; nič tu
nepopisuje nevydané správanie. CLI sa vyvíja v tomto repozitári v priečinku [`cli/`](../../cli)
a vydáva sa na npm ako [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins),
s potvrdením pôvodu (provenance attestation), ktoré každé zostavenie viaže na commit a beh
workflowu, ktorý ho vytvoril.

```bash
npx omni-dsh-plugins --help
```

## Návrhové princípy vo v1.0.1

- **Predvolene len na čítanie.** `catalog`, `search`, `info`, `list` a `doctor` nikdy nemenia
  profily, nezapisujú súbory ani nespúšťajú kód pluginu.
- **Brána súhlasu pre spustenie kódu.** `add`, `update` a `remove` odmietnu spustiť kód životného
  cyklu DSH/pnpm, pokiaľ nezadáte `--allow-code-execution`. Bez neho použite `--dry-run` na
  zobrazenie overeného plánu.
- **Politika natívneho Windows.** Meniace príkazy `add`/`update`/`remove` na natívnom Windows so
  spustením kódu sú vo v1.0.1 zakázané; použite WSL. Skúšobný beh a príkazy len na čítanie zostávajú
  dostupné a značky obnovenia na natívnom Windows vyžadujú zdokumentované manuálne obnovenie.
- **Pripnuté vstupy.** Vstup katalógu môže byť lokálny adresár, súbor snímky alebo pripnutá verejná
  URL snímky, voliteľne uzamknutá na presnú 40-znakovú revíziu.

## Spoločné prepínače

Tieto prepínače sa objavujú pri príkazoch spotrebúvajúcich katalóg (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Prepínač                  | Význam                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokálny adresár katalógu, súbor snímky alebo pripnutá verejná URL snímky |
| `--revision <sha>`        | Presná 40-znaková revízia snímky                               |
| `--json`                  | Vypíše stabilný výstup JSON                                            |

Globálne prepínače: `-V, --version` vypíše verziu CLI; `-h, --help` vypíše nápovedu pre ľubovoľný
príkaz (funguje aj `dsh-plugins help [command]`).

## Návratové kódy

CLI používa konvenčné návratové kódy procesu:

| Návratový kód | Význam                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Úspech (vrátane výsledkov „prázdne, ale platné", napríklad prázdny katalóg)     |
| `1`       | Zlyhanie: validačná chyba, záznam sa nenašiel, chýba povinný prepínač alebo diagnostická kontrola hlási chybu |

Príklady pozorované vo v1.0.1: `catalog validate` nad platným prázdnym katalógom skončí s `0`
a hláškou `0 entries valid; catalog is empty`; `info <unknown-id>` skončí s `1` a hláškou
`Plugin not found`; `doctor` skončí s `1`, keď niektorá kontrola (napríklad chýbajúci spustiteľný
súbor `dsh`) hlási chybu.

## Príkazy

### `catalog` — validácia verejných povrchov katalógu

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validuje YAML a sémantiku katalógu: bezpečné parsovanie YAML, verejnú
  schému, parsovanie SPDX výrazov, presné SemVer, SHA-512 SRI a odmietanie duplicitných ID /
  kanonických kľúčov repozitár-uzol-podcesta. Je lokálny a len na čítanie: nekontaktuje GitHub,
  nedohľadáva identitu repozitára ani nekontroluje dôkazy na pripnutom commite. Toto je presne ten
  príkaz, ktorý CI úloha `catalog-validation` spúšťa pri každom pull requeste katalógu.
- **`catalog docs-check [root]`** — kontroluje, že existuje požadovaná verejná dokumentácia
  katalógu a že Markdown fences sú vyvážené.
- **`catalog github-forms-check [root]`** — kontroluje štruktúrované verejné formuláre GitHub
  issues (nárok, oprava, odstránenie).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — lokálne vyhľadávanie vo verejných poliach katalógu

```text
dsh-plugins search [options] <query...>
```

Lokálne vyhľadáva vo verejných poliach katalógu proti zvolenému vstupu katalógu. Vypíše zodpovedajúce
záznamy, alebo `No plugins found.` (návratový kód `0`), ak nič nezodpovedá.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — hľadanie pluginov mimo katalógu

```text
dsh-plugins discover [options] <query...>
```

> `discover` sa dodáva od `1.0.0`, prvého vydania pod týmto názvom balíka.

Najprv prehľadá kurátorský katalóg a potom — pokiaľ nie je zadané `--offline` — živú tému GitHub
`dsh-plugin`, takže aj plugin, ktorý ešte nebol predložený, zostáva nájditeľný. Výsledky z katalógu
nesú dôkazy, ktoré katalóg uchováva (pripnutý commit, tvorca, licencia); komunitné výsledky nenesú
žiadne a sú tak aj označené, pretože nič z nich nebolo posúdené.

`--limit <n>` obmedzuje počet výsledkov na úroveň (predvolene `8`). `--json` vypisuje stabilný
strojový tvar, ktorý sa nikdy nelokalizuje.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — zobrazenie jedného verejného záznamu katalógu

```text
dsh-plugins info [options] <id>
```

Zobrazí jeden verejný záznam katalógu podľa kanonického ID pluginu. Ak ID nie je v katalógu, skončí
s `1` a hláškou `Plugin not found: <id>`.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — pridanie jedného pluginu katalógu prostredníctvom oficiálnej delegácie DSH

```text
dsh-plugins add [options] <id>
```

| Prepínač                 | Význam                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | DSH profil, ktorý sa má zmeniť (v praxi povinný; bez neho príkaz hlási chybu) |
| `--dry-run`              | Zobrazí overený plán bez súborov alebo podprocesov               |
| `--allow-code-execution` | Súhlas s kódom životného cyklu DSH/pnpm (natívny Windows zakázaný; použite WSL) |
| `--catalog` / `--revision` / `--json` | Spoločné prepínače vyššie                                  |

Sémantika skúšobného behu v tejto verzii: príkaz dohľadá a overí plán pre pripnutý záznam a vypíše
ho, bez vytvorenia súborov a spustenia podprocesov. Skutočná inštalácia sa deleguje na oficiálne
nástroje DSH a pokračuje iba s `--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — aktualizácia jedného pluginu katalógu prostredníctvom oficiálnej delegácie DSH

```text
dsh-plugins update [options] <id>
```

Rovnaké prepínače a sémantika súhlasu ako pri `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus spoločné prepínače katalógu.

### `remove` — odstránenie jedného pluginu spravovaného katalógom prostredníctvom oficiálnej delegácie DSH

```text
dsh-plugins remove [options] <id>
```

Rovnaké prepínače a sémantika súhlasu ako pri `add`. Odstránia sa iba inštalácie spravované
katalógom.

### `recover` — obnovenie podržanej POSIX mutácie

```text
dsh-plugins recover
```

Obnoví podržanú POSIX mutáciu po prerušenom `add`/`update`/`remove`. Ak nič nečaká, vypíše
`No mutation recovery is pending.` a skončí s `0`. Obnovenie na natívnom Windows zostáva manuálne,
podľa zdokumentovanej politiky.

### `list` — zoznam inštalácií spravovaných katalógom

```text
dsh-plugins list [--profile <name>] [--json]
```

Vypíše inštalácie spravované katalógom bez úpravy profilov. `--profile <name>` filtruje podľa DSH
profilu. Ak nie sú žiadne inštalácie, vypíše `No catalog-managed plugins installed.` a skončí s `0`.

### `doctor` — diagnostika len na čítanie

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Spustí diagnostiku Node, DSH, politiky natívneho Windows a katalógu len na čítanie. Každá kontrola
hlási `ok` alebo `error`; ktorékoľvek `error` spôsobí celkový návratový kód `1`. Príklad výstupu na
počítači bez spustiteľného súboru `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Čo lokálna validácia nepreukazuje

Zelený beh `catalog validate` potvrdzuje iba štruktúru a lokálnu sémantiku. Nepreukazuje identitu
vzdialeného repozitára, vlastníctvo tvorcu ani dôkazy na pripnutom commite — tieto samostatné brány
pôvodu uplatňujú správcovia pred každým zlúčením, ako je popísané v
[CONTRIBUTING.md](../../CONTRIBUTING.md) a [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
