# Dokumentacja schematu wpisu katalogu

> 🌐 [English](../../docs/SCHEMA.md) · **Polski**

> **Nieoficjalny projekt społecznościowy. Niepowiązany z DeepSeek, nieautoryzowany ani niesponsorowany przez DeepSeek.**
> Nazwy i znaki DeepSeek należą do ich odpowiedniego właściciela.

To jest dokumentacja pole po polu dla [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), publicznego schematu JSON Schema (draft 2020-12), który musi spełniać każdy plik w `catalog/plugins/`. Sam plik schematu jest źródłem prawdy; gdy ta strona i schemat są ze sobą niezgodne, wygrywa schemat.

Obowiązują dwie warstwy walidacji. Publiczny schemat wymusza ograniczone *bezpieczne kształty* (wzorce i długości odrzucające wartości przypominające opcje lub nieograniczone). Na tej podstawie `catalog validate` stosuje obowiązkowe parsery semantyczne: dokładny SemVer dla wersji, SHA-512 SRI dla wartości integrity, parsowanie wyrażeń SPDX dla licencji oraz odrzucanie zduplikowanych kluczy. Wartość może pasować do wzorca schematu i mimo to zostać odrzucona semantycznie.

Zasady na najwyższym poziomie: wpis jest pojedynczym obiektem YAML, `additionalProperties: false` (nieznane pola są odrzucane), a **wszystkie** poniższe pola są wymagane.

## Pola najwyższego poziomu

| Pole              | Typ     | Wymagane | Podsumowanie                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------------- |
| `schemaVersion`   | const   |   tak    | Musi być dokładnie `1`                                              |
| `id`              | string  |   tak    | ID wpisu w formacie lowercase kebab-case; musi być zgodne z nazwą pliku |
| `name`            | string  |   tak    | Nazwa wyświetlana, 1–120 znaków                                     |
| `description`     | object  |   tak    | Wykuratorowane angielskie podsumowanie wraz ze ścieżką dowodową     |
| `unofficial`      | const   |   tak    | Musi być dokładnie `true`                                           |
| `kind`            | enum    |   tak    | Kanoniczny dyskryminator artefaktu                                  |
| `primaryCategory` | enum    |   tak    | Pojedyncza główna kategoria możliwości                              |
| `tags`            | array   |   tak    | Unikalne tagi w formacie lowercase kebab-case (może być pusta)      |
| `source`          | object  |   tak    | Oryginalne repozytorium, node ID, podścieżka i przypięty commit     |
| `creator`         | object  |   tak    | Publiczny uchwyt twórcy na GitHubie                                 |
| `package`         | object  |   tak    | Kanoniczny deskryptor instalacji (npm **lub** źródło)                |
| `dsh`             | object  |   tak    | Profile DSH i ścieżka dowodu natywnej integracji                    |
| `repositoryScope` | enum    |   tak    | `dedicated` lub `monorepo`                                          |
| `popularity`      | object  |   tak    | Polityka gwiazdek i liczba gwiazdek (warunkowo zależna od zakresu)   |
| `license`         | object  |   tak    | Licencja SPDX z upstreamu                                           |
| `verification`    | object  |   tak    | Status weryfikacji, czas sprawdzenia, tożsamość i smoke test        |
| `provenance`      | object  |   tak    | URL-e Discussion/komentarza lub `null`                               |

### `schemaVersion`

Stała `1`. Identyfikuje publiczną wersję schematu 1; każda inna wartość jest nieprawidłowa.

### `id`

