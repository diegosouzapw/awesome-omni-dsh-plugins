# Referenz zum Katalogeintrag-Schema

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Dies ist die feldweise Referenz für [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
das öffentliche JSON Schema (Draft 2020-12), das jede Datei unter `catalog/plugins/` erfüllen
muss. Die Schema-Datei selbst ist die maßgebliche Quelle; wenn diese Seite und das Schema
voneinander abweichen, gewinnt das Schema.

Es gelten zwei Validierungsebenen. Das öffentliche Schema erzwingt begrenzte *sichere Formen*
(Muster und Längen, die options-artige oder unbegrenzte Werte ablehnen). Darauf aufbauend
wendet `catalog validate` verpflichtende semantische Parser an: exaktes SemVer für Versionen,
SHA-512-SRI für Integritätswerte, SPDX-Ausdrucksparsing für Lizenzen und die Ablehnung
doppelter Schlüssel. Ein Wert kann dem Schema-Muster entsprechen und trotzdem semantisch
abgelehnt werden.

Regeln auf oberster Ebene: Der Eintrag ist ein einzelnes YAML-Objekt,
`additionalProperties: false` (unbekannte Felder werden abgelehnt), und alle folgenden Felder sind
pflicht — außer `media`, dem einzigen optionalen Feld.

## Felder auf oberster Ebene

| Feld               | Typ     | Erforderlich | Zusammenfassung                                                |
| ------------------ | ------- | :-----------: | ---------------------------------------------------------------- |
| `schemaVersion`    | const   |      ja       | Muss exakt `1` sein                                               |
| `id`                | string  |      ja       | Eintrags-ID in kleingeschriebenem Kebab-Case; muss dem Dateinamen entsprechen |
| `name`              | string  |      ja       | Anzeigename, 1–120 Zeichen                                        |
| `description`       | object  |      ja       | Kuratierte englische Zusammenfassung plus deren Belegpfad         |
| `unofficial`        | const   |      ja       | Muss exakt `true` sein                                            |
| `kind`              | enum    |      ja       | Kanonischer Artefakt-Diskriminator                                |
| `primaryCategory`   | enum    |      ja       | Einzelne primäre Fähigkeitskategorie                              |
| `tags`              | array   |      ja       | Eindeutige Tags in kleingeschriebenem Kebab-Case (darf leer sein) |
| `source`            | object  |      ja       | Original-Repository, Node-ID, Unterpfad und fixierter Commit      |
| `creator`           | object  |      ja       | Öffentliches GitHub-Handle des Erstellers                         |
| `package`           | object  |      ja       | Kanonischer Installationsdeskriptor (npm **oder** source)         |
| `dsh`                | object  |      ja       | DSH-Profile und Belegpfad der nativen Integration                 |
| `repositoryScope`   | enum    |      ja       | `dedicated` oder `monorepo`                                       |
| `popularity`        | object  |      ja       | Sterne-Policy und Sternezahl (bedingt durch den Scope)             |
| `license`           | object  |      ja       | Upstream-SPDX-Lizenzausdruck                                      |
| `verification`      | object  |      ja       | Verifizierungsstatus, Prüfzeitpunkt, Identität und Smoke-Test      |
| `provenance`         | object  |      ja       | Öffentliche Discussion-/Kommentar-URLs oder `null`                 |
| `media`           | array   |    nein    | Bis zu 6 Screenshots/Videos, jede URL auf `source.commit` fixiert |

### `schemaVersion`

Konstante `1`. Identifiziert die öffentliche Schema-Version 1; jeder andere Wert ist ungültig.

### `id`

String, der `^[a-z0-9]+(?:-[a-z0-9]+)*$` entspricht — kleingeschriebenes Kebab-Case, ohne
führende/nachgestellte oder doppelte Bindestriche. Gemäß [CONTRIBUTING.md](../../CONTRIBUTING.md)
muss die Eintragsdatei `catalog/plugins/<id>.yaml` mit dem identischen Wert heißen; der Validator
lehnt eine Abweichung ab (`id-filename-mismatch`). Die ID muss außerdem mit dem Namespace des
Erstellers beginnen: dem `creator.github`-Handle in Kleinbuchstaben, wobei jede Folge von
Zeichen außerhalb von `[a-z0-9]` zu einem einzelnen `-` zusammengefasst wird, gefolgt von `-`
(`id-creator-prefix`).

### `name`

Freier Anzeigename, `minLength: 1`, `maxLength: 120`.

### `description`

Objekt mit genau zwei erforderlichen Eigenschaften (keine weiteren erlaubt):

| Eigenschaft    | Typ    | Regeln                                                                 |
| -------------- | ------ | -------------------------------------------------------------------------- |
| `en`            | string | Englische Zusammenfassung, 20–320 Zeichen                                   |
| `evidencePath`  | string | Muster für relativen Repository-Pfad; kein führender `/`, keine Backslashes, keine `.`/`..`-Segmente |

Die englische Zusammenfassung muss aus der Datei unter `evidencePath` kuratiert werden, so wie
sie bei `source.commit` existiert — nicht aus einem anderen Katalog kopiert.

### `unofficial`

Konstante `true`. Maschinenlesbarer Marker dafür, dass der Eintrag inoffiziell ist.

### `kind`

Der **einzige** Artefakttyp-Diskriminator (es gibt kein zweites Integrationstyp-Feld). Einer
von:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Bedeutungen und Ranking-Konsequenzen sind in [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
definiert.

### `primaryCategory`

Eine der vierzehn Fähigkeitskategorien:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Anzeigebeschriftungen und Auswahlhinweise stehen in [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array eindeutiger Strings, jeder passend zu `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kleingeschriebenes
Kebab-Case). Das Schema erzwingt keine Mindestanzahl.

### `source`

Objekt mit genau vier erforderlichen Eigenschaften:

| Eigenschaft         | Typ              | Regeln                                                                     |
| -------------------- | ----------------- | ------------------------------------------------------------------------------ |
| `repository`          | string           | URL `https://github.com/<owner>/<repo>`; der Owner folgt den GitHub-Benutzernamensregeln, der Repo-Name hat 1–100 Zeichen, darf nicht `.`/`..` sein oder auf `.git` enden |
| `repositoryNodeId`     | string           | Unveränderliche GitHub-Repository-Node-ID, nicht leer                          |
| `subpath`              | string oder null | Plugin-Unterpfad innerhalb des Repositorys (gleiches sicheres relatives Pfadmuster wie `evidencePath`), oder `null` für ein Plugin auf Repository-Root-Ebene |
| `commit`               | string           | Vollständige 40-stellige hexadezimale Commit-OID                               |

Die Katalogvalidierung muss `repositoryNodeId` auflösen und eine Abweichung der Repository-URL
ablehnen — diese Auflösung ist ein Gate auf Maintainer-Seite, nicht Teil der lokalen
strukturellen Prüfung.

### `creator`

Objekt mit einer einzigen erforderlichen Eigenschaft:

| Eigenschaft | Typ    | Regeln                                                |
| ------------ | ------ | --------------------------------------------------------- |
| `github`     | string | GitHub-Benutzername (1–39 Zeichen, GitHub-Handle-Regeln)   |

Die öffentliche Profil-URL wird immer als `https://github.com/<handle>` abgeleitet; es gibt
kein zweites gespeichertes Profilfeld, sodass die beiden nie voneinander abweichen können.

### `package`

Der kanonische Installationsdeskriptor. Er ist Daten, nie ein Shell-Befehl, und nimmt genau
eine von zwei Formen an (`oneOf`):

**npm-Paket** — erforderlich `ecosystem`, `name`, `version`; optional `integrity`:

| Eigenschaft  | Typ    | Regeln                                                                          |
| ------------- | ------ | -------------------------------------------------------------------------------------- |
| `ecosystem`   | const  | `npm`                                                                                     |
| `name`        | string | Form des npm-Paketnamens (optional mit Scope), max. 214 Zeichen                          |
| `version`     | string | Exakte `x.y.z`-Versionsform (optional Prerelease/Build); Bereiche werden abgelehnt. Die semantische Ebene verlangt zusätzlich ein parsebares, exaktes SemVer |
| `integrity`   | string | Optionale `sha512-…`-SRI-Form, 8–256 Zeichen. Die semantische Ebene muss dies als gültiges SHA-512-SRI parsen |

**Source-Installation** — nur `ecosystem` erforderlich:

| Eigenschaft  | Typ    | Regeln   |
| ------------- | ------ | -------- |
| `ecosystem`   | const  | `source` |

Ein Source-Deskriptor speichert bewusst nichts weiteres: Repository, Commit und Unterpfad
werden aus `source` abgeleitet, sodass veränderliche Werte nie dupliziert werden.

### `dsh`

Nativer DSH-Integrationsbeleg:

| Eigenschaft    | Typ    | Regeln                                                                    |
| --------------- | ------ | -------------------------------------------------------------------------------- |
| `profiles`       | array  | Mindestens ein eindeutiger Profilname, der `^[A-Za-z0-9][A-Za-z0-9._-]*$` entspricht |
| `evidencePath`    | string | Sicherer relativer Pfad zum DSH-Integrationsbeleg bei `source.commit`            |

### `repositoryScope`

Entweder `dedicated` (die Sterne des Repositorys gehören genau diesem Plugin) oder `monorepo`
(das Plugin ist ein Unterpfad oder Paket innerhalb eines breiteren Projekts). Dieser Wert
steuert die untenstehenden bedingten Popularitätsregeln.

### `popularity`

| Eigenschaft    | Typ                 | Regeln                                                 |
| --------------- | -------------------- | ----------------------------------------------------------- |
| `starsPolicy`    | enum                | `exact-repository` oder `undefined-parent-repository`        |
| `stars`          | integer oder null   | Nicht-negative Ganzzahl, oder `null`                          |

Bedingte Regeln (erzwungen durch die `allOf`-Blöcke des Schemas):

- `repositoryScope: monorepo` **erzwingt** `starsPolicy: undefined-parent-repository` und
  `stars: null`. Sterne des übergeordneten Projekts werden nie einem Monorepo-Plugin
  zugeschrieben.
- `repositoryScope: dedicated` **erzwingt** `starsPolicy: exact-repository` und eine
  Ganzzahl `stars >= 0`.

Siehe [docs/RANKING.md](../../docs/RANKING.md), wie diese Werte in das Ranking-Prädikat
einfließen.

### `license`

| Eigenschaft | Typ    | Regeln                                                          |
| ------------ | ------ | -------------------------------------------------------------------- |
| `spdx`        | string | Form eines SPDX-Ausdrucks, 2–256 Zeichen, kein führender Bindestrich  |

Das Schema erzwingt nur eine sichere Zeichenform; die Katalogvalidierung muss den Wert mit
einem echten SPDX-Ausdrucksparser parsen und normalisieren. Erfasse den vollständigen
Upstream-Ausdruck, belegt beim fixierten Commit (zum Beispiel `Apache-2.0` oder
`MIT OR GPL-3.0-only`).

### `verification`

Die Verifizierung bezieht sich auf `source.commit`. Objekt mit vier erforderlichen
Eigenschaften:

| Eigenschaft            | Typ              | Regeln                                                    |
| ------------------------ | ----------------- | -------------------------------------------------------------- |
| `status`                  | enum              | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`               | string            | Zeitstempel der Prüfung im `date-time`-Format                    |
| `repositoryIdentity`      | const             | Muss `resolved` sein                                             |
| `smokeTest`               | object oder null  | Smoke-Test-Datensatz, oder `null`, wenn kein qualifizierter Test existiert |

Wenn vorhanden, erfordert `smokeTest`:

| Eigenschaft      | Typ    | Regeln                                                                |
| ----------------- | ------ | -------------------------------------------------------------------------- |
| `installTarget`    | const  | `canonical-install-descriptor` — verweist auf `package` oder die fixierte Source, ohne veränderliche Werte zu duplizieren |
| `check`             | object | Erforderliche `name` (Paketnamensform) und `version` (exakte Versionsform)  |
| `result`            | const  | `passed` — ein fehlgeschlagener Smoke-Test wird nicht als Smoke-Test erfasst |

Bedingte Regel: `status: verified` **erfordert** ein nicht-null `smokeTest`-Objekt. Einträge
ohne überprüfbare Smoke-Test-Belege verwenden `status: eligible` und `smokeTest: null`. Kein
Status ist eine Empfehlung oder eine Sicherheitszertifizierung — siehe
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Öffentliche Provenienz-Links, jeweils eine URI oder `null`:

| Eigenschaft   | Typ              | Regeln                                            |
| -------------- | ----------------- | -------------------------------------------------------- |
| `discussion`    | string oder null  | Öffentliche Discussion-URL, wenn vorhanden                 |
| `comment`       | string oder null  | Öffentliche Kommentar-URL, wenn vorhanden                   |

### `media`

Das einzige optionale Feld. Ein Array mit höchstens **6** Einträgen, von denen jeder einen Screenshot oder ein kurzes Video des Plugins beschreibt:

| Eigenschaft | Typ | Regeln |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` oder `video` |
| `url`    | string | Unveränderliche GitHub-URL, maximal 2048 Zeichen (siehe unten) |
| `alt`    | string | Alternativtext, 1–120 Zeichen |

Eine URL hier muss so unveränderlich sein wie `source.commit`. Ein
`raw.githubusercontent.com`-Pfad mit einem Branch-Namen (`.../main/docs/shot.png`) zeigt das, was
dieser Branch heute enthält — der Eintrag würde also ein ungeprüftes Bild veröffentlichen, sobald
der Branch sich bewegt. Zwei Formen werden akzeptiert:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — der fixierte Raw-Pfad;
- `https://github.com/<owner>/<repo>/assets/…` — die inhaltsadressierte Upload-URL von GitHub, für `video`-Einträge.

Das Schema erzwingt die sichere Form (Host, 40-stellige hexadezimale Referenz, begrenzte Länge).
`catalog validate` erzwingt den Rest semantisch: Die URL muss den `source.commit` **dieses
Eintrags** im Repository **dieses Eintrags** fixieren, und eine Branch-URL wird mit
`media[n].url must pin the entry commit, not a branch` abgelehnt.

Lassen Sie das Feld ganz weg, wenn es nichts zu zeigen gibt — `media: []` ist keine gültige Art,
"keine Screenshots" zu sagen. Das Feld ist additiv: Einträge, die vor seiner Existenz
veröffentlicht wurden, bleiben gültig, und ein Konsument, der es ignoriert, liest jeden Eintrag
genau wie zuvor.

## `kind: skill`-Einträge

Schema-Version 1 definiert außerdem einen zweiten, eigenständigen Eintragskontrakt für
`kind: skill`, veröffentlicht als [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml)
(SKL-01 Phase 0). Er berührt das obige Plugin-Schema nie: Einträge mit `kind: plugin` validieren
weiterhin exakt wie zuvor, und die Skill-Schema-Datei ist für Skill-Einträge die maßgebliche
Quelle, genauso wie das Plugin-Schema es für Plugin-Einträge ist.

Ein Skill wird nicht installiert, er wird vom Harness **geladen** — die Plugin-spezifischen
Installationsdeskriptoren (`package`, `dsh`) existieren daher auf einem Skill-Eintrag nicht und
werden durch `usage` + `compat` ersetzt. Ein Skill lebt außerdem häufig in einem
Unterverzeichnis eines Repositorys, das viele Skills beherbergt, daher sind Identität und
Deduplizierung `source.repository` + `source.subpath` statt des Repositorys allein. Ein
Skill-Eintrag lässt keine `media`-Galerie zu: Ein Skill ist Text, den der Harness lädt, es gibt
also nichts zu screenshotten (`additionalProperties: false` ist es, was das erzwingt).

Diese Felder behalten exakt die Form und die Regeln, die oben für Plugin-Einträge dokumentiert
sind: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Jedes Feld ist erforderlich
außer `triggers`, dem einzigen optionalen Skill-Feld.

### Skill-spezifische Felder

| Feld                 | Typ    | Erforderlich | Regeln                                                      |
| -------------------- | ------ | :----------: | ----------------------------------------------------------- |
| `kind`               | const  |      ja      | Muss exakt `skill` sein                                     |
| `skillScope`         | enum   |      ja      | `repository` (das gesamte Repository **ist** der Skill) oder `subdirectory` (der Skill lebt unter `source.subpath`) |
| `triggers`           | array  |     nein     | Wann der Skill greift — der Text, den ein Benutzer vor dem Laden bewertet. Mindestens 1 eindeutiger String, jeder 3–200 Zeichen; das Feld ganz weglassen, wenn es keine gibt (`triggers: []` ist ungültig) |
| `usage.load`         | string |      ja      | Wie der Harness den Skill lädt, 1–200 Zeichen; ein Skill wird geladen, nie installiert |
| `usage.evidencePath` | string |      ja      | Sicherer relativer Pfad (gleiches Muster wie `description.evidencePath`) zum Ladebeleg bei `source.commit` |
| `compat.harnessMin`  | string |      ja      | Minimale Harness-Version, gegen die der Skill verifiziert wurde; exakte `x.y.z`-Form (optional Prerelease/Build), max. 64 Zeichen. Die semantische Ebene verlangt zusätzlich ein parsebares, exaktes SemVer |

Bedingte Regeln (erzwungen durch die `allOf`-Blöcke des Skill-Schemas):

- `skillScope: subdirectory` **erzwingt**, dass `source.subpath` ein String mit einem sicheren
  relativen Pfad ist — ein in einem Unterverzeichnis gehosteter Skill muss dieses
  Unterverzeichnis fixieren.
- `skillScope: repository` **erzwingt** `source.subpath: null` — ein Ganz-Repository-Skill
  darf keinen Unterpfad deklarieren.

`verification` behält die Plugin-Form (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), aber `smokeTest` muss exakt `null` sein: Ein Skill hat keinen
Installations-Smoke-Test, und die inhaltliche Review ist das Zulassungs-Gate. Das Skill-Schema
trägt keine Bedingung `status: verified` → `smokeTest` und keine Bedingungen
`repositoryScope` → `popularity`; diese Kopplungen sind ausschließlich Plugin-Schema-Regeln.

### Semantische Ebene für Skills

Über dem Schema wendet die Katalogvalidierung dieselben verpflichtenden semantischen Parser wie
bei Plugins an, wo die Felder existieren: `license.spdx` muss als gültiger SPDX-Ausdruck parsen
(`invalid-spdx`), und `compat.harnessMin` muss ein exaktes SemVer sein (`invalid-semver`). Es
gibt keinen `invalid-sri`-Fall — ein Skill hat kein `package.integrity`.

### Skill-Identität und Deduplizierung

Der kanonische Schlüssel eines Skills ist `skill:<source.repositoryNodeId>:<normalized subpath>`.
Der Unterpfad wird nur für Identitätszwecke normalisiert: Backslashes werden zu `/`, leere und
`.`-Segmente werden verworfen, und ein leeres Ergebnis (oder `subpath: null`) wird zu `.` — das
gesamte Repository. Ein Unterpfad mit NUL-Bytes oder `..`-Segmenten wird abgelehnt, nie
„bereinigt". Zwei Skills desselben Repositorys sind zwei Einträge; dasselbe Repository +
derselbe Unterpfad zweimal ist eine Kollision.

### Minimales Skill-Beispiel

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

## Was das Schema nicht prüft

Das Schema ist absichtlich lokal und strukturell. Es prüft **nicht**, ob das Repository
existiert, ob die Node-ID mit der URL übereinstimmt, ob Belegpfade beim fixierten Commit
existieren, ob die Sternezahl korrekt ist, oder ob der Ersteller die Quelle besitzt. Diese
Prüfungen gehören zu den Maintainer-Review-Gates, beschrieben in
[CONTRIBUTING.md](../../CONTRIBUTING.md) und [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
