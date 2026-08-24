# Katalog-Kategorien

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Jeder Katalogeintrag hat einen Artefakttyp, eine primäre Fähigkeitskategorie und null oder mehr
Tags. Die primäre Kategorie bestimmt, wo der Eintrag erscheint; Tags ermöglichen
kategorieübergreifende Suche, ohne den Eintrag zu duplizieren.

## Artefakttypen

<!-- catalog-policy:aggregators-never-entries -->

| Wert | Bedeutung | Als Plugin nach Sternen gerankt |
|---|---|---:|
| `plugin` | Installierbares natives DSH-Bundle | Nur wenn jede Ranking-Bedingung erfüllt ist |
| `plugin-family` | Repository mit mehreren DSH-Plugins | Nein; eigener Abschnitt |
| `skin-theme` | DSH-UI-Skin oder visuelles Theme | Nein; eigener Abschnitt |
| `skill` | Agent-Skill mit DSH-Unterstützung | Nein |
| `preset-profile` | DSH-Profil oder Preset | Nein |
| `client-interface` | Desktop-, TUI-, Editor- oder Remote-Client | Nein |
| `bridge-adapter` | Integration eines anderen Produkts in DSH | Nein |
| `ecosystem-project` | Breiteres Projekt mit einer DSH-Integration | Nein |

Ein Umbrella-Repository, ein Aggregator, ein Marktplatz, ein Installer-Katalog oder eine Liste
ist niemals ein Katalogeintrag, selbst wenn der Aggregator selbst installierbar ist. Er darf nur
als Hinweis genutzt werden. Folge jedem Hinweis bis zu einem unabhängig installierbaren
Kind-Artefakt und löse dessen tatsächlichen Ersteller, Original-Repository, Paket und
Quell-Unterpfad auf, bevor du ihn einreichst. Ein echtes Ersteller-Monorepo kann das
Original-Repository für ein Kind-Plugin sein, aber das Kind muss diesen exakten Unterpfad und
die Monorepo-Sterne-Policy verwenden.

Das Feld `kind` ist der kanonische DSH-Artefakt-Diskriminator. Es gibt kein separates
Integrationstyp-Feld: `plugin` bedeutet bereits ein natives DSH-Bundle, während
`ecosystem-project` bereits ein breiteres Projekt mit DSH-Integration bedeutet. Das verhindert
widersprüchliche Klassifizierungspaare.

## Primäre Fähigkeitskategorien

| Wert | Anzeigebeschriftung |
|---|---|
| `user-interface-dashboards` | Benutzeroberfläche und Dashboards |
| `memory-rag` | Memory und RAG |
| `search-research` | Suche und Recherche |
| `coding-developer-tools` | Coding und Entwicklerwerkzeuge |
| `browser-automation` | Browser und Automatisierung |
| `vision-audio-multimodal` | Vision, Audio und multimodal |
| `sessions-productivity` | Sessions und Produktivität |
| `security-permissions-approvals` | Sicherheit, Berechtigungen und Freigaben |
| `diagnostics-observability` | Diagnose und Observability |
| `models-providers-routing` | Modelle, Provider und Routing |
| `messaging-notifications` | Messaging und Benachrichtigungen |
| `data-external-services` | Daten und externe Dienste |
| `entertainment-customization` | Entertainment und Anpassung |

Wähle die Kategorie, die die primäre Aufgabe des Plugins am besten repräsentiert — nicht die
Kategorie, die die Sichtbarkeit am wahrscheinlichsten erhöht.

## Interface-Tags

Zu den Standard-Interface-Tags gehören `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` und `theme`. Zusätzliche Fähigkeits-Tags in
kleingeschriebenem Kebab-Case sind erlaubt, wenn sie in der fixierten Originalquelle sichtbare
Belege beschreiben.

## Repository-Umfang

Verwende `dedicated` nur, wenn die Sterne des Repositorys genau zu diesem katalogisierten
Plugin gehören. Verwende `monorepo`, wenn das Plugin ein Unterpfad oder Paket innerhalb eines
breiteren Projekts ist. Ein Monorepo-Eintrag muss
`popularity.starsPolicy: undefined-parent-repository` und `popularity.stars: null` verwenden.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
