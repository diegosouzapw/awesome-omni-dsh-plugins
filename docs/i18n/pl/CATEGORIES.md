# Kategorie katalogu

> 🌐 [English](../../docs/CATEGORIES.md) · **Polski**

Każdy wpis katalogu ma jeden rodzaj artefaktu, jedną główną kategorię możliwości i zero lub
więcej tagów. Kategoria główna decyduje o tym, gdzie wpis się pojawia; tagi umożliwiają
wyszukiwanie między kategoriami bez duplikowania wpisu.

## Rodzaje artefaktów

<!-- catalog-policy:aggregators-never-entries -->

| Wartość | Znaczenie | Rankingowana gwiazdkami jako wtyczka |
|---|---|---:|
| `plugin` | Instalowalny natywny pakiet DSH | Tylko gdy spełniony jest każdy warunek rankingu |
| `plugin-family` | Repozytorium zawierające wiele wtyczek DSH | Nie; osobna sekcja |
| `skin-theme` | Skin UI lub motyw wizualny DSH | Nie; osobna sekcja |
| `skill` | Umiejętność agenta ze wsparciem DSH | Nie |
| `preset-profile` | Profil lub preset DSH | Nie |
| `client-interface` | Klient desktopowy, TUI, edytor lub zdalny | Nie |
| `bridge-adapter` | Integracja z innego produktu do DSH | Nie |
| `ecosystem-project` | Szerszy projekt zawierający integrację z DSH | Nie |

Repozytorium parasolowe, agregator, marketplace, katalog instalatorów lub lista nigdy nie jest
wpisem katalogu, nawet gdy sam agregator jest instalowalny. Może być użyty wyłącznie jako trop.
Podążaj za każdym tropem do niezależnie instalowalnego artefaktu potomnego i rozstrzygnij
faktycznego twórcę, oryginalne repozytorium, pakiet i podścieżkę źródłową tego artefaktu przed
jego zgłoszeniem. Prawdziwe monorepo twórcy może być oryginalnym repozytorium dla wtyczki
potomnej, ale wtyczka potomna musi używać dokładnie tej podścieżki oraz polityki gwiazdek
monorepo.

Pole `kind` jest kanonicznym dyskryminatorem artefaktu DSH. Nie istnieje osobny rodzaj
integracji: `plugin` już oznacza natywny pakiet DSH, podczas gdy `ecosystem-project` już oznacza
szerszy projekt z integracją DSH. Zapobiega to sprzecznym parom klasyfikacji.

## Główne kategorie możliwości

| Wartość | Etykieta wyświetlana |
|---|---|
| `user-interface-dashboards` | Interfejs użytkownika i pulpity |
| `memory-rag` | Pamięć i RAG |
| `search-research` | Wyszukiwanie i badania |
| `coding-developer-tools` | Kodowanie i narzędzia deweloperskie |
| `browser-automation` | Przeglądarka i automatyzacja |
| `vision-audio-multimodal` | Wizja, dźwięk i multimodalność |
| `sessions-productivity` | Sesje i produktywność |
| `security-permissions-approvals` | Bezpieczeństwo, uprawnienia i zatwierdzenia |
| `diagnostics-observability` | Diagnostyka i obserwowalność |
| `models-providers-routing` | Modele, dostawcy i routing |
| `messaging-notifications` | Wiadomości i powiadomienia |
| `data-external-services` | Dane i usługi zewnętrzne |
| `entertainment-customization` | Rozrywka i personalizacja |

Wybierz kategorię, która najlepiej odzwierciedla główne zadanie wtyczki, a nie kategorię
najprawdopodobniej zwiększającą widoczność.

## Tagi interfejsu

Standardowe tagi interfejsu obejmują `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` i `theme`. Dodatkowe tagi możliwości w formacie
kebab-case małymi literami są dozwolone, gdy opisują dowód widoczny w przypiętym źródle
oryginalnym.

## Zakres repozytorium

Używaj `dedicated` tylko wtedy, gdy gwiazdki repozytorium należą dokładnie do skatalogowanej
wtyczki. Używaj `monorepo`, gdy wtyczka jest podścieżką lub pakietem wewnątrz szerszego projektu.
Wpis monorepo musi używać `popularity.starsPolicy: undefined-parent-repository` oraz
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
