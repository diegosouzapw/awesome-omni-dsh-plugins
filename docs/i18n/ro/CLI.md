# Referință CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · **Română**

> **Proiect comunitar neoficial. Nu este afiliat, susținut sau sponsorizat de DeepSeek.**
> Numele și mărcile DeepSeek aparțin proprietarului lor de drept.

Această pagină documentează CLI-ul publicat exact așa cum se comportă el în versiunea `1.0.1`.
Fiecare synopsis și flag de mai jos provin din ieșirea `--help` a comenzii publicate; nimic de
aici nu descrie comportament nelansat. CLI-ul este dezvoltat în acest repository, sub
[`cli/`](../../cli), și este lansat pe npm ca
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), cu o atestare de proveniență
care leagă fiecare build de commit-ul și de rularea de workflow care l-a produs.

```bash
npx omni-dsh-plugins --help
```

## Principii de design în v1.0.1

- **Read-only implicit.** `catalog`, `search`, `info`, `list` și `doctor` nu modifică niciodată
  profiluri, nu scriu fișiere și nu lansează cod de plugin.
- **Poartă de consimțământ pentru execuția de cod.** `add`, `update` și `remove` refuză să ruleze
  codul de ciclu de viață DSH/pnpm dacă nu adaugi `--allow-code-execution`. Fără el, folosește
  `--dry-run` pentru a vedea planul verificat.
- **Politica nativă Windows.** `add`/`update`/`remove` nativ Windows cu execuție de cod sunt
  dezactivate în v1.0.1; folosește WSL. Dry-run și comenzile read-only rămân disponibile, iar
  marcatoarele de recuperare nativă Windows necesită recuperare manuală documentată.
- **Intrări fixate.** Intrarea de catalog poate fi un director local, un fișier snapshot sau un
  URL public fixat de snapshot, opțional blocat la o revizie exactă de 40 de caractere.

## Opțiuni comune

