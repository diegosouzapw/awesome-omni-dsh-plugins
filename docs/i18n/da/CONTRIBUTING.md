# Bidrag

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeeks navne og mærker tilhører deres respektive ejere.

Tak for at forbedre kataloget. Bidrag er skabercentrerede: brug beviser fra det oprindelige
repository, bevar attributionen, og hold hver plugin uafhængigt gennemgåelig. Kataloget starter
tomt med vilje; ingen post accepteres uden sin egen gennemgåede pull request.

## Start med skaberen

En pull request åbnet direkte af plugin-skaberen eller den ejende organisation er altid at
foretrække. Hvis skaberen er klar til at bidrage, så brug deres branch og pull request i stedet
for at genskabe deres arbejde i en kurator- eller automatiseringsbranch.

Fællesskabskuratering er velkommen, når det hjælper en skaber, der endnu ikke har åbnet en pull
request. Det etablerer hverken ejerskab eller prioritet over et senere direkte bidrag fra
skaberen.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Én plugin pr. branch og pull request

Opret en dedikeret branch til én plugin, og åbn én pull request fra den branch. Branchen og pull
requesten skal oprette eller ændre præcis én YAML-fil under `catalog/plugins/`. Bland ikke
plugins, oprydning i dokumentation, genererede indekser eller ikke-relateret vedligeholdelse ind i
den branch eller pull request.

Post-ID'et og filnavnet skal være den samme værdi i lowercase kebab-case. Vedligeholdere
gennemgår og mergerer hver plugin-pull-request individuelt; en batch, der indeholder flere
plugins, bliver hverken opdelt eller delvist merget.

## Find frem til den oprindelige kilde

Hvert offentligt felt skal rekonstrueres ud fra skaberens oprindelige repository, pakke, manifest,
README, licens eller release ved den fastlåste commit. Kopiér ikke tekst, kategoritildeling,
skærmbilleder, rangering, badges eller genereret metadata fra et andet katalog eller en
aggregator. Et link fundet i et paraplyprojekt, en markedsplads, en liste eller en aggregator er
kun et spor, ikke beviser og ikke plugin-kilden.

Indsend aldrig et paraplyprojekt, en aggregator, en markedsplads, et installations-katalog eller
en liste som en katalogpost, selv når det kan installeres uafhængigt. Brug det kun som et spor, og
find frem til hver uafhængigt installerbar underplugins faktiske skaber og oprindelige
repository. En plugin i skaberens rigtige monorepo kan indsendes fra sin præcise understi, men
skal følge monorepo-stjernepolitikken nedenfor.

## Krævede beviser

Angiv alt det følgende i pull requesten:

- Den kanoniske offentlige URL til det oprindelige repository og dets uforanderlige
  repository-node-ID. Vedligeholdere løser node-ID'et og afviser URL-uoverensstemmelser i den
  separate proveniens-gate.
- Skaberens offentlige GitHub-handle og den tilsvarende offentlige profil-URL. YAML gemmer handlet
  én gang; profil-URL'en udledes som `https://github.com/<handle>`.
- Et fuldt 40-tegns source-commit-OID og pluginets præcise understi, eller `null` for en plugin i
  repositoryets rod.
- En afgrænset engelsk beskrivelse og dens bevissti ved den fastlåste commit.
- Artefaktens `kind`, primære kategori og tags valgt fra
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Det komplette upstream SPDX-licensudtryk, dokumenteret ved den fastlåste commit.
- En kanonisk installationsdeskriptor fastlåst til en præcis npm-version, eller til
  kilde-repositoryet, fuld commit og understi. Deskriptoren er data, aldrig en shell-kommando.
- Bevis for native DSH-integration og dets sti ved den fastlåste commit.
- Eksisterende, ikke-følsomme smoke-beviser for den præcise artefakt-pin, eller den eksplicitte
  værdi `not run`. Installer ikke pluginet, og kør ikke `preinstall`, `install`, `postinstall`,
  `prepare` eller anden pakke-/plugin-livscykluskode blot for at forberede et katalogbidrag.
- For et dedikeret repository, det verificerbare antal stjerner for netop det repository, sammen
  med den offentlige kilde og tidspunktet for kontrollen. For en monorepo-plugin, brug den
  påkrævede null-politik nedenfor.
- Offentlig Discussion- eller kommentar-proveniens, når den findes; brug ellers `null`.
- Den maskinlæsbare værdi `unofficial: true`.

Hvis der ikke allerede findes en kvalificerende smoke-test, brug `verification.status: eligible`
og `verification.smokeTest: null`. Brug kun `verified`, når der findes gennemgåelige
smoke-beviser for den præcise pin. Ingen af de to tilstande er en anbefaling eller en
sikkerhedscertificering.

