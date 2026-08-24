# Rangsorolási módszertan

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Magyar**

A rangsorok átlátható nézetek az egyesített nyilvános katalógusbejegyzések fölött. Soha nem
használnak rejtett kombinált pontszámot, és soha nem kezelik egy széles szülőprojekt csillagait
bővítmény-népszerűségként.

## A Top bővítmények csillagok szerint predikátuma

Egy bejegyzés csak akkor jogosult, ha az alábbi feltételek mindegyike igaz:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

A jogosult bejegyzések a `popularity.starsPolicy: exact-repository` értéket és egy nem negatív
egész számot használnak a `popularity.stars` mezőben. Holtverseny esetén a kis- és nagybetűket nem
megkülönböztető bővítmény-ID adja a determinisztikus megjelenítési sorrendet; a holtverseny
feloldása nem jelent minőségi különbséget.

A `kind` az egyetlen artefaktum-típus-diszkrimináló. A séma szándékosan nem tárol egy második DSH
integrációs kind-ot, amely ellentmondhatna neki.

## Explicit kizárások

Egy szélesebb monorepóban lévő bővítmény továbbra is jogosult a katalógusban, de a szülőprojekt
csillagai nem értelmezhetők a bővítmény-rangsoroláshoz. `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` és `popularity.stars: null` értéket kell
használnia. Megjelenik a funkcionális szekciókban, de ki van zárva minden csillag alapú
rangsorból.

A bővítménycsaládok, témák, skinek, skillek, presetek, kliensek, interfészek, hidak és szélesebb
ökoszisztéma-projektek nem jelennek meg a Top bővítmények csillagok szerint listában. Külön
szekciót kapnak, ahol összehasonlítható adat létezik. Az aggregátorok, marketplace-ek,
telepítő-katalógusok és listák nem katalógusbejegyzések, és nem kapnak katalógusszekciót.

## Rangsor-nézetek

A projekt különálló nézeteket publikálhat a csillagokra, a 24 órás növekedésre, a 7 napos
növekedésre, a friss frissítésekre, a verifikált telepítésekre, a bővítménycsaládokra, a témákra
és skinekre, a kliensekre és interfészekre, valamint az ökoszisztéma-integrációkra. Minden
nézetnek közzé kell tennie a saját felvételi szabályát és a snapshot időpontját.

Ha nulla jogosult bejegyzés van, a Top bővítmények nem jelenik meg. Az első jogosult egyesítés
létrehozza a Top bővítmények nézetet; a címke csak akkor változik Top 10-re, ha tíz jogosult
bejegyzés létezik. Helyőrző vagy kitalált rangsor nem megengedett.

## A verifikáció nem jóváhagyás

Az `eligible` azt jelenti, hogy a nyilvános struktúra és a DSH-integráció validálva lett. A
`verified` emellett azt jelenti, hogy egy telepítési smoke-teszt sikeresen lefutott a rögzített
forráson vagy csomagon. Egyik állapot sem jóváhagyás, garancia vagy abszolút biztonsági
tanúsítvány.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
