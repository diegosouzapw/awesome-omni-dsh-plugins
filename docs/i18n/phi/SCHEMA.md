# Sanggunian ng Schema ng Entry ng Katalogo

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Filipino**

> **Hindi opisyal na proyekto ng komunidad. Walang kaugnayan sa, hindi inendorso, at hindi itinataguyod ng DeepSeek.**
> Ang mga pangalan at marka ng DeepSeek ay pag-aari ng kani-kanilang may-ari.

Ito ang field-by-field na sanggunian para sa [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
ang pampublikong JSON Schema (draft 2020-12) na dapat matupad ng bawat file sa ilalim ng
`catalog/plugins/`. Ang schema file mismo ang pinagmumulan ng katotohanan; kapag nagkaiba ang
pahinang ito at ang schema, ang schema ang mananaig.

Dalawang suson ng validation ang gumagamit. Ang pampublikong schema ay nagpapatupad ng mga
may-hanggang *ligtas na hugis* (mga pattern at haba na tumatanggi sa option-like o unbounded
na halaga). Sa ibabaw nito, ginagamit ng `catalog validate` ang mga sapilitang semantic
parser: eksaktong SemVer para sa mga bersyon, SHA-512 SRI para sa mga integrity value,
pag-parse ng SPDX expression para sa mga lisensya, at pagtanggi ng dobleng key. Maaaring
tumugma ang isang halaga sa pattern ng schema at pagkatapos ay tanggihan pa rin nang
semantikal.

Mga panuntunan sa pinakamataas na antas: ang entry ay iisang YAML object,
`additionalProperties: false` (tinatanggihan ang hindi kilalang mga field), at lahat ng field sa
ibaba ay kailangan maliban sa `media` — ang tanging opsyonal na field.

## Mga field sa tuktok na antas

| Field             | Uri     | Kinakailangan | Buod                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   oo    | Dapat eksaktong `1`                                           |
| `id`              | string  |   oo    | Lowercase kebab-case na ID ng entry; dapat tugma ang filename        |
| `name`            | string  |   oo    | Pangalan na ipinapakita, 1–120 character                                |
| `description`     | object  |   oo    | Curated na buod sa Ingles kasama ang evidence path nito                |
| `unofficial`      | const   |   oo    | Dapat eksaktong `true`                                        |
| `kind`            | enum    |   oo    | Canonical na panukoy ng uri ng artifact                              |
| `primaryCategory` | enum    |   oo    | Iisang pangunahing kategorya ng kakayahan                            |
| `tags`            | array   |   oo    | Natatanging lowercase kebab-case na tag (maaaring walang laman)               |
| `source`          | object  |   oo    | Orihinal na repository, node ID, subpath, at nakapirming commit       |
| `creator`         | object  |   oo    | Pampublikong GitHub handle ng lumikha                                |
| `package`         | object  |   oo    | Canonical install descriptor (npm **o** source)              |
| `dsh`             | object  |   oo    | Mga DSH profile at evidence path ng native integration             |
| `repositoryScope` | enum    |   oo    | `dedicated` o `monorepo`                                     |
| `popularity`      | object  |   oo    | Patakaran ng bituin at bilang ng bituin (kundisyonal sa scope)            |
| `license`         | object  |   oo    | Upstream SPDX license expression                              |
| `verification`    | object  |   oo    | Estado ng verification, oras ng pagsusuri, pagkakakilanlan, at smoke test      |
| `provenance`      | object  |   oo    | Mga pampublikong Discussion/comment URL o `null`                      |
| `media`           | array   |    hindi    | Hanggang 6 na screenshot/video, bawat URL naka-pin sa `source.commit` |

### `schemaVersion`

Constant na `1`. Tinutukoy ang bersyon 1 ng pampublikong schema; anumang ibang halaga ay
hindi wasto.

### `id`

String na tumutugma sa `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, walang hyphen sa
simula/dulo o dobleng hyphen. Ayon sa [CONTRIBUTING.md](../../CONTRIBUTING.md), ang entry
file ay dapat pangalanan ng `catalog/plugins/<id>.yaml` na may magkaparehong halaga;
tatanggihan ng validator ang hindi pagtugma (`id-filename-mismatch`). Ang ID ay dapat magsimula
rin sa namespace ng lumikha: ang `creator.github` handle na lowercase, na ang bawat sunud-sunod
na character sa labas ng `[a-z0-9]` ay pinapaliit sa isang `-`, na sinusundan ng `-`
(`id-creator-prefix`).

### `name`

Malayang pangalan na ipinapakita, `minLength: 1`, `maxLength: 120`.

### `description`

Object na may eksaktong dalawang kinakailangang property (walang iba pinahihintulutan):

| Property       | Uri    | Mga Tuntunin                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Buod sa Ingles, 20–320 character                                    |
| `evidencePath` | string | Pattern ng relative repo path; walang `/` sa simula, walang backslash, walang `.`/`..` segment |

Ang buod sa Ingles ay dapat i-curate mula sa file sa `evidencePath` kung ano ito sa
`source.commit` — hindi kinopya mula sa ibang katalogo.

### `unofficial`

Constant na `true`. Machine-readable na pananda na ang listahan ay hindi opisyal.

### `kind`

Ang **tanging** panukoy ng uri ng artifact (walang ikalawang integration-kind field na
umiiral). Isa sa:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Ang mga kahulugan at kahihinatnan sa ranggo ay tinukoy sa
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Isa sa labing-apat na kategorya ng kakayahan:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Ang mga label na ipinapakita at patnubay sa pagpili ay nasa
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array ng mga natatanging string, na ang bawat isa ay tumutugma sa
`^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab-case). Walang minimum na bilang na
itinatakda ng schema.

