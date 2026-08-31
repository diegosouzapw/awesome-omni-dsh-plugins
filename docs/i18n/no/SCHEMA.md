# Skjemareferanse for katalogoppføringer

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Norsk**

> **Uoffisielt community-prosjekt. Ikke tilknyttet, godkjent av eller sponset av DeepSeek.**
> DeepSeek-navn og -merker tilhører sine respektive eiere.

Dette er felt-for-felt-referansen for [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
det offentlige JSON Schema-et (draft 2020-12) som hver fil under `catalog/plugins/` må
oppfylle. Skjemafilen selv er kilden til sannhet; når denne siden og skjemaet er uenige,
vinner skjemaet.

To lag med validering gjelder. Det offentlige skjemaet håndhever avgrensede *trygge former*
(mønstre og lengder som avviser option-lignende eller ubegrensede verdier). Oppå det anvender
`catalog validate` obligatoriske semantiske parsere: eksakt SemVer for versjoner, SHA-512 SRI
for integritetsverdier, SPDX-uttrykks-parsing for lisenser og avvisning av duplikatnøkler. En
verdi kan samsvare med skjemamønsteret og likevel avvises semantisk.

Regler på øverste nivå: oppføringen er ett enkelt YAML-objekt, `additionalProperties: false`
(ukjente felt avvises), og alle feltene nedenfor er påkrevd bortsett fra `media`, det eneste
valgfrie feltet.

## Toppnivåfelter

| Felt              | Type    | Påkrevd | Sammendrag                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ja    | Må være nøyaktig `1`                                           |
| `id`              | string  |   ja    | Oppførings-ID i kebab-case med små bokstaver; må samsvare med filnavnet        |
| `name`            | string  |   ja    | Visningsnavn, 1–120 tegn                                |
| `description`     | object  |   ja    | Kuratert engelsk sammendrag pluss dets bevissti                |
| `unofficial`      | const   |   ja    | Må være nøyaktig `true`                                        |
| `kind`            | enum    |   ja    | Kanonisk artefaktdiskriminator                              |
| `primaryCategory` | enum    |   ja    | Én primær kapasitetskategori                            |
| `tags`            | array   |   ja    | Unike tagger i kebab-case med små bokstaver (kan være tom)               |
| `source`          | object  |   ja    | Opprinnelig repositorium, node-ID, understi og fastpinnet kommit       |
| `creator`         | object  |   ja    | Skaperens offentlige GitHub-handle                                |
| `package`         | object  |   ja    | Kanonisk installasjonsdeskriptor (npm **eller** kilde)              |
| `dsh`             | object  |   ja    | DSH-profiler og bevissti for nativ integrasjon             |
| `repositoryScope` | enum    |   ja    | `dedicated` eller `monorepo`                                     |
| `popularity`      | object  |   ja    | Stjernepolicy og stjernetall (betinget av omfang)            |
| `license`         | object  |   ja    | Oppstrøms SPDX-lisensuttrykk                              |
| `verification`    | object  |   ja    | Verifiseringsstatus, kontrolltidspunkt, identitet og smoketest      |
| `provenance`      | object  |   ja    | Offentlige Discussion-/kommentar-URL-er eller `null`                      |
| `media`           | array   |    nei    | Opptil 6 skjermbilder/videoer, hver URL festet til `source.commit` |

### `schemaVersion`

Konstant `1`. Identifiserer offentlig skjema versjon 1; enhver annen verdi er ugyldig.

### `id`

Streng som samsvarer med `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case med små bokstaver, ingen
innledende/avsluttende eller doble bindestreker. Ifølge [CONTRIBUTING.md](../../CONTRIBUTING.md)
må oppføringsfilen navngis `catalog/plugins/<id>.yaml` med den identiske verdien; validatoren
avviser et avvik (`id-filename-mismatch`). ID-en må også starte med skaperens navnerom:
`creator.github`-handlet med små bokstaver, der hver sekvens av tegn utenfor `[a-z0-9]` slås
sammen til en enkelt `-`, etterfulgt av `-` (`id-creator-prefix`).

### `name`

Fritt visningsnavn, `minLength: 1`, `maxLength: 120`.

### `description`

Objekt med nøyaktig to påkrevde egenskaper (ingen andre tillatt):

| Egenskap       | Type   | Regler                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Engelsk sammendrag, 20–320 tegn                                    |
| `evidencePath` | string | Relativ repositoriesti-mønster; ingen innledende `/`, ingen backslasher, ingen `.`/`..`-segmenter |

Det engelske sammendraget må kurateres fra filen på `evidencePath` slik den foreligger ved
`source.commit` — ikke kopieres fra en annen katalog.

### `unofficial`

Konstant `true`. Maskinlesbar markør for at oppføringen er uoffisiell.

### `kind`

Den **eneste** artefakttype-diskriminatoren (det finnes ikke noe andre integrasjonstype-felt).
Én av:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Betydninger og rangeringskonsekvenser er definert i [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Én av de fjorten kapasitetskategoriene:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Visningsetiketter og veiledning for valg finnes i [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array av unike strenger, der hver samsvarer med `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case med
små bokstaver). Ingen minimumstelling pålegges av skjemaet.

