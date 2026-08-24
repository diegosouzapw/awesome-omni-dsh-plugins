# Metodologia di classifica

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Italiano**

Le classifiche sono viste trasparenti sulle voci pubbliche del catalogo unite. Non usano mai un
punteggio combinato nascosto e non trattano mai le stelle di un ampio progetto padre come
popolarità del plugin.

## Predicato di Top Plugins by Stars

Una voce si qualifica solo quando ogni condizione qui sotto è vera:

```text
kind == plugin (il discriminatore canonico del bundle DSH nativo)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Le voci qualificate usano `popularity.starsPolicy: exact-repository` e un intero non negativo in
`popularity.stars`. I pareggi usano l'ID del plugin case-insensitive come ordine di
visualizzazione deterministico; il criterio di spareggio non implica una differenza di qualità.

`kind` è l'unico discriminatore del tipo di artefatto. Lo schema intenzionalmente non memorizza
un secondo tipo di integrazione DSH che potrebbe contraddirlo.

## Esclusioni esplicite

Un plugin all'interno di un monorepo più ampio resta idoneo per il catalogo, ma le sue stelle
del progetto padre sono indefinite ai fini della classifica dei plugin. Deve usare
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` e
`popularity.stars: null`. Appare nelle sezioni funzionali ed è escluso da ogni classifica basata
sulle stelle.

Le famiglie di plugin, i temi, le skin, le skill, i preset, i client, le interfacce, i bridge e
i progetti più ampi dell'ecosistema non appaiono in Top Plugins by Stars. Ricevono sezioni
separate dove esistono dati comparabili. Gli aggregatori, i marketplace, i cataloghi
installatori e le liste non sono voci di catalogo e non ricevono alcuna sezione di catalogo.

## Viste della classifica

Il progetto può pubblicare viste distinte per stelle, crescita a 24 ore, crescita a 7 giorni,
aggiornamenti recenti, installazioni verificate, famiglie di plugin, temi e skin, client e
interfacce, e integrazioni dell'ecosistema. Ogni vista deve dichiarare la propria regola di
inclusione e l'orario dello snapshot.

Con zero voci idonee, Top Plugins non viene renderizzato. Il primo merge idoneo crea una vista
Top Plugins; l'etichetta cambia in Top 10 solo dopo che esistono dieci voci qualificate. Non è
consentita alcuna classifica segnaposto o fabbricata.

## La verifica non è un avallo

`eligible` significa che la struttura pubblica e l'integrazione DSH sono state validate.
`verified` significa in aggiunta che uno smoke test di installazione è passato per la sorgente o
il pacchetto fissato. Nessuno dei due stati è un avallo, una garanzia o una certificazione di
sicurezza assoluta.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
