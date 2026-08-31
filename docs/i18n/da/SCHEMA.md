# Reference til katalogpost-schemaet

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Dansk**

> **Uofficielt community-projekt. Ikke tilknyttet, godkendt af eller sponsoreret af DeepSeek.**
> DeepSeek-navne og -mærker tilhører deres respektive ejer.

Dette er felt-for-felt-referencen for [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
det offentlige JSON Schema (draft 2020-12), som enhver fil under `catalog/plugins/` skal opfylde.
Selve schema-filen er kilde til sandhed; når denne side og schemaet er uenige, vinder schemaet.

To lag af validering gælder. Det offentlige schema håndhæver afgrænsede *sikre former* (mønstre og
længder, der afviser optionslignende eller ikke-afgrænsede værdier). Oven på det anvender
`catalog validate` obligatoriske semantiske fortolkere: præcis SemVer for versioner, SHA-512 SRI
for integritetsværdier, SPDX-udtryksfortolkning for licenser og afvisning af dubletnøgler. En
værdi kan matche schema-mønsteret og stadig blive afvist semantisk.

Regler på øverste niveau: posten er ét enkelt YAML-objekt, `additionalProperties: false`
(ukendte felter afvises), og alle felterne nedenfor er påkrævede undtagen `media`, det eneste
valgfrie felt.

## Topniveau-felter

| Felt              | Type    | Påkrævet | Resumé                                                        |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ja     | Skal være præcis `1`                                          |
| `id`              | string  |   ja     | Lowercase kebab-case post-ID; skal matche filnavnet           |
| `name`            | string  |   ja     | Visningsnavn, 1–120 tegn                                      |
| `description`     | object  |   ja     | Kurateret engelsk resumé plus dets bevissti                   |
| `unofficial`      | const   |   ja     | Skal være præcis `true`                                       |
| `kind`            | enum    |   ja     | Kanonisk artefakt-diskriminator                               |
| `primaryCategory` | enum    |   ja     | Én primær kapacitetskategori                                  |
| `tags`            | array   |   ja     | Unikke lowercase kebab-case tags (må være tom)                |
| `source`          | object  |   ja     | Oprindeligt repository, node-ID, understi og fastlåst commit  |
| `creator`         | object  |   ja     | Skaberens offentlige GitHub-handle                            |
| `package`         | object  |   ja     | Kanonisk installationsdeskriptor (npm **eller** source)       |
| `dsh`             | object  |   ja     | DSH-profiler og bevissti for native integration               |
| `repositoryScope` | enum    |   ja     | `dedicated` eller `monorepo`                                  |
| `popularity`      | object  |   ja     | Stjernepolitik og stjerneantal (betinget af omfang)           |
| `license`         | object  |   ja     | Upstream SPDX-licensudtryk                                    |
| `verification`    | object  |   ja     | Verificeringsstatus, kontroltidspunkt, identitet og smoke-test |
| `provenance`      | object  |   ja     | Offentlige Discussion-/kommentar-URL'er eller `null`          |
| `media`           | array   |    nej    | Op til 6 skærmbilleder/videoer, hver URL fastgjort til `source.commit` |

### `schemaVersion`

Konstant `1`. Identificerer offentlig schema-version 1; enhver anden værdi er ugyldig.

### `id`

Streng, der matcher `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, ingen indledende,
afsluttende eller dobbelte bindestreger. Ifølge [CONTRIBUTING.md](../../CONTRIBUTING.md) skal
postfilen hedde `catalog/plugins/<id>.yaml` med den identiske værdi; validatoren afviser en
uoverensstemmelse (`id-filename-mismatch`). ID'et skal også starte med skaberens namespace:
`creator.github`-handlet med små bogstaver, hvor hver følge af tegn uden for `[a-z0-9]` kollapser
til en enkelt `-`, efterfulgt af `-` (`id-creator-prefix`).

### `name`

Frit formuleret visningsnavn, `minLength: 1`, `maxLength: 120`.

### `description`

Objekt med præcis to påkrævede egenskaber (ingen andre tilladt):

| Egenskab       | Type   | Regler                                                                |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Engelsk resumé, 20–320 tegn                                           |
| `evidencePath` | string | Relativt repo-stimønster; ingen indledende `/`, ingen backslashes, ingen `.`/`..`-segmenter |

Det engelske resumé skal være kurateret fra filen på `evidencePath`, som den findes ved
`source.commit` — ikke kopieret fra et andet katalog.

### `unofficial`

Konstant `true`. Maskinlæsbar markør for, at optagelsen er uofficiel.

### `kind`

Den **eneste** artefakttype-diskriminator (der findes intet andet integrationskind-felt). En af:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Betydninger og rangeringskonsekvenser er defineret i [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

En af de fjorten kapacitetskategorier:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Visningsnavne og valgvejledning findes i [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array af unikke strenge, hvor hver matcher `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab-case).
Schemaet pålægger ikke noget minimumsantal.