### `source`

Object na may eksaktong apat na kinakailangang property:

| Property           | Uri            | Mga Tuntunin                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` URL; ang owner ay sumusunod sa mga patakaran ng GitHub username, pangalan ng repo 1–100 character, hindi maaaring `.`/`..` o magtapos sa `.git` |
| `repositoryNodeId` | string         | Hindi nagbabagong GitHub repository node ID, hindi walang laman                         |
| `subpath`          | string o null  | Subpath ng plugin sa loob ng repository (parehong ligtas na relative-path pattern tulad ng `evidencePath`), o `null` para sa plugin sa root ng repository |
| `commit`           | string         | Buong 40-character hexadecimal commit OID                               |

Dapat lutasin ng catalog validation ang `repositoryNodeId` at tanggihan ang hindi pagtugma ng
repository URL — ang paglutas na iyon ay gate sa panig ng maintainer, hindi bahagi ng lokal na
structural check.

### `creator`

Object na may isang kinakailangang property:

| Property | Uri    | Mga Tuntunin                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub username (1–39 character, mga patakaran ng GitHub handle) |

Ang pampublikong profile URL ay palaging hinango bilang `https://github.com/<handle>`; walang
ikalawang profile field na itinatabi, kaya hindi kailanman maaaring magkaiba ang dalawa.

### `package`

Ang canonical install descriptor. Ito ay data, hindi kailanman shell command, at eksaktong
isang hugis lamang sa dalawa ang kinukuha nito (`oneOf`):

**npm package** — kinakailangan ang `ecosystem`, `name`, `version`; opsyonal ang `integrity`:

| Property    | Uri   | Mga Tuntunin                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Hugis ng pangalan ng npm package (opsyonal na scoped), hanggang 214 character                 |
| `version`   | string | Eksaktong hugis ng bersyong `x.y.z` (opsyonal na prerelease/build); tinatanggi ang range. Sapilitang nangangailangan din ang semantic layer ng mapaparse at eksaktong SemVer |
| `integrity` | string | Opsyonal na hugis na `sha512-…` SRI, 8–256 character. Dapat i-parse ito ng semantic layer bilang wastong SHA-512 SRI |