Indsend aldrig legitimationsoplysninger, cookies, private e-mailadresser, ikke-udgivet kildekode
eller andre hemmeligheder.

## Regler for YAML og schema

Opret `catalog/plugins/<plugin-id>.yaml`, og valider den mod
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` skal være identisk med
filens basisnavn og skal starte med dit namespace: dit `creator.github`-handle med små bogstaver
(enhver følge af tegn uden for `[a-z0-9]` bliver til en enkelt `-`) efterfulgt af `-`, for
eksempel `some-creator-my-plugin` for handlet `Some-Creator`. Katalogvalideringen håndhæver begge
dele. Schemaet er den endegyldige kilde for feltnavne og tilladte værdier; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) definerer,
hvordan man vælger den ene artefakt-kind, primære kategori, tags og repository-scope.

En npm-deskriptor skal indeholde et gyldigt pakkenavn og en præcis version. Det offentlige schema
afviser optionslignende og ikke-afgrænsede værdier, men genimplementerer ikke SemVer eller SRI:
katalogvalidering skal fortolke versionen, kræve præcis SemVer og fortolke enhver integritetsværdi
som gyldig SHA-512 SRI. En source-deskriptor er bundet til `source.repository`, `source.commit` og
`source.subpath` uden at duplikere mutable kildeværdier.

Installere skal bruge argument-arrays, deaktivere shell-eksekvering og placere en
optionsterminator før katalog-leverede positionelle værdier, hvor den kaldte kommando understøtter
det. Valideringen af en indsendelse må ikke kalde et installationsprogram eller pluginets
livscyklus.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` er en lokal, skrivebeskyttet strukturel og semantisk kontrol. Den fortolker
sikker YAML, validerer det offentlige schema, fortolker SPDX-udtryk, kræver præcis SemVer og
gyldig SHA-512 SRI, og afviser duplikerede ID'er og kanoniske nøgler af typen
repository-node-plus-understi. Den kontakter ikke GitHub, løser ikke repository-identitet og
undersøger ikke bevisstier ved den fastlåste commit.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Før en post når `eligible`, løser vedligeholdere separat det kanoniske repository og node-ID,
binder skaberen til den oprindelige kilde og undersøger den angivne beskrivelse, licens,
DSH-integration og smoke-beviser ved `source.commit`. Et lokalt grønt valideringsresultat er ikke
bevis for proveniens eller oprindelse.

## Repository-stjerner

Kun stjerner, der verificerbart tilhører det præcise dedikerede plugin-repository, må registreres.
Et overordnet projekts stjerner må aldrig tilskrives en plugin, der er gemt inde i et bredere
monorepo. En monorepo-post forbliver egnet til funktionelle katalogsektioner, men skal deklarere:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

En dedikeret post bruger `repositoryScope: dedicated`, `starsPolicy: exact-repository` og det
ikke-negative antal stjerner observeret på det samme repository. Læs
[docs/RANKING.md](../../docs/RANKING.md), før du indsender popularitetsdata.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Skaberens forrang og respektfuld kontakt

For den samme kanoniske plugin er rækkefølgen:

1. En pull request åbnet af skaberen eller den ejende organisation.
2. En fællesskabs-pull-request, der er eksplicit godkendt af skaberen.
3. En eksisterende gyldig pull request for fællesskabskuratering.
4. En pull request fra katalogautomatisering.

En direkte pull request fra skaberen går forud for enhver åben pull request for kuratering eller
automatisering, uanset hvilken der blev åbnet først, eller som er nået længst. Skaberens pull
request bliver reviewkøretøjet; vedligeholdere force-pusher ikke skaberens branch eller overfører
deres arbejde til den kuraterede pull request. Hvis en kurateret post allerede er merget, bliver
den offentlige historik ikke omskrevet. Skaberen kan bruge en claim- eller korrektionsanmodning og
derefter selv bidrage med en opfølgende pull request direkte.

En kurateret pull request bør bruge én respektfuld offentlig `@skaber`-omtale i sin beskrivelse,
ved siden af et link til det oprindelige repository, og invitere skaberen til at gennemgå eller
erstatte den med en direkte pull request. Gentag ikke omtalen, åbn ikke reklame-issues, cross-post
ikke, send ikke uopfordrede direkte beskeder, og spam ikke på anden vis skaberen.

<!-- creator-first:source-bound-git-identity -->

