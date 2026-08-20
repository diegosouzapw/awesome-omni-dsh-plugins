# Dokumentacja CLI — `omni-dsh-plugins@1.0.0`

> 🌐 [English](../../CLI.md) · **Polski**

> **Nieoficjalny projekt społecznościowy. Niepowiązany z DeepSeek, nieautoryzowany ani niesponsorowany przez DeepSeek.**
> Nazwy i znaki DeepSeek należą do ich odpowiedniego właściciela.

Ta strona dokumentuje opublikowane CLI dokładnie tak, jak zachowuje się ono w wersji `1.0.0`. Każdy zarys składni i flaga poniżej pochodzą z własnego wyjścia `--help` opublikowanego polecenia; nic tutaj nie opisuje niewydanego zachowania. CLI jest utrzymywane z prywatnego źródła i wydawane do npm jako zakresowany pakiet [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins).

```bash
npx omni-dsh-plugins --help
```

## Zasady projektowe w v1.0.0

- **Domyślnie tylko do odczytu.** `catalog`, `search`, `info`, `list` i `doctor` nigdy nie modyfikują profili, nie zapisują plików ani nie uruchamiają kodu wtyczek.
- **Bramka zgody na wykonanie kodu.** `add`, `update` i `remove` odmawiają uruchomienia kodu cyklu życia DSH/pnpm, chyba że przekażesz `--allow-code-execution`. Bez tego użyj `--dry-run`, aby zobaczyć zweryfikowany plan.
- **Natywna polityka Windows.** Natywne `add`/`update`/`remove` w Windows z wykonaniem kodu są wyłączone w v1.0.0; użyj WSL. Dry-run oraz polecenia tylko do odczytu pozostają dostępne, a natywne znaczniki odzyskiwania w Windows wymagają udokumentowanego ręcznego odzyskiwania.
- **Przypięte dane wejściowe.** Wejście katalogu może być lokalnym katalogiem, plikiem snapshotu lub przypiętym publicznym URL-em snapshotu, opcjonalnie zablokowanym do dokładnej 40-znakowej rewizji.

## Wspólne opcje

Te opcje występują w poleceniach korzystających z katalogu (`catalog validate`, `search`, `info`, `add`, `update`, `remove`, `doctor`):

| Opcja                    | Znaczenie                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Lokalny katalog, plik snapshotu lub przypięty publiczny URL snapshotu |
| `--revision <sha>`        | Dokładna 40-znakowa rewizja snapshotu                               |
| `--json`                  | Zwraca stabilne wyjście JSON                                        |

Opcje globalne: `-V, --version` wypisuje wersję CLI; `-h, --help` wypisuje pomoc dla dowolnego polecenia (działa też `dsh-plugins help [command]`).

## Kody wyjścia

CLI używa konwencjonalnych kodów wyjścia procesu:

| Kod wyjścia | Znaczenie                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Sukces (w tym wyniki „puste, ale prawidłowe”, np. pusty katalog)     |
| `1`       | Niepowodzenie: błąd walidacji, wpis nie znaleziony, brak wymaganej opcji, lub sprawdzenie diagnostyczne zgłaszające błąd |

Przykłady zaobserwowane w v1.0.0: `catalog validate` na prawidłowym, pustym katalogu kończy się kodem `0` z komunikatem `0 entries valid; catalog is empty`; `info <unknown-id>` kończy się kodem `1` z komunikatem `Plugin not found`; `doctor` kończy się kodem `1`, gdy dowolne sprawdzenie (na przykład brakujący plik wykonywalny `dsh`) zgłasza błąd.

## Polecenia

### `catalog` — walidacja publicznych powierzchni katalogu

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — waliduje YAML katalogu i semantykę: bezpieczne parsowanie YAML, publiczny schemat, parsowanie wyrażeń SPDX, dokładny SemVer, SHA-512 SRI oraz odrzucanie duplikatów ID / kluczy node-repozytorium-plus-podścieżka. Jest lokalne i tylko do odczytu: nie łączy się z GitHubem, nie rozstrzyga tożsamości repozytorium ani nie sprawdza dowodów w przypiętym commicie. To dokładnie to polecenie, które zadanie CI `catalog-validation` uruchamia przy każdym pull requeście dotyczącym katalogu.
- **`catalog docs-check [root]`** — sprawdza, czy wymagana publiczna dokumentacja katalogu istnieje i czy ogrodzenia Markdown są zbalansowane.
- **`catalog github-forms-check [root]`** — sprawdza ustrukturyzowane publiczne formularze issue na GitHubie (claim, correction, removal).

