# Bidra

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Norsk**

> **Uoffisielt community-prosjekt. Ikke tilknyttet, godkjent av eller sponset av DeepSeek.**
> DeepSeek-navn og -merker tilhører sine respektive eiere.

Takk for at du forbedrer katalogen. Bidrag er skaperfokuserte: bruk bevis fra det opprinnelige
repositoriet, bevar attribusjon og hold hver plugin uavhengig gjennomgåbar. Katalogen starter
tom etter design; ingen oppføring aksepteres uten sin egen gjennomgåtte pull request.

## Start med skaperen

En pull request åpnet direkte av pluginskaperen eller eierorganisasjonen foretrekkes alltid.
Hvis skaperen er klar til å bidra, bruk deres branch og pull request i stedet for å gjenskape
arbeidet deres i en kurator- eller automatiserings-branch.

Fellesskapskuratering er velkommen når det hjelper en skaper som ikke har åpnet en pull
request. Det etablerer ikke eierskap eller forrang foran et senere direkte skaperbidrag.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Én plugin per branch og pull request

Opprett en dedikert branch for én plugin og åpne én pull request fra den branchen. Branchen
og pull requesten må opprette eller endre nøyaktig én YAML-fil under `catalog/plugins/`. Ikke
bland andre plugins, dokumentasjonsrydding, genererte indekser eller urelatert vedlikehold inn
i den branchen eller pull requesten.

Oppføringens ID og filnavn må være den samme verdien i kebab-case med små bokstaver.
Vedlikeholderne gjennomgår og slår sammen hver plugin-pull-request individuelt; en batch som
inneholder flere plugins deles ikke eller slås sammen delvis.

## Slå opp den opprinnelige kilden

Alle offentlige felt må rekonstrueres fra skaperens opprinnelige repositorium, pakke, manifest,
README, lisens eller utgivelse ved den fastpinnede kommitten. Ikke kopier en annen katalog
eller aggregators tekst, kategoritildeling, skjermbilder, rangering, merker eller genererte
metadata. En lenke funnet i et paraplyprosjekt, en markedsplass, en liste eller en aggregator
er bare et spor, ikke et bevis og ikke pluginkilden.

Send aldri inn et paraplyprosjekt, en aggregator, en markedsplass, en installerkatalog eller
en liste som en katalogoppføring, selv når den er uavhengig installerbar. Bruk den bare som et
spor og løs opp hver uavhengig installerbare underordnede plugin til dens faktiske skaper og
opprinnelige repositorium. En plugin i skaperens ekte monorepo kan sendes inn fra sin eksakte
understi, men den må følge monorepo-stjernepolicyen nedenfor.

## Påkrevd bevis

Oppgi alt følgende i pull requesten:

- Den kanoniske offentlige URL-en til det opprinnelige repositoriet og dets uforanderlige
  repositorium-node-ID. Vedlikeholderne løser node-ID-en og avviser URL-avvik i den separate
  opprinnelsesporten.
- Skaperens offentlige GitHub-handle og tilhørende offentlige profil-URL. YAML-en lagrer
  handlet én gang; profil-URL-en utledes som `https://github.com/<handle>`.
- En fullstendig 40-tegns kildekommit-OID og den eksakte plugin-understien, eller `null` for
  en plugin i repositoriets rot.
- En avgrenset engelsk beskrivelse og dens bevissti ved den fastpinnede kommitten.
- Artefaktens `kind`, primærkategori og tagger valgt fra
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Det fullstendige oppstrøms SPDX-lisensuttrykket, bevist ved den fastpinnede kommitten.
- En kanonisk installasjonsdeskriptor fastpinnet til en eksakt npm-versjon, eller til
  kilderepositoriet, full kommit og understi. Deskriptoren er data, aldri en shell-kommando.
- Bevis for nativ DSH-integrasjon og dets sti ved den fastpinnede kommitten.
- Eksisterende, ikke-sensitivt smoketestbevis for den eksakte artefaktfestingen, eller den
  eksplisitte verdien `not run`. Ikke installer pluginen eller kjør `preinstall`, `install`,
  `postinstall`, `prepare` eller annen pakke-/pluginlivssykluskode bare for å forberede et
  katalogbidrag.
- For et dedikert repositorium, det verifiserbare stjernetallet for det eksakte repositoriet,
  sammen med den offentlige kilden og kontrolltidspunktet. For en monorepo-plugin, bruk den
  påkrevde null-policyen nedenfor.
- Offentlig Discussion- eller kommentaropprinnelse når den finnes; ellers bruk `null`.
- Den maskinlesbare verdien `unofficial: true`.

Hvis det ikke allerede finnes en kvalifiserende smoketest, bruk `verification.status: eligible`
og `verification.smokeTest: null`. Bruk `verified` bare når kontrollerbart smoketestbevis for
den eksakte festingen finnes. Ingen av tilstandene er en godkjenning eller
sikkerhetssertifisering.

