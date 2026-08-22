# Katalog-Governance

> 🌐 [English](../../docs/GOVERNANCE.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Wie der öffentliche Katalog verwaltet wird: wer entscheidet, was aufgenommen wird, in welcher
Reihenfolge konkurrierende Beiträge berücksichtigt werden, welche Prüfungen automatisch laufen
und welche Beurteilungen menschlich bleiben. Die hier referenzierten Richtlinien stehen in
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) und
[docs/RANKING.md](../../docs/RANKING.md); diese Seite beschreibt, wie sie zusammenwirken.

## Prinzipien

1. **Creator-first.** Der Katalog existiert, um die Arbeit von Erstellern auffindbar zu machen,
   niemals um sie in Besitz zu nehmen. Für dasselbe kanonische Plugin ersetzt ein direkter Pull
   Request des Erstellers jeden offenen Community-Kurations- oder
   Automatisierungs-Pull-Request — die vollständige Rangfolge und die Git-Identitätsregeln
   stehen in [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Ein Plugin, ein geprüfter Pull Request.** Keine Batch-Merges, keine generierten
   Massenimporte in den öffentlichen Katalog. Jeder Eintrag verdient sich seine eigene Prüfung.
3. **Belege statt Vertrauen.** Jedes öffentliche Feld lässt sich bis zum Original-Repository des
   Erstellers, beim fixierten Commit, zurückverfolgen. Eine grüne automatisierte Prüfung wird
   nie als Herkunftsbeweis akzeptiert.
4. **Immer inoffiziell.** Kein Katalogstatus wird als DeepSeek-Review, -Zertifizierung oder
   -Empfehlung dargestellt.

## Wie Änderungen auf `main` gelangen

Alle Änderungen erreichen `main` über geprüfte Pull Requests — es gibt keine direkten Pushes.
Die geltende Richtlinie für den Standard-Branch:

- **Nur Pull Requests.** Katalogeinträge, Dokumentation und Schema-Änderungen gelangen alle
  über einen PR hinein; Katalog-PRs müssen der Ein-Plugin-pro-Branch-Regel in
  [CONTRIBUTING.md](../../CONTRIBUTING.md) folgen.
- **Lineare Historie.** PRs werden so integriert, dass `main` eine lineare, überprüfbare
  Historie behält; gemergte öffentliche Historie wird nicht umgeschrieben. Wurde ein
  kuratierter Eintrag gemergt, bevor sich der Ersteller gemeldet hat, beansprucht oder
  korrigiert der Ersteller ihn in einem Folgebeitrag, anstatt die Historie umzuschreiben.
- **Auflösung von Review-Threads.** Review-Diskussionen werden vor dem Merge aufgelöst;
  ungelöstes Feedback blockiert die Integration.
- **Maintainer-Merge.** Nur ein Maintainer mergt einen Plugin-Eintrag, und das nur, nachdem
  jedes Gate in [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Review-Gates, Kollisionen und
  Merge" auf dem aktuellen PR-Commit bestanden wurde.

## Die `catalog-validation`-Prüfung

Jeder Pull Request, der `catalog/plugins/`, `schemas/` oder den Workflow selbst berührt, führt
den Job `catalog-validation` aus (`.github/workflows/validate-catalog.yml`), fixiert auf die
veröffentlichte CLI:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Was er validiert** — nur lokale Struktur und Semantik:

- Sicheres YAML-Parsing jedes Eintrags unter `catalog/plugins/`.
- Konformität mit dem öffentlichen Schema (siehe [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX-Ausdrucksparsing, exakte SemVer-Versionen, gültige SHA-512-SRI-Integritätswerte.
- Ablehnung von Duplikaten: keine wiederholten Eintrags-IDs und keine wiederholten kanonischen
  Repository-Node-plus-Unterpfad-Schlüssel.
- Der absichtlich leere Katalog besteht die Prüfung (`0 entries valid; catalog is empty`).

**Was er NICHT validiert** — und was ein grüner Check daher nie beweist:

- Entfernte Repository-Identität: Er kontaktiert nicht GitHub und löst die Repository-Node-ID
  nicht gegen die URL auf.
- Belege beim fixierten Commit: Beschreibungen, Lizenzen, DSH-Integration und
  Smoke-Test-Belege werden nicht abgerufen oder geprüft.
- Ersteller-Eigentum, Sternezahlen oder Kollisionen mit offenen Pull Requests.

Diese Beurteilungen gehören zu den separaten Provenienz-Gates der Maintainer, die vor dem Merge
angewendet werden und in [CONTRIBUTING.md](../../CONTRIBUTING.md) beschrieben sind. Die lokale
Prüfung ist die Untergrenze, nicht die Messlatte.

## Verifizierungsstatus

Die Verifizierung wird pro Eintrag gegen dessen exakt fixierten Commit erfasst, unter
Verwendung der im öffentlichen Schema definierten Status (`eligible`, `verified`, `stale`,
`unavailable`, `archived`, `quarantined`). Die beiden positiven Status sind bewusst eng
gefasst:

- `eligible` — die öffentliche Struktur und die native DSH-Integration wurden validiert.
- `verified` — zusätzlich ist ein Installations-Smoke-Test für die fixierte Quelle oder das
  Paket bestanden; das Schema verlangt, dass der Smoke-Test-Datensatz vorhanden ist.

Weder dieser Status noch irgendein anderer ist eine Empfehlung, eine Garantie oder eine
Sicherheitszertifizierung. Die vollständige Semantik, einschließlich der Interaktion der
Status mit dem Ranking, steht in [docs/RANKING.md](../../docs/RANKING.md); die Datensatzform
steht in [docs/SCHEMA.md](../../docs/SCHEMA.md).

## Ansprüche, Korrekturen und Entfernungen

Strukturierte GitHub-Issue-Formulare (`.github/ISSUE_TEMPLATE/`) sind der geregelte Weg, um
einen Eintrag zu ändern, den du nicht selbst eingereicht hast:

| Formular       | Wer es nutzt                              | Ergebnis                                             |
| -------------- | ------------------------------------------ | ----------------------------------------------------- |
| **Claim**      | Ein Ersteller, dessen Plugin jemand anderes kuratiert hat | Das Eigentum wird an die Originalquelle gebunden; der Ersteller kann anschließend direkt beitragen |
| **Correction** | Jeder, der ungenaue öffentliche Metadaten entdeckt | Eine geprüfte Korrektur am betroffenen Eintrag |
| **Removal**    | Ein Ersteller, der seinen Eintrag entfernt haben möchte, oder jemand, der einen Richtlinienverstoß meldet | Geprüfte Entfernung oder Quarantäne des Eintrags |

Regeln, die für alle drei Abläufe gelten:

- Eigentumsansprüche müssen durch überprüfbare öffentliche Belege gestützt werden
  (Repository-Eigentum, Paket-Urheberschaft, Manifest-Metadaten oder fixierte Quellhistorie) —
  ein Kommentar in einer Discussion begründet keine Urheberschaft
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Sicherheitsprobleme in einem gelisteten Plugin gehen zuerst an den eigenen Maintainer dieses
  Plugins; die Katalogseite kümmert sich dann um Korrektur oder Quarantäne, ohne
  Exploit-Details zu veröffentlichen ([SECURITY.md](../../SECURITY.md)).
- Füge niemals Zugangsdaten, private Kontaktinformationen oder andere Geheimnisse in ein
  Formular ein.

## Rollen

- **Ersteller** besitzen ihre Plugins und den Vorrang ihrer Einträge. Sie können direkt
  beitragen, Community-Kuration genehmigen oder einen bestehenden Eintrag beanspruchen,
  korrigieren oder entfernen lassen.
- **Community-Mitwirkende** dürfen Einträge für Ersteller kuratieren, die noch nicht selbst
  beigetragen haben, unter den Regeln für respektvollen Kontakt und Namensnennung in
  [docs/CREDIT.md](../../docs/CREDIT.md). Kuration hat nie Vorrang vor einem späteren direkten
  Beitrag des Erstellers.
- **Maintainer** prüfen, wenden die Provenienz-Gates an, lösen Kollisionen auf und mergen. Sie
  pflegen außerdem die Website
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) und die
  veröffentlichte CLI aus privatem Quellcode; die öffentlichen Daten, das Schema und die
  Richtlinien dieses Repositorys sind das, was diese Oberflächen konsumieren.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
