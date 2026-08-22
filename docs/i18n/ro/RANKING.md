# Metodologia de clasament

> 🌐 [English](../../docs/RANKING.md) · **Română**

Clasamentele sunt vederi transparente peste intrările integrate în catalogul public. Ele nu
folosesc niciodată un scor combinat ascuns și nu tratează niciodată stelele unui proiect-părinte
larg drept popularitate a pluginului.

## Predicatul pentru Top pluginuri după stele

O intrare se califică doar când toate condițiile de mai jos sunt adevărate:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Intrările calificate folosesc `popularity.starsPolicy: exact-repository` și un întreg nenegativ în
`popularity.stars`. Egalitățile folosesc ID-ul pluginului, fără distincție între majuscule și
minuscule, ca ordine deterministă de afișare; departajarea nu implică o diferență de calitate.

`kind` este singurul discriminator de tip de artefact. Schema nu stochează intenționat un al
doilea kind de integrare DSH care ar putea să îl contrazică.

## Excluderi explicite

Un plugin dintr-un monorepo mai larg rămâne eligibil pentru catalog, dar stelele părintelui său
sunt nedefinite pentru clasamentul pluginurilor. El trebuie să folosească
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` și
`popularity.stars: null`. Apare în secțiunile funcționale și este exclus din orice clasament bazat
pe stele.

Familiile de pluginuri, temele, skin-urile, skill-urile, preseturile, clienții, interfețele,
punțile și proiectele de ecosistem mai ample nu apar în Top pluginuri după stele. Ele primesc
secțiuni separate acolo unde există date comparabile. Agregatoarele, marketplace-urile, cataloagele
de instalare și listele nu sunt intrări de catalog și nu primesc nicio secțiune de catalog.

## Vederi de clasament

Proiectul poate publica vederi distincte pentru stele, creștere pe 24 de ore, creștere pe 7 zile,
actualizări recente, instalări verificate, familii de pluginuri, teme și skin-uri, clienți și
interfețe și integrări de ecosistem. Fiecare vedere trebuie să își divulge propria regulă de
includere și momentul snapshot-ului.

La zero intrări eligibile, Top pluginuri nu este afișat. Prima integrare eligibilă creează o
vedere Top pluginuri; eticheta devine Top 10 doar după ce există zece intrări calificate. Niciun
substitut sau clasament inventat nu este permis.

## Verificarea nu este o susținere

`eligible` înseamnă că structura publică și integrarea DSH au fost validate. `verified` înseamnă în
plus că un smoke-test de instalare a trecut pentru sursa sau pachetul fixat. Niciunul dintre
statusuri nu este o susținere, o garanție sau o certificare absolută de securitate.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
