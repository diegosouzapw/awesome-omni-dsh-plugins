# Bidra

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Tack för att du förbättrar katalogen. Bidrag är skaparcentrerade: använd bevis från det
ursprungliga repositoryt, bevara attributionen och håll varje plugin oberoende granskningsbar.
Katalogen börjar tom med flit; ingen post accepteras utan sin egen granskade pull request.

## Börja med skaparen

En pull request som öppnas direkt av pluginskaparen eller den ägande organisationen föredras
alltid. Om skaparen är redo att bidra, använd deras branch och pull request i stället för att
återskapa deras arbete i en kurator- eller automatiseringsbranch.

Community-kuratering är välkommen när den hjälper en skapare som inte har öppnat en pull request.
Den upprättar inte ägandeskap eller företräde framför ett senare direkt skaparbidrag.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## En plugin per branch och pull request

Skapa en dedikerad branch för en plugin och öppna en pull request från den branchen. Branchen och
pull requesten måste skapa eller ändra exakt en YAML-fil under `catalog/plugins/`. Blanda inte
plugins, dokumentationsstädning, genererade index eller orelaterat underhåll i den branchen eller
pull requesten.

Post-ID:t och filnamnet måste vara samma värde i lowercase kebab-case. Underhållare granskar och
slår samman varje plugin-pull-request individuellt; en batch som innehåller flera plugins delas
inte upp eller slås samman delvis.

## Lös originalkällan

Varje offentligt fält måste rekonstrueras från skaparens ursprungliga repository, paket, manifest,
README, licens eller release vid den fastnålade commiten. Kopiera inte ett annat catalogs eller en
annan aggregators prosa, kategoritilldelning, skärmdumpar, rankning, badges eller genererad
metadata. En länk som hittas i ett paraplyprojekt, en marknadsplats, en lista eller en aggregator
är bara en ledtråd, inte ett bevis och inte pluginkällan.

Skicka aldrig in ett paraplyprojekt, en aggregator, en marknadsplats, en installationskatalog
eller en lista som en katalogpost, även när den är självständigt installerbar. Använd den bara som
en ledtråd och lös varje självständigt installerbar underplugin till dess faktiska skapare och
ursprungliga repository. En plugin i skaparens riktiga monorepo kan skickas in från sin exakta
understig, men måste följa monorepo-stjärnpolicyn nedan.

## Nödvändiga bevis

Tillhandahåll allt följande i pull requesten:

- Den kanoniska offentliga URL:en till det ursprungliga repositoryt och dess oföränderliga
  repository-node-ID. Underhållare löser node-ID:t och avvisar URL-avvikelser i den separata
  proveniensgrinden.
- Skaparens offentliga GitHub-handle och matchande offentliga profil-URL. YAML lagrar handlet en
  gång; profil-URL:en härleds som `https://github.com/<handle>`.
- En fullständig 40-teckens källcommit-OID och pluginets exakta understig, eller `null` för en
  plugin i repositoryts rot.
- En avgränsad engelsk beskrivning och dess bevisstig vid den fastnålade commiten.
- Artefaktens `kind`, primära kategori och taggar valda från
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Det fullständiga upstream SPDX-licensuttrycket, belagt vid den fastnålade commiten.
- En kanonisk installationsdeskriptor fastnålad vid en exakt npm-version, eller vid
  källrepositoryt, fullständig commit och understig. Deskriptorn är data, aldrig ett
  skalkommando.
- Bevis på native DSH-integration och dess stig vid den fastnålade commiten.
- Befintliga, icke-känsliga röktestbevis för den exakta artefakt-pin:en, eller det uttryckliga
  värdet `not run`. Installera inte pluginet och kör inte `preinstall`, `install`, `postinstall`,
  `prepare` eller annan paket-/pluginlivscykelkod bara för att förbereda ett katalogbidrag.
- För ett dedikerat repository, det verifierbara stjärnantalet för exakt det repositoryt,
  tillsammans med den offentliga källan och kontrolltidpunkten. För en monorepo-plugin, använd den
  nödvändiga null-policyn nedan.
- Offentlig Discussion- eller kommentarproveniens när sådan finns; använd annars `null`.
- Det maskinläsbara värdet `unofficial: true`.

Om ett kvalificerande röktest inte redan finns, använd `verification.status: eligible` och
`verification.smokeTest: null`. Använd `verified` endast när granskningsbara röktestbevis för den
exakta pin:en finns. Inget av tillstånden är ett godkännande eller en säkerhetscertifiering.

