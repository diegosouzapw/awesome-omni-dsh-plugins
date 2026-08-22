# Catalogusgovernance

> 🌐 [English](../../docs/GOVERNANCE.md) · **Nederlands**

> **Onofficieel communityproject. Niet verbonden aan, goedgekeurd door of gesponsord door DeepSeek.**
> DeepSeek-namen en -merken zijn eigendom van hun respectieve eigenaar.

Hoe de publieke catalogus wordt bestuurd: wie beslist wat er binnenkomt, in welke volgorde
concurrerende bijdragen worden gehonoreerd, welke controles automatisch draaien, en welke
oordelen menselijk blijven. Het beleid waarnaar hier wordt verwezen leeft in
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) en
[docs/RANKING.md](../../docs/RANKING.md); deze pagina beschrijft hoe ze in elkaar passen.

## Principes

1. **Voorrang voor de maker.** De catalogus bestaat om het werk van makers vindbaar te maken,
   nooit om het eigendom ervan over te nemen. Voor dezelfde canonieke plugin heeft een directe
   pull request van de maker voorrang op elke openstaande community-curatie- of
   automatiseringspull-request — de volledige voorrangsvolgorde en Git-identiteitsregels staan
   in [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Eén plugin, één beoordeelde pull request.** Geen batchmerges, geen gegenereerde
   bulkimporten in de publieke catalogus. Elke invoer verdient zijn eigen beoordeling.
3. **Bewijs boven vertrouwen.** Elk publiek veld herleidt naar het oorspronkelijke repository
   van de maker op een vastgepinde commit. Een groene geautomatiseerde controle wordt nooit
   geaccepteerd als bewijs van oorsprong.
4. **Altijd onofficieel.** Geen enkele catalogusstatus wordt gepresenteerd als beoordeling,
   certificering of goedkeuring door DeepSeek.

## Hoe wijzigingen op `main` terechtkomen

Alle wijzigingen bereiken `main` via beoordeelde pull requests — er zijn geen directe pushes.
Het werkbeleid voor de standaardbranch:

- **Alleen pull requests.** Catalogusinvoeren, documentatie- en schemawijzigingen komen
  allemaal binnen via een PR; catalogus-PR's moeten de regel "één plugin per branch" uit
  [CONTRIBUTING.md](../../CONTRIBUTING.md) volgen.
- **Lineaire geschiedenis.** PR's worden geïntegreerd zodat `main` een lineaire, controleerbare
  geschiedenis behoudt; gemergede publieke geschiedenis wordt niet herschreven. Als een
  gecureerde invoer werd gemerged voordat een maker zich meldde, claimt of corrigeert de maker
  die in een vervolgbijdrage in plaats van een herschrijving van de geschiedenis.
- **Oplossing van beoordelingsdraden.** Beoordelingsgesprekken worden opgelost vóór de merge;
  onopgeloste feedback blokkeert integratie.
- **Merge door beheerder.** Alleen een beheerder merget een plugininvoer, en pas nadat elke
  controle in [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Beoordelingscontroles, botsingen en
  merge" is geslaagd op de huidige PR-commit.

## De controle `catalog-validation`

Elke pull request die `catalog/plugins/`, `schemas/` of de workflow zelf raakt, voert de taak
`catalog-validation` uit (`.github/workflows/validate-catalog.yml`), vastgepind op de
gepubliceerde CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Wat het valideert** — alleen lokale structuur en semantiek:

- Veilige YAML-parsing van elke invoer onder `catalog/plugins/`.
- Naleving van het publieke schema (zie [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX-expressie-parsing, exacte SemVer-versies, geldige SHA-512-SRI-integrity-waarden.
- Afwijzing van duplicaten: geen herhaalde invoer-ID's en geen herhaalde canonieke
  repository-node-plus-subpad-sleutels.
- De opzettelijk lege catalogus slaagt (`0 entries valid; catalog is empty`).

**Wat het NIET valideert** — en dus wat een groene controle nooit bewijst:

- Identiteit van een extern repository: het benadert GitHub niet en herleidt het
  repository-node-ID niet tegen de URL.
- Bewijs op de vastgepinde commit: beschrijvingen, licenties, DSH-integratie en smoketest-bewijs
  worden niet opgehaald of geïnspecteerd.
- Eigenaarschap van de maker, sterrenaantallen, of botsing met openstaande pull requests.

Die oordelen horen bij de aparte herkomstcontroles van beheerders, toegepast vóór de merge en
beschreven in [CONTRIBUTING.md](../../CONTRIBUTING.md). De lokale controle is de ondergrens,
niet de norm.

## Verificatiestatussen

Verificatie wordt per invoer geregistreerd tegen de exacte vastgepinde commit, met behulp van
de statussen gedefinieerd in het publieke schema (`eligible`, `verified`, `stale`,
`unavailable`, `archived`, `quarantined`). De twee positieve statussen zijn opzettelijk smal:

- `eligible` — de publieke structuur en native DSH-integratie zijn gevalideerd.
- `verified` — bovendien is een installatiesmoketest geslaagd voor de vastgepinde bron of het
  vastgepinde package; het schema vereist dat het smoketest-record aanwezig is.

Geen van beide statussen — noch enige andere — is een goedkeuring, garantie of
beveiligingscertificering. De volledige semantiek, inclusief hoe statussen samenwerken met de
rangschikking, staat in [docs/RANKING.md](../../docs/RANKING.md); de vorm van het record staat
in [docs/SCHEMA.md](../../docs/SCHEMA.md).

## Claims, correcties en verwijderingen

Gestructureerde GitHub-issue-formulieren (`.github/ISSUE_TEMPLATE/`) zijn het bestuurde pad om
een invoer te wijzigen die u niet zelf hebt ingediend:

| Formulier      | Wie het gebruikt                              | Uitkomst                                             |
| -------------- | ---------------------------------------- | ------------------------------------------------------- |
| **Claim**      | Een maker wiens plugin door iemand anders is gecureerd | Eigenaarschap wordt gebonden aan de oorspronkelijke bron; de maker kan daarna direct bijdragen |
| **Correctie**  | Iedereen die onnauwkeurige publieke metadata opmerkt | Een beoordeelde correctie van de betrokken invoer |
| **Verwijdering** | Een maker die zijn vermelding verwijderd wil hebben, of een melder van een beleidsschending | Beoordeelde verwijdering of quarantaine van de invoer |

Regels die voor alle drie de stromen gelden:

- Eigendomsclaims moeten worden onderbouwd met verifieerbaar publiek bewijs (eigendom van het
  repository, auteurschap van het package, manifestmetadata of vastgepinde bron­geschiedenis) —
  het plaatsen van een reactie op een Discussion vestigt geen makerschap
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Beveiligingsproblemen in een vermelde plugin gaan eerst naar de eigen beheerder van die
  plugin; de catalogus handelt daarna de correctie of quarantaine af zonder
  exploitdetails te publiceren ([SECURITY.md](../../SECURITY.md)).
- Neem nooit inloggegevens, privécontactgegevens of andere geheimen op in een formulier.

## Rollen

- **Makers** zijn eigenaar van hun plugins en de voorrang van hun vermeldingen. Ze kunnen
  rechtstreeks bijdragen, community-curatie goedkeuren, of een bestaande invoer
  claimen/corrigeren/verwijderen.
- **Community-bijdragers** mogen invoeren cureren voor makers die nog niet hebben bijgedragen,
  onder de regels voor respectvol contact en credit in [docs/CREDIT.md](../../docs/CREDIT.md).
  Curatie staat nooit boven een latere directe bijdrage van de maker.
- **Beheerders** beoordelen, passen de herkomstcontroles toe, lossen botsingen op en mergen. Ze
  onderhouden ook de website ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online))
  en de gepubliceerde CLI vanuit privébroncode; de publieke data, het schema en het beleid van
  deze repository zijn wat die oppervlakken gebruiken.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
