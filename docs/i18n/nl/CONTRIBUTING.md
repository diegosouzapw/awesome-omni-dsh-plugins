# Bijdragen

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Nederlands**

> **Onofficieel communityproject. Niet verbonden aan, goedgekeurd door of gesponsord door DeepSeek.**
> DeepSeek-namen en -merken zijn eigendom van hun respectieve eigenaar.

Bedankt dat u de catalogus verbetert. Bijdragen hebben voorrang voor de maker: gebruik bewijs
uit het oorspronkelijke repository, behoud attributie en houd elke plugin onafhankelijk
beoordeelbaar. De catalogus begint met opzet leeg; geen enkele invoer wordt geaccepteerd zonder
een eigen beoordeelde pull request.

## Begin bij de maker

Een pull request die rechtstreeks door de maker van de plugin of de eigenaarsorganisatie is
geopend, heeft altijd de voorkeur. Als de maker klaar is om bij te dragen, gebruik dan diens
branch en pull request in plaats van hun werk opnieuw te maken in een curator- of
automatiseringsbranch.

Community-curatie is welkom wanneer die een maker helpt die nog geen pull request heeft geopend.
Het vestigt geen eigendom of voorrang boven een latere directe bijdrage van de maker.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Eén plugin per branch en pull request

Maak een toegewijde branch voor één plugin en open één pull request vanuit die branch. De
branch en pull request moeten precies één YAML-bestand onder `catalog/plugins/` aanmaken of
wijzigen. Meng in die branch of pull request geen plugins, opschoning van documentatie,
gegenereerde indexen of niet-gerelateerd onderhoud.

De entry-ID en bestandsnaam moeten dezelfde kleine-letters-kebab-case-waarde zijn. Beheerders
beoordelen en mergen elke plugin-pull-request afzonderlijk; een batch met meerdere plugins wordt
niet gesplitst of gedeeltelijk gemerged.

## Herleid naar de oorspronkelijke bron

Elk publiek veld moet worden gereconstrueerd vanuit het oorspronkelijke repository, package,
manifest, README, licentie of release van de maker, op de vastgepinde commit. Kopieer geen
proza, categorie-indeling, screenshots, ranglijst, badges of gegenereerde metadata van een
andere catalogus of aggregator. Een link gevonden in een overkoepelend project, marktplaats,
lijst of aggregator is slechts een aanwijzing, geen bewijs en niet de plugin-bron.

Dien nooit een overkoepelend project, aggregator, marktplaats, installatiecatalogus of lijst in
als catalogusinvoer, zelfs niet wanneer die onafhankelijk installeerbaar is. Gebruik het alleen
als aanwijzing en herleid elke onafhankelijk installeerbare kindplugin naar de werkelijke maker
en het oorspronkelijke repository. Een plugin in het echte monorepo van zijn maker kan worden
ingediend vanaf het exacte subpad, maar moet het onderstaande monorepo-sterrenbeleid volgen.

## Vereist bewijs

Lever alles van het volgende in de pull request:

- De canonieke publieke URL van het oorspronkelijke repository en het onveranderlijke
  repository-node-ID. Beheerders herleiden het node-ID en wijzen URL-mismatches af in de
  aparte herkomstcontrole.
- De publieke GitHub-handle van de maker en de bijbehorende publieke profiel-URL. YAML slaat de
  handle eenmaal op; de profiel-URL wordt afgeleid als `https://github.com/<handle>`.
- Een volledige commit-OID van 40 tekens van de bron en het exacte subpad van de plugin, of
  `null` voor een plugin in de repository-root.
- Een begrensde Engelse beschrijving en het bewijspad daarvan op die vastgepinde commit.
- Het artefact-`kind`, de primaire categorie en tags gekozen uit
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- De volledige upstream SPDX-licentie-expressie, aangetoond op de vastgepinde commit.
- Een canonieke installatiedescriptor vastgepind op een exacte npm-versie, of op het
  bronrepository, de volledige commit en het subpad. De descriptor is data, nooit een
  shellcommando.
- Bewijs van native DSH-integratie en het pad daarvan op de vastgepinde commit.
- Bestaand, niet-gevoelig smoketest-bewijs voor die exacte artefactpin, of de expliciete waarde
  `not run`. Installeer de plugin niet en voer geen `preinstall`, `install`, `postinstall`,
  `prepare` of andere levenscycluscode van het package/de plugin uit enkel om een
  catalogusbijdrage voor te bereiden.
- Voor een toegewijde repository, het verifieerbare aantal sterren voor die exacte repository,
  samen met de publieke bron en het controletijdstip. Voor een monorepo-plugin, gebruik het
  vereiste null-beleid hieronder.
- Publieke Discussion- of comment-herkomst indien aanwezig; gebruik anders `null`.
- De machineleesbare waarde `unofficial: true`.