Skicka aldrig in autentiseringsuppgifter, cookies, privata e-postadresser, opublicerad källkod
eller andra hemligheter.

## YAML- och schemaregler

Skapa `catalog/plugins/<plugin-id>.yaml` och validera den mot
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` måste vara identiskt med
filens basnamn och måste börja med ditt namnrum: ditt `creator.github`-handle i gemener (varje
följd av tecken utanför `[a-z0-9]` blir ett enda `-`) följt av `-`, till exempel
`some-creator-my-plugin` för handlet `Some-Creator`. Katalogvalideringen upprätthåller båda
delarna. Schemat är sanningskällan för fältnamn och tillåtna värden;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) definierar hur man väljer den enda artefakttypen,
primär kategori, taggar och repository-omfattning.

En npm-deskriptor måste innehålla ett giltigt paketnamn och en exakt version. Det offentliga
schemat avvisar optionliknande och obegränsade värden men återimplementerar inte SemVer eller SRI:
katalogvalideringen måste parsa versionen, kräva exakt SemVer och parsa varje integritetsvärde som
giltig SHA-512 SRI. En källdeskriptor binds till `source.repository`, `source.commit` och
`source.subpath` utan att duplicera föränderliga källvärden.

Installationsprogram måste använda argumentarrayer, inaktivera skalkörning och placera en
optionsterminator före katalogtillhandahållna positionella värden när det anropade kommandot
stöder det. Inskickningsvalidering får inte anropa ett installationsprogram eller pluginets
livscykel.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` är en lokal, skrivskyddad strukturell och semantisk kontroll. Den parsar säker
YAML, validerar det offentliga schemat, parsar SPDX-uttryck, kräver exakt SemVer och giltig
SHA-512 SRI samt avvisar dubblett-ID:n och kanoniska
repository-nod-plus-understig-nycklar. Den kontaktar inte GitHub, löser inte repository-identitet
och inspekterar inte bevisstigar vid den fastnålade commiten.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Innan en post når `eligible` löser underhållare separat det kanoniska repositoryt och node-ID:t,
binder skaparen till originalkällan och inspekterar den angivna beskrivningen, licensen,
DSH-integrationen och röktestbevisen vid `source.commit`. Ett grönt lokalt valideringsresultat är
inte ett bevis på proveniens eller ursprung.

## Repository-stjärnor

Endast stjärnor som verifierbart tillhör exakt det dedikerade pluginrepositoryt får registreras.
Ett överordnat projekts stjärnor får aldrig tillskrivas en plugin som lagras inuti ett bredare
monorepo. En monorepo-post förblir behörig för funktionella katalogsektioner men måste deklarera:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

En dedikerad post använder `repositoryScope: dedicated`, `starsPolicy: exact-repository` och det
icke-negativa stjärnantal som observeras på samma repository. Läs
[docs/RANKING.md](../../docs/RANKING.md) innan du skickar in popularitetsdata.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Skaparföreträde och respektfull kontakt

För samma kanoniska plugin är företrädesordningen:

1. En pull request som öppnas av skaparen eller den ägande organisationen.
2. En community-pull-request som uttryckligen godkänts av skaparen.
3. En befintlig giltig community-kuraterings-pull-request.
4. En katalogautomatiserings-pull-request.

En direkt pull request från skaparen ersätter varje öppen kuraterings- eller
automatiserings-pull-request, oavsett vilken som öppnades först eller är längre kommen. Skaparens
pull request blir granskningsfordonet; underhållare force-pushar inte skaparens branch eller
flyttar över deras arbete till den kuraterade pull requesten. Om en kuraterad post redan har
slagits samman skrivs den offentliga historiken inte om. Skaparen kan använda en anspråks- eller
korrigeringsbegäran och därefter bidra med en uppföljande pull request direkt.

En kuraterad pull request bör använda ett respektfullt offentligt `@creator`-omnämnande i sin
beskrivning, bredvid en länk till det ursprungliga repositoryt, och bjuda in skaparen att granska
eller ersätta den med en direkt pull request. Upprepa inte omnämnandet, öppna inte kampanjartade
issues, korspublicera inte, skicka inte oönskade direktmeddelanden eller spamma skaparen på annat
sätt.

<!-- creator-first:source-bound-git-identity -->

