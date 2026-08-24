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

Toppnivåregler: posten är ett enda YAML-objekt, `additionalProperties: false` (okända fält
avvisas) och **alla** följande fält är obligatoriska.

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

En av de tretton förmågekategorierna:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

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

## Vad schemat inte kontrollerar

Schemat är avsiktligt lokalt och strukturellt. Det verifierar **inte** att repositoryt finns, att
node-ID:t matchar URL:en, att bevisstigar finns vid den fastnålade commiten, att stjärnantalet är
korrekt eller att skaparen äger källan. Dessa kontroller tillhör de
underhållargranskningsgrindar som beskrivs i [CONTRIBUTING.md](../../CONTRIBUTING.md) och
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