### `source`

Objekt med præcis fire påkrævede egenskaber:

| Egenskab           | Type           | Regler                                                                 |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>`-URL; owner følger GitHub-brugernavnsregler, repo-navn 1–100 tegn, må ikke være `.`/`..` eller ende på `.git` |
| `repositoryNodeId` | string         | Uforanderligt GitHub-repository-node-ID, ikke tomt                     |
| `subpath`          | string eller null | Plugin-understi inde i repositoryet (samme sikre relative stimønster som `evidencePath`), eller `null` for et repository-rod-plugin |
| `commit`           | string         | Fuld 40-tegns hexadecimal commit-OID                                   |

Katalogvalidering skal løse `repositoryNodeId` og afvise en repository-URL-uoverensstemmelse —
denne løsning er en vedligeholder-gate, ikke en del af den lokale strukturelle kontrol.

### `creator`

Objekt med en enkelt påkrævet egenskab:

| Egenskab | Type   | Regler                                            |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub-brugernavn (1–39 tegn, GitHub-handleregler) |

Den offentlige profil-URL udledes altid som `https://github.com/<handle>`; intet andet profilfelt
gemmes, så de to kan aldrig divergere.

### `package`

Den kanoniske installationsdeskriptor. Den er data, aldrig en shell-kommando, og antager præcis én
af to former (`oneOf`):

**npm-pakke** — påkrævet `ecosystem`, `name`, `version`; valgfri `integrity`:

| Egenskab    | Type  | Regler                                                                     |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm-pakkenavnsform (valgfrit scoped), maks. 214 tegn                       |
| `version`   | string | Præcis `x.y.z`-versionsform (valgfri prerelease/build); intervaller afvises. Det semantiske lag kræver desuden en fortolkbar, præcis SemVer |
| `integrity` | string | Valgfri `sha512-…`-SRI-form, 8–256 tegn. Det semantiske lag skal fortolke den som gyldig SHA-512 SRI |

**source-installation** — kun påkrævet `ecosystem`:

| Egenskab    | Type  | Regler   |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

En source-deskriptor gemmer med vilje intet andet: repository, commit og understi udledes fra
`source`, så mutable værdier aldrig duplikeres.

### `dsh`

Bevis for native DSH-integration:

| Egenskab       | Type   | Regler                                                         |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Mindst ét unikt profilnavn, der matcher `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Sikker relativ sti til DSH-integrationsbeviset ved `source.commit` |

### `repositoryScope`

Enten `dedicated` (repository-stjerner tilhører præcis dette plugin) eller `monorepo` (pluginnet
er en understi eller en pakke inde i et bredere projekt). Denne værdi styrer de betingede
popularitetsregler nedenfor.

### `popularity`

| Egenskab     | Type            | Regler                                               |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` eller `undefined-parent-repository` |
| `stars`      | heltal eller null | Ikke-negativt heltal, eller `null`                 |

Betingede regler (håndhævet af schemaets `allOf`-blokke):

- `repositoryScope: monorepo` **tvinger** `starsPolicy: undefined-parent-repository` og
  `stars: null`. Det overordnede projekts stjerner tilskrives aldrig et monorepo-plugin.
