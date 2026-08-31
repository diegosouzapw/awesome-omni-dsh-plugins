# Katalogpostens schemareferens

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Detta är fält-för-fält-referensen för
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), det offentliga JSON-schemat
(draft 2020-12) som varje fil under `catalog/plugins/` måste uppfylla. Själva schemafilen är
sanningskällan; när denna sida och schemat inte stämmer överens vinner schemat.

Två valideringslager tillämpas. Det offentliga schemat upprätthåller avgränsade *säkra former*
(mönster och längder som avvisar optionliknande eller obegränsade värden). Ovanpå det tillämpar
`catalog validate` obligatoriska semantiska parsers: exakt SemVer för versioner, SHA-512 SRI för
integritetsvärden, SPDX-uttrycksparsning för licenser och avvisning av dubblettnycklar. Ett värde
kan matcha schemamönstret och ändå avvisas semantiskt.

Regler på toppnivå: posten är ett enda YAML-objekt, `additionalProperties: false`
(okända fält avvisas), och alla fält nedan är obligatoriska utom `media`, det enda valfria fältet.

## Toppnivåfält

| Fält              | Typ     | Obligatoriskt | Sammanfattning                                              |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ja     | Måste vara exakt `1`                                          |
| `id`              | string  |   ja     | Post-ID i lowercase kebab-case; måste matcha filnamnet        |
| `name`            | string  |   ja     | Visningsnamn, 1–120 tecken                                    |
| `description`     | object  |   ja     | Kuraterad engelsk sammanfattning plus dess bevisstig          |
| `unofficial`      | const   |   ja     | Måste vara exakt `true`                                       |
| `kind`            | enum    |   ja     | Kanonisk artefaktsärskiljare                                  |
| `primaryCategory` | enum    |   ja     | En primär förmågekategori                                     |
| `tags`            | array   |   ja     | Unika taggar i lowercase kebab-case (får vara tom)            |
| `source`          | object  |   ja     | Ursprungligt repository, node-ID, understig och fastnålad commit |
| `creator`         | object  |   ja     | Skaparens offentliga GitHub-handle                            |
| `package`         | object  |   ja     | Kanonisk installationsdeskriptor (npm **eller** source)       |
| `dsh`             | object  |   ja     | DSH-profiler och bevisstig för native integration             |
| `repositoryScope` | enum    |   ja     | `dedicated` eller `monorepo`                                  |
| `popularity`      | object  |   ja     | Stjärnpolicy och stjärnantal (villkorat av omfattningen)      |
| `license`         | object  |   ja     | Upstream SPDX-licensuttryck                                   |
| `verification`    | object  |   ja     | Verifieringsstatus, kontrolltidpunkt, identitet och röktest   |
| `provenance`      | object  |   ja     | Offentliga Discussion-/kommentar-URL:er eller `null`          |
| `media`           | array   |    nej    | Upp till 6 skärmbilder/videor, varje URL fäst vid `source.commit` |

### `schemaVersion`

Konstant `1`. Identifierar offentlig schemaversion 1; varje annat värde är ogiltigt.

### `id`

Sträng som matchar `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, inga inledande,
avslutande eller dubbla bindestreck. Enligt [CONTRIBUTING.md](../../CONTRIBUTING.md) måste
postfilen heta `catalog/plugins/<id>.yaml` med det identiska värdet; validatorn avvisar en
avvikelse (`id-filename-mismatch`). ID:t måste också börja med skaparens namnrum:
`creator.github`-handlet i gemener, där varje följd av tecken utanför `[a-z0-9]` kollapsas till
ett enda `-`, följt av `-` (`id-creator-prefix`).

### `name`

Fritt utformat visningsnamn, `minLength: 1`, `maxLength: 120`.

### `description`

Objekt med exakt två obligatoriska egenskaper (inga andra tillåts):

| Egenskap       | Typ    | Regler                                                                |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Engelsk sammanfattning, 20–320 tecken                                 |
| `evidencePath` | string | Relativt repository-stigmönster; inget inledande `/`, inga omvända snedstreck, inga `.`/`..`-segment |

Den engelska sammanfattningen måste vara kuraterad från filen vid `evidencePath` som den ser ut
vid `source.commit` — inte kopierad från en annan katalog.

### `unofficial`

Konstant `true`. Maskinläsbar markör för att listningen är inofficiell.

### `kind`

Den **enda** artefakttypsärskiljaren (inget andra integrationstypsfält finns). En av:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Betydelser och rankningskonsekvenser definieras i
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

En av de fjorton förmågekategorierna:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Visningsetiketter och vägledning för val finns i
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array av unika strängar, som vardera matchar `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab-case).
Inget minimiantal föreskrivs av schemat.

