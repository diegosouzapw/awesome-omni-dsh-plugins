# Metodika řazení

Žebříčky jsou transparentní pohledy na sloučené veřejné záznamy katalogu. Nikdy nepoužívají
skryté kombinované skóre a nikdy nepovažují hvězdičky širokého nadřazeného projektu za
popularitu pluginu.

## Predikát „Top pluginů podle hvězdiček“

Záznam se kvalifikuje pouze tehdy, když je každá podmínka níže pravdivá:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kvalifikující se záznamy používají `popularity.starsPolicy: exact-repository` a nezáporné celé
číslo v `popularity.stars`. Shody používají ID pluginu bez ohledu na velikost písmen jako
deterministické pořadí zobrazení; rozlišení shody nenaznačuje rozdíl v kvalitě.

`kind` je jediným diskriminátorem typu artefaktu. Schéma záměrně neukládá druhý druh integrace
s DSH, který by mohl být v rozporu s ním.

## Výslovné výjimky

Plugin uvnitř širšího monorepa zůstává způsobilý pro katalog, ale hvězdičky jeho nadřazeného
projektu jsou pro řazení pluginů nedefinované. Musí používat `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` a `popularity.stars: null`. Objevuje se
ve funkčních sekcích a je vyloučen ze všech žebříčků založených na hvězdičkách.

Rodiny pluginů, motivy, vzhledy (skins), dovednosti, přednastavení, klienti, rozhraní, mosty a
širší ekosystémové projekty se v „Top pluginech podle hvězdiček“ neobjevují. Dostanou
samostatné sekce tam, kde existují srovnatelná data. Agregátory, tržiště, instalační katalogy
a seznamy nejsou záznamy katalogu a nedostávají žádnou sekci katalogu.

## Pohledy řazení

Projekt může publikovat odlišné pohledy pro hvězdičky, 24hodinový růst, 7denní růst, nedávné
aktualizace, ověřené instalace, rodiny pluginů, motivy a vzhledy, klienty a rozhraní a
ekosystémové integrace. Každý pohled musí zveřejnit vlastní pravidlo zařazení a čas snímku
(snapshotu).

Při nulovém počtu způsobilých záznamů se „Top pluginy“ nevykreslují. První způsobilé sloučení
vytvoří pohled „Top pluginy“; popisek se změní na „Top 10“ teprve poté, co existuje deset
kvalifikujících se záznamů. Žádný zástupný ani vymyšlený žebříček není povolen.

## Ověření není doporučení

`eligible` znamená, že veřejná struktura a integrace s DSH byly ověřeny. `verified` navíc
znamená, že instalační smoke test prošel pro fixovaný zdroj nebo balíček. Žádný z obou stavů
není doporučením, zárukou ani absolutní bezpečnostní certifikací.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
