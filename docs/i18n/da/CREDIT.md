# Skaberkreditering og pull request-forrang

> 🌐 [English](../../docs/CREDIT.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeek-navne og -mærker tilhører deres respektive ejer.

Kataloget findes for at gøre uafhængigt DSH-arbejde opdageeligt uden at tage ejerskabet fra
skaberne. Offentlige poster citerer det oprindelige repository og et uforanderligt kilde-commit.

## Forrang for det samme plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. En pull request åbnet af plugin-skaberen eller den ejende organisation.
2. En fællesskabs-pull-request, der er eksplicit godkendt eller medforfattet af skaberen.
3. En eksisterende gyldig fællesskabs-pull-request.
4. En pull request fra katalogautomatisering.
5. En privat kandidat uden en offentlig pull request.

En direkte pull request fra skaberen foretrækkes altid og går forud for enhver åben
fællesskabs-kuraterings- eller automatiserings-pull-request for det samme kanoniske plugin,
uanset hvilken der blev åbnet først, eller hvilken der er nået længst. Skaberens pull request
bliver reviewkøretøjet; deres branch overskrives aldrig, force-pushes aldrig og overføres aldrig
til den kuraterede pull request. Hvis en kurateret post allerede er merget, forbliver historikken
intakt, og skaberen kan gøre krav på den eller korrigere den i et nyt bidrag.

## Offentlig kreditering

Hver katalogpost bærer skaberens offentlige GitHub-handle, oprindelige repository,
repository-node-ID, plugin-understi og fulde fastlåste commit. Den offentlige skaberprofil udledes
af det enkelte handle i stedet for at blive gemt som en anden identitet. Den separate
vedligeholder-proveniens-gate løser node-ID'et og afviser en repository-URL-uoverensstemmelse.
Pull request-beskrivelser bør angive `Created by @handle` og inkludere metadata om
kilde-repository og kilde-commit.

En person, der slår noget op eller kommenterer i en Discussion, behandles ikke automatisk som
skaberen. Ejerskab skal understøttes af repository-ejeren eller -organisationen, pakkeforfatterskab,
manifest-metadata eller den præcise fastlåste kildehistorik.

## Git-identitet

<!-- creator-first:source-bound-git-identity -->

Commit-forfatterskab og pull request-forfatterskab er adskilte. En pull request med skaberen som
ophav bevarer skaberen som pull request-forfatter, og deres commits bevarer naturligt
forfatterskabet. En vedligeholder- eller automatiseringskonto må optræde som committer eller som
verificeret medforfatter, men må ikke erstatte skaberens forfatterskab.

For et kurateret commit skal du kun bruge skaberen som Git-forfatter eller tilføje en
`Co-authored-by`-trailer, når den præcise identitet er kildebundet og offentligt verificerbar,
såsom en identitet, der allerede er knyttet til skaberens commit i det oprindelige repository.
Gæt aldrig en e-mailadresse, fremstil aldrig en noreply-adresse, og brug aldrig en privat adresse
fundet uden for en autoriseret offentlig kilde.

Når en verificeret Git-identitet ikke er tilgængelig, forfatter kuratoren eller
automatiseringskontoen commit'et og giver i stedet eksplicit synlig kreditering: `Created by
@handle`, den tilsvarende offentlige profil og et link til det oprindelige repository i posten og
pull requesten. Synlig YAML-kreditering er altid påkrævet uafhængigt af
Git-identitetskortlægningen. En senere direkte pull request fra skaberen erstatter en åben
kurateret pull request i stedet for at arve dens syntetiske historik.

## Respektfuld skaber-omtale

En kurateret pull request bruger én respektfuld offentlig `@creator`-omtale i sin beskrivelse ved
siden af linket til det oprindelige repository. Den må invitere til gennemgang eller til en
erstattende direkte pull request. Gentag ikke omtalen, åbn ikke reklame-issues, cross-post ikke og
send ikke uopfordrede direkte beskeder.

## Kataloglicens kontra upstream-licens

Katalogfakta og redaktionel YAML-metadata er frigivet under CC0-1.0. Denne frigivelse ændrer ikke
upstream-pluginnets licens. Upstream-kode, dokumentation, skærmbilleder, logoer og andet kreativt
materiale forbliver underlagt deres oprindelige licenser og ejere.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
