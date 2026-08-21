# Współtworzenie

> 🌐 [English](../../CONTRIBUTING.md) · **Polski**

> **Nieoficjalny projekt społecznościowy. Niepowiązany z DeepSeek, nieautoryzowany ani niesponsorowany przez DeepSeek.**
> Nazwy i znaki DeepSeek należą do ich odpowiedniego właściciela.

Dziękujemy za rozwijanie katalogu. Wkład jest zorientowany na twórcę: korzystaj z dowodów pochodzących z oryginalnego repozytorium, zachowuj przypisanie autorstwa i utrzymuj każdy wpis w formie możliwej do niezależnej recenzji. Katalog celowo zaczyna się pusty; żaden wpis nie zostanie zaakceptowany bez własnego, zrecenzowanego pull requestu.

## Zacznij od twórcy

Pull request otwarty bezpośrednio przez twórcę wtyczki lub organizację będącą jej właścicielem jest zawsze preferowany. Jeśli twórca jest gotów wnieść swój wkład, użyj jego gałęzi i pull requestu zamiast odtwarzać jego pracę w gałęzi kuratora lub automatyzacji.

Kuratela społecznościowa jest mile widziana, gdy pomaga twórcy, który nie otworzył jeszcze pull requestu. Nie ustanawia ona jednak własności ani pierwszeństwa nad późniejszym bezpośrednim wkładem twórcy.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Jedna wtyczka na gałąź i pull request

Utwórz dedykowaną gałąź dla jednej wtyczki i otwórz jeden pull request z tej gałęzi. Gałąź i pull request muszą tworzyć lub zmieniać dokładnie jeden plik YAML w `catalog/plugins/`. Nie mieszaj w tej gałęzi ani pull requeście wtyczek, porządkowania dokumentacji, generowanych indeksów ani niepowiązanych prac konserwacyjnych.

ID wpisu i nazwa pliku muszą być tą samą wartością w formacie lowercase kebab-case. Maintainerzy recenzują i scalają każdy pull request dotyczący wtyczki indywidualnie; partia zawierająca wiele wtyczek nie jest dzielona ani scalana częściowo.

## Ustal oryginalne źródło

Każde publiczne pole musi zostać odtworzone na podstawie oryginalnego repozytorium twórcy, pakietu, manifestu, pliku README, licencji lub wydania przypiętego do konkretnego commita. Nie kopiuj tekstu, przypisania kategorii, zrzutów ekranu, rankingu, odznak ani generowanych metadanych z innego katalogu czy agregatora. Link znaleziony w projekcie parasolowym, na marketplace, liście lub w agregatorze jest jedynie tropem, a nie dowodem ani źródłem wtyczki.

Nigdy nie zgłaszaj projektu parasolowego, agregatora, marketplace, katalogu instalatorów ani listy jako wpisu katalogu, nawet jeśli jest on niezależnie instalowalny. Traktuj go wyłącznie jako trop i ustal dla każdej niezależnie instalowalnej wtyczki-dziecka jej faktycznego twórcę i oryginalne repozytorium. Wtyczka znajdująca się w prawdziwym monorepo twórcy może zostać zgłoszona z jej dokładnej podścieżki, ale musi wtedy przestrzegać poniższej polityki gwiazdek dla monorepo.

## Wymagane dowody

Podaj w pull requeście wszystkie poniższe informacje:

