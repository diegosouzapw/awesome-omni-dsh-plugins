# Riferimento CLI — `omni-dsh-plugins@1.0.0`

> 🌐 [English](../../docs/CLI.md) · **Italiano**

> **Progetto comunitario non ufficiale. Non affiliato, approvato o sponsorizzato da DeepSeek.**
> I nomi e i marchi DeepSeek appartengono ai rispettivi proprietari.

Questa pagina documenta la CLI pubblicata esattamente come si comporta nella versione `1.0.0`.
Ogni sinossi e flag qui sotto proviene dall'output `--help` proprio del comando pubblicato; nulla
qui descrive un comportamento non rilasciato. La CLI è mantenuta a partire da codice sorgente
privato e rilasciata su npm come il pacchetto con scope
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins).

```bash
npx omni-dsh-plugins --help
```

## Principi di design nella v1.0.0

- **Sola lettura per impostazione predefinita.** `catalog`, `search`, `info`, `list` e `doctor`
  non modificano mai i profili, non scrivono file né avviano codice di plugin.
- **Gate di consenso per l'esecuzione di codice.** `add`, `update` e `remove` rifiutano di
  eseguire codice del ciclo di vita del DSH/pnpm a meno che tu non passi
  `--allow-code-execution`. Senza questo flag, usa `--dry-run` per vedere il piano verificato.
- **Policy nativa per Windows.** `add`/`update`/`remove` nativi su Windows con esecuzione di
  codice sono disabilitati nella v1.0.0; usa il WSL. Il dry-run e i comandi in sola lettura
  restano disponibili, e i marcatori di recupero nativi di Windows richiedono un recupero
  manuale documentato.
- **Input fissati.** L'input del catalogo può essere una directory locale, un file di snapshot,
  o un URL di snapshot pubblico fissato, opzionalmente bloccato a una revisione esatta di 40
  caratteri.

## Opzioni comuni

