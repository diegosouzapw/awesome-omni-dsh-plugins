# Referentie schema catalogusinvoer

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Nederlands**

> **Onofficieel communityproject. Niet verbonden aan, goedgekeurd door of gesponsord door DeepSeek.**
> DeepSeek-namen en -merken zijn eigendom van hun respectieve eigenaar.

Dit is de veld-voor-veld-referentie voor [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
het publieke JSON Schema (draft 2020-12) waaraan elk bestand onder `catalog/plugins/` moet
voldoen. Het schemabestand zelf is de bron van waarheid; wanneer deze pagina en het schema van
elkaar afwijken, wint het schema.

Er gelden twee validatielagen. Het publieke schema dwingt begrensde *veilige vormen* af
(patronen en lengtes die optie-achtige of onbegrensde waarden afwijzen). Daarbovenop past
`catalog validate` verplichte semantische parsers toe: exacte SemVer voor versies, SHA-512 SRI
voor integrity-waarden, SPDX-expressie-parsing voor licenties, en afwijzing van dubbele
sleutels. Een waarde kan overeenkomen met het schemapatroon en toch semantisch worden
afgewezen.

Regels op het hoogste niveau: de invoer is één enkel YAML-object, `additionalProperties: false`
(onbekende velden worden afgewezen), en **alle** onderstaande velden zijn verplicht.

## Velden op het hoogste niveau

| Veld              | Type    | Verplicht | Samenvatting                                                  |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ja    | Moet exact `1` zijn                                            |
| `id`              | string  |   ja    | Kleine-letters-kebab-case entry-ID; moet overeenkomen met de bestandsnaam |
| `name`            | string  |   ja    | Weergavenaam, 1–120 tekens                                     |
| `description`     | object  |   ja    | Gecureerde Engelse samenvatting plus het bewijspad ervan        |
| `unofficial`      | const   |   ja    | Moet exact `true` zijn                                         |
| `kind`            | enum    |   ja    | Canonieke artefacttype-discriminator                            |
| `primaryCategory` | enum    |   ja    | Enkele primaire capaciteitscategorie                            |
| `tags`            | array   |   ja    | Unieke kleine-letters-kebab-case-tags (mag leeg zijn)           |
| `source`          | object  |   ja    | Oorspronkelijk repository, node-ID, subpad en vastgepinde commit |
| `creator`         | object  |   ja    | Publieke GitHub-handle van de maker                             |
| `package`         | object  |   ja    | Canonieke installatiedescriptor (npm **of** bron)                |
| `dsh`             | object  |   ja    | DSH-profielen en bewijspad voor native integratie                |
| `repositoryScope` | enum    |   ja    | `dedicated` of `monorepo`                                       |
| `popularity`      | object  |   ja    | Sterrenbeleid en sterrenaantal (voorwaardelijk aan scope)         |
| `license`         | object  |   ja    | Upstream SPDX-licentie-expressie                                 |
| `verification`    | object  |   ja    | Verificatiestatus, controletijdstip, identiteit en smoketest      |
| `provenance`      | object  |   ja    | Publieke Discussion-/comment-URL's of `null`                     |

### `schemaVersion`

Constante `1`. Identificeert publieke schemaversie 1; elke andere waarde is ongeldig.

### `id`

String die overeenkomt met `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kleine-letters-kebab-case, geen
leidende/afsluitende of dubbele koppeltekens. Volgens [CONTRIBUTING.md](../../CONTRIBUTING.md)
moet het invoerbestand `catalog/plugins/<id>.yaml` heten met exact dezelfde waarde; de
validator wijst een mismatch af (`id-filename-mismatch`). De ID moet ook beginnen met de
naamruimte van de maker: de `creator.github`-handle in kleine letters, waarbij elke reeks
tekens buiten `[a-z0-9]` wordt samengevoegd tot één enkele `-`, gevolgd door `-`
(`id-creator-prefix`).

### `name`

Vrije weergavenaam, `minLength: 1`, `maxLength: 120`.

### `description`

Object met precies twee verplichte eigenschappen (geen andere toegestaan):

| Eigenschap     | Type   | Regels                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | Engelse samenvatting, 20–320 tekens                                     |
| `evidencePath` | string | Relatief repo-padpatroon; geen leidende `/`, geen backslashes, geen `.`/`..`-segmenten |

De Engelse samenvatting moet gecureerd zijn vanuit het bestand op `evidencePath` zoals het
bestaat op `source.commit` — niet gekopieerd van een andere catalogus.

### `unofficial`

Constante `true`. Machineleesbaar merkteken dat de vermelding onofficieel is.

### `kind`

De **enige** discriminator voor artefacttype (er bestaat geen tweede integratietype-veld). Eén
van:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Betekenissen en gevolgen voor de ranglijst zijn gedefinieerd in [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Eén van de dertien capaciteitscategorieën:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Weergavelabels en selectierichtlijnen staan in [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array van unieke strings, elk overeenkomend met `^[a-z0-9]+(?:-[a-z0-9]+)*$`
(kleine-letters-kebab-case). Het schema legt geen minimumaantal op.

### `source`

Object met precies vier verplichte eigenschappen:

| Eigenschap          | Type           | Regels                                                                  |
| ------------------- | -------------- | ------------------------------------------------------------------------ |
| `repository`        | string         | URL `https://github.com/<owner>/<repo>`; owner volgt de regels voor GitHub-gebruikersnamen, repositorynaam 1–100 tekens, mag geen `.`/`..` zijn of eindigen op `.git` |
| `repositoryNodeId`  | string         | Onveranderlijk GitHub-repository-node-ID, niet leeg                       |
| `subpath`           | string of null | Pluginsubpad binnen het repository (hetzelfde veilige relatieve-padpatroon als `evidencePath`), of `null` voor een plugin in de repository-root |
| `commit`            | string         | Volledige hexadecimale commit-OID van 40 tekens                           |

Catalogusvalidatie moet `repositoryNodeId` herleiden en een mismatch van de repository-URL
afwijzen — die herleiding is een beheerderscontrole, geen onderdeel van de lokale structurele
check.

### `creator`

Object met één enkele verplichte eigenschap:

| Eigenschap | Type   | Regels                                              |
| ---------- | ------ | ---------------------------------------------------- |
| `github`   | string | GitHub-gebruikersnaam (1–39 tekens, GitHub-handleregels) |

De publieke profiel-URL wordt altijd afgeleid als `https://github.com/<handle>`; er wordt geen
tweede profielveld opgeslagen, zodat de twee nooit kunnen afwijken.

### `package`

De canonieke installatiedescriptor. Het is data, nooit een shellcommando, en neemt precies één
van twee vormen aan (`oneOf`):

**npm-package** — verplicht `ecosystem`, `name`, `version`; optioneel `integrity`:

| Eigenschap  | Type   | Regels                                                                      |
| ----------- | ------ | ----------------------------------------------------------------------------- |
| `ecosystem` | const  | `npm`                                                                          |
| `name`      | string | Vorm van npm-packagenaam (optioneel scoped), max 214 tekens                    |
| `version`   | string | Exacte `x.y.z`-versievorm (optioneel prerelease/build); ranges worden afgewezen. De semantische laag vereist bovendien een parseerbare, exacte SemVer |
| `integrity` | string | Optionele `sha512-…`-SRI-vorm, 8–256 tekens. De semantische laag moet dit parsen als geldige SHA-512 SRI |

**broninstallatie** — alleen `ecosystem` verplicht:

| Eigenschap  | Type  | Regels   |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Een bron-descriptor slaat bewust niets anders op: het repository, de commit en het subpad
worden afgeleid van `source`, zodat muteerbare waarden nooit worden gedupliceerd.

### `dsh`

Bewijs van native DSH-integratie:

| Eigenschap     | Type   | Regels                                                          |
| -------------- | ------ | ------------------------------------------------------------------ |
| `profiles`     | array  | Minstens één unieke profielnaam die overeenkomt met `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Veilig relatief pad naar het bewijs van DSH-integratie op `source.commit` |

### `repositoryScope`

Ofwel `dedicated` (repositorysterren behoren tot deze exacte plugin) ofwel `monorepo` (de
plugin is een subpad of package binnen een breder project). Deze waarde stuurt de
onderstaande voorwaardelijke populariteitsregels.

### `popularity`

| Eigenschap     | Type              | Regels                                                |
| -------------- | ----------------- | ------------------------------------------------------ |
| `starsPolicy`  | enum              | `exact-repository` of `undefined-parent-repository`     |
| `stars`        | integer of null   | Niet-negatief geheel getal, of `null`                   |

Voorwaardelijke regels (afgedwongen door de `allOf`-blokken van het schema):

- `repositoryScope: monorepo` **forceert** `starsPolicy: undefined-parent-repository` en
  `stars: null`. Sterren van het bovenliggende project worden nooit toegeschreven aan een
  monorepo-plugin.
- `repositoryScope: dedicated` **forceert** `starsPolicy: exact-repository` en een geheel getal
  `stars >= 0`.

Zie [docs/RANKING.md](../../docs/RANKING.md) voor hoe deze waarden het rangschikkingspredicaat
voeden.

### `license`

| Eigenschap | Type   | Regels                                                          |
| ---------- | ------ | ------------------------------------------------------------------ |
| `spdx`     | string | Vorm van SPDX-expressie, 2–256 tekens, geen leidend koppelteken     |

Het schema dwingt alleen een veilige tekenvorm af; catalogusvalidatie moet de waarde parsen en
normaliseren met een echte SPDX-expressieparser. Registreer de volledige upstream-expressie
zoals aangetoond op de vastgepinde commit (bijvoorbeeld `Apache-2.0` of `MIT OR GPL-3.0-only`).

### `verification`

Verificatie is van toepassing op `source.commit`. Object met vier verplichte eigenschappen:

| Eigenschap            | Type            | Regels                                                  |
| --------------------- | --------------- | ---------------------------------------------------------- |
| `status`              | enum            | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`           | string          | Als `date-time` opgemaakte tijdstempel van de controle      |
| `repositoryIdentity`  | const           | Moet `resolved` zijn                                        |
| `smokeTest`           | object of null  | Smoketest-record, of `null` wanneer er geen kwalificerende test bestaat |

Indien aanwezig vereist `smokeTest`:

| Eigenschap       | Type   | Regels                                                             |
| ---------------- | ------ | --------------------------------------------------------------------- |
| `installTarget`  | const  | `canonical-install-descriptor` — verwijst naar `package` of de vastgepinde bron zonder muteerbare waarden te dupliceren |
| `check`          | object | Verplicht `name` (packagenaamvorm) en `version` (exacte versievorm) |
| `result`         | const  | `passed` — een mislukte smoketest wordt niet geregistreerd als smoketest |

Voorwaardelijke regel: `status: verified` **vereist** een niet-null `smokeTest`-object.
Invoeren zonder beoordeelbaar smoketest-bewijs gebruiken `status: eligible` en
`smokeTest: null`. Geen enkele status is een goedkeuring of beveiligingscertificering — zie
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Publieke herkomstlinks, elk een URI of `null`:

| Eigenschap    | Type            | Regels                                             |
| ------------- | --------------- | ----------------------------------------------------- |
| `discussion`  | string of null  | Publieke Discussion-URL indien aanwezig                |
| `comment`     | string of null  | Publieke comment-URL indien aanwezig                   |

## Wat het schema niet controleert

Het schema is bewust lokaal en structureel. Het controleert **niet** of het repository bestaat,
of het node-ID overeenkomt met de URL, of bewijspaden bestaan op de vastgepinde commit, of het
sterrenaantal accuraat is, of dat de maker eigenaar is van de bron. Die controles horen bij de
beoordelingscontroles van beheerders die zijn beschreven in [CONTRIBUTING.md](../../CONTRIBUTING.md) en
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