Pull requests och commits författade av skaparen bevarar naturligt skaparkrediten. Kuraterade
commits får använda skaparens Git-författarskap eller en `Co-authored-by`-trailer endast med en
källbunden, offentligt verifierbar identitet. Uppfinna eller gissa aldrig en e-postadress. När
ingen verifierad Git-identitet är tillgänglig författar kuratorn commiten och ger uttrycklig
kredit i form av `Created by @handle` med länk till det ursprungliga repositoryt i YAML:en och
pull requesten. Ett underhållar- eller automatiseringskonto får vara committer eller verifierad
medförfattare, men får inte ersätta skaparens författarskap. Se
[docs/CREDIT.md](../../docs/CREDIT.md) för den fullständiga policyn.

## Valideringskommandon och tillgänglighet

npm-CLI:t publiceras som `omni-dsh-plugins@1.0.1`, så kommandona nedan är tillgängliga via `npx`
idag. Använd dem exakt som de är skrivna; bidragsgivare bör inte uppfinna ersättningskommandon.

Kör dessa kommandon från repositoryts rot:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` utför endast de lokala kontrollerna av YAML, schema, SPDX, exakt SemVer,
SHA-512 SRI och dubbletter som beskrivs ovan, och accepterar den avsiktligt tomma katalogen. Den
bevisar inte fjärrrepository-identitet eller fastnålade källbevis. De övriga kommandona
kontrollerar den nödvändiga offentliga dokumentationen och de strukturerade
GitHub-issue-formulären. Att dessa kommandon godkänns lokalt slappnar inte av beviskraven;
underhållare tillämpar fortfarande varje motsvarande releasegrind före sammanslagning.

## Granskningsgrindar, kollisioner och sammanslagning

Underhållare tillämpar varje grind på den aktuella pull request-commiten före sammanslagning:

1. **Omfattning:** en dedikerad branch, en plugin-YAML-fil och inga orelaterade ändringar.
2. **Ursprunglig identitet:** skapare, kanoniskt repository, node-ID, fullständig commit och
   understig stämmer överens.
3. **Schema och bevis:** YAML, kategorier, SPDX, installations-pin, DSH-bevis och rökteststatus är
   internt konsekventa utan att köra pluginets livscykelkod.
4. **Popularitet:** dedikerade stjärnor är verifierbara på det exakta repositoryt, eller så är
   monorepo-stjärnor `null` med `undefined-parent-repository`.
5. **Dokumentation och formulär:** offentlig dokumentation, Markdown-kodblock och strukturerade
   formulär förblir giltiga.
6. **Kollision och deduplicering:** ingen sammanslagen post eller öppen pull request representerar
   samma kanoniska plugin.

Olika namn eller ID:n gör inte duplicerade plugins åtskilda. Behandla samma repository-node-ID och
understig, samma kanoniska paket eller ett annat bevisligen identiskt installationsmål som en
kollision. Lös alias och konkurrerande pull requests före sammanslagning. En direkt pull request
från skaparen vinner en kollision med kuratering eller automatisering; annars väljer underhållarna
ett granskningsfordon och stänger eller omdirigerar dubbletter i stället för att slå samman båda.

Endast en underhållare slår samman en plugin efter att alla grindar har godkänts. Varje
accepterad plugin slås samman individuellt; validering, kuratering eller automatisering innebär
inte automatisk eller batchvis sammanslagning.

## Pull request-checklista

- [ ] Jag använde en dedikerad branch och denna PR ändrar exakt en pluginpost.
- [ ] Källan är skaparens ursprungliga repository, inte ett paraplyprojekt eller en aggregator.
- [ ] Skaparens handle/profil, repository, node-ID, understig och fullständiga commit är belagda.
- [ ] Kind, kategori och taggar följer `docs/CATEGORIES.md`.
- [ ] SPDX-licensen och den fastnålade installationsdeskriptorn är belagda.
- [ ] Native DSH-integration och röktestresultatet eller statusen `not run` är belagda.
- [ ] Jag körde inte plugin- eller paketlivscykelkod för att förbereda detta bidrag.
- [ ] Dedikerade stjärnor är verifierbara, eller så använder monorepo-stjärnor den nödvändiga
      null-policyn.
- [ ] Jag kontrollerade om det finns en befintlig post och öppen pull request för samma kanoniska
      plugin.
- [ ] Posten är uttryckligen inofficiell och innehåller inga hemligheter eller privata
      personuppgifter.

## Språkpolicy

Lanseringsdokumentation och katalogbeskrivningar är endast på engelska. Utrullningen till 43
språkversioner förblir ett backlog-objekt efter MVP; lägg inte till tomma språkversiondokument
eller automatiska massöversättningar.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