Queste opzioni compaiono nei comandi che consumano il catalogo (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Opzione                    | Significato                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Directory locale del catalogo, file di snapshot, o URL di snapshot pubblico fissato |
| `--revision <sha>`        | Revisione esatta di snapshot con 40 caratteri                      |
| `--json`                  | Emette un output JSON stabile                                      |

Opzioni globali: `-V, --version` stampa la versione della CLI; `-h, --help` stampa la guida di
qualsiasi comando (funziona anche `dsh-plugins help [command]`).

## Codici di uscita

La CLI usa codici di uscita di processo convenzionali:

| Codice di uscita | Significato                                                                |
| ----------------: | -------------------------------------------------------------------------- |
| `0`               | Successo (inclusi i risultati "vuoti ma validi" come un catalogo vuoto)   |
| `1`               | Fallimento: errore di validazione, voce non trovata, opzione obbligatoria mancante, o una verifica diagnostica che segnala un errore |

Esempi osservati con la v1.0.0: `catalog validate` su un catalogo vuoto valido esce con `0` e
`0 entries valid; catalog is empty`; `info <unknown-id>` esce con `1` e `Plugin not found`;
`doctor` esce con `1` quando una qualsiasi verifica (come un eseguibile `dsh` mancante) riporta
un errore.

## Comandi

### `catalog` — valida le superfici pubbliche del catalogo

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — valida lo YAML e la semantica del catalogo: parsing sicuro di YAML,
  lo schema pubblico, parsing di espressioni SPDX, SemVer esatto, SRI SHA-512, e rifiuto di ID
  duplicati / nodo-di-repository-più-subpath. È locale e di sola lettura: non contatta GitHub,
  non risolve l'identità del repository né ispeziona l'evidenza al commit fissato. È esattamente
  il comando che il job CI `catalog-validation` esegue su ogni pull request di catalogo.
- **`catalog docs-check [root]`** — verifica che la documentazione pubblica obbligatoria del
  catalogo esista e che le fence Markdown siano bilanciate.
- **`catalog github-forms-check [root]`** — verifica i formulari pubblici strutturati di issue
  di GitHub (rivendicazione, correzione, rimozione).

```bash
# Dalla radice del repository:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — cerca i campi pubblici del catalogo localmente

```text
dsh-plugins search [options] <query...>
```

Cerca i campi pubblici del catalogo localmente sull'input di catalogo selezionato. Stampa le
voci corrispondenti, oppure `No plugins found.` (uscita `0`) quando nulla corrisponde.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — trova plugin oltre il catalogo

```text
dsh-plugins discover [options] <query...>
```

> **Non presente nella `1.0.0` pubblicata.** `discover` viene rilasciato nella `1.0.0`; ogni
> altro comando in questa pagina funziona con la versione attualmente su npm. Eseguirlo contro
> `@1.0.0` fallisce con un comando sconosciuto.

Cerca prima nel catalogo curato, poi — a meno che non venga fornito `--offline` — nel topic
GitHub `dsh-plugin` live, così un plugin che non è ancora stato inviato resta comunque
trovabile. I risultati del catalogo portano con sé le prove che il catalogo possiede (commit
fissato, creatore, licenza); i risultati della community non ne portano nessuna e sono
etichettati come tali, perché nulla di essi è stato revisionato.

`--limit <n>` limita i risultati per livello (predefinito `8`). `--json` emette la forma stabile
leggibile da macchina, che non viene mai localizzata.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — mostra una voce pubblica del catalogo

```text
dsh-plugins info [options] <id>
```

Mostra una voce pubblica del catalogo tramite l'ID canonico del plugin. Esce con `1` e
`Plugin not found: <id>` quando l'ID non è nel catalogo.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — aggiunge un plugin del catalogo tramite la delega ufficiale al DSH

```text
dsh-plugins add [options] <id>
```

| Opzione                   | Significato                                                         |
| ------------------------ | -------------------------------------------------------------------- |
| `--profile <name>`       | Profilo DSH da modificare (obbligatorio in pratica; il comando fallisce senza) |
| `--dry-run`              | Mostra il piano verificato senza file o sottoprocessi               |
| `--allow-code-execution` | Consenso al codice del ciclo di vita del DSH/pnpm (disabilitato su Windows nativo; usa il WSL) |
| `--catalog` / `--revision` / `--json` | Opzioni comuni sopra                                    |

Semantica del dry-run in questa versione: il comando risolve e verifica il piano per la voce
fissata e lo stampa, senza creare file né avviare sottoprocessi. L'installazione reale delega
agli strumenti ufficiali del DSH e procede solo con `--allow-code-execution`.

```bash
# Solo anteprima — nulla viene scritto, nulla viene eseguito:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Installazione reale — consenso esplicito al codice del ciclo di vita:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — aggiorna un plugin del catalogo tramite la delega ufficiale al DSH

```text
dsh-plugins update [options] <id>
```

Stesse opzioni e stessa semantica di consenso di `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, più le opzioni comuni del catalogo.

### `remove` — rimuove un plugin gestito dal catalogo tramite la delega ufficiale al DSH

```text
dsh-plugins remove [options] <id>
```

Stesse opzioni e stessa semantica di consenso di `add`. Vengono rimosse solo le installazioni
gestite dal catalogo.

### `recover` — recupera una mutazione POSIX trattenuta

```text
dsh-plugins recover
```

Recupera una mutazione POSIX trattenuta dopo un `add`/`update`/`remove` interrotto. Senza nulla
in sospeso, stampa `No mutation recovery is pending.` ed esce con `0`. Il recupero nativo su
Windows resta manuale, secondo la policy documentata.

### `list` — elenca le installazioni gestite dal catalogo

```text
dsh-plugins list [--profile <name>] [--json]
```

Elenca le installazioni gestite dal catalogo senza modificare i profili. `--profile <name>`
filtra per profilo DSH. Senza installazioni, stampa `No catalog-managed plugins installed.` ed
esce con `0`.

### `doctor` — diagnostica in sola lettura

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Esegue diagnostica in sola lettura di Node, DSH, policy nativa di Windows e catalogo. Ogni
verifica riporta `ok` oppure `error`; qualsiasi `error` rende `1` il codice di uscita
complessivo. Esempio di output su una macchina senza l'eseguibile `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Cosa non dimostra la validazione locale

Un'esecuzione verde di `catalog validate` conferma solo la struttura e la semantica locale. Non
dimostra l'identità remota del repository, la proprietà del creatore, o l'evidenza al commit
fissato — i maintainer applicano quei gate di provenienza separati prima di qualsiasi merge,
come descritto in [CONTRIBUTING.md](../../CONTRIBUTING.md) e
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
