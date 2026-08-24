# Mitwirken

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Danke, dass du den Katalog verbesserst. Beiträge folgen dem Creator-first-Prinzip: nutze
Belege aus dem Original-Repository, bewahre die Namensnennung und halte jedes Plugin
unabhängig überprüfbar. Der Katalog startet per Design leer; kein Eintrag wird ohne einen
eigenen geprüften Pull Request akzeptiert.

## Beginne beim Ersteller

Ein Pull Request, der direkt vom Plugin-Ersteller oder der besitzenden Organisation eröffnet
wird, ist immer vorzuziehen. Wenn der Ersteller bereit ist beizutragen, nutze dessen Branch und
Pull Request, anstatt dessen Arbeit in einem Kurations- oder Automatisierungs-Branch nachzubauen.

Community-Kuration ist willkommen, wenn sie einem Ersteller hilft, der noch keinen Pull Request
eröffnet hat. Sie begründet weder Eigentum noch Vorrang gegenüber einem späteren direkten Beitrag
des Erstellers.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Ein Plugin pro Branch und Pull Request

Erstelle einen dedizierten Branch für ein einzelnes Plugin und eröffne einen einzelnen Pull
Request aus diesem Branch. Der Branch und der Pull Request müssen genau eine YAML-Datei unter
`catalog/plugins/` erstellen oder ändern. Vermische in diesem Branch oder Pull Request keine
Plugins, keine Dokumentationsbereinigung, keine generierten Indizes und keine unabhängige
Wartung.

Die Eintrags-ID und der Dateiname müssen derselbe Wert in kleingeschriebenem Kebab-Case sein.
Maintainer prüfen und mergen jeden Plugin-Pull-Request einzeln; ein Batch mit mehreren Plugins
wird nicht aufgeteilt oder teilweise gemergt.

## Löse die Originalquelle auf

Jedes öffentliche Feld muss aus dem Original-Repository des Erstellers, dem Paket, dem
Manifest, der README, der Lizenz oder dem Release beim fixierten Commit rekonstruiert werden.
Kopiere keinen Text, keine Kategoriezuordnung, keine Screenshots, kein Ranking, keine Badges
und keine generierten Metadaten aus einem anderen Katalog oder Aggregator. Ein Link, der in
einem Umbrella-Projekt, Marktplatz, einer Liste oder einem Aggregator gefunden wird, ist nur
ein Hinweis, keine Belegquelle und nicht die Plugin-Quelle.

Reiche niemals ein Umbrella-, Aggregator-, Marktplatz-, Installer-Katalog- oder Listen-Projekt
als Katalogeintrag ein, selbst wenn es unabhängig installierbar ist. Nutze es nur als Hinweis
und löse jedes unabhängig installierbare Kind-Plugin bis zu seinem tatsächlichen Ersteller und
Original-Repository auf. Ein Plugin im echten Monorepo seines Erstellers kann aus seinem
exakten Unterpfad eingereicht werden, muss dabei aber die untenstehende Monorepo-Sterne-Policy
befolgen.

## Erforderliche Belege

Stelle im Pull Request Folgendes vollständig bereit:

- Die kanonische öffentliche URL des Original-Repositorys und dessen unveränderliche
  Repository-Node-ID. Maintainer lösen die Node-ID auf und lehnen URL-Abweichungen im
  separaten Provenienz-Gate ab.
- Das öffentliche GitHub-Handle des Erstellers und die passende öffentliche Profil-URL. Das
  YAML speichert das Handle einmal; die Profil-URL wird als `https://github.com/<handle>`
  abgeleitet.
- Eine vollständige 40-stellige Quell-Commit-OID und der exakte Plugin-Unterpfad, oder `null`
  für ein Plugin auf Repository-Root-Ebene.
- Eine begrenzte englische Beschreibung und ihr Belegpfad bei diesem fixierten Commit.
- Der Artefakt-`kind`, die primäre Kategorie und die Tags, ausgewählt aus
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Der vollständige Upstream-SPDX-Lizenzausdruck, belegt beim fixierten Commit.
- Ein kanonischer Installationsdeskriptor, fixiert auf eine exakte npm-Version, oder auf das
  Quell-Repository, den vollständigen Commit und den Unterpfad. Der Deskriptor ist Daten, nie
  ein Shell-Befehl.
