# Riferimento dello schema delle voci del catalogo

> 🌐 [English](../../docs/SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Italiano**

> **Progetto comunitario non ufficiale. Non affiliato, approvato o sponsorizzato da DeepSeek.**
> I nomi e i marchi DeepSeek appartengono ai rispettivi proprietari.

Questo è il riferimento campo per campo di
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), il JSON Schema pubblico
(draft 2020-12) che ogni file sotto `catalog/plugins/` deve soddisfare. Il file schema stesso è
la fonte di verità; quando questa pagina e lo schema sono in disaccordo, vince lo schema.

Si applicano due livelli di validazione. Lo schema pubblico impone *forme sicure* delimitate
(pattern e lunghezze che rifiutano valori simili a opzioni o non limitati). Sopra di esso,
`catalog validate` applica parser semantici obbligatori: SemVer esatto per le versioni, SRI
SHA-512 per i valori di integrità, parsing di espressioni SPDX per le licenze, e rifiuto delle
chiavi duplicate. Un valore può corrispondere al pattern dello schema ed essere comunque
rifiutato semanticamente.

Regole di primo livello: la voce è un singolo oggetto YAML, `additionalProperties: false` (i
campi sconosciuti vengono rifiutati), e **tutti** i seguenti campi sono obbligatori.

## Campi di primo livello

| Campo             | Tipo    | Obbligatorio | Riepilogo                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | costante   |   sì    | Deve essere esattamente `1`                                           |
| `id`              | stringa  |   sì    | ID voce in kebab-case minuscolo; deve corrispondere al nome del file        |
| `name`            | stringa  |   sì    | Nome visualizzato, 1–120 caratteri                                |
| `description`     | oggetto  |   sì    | Riepilogo curato in inglese più il suo percorso di evidenza               |
| `unofficial`      | costante   |   sì    | Deve essere esattamente `true`                                        |
| `kind`            | enum    |   sì    | Discriminatore canonico dell'artefatto                            |
| `primaryCategory` | enum    |   sì    | Singola categoria di capacità primaria                            |
| `tags`            | array   |   sì    | Tag univoci in kebab-case minuscolo (può essere vuoto)               |
| `source`          | oggetto  |   sì    | Repository originale, ID nodo, subpath e commit fissato       |
| `creator`         | oggetto  |   sì    | Handle pubblico GitHub del creatore                            |
| `package`         | oggetto  |   sì    | Descrittore di installazione canonico (npm **oppure** sorgente)              |
| `dsh`             | oggetto  |   sì    | Profili DSH e percorso di evidenza dell'integrazione nativa             |
| `repositoryScope` | enum    |   sì    | `dedicated` o `monorepo`                                     |
| `popularity`      | oggetto  |   sì    | Policy sulle stelle e conteggio stelle (condizionato dall'ambito)            |
| `license`         | oggetto  |   sì    | Espressione SPDX della licenza a monte                            |
| `verification`    | oggetto  |   sì    | Stato di verifica, orario del controllo, identità e smoke test      |
| `provenance`      | oggetto  |   sì    | URL pubblici di Discussion/commento o `null`                      |

### `schemaVersion`

Costante `1`. Identifica la versione 1 dello schema pubblico; qualsiasi altro valore non è
valido.

### `id`

Stringa che corrisponde a `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case minuscolo, senza trattini
iniziali/finali o doppi. Secondo [CONTRIBUTING.md](../../CONTRIBUTING.md), il file della voce
deve essere nominato `catalog/plugins/<id>.yaml` con lo stesso valore identico; il validatore
rifiuta una mancata corrispondenza (`id-filename-mismatch`). L'ID deve anche iniziare con il
namespace del creatore: l'handle `creator.github` in minuscolo, con ogni sequenza di caratteri
esterni a `[a-z0-9]` collassata in un singolo `-`, seguito da `-` (`id-creator-prefix`).

### `name`

Nome visualizzato in formato libero, `minLength: 1`, `maxLength: 120`.

### `description`

Oggetto con esattamente due proprietà obbligatorie (nessun'altra consentita):

| Proprietà       | Tipo   | Regole                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | stringa | Riepilogo in inglese, 20–320 caratteri                                    |
| `evidencePath` | stringa | Pattern di percorso relativo nel repository; nessun `/` iniziale, nessuna backslash, nessun segmento `.`/`..` |

Il riepilogo in inglese deve essere curato a partire dal file in `evidencePath` così com'è al
momento di `source.commit` — non copiato da un altro catalogo.

### `unofficial`

Costante `true`. Marcatore leggibile da macchina che indica che la voce non è ufficiale.

### `kind`

L'**unico** discriminatore del tipo di artefatto (non esiste un secondo campo per il tipo di
integrazione). Uno tra:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

I significati e le conseguenze sulla classifica sono definiti in
[docs/CATEGORIES.md](CATEGORIES.md).

### `primaryCategory`

Una delle tredici categorie di capacità:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Le etichette visualizzate e le indicazioni per la scelta sono in
[docs/CATEGORIES.md](CATEGORIES.md).

### `tags`

Array di stringhe univoche, ciascuna corrispondente a `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case
minuscolo). Lo schema non impone un conteggio minimo.

### `source`

Oggetto con esattamente quattro proprietà obbligatorie:

| Proprietà           | Tipo           | Regole                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | stringa         | URL `https://github.com/<owner>/<repo>`; l'owner segue le regole dei nomi utente GitHub, il nome del repo ha 1–100 caratteri, non può essere `.`/`..` né terminare in `.git` |
| `repositoryNodeId` | stringa         | ID nodo del repository GitHub, immutabile e non vuoto                         |
| `subpath`          | stringa o null | Subpath del plugin all'interno del repository (stesso pattern di percorso relativo sicuro di `evidencePath`), oppure `null` per un plugin nella radice del repository |
| `commit`           | stringa         | OID di commit esadecimale completo di 40 caratteri                               |