### `source`

Objekt med nøyaktig fire påkrevde egenskaper:

| Egenskap           | Type           | Regler                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>`-URL; eier følger GitHub-brukernavnregler, repositorienavn 1–100 tegn, kan ikke være `.`/`..` eller ende i `.git` |
| `repositoryNodeId` | string         | Uforanderlig GitHub-repositorium-node-ID, ikke tom                         |
| `subpath`          | string eller null | Plugin-understi inne i repositoriet (samme trygge relativsti-mønster som `evidencePath`), eller `null` for en plugin i repositoriets rot |
| `commit`           | string         | Full 40-tegns heksadesimal kommit-OID                               |

Katalogvalidering må løse `repositoryNodeId` og avvise et avvik i repositorie-URL — den
løsningen er en port på vedlikeholdersiden, ikke en del av den lokale struktursjekken.

### `creator`

Objekt med én enkelt påkrevd egenskap:

| Egenskap | Type   | Regler                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub-brukernavn (1–39 tegn, GitHub-handle-regler) |

Den offentlige profil-URL-en utledes alltid som `https://github.com/<handle>`; ingen andre
profilfelt lagres, så de to kan aldri avvike.

### `package`

Den kanoniske installasjonsdeskriptoren. Den er data, aldri en shell-kommando, og tar nøyaktig
én av to former (`oneOf`):

**npm-pakke** — påkrevd `ecosystem`, `name`, `version`; valgfri `integrity`:

| Egenskap    | Type  | Regler                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm-pakkenavnsform (valgfritt scoped), maks 214 tegn                 |
| `version`   | string | Eksakt `x.y.z`-versjonsform (valgfri prerelease/build); intervaller avvises. Semantisk lag krever i tillegg en parserbar, eksakt SemVer |
| `integrity` | string | Valgfri `sha512-…`-SRI-form, 8–256 tegn. Semantisk lag må parse den som gyldig SHA-512 SRI |

**kildeinstallasjon** — bare påkrevd `ecosystem`:

| Egenskap    | Type  | Regler    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

En kildedeskriptor lagrer bevisst ingenting annet: repositorium, kommit og understi utledes
fra `source`, så mutable verdier dupliseres aldri.

### `dsh`

Bevis for nativ DSH-integrasjon:

| Egenskap       | Type   | Regler                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Minst ett unikt profilnavn som samsvarer med `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Trygg relativsti til DSH-integrasjonsbeviset ved `source.commit` |

### `repositoryScope`

Enten `dedicated` (repositoriets stjerner tilhører denne eksakte pluginen) eller `monorepo`
(pluginen er en understi eller pakke inne i et bredere prosjekt). Denne verdien styrer de
betingede popularitetsreglene nedenfor.

### `popularity`

| Egenskap     | Type            | Regler                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` eller `undefined-parent-repository`  |
| `stars`      | heltall eller null | Ikke-negativt heltall, eller `null`                      |

Betingede regler (håndhevet av skjemaets `allOf`-blokker):

- `repositoryScope: monorepo` **tvinger** `starsPolicy: undefined-parent-repository` og
  `stars: null`. Stjerner fra det overordnede prosjektet tilskrives aldri en monorepo-plugin.