### `source`

Objekt med exakt fyra obligatoriska egenskaper:

| Egenskap           | Typ            | Regler                                                                 |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>`-URL; owner följer GitHub-användarnamnsregler, repositorynamn 1–100 tecken, får inte vara `.`/`..` eller sluta på `.git` |
| `repositoryNodeId` | string         | Oföränderligt GitHub-repository-node-ID, inte tomt                     |
| `subpath`          | string eller null | Pluginunderstig inuti repositoryt (samma säkra relativa stigmönster som `evidencePath`), eller `null` för en plugin i repositoryts rot |
| `commit`           | string         | Fullständig 40-teckens hexadecimal commit-OID                          |

Katalogvalidering måste lösa `repositoryNodeId` och avvisa en repository-URL-avvikelse — den
lösningen är en underhållargrind, inte en del av den lokala strukturella kontrollen.

### `creator`

Objekt med en enda obligatorisk egenskap:

| Egenskap | Typ    | Regler                                            |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub-användarnamn (1–39 tecken, GitHub-handleregler) |

Den offentliga profil-URL:en härleds alltid som `https://github.com/<handle>`; inget andra
profilfält lagras, så de två kan aldrig avvika från varandra.

### `package`

Den kanoniska installationsdeskriptorn. Den är data, aldrig ett skalkommando, och antar exakt en
av två former (`oneOf`):

**npm-paket** — obligatoriska `ecosystem`, `name`, `version`; valfri `integrity`:

| Egenskap    | Typ   | Regler                                                                     |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm-paketnamnsform (valfritt scoped), högst 214 tecken                     |
| `version`   | string | Exakt `x.y.z`-versionsform (valfri prerelease/build); intervall avvisas. Det semantiska lagret kräver dessutom en parsbar, exakt SemVer |
| `integrity` | string | Valfri `sha512-…`-SRI-form, 8–256 tecken. Det semantiska lagret måste parsa den som giltig SHA-512 SRI |

**source-installation** — endast obligatoriskt `ecosystem`:

| Egenskap    | Typ   | Regler   |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

En source-deskriptor lagrar avsiktligt inget annat: repository, commit och understig härleds från
`source`, så föränderliga värden dupliceras aldrig.

### `dsh`

Bevis på native DSH-integration:

| Egenskap       | Typ    | Regler                                                         |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Minst ett unikt profilnamn som matchar `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Säker relativ stig till DSH-integrationsbeviset vid `source.commit` |

### `repositoryScope`

Antingen `dedicated` (repository-stjärnorna tillhör exakt denna plugin) eller `monorepo`
(pluginet är en understig eller ett paket inuti ett bredare projekt). Detta värde styr de
villkorade popularitetsreglerna nedan.

### `popularity`

| Egenskap     | Typ             | Regler                                               |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` eller `undefined-parent-repository` |
| `stars`      | heltal eller null | Icke-negativt heltal, eller `null`               |

Villkorade regler (upprätthålls av schemats `allOf`-block):

- `repositoryScope: monorepo` **tvingar** `starsPolicy: undefined-parent-repository` och
  `stars: null`. Det överordnade projektets stjärnor tillskrivs aldrig en monorepo-plugin.
- `repositoryScope: dedicated` **tvingar** `starsPolicy: exact-repository` och ett heltal
  `stars >= 0`.

