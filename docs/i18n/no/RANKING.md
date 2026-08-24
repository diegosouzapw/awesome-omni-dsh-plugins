# Rangeringsmetodologi

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Norsk**

Rangeringer er transparente visninger over sammenslåtte offentlige katalogoppføringer. De
bruker aldri en skjult kombinert poengsum og behandler aldri stjerner fra et bredt overordnet
prosjekt som pluginpopularitet.

## Top Plugins by Stars-predikatet

En oppføring kvalifiserer bare når alle betingelsene nedenfor er sanne:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kvalifiserte oppføringer bruker `popularity.starsPolicy: exact-repository` og et
ikke-negativt heltall i `popularity.stars`. Uavgjorte bruker den plugin-ID-en som ikke skiller
mellom store og små bokstaver, som en deterministisk visningsrekkefølge; tiebreak-en
innebærer ikke en kvalitetsforskjell.

`kind` er den eneste artefakttype-diskriminatoren. Skjemaet lagrer bevisst ikke en sekundær
DSH-integrasjonstype som kunne motsi den.

## Eksplisitte ekskluderinger

En plugin inne i et bredere monorepo forblir katalogkvalifisert, men dens overordnede
stjerner er udefinert for pluginrangering. Den må bruke `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` og `popularity.stars: null`. Den vises i
funksjonelle seksjoner og ekskluderes fra enhver stjernebasert rangering.

Pluginfamilier, temaer, skins, skills, forhåndsinnstillinger, klienter, grensesnitt, broer og
bredere økosystemprosjekter vises ikke i Top Plugins by Stars. De får egne seksjoner når
sammenlignbare data finnes. Aggregatorer, markedsplasser, installerkataloger og lister er ikke
katalogoppføringer og får ingen katalogseksjon.

## Rangeringsvisninger

Prosjektet kan publisere egne visninger for stjerner, 24-timers vekst, 7-dagers vekst, nye
oppdateringer, verifiserte installasjoner, pluginfamilier, temaer og skins, klienter og
grensesnitt, og økosystemintegrasjoner. Hver visning må gjøre rede for sin egen
inkluderingsregel og snapshot-tidspunkt.

Med null kvalifiserte oppføringer rendres ikke Top Plugins. Den første kvalifiserte
sammenslåingen oppretter en Top Plugins-visning; etiketten endres til Top 10 først når ti
kvalifiserte oppføringer finnes. Ingen plassholder eller oppdiktet rangering er tillatt.

## Verifisering er ikke godkjenning

`eligible` betyr at den offentlige strukturen og DSH-integrasjonen ble validert. `verified`
betyr i tillegg at en installasjonssmoketest besto for den fastpinnede kilden eller pakken.
Ingen av statusene er en godkjenning, garanti eller absolutt sikkerhetssertifisering.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
