# Rangeringsmetodik

> 🌐 [English](../../docs/RANKING.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeek-navne og -mærker tilhører deres respektive ejer.

Rangeringer er gennemsigtige visninger over mergede offentlige katalogposter. De bruger aldrig en
skjult kombineret score og behandler aldrig stjerner fra et bredt overordnet projekt som
plugin-popularitet.

## Top Plugins by Stars-prædikatet

En post kvalificerer sig kun, når alle betingelserne nedenfor er sande:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kvalificerende poster bruger `popularity.starsPolicy: exact-repository` og et ikke-negativt heltal
i `popularity.stars`. Lige store værdier bruger plugin-ID'et uden skelnen mellem store og små
bogstaver som en deterministisk visningsrækkefølge; tie-break'et indebærer ikke en kvalitetsforskel.

`kind` er det eneste artefakttype-diskriminatorsymbol. Schemaet gemmer med vilje ikke en anden
DSH-integrationskind, der kunne modsige den.

## Eksplicitte udelukkelser

Et plugin i et bredere monorepo forbliver katalog-egnet, men dets overordnede stjerner er
udefinerede for plugin-rangering. Det skal bruge `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` og `popularity.stars: null`. Det vises i
funktionelle sektioner og udelukkes fra enhver stjernebaseret rangering.

Pluginfamilier, temaer, skins, skills, presets, klienter, interfaces, broer og bredere
økosystemprojekter optræder ikke i Top Plugins by Stars. De får separate sektioner, hvor
sammenlignelige data findes. Aggregatorer, markedspladser, installationskataloger og lister er
ikke katalogposter og får ingen katalogsektion.

## Rangeringsvisninger

Projektet kan udgive forskellige visninger for stjerner, 24-timers vækst, 7-dages vækst, nylige
opdateringer, verificerede installationer, pluginfamilier, temaer og skins, klienter og interfaces
samt økosystemintegrationer. Hver visning skal oplyse sin egen inkluderingsregel og sit
snapshot-tidspunkt.

Ved nul egnede poster vises Top Plugins ikke. Den første egnede merge opretter en Top
Plugins-visning; etiketten ændres først til Top 10, når der findes ti kvalificerende poster. Ingen
pladsholder eller opdigtet rangering er tilladt.

## Verificering er ikke en anbefaling

`eligible` betyder, at den offentlige struktur og DSH-integrationen blev valideret. `verified`
betyder derudover, at en installations-smoke-test bestod for den fastlåste kilde eller pakke. Ingen
af de to statusser er en anbefaling, garanti eller absolut sikkerhedscertificering.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
