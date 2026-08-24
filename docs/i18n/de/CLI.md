# CLI-Referenz — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Diese Seite dokumentiert die veröffentlichte CLI genau so, wie sie sich in Version `1.0.1`
verhält. Jede Synopse und jedes Flag unten stammt aus der eigenen `--help`-Ausgabe des
veröffentlichten Befehls; nichts hier beschreibt unveröffentlichtes Verhalten. Die CLI wird in
diesem Repository unter [`cli/`](../../cli) entwickelt und als
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) auf npm veröffentlicht,
mit einer Provenance-Attestierung, die jeden Build an den Commit und den Workflow-Lauf bindet,
der ihn erzeugt hat.

```bash
npx omni-dsh-plugins --help
```

## Designprinzipien in v1.0.1

- **Standardmäßig schreibgeschützt.** `catalog`, `search`, `info`, `list` und `doctor`
  verändern niemals Profile, schreiben keine Dateien und starten keinen Plugin-Code.
- **Consent-Gate für Codeausführung.** `add`, `update` und `remove` verweigern die Ausführung
  von DSH/pnpm-Lifecycle-Code, sofern du nicht `--allow-code-execution` übergibst. Ohne dieses
  Flag nutze `--dry-run`, um den verifizierten Plan zu sehen.
- **Native Windows-Policy.** Natives Windows-`add`/`update`/`remove` mit Codeausführung ist in
  v1.0.1 deaktiviert; nutze WSL. Dry-Run und die schreibgeschützten Befehle bleiben verfügbar,
  und native Windows-Wiederherstellungsmarker erfordern eine dokumentierte manuelle
  Wiederherstellung.
- **Fixierte Eingaben.** Die Katalogeingabe kann ein lokales Verzeichnis, eine Snapshot-Datei
  oder eine fixierte öffentliche Snapshot-URL sein, optional gesperrt auf eine exakte
  40-stellige Revision.

## Gemeinsame Optionen

