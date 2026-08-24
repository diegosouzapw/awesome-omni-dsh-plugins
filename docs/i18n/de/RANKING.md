# Ranking-Methodik

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Rankings sind transparente Ansichten über gemergte öffentliche Katalogeinträge. Sie verwenden
nie eine verborgene kombinierte Punktzahl und behandeln Sterne eines breiteren übergeordneten
Projekts nie als Plugin-Popularität.

## Top-Plugins-nach-Sternen-Prädikat

Ein Eintrag qualifiziert sich nur, wenn jede der folgenden Bedingungen zutrifft:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Qualifizierte Einträge verwenden `popularity.starsPolicy: exact-repository` und eine
nicht-negative Ganzzahl in `popularity.stars`. Bei Gleichstand wird die
Groß-/Kleinschreibung-unabhängige Plugin-ID als deterministische Anzeigereihenfolge verwendet;
der Gleichstand-Tiebreak impliziert keinen Qualitätsunterschied.

`kind` ist der einzige Artefakttyp-Diskriminator. Das Schema speichert absichtlich kein zweites
DSH-Integrationstyp-Feld, das ihm widersprechen könnte.

## Explizite Ausschlüsse

Ein Plugin innerhalb eines breiteren Monorepos bleibt katalogfähig, aber seine übergeordneten
Sterne sind für das Plugin-Ranking undefiniert. Es muss `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` und `popularity.stars: null`
verwenden. Es erscheint in funktionalen Abschnitten und ist von jedem sternenbasierten
Ranking ausgeschlossen.

Plugin-Familien, Themes, Skins, Skills, Presets, Clients, Interfaces, Bridges und breitere
Ökosystem-Projekte erscheinen nicht in Top Plugins by Stars. Sie erhalten separate Abschnitte,
wo vergleichbare Daten existieren. Aggregatoren, Marktplätze, Installer-Kataloge und Listen
sind keine Katalogeinträge und erhalten keinen Katalogabschnitt.

## Ranking-Ansichten

Das Projekt kann eigene Ansichten für Sterne, 24-Stunden-Wachstum, 7-Tage-Wachstum, aktuelle
Aktualisierungen, verifizierte Installationen, Plugin-Familien, Themes und Skins, Clients und
Interfaces sowie Ökosystem-Integrationen veröffentlichen. Jede Ansicht muss ihre eigene
Einschlussregel und ihren Snapshot-Zeitpunkt offenlegen.

Bei null qualifizierten Einträgen wird Top Plugins nicht gerendert. Der erste qualifizierte
Merge erzeugt eine Top-Plugins-Ansicht; die Beschriftung ändert sich erst zu Top 10, wenn zehn
qualifizierende Einträge existieren. Kein Platzhalter- oder erfundenes Ranking ist erlaubt.

## Verifizierung ist keine Empfehlung

`eligible` bedeutet, dass die öffentliche Struktur und die DSH-Integration validiert wurden.
`verified` bedeutet zusätzlich, dass ein Installations-Smoke-Test für die fixierte Quelle oder
das Paket bestanden wurde. Kein Status ist eine Empfehlung, eine Garantie oder eine absolute
Sicherheitszertifizierung.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