Als er nog geen kwalificerende smoketest bestaat, gebruik dan `verification.status: eligible` en
`verification.smokeTest: null`. Gebruik `verified` alleen wanneer beoordeelbaar smoketest-bewijs
voor de exacte pin bestaat. Geen van beide statussen is een goedkeuring of
beveiligingscertificering.

Dien nooit inloggegevens, cookies, privé-e-mailadressen, ongepubliceerde bron of andere geheimen
in.

## YAML- en schemaregels

Maak `catalog/plugins/<plugin-id>.yaml` aan en valideer het tegen
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). De `id` moet gelijk zijn aan
de basisnaam van het bestand en moet beginnen met uw naamruimte: uw `creator.github`-handle in
kleine letters (elke reeks tekens buiten `[a-z0-9]` wordt één enkele `-`) gevolgd door `-`,
bijvoorbeeld `some-creator-my-plugin` voor de handle `Some-Creator`. Catalogusvalidatie dwingt
beide af. Het schema is de bron van waarheid voor veldnamen en toegestane waarden;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) definieert hoe u het enkele artefacttype, de
primaire categorie, tags en repository-omvang kiest.

Een npm-descriptor moet een geldige packagenaam en exacte versie bevatten. Het publieke schema
wijst optie-achtige en onbegrensde waarden af, maar herimplementeert geen SemVer of SRI:
catalogusvalidatie moet de versie parsen, exacte SemVer vereisen en elke integrity-waarde
parsen als geldige SHA-512 SRI. Een bron-descriptor is gebonden aan `source.repository`,
`source.commit` en `source.subpath` zonder muteerbare bronwaarden te dupliceren.

Installateurs moeten argumentarrays gebruiken, shell-uitvoering uitschakelen en een
optie-terminator plaatsen vóór door de catalogus geleverde positionele waarden, waar het
aangeroepen commando dit ondersteunt. Indieningsvalidatie mag geen installateur of
plugin-levenscyclus aanroepen.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` is een lokale, alleen-lezen structurele en semantische controle. Het parst
veilige YAML, valideert het publieke schema, parst SPDX-expressies, vereist exacte SemVer en
geldige SHA-512 SRI, en wijst dubbele ID's en canonieke sleutels van repository-node-plus-subpad
af. Het benadert GitHub niet, herleidt geen repository-identiteit en inspecteert geen
bewijspaden op de vastgepinde commit.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Voordat een invoer `eligible` bereikt, herleiden beheerders afzonderlijk het canonieke
repository en node-ID, binden ze de maker aan de oorspronkelijke bron, en inspecteren ze de
opgegeven beschrijving, licentie, DSH-integratie en smoketest-bewijs op `source.commit`. Een
lokaal groen validatieresultaat is geen herkomst- of oorsprongsbewijs.

## Repository-sterren

Alleen sterren die verifieerbaar tot de exacte toegewijde pluginrepository behoren, mogen worden
vastgelegd. De sterren van een bovenliggend project mogen nooit worden toegeschreven aan een
plugin die is opgeslagen in een bredere monorepo. Een monorepo-invoer blijft geschikt voor
functionele catalogussecties, maar moet het volgende declareren:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Een toegewijde invoer gebruikt `repositoryScope: dedicated`, `starsPolicy: exact-repository` en
het niet-negatieve sterrenaantal waargenomen op dat exacte repository. Lees
[docs/RANKING.md](../../docs/RANKING.md) voordat u populariteitsgegevens indient.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Voorrang voor de maker en respectvol contact

Voor dezelfde canonieke plugin geldt de volgende voorrang:

1. Een pull request geopend door de maker of eigenaarsorganisatie.
2. Een community-pull-request die expliciet door de maker is goedgekeurd.
3. Een bestaande geldige community-curatie-pull-request.
4. Een catalogusautomatisering-pull-request.

Een directe pull request van de maker heeft voorrang op elke openstaande curatie- of
automatiseringspull-request, ongeacht wie eerder werd geopend of verder gevorderd is. De
pull request van de maker wordt het beoordelingsvoertuig; beheerders forceren geen push naar
de branch van de maker en verplaatsen diens werk niet naar de gecureerde pull request. Als een
gecureerde invoer al is gemerged, wordt de publieke geschiedenis niet herschreven. De maker kan
een claim- of correctieverzoek gebruiken en vervolgens rechtstreeks een vervolg-pull-request
indienen.

Een gecureerde pull request moet één respectvolle publieke `@creator`-vermelding in de
beschrijving gebruiken, naast een link naar het oorspronkelijke repository, om de maker uit te
nodigen deze te beoordelen of te vervangen door een directe pull request. Herhaal de vermelding
niet, open geen promotionele issues, cross-post niet, stuur geen ongevraagde directe berichten
en spam de maker op geen enkele andere manier.

<!-- creator-first:source-bound-git-identity -->

Pull requests en commits van de maker zelf behouden de credit van de maker vanzelf. Gecureerde
commits mogen het Git-auteurschap van de maker of een `Co-authored-by`-trailer alleen gebruiken
met een bronsgebonden, publiek verifieerbare identiteit. Verzin of raad nooit een e-mailadres.
Wanneer geen geverifieerde Git-identiteit beschikbaar is, is de curator de auteur van de commit
en geeft die expliciete credit `Created by @handle` met de link naar het oorspronkelijke
repository in de YAML en de pull request. Een beheerders- of automatiseringsaccount mag
committer of geverifieerde mede-auteur zijn, maar mag het auteurschap van de maker niet
vervangen. Zie [docs/CREDIT.md](../../docs/CREDIT.md) voor het volledige beleid.

## Validatiecommando's en beschikbaarheid

De npm-CLI wordt gepubliceerd als `omni-dsh-plugins@1.0.1`, dus de onderstaande commando's zijn
vandaag beschikbaar via `npx`. Gebruik ze precies zoals geschreven; bijdragers mogen geen
vervangende commando's verzinnen.

Voer deze commando's uit vanuit de root van de repository:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` voert alleen de lokale YAML-, schema-, SPDX-, exacte-SemVer-, SHA-512-SRI- en
duplicaatcontroles uit die hierboven zijn beschreven, en accepteert de opzettelijk lege
catalogus. Het bewijst geen identiteit van een extern repository of vastgepind bronbewijs. De
andere commando's controleren de vereiste publieke documentatie en gestructureerde
GitHub-issue-formulieren. Het lokaal slagen van deze commando's versoepelt de
bewijsvereisten niet; beheerders passen nog steeds elke bijbehorende release-controle toe vóór
het mergen.

