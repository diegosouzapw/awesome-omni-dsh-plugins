# Zarządzanie katalogiem

> 🌐 [English](../../docs/GOVERNANCE.md) · **Polski**

> **Nieoficjalny projekt społecznościowy. Niepowiązany z DeepSeek, nieautoryzowany ani niesponsorowany przez DeepSeek.**
> Nazwy i znaki DeepSeek należą do ich właściwego właściciela.

Jak zarządzany jest publiczny katalog: kto decyduje, co trafia na listę, w jakiej kolejności
honorowane są konkurujące ze sobą wkłady, jakie kontrole uruchamiają się automatycznie i jakie
oceny pozostają w gestii ludzi. Zasady, do których się tu odwołujemy, znajdują się w
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) i
[docs/RANKING.md](../../docs/RANKING.md); ta strona opisuje, jak się one ze sobą łączą.

## Zasady

1. **Twórca na pierwszym miejscu.** Katalog istnieje po to, by praca twórców była
   odkrywalna, nigdy po to, by przejąć nad nią własność. Dla tej samej kanonicznej wtyczki
   bezpośredni pull request twórcy ma pierwszeństwo przed każdym otwartym pull requestem
   kuratorstwa społecznościowego lub automatyzacji — pełna kolejność pierwszeństwa i zasady
   tożsamości Git znajdują się w [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Jedna wtyczka, jeden zrecenzowany pull request.** Brak scaleń wsadowych, brak generowanych
   importów masowych do publicznego katalogu. Każdy wpis zdobywa własną recenzję.
3. **Dowód ponad zaufanie.** Każde publiczne pole odsyła do oryginalnego repozytorium twórcy przy
   przypiętym commicie. Zielona automatyczna kontrola nigdy nie jest akceptowana jako dowód
   pochodzenia.
4. **Zawsze nieoficjalny.** Żaden stan katalogu nie jest przedstawiany jako recenzja,
   certyfikacja ani poparcie DeepSeek.

## Jak zmiany trafiają do `main`

Wszystkie zmiany trafiają do `main` poprzez zrecenzowane pull requesty — nie ma bezpośrednich
pushów. Polityka robocza dla gałęzi domyślnej:

- **Tylko pull requesty.** Wpisy katalogu, dokumentacja i zmiany schematu wchodzą wyłącznie
  przez PR; PR-y katalogu muszą przestrzegać zasady jedna-wtyczka-na-gałąź opisanej w
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Historia liniowa.** PR-y są integrowane tak, aby `main` zachowywał liniową, możliwą do
  zaudytowania historię; scalona historia publiczna nie jest przepisywana. Jeśli skuratorowany
  wpis został scalony, zanim zgłosił się twórca, twórca zgłasza roszczenie lub poprawia go w
  kolejnym wkładzie zamiast przepisywać historię.
- **Rozwiązywanie wątków recenzji.** Rozmowy recenzyjne są rozwiązywane przed scaleniem;
  nierozwiązany feedback blokuje integrację.
- **Scalanie przez opiekuna.** Tylko opiekun scala wpis wtyczki, i tylko po tym, jak każda
  bramka w [CONTRIBUTING.md](../../CONTRIBUTING.md) → „Bramki recenzji, kolizje i scalanie"
  przejdzie na aktualnym commicie PR.

## Kontrola `catalog-validation`

Każdy pull request dotykający `catalog/plugins/`, `schemas/` lub samego workflow uruchamia zadanie
`catalog-validation` (`.github/workflows/validate-catalog.yml`), przypięte do opublikowanego
CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Co waliduje** — tylko lokalną strukturę i semantykę:

- Bezpieczne parsowanie YAML każdego wpisu pod `catalog/plugins/`.
- Zgodność z publicznym schematem (zob. [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsowanie wyrażeń SPDX, dokładne wersje SemVer, prawidłowe wartości integralności SRI SHA-512.
- Odrzucanie duplikatów: brak powtarzających się ID wpisów i brak powtarzających się kanonicznych
  kluczy węzeł-repozytorium-plus-podścieżka.
- Zamierzenie pusty katalog przechodzi walidację (`0 entries valid; catalog is empty`).

**Czego NIE waliduje** — a więc czego zielona kontrola nigdy nie dowodzi:

- Tożsamości zdalnego repozytorium: nie kontaktuje się z GitHub ani nie rozwiązuje ID węzła
  repozytorium względem URL.
- Dowodu przy przypiętym commicie: opisy, licencje, integracja z DSH i dowód smoke testu nie są
  pobierane ani sprawdzane.
- Własności twórcy, liczby gwiazdek ani kolizji z otwartymi pull requestami.

Te oceny należą do osobnych bramek pochodzenia opiekunów, stosowanych przed scaleniem i opisanych
w [CONTRIBUTING.md](../../CONTRIBUTING.md). Lokalna kontrola to podłoga, nie sufit.

## Stany weryfikacji

Weryfikacja jest rejestrowana dla każdego wpisu względem jego dokładnie przypiętego commita, przy
użyciu stanów zdefiniowanych w publicznym schemacie (`eligible`, `verified`, `stale`,
`unavailable`, `archived`, `quarantined`). Dwa pozytywne stany są celowo wąskie:

- `eligible` — zwalidowano publiczną strukturę i natywną integrację z DSH.
- `verified` — dodatkowo przeszedł smoke test instalacji dla przypiętego źródła lub pakietu;
  schemat wymaga obecności zapisu smoke testu.

Żaden stan — ani żaden inny — nie jest poparciem, gwarancją ani certyfikacją bezpieczeństwa.
Pełna semantyka, w tym sposób interakcji stanów z rankingiem, znajduje się w
[docs/RANKING.md](../../docs/RANKING.md); kształt zapisu jest w
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Roszczenia, korekty i usunięcia

Ustrukturyzowane formularze zgłoszeń GitHub (`.github/ISSUE_TEMPLATE/`) to zarządzana ścieżka do
zmiany wpisu, którego nie zgłosiłeś/-aś:

| Formularz     | Kto go używa                              | Wynik                                             |
| ------------- | ------------------------------------------ | -------------------------------------------------- |
| **Roszczenie** | Twórca, którego wtyczka została skuratorowana przez kogoś innego | Własność jest wiązana z oryginalnym źródłem; twórca może następnie wnosić wkład bezpośrednio |
| **Korekta**   | Każdy, kto zauważy nieprawidłowe publiczne metadane | Zrecenzowana poprawka dotkniętego wpisu             |
| **Usunięcie** | Twórca, który chce usunięcia swojego wpisu, lub osoba zgłaszająca naruszenie polityki | Zrecenzowane usunięcie lub kwarantanna wpisu |

Zasady obowiązujące dla wszystkich trzech przepływów:

- Roszczenia własności muszą być poparte weryfikowalnym publicznym dowodem (własność
  repozytorium, autorstwo pakietu, metadane manifestu lub historia przypiętego źródła) —
  komentowanie w Discussion nie ustanawia autorstwa
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Problemy z bezpieczeństwem w wtyczce z listy trafiają najpierw do jej własnego opiekuna;
  strona katalogu zajmuje się następnie korektą lub kwarantanną bez publikowania szczegółów
  exploitu ([SECURITY.md](../../SECURITY.md)).
- Nigdy nie umieszczaj poświadczeń, prywatnych danych kontaktowych ani innych sekretów w
  formularzu.

## Role

- **Twórcy** są właścicielami swoich wtyczek i pierwszeństwa swoich wpisów. Mogą wnosić wkład
  bezpośrednio, zatwierdzać kuratorstwo społecznościowe lub zgłaszać roszczenie/poprawiać/usuwać
  istniejący wpis.
- **Współtwórcy społeczności** mogą kuratorować wpisy dla twórców, którzy jeszcze nie wnieśli
  wkładu, zgodnie z zasadami pełnego szacunku kontaktu i uznania w
  [docs/CREDIT.md](../../docs/CREDIT.md). Kuratorstwo nigdy nie przewyższa późniejszego
  bezpośredniego wkładu twórcy.
- **Opiekunowie** recenzują, stosują bramki pochodzenia, rozwiązują kolizje i scalają. Utrzymują
  też stronę internetową
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) oraz opublikowane CLI
  z prywatnego źródła; publiczne dane, schemat i polityki tego repozytorium są tym, co te
  powierzchnie konsumują.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