Se [docs/RANKING.md](../../docs/RANKING.md) för hur dessa värden matar rankningspredikatet.

### `license`

| Egenskap | Typ    | Regler                                                         |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | SPDX-uttrycksform, 2–256 tecken, ingen inledande bindestreck   |

Schemat upprätthåller endast en säker teckenform; katalogvalideringen måste parsa och normalisera
värdet med en riktig SPDX-uttrycksparser. Registrera det fullständiga upstream-uttryck som är
belagt vid den fastnålade commiten (till exempel `Apache-2.0` eller `MIT OR GPL-3.0-only`).

### `verification`

Verifiering tillämpas på `source.commit`. Objekt med fyra obligatoriska egenskaper:

| Egenskap             | Typ            | Regler                                                 |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | `date-time`-formaterad tidsstämpel för kontrollen      |
| `repositoryIdentity` | const          | Måste vara `resolved`                                  |
| `smokeTest`          | objekt eller null | Röktestpost, eller `null` när inget kvalificerande test finns |

När den finns kräver `smokeTest`:

| Egenskap        | Typ    | Regler                                                             |
| --------------- | ------ | ------------------------------------------------------------------ |
| `installTarget` | const  | `canonical-install-descriptor` — refererar `package` eller den fastnålade källan utan att duplicera föränderliga värden |
| `check`         | object | Obligatoriska `name` (paketnamnsform) och `version` (exakt versionsform) |
| `result`        | const  | `passed` — ett misslyckat röktest registreras inte som ett röktest |