La validazione del catalogo deve risolvere `repositoryNodeId` e rifiutare una mancata
corrispondenza dell'URL del repository — quella risoluzione è un gate lato maintainer, non parte
del controllo strutturale locale.

### `creator`

Oggetto con una singola proprietà obbligatoria:

| Proprietà | Tipo   | Regole                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | stringa | Nome utente GitHub (1–39 caratteri, regole dell'handle GitHub) |

L'URL del profilo pubblico è sempre derivato come `https://github.com/<handle>`; non viene
memorizzato un secondo campo profilo, quindi i due non possono mai divergere.

### `package`

Il descrittore di installazione canonico. Sono dati, mai un comando shell, e assume
esattamente una tra due forme (`oneOf`):

**Pacchetto npm** — obbligatori `ecosystem`, `name`, `version`; opzionale `integrity`:

| Proprietà    | Tipo  | Regole                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | costante | `npm`                                                                      |
| `name`      | stringa | Forma di nome pacchetto npm (opzionalmente scoped), massimo 214 caratteri                 |
| `version`   | stringa | Forma esatta di versione `x.y.z` (prerelease/build opzionali); gli intervalli sono rifiutati. Il livello semantico richiede inoltre un SemVer esatto e analizzabile |
| `integrity` | stringa | Forma SRI opzionale `sha512-…`, 8–256 caratteri. Il livello semantico deve analizzarla come SRI SHA-512 valida |

**Installazione da sorgente** — obbligatorio solo `ecosystem`:

| Proprietà    | Tipo  | Regole    |
| ----------- | ----- | -------- |
| `ecosystem` | costante | `source` |

Un descrittore sorgente memorizza deliberatamente nient'altro: il repository, il commit e il
subpath sono derivati da `source`, così i valori mutabili non vengono mai duplicati.

### `dsh`

Prova dell'integrazione nativa DSH:

| Proprietà       | Tipo   | Regole                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | array  | Almeno un nome di profilo univoco corrispondente a `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | stringa | Percorso relativo sicuro alla prova di integrazione DSH a `source.commit` |

### `repositoryScope`

`dedicated` (le stelle del repository appartengono a questo esatto plugin) oppure `monorepo`
(il plugin è un subpath o un pacchetto all'interno di un progetto più ampio). Questo valore
determina le regole condizionali di popolarità qui sotto.

### `popularity`

| Proprietà     | Tipo            | Regole                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` o `undefined-parent-repository`  |
| `stars`      | intero o null | Intero non negativo, oppure `null`                      |

Regole condizionali (imposte dai blocchi `allOf` dello schema):

- `repositoryScope: monorepo` **impone** `starsPolicy: undefined-parent-repository` e
  `stars: null`. Le stelle del progetto padre non vengono mai attribuite a un plugin di
  monorepo.
- `repositoryScope: dedicated` **impone** `starsPolicy: exact-repository` e un intero
  `stars >= 0`.

Vedi [docs/RANKING.md](RANKING.md) per come questi valori alimentano il predicato di classifica.

### `license`

| Proprietà | Tipo   | Regole                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | stringa | Forma di espressione SPDX, 2–256 caratteri, senza trattino iniziale          |

Lo schema impone solo una forma di caratteri sicura; la validazione del catalogo deve analizzare
e normalizzare il valore con un vero parser di espressioni SPDX. Registra l'espressione completa
a monte, evidenziata al commit fissato (per esempio `Apache-2.0` o `MIT OR GPL-3.0-only`).

### `verification`

La verifica si applica a `source.commit`. Oggetto con quattro proprietà obbligatorie:

| Proprietà             | Tipo           | Regole                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | stringa         | Timestamp del controllo in formato `date-time`           |
| `repositoryIdentity` | costante          | Deve essere `resolved`                                     |
| `smokeTest`          | oggetto o null | Record dello smoke test, oppure `null` quando non esiste un test qualificante |

Quando presente, `smokeTest` richiede:

| Proprietà        | Tipo   | Regole                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | costante  | `canonical-install-descriptor` — fa riferimento a `package` o alla sorgente fissata senza duplicare valori mutabili |
| `check`         | oggetto | Obbligatori `name` (forma nome pacchetto) e `version` (forma versione esatta) |
| `result`        | costante  | `passed` — uno smoke test fallito non viene registrato come smoke test    |

Regola condizionale: `status: verified` **richiede** un oggetto `smokeTest` non nullo. Le voci
senza prove di smoke test revisionabili usano `status: eligible` e `smokeTest: null`. Nessuno
stato è un avallo o una certificazione di sicurezza — vedi [docs/RANKING.md](RANKING.md).

### `provenance`

Link pubblici di provenienza, ciascuno un URI o `null`:

| Proprietà     | Tipo          | Regole                                            |
| ------------ | ------------- | -------------------------------------------------- |
| `discussion` | stringa o null | URL pubblico della Discussion, quando esiste            |
| `comment`    | stringa o null | URL pubblico del commento, quando esiste               |

## Cosa non controlla lo schema

Lo schema è deliberatamente locale e strutturale. **Non** verifica che il repository esista, che
l'ID nodo corrisponda all'URL, che i percorsi di evidenza esistano al commit fissato, che il
conteggio delle stelle sia accurato, o che il creatore possieda la sorgente. Quei controlli
appartengono ai gate di revisione dei maintainer descritti in
[CONTRIBUTING.md](../../CONTRIBUTING.md) e [docs/GOVERNANCE.md](GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