```bash
# Z katalogu głównego repozytorium:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — lokalne przeszukiwanie publicznych pól katalogu

```text
dsh-plugins search [options] <query...>
```

Przeszukuje lokalnie publiczne pola katalogu względem wybranego wejścia katalogu. Wypisuje pasujące wpisy albo `No plugins found.` (kod wyjścia `0`), gdy nic nie pasuje.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — wyszukiwanie wtyczek poza katalogiem

```text
dsh-plugins discover [options] <query...>
```

> **Niedostępne w opublikowanej wersji `1.0.0`.** `discover` pojawia się w `1.0.0`; każde inne polecenie na tej stronie działa z wersją aktualnie dostępną na npm. Uruchomienie go w wersji `@1.0.0` kończy się błędem nieznanego polecenia.

Przeszukuje najpierw wykuratorowany katalog, a następnie — jeśli nie podano `--offline` — żywy temat GitHub `dsh-plugin`, dzięki czemu wtyczka, która nie została jeszcze zgłoszona, jest nadal możliwa do znalezienia. Wyniki z katalogu zawierają dowody, które posiada katalog (przypięty commit, twórca, licencja); wyniki społecznościowe nie zawierają żadnych z nich i są odpowiednio oznaczone, ponieważ nic w nich nie zostało zrecenzowane.

`--limit <n>` ogranicza liczbę wyników na warstwę (domyślnie `8`). `--json` zwraca stabilny kształt maszynowy, który nigdy nie jest lokalizowany.

```bash
npx omni-dsh-plugins@1.0.0 discover memory --catalog .
npx omni-dsh-plugins@1.0.0 discover vision --offline --catalog . --json
```

### `info` — pokaż jeden publiczny wpis katalogu

```text
dsh-plugins info [options] <id>
```

Pokazuje jeden publiczny wpis katalogu według kanonicznego ID wtyczki. Kończy się kodem `1` z komunikatem `Plugin not found: <id>`, gdy ID nie znajduje się w katalogu.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — dodaj jedną wtyczkę z katalogu przez oficjalną delegację DSH

```text
dsh-plugins add [options] <id>
```

| Opcja                                 | Znaczenie                                                            |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `--profile <name>`                     | Profil DSH do zmodyfikowania (w praktyce wymagany; polecenie zwraca błąd bez niego) |
| `--dry-run`                            | Pokaż zweryfikowany plan bez plików i podprocesów               |
| `--allow-code-execution`               | Zgoda na kod cyklu życia DSH/pnpm (natywny Windows wyłączony; użyj WSL) |
| `--catalog` / `--revision` / `--json`  | Wspólne opcje powyżej                                  |

Semantyka dry-run w tej wersji: polecenie rozstrzyga i weryfikuje plan dla przypiętego wpisu i go wypisuje, nie tworząc żadnych plików ani nie uruchamiając żadnych podprocesów. Faktyczna instalacja deleguje do oficjalnego narzędzia DSH i przebiega dalej tylko z `--allow-code-execution`.

```bash
# Tylko podgląd — nic nie jest zapisywane, nic się nie wykonuje:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Prawdziwa instalacja — jawna zgoda na kod cyklu życia:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — zaktualizuj jedną wtyczkę z katalogu przez oficjalną delegację DSH

```text
dsh-plugins update [options] <id>
```

Te same opcje i semantyka zgody co `add`: `--profile <name>`, `--dry-run`, `--allow-code-execution`, plus wspólne opcje katalogu.

### `remove` — usuń jedną wtyczkę zarządzaną przez katalog przez oficjalną delegację DSH

```text
dsh-plugins remove [options] <id>
```

Te same opcje i semantyka zgody co `add`. Usuwane są wyłącznie instalacje zarządzane przez katalog.

### `recover` — odzyskaj zachowaną mutację POSIX

```text
dsh-plugins recover
```

Odzyskuje zachowaną mutację POSIX po przerwanym `add`/`update`/`remove`. Gdy nic nie oczekuje, wypisuje `No mutation recovery is pending.` i kończy się kodem `0`. Natywne odzyskiwanie w Windows pozostaje ręczne, zgodnie z udokumentowaną polityką.

### `list` — wylistuj instalacje zarządzane przez katalog

```text
dsh-plugins list [--profile <name>] [--json]
```

Wypisuje instalacje zarządzane przez katalog bez modyfikowania profili. `--profile <name>` filtruje według profilu DSH. Gdy nie ma żadnych instalacji, wypisuje `No catalog-managed plugins installed.` i kończy się kodem `0`.

### `doctor` — diagnostyka tylko do odczytu

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Uruchamia diagnostykę tylko do odczytu dla Node, DSH, polityki natywnego Windows i katalogu. Każde sprawdzenie zgłasza `ok` lub `error`; dowolny `error` sprawia, że ogólny kod wyjścia to `1`. Przykładowe wyjście na maszynie bez pliku wykonywalnego `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Czego nie dowodzi lokalna walidacja

Zakończone sukcesem uruchomienie `catalog validate` potwierdza wyłącznie strukturę i lokalną semantykę. Nie dowodzi tożsamości zdalnego repozytorium, własności twórcy ani dowodów w przypiętym commicie — maintainerzy stosują te osobne bramki weryfikacji pochodzenia przed każdym scaleniem, jak opisano w [CONTRIBUTING.md](../../CONTRIBUTING.md) i [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