**source install** — kinakailangan lamang ang `ecosystem`:

| Property    | Uri   | Mga Tuntunin    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Sinasadyang walang ibang itinatabi ang source descriptor: ang repository, commit, at subpath
ay hinango mula sa `source`, kaya hindi kailanman dinodoble ang mga mutable na halaga.

### `dsh`

Ebidensya ng native DSH integration:

| Property       | Uri    | Mga Tuntunin                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Hindi bababa sa isang natatanging pangalan ng profile na tumutugma sa `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Ligtas na relative path patungo sa ebidensya ng DSH integration sa `source.commit` |

### `repositoryScope`

Alinman sa `dedicated` (ang mga bituin ng repository ay pag-aari ng eksaktong plugin na ito)
o `monorepo` (ang plugin ay isang subpath o package sa loob ng mas malawak na proyekto). Ang
halagang ito ang nagtutulak sa mga kundisyonal na patakaran ng popularity sa ibaba.

### `popularity`

| Property     | Uri             | Mga Tuntunin                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` o `undefined-parent-repository`  |
| `stars`      | integer o null  | Non-negative integer, o `null`                      |

Mga kundisyonal na tuntunin (ipinapatupad ng mga `allOf` block ng schema):

- **Pinipilit** ng `repositoryScope: monorepo` ang `starsPolicy: undefined-parent-repository`
  at `stars: null`. Hindi kailanman iaatribwir sa isang monorepo plugin ang mga bituin ng
  parent project.
- **Pinipilit** ng `repositoryScope: dedicated` ang `starsPolicy: exact-repository` at integer
  na `stars >= 0`.

Tingnan ang [docs/RANKING.md](../../docs/RANKING.md) para sa kung paano pinapakain ang mga
halagang ito sa predicate ng ranggo.

### `license`

| Property | Uri    | Mga Tuntunin                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | Hugis ng SPDX expression, 2–256 character, walang hyphen sa simula          |

Ang schema ay nagpapatupad lamang ng ligtas na hugis ng character; dapat i-parse at
i-normalize ng catalog validation ang halaga gamit ang isang totoong SPDX expression parser.
Itala ang kumpletong upstream expression na may ebidensya sa nakapirming commit (halimbawa
`Apache-2.0` o `MIT OR GPL-3.0-only`).

### `verification`

Ang verification ay gumagamit sa `source.commit`. Object na may apat na kinakailangang
property:

| Property             | Uri            | Mga Tuntunin                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Timestamp na may pormatong `date-time` ng pagsusuri           |
| `repositoryIdentity` | const          | Dapat `resolved`                                     |
| `smokeTest`          | object o null  | Talaan ng smoke-test, o `null` kapag walang kwalipikadong test |

Kapag umiiral, kinakailangan ng `smokeTest`:

| Property        | Uri    | Mga Tuntunin                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — tumutukoy sa `package` o sa nakapirming source nang hindi dinodoble ang mga mutable na halaga |
| `check`         | object | Kinakailangan ang `name` (hugis ng pangalan ng package) at `version` (hugis ng eksaktong bersyon) |
| `result`        | const  | `passed` — ang nabigong smoke test ay hindi itinala bilang smoke test    |

Kundisyonal na tuntunin: **kinakailangan** ng `status: verified` ang non-null na `smokeTest`
object. Ang mga entry na walang nasusuring smoke evidence ay gumagamit ng `status: eligible`
at `smokeTest: null`. Walang status na pag-endorso o sertipikasyon ng seguridad — tingnan ang
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Mga pampublikong link ng provenance, na ang bawat isa ay URI o `null`:

| Property     | Uri           | Mga Tuntunin                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string o null | Pampublikong Discussion URL kapag mayroon            |
| `comment`    | string o null | Pampublikong comment URL kapag mayroon               |

