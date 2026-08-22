# Skaperkreditering og pull request-forrang

Katalogen finnes for å gjøre uavhengig DSH-arbeid oppdagbart uten å ta eierskapet fra
skaperne. Offentlige oppføringer siterer det opprinnelige repositoriet og en uforanderlig
kildekommit.

## Forrang for den samme pluginen

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. En pull request åpnet av pluginskaperen eller eierorganisasjonen.
2. En fellesskaps-pull-request som er eksplisitt godkjent eller medforfattet av skaperen.
3. En eksisterende gyldig fellesskaps-pull-request.
4. En katalogautomatiserings-pull-request.
5. En privat kandidat uten offentlig pull request.

En direkte skaper-pull-request foretrekkes alltid og fortrenger enhver åpen
fellesskapskuraterings- eller automatiserings-pull-request for den samme kanoniske pluginen,
uansett hvilken som åpnet først eller er lengre kommet. Skaperens pull request blir
gjennomgangsfartøyet; deres branch overskrives, force-pushes eller transplanteres aldri inn i
den kuraterte pull requesten. Hvis en kuratert oppføring allerede er slått sammen, forblir
historikken intakt, og skaperen kan gjøre krav på eller rette den i et nytt bidrag.

## Offentlig attribusjon

Hver katalogoppføring bærer skaperens offentlige GitHub-handle, opprinnelig repositorium,
repositorium-node-ID, plugin-understi og full fastpinnet kommit. Den offentlige
skaperprofilen utledes fra den ene handlet i stedet for å lagres som en sekundær identitet.
Den separate vedlikeholderopprinnelsesporten løser node-ID-en og avviser avvik i
repositorie-URL. Pull request-beskrivelser bør si `Created by @handle` og inkludere
kilderepositorium- og kildekommit-metadata.

En person som poster eller kommenterer på en Discussion behandles ikke automatisk som
skaperen. Eierskap må støttes av repositorieeieren eller organisasjonen, pakkeforfatterskap,
manifestmetadata eller eksakt fastpinnet kildehistorikk.

## Git-identitet

<!-- creator-first:source-bound-git-identity -->

Commit-forfatterskap og pull request-forfatterskap er separate. En skaperopprinnelig pull
request beholder skaperen som pull request-forfatter, og deres kommitter bevarer
forfatterskap naturlig. En vedlikeholder- eller automatiseringskonto kan opptre som committer
eller som verifisert medforfatter, men må ikke erstatte skaperens forfatterskap.

For en kuratert kommit, bruk skaperen som Git-forfatter eller legg til en
`Co-authored-by`-trailer bare når den eksakte identiteten er kildebundet og offentlig
verifiserbar, for eksempel en identitet som allerede er knyttet til skaperens kommitter i det
opprinnelige repositoriet. Gjett aldri en e-post, finn aldri opp en noreply-adresse eller bruk
en privat adresse funnet utenfor en autorisert offentlig kilde.

Når en verifisert Git-identitet ikke er tilgjengelig, forfatter kuratoren eller
automatiseringskontoen committen og gir i stedet eksplisitt synlig kreditering:
`Created by @handle`, den tilhørende offentlige profilen og en lenke til det opprinnelige
repositoriet i oppføringen og pull requesten. Synlig YAML-attribusjon er alltid påkrevd
uavhengig av Git-identitetsmapping. En senere direkte skaper-pull-request erstatter en åpen
kuratert pull request i stedet for å arve dens syntetiske historikk.

## Respektfull skaperomtale

En kuratert pull request bruker én respektfull offentlig `@creator`-omtale i beskrivelsen ved
siden av lenken til det opprinnelige repositoriet. Den kan invitere til gjennomgang eller en
erstattende direkte pull request. Ikke gjenta omtalen, åpne promoterende issues, krysspost
eller send uoppfordrede direktemeldinger.

## Kataloglisens kontra oppstrømslisens

Katalogfakta og redaksjonelle YAML-metadata er dedikert under CC0-1.0. Den dedikasjonen endrer
ikke oppstrømspluginens lisens. Oppstrøms kode, dokumentasjon, skjermbilder, logoer og annet
kreativt materiale forblir underlagt sine opprinnelige lisenser og eiere.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