Send aldri inn legitimasjon, informasjonskapsler, private e-postadresser, upublisert kildekode
eller andre hemmeligheter.

## YAML- og skjemaregler

Opprett `catalog/plugins/<plugin-id>.yaml` og valider den mot
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` må være lik filens
basenavn og må starte med navnerommet ditt: din `creator.github`-handle med små bokstaver
(enhver sekvens av tegn utenfor `[a-z0-9]` blir en enkelt `-`) etterfulgt av `-`, for eksempel
`some-creator-my-plugin` for handlet `Some-Creator`. Katalogvalideringen håndhever begge. Skjemaet er kilden til sannhet for
feltnavn og tillatte verdier; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) definerer hvordan
man velger den ene artefakttypen, primærkategorien, taggene og repositorieomfanget.

En npm-deskriptor må inneholde et gyldig pakkenavn og en eksakt versjon. Det offentlige
skjemaet avviser option-lignende og ubegrensede verdier, men reimplementerer ikke SemVer eller
SRI: katalogvalideringen må parse versjonen, kreve eksakt SemVer og parse enhver
integritetsverdi som gyldig SHA-512 SRI. En kildedeskriptor bindes til `source.repository`,
`source.commit` og `source.subpath` uten å duplisere mutable kildeverdier.

Installerprogrammer må bruke argumentarrays, deaktivere shell-kjøring og plassere en
opsjonsavslutter før kataloggitte posisjonsverdier når den påkalte kommandoen støtter det.
Innsendingsvalidering må ikke påkalle en installer eller pluginlivssyklus.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` er en lokal, skrivebeskyttet struktur- og semantikksjekk. Den parser sikker
YAML, validerer det offentlige skjemaet, parser SPDX-uttrykk, krever eksakt SemVer og gyldig
SHA-512 SRI, og avviser duplikate ID-er og kanoniske repository-node-pluss-understi-nøkler.
Den kontakter ikke GitHub, løser ikke repositorieidentitet og inspiserer ikke bevisstier ved
den fastpinnede kommitten.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Før en oppføring når `eligible`, løser vedlikeholderne separat det kanoniske repositoriet og
node-ID-en, binder skaperen til den opprinnelige kilden, og inspiserer den deklarerte
beskrivelsen, lisensen, DSH-integrasjonen og smoketestbeviset ved `source.commit`. Et grønt
lokalt valideringsresultat er ikke opprinnelses- eller kildebevis.

## Repositoriestjerner

Bare stjerner som verifiserbart tilhører det eksakte dedikerte pluginrepositoriet, kan
registreres. Et overordnet prosjekts stjerner må aldri tilskrives en plugin som bor inne i et
bredere monorepo. En monorepo-oppføring forblir kvalifisert for funksjonelle
katalogseksjoner, men må deklarere:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

En dedikert oppføring bruker `repositoryScope: dedicated`, `starsPolicy: exact-repository` og
det ikke-negative stjernetallet observert på det samme repositoriet. Les
[docs/RANKING.md](../../docs/RANKING.md) før du sender inn popularitetsdata.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Skaperforrang og respektfull kontakt

For den samme kanoniske pluginen er forrangen:

1. En pull request åpnet av skaperen eller eierorganisasjonen.
2. En fellesskaps-pull-request som er eksplisitt godkjent av skaperen.
3. En eksisterende gyldig fellesskapskuraterings-pull-request.
4. En katalogautomatiserings-pull-request.

En direkte skaper-pull-request fortrenger enhver åpen kuraterings- eller
automatiserings-pull-request, uansett hvilken som åpnet først eller er lengre kommet.
Skaperens pull request blir gjennomgangsfartøyet; vedlikeholderne force-pusher aldri skaperens
branch eller transplanterer arbeidet deres inn i den kuraterte pull requesten. Hvis en
kuratert oppføring allerede er slått sammen, skrives ikke offentlig historie om. Skaperen kan
bruke et krav- eller rettelsesskjema og deretter bidra direkte med en oppfølgende pull
request.

En kuratert pull request bør bruke én respektfull offentlig `@creator`-omtale i beskrivelsen,
ved siden av en lenke til det opprinnelige repositoriet, og invitere skaperen til å gjennomgå
eller erstatte den med en direkte pull request. Ikke gjenta omtalen, åpne promoterende
issues, krysspost, send uoppfordrede direktemeldinger eller på annen måte spamme skaperen.

<!-- creator-first:source-bound-git-identity -->