Ciąg znaków pasujący do `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, bez wiodących/końcowych ani podwójnych myślników. Zgodnie z [CONTRIBUTING.md](../../CONTRIBUTING.md), plik wpisu musi nosić nazwę `catalog/plugins/<id>.yaml` z identyczną wartością; walidator odrzuca niezgodność (`id-filename-mismatch`). Identyfikator musi też zaczynać się od przestrzeni nazw twórcy: uchwytu `creator.github` zapisanego małymi literami, w którym każda seria znaków spoza `[a-z0-9]` jest zwijana do pojedynczego `-`, po którym następuje `-` (`id-creator-prefix`).

### `name`

Dowolna nazwa wyświetlana, `minLength: 1`, `maxLength: 120`.

### `description`

Obiekt z dokładnie dwiema wymaganymi właściwościami (żadne inne nie są dozwolone):

| Właściwość     | Typ    | Zasady                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | Angielskie podsumowanie, 20–320 znaków                                  |
| `evidencePath` | string | Wzorzec względnej ścieżki w repozytorium; bez wiodącego `/`, bez ukośników wstecznych, bez segmentów `.`/`..` |

Angielskie podsumowanie musi zostać wykuratorowane na podstawie pliku pod `evidencePath` w postaci, w jakiej istnieje przy `source.commit` — nie skopiowane z innego katalogu.

### `unofficial`

Stała `true`. Czytelny maszynowo znacznik, że wpis jest nieoficjalny.

### `kind`

**Jedyny** dyskryminator typu artefaktu (nie istnieje drugie pole typu integracji). Jedna z wartości:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Znaczenia i konsekwencje dla rankingu są zdefiniowane w [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Jedna z trzynastu kategorii możliwości:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Etykiety wyświetlane i wskazówki dotyczące wyboru znajdują się w [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Tablica unikalnych ciągów znaków, każdy pasujący do `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab-case). Schemat nie narzuca minimalnej liczby.

### `source`

Obiekt z dokładnie czterema wymaganymi właściwościami:

| Właściwość          | Typ            | Zasady                                                                  |
| ------------------- | -------------- | ------------------------------------------------------------------------ |
| `repository`        | string         | URL w formacie `https://github.com/<owner>/<repo>`; właściciel podlega zasadom nazw użytkownika GitHub, nazwa repozytorium 1–100 znaków, nie może być `.`/`..` ani kończyć się na `.git` |
| `repositoryNodeId`  | string         | Niezmienny identyfikator węzła repozytorium GitHub, niepusty              |
| `subpath`           | string lub null | Podścieżka wtyczki wewnątrz repozytorium (ten sam bezpieczny wzorzec ścieżki względnej co `evidencePath`), lub `null` dla wtyczki w katalogu głównym repozytorium |
| `commit`            | string         | Pełny 40-znakowy szesnastkowy OID commita                               |

Walidacja katalogu musi rozstrzygnąć `repositoryNodeId` i odrzucić niezgodność URL repozytorium — to rozstrzygnięcie jest bramką po stronie maintainera, a nie częścią lokalnego sprawdzenia strukturalnego.

### `creator`

Obiekt z jedną wymaganą właściwością:

| Właściwość | Typ    | Zasady                                                       |
| ---------- | ------ | -------------------------------------------------------------- |
| `github`   | string | Nazwa użytkownika GitHub (1–39 znaków, zasady uchwytu GitHub) |

Publiczny URL profilu jest zawsze wyprowadzany jako `https://github.com/<handle>`; nie jest przechowywane drugie pole profilu, więc te dwie wartości nigdy nie mogą się rozejść.

### `package`

Kanoniczny deskryptor instalacji. Jest danymi, nigdy poleceniem powłoki, i przyjmuje dokładnie jeden z dwóch kształtów (`oneOf`):

**Pakiet npm** — wymagane `ecosystem`, `name`, `version`; opcjonalne `integrity`:

| Właściwość   | Typ    | Zasady                                                                      |
| ------------ | ------ | ----------------------------------------------------------------------------- |
| `ecosystem`  | const  | `npm`                                                                        |
| `name`       | string | Kształt nazwy pakietu npm (opcjonalnie zakresowany), maks. 214 znaków        |
| `version`    | string | Dokładny kształt wersji `x.y.z` (opcjonalny prerelease/build); zakresy są odrzucane. Warstwa semantyczna dodatkowo wymaga parsowalnego, dokładnego SemVer |
| `integrity`  | string | Opcjonalny kształt `sha512-…` SRI, 8–256 znaków. Warstwa semantyczna musi sparsować go jako prawidłowe SHA-512 SRI |

**Instalacja źródłowa** — wymagane tylko `ecosystem`:

| Właściwość   | Typ    | Zasady    |
| ------------ | ------ | --------- |
| `ecosystem`  | const  | `source`  |

Deskryptor źródłowy celowo nie przechowuje niczego więcej: repozytorium, commit i podścieżka są wyprowadzane z `source`, więc zmienne wartości nigdy nie są duplikowane.

### `dsh`

Dowód natywnej integracji z DSH:

