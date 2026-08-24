# Metodológia rebríčka

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Slovenčina**

Rebríčky sú transparentné pohľady nad zlúčenými verejnými záznamami katalógu. Nikdy
nepoužívajú skryté kombinované skóre a nikdy nepovažujú hviezdičky širšieho nadradeného
projektu za popularitu pluginu.

## Predikát Top Plugins by Stars

Záznam sa kvalifikuje iba vtedy, keď je pravdivá každá podmienka nižšie:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kvalifikujúce záznamy používajú `popularity.starsPolicy: exact-repository` a nezáporné celé
číslo v `popularity.stars`. Remízy používajú ID pluginu bez rozlišovania veľkých a malých
písmen ako deterministické poradie zobrazenia; rozhodnutie remízy neznamená rozdiel v kvalite.

`kind` je jediný diskriminátor typu artefaktu. Schéma zámerne neukladá druhý druh DSH
integrácie, ktorý by mu mohol odporovať.

## Explicitné vylúčenia

Plugin vo širšom monorepe zostáva spôsobilý pre katalóg, ale hviezdičky jeho rodiča nie sú pre
rebríček pluginov definované. Musí používať `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` a `popularity.stars: null`. Objavuje sa vo
funkčných sekciách a je vylúčený z každého rebríčka založeného na hviezdičkách.

Rodiny pluginov, témy, skiny, zručnosti, predvoľby, klienti, rozhrania, mosty a širšie
ekosystémové projekty sa neobjavujú v Top Plugins by Stars. Tam, kde existujú porovnateľné
dáta, dostávajú samostatné sekcie. Agregátory, trhoviská, inštalačné katalógy a zoznamy nie sú
záznamami katalógu a nedostávajú žiadnu sekciu katalógu.

## Pohľady rebríčka

Projekt môže publikovať odlišné pohľady pre hviezdičky, 24-hodinový rast, 7-dňový rast, nedávne
aktualizácie, overené inštalácie, rodiny pluginov, témy a skiny, klientov a rozhrania a
ekosystémové integrácie. Každý pohľad musí zverejniť svoje vlastné pravidlo zaradenia a čas
snímky.

Pri nulovom počte spôsobilých záznamov sa Top Plugins nevykresľuje. Prvé spôsobilé zlúčenie
vytvorí pohľad Top Plugins; označenie sa zmení na Top 10 až po existencii desiatich
kvalifikujúcich záznamov. Žiadny zástupný ani vymyslený rebríček nie je povolený.

## Overenie nie je odporúčanie

`eligible` znamená, že verejná štruktúra a DSH integrácia boli validované. `verified` navyše
znamená, že pre pripnutý zdroj alebo balík prešiel inštalačný smoke test. Ani jeden stav nie je
odporúčaním, zárukou ani absolútnou bezpečnostnou certifikáciou.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