Skaperforfattede pull requests og kommitter bevarer skaperkreditering naturlig. Kuraterte
commits kan bruke skaperens Git-forfatterskap eller en `Co-authored-by`-trailer bare med en
kildebundet, offentlig verifiserbar identitet. Finn aldri opp eller gjett en e-post. Når ingen
verifisert Git-identitet er tilgjengelig, forfatter kuratoren committen og gir eksplisitt
`Created by @handle`-kreditering med lenke til det opprinnelige repositoriet i YAML-en og pull
requesten. En vedlikeholder- eller automatiseringskonto kan være committer eller verifisert
medforfatter, men må ikke erstatte skaperens forfatterskap. Se
[docs/CREDIT.md](../../docs/CREDIT.md) for den fullstendige policyen.

## Valideringskommandoer og tilgjengelighet

npm-CLI-en publiseres som `omni-dsh-plugins@1.0.1`, så kommandoene nedenfor er tilgjengelige
via `npx` i dag. Bruk dem nøyaktig som skrevet; bidragsytere bør ikke finne på
erstatningskommandoer.

Kjør disse kommandoene fra repositoriets rot:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` utfører bare de lokale YAML-, skjema-, SPDX-, eksakt-SemVer-, SHA-512-SRI-
og duplikatsjekkene beskrevet over, og aksepterer den bevisst tomme katalogen. Den beviser
ikke ekstern repositorieidentitet eller fastpinnet kildebevis. De andre kommandoene sjekker
den påkrevde offentlige dokumentasjonen og de strukturerte GitHub-issue-skjemaene. At disse
kommandoene passerer lokalt, slakker ikke beviskravene; vedlikeholderne anvender fortsatt hver
tilhørende utgivelsesport før sammenslåing.

## Gjennomgangsporter, kollisjoner og sammenslåing

Vedlikeholderne anvender hver port på den gjeldende pull-request-kommitten før sammenslåing:

1. **Omfang:** én dedikert branch, én plugin-YAML-fil og ingen urelaterte endringer.
2. **Opprinnelig identitet:** skaper, kanonisk repositorium, node-ID, full kommit og understi
   samsvarer.
3. **Skjema og bevis:** YAML, kategorier, SPDX, installasjonsfesting, DSH-bevis og
   smoketeststatus er internt konsistente uten å kjøre pluginlivssykluskode.
4. **Popularitet:** dedikerte stjerner er verifiserbare på det eksakte repositoriet, eller
   monorepo-stjerner er `null` med `undefined-parent-repository`.
5. **Dokumentasjon og skjemaer:** offentlige dokumenter, Markdown-fences og strukturerte
   skjemaer forblir gyldige.
6. **Kollisjon og deduplisering:** ingen sammenslått oppføring eller åpen pull request
   representerer den samme kanoniske pluginen.

Ulike navn eller ID-er gjør ikke duplikate plugins forskjellige. Behandle den samme
repositorium-node-ID-en og understien, den samme kanoniske pakken, eller et annet beviselig
identisk installasjonsmål som en kollisjon. Løs aliaser og konkurrerende pull requests før
sammenslåing. En direkte skaper-pull-request vinner en kollisjon med kuratering eller
automatisering; ellers velger vedlikeholderne ett gjennomgangsfartøy og lukker eller omdirigerer
duplikater i stedet for å slå sammen begge.

Bare en vedlikeholder slår sammen en plugin etter at alle porter er bestått. Hver akseptert
plugin slås sammen individuelt; validering, kuratering eller automatisering innebærer ikke
automatisk eller batch-sammenslåing.

## Pull-request-sjekkliste

- [ ] Jeg brukte én dedikert branch, og denne PR-en endrer nøyaktig én pluginoppføring.
- [ ] Kilden er skaperens opprinnelige repositorium, ikke et paraplyprosjekt eller en aggregator.
- [ ] Skaperhandle/profil, repositorium, node-ID, understi og full kommit er bevist.
- [ ] Kind, kategori og tagger følger `docs/CATEGORIES.md`.
- [ ] SPDX-lisensen og den fastpinnede installasjonsdeskriptoren er bevist.
- [ ] Nativ DSH-integrasjon og smoketestresultatet eller `not run`-statusen er bevist.
- [ ] Jeg kjørte ikke plugin- eller pakkelivssykluskode for å forberede dette bidraget.
- [ ] Dedikerte stjerner er verifiserbare, eller monorepo-stjerner bruker den påkrevde null-policyen.
- [ ] Jeg sjekket for en eksisterende oppføring og åpne pull requests for den samme kanoniske pluginen.
- [ ] Oppføringen er eksplisitt uoffisiell og inneholder ingen hemmeligheter eller private personopplysninger.

## Språkpolicy

Oppstartsdokumentasjon og katalogbeskrivelser er kun på engelsk. Utgivelsen til 43 språk
gjenstår som et punkt i backloggen etter MVP; ikke legg til tomme språkdokumenter eller
automatiske masseoversettelser.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