Aceste opțiuni apar pe comenzile care consumă catalogul (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Opțiune                   | Semnificație                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Director local de catalog, fișier snapshot sau URL public fixat de snapshot |
| `--revision <sha>`        | Revizie exactă de snapshot, 40 de caractere                               |
| `--json`                  | Emite ieșire JSON stabilă                                            |

Opțiuni globale: `-V, --version` afișează versiunea CLI-ului; `-h, --help` afișează ajutorul
pentru orice comandă (`dsh-plugins help [command]` funcționează de asemenea).

## Coduri de ieșire

CLI-ul folosește coduri convenționale de ieșire ale procesului:

| Cod de ieșire | Semnificație                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Succes (inclusiv rezultate „goale dar valide”, precum un catalog gol)     |
| `1`       | Eșec: eroare de validare, intrare negăsită, opțiune obligatorie lipsă, sau o verificare de diagnostic ce raportează o eroare |

Exemple observate cu v1.0.1: `catalog validate` pe un catalog gol valid iese cu `0` și
`0 entries valid; catalog is empty`; `info <unknown-id>` iese cu `1` și `Plugin not found`;
`doctor` iese cu `1` când orice verificare (cum ar fi un executabil `dsh` lipsă) raportează o
eroare.

## Comenzi

### `catalog` — validează suprafețele publice ale catalogului

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validează YAML-ul și semantica catalogului: parsare YAML sigură, schema
  publică, parsarea expresiilor SPDX, SemVer exact, SHA-512 SRI și respingerea ID-urilor duplicate
  / cheilor repository-node-plus-subpath. Este local și read-only: nu contactează GitHub, nu
  rezolvă identitatea repository-ului și nu inspectează dovezile la commit-ul fixat. Aceasta este
  exact comanda pe care o rulează job-ul CI `catalog-validation` pe fiecare pull request de
  catalog.
- **`catalog docs-check [root]`** — verifică existența documentației publice obligatorii a
  catalogului și echilibrul gardurilor Markdown.
- **`catalog github-forms-check [root]`** — verifică formularele publice structurate de issue
  GitHub (revendicare, corectare, eliminare).

```bash
# Din rădăcina repository-ului:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — caută local în câmpurile publice ale catalogului

```text
dsh-plugins search [options] <query...>
```

Caută local în câmpurile publice ale catalogului față de intrarea de catalog selectată. Afișează
intrările corespunzătoare sau `No plugins found.` (ieșire `0`) când nimic nu corespunde.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — găsește pluginuri dincolo de catalog

```text
dsh-plugins discover [options] <query...>
```

> `discover` este livrat în `1.0.0`, prima lansare sub acest nume de pachet.

Caută mai întâi în catalogul curat, apoi — dacă nu este dat `--offline` — în topicul live GitHub
`dsh-plugin`, astfel încât un plugin care nu a fost trimis încă poate fi găsit. Rezultatele din
catalog poartă dovezile pe care le deține catalogul (commit fixat, creator, licență); rezultatele
comunitare nu poartă nimic din acestea și sunt etichetate ca atare, deoarece nimic despre ele nu a
fost revizuit.

`--limit <n>` limitează rezultatele per nivel (implicit `8`). `--json` emite forma stabilă pentru
mașini, care nu este niciodată localizată.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — afișează o intrare publică din catalog

```text
dsh-plugins info [options] <id>
```

Afișează o intrare publică din catalog după ID-ul canonic al pluginului. Iese cu `1` și
`Plugin not found: <id>` când ID-ul nu este în catalog.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — adaugă un plugin din catalog prin delegarea oficială DSH

```text
dsh-plugins add [options] <id>
```

| Opțiune                  | Semnificație                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Profilul DSH de modificat (obligatoriu în practică; comanda dă eroare fără el) |
| `--dry-run`              | Arată planul verificat, fără fișiere sau subprocese               |
| `--allow-code-execution` | Consimțământ pentru codul de ciclu de viață DSH/pnpm (nativ Windows dezactivat; folosește WSL) |
| `--catalog` / `--revision` / `--json` | Opțiunile comune de mai sus                                  |

Semantica dry-run în această versiune: comanda rezolvă și verifică planul pentru intrarea fixată și
îl afișează, fără a crea fișiere și fără a lansa subprocese. Instalarea efectivă deleagă către
tooling-ul oficial DSH și continuă doar cu `--allow-code-execution`.

```bash
# Doar previzualizare — nu se scrie nimic, nimic nu se execută:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Instalare reală — consimțământ explicit pentru codul de ciclu de viață:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — actualizează un plugin din catalog prin delegarea oficială DSH

```text
dsh-plugins update [options] <id>
```

Aceleași opțiuni și semantică de consimțământ ca `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, plus opțiunile comune de catalog.

### `remove` — elimină un plugin gestionat de catalog prin delegarea oficială DSH

```text
dsh-plugins remove [options] <id>
```

Aceleași opțiuni și semantică de consimțământ ca `add`. Doar instalările gestionate de catalog
sunt eliminate.

### `recover` — recuperează o mutație POSIX reținută

```text
dsh-plugins recover
```

Recuperează o mutație POSIX reținută după un `add`/`update`/`remove` întrerupt. Când nu există
nimic în așteptare, afișează `No mutation recovery is pending.` și iese cu `0`. Recuperarea nativă
Windows rămâne manuală, conform politicii documentate.

### `list` — listează instalările gestionate de catalog

```text
dsh-plugins list [--profile <name>] [--json]
```

Listează instalările gestionate de catalog fără a modifica profiluri. `--profile <name>` filtrează
după profilul DSH. Fără instalări, afișează `No catalog-managed plugins installed.` și iese cu `0`.

### `doctor` — diagnostice read-only

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Rulează diagnostice read-only pentru Node, DSH, politica nativă Windows și catalog. Fiecare
verificare raportează `ok` sau `error`; orice `error` face codul global de ieșire `1`. Ieșire de
exemplu pe o mașină fără executabilul `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Ce nu dovedește validarea locală

O rulare verde a `catalog validate` confirmă doar structura și semantica locală. Nu dovedește
identitatea remote a repository-ului, proprietatea creatorului sau dovezile la commit-ul fixat —
întreținătorii aplică acele porți separate de proveniență înainte de orice integrare, așa cum este
descris în [CONTRIBUTING.md](../../CONTRIBUTING.md) și [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
