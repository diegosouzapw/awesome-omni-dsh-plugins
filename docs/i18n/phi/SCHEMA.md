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

Mga tuntunin sa tuktok na antas: ang entry ay isang YAML object, `additionalProperties: false`
(tinatanggihan ang mga hindi kilalang field), at **lahat** ng mga sumusunod na field ay
kinakailangan.

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

Isa sa labintatlong kategorya ng kakayahan:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## Ano ang hindi sinusuri ng schema

Ang schema ay sinasadyang lokal at structural. **Hindi** nito biniberipika na umiiral ang
repository, na ang node ID ay tugma sa URL, na umiiral ang mga evidence path sa nakapirming
commit, na tama ang bilang ng bituin, o na pag-aari ng lumikha ang source. Ang mga pagsusuring
iyon ay nabibilang sa mga review gate ng maintainer na inilarawan sa
[CONTRIBUTING.md](../../CONTRIBUTING.md) at [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