### `media`

Ang tanging opsyonal na field. Isang array na may hindi hihigit sa **6** na item, bawat isa ay naglalarawan ng isang screenshot o maikling video ng plugin:

| Katangian | Uri | Mga panuntunan |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` o `video` |
| `url`    | string | Hindi nagbabagong URL ng GitHub, hanggang 2048 karakter (tingnan sa ibaba) |
| `alt`    | string | Alternatibong teksto, 1–120 karakter |

Ang URL dito ay kailangang kasing-hindi-nagbabago ng `source.commit`. Ang landas na
`raw.githubusercontent.com` na may pangalan ng branch (`.../main/docs/shot.png`) ay nagpapakita ng
laman ng branch na iyon ngayon, kaya maglalathala ang entry ng hindi nasuring larawan sa araw na
gumalaw ang branch. Dalawang anyo ang tinatanggap:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — ang naka-pin sa commit na raw na landas;
- `https://github.com/<owner>/<repo>/assets/…` — ang content-addressed na upload URL ng GitHub, para sa mga item na `video`.

Ang schema ay nagpapatupad lamang ng ligtas na anyo (host, 40-karakter na hexadecimal na
sanggunian, may hangganang haba). Ang natitira ay ipinapatupad ng `catalog validate` nang
semantiko: kailangang i-pin ng URL ang `source.commit` **ng entry mismo** sa repositoryo **ng
entry mismo**, at ang URL ng branch ay tinatanggihan gamit ang
`media[n].url must pin the entry commit, not a branch`.

Alisin nang buo ang field kapag walang maipapakita — hindi wastong paraan ang `media: []` upang
sabihing "walang screenshot". Karagdagan ang field na ito: mananatiling wasto ang mga entry na
nailathala bago ito umiral, at ang mambabasang hindi ito pinapansin ay babasahin ang bawat entry
nang eksaktong tulad ng dati.

## Mga entry na `kind: skill`

Tinutukoy din ng bersyon 1 ng schema ang ikalawang, nakapag-iisang kontrata ng entry para sa
`kind: skill`, na inilathala bilang
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01 phase 0). Hindi nito
kailanman ginagalaw ang plugin schema sa itaas: ang mga entry na may `kind: plugin` ay
patuloy na nava-validate nang eksaktong tulad ng dati, at ang skill schema file ang
pinagmumulan ng katotohanan para sa mga skill entry sa parehong paraan na ang plugin schema
ay para sa mga plugin entry.

Ang isang skill ay hindi ini-install, ito ay **nilo-load** ng harness, kaya ang mga install
descriptor na pang-plugin lamang (`package`, `dsh`) ay hindi umiiral sa isang skill entry at
pinapalitan ng `usage` + `compat`. Madalas ding nakatira ang isang skill sa isang
subdirectory ng repository na naglalaman ng maraming skill, kaya ang pagkakakilanlan at
dedupe ay `source.repository` + `source.subpath` sa halip na ang repository lamang. Ang
isang skill entry ay hindi tumatanggap ng `media` gallery: ang skill ay tekstong nilo-load
ng harness, kaya walang maiscre-screenshot (`additionalProperties: false` ang nagpapatupad
nito).

Pinapanatili ng mga field na ito ang eksaktong hugis at mga tuntuning nakadokumento para sa
mga plugin entry sa itaas: `schemaVersion`, `id`, `name`, `description`, `unofficial`,
`primaryCategory`, `tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`.
Lahat ng field ay kinakailangan maliban sa `triggers`, ang tanging opsyonal na field ng
skill.

### Mga field na tiyak sa skill

