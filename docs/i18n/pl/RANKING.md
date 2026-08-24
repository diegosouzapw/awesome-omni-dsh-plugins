# Metodologia rankingu

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Polski**

Rankingi to przejrzyste widoki nad scalonymi publicznymi wpisami katalogu. Nigdy nie używają
ukrytego wyniku łączonego i nigdy nie traktują gwiazdek szerszego projektu nadrzędnego jako
popularności wtyczki.

## Predykat Top Plugins by Stars

Wpis kwalifikuje się tylko wtedy, gdy każdy z poniższych warunków jest prawdziwy:

```text
kind == plugin (kanoniczny dyskryminator natywnego pakietu DSH)
repositoryScope == dedicated
verification.status in [eligible, verified]
repozytorium jest aktywne i niearchiwizowane
gwiazdki należą do dokładnego repozytorium wtyczki
wpis jest scalony w publicznym katalogu
```

Kwalifikujące się wpisy używają `popularity.starsPolicy: exact-repository` oraz nieujemnej
liczby całkowitej w `popularity.stars`. Remisy używają identyfikatora wtyczki bez rozróżniania
wielkości liter jako deterministycznej kolejności wyświetlania; rozstrzygnięcie remisu nie
implikuje różnicy jakości.

`kind` jest jedynym dyskryminatorem typu artefaktu. Schemat celowo nie przechowuje drugiego
rodzaju integracji z DSH, który mógłby mu zaprzeczyć.

## Wyraźne wykluczenia

Wtyczka wewnątrz szerszego monorepo pozostaje kwalifikowalna do katalogu, ale gwiazdki jej
projektu nadrzędnego są niezdefiniowane dla rankingu wtyczek. Musi używać
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` oraz
`popularity.stars: null`. Pojawia się w sekcjach funkcjonalnych i jest wykluczona z każdego
rankingu opartego na gwiazdkach.

Rodziny wtyczek, motywy, skiny, umiejętności, presety, klienci, interfejsy, mostki i szersze
projekty ekosystemu nie pojawiają się w Top Plugins by Stars. Otrzymują osobne sekcje tam, gdzie
istnieją porównywalne dane. Agregatory, marketplace'y, katalogi instalatorów i listy nie są
wpisami katalogu i nie otrzymują sekcji katalogowej.

## Widoki rankingu

Projekt może publikować odrębne widoki dla gwiazdek, wzrostu 24-godzinnego, wzrostu 7-dniowego,
niedawnych aktualizacji, zweryfikowanych instalacji, rodzin wtyczek, motywów i skinów, klientów
i interfejsów oraz integracji ekosystemowych. Każdy widok musi ujawniać własną regułę włączenia
i czas migawki.

Przy zerze kwalifikujących się wpisów Top Plugins nie jest renderowany. Pierwsze kwalifikujące
się scalenie tworzy widok Top Plugins; etykieta zmienia się na Top 10 dopiero po istnieniu
dziesięciu kwalifikujących się wpisów. Nie jest dozwolony żaden ranking zastępczy ani sfabrykowany.

## Weryfikacja nie jest poparciem

`eligible` oznacza, że zwalidowano publiczną strukturę i integrację z DSH. `verified` dodatkowo
oznacza, że smoke test instalacji przeszedł dla przypiętego źródła lub pakietu. Żaden status nie
jest poparciem, gwarancją ani bezwzględną certyfikacją bezpieczeństwa.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