- Nativer DSH-Integrationsbeleg und dessen Pfad beim fixierten Commit.
- Vorhandener, nicht sensibler Smoke-Test-Beleg für genau diesen Artefakt-Pin, oder der
  explizite Wert `not run`. Installiere das Plugin nicht und führe `preinstall`, `install`,
  `postinstall`, `prepare` oder anderen Paket-/Plugin-Lifecycle-Code nicht allein aus, um einen
  Katalogbeitrag vorzubereiten.
- Für ein dediziertes Repository die überprüfbare Sterneanzahl für genau dieses Repository,
  zusammen mit der öffentlichen Quelle und dem Prüfzeitpunkt. Für ein Monorepo-Plugin nutze die
  untenstehende erforderliche Null-Policy.
- Öffentliche Discussion- oder Kommentar-Provenienz, wenn vorhanden; andernfalls `null`.
- Der maschinenlesbare Wert `unofficial: true`.

Existiert kein qualifizierter Smoke-Test, verwende `verification.status: eligible` und
`verification.smokeTest: null`. Verwende `verified` nur, wenn überprüfbare Smoke-Test-Belege
für genau diesen Pin existieren. Keiner der beiden Zustände ist eine Empfehlung oder eine
Sicherheitszertifizierung.

Reiche niemals Zugangsdaten, Cookies, private E-Mail-Adressen, unveröffentlichten Quellcode
oder andere Geheimnisse ein.

## YAML- und Schema-Regeln

