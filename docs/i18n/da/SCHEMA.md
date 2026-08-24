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

Topniveau-regler: posten er ét enkelt YAML-objekt, `additionalProperties: false` (ukendte felter
afvises), og **alle** de følgende felter er påkrævede.

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

En af de tretten kapacitetskategorier:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## Hvad schemaet ikke kontrollerer

Schemaet er med vilje lokalt og strukturelt. Det verificerer **ikke**, at repositoryet findes, at
node-ID'et matcher URL'en, at bevisstier findes ved det fastlåste commit, at stjerneantallet er
korrekt, eller at skaberen ejer kilden. Disse kontroller tilhører de vedligeholder-review-gates,
der er beskrevet i [CONTRIBUTING.md](../../CONTRIBUTING.md) og
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