| Field                | Uri    | Kinakailangan | Mga Tuntunin                                                |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   oo    | Dapat eksaktong `skill`                                     |
| `skillScope`         | enum   |   oo    | `repository` (ang buong repository **ang** skill) o `subdirectory` (ang skill ay nakatira sa `source.subpath`) |
| `triggers`           | array  |    hindi    | Kailan pumapasok ang skill — ang tekstong sinusuri ng user bago ito i-load. Hindi bababa sa 1 natatanging string, bawat isa 3–200 character; alisin nang buo ang field kapag wala (`triggers: []` ay hindi wasto) |
| `usage.load`         | string |   oo    | Paano nilo-load ng harness ang skill, 1–200 character; ang skill ay nilo-load, hindi kailanman ini-install |
| `usage.evidencePath` | string |   oo    | Ligtas na relative path (parehong pattern ng `description.evidencePath`) patungo sa ebidensya ng pag-load sa `source.commit` |
| `compat.harnessMin`  | string |   oo    | Pinakamababang bersyon ng harness na pinatunayan laban sa skill; eksaktong hugis na `x.y.z` (opsyonal na prerelease/build), hanggang 64 character. Nangangailangan din ang semantic layer ng mapaparse at eksaktong SemVer |

Mga kundisyonal na tuntunin (ipinapatupad ng mga `allOf` block ng skill schema):

- **Pinipilit** ng `skillScope: subdirectory` na ang `source.subpath` ay isang ligtas na
  relative-path string — ang skill na naka-host sa isang subdirectory ay dapat mag-pin ng
  subdirectory na iyon.
- **Pinipilit** ng `skillScope: repository` ang `source.subpath: null` — ang skill na
  buong-repository ay hindi dapat magdeklara ng subpath.

Pinapanatili ng `verification` ang hugis ng plugin (`status`, `checkedAt`,
`repositoryIdentity`, `smokeTest`), ngunit ang `smokeTest` ay dapat eksaktong `null`: walang
install smoke test ang isang skill, at ang pagsusuri ng nilalaman ang gate ng pagtanggap.
Walang dala ang skill schema na kundisyong `status: verified` → `smokeTest` at walang mga
kundisyong `repositoryScope` → `popularity`; ang mga pagkakaugnay na iyon ay mga tuntunin
lamang ng plugin schema.

### Semantic layer para sa mga skill

Sa ibabaw ng schema, ginagamit ng catalog validation ang parehong mga sapilitang semantic
parser tulad ng sa mga plugin kung saan umiiral ang mga field: ang `license.spdx` ay dapat
ma-parse bilang wastong SPDX expression (`invalid-spdx`), at ang `compat.harnessMin` ay
dapat eksaktong SemVer (`invalid-semver`). Walang kasong `invalid-sri` — walang
`package.integrity` ang isang skill.

### Pagkakakilanlan at dedupe ng skill

Ang canonical na key ng isang skill ay `skill:<source.repositoryNodeId>:<normalized subpath>`.
Ang subpath ay nino-normalize para lamang sa layunin ng pagkakakilanlan: ang mga backslash ay
nagiging `/`, ang mga walang laman at `.` na segment ay inaalis, at ang walang laman na
resulta (o `subpath: null`) ay nagiging `.` — ang buong repository. Ang subpath na may mga
NUL byte o `..` na segment ay tinatanggihan, hindi kailanman "nililinis". Ang dalawang skill
ng parehong repository ay dalawang entry; ang parehong repository + subpath nang dalawang
beses ay isang banggaan.

### Minimal na halimbawa ng skill

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

## Ano ang hindi sinusuri ng schema

Ang schema ay sinasadyang lokal at structural. **Hindi** nito biniberipika na umiiral ang
repository, na ang node ID ay tugma sa URL, na umiiral ang mga evidence path sa nakapirming
commit, na tama ang bilang ng bituin, o na pag-aari ng lumikha ang source. Ang mga pagsusuring
iyon ay nabibilang sa mga review gate ng maintainer na inilarawan sa
[CONTRIBUTING.md](../../CONTRIBUTING.md) at [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