- `repositoryScope: dedicated` **tvinger** `starsPolicy: exact-repository` og et heltal
  `stars >= 0`.

Se [docs/RANKING.md](../../docs/RANKING.md) for, hvordan disse værdier føder ind i
rangeringsprædikatet.

### `license`

| Egenskab | Type   | Regler                                                         |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | SPDX-udtryksform, 2–256 tegn, ingen indledende bindestreg      |

Schemaet håndhæver kun en sikker tegnform; katalogvalidering skal fortolke og normalisere værdien
med en rigtig SPDX-udtryksfortolker. Registrér det komplette upstream-udtryk, der er dokumenteret
ved det fastlåste commit (for eksempel `Apache-2.0` eller `MIT OR GPL-3.0-only`).

### `verification`

Verificering gælder for `source.commit`. Objekt med fire påkrævede egenskaber:

| Egenskab             | Type           | Regler                                                 |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | `date-time`-formateret tidsstempel for kontrollen      |
| `repositoryIdentity` | const          | Skal være `resolved`                                   |
| `smokeTest`          | object eller null | Smoke-test-post, eller `null` når ingen kvalificerende test findes |

Når den er til stede, kræver `smokeTest`:

| Egenskab        | Type   | Regler                                                              |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — refererer `package` eller den fastlåste kilde uden at duplikere mutable værdier |
| `check`         | object | Påkrævet `name` (pakkenavnsform) og `version` (præcis versionsform) |
| `result`        | const  | `passed` — en fejlet smoke-test registreres ikke som en smoke-test  |