Villkorad regel: `status: verified` **kräver** ett icke-nullt `smokeTest`-objekt. Poster utan
granskningsbara röktestbevis använder `status: eligible` och `smokeTest: null`. Ingen status är
ett godkännande eller en säkerhetscertifiering — se [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Offentliga provenienslänkar, vardera en URI eller `null`:

| Egenskap     | Typ           | Regler                                           |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string eller null | Offentlig Discussion-URL när en sådan finns |
| `comment`    | string eller null | Offentlig kommentar-URL när en sådan finns  |

### `media`

Det enda valfria fältet. En array med högst **6** element, där vart och ett beskriver en skärmbild eller en kort video av insticksmodulen:

| Egenskap | Typ | Regler |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` eller `video` |
| `url`    | string | Oföränderlig GitHub-URL, högst 2048 tecken (se nedan) |
| `alt`    | string | Alternativtext, 1–120 tecken |

En URL här måste vara lika oföränderlig som `source.commit`. En
`raw.githubusercontent.com`-sökväg med ett grennamn (`.../main/docs/shot.png`) visar det grenen
innehåller idag, så posten skulle publicera en ogranskad bild den dag grenen flyttas. Två former
accepteras:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — den fästa raw-sökvägen;
- `https://github.com/<owner>/<repo>/assets/…` — GitHubs innehållsadresserade uppladdnings-URL, för `video`-element.

Schemat kräver den säkra formen (värd, 40 tecken lång hexadecimal referens, begränsad längd).
`catalog validate` kräver resten semantiskt: URL:en måste fästa **postens egen** `source.commit` i
**postens eget** förråd, och en gren-URL avvisas med
`media[n].url must pin the entry commit, not a branch`.

Utelämna fältet helt när det inte finns något att visa — `media: []` är inte ett giltigt sätt att
säga "inga skärmbilder". Fältet är additivt: poster som publicerades innan det fanns är fortfarande
giltiga, och en konsument som ignorerar det läser varje post precis som förut.

## Poster med `kind: skill`

Schemaversion 1 definierar också ett andra, självständigt postkontrakt för `kind: skill`,
publicerat som [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01 fas 0).
Det rör aldrig pluginschemat ovan: poster med `kind: plugin` fortsätter att valideras exakt som
förut, och skillschemafilen är sanningskällan för skillposter på samma sätt som pluginschemat
är det för pluginposter.

En skill installeras inte, den **läses in** av harnesset, så de installationsdeskriptorer som
bara finns för plugins (`package`, `dsh`) existerar inte på en skillpost och ersätts av
`usage` + `compat`. En skill lever också ofta i en underkatalog av ett repository som rymmer
många skills, så identitet och dedupe är `source.repository` + `source.subpath` snarare än
repositoryt ensamt. En skillpost tillåter inget `media`-galleri: en skill är text som harnesset
läser in, så det finns inget att ta skärmbild av (det är `additionalProperties: false` som
upprätthåller detta).

Dessa fält behåller exakt den form och de regler som dokumenteras för pluginposter ovan:
`schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Varje fält är obligatoriskt
utom `triggers`, det enda valfria skillfältet.

### Skillspecifika fält

| Fält                 | Typ    | Obligatoriskt | Regler                                              |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   ja     | Måste vara exakt `skill`                                    |
| `skillScope`         | enum   |   ja     | `repository` (hela repositoryt **är** skillen) eller `subdirectory` (skillen lever vid `source.subpath`) |
| `triggers`           | array  |    nej    | När skillen utlöses — texten en användare bedömer innan den läses in. Minst 1 unik sträng, vardera 3–200 tecken; utelämna fältet helt när inga finns (`triggers: []` är ogiltigt) |
| `usage.load`         | string |   ja     | Hur harnesset läser in skillen, 1–200 tecken; en skill läses in, installeras aldrig |
| `usage.evidencePath` | string |   ja     | Säker relativ stig (samma mönster som `description.evidencePath`) till inläsningsbeviset vid `source.commit` |
| `compat.harnessMin`  | string |   ja     | Lägsta harnessversion som skillen verifierades mot; exakt `x.y.z`-form (valfri prerelease/build), högst 64 tecken. Det semantiska lagret kräver dessutom en parsbar, exakt SemVer |

Villkorade regler (upprätthålls av skillschemats `allOf`-block):

- `skillScope: subdirectory` **tvingar** `source.subpath` att vara en säker relativ stigsträng —
  en skill som finns i en underkatalog måste fästa den underkatalogen.
- `skillScope: repository` **tvingar** `source.subpath: null` — en skill som omfattar hela
  repositoryt får inte deklarera en understig.

`verification` behåller pluginformen (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), men `smokeTest` måste vara exakt `null`: en skill har inget installationsröktest,
och innehållsgranskning är antagningsgrinden. Skillschemat bär inte villkoret
`status: verified` → `smokeTest` och inte heller villkoren `repositoryScope` → `popularity`;
de kopplingarna är regler enbart i pluginschemat.

### Semantiskt lager för skills

Ovanpå schemat tillämpar katalogvalideringen samma obligatoriska semantiska parsers som för
plugins där fälten finns: `license.spdx` måste parsas som ett giltigt SPDX-uttryck
(`invalid-spdx`), och `compat.harnessMin` måste vara en exakt SemVer (`invalid-semver`). Det
finns inget `invalid-sri`-fall — en skill har ingen `package.integrity`.

### Skillidentitet och dedupe

Den kanoniska nyckeln för en skill är `skill:<source.repositoryNodeId>:<normalized subpath>`.
Understigen normaliseras endast för identitetsändamål: omvända snedstreck blir `/`, tomma
segment och `.`-segment tas bort, och ett tomt resultat (eller `subpath: null`) blir `.` — hela
repositoryt. En understig som innehåller NUL-byte eller `..`-segment avvisas, "städas" aldrig.
Två skills i samma repository är två poster; samma repository + understig två gånger är en
kollision.

### Minimalt skillexempel

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## Vad schemat inte kontrollerar

Schemat är avsiktligt lokalt och strukturellt. Det verifierar **inte** att repositoryt finns, att
node-ID:t matchar URL:en, att bevisstigar finns vid den fastnålade commiten, att stjärnantalet är
korrekt eller att skaparen äger källan. Dessa kontroller tillhör de
underhållargranskningsgrindar som beskrivs i [CONTRIBUTING.md](../../CONTRIBUTING.md) och
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
