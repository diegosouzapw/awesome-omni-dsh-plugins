# Rangschikkingsmethodologie

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Nederlands**

Rangschikkingen zijn transparante weergaven over gemergede publieke catalogusinvoeren. Ze
gebruiken nooit een verborgen gecombineerde score en behandelen sterren van een breder
bovenliggend project nooit als pluginpopulariteit.

## Predicaat voor Top Plugins by Stars

Een invoer komt alleen in aanmerking wanneer aan elke onderstaande voorwaarde is voldaan:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kwalificerende invoeren gebruiken `popularity.starsPolicy: exact-repository` en een
niet-negatief geheel getal in `popularity.stars`. Bij gelijkstand wordt de niet-hoofdlettergevoelige
plugin-ID gebruikt als deterministische weergavevolgorde; deze tiebreak impliceert geen
kwaliteitsverschil.

`kind` is de enige discriminator voor artefacttype. Het schema slaat bewust geen tweede
DSH-integratietype op dat hiermee in tegenspraak zou kunnen zijn.

## Expliciete uitsluitingen

Een plugin binnen een breder monorepo blijft in aanmerking komen voor de catalogus, maar de
sterren van het bovenliggende project zijn ongedefinieerd voor pluginrangschikking. Deze moet
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` en
`popularity.stars: null` gebruiken. Ze verschijnt in functionele secties en is uitgesloten van
elke op sterren gebaseerde rangschikking.

Pluginfamilies, thema's, skins, skills, presets, clients, interfaces, bruggen en bredere
ecosysteemprojecten verschijnen niet in Top Plugins by Stars. Ze krijgen aparte secties waar
vergelijkbare data bestaat. Aggregators, marktplaatsen, installatiecatalogi en lijsten zijn geen
catalogusinvoeren en krijgen geen catalogussectie.

## Rangschikkingsweergaven

Het project kan afzonderlijke weergaven publiceren voor sterren, groei over 24 uur, groei over 7
dagen, recente updates, geverifieerde installaties, pluginfamilies, thema's en skins, clients en
interfaces, en ecosysteemintegraties. Elke weergave moet zijn eigen opnameregel en
snapshot­tijdstip bekendmaken.

Bij nul in aanmerking komende invoeren wordt Top Plugins niet weergegeven. De eerste
kwalificerende merge creëert een Top Plugins-weergave; het label verandert pas in Top 10 nadat
tien kwalificerende invoeren bestaan. Geen enkele placeholder of verzonnen rangschikking is
toegestaan.

## Verificatie is geen goedkeuring

`eligible` betekent dat de publieke structuur en DSH-integratie zijn gevalideerd. `verified`
betekent bovendien dat een installatiesmoketest is geslaagd voor de vastgepinde bron of het
vastgepinde package. Geen van beide statussen is een goedkeuring, garantie of absolute
beveiligingscertificering.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