| Właściwość     | Typ    | Zasady                                                                    |
| -------------- | ------ | ---------------------------------------------------------------------------- |
| `profiles`     | array  | Co najmniej jedna unikalna nazwa profilu pasująca do `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Bezpieczna względna ścieżka do dowodu integracji DSH przy `source.commit`    |

### `repositoryScope`

`dedicated` (gwiazdki repozytorium należą do dokładnie tej wtyczki) lub `monorepo` (wtyczka jest podścieżką lub pakietem wewnątrz szerszego projektu). Ta wartość steruje poniższymi warunkowymi zasadami popularności.

### `popularity`

| Właściwość    | Typ              | Zasady                                                |
| -------------- | ---------------- | -------------------------------------------------------- |
| `starsPolicy`  | enum              | `exact-repository` lub `undefined-parent-repository`  |
| `stars`        | integer lub null | Nieujemna liczba całkowita, lub `null`                    |

Zasady warunkowe (wymuszane przez bloki `allOf` schematu):

- `repositoryScope: monorepo` **wymusza** `starsPolicy: undefined-parent-repository` i `stars: null`. Gwiazdki projektu nadrzędnego nigdy nie są przypisywane wtyczce w monorepo.
- `repositoryScope: dedicated` **wymusza** `starsPolicy: exact-repository` i całkowitą wartość `stars >= 0`.

Zobacz [docs/RANKING.md](../../docs/RANKING.md), aby dowiedzieć się, jak te wartości zasilają predykat rankingu.

### `license`

| Właściwość | Typ    | Zasady                                                       |
| ---------- | ------ | ---------------------------------------------------------------- |
| `spdx`     | string | Kształt wyrażenia SPDX, 2–256 znaków, bez wiodącego myślnika      |

Schemat wymusza wyłącznie bezpieczny kształt znakowy; walidacja katalogu musi sparsować i znormalizować wartość za pomocą prawdziwego parsera wyrażeń SPDX. Zapisz kompletne wyrażenie z upstreamu udokumentowane w przypiętym commicie (na przykład `Apache-2.0` lub `MIT OR GPL-3.0-only`).

### `verification`

Weryfikacja odnosi się do `source.commit`. Obiekt z czterema wymaganymi właściwościami:

| Właściwość             | Typ            | Zasady                                                                       |
| ---------------------- | -------------- | ------------------------------------------------------------------------------ |
| `status`               | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`            | string         | Znacznik czasu sprawdzenia w formacie `date-time`                             |
| `repositoryIdentity`   | const          | Musi być `resolved`                                                            |
| `smokeTest`            | object lub null | Rekord smoke testu, lub `null`, gdy nie istnieje kwalifikujący się test        |

Gdy jest obecny, `smokeTest` wymaga:

| Właściwość        | Typ    | Zasady                                                                       |
| ------------------ | ------ | -------------------------------------------------------------------------------- |
| `installTarget`    | const  | `canonical-install-descriptor` — odwołuje się do `package` lub przypiętego źródła bez duplikowania zmiennych wartości |
| `check`            | object | Wymagane `name` (kształt nazwy pakietu) i `version` (kształt dokładnej wersji)  |
| `result`           | const  | `passed` — nieudany smoke test nie jest zapisywany jako smoke test              |

Zasada warunkowa: `status: verified` **wymaga** niepustego obiektu `smokeTest`. Wpisy bez recenzowalnego dowodu smoke testu używają `status: eligible` i `smokeTest: null`. Żaden status nie jest rekomendacją ani certyfikacją bezpieczeństwa — zobacz [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Publiczne linki pochodzenia, każdy jako URI lub `null`:

| Właściwość   | Typ            | Zasady                                     |
| ------------ | -------------- | --------------------------------------------- |
| `discussion` | string lub null | Publiczny URL Discussion, jeśli istnieje       |
| `comment`    | string lub null | Publiczny URL komentarza, jeśli istnieje       |

## Czego schemat nie sprawdza

Schemat jest celowo lokalny i strukturalny. **Nie** weryfikuje, czy repozytorium istnieje, czy node ID pasuje do URL, czy ścieżki dowodowe istnieją w przypiętym commicie, czy liczba gwiazdek jest dokładna, ani czy twórca jest właścicielem źródła. Te sprawdzenia należą do bramek recenzji maintainerów opisanych w [CONTRIBUTING.md](../../CONTRIBUTING.md) i [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