- `repositoryScope: dedicated` **tvinger** `starsPolicy: exact-repository` og et heltall
  `stars >= 0`.

Se [docs/RANKING.md](../../docs/RANKING.md) for hvordan disse verdiene mates inn i
rangeringspredikatet.

### `license`

| Egenskap | Type   | Regler                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | SPDX-uttrykksform, 2–256 tegn, ingen innledende bindestrek          |

Skjemaet håndhever bare en trygg tegnform; katalogvalideringen må parse og normalisere
verdien med en ekte SPDX-uttrykks-parser. Registrer det fullstendige oppstrømsuttrykket som er
bevist ved den fastpinnede kommitten (for eksempel `Apache-2.0` eller `MIT OR GPL-3.0-only`).

### `verification`

Verifisering gjelder for `source.commit`. Objekt med fire påkrevde egenskaper:

| Egenskap             | Type           | Regler                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | `date-time`-formatert tidsstempel for kontrollen           |
| `repositoryIdentity` | const          | Må være `resolved`                                     |
| `smokeTest`          | object eller null | Smoketest-oppføring, eller `null` når ingen kvalifiserende test finnes |

Når den finnes, krever `smokeTest`:

| Egenskap        | Type   | Regler                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — refererer `package` eller den fastpinnede kilden uten å duplisere mutable verdier |
| `check`         | object | Påkrevd `name` (pakkenavnsform) og `version` (eksakt versjonsform) |
| `result`        | const  | `passed` — en mislykket smoketest registreres ikke som en smoketest    |

Betinget regel: `status: verified` **krever** et ikke-nullt `smokeTest`-objekt. Oppføringer
uten kontrollerbart smoketestbevis bruker `status: eligible` og `smokeTest: null`. Ingen
status er en godkjenning eller sikkerhetssertifisering — se
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Offentlige opprinnelseslenker, hver en URI eller `null`:

| Egenskap     | Type          | Regler                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string eller null | Offentlig Discussion-URL når en finnes            |
| `comment`    | string eller null | Offentlig kommentar-URL når en finnes               |

### `media`

Det eneste valgfrie feltet. En liste med høyst **6** elementer, der hvert beskriver ett skjermbilde eller én kort video av programtillegget:

| Egenskap | Type | Regler |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` eller `video` |
| `url`    | string | Uforanderlig GitHub-URL, maks 2048 tegn (se nedenfor) |
| `alt`    | string | Alternativ tekst, 1–120 tegn |

En URL her må være like uforanderlig som `source.commit`. En
`raw.githubusercontent.com`-sti med et grennavn (`.../main/docs/shot.png`) viser det grenen
inneholder i dag, så oppføringen ville publisert et ikke-gjennomgått bilde den dagen grenen
flytter seg. To former godtas:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — den festede raw-stien;
- `https://github.com/<owner>/<repo>/assets/…` — GitHubs innholdsadresserte opplastings-URL, for `video`-elementer.

Skjemaet håndhever den trygge formen (vert, 40-tegns heksadesimal referanse, begrenset lengde).
`catalog validate` håndhever resten semantisk: URL-en må feste **oppføringens egen**
`source.commit` i **oppføringens eget** repositorium, og en gren-URL avvises med
`media[n].url must pin the entry commit, not a branch`.

Utelat feltet helt når det ikke er noe å vise — `media: []` er ikke en gyldig måte å si "ingen
skjermbilder" på. Feltet er additivt: oppføringer publisert før det fantes er fortsatt gyldige, og
en konsument som ignorerer det leser hver oppføring nøyaktig som før.

## `kind: skill`-oppføringer

Skjemaversjon 1 definerer også en andre, selvstendig oppføringskontrakt for `kind: skill`,
publisert som [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01
fase 0). Den rører aldri plugin-skjemaet ovenfor: oppføringer med `kind: plugin` fortsetter å
validere nøyaktig som før, og skill-skjemafilen er kilden til sannhet for skill-oppføringer
på samme måte som plugin-skjemaet er det for plugin-oppføringer.