Diese Optionen erscheinen bei den katalogkonsumierenden Befehlen (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Option                    | Bedeutung                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `--catalog <path-or-url>` | Lokales Katalogverzeichnis, Snapshot-Datei oder fixierte öffentliche Snapshot-URL |
| `--revision <sha>`        | Exakte 40-stellige Snapshot-Revision                                |
| `--json`                  | Gibt stabile JSON-Ausgabe aus                                       |

Globale Optionen: `-V, --version` gibt die CLI-Version aus; `-h, --help` gibt die Hilfe für
jeden Befehl aus (`dsh-plugins help [command]` funktioniert ebenfalls).

## Exit-Codes

Die CLI verwendet konventionelle Prozess-Exit-Codes:

| Exit-Code | Bedeutung                                                                  |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Erfolg (einschließlich "leer, aber gültig"-Ergebnisse wie ein leerer Katalog) |
| `1`       | Fehlschlag: Validierungsfehler, Eintrag nicht gefunden, erforderliche Option fehlt, oder eine Diagnoseprüfung meldet einen Fehler |

Mit v1.0.1 beobachtete Beispiele: `catalog validate` bei einem gültigen leeren Katalog endet
mit `0` und `0 entries valid; catalog is empty`; `info <unknown-id>` endet mit `1` und
`Plugin not found`; `doctor` endet mit `1`, wenn irgendeine Prüfung (etwa ein fehlendes
`dsh`-Executable) einen Fehler meldet.

## Befehle

### `catalog` — validiert die öffentlichen Katalogoberflächen

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — validiert Katalog-YAML und -Semantik: sicheres YAML-Parsing, das
  öffentliche Schema, SPDX-Ausdrucksparsing, exaktes SemVer, SHA-512-SRI und die Ablehnung
  doppelter IDs / Repository-Node-plus-Unterpfad-Kombinationen. Es ist lokal und
  schreibgeschützt: es kontaktiert nicht GitHub, löst keine Repository-Identität auf und prüft
  keine Belege beim fixierten Commit. Dies ist genau der Befehl, den der CI-Job
  `catalog-validation` bei jedem Katalog-Pull-Request ausführt.
- **`catalog docs-check [root]`** — prüft, ob die erforderliche öffentliche Katalogdokumentation
  existiert und ob Markdown-Fences ausgeglichen sind.
- **`catalog github-forms-check [root]`** — prüft die strukturierten öffentlichen
  GitHub-Issue-Formulare (Claim, Correction, Removal).

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — durchsucht öffentliche Katalogfelder lokal

```text
dsh-plugins search [options] <query...>
```

Durchsucht öffentliche Katalogfelder lokal anhand der ausgewählten Katalogeingabe. Gibt
passende Einträge aus, oder `No plugins found.` (Exit `0`), wenn nichts passt.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — findet Plugins jenseits des Katalogs

```text
dsh-plugins discover [options] <query...>
```

> `discover` erscheint in `1.0.0`, dem ersten Release unter diesem Paketnamen.

Durchsucht zunächst den kuratierten Katalog, dann — sofern nicht `--offline` übergeben wird —
das Live-GitHub-Topic `dsh-plugin`, sodass ein Plugin, das noch nicht eingereicht wurde,
trotzdem auffindbar ist. Katalogergebnisse tragen die Belege, die der Katalog vorhält
(fixierter Commit, Ersteller, Lizenz); Community-Ergebnisse tragen nichts davon und sind als
solche gekennzeichnet, da nichts an ihnen überprüft wurde.

`--limit <n>` begrenzt die Ergebnisse pro Stufe (Standard `8`). `--json` gibt die stabile
maschinenlesbare Form aus, die nie lokalisiert wird.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — zeigt einen öffentlichen Katalogeintrag

```text
dsh-plugins info [options] <id>
```

Zeigt einen öffentlichen Katalogeintrag anhand der kanonischen Plugin-ID. Endet mit `1` und
`Plugin not found: <id>`, wenn die ID nicht im Katalog vorhanden ist.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — fügt ein Katalog-Plugin über offizielle DSH-Delegation hinzu

```text
dsh-plugins add [options] <id>
```

| Option                   | Bedeutung                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `--profile <name>`       | Zu ändernde DSH-Profildatei (in der Praxis erforderlich; der Befehl schlägt ohne sie fehl) |
| `--dry-run`              | Zeigt den verifizierten Plan ohne Dateien oder Subprozesse           |
| `--allow-code-execution` | Zustimmung zu DSH/pnpm-Lifecycle-Code (natives Windows deaktiviert; nutze WSL) |
| `--catalog` / `--revision` / `--json` | Gemeinsame Optionen oben                                |

Dry-Run-Semantik in dieser Version: Der Befehl löst den Plan für den fixierten Eintrag auf,
verifiziert ihn und gibt ihn aus, ohne Dateien zu erzeugen oder Subprozesse zu starten. Die
tatsächliche Installation delegiert an offizielle DSH-Tools und läuft nur mit
`--allow-code-execution` weiter.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — aktualisiert ein Katalog-Plugin über offizielle DSH-Delegation

```text
dsh-plugins update [options] <id>
```

Dieselben Optionen und dieselbe Zustimmungssemantik wie bei `add`: `--profile <name>`,
`--dry-run`, `--allow-code-execution`, plus die gemeinsamen Katalogoptionen.

### `remove` — entfernt ein katalogverwaltetes Plugin über offizielle DSH-Delegation

```text
dsh-plugins remove [options] <id>
```

Dieselben Optionen und dieselbe Zustimmungssemantik wie bei `add`. Es werden nur
katalogverwaltete Installationen entfernt.

### `recover` — stellt eine zurückgehaltene POSIX-Mutation wieder her

```text
dsh-plugins recover
```

Stellt eine zurückgehaltene POSIX-Mutation nach einem unterbrochenen `add`/`update`/`remove`
wieder her. Ist nichts anhängig, gibt der Befehl `No mutation recovery is pending.` aus und
endet mit `0`. Die native Windows-Wiederherstellung bleibt gemäß der dokumentierten Policy
manuell.

### `list` — listet katalogverwaltete Installationen auf

```text
dsh-plugins list [--profile <name>] [--json]
```

Listet katalogverwaltete Installationen auf, ohne Profile zu verändern. `--profile <name>`
filtert nach DSH-Profil. Gibt es keine Installationen, wird `No catalog-managed plugins
installed.` ausgegeben und mit `0` beendet.

### `doctor` — schreibgeschützte Diagnose

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Führt schreibgeschützte Diagnosen für Node, DSH, native Windows-Policy und den Katalog aus.
Jede Prüfung meldet `ok` oder `error`; jeder `error` macht den Gesamt-Exit-Code zu `1`.
Beispielausgabe auf einer Maschine ohne `dsh`-Executable:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Was die lokale Validierung nicht beweist

Ein grüner `catalog validate`-Lauf bestätigt nur Struktur und lokale Semantik. Er beweist
weder die entfernte Repository-Identität, das Ersteller-Eigentum, noch Belege beim fixierten
Commit — Maintainer wenden diese separaten Provenienz-Gates vor jedem Merge an, wie
beschrieben in [CONTRIBUTING.md](../../CONTRIBUTING.md) und
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