Pull requests og commits forfattet af skaberen bevarer naturligt skaberens kredit. Kuraterede
commits må kun bruge skaberens Git-forfatterskab eller en `Co-authored-by`-trailer med en
kildebundet, offentligt verificerbar identitet. Opfind eller gæt aldrig en e-mailadresse. Når
ingen verificeret Git-identitet er tilgængelig, forfatter kuratoren commit'en og giver eksplicit
kredit i form af `Created by @handle` med et link til det oprindelige repository i YAML'en og pull
requesten. En vedligeholder- eller automatiseringskonto må være committer eller verificeret
medforfatter, men må ikke erstatte skaberens forfatterskab. Se
[docs/CREDIT.md](../../docs/CREDIT.md) for den fulde politik.

## Valideringskommandoer og tilgængelighed

npm-CLI'et udgives som `omni-dsh-plugins@1.0.1`, så kommandoerne nedenfor er
tilgængelige via `npx` allerede i dag. Brug dem præcis som skrevet; bidragydere bør ikke opfinde
erstatningskommandoer.

Kør disse kommandoer fra repositoryets rod:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` udfører kun de lokale kontroller af YAML, schema, SPDX, præcis SemVer,
SHA-512 SRI og duplikater, der er beskrevet ovenfor, og accepterer det bevidst tomme katalog. Den
beviser ikke identiteten af et fjernrepository eller fastlåste kildebeviser. De øvrige kommandoer
kontrollerer den påkrævede offentlige dokumentation og de strukturerede GitHub-issue-formularer.
At disse kommandoer består lokalt, lemper ikke krav til beviser; vedligeholdere anvender stadig
hver tilsvarende release-gate før merge.

## Review-gates, kollisioner og merge

Vedligeholdere anvender hver gate på pull requestens aktuelle commit før merge:

1. **Scope:** én dedikeret branch, én plugin-YAML-fil og ingen urelaterede ændringer.
2. **Oprindelig identitet:** skaber, kanonisk repository, node-ID, fuld commit og understi
   stemmer overens.
3. **Schema og beviser:** YAML, kategorier, SPDX, installations-pin, DSH-beviser og smoke-status
   er internt konsistente uden at eksekvere pluginets livscykluskode.
4. **Popularitet:** dedikerede stjerner er verificerbare på det præcise repository, eller
   monorepo-stjerner er `null` med `undefined-parent-repository`.
5. **Dokumentation og formularer:** offentlig dokumentation, Markdown-kodeblokke og strukturerede
   formularer forbliver gyldige.
6. **Kollision og deduplikering:** ingen merget post eller åben pull request repræsenterer den
   samme kanoniske plugin.

Forskellige navne eller ID'er gør ikke duplikerede plugins forskellige. Behandl det samme
repository-node-ID og understi, den samme kanoniske pakke, eller et andet bevisligt identisk
installationsmål som en kollision. Løs aliaser og konkurrerende pull requests før merge. En
direkte pull request fra skaberen vinder over en kollision med kuratering eller automatisering;
ellers vælger vedligeholdere ét reviewkøretøj og lukker eller omdirigerer duplikater i stedet for
at merge begge.

Kun en vedligeholder merger en plugin, efter at alle gates er bestået. Hver accepteret plugin
merges individuelt; validering, kuratering eller automatisering indebærer ikke automatisk eller
batch-merge.

## Tjekliste til pull request

- [ ] Jeg brugte én dedikeret branch, og denne PR ændrer præcis én plugin-post.
- [ ] Kilden er skaberens oprindelige repository, ikke et paraplyprojekt eller en aggregator.
- [ ] Skaberens handle/profil, repository, node-ID, understi og fulde commit er dokumenteret.
- [ ] Kind, kategori og tags følger `docs/CATEGORIES.md`.
- [ ] SPDX-licensen og den fastlåste installationsdeskriptor er dokumenteret.
- [ ] Native DSH-integration og smoke-resultatet eller status `not run` er dokumenteret.
- [ ] Jeg kørte ikke plugin- eller pakke-livscykluskode for at forberede dette bidrag.
- [ ] Dedikerede stjerner er verificerbare, eller monorepo-stjerner bruger den påkrævede
      null-politik.
- [ ] Jeg tjekkede for en eksisterende post og åben pull request for den samme kanoniske plugin.
- [ ] Posten er eksplicit uofficiel og indeholder ingen hemmeligheder eller private
      personoplysninger.

## Sprogpolitik

Lanceringsdokumentation og katalogbeskrivelser er udelukkende på engelsk. Udrulningen til
43 lokaliteter forbliver et backlog-emne efter MVP; tilføj ikke tomme lokalitetsdokumenter eller
automatiske masseoversættelser.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