Betinget regel: `status: verified` **kræver** et ikke-nullt `smokeTest`-objekt. Poster uden
gennemgåelige smoke-beviser bruger `status: eligible` og `smokeTest: null`. Ingen status er en
anbefaling eller sikkerhedscertificering — se [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Offentlige proveniens-links, hver en URI eller `null`:

| Egenskab     | Type          | Regler                                           |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string eller null | Offentlig Discussion-URL, når en sådan findes |
| `comment`    | string eller null | Offentlig kommentar-URL, når en sådan findes  |

### `media`

Det eneste valgfrie felt. Et array med højst **6** elementer, som hver beskriver ét skærmbillede eller én kort video af plugin'et:

| Egenskab | Type | Regler |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` eller `video` |
| `url`    | string | Uforanderlig GitHub-URL, maks. 2048 tegn (se nedenfor) |
| `alt`    | string | Alternativ tekst, 1–120 tegn |

En URL her skal være lige så uforanderlig som `source.commit`. En
`raw.githubusercontent.com`-sti med et grennavn (`.../main/docs/shot.png`) viser det, grenen
indeholder i dag, så posten ville udgive et ikke-gennemgået billede den dag, grenen flytter sig.
To former accepteres:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — den fastgjorte raw-sti;
- `https://github.com/<owner>/<repo>/assets/…` — GitHubs indholdsadresserede upload-URL, til `video`-elementer.

Skemaet håndhæver den sikre form (vært, 40-tegns heksadecimal reference, begrænset længde).
`catalog validate` håndhæver resten semantisk: URL'en skal fastgøre **postens egen**
`source.commit` i **postens eget** repository, og en gren-URL afvises med
`media[n].url must pin the entry commit, not a branch`.

Udelad feltet helt, når der ikke er noget at vise — `media: []` er ikke en gyldig måde at sige
"ingen skærmbilleder" på. Feltet er additivt: poster, der blev udgivet, før det fandtes, er
fortsat gyldige, og en forbruger, der ignorerer det, læser hver post præcis som før.

## `kind: skill`-poster

Schema-version 1 definerer også en anden, selvstændig postkontrakt for `kind: skill`,
udgivet som [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01 fase 0). Den
rører aldrig plugin-schemaet ovenfor: poster med `kind: plugin` bliver ved med at validere
præcis som før, og skill-schema-filen er kilde til sandhed for skill-poster på samme måde, som
plugin-schemaet er det for plugin-poster.

En skill installeres ikke, den **indlæses** af harnesset, så de plugin-specifikke
installationsdeskriptorer (`package`, `dsh`) findes ikke på en skill-post og erstattes af
`usage` + `compat`. En skill bor desuden ofte i en undermappe af et repository, der huser mange
skills, så identitet og deduplikering er `source.repository` + `source.subpath` frem for
repositoryet alene. En skill-post tillader intet `media`-galleri: en skill er tekst, som
harnesset indlæser, så der er intet at tage skærmbillede af (det er
`additionalProperties: false`, der håndhæver det).

Disse felter beholder præcis den form og de regler, der er dokumenteret for plugin-poster
ovenfor: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Hvert felt er påkrævet undtagen
`triggers`, det eneste valgfrie skill-felt.

### Skill-specifikke felter

| Felt                 | Type   | Påkrævet | Regler                                                      |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |    ja    | Skal være præcis `skill`                                    |
| `skillScope`         | enum   |    ja    | `repository` (hele repositoryet **er** skillen) eller `subdirectory` (skillen bor på `source.subpath`) |
| `triggers`           | array  |   nej    | Hvornår skillen udløses — den tekst, en bruger vurderer, før den indlæses. Mindst 1 unik streng, hver på 3–200 tegn; udelad feltet helt, når der ingen er (`triggers: []` er ugyldigt) |
| `usage.load`         | string |    ja    | Hvordan harnesset indlæser skillen, 1–200 tegn; en skill indlæses, installeres aldrig |
| `usage.evidencePath` | string |    ja    | Sikker relativ sti (samme mønster som `description.evidencePath`) til indlæsningsbeviset ved `source.commit` |
| `compat.harnessMin`  | string |    ja    | Minimum harness-version, som skillen blev verificeret imod; præcis `x.y.z`-form (valgfri prerelease/build), maks. 64 tegn. Det semantiske lag kræver desuden en fortolkbar, præcis SemVer |

Betingede regler (håndhævet af skill-schemaets `allOf`-blokke):

- `skillScope: subdirectory` **tvinger** `source.subpath` til at være en streng med en sikker
  relativ sti — en skill, der bor i en undermappe, skal fastlåse den undermappe.
- `skillScope: repository` **tvinger** `source.subpath: null` — en skill, der udgør hele
  repositoryet, må ikke erklære en understi.

`verification` beholder plugin-formen (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), men `smokeTest` skal være præcis `null`: en skill har ingen
installations-smoke-test, og indholdsgennemgang er adgangsgaten. Skill-schemaet bærer ingen
`status: verified` → `smokeTest`-betingelse og ingen `repositoryScope` →
`popularity`-betingelser; disse koblinger er udelukkende plugin-schema-regler.

### Semantisk lag for skills

Oven på schemaet anvender katalogvalideringen de samme obligatoriske semantiske fortolkere som
for plugins, hvor felterne findes: `license.spdx` skal kunne fortolkes som et gyldigt
SPDX-udtryk (`invalid-spdx`), og `compat.harnessMin` skal være en præcis SemVer
(`invalid-semver`). Der findes intet `invalid-sri`-tilfælde — en skill har ingen
`package.integrity`.

### Skill-identitet og deduplikering

Den kanoniske nøgle for en skill er `skill:<source.repositoryNodeId>:<normalized subpath>`.
Understien normaliseres kun til identitetsformål: backslashes bliver til `/`, tomme og
`.`-segmenter droppes, og et tomt resultat (eller `subpath: null`) bliver til `.` — hele
repositoryet. En understi, der indeholder NUL-bytes eller `..`-segmenter, afvises, aldrig
"renset". To skills fra samme repository er to poster; samme repository + understi to gange er
en kollision.

### Minimalt skill-eksempel

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

## Hvad schemaet ikke kontrollerer

Schemaet er med vilje lokalt og strukturelt. Det verificerer **ikke**, at repositoryet findes, at
node-ID'et matcher URL'en, at bevisstier findes ved det fastlåste commit, at stjerneantallet er
korrekt, eller at skaberen ejer kilden. Disse kontroller tilhører de vedligeholder-review-gates,
der er beskrevet i [CONTRIBUTING.md](../../CONTRIBUTING.md) og
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