## Beoordelingscontroles, botsingen en merge

Beheerders passen elke controle toe op de huidige pull-request-commit vóór het mergen:

1. **Scope:** één toegewijde branch, één plugin-YAML-bestand en geen niet-gerelateerde
   wijzigingen.
2. **Oorspronkelijke identiteit:** maker, canoniek repository, node-ID, volledige commit en
   subpad komen overeen.
3. **Schema en bewijs:** YAML, categorieën, SPDX, installatiepin, DSH-bewijs en smoketest-status
   zijn intern consistent zonder plugin-levenscycluscode uit te voeren.
4. **Populariteit:** toegewijde sterren zijn verifieerbaar op het exacte repository, of
   monorepo-sterren zijn `null` met `undefined-parent-repository`.
5. **Documentatie en formulieren:** publieke documentatie, Markdown-fences en gestructureerde
   formulieren blijven geldig.
6. **Botsing en deduplicatie:** geen gemergede invoer of openstaande pull request vertegenwoordigt
   dezelfde canonieke plugin.

Verschillende namen of ID's maken duplicaatplugins niet onderscheidend. Behandel hetzelfde
repository-node-ID en subpad, hetzelfde canonieke package, of een ander aantoonbaar identiek
installatiedoel als een botsing. Los aliassen en concurrerende pull requests op vóór de merge.
Een directe pull request van de maker wint een botsing met curatie of automatisering; anders
selecteren beheerders één beoordelingsvoertuig en sluiten of verwijzen ze duplicaten door in
plaats van beide te mergen.

Alleen een beheerder merget een plugin nadat alle controles zijn geslaagd. Elke geaccepteerde
plugin wordt afzonderlijk gemerged; validatie, curatie of automatisering impliceert geen
automatische of batchmerge.

## Pull-request-checklist

- [ ] Ik heb één toegewijde branch gebruikt en deze PR wijzigt precies één plugininvoer.
- [ ] De bron is het oorspronkelijke repository van de maker, geen overkoepelend project of
      aggregator.
- [ ] De handle/het profiel, het repository, het node-ID, het subpad en de volledige commit van
      de maker zijn aangetoond.
- [ ] Het kind, de categorie en de tags volgen `docs/CATEGORIES.md`.
- [ ] De SPDX-licentie en de vastgepinde installatiedescriptor zijn aangetoond.
- [ ] Native DSH-integratie en het smoketest-resultaat of de status `not run` zijn aangetoond.
- [ ] Ik heb geen plugin- of package-levenscycluscode uitgevoerd om deze bijdrage voor te
      bereiden.
- [ ] Toegewijde sterren zijn verifieerbaar, of monorepo-sterren gebruiken het vereiste
      null-beleid.
- [ ] Ik heb gecontroleerd op een bestaande invoer en openstaande pull request voor dezelfde
      canonieke plugin.
- [ ] De invoer is expliciet onofficieel en bevat geen geheimen of privé-persoonsgegevens.

## Taalbeleid

Lanceringsdocumentatie en catalogusbeschrijvingen zijn alleen in het Engels. De uitrol naar 43
locales blijft een backlogitem na de MVP; voeg geen lege locale-documenten of automatische
bulkvertalingen toe.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