En skill installeres ikke, den **lastes** av harnesset, så de plugin-spesifikke
installasjonsdeskriptorene (`package`, `dsh`) finnes ikke på en skill-oppføring og erstattes
av `usage` + `compat`. En skill bor dessuten ofte i en underkatalog av et repositorium som
huser mange skills, så identitet og deduplisering er `source.repository` + `source.subpath`
i stedet for repositoriet alene. En skill-oppføring tillater ikke noe `media`-galleri: en
skill er tekst harnesset laster, så det finnes ingenting å ta skjermbilde av
(`additionalProperties: false` er det som håndhever dette).

Disse feltene beholder nøyaktig formen og reglene som er dokumentert for plugin-oppføringer
ovenfor: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`,
`tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`. Hvert felt er
påkrevd bortsett fra `triggers`, det eneste valgfrie skill-feltet.

### Skill-spesifikke felter

| Felt                 | Type   | Påkrevd | Regler                                                      |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   ja    | Må være nøyaktig `skill`                                     |
| `skillScope`         | enum   |   ja    | `repository` (hele repositoriet **er** skillen) eller `subdirectory` (skillen bor på `source.subpath`) |
| `triggers`           | array  |    nei    | Når skillen utløses — teksten en bruker vurderer før den lastes. Minst 1 unik streng, hver 3–200 tegn; utelat feltet helt når det ikke finnes noen (`triggers: []` er ugyldig) |
| `usage.load`         | string |   ja    | Hvordan harnesset laster skillen, 1–200 tegn; en skill lastes, installeres aldri |
| `usage.evidencePath` | string |   ja    | Trygg relativsti (samme mønster som `description.evidencePath`) til lastebeviset ved `source.commit` |
| `compat.harnessMin`  | string |   ja    | Minste harnessversjon skillen ble verifisert mot; eksakt `x.y.z`-form (valgfri prerelease/build), maks 64 tegn. Semantisk lag krever i tillegg en parserbar, eksakt SemVer |

Betingede regler (håndhevet av skill-skjemaets `allOf`-blokker):

- `skillScope: subdirectory` **tvinger** `source.subpath` til å være en trygg
  relativsti-streng — en skill som bor i en underkatalog må feste den underkatalogen.
- `skillScope: repository` **tvinger** `source.subpath: null` — en skill for hele
  repositoriet må ikke deklarere en understi.

`verification` beholder plugin-formen (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), men `smokeTest` må være nøyaktig `null`: en skill har ingen
installasjons-smoketest, og innholdsgjennomgangen er adgangsporten. Skill-skjemaet bærer
ingen `status: verified` → `smokeTest`-betingelse og ingen `repositoryScope` →
`popularity`-betingelser; de koblingene er kun plugin-skjemaregler.

### Semantisk lag for skills

Oppå skjemaet anvender katalogvalideringen de samme obligatoriske semantiske parserne som
for plugins der feltene finnes: `license.spdx` må parses som et gyldig SPDX-uttrykk
(`invalid-spdx`), og `compat.harnessMin` må være en eksakt SemVer (`invalid-semver`). Det
finnes ikke noe `invalid-sri`-tilfelle — en skill har ingen `package.integrity`.

### Skill-identitet og deduplisering

Den kanoniske nøkkelen til en skill er `skill:<source.repositoryNodeId>:<normalized subpath>`.
Understien normaliseres kun for identitetsformål: backslasher blir `/`, tomme segmenter og
`.`-segmenter droppes, og et tomt resultat (eller `subpath: null`) blir `.` — hele
repositoriet. En understi som inneholder NUL-byte eller `..`-segmenter avvises, "renses"
aldri. To skills fra samme repositorium er to oppføringer; samme repositorium + understi to
ganger er en kollisjon.

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

## Hva skjemaet ikke sjekker

Skjemaet er bevisst lokalt og strukturelt. Det verifiserer **ikke** at repositoriet finnes,
at node-ID-en samsvarer med URL-en, at bevisstier finnes ved den fastpinnede kommitten, at
stjernetallet er nøyaktig, eller at skaperen eier kilden. Disse sjekkene tilhører
vedlikeholdernes gjennomgangsporter beskrevet i [CONTRIBUTING.md](../../CONTRIBUTING.md) og
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