- Kanoniczny publiczny URL oryginalnego repozytorium oraz jego niezmienny identyfikator węzła repozytorium. Maintainerzy rozstrzygają node ID i odrzucają niezgodności URL w osobnej bramce weryfikacji pochodzenia.
- Publiczny uchwyt twórcy na GitHubie oraz odpowiadający mu publiczny URL profilu. YAML przechowuje uchwyt tylko raz; URL profilu jest wyprowadzany jako `https://github.com/<handle>`.
- Pełny 40-znakowy OID commita źródłowego oraz dokładną podścieżkę wtyczki, albo `null` dla wtyczki w katalogu głównym repozytorium.
- Ograniczony objętościowo opis w języku angielskim oraz jego ścieżkę dowodową w przypiętym commicie.
- `kind` artefaktu, kategorię główną i tagi wybrane z [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Kompletne, ustalone w łańcuchu upstream wyrażenie licencji SPDX udokumentowane w przypiętym commicie.
- Kanoniczny deskryptor instalacji przypięty do dokładnej wersji npm lub do repozytorium źródłowego, pełnego commita i podścieżki. Deskryptor jest danymi, nigdy poleceniem powłoki.
- Dowód natywnej integracji z DSH oraz jego ścieżkę w przypiętym commicie.
- Istniejący, niewrażliwy dowód smoke testu dla dokładnie tego pinu artefaktu, albo jawną wartość `not run`. Nie instaluj wtyczki ani nie uruchamiaj `preinstall`, `install`, `postinstall`, `prepare` ani innego kodu cyklu życia pakietu/wtyczki wyłącznie w celu przygotowania wkładu do katalogu.
- Dla dedykowanego repozytorium — weryfikowalną liczbę gwiazdek dla dokładnie tego repozytorium wraz z publicznym źródłem i czasem sprawdzenia. Dla wtyczki w monorepo zastosuj wymaganą politykę wartości null poniżej.
- Publiczne pochodzenie z Discussion lub komentarza, jeśli istnieje; w przeciwnym razie użyj `null`.
- Czytelną maszynowo wartość `unofficial: true`.

Jeśli nie istnieje jeszcze kwalifikujący się smoke test, użyj `verification.status: eligible` i `verification.smokeTest: null`. Użyj `verified` tylko wtedy, gdy istnieje recenzowalny dowód smoke testu dla dokładnie tego pinu. Żaden z tych stanów nie jest rekomendacją ani certyfikacją bezpieczeństwa.

Nigdy nie zgłaszaj poświadczeń, ciasteczek, prywatnych adresów e-mail, niepublikowanego kodu źródłowego ani innych sekretów.

## Zasady YAML i schematu

Utwórz `catalog/plugins/<plugin-id>.yaml` i zwaliduj go względem [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Schemat jest źródłem prawdy dla nazw pól i dozwolonych wartości; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) definiuje, jak wybrać pojedynczy `kind` artefaktu, kategorię główną, tagi i zakres repozytorium.

Deskryptor npm musi zawierać prawidłową nazwę pakietu i dokładną wersję. Publiczny schemat odrzuca wartości przypominające opcje oraz nieograniczone, ale nie reimplementuje SemVer ani SRI: walidacja katalogu musi parsować wersję, wymagać dokładnego SemVer i parsować dowolną wartość integrity jako prawidłowe SHA-512 SRI. Deskryptor źródłowy jest związany z `source.repository`, `source.commit` i `source.subpath` bez duplikowania zmiennych wartości źródłowych.

Instalatory muszą używać tablic argumentów, wyłączać wykonywanie w powłoce i umieszczać terminator opcji przed wartościami pozycyjnymi dostarczanymi przez katalog tam, gdzie wywoływane polecenie to obsługuje. Walidacja zgłoszenia nie może wywoływać instalatora ani cyklu życia wtyczki.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` to lokalne, tylko do odczytu sprawdzenie strukturalne i semantyczne. Parsuje bezpieczny YAML, waliduje publiczny schemat, parsuje wyrażenia SPDX, wymaga dokładnego SemVer i prawidłowego SHA-512 SRI oraz odrzuca zduplikowane ID i kanoniczne klucze node-repozytorium-plus-podścieżka. Nie łączy się z GitHubem, nie rozstrzyga tożsamości repozytorium ani nie sprawdza ścieżek dowodowych w przypiętym commicie.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Zanim wpis osiągnie status `eligible`, maintainerzy osobno rozstrzygają kanoniczne repozytorium i node ID, wiążą twórcę z oryginalnym źródłem oraz sprawdzają zadeklarowany opis, licencję, integrację z DSH i dowód smoke testu przy `source.commit`. Lokalny wynik walidacji zakończony sukcesem nie jest dowodem pochodzenia ani autentyczności źródła.

## Gwiazdki repozytorium

Rejestrować można wyłącznie gwiazdki, które w sposób weryfikowalny należą do dokładnie tego dedykowanego repozytorium wtyczki. Gwiazdki projektu nadrzędnego nigdy nie mogą być przypisane wtyczce przechowywanej wewnątrz szerszego monorepo. Wpis typu monorepo pozostaje kwalifikowalny do funkcjonalnych sekcji katalogu, ale musi deklarować:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Wpis dedykowany używa `repositoryScope: dedicated`, `starsPolicy: exact-repository` oraz nieujemnej liczby gwiazdek zaobserwowanej w tym samym repozytorium. Przeczytaj [docs/RANKING.md](../../docs/RANKING.md) przed zgłoszeniem danych o popularności.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Pierwszeństwo twórcy i kontakt z szacunkiem

Dla tej samej kanonicznej wtyczki pierwszeństwo wygląda następująco:

1. Pull request otwarty przez twórcę lub organizację będącą właścicielem.
2. Pull request społeczności wyraźnie zatwierdzony przez twórcę.
3. Istniejący, prawidłowy pull request kuratorski społeczności.
4. Pull request automatyzacji katalogu.

Bezpośredni pull request twórcy zastępuje każdy otwarty pull request kuratorski lub automatyzacyjny, niezależnie od tego, który został otwarty jako pierwszy lub jest bardziej zaawansowany. Pull request twórcy staje się wehikułem recenzji; maintainerzy nie wykonują force-push na gałęzi twórcy ani nie przenoszą jego pracy do gałęzi kuratorskiej. Jeśli wpis kuratorski został już scalony, publiczna historia nie jest przepisywana. Twórca może skorzystać z żądania roszczenia lub korekty, a następnie wnieść bezpośrednio kolejny pull request.

Kuratorski pull request powinien zawierać jedno pełne szacunku, publiczne wspomnienie `@twórca` w swoim opisie, obok linku do oryginalnego repozytorium, zapraszające twórcę do recenzji lub zastąpienia go bezpośrednim pull requestem. Nie powtarzaj tego wspomnienia, nie otwieraj promocyjnych issues, nie publikuj krzyżowo, nie wysyłaj niechcianych wiadomości prywatnych ani w inny sposób nie spamuj twórcy.

<!-- creator-first:source-bound-git-identity -->

Pull requesty i commity autorstwa twórcy w naturalny sposób zachowują przypisanie zasług. Commity kuratorskie mogą używać autorstwa Git twórcy lub trailera `Co-authored-by` tylko z tożsamością powiązaną ze źródłem i publicznie weryfikowalną. Nigdy nie wymyślaj ani nie zgaduj adresu e-mail. Gdy nie jest dostępna żadna zweryfikowana tożsamość Git, kurator jest autorem commita i przyznaje jawny kredyt „Created by @handle” wraz z linkiem do oryginalnego repozytorium w YAML i pull requeście. Konto maintainera lub automatyzacji może być committerem lub zweryfikowanym współautorem, ale nie może zastąpić autorstwa twórcy. Zobacz [docs/CREDIT.md](../../docs/CREDIT.md), aby poznać pełną politykę.

## Polecenia walidacyjne i dostępność

CLI npm jest opublikowane jako `omni-dsh-plugins@1.0.1`, więc poniższe polecenia są już dziś dostępne przez `npx`. Używaj ich dokładnie tak, jak zapisano; współtwórcy nie powinni wymyślać zastępczych poleceń.

Uruchom te polecenia z katalogu głównego repozytorium:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` wykonuje wyłącznie opisane powyżej lokalne sprawdzenia YAML, schematu, SPDX, dokładnego SemVer, SHA-512 SRI i duplikatów, i akceptuje celowo pusty katalog. Nie dowodzi tożsamości zdalnego repozytorium ani dowodu pochodzenia przypiętego źródła. Pozostałe polecenia sprawdzają wymaganą publiczną dokumentację i ustrukturyzowane formularze issue na GitHubie. Pomyślne przejście tych poleceń lokalnie nie łagodzi wymagań dowodowych; maintainerzy nadal stosują każdą odpowiednią bramkę wydania przed scaleniem.

## Bramki recenzji, kolizje i scalanie

Maintainerzy stosują każdą bramkę do bieżącego commita pull requestu przed scaleniem:

1. **Zakres:** jedna dedykowana gałąź, jeden plik YAML wtyczki i brak niepowiązanych zmian.
2. **Tożsamość oryginalna:** twórca, kanoniczne repozytorium, node ID, pełny commit i podścieżka są zgodne.
3. **Schemat i dowody:** YAML, kategorie, SPDX, pin instalacji, dowód DSH i status smoke testu są wewnętrznie spójne bez wykonywania kodu cyklu życia wtyczki.
4. **Popularność:** dedykowane gwiazdki są weryfikowalne w dokładnie tym repozytorium, albo gwiazdki monorepo są `null` z `undefined-parent-repository`.
5. **Dokumentacja i formularze:** publiczna dokumentacja, ogrodzenia Markdown i ustrukturyzowane formularze pozostają prawidłowe.
6. **Kolizja i deduplikacja:** żaden scalony wpis ani otwarty pull request nie reprezentuje tej samej kanonicznej wtyczki.

Różne nazwy lub ID nie sprawiają, że zduplikowane wtyczki stają się odrębne. Traktuj ten sam node ID repozytorium i podścieżkę, ten sam kanoniczny pakiet lub inny w sposób oczywisty identyczny cel instalacji jako kolizję. Rozwiąż aliasy i konkurujące pull requesty przed scaleniem. Bezpośredni pull request twórcy wygrywa kolizję z kuratelą lub automatyzacją; w przeciwnym razie maintainerzy wybierają jeden wehikuł recenzji i zamykają lub przekierowują duplikaty zamiast scalać oba.

Tylko maintainer scala wtyczkę po przejściu wszystkich bramek. Każda zaakceptowana wtyczka jest scalana indywidualnie; walidacja, kuratela lub automatyzacja nie implikuje automatycznego ani zbiorczego scalenia.

## Lista kontrolna pull requestu

- [ ] Użyłem/-am jednej dedykowanej gałęzi i ten PR zmienia dokładnie jeden wpis wtyczki.
- [ ] Źródłem jest oryginalne repozytorium twórcy, a nie projekt parasolowy ani agregator.
- [ ] Uchwyt/profil twórcy, repozytorium, node ID, podścieżka i pełny commit są udokumentowane.
- [ ] `kind`, kategoria i tagi są zgodne z `docs/CATEGORIES.md`.
- [ ] Licencja SPDX i przypięty deskryptor instalacji są udokumentowane.
- [ ] Natywna integracja z DSH oraz wynik smoke testu lub status `not run` są udokumentowane.
- [ ] Nie wykonałem/-am kodu cyklu życia wtyczki ani pakietu w celu przygotowania tego wkładu.
- [ ] Dedykowane gwiazdki są weryfikowalne, albo gwiazdki monorepo stosują wymaganą politykę null.
- [ ] Sprawdziłem/-am istnienie wpisu i otwartego pull requestu dla tej samej kanonicznej wtyczki.
- [ ] Wpis jest jawnie oznaczony jako nieoficjalny i nie zawiera sekretów ani prywatnych danych osobowych.

## Polityka językowa

Dokumentacja startowa i opisy w katalogu są wyłącznie w języku angielskim. Wdrożenie obejmujące 43 lokalizacje pozostaje elementem zaległości po MVP; nie dodawaj pustych dokumentów lokalizacyjnych ani automatycznych masowych tłumaczeń.

<!-- i18n-source-hash: 54fa0daef6ededc936a6f681d0cbe7463ec4080757d199e691824dfdc8b388f4 -->