Erstelle `catalog/plugins/<plugin-id>.yaml` und validiere sie gegen
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). Die `id` muss dem
Basisnamen der Datei entsprechen und mit deinem Namespace beginnen: deinem
`creator.github`-Handle in Kleinbuchstaben (jede Folge von Zeichen außerhalb von `[a-z0-9]`
wird zu einem einzelnen `-`), gefolgt von `-` — zum Beispiel `some-creator-my-plugin` für das
Handle `Some-Creator`. Die Katalogvalidierung erzwingt beides. Das Schema ist die maßgebliche
Quelle für Feldnamen und erlaubte Werte; [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
definiert, wie der einzelne Artefakt-`kind`, die primäre Kategorie, die Tags und der
Repository-Scope gewählt werden.

Ein npm-Deskriptor muss einen gültigen Paketnamen und eine exakte Version enthalten. Das
öffentliche Schema lehnt options-artige und unbegrenzte Werte ab, implementiert aber weder
SemVer noch SRI neu: Die Katalogvalidierung muss die Version parsen, exaktes SemVer verlangen
und jeden Integritätswert als gültiges SHA-512-SRI parsen. Ein Quell-Deskriptor ist an
`source.repository`, `source.commit` und `source.subpath` gebunden, ohne veränderliche
Quellwerte zu duplizieren.

Installer müssen Argument-Arrays verwenden, die Shell-Ausführung deaktivieren und einen
Options-Terminator vor katalogbereitgestellten Positionswerten platzieren, wo der aufgerufene
Befehl dies unterstützt. Die Einreichungsvalidierung darf keinen Installer oder Plugin-Lifecycle
aufrufen.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` ist eine lokale, schreibgeschützte strukturelle und semantische Prüfung. Sie
parst sicheres YAML, validiert das öffentliche Schema, parst SPDX-Ausdrücke, verlangt exaktes
SemVer und gültiges SHA-512-SRI und lehnt doppelte IDs sowie kanonische
Repository-Node-plus-Unterpfad-Schlüssel ab. Sie kontaktiert nicht GitHub, löst keine
Repository-Identität auf und prüft keine Belegpfade beim fixierten Commit.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Bevor ein Eintrag `eligible` erreicht, lösen Maintainer separat das kanonische Repository und
die Node-ID auf, binden den Ersteller an die Originalquelle und prüfen die deklarierte
Beschreibung, Lizenz, DSH-Integration und die Smoke-Test-Belege bei `source.commit`. Ein
lokal grünes Validierungsergebnis ist kein Beweis für Provenienz oder Herkunft.

## Repository-Sterne

Nur Sterne, die nachweislich zum exakten dedizierten Plugin-Repository gehören, dürfen erfasst
werden. Die Sterne eines übergeordneten Projekts dürfen niemals einem Plugin zugeschrieben
werden, das in einem breiteren Monorepo gespeichert ist. Ein Monorepo-Eintrag bleibt für
funktionale Katalogbereiche geeignet, muss aber deklarieren:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Ein dedizierter Eintrag verwendet `repositoryScope: dedicated`, `starsPolicy: exact-repository`
und die nicht-negative Sterneanzahl, die auf genau diesem Repository beobachtet wurde. Lies
[docs/RANKING.md](../../docs/RANKING.md), bevor du Popularitätsdaten einreichst.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Vorrang des Erstellers und respektvoller Kontakt

Für dasselbe kanonische Plugin gilt folgende Rangfolge:

1. Ein Pull Request, eröffnet vom Ersteller oder der besitzenden Organisation.
2. Ein Community-Pull-Request, ausdrücklich vom Ersteller genehmigt.
3. Ein bestehender gültiger Community-Kurations-Pull-Request.
4. Ein Katalog-Automatisierungs-Pull-Request.

Ein direkter Pull Request des Erstellers ersetzt jeden offenen Kurations- oder
Automatisierungs-Pull-Request, unabhängig davon, welcher zuerst eröffnet wurde oder weiter
fortgeschritten ist. Der Pull Request des Erstellers wird zum Review-Vehikel; Maintainer
führen keinen Force-Push auf den Branch des Erstellers durch und übertragen dessen Arbeit
nicht in den kuratierten Pull Request. Wurde ein kuratierter Eintrag bereits gemergt, wird die
öffentliche Historie nicht umgeschrieben. Der Ersteller kann eine Anspruchs- oder
Korrekturanfrage nutzen und anschließend direkt einen Folge-Pull-Request beitragen.

Ein kuratierter Pull Request sollte eine einzige respektvolle öffentliche `@ersteller`-Erwähnung
in seiner Beschreibung verwenden, neben einem Link zum Original-Repository, der den Ersteller
einlädt, ihn zu überprüfen oder durch einen direkten Pull Request zu ersetzen. Wiederhole die
Erwähnung nicht, eröffne keine Werbe-Issues, poste nicht cross-plattform, sende keine
unerwünschten Direktnachrichten und spamme den Ersteller auf keine andere Weise.

<!-- creator-first:source-bound-git-identity -->

Vom Ersteller autorisierte Pull Requests und Commits bewahren die Namensnennung des Erstellers
auf natürliche Weise. Kuratierte Commits dürfen die Git-Autorschaft des Erstellers oder einen
`Co-authored-by`-Trailer nur mit einer quellgebundenen, öffentlich überprüfbaren Identität
verwenden. Erfinde oder errate niemals eine E-Mail-Adresse. Ist keine verifizierte
Git-Identität verfügbar, autorisiert der Kurator den Commit selbst und gibt explizit
"Created by @handle"-Credit mit dem Link zum Original-Repository im YAML und im Pull Request.
Ein Maintainer- oder Automatisierungskonto kann Committer oder verifizierter Co-Autor sein,
darf aber nicht die Autorschaft des Erstellers ersetzen. Siehe
[docs/CREDIT.md](../../docs/CREDIT.md) für die vollständige Policy.

## Validierungsbefehle und Verfügbarkeit

Der npm-CLI ist als `omni-dsh-plugins@1.0.1` veröffentlicht, daher sind die
untenstehenden Befehle heute über `npx` verfügbar. Verwende sie exakt wie geschrieben;
Mitwirkende sollten keine Ersatzbefehle erfinden.

Führe diese Befehle vom Repository-Root aus aus:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` führt nur die oben beschriebenen lokalen YAML-, Schema-, SPDX-, exakten
SemVer-, SHA-512-SRI- und Duplikatsprüfungen durch und akzeptiert den absichtlich leeren
Katalog. Es beweist weder die entfernte Repository-Identität noch fixierte Quellbelege. Die
anderen Befehle prüfen die erforderliche öffentliche Dokumentation und die strukturierten
GitHub-Issue-Formulare. Das lokale Bestehen dieser Befehle lockert die Belegpflichten nicht;
Maintainer wenden weiterhin jedes entsprechende Release-Gate vor dem Mergen an.

## Review-Gates, Kollisionen und Merge

Maintainer wenden vor dem Mergen jedes Gate auf den aktuellen Pull-Request-Commit an:

1. **Umfang:** ein dedizierter Branch, eine Plugin-YAML-Datei und keine nicht verwandten
   Änderungen.
2. **Originale Identität:** Ersteller, kanonisches Repository, Node-ID, vollständiger Commit
   und Unterpfad stimmen überein.
3. **Schema und Belege:** YAML, Kategorien, SPDX, Installations-Pin, DSH-Beleg und
   Smoke-Test-Status sind intern konsistent, ohne Plugin-Lifecycle-Code auszuführen.
4. **Popularität:** dedizierte Sterne sind auf dem exakten Repository überprüfbar, oder
   Monorepo-Sterne sind `null` mit `undefined-parent-repository`.
5. **Dokumentation und Formulare:** öffentliche Dokumentation, Markdown-Fences und
   strukturierte Formulare bleiben gültig.
6. **Kollision und Deduplizierung:** kein gemergter Eintrag und kein offener Pull Request
   repräsentiert dasselbe kanonische Plugin.

Unterschiedliche Namen oder IDs machen doppelte Plugins nicht zu unterschiedlichen Plugins.
Behandle dieselbe Repository-Node-ID und denselben Unterpfad, dasselbe kanonische Paket oder
ein anderes nachweislich identisches Installationsziel als Kollision. Löse Aliase und
konkurrierende Pull Requests vor dem Merge auf. Ein direkter Pull Request des Erstellers
gewinnt eine Kollision gegen Kuration oder Automatisierung; andernfalls wählen Maintainer ein
Review-Vehikel aus und schließen oder leiten Duplikate um, statt beide zu mergen.

Nur ein Maintainer mergt ein Plugin, nachdem alle Gates bestanden wurden. Jedes akzeptierte
Plugin wird einzeln gemergt; Validierung, Kuration oder Automatisierung implizieren keinen
automatischen oder Batch-Merge.

## Pull-Request-Checkliste

- [ ] Ich habe einen dedizierten Branch verwendet und dieser PR ändert genau einen
      Plugin-Eintrag.
- [ ] Die Quelle ist das Original-Repository des Erstellers, kein Umbrella- oder
      Aggregator-Projekt.
- [ ] Handle/Profil des Erstellers, Repository, Node-ID, Unterpfad und vollständiger Commit
      sind belegt.
- [ ] Kind, Kategorie und Tags folgen `docs/CATEGORIES.md`.
- [ ] Die SPDX-Lizenz und der fixierte Installationsdeskriptor sind belegt.
- [ ] Native DSH-Integration und das Smoke-Test-Ergebnis oder der Status `not run` sind belegt.
- [ ] Ich habe keinen Plugin- oder Paket-Lifecycle-Code ausgeführt, um diesen Beitrag
      vorzubereiten.
- [ ] Dedizierte Sterne sind überprüfbar, oder Monorepo-Sterne verwenden die erforderliche
      Null-Policy.
- [ ] Ich habe auf einen bestehenden Eintrag und einen offenen Pull Request für dasselbe
      kanonische Plugin geprüft.
- [ ] Der Eintrag ist ausdrücklich als inoffiziell markiert und enthält keine Geheimnisse oder
      privaten personenbezogenen Daten.

## Sprachpolicy

Launch-Dokumentation und Katalogbeschreibungen sind ausschließlich auf Englisch. Der Rollout
für 43 Locales bleibt ein Post-MVP-Backlog-Punkt; füge keine leeren Locale-Dokumente oder
automatischen Massenübersetzungen hinzu.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
