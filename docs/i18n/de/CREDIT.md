# Ersteller-Namensnennung und Pull-Request-Vorrang

> 🌐 [English](../../docs/CREDIT.md) · **Deutsch**

> **Inoffizielles Community-Projekt. Nicht mit DeepSeek verbunden, nicht von DeepSeek unterstützt oder gesponsert.**
> DeepSeek-Namen und -Marken gehören ihren jeweiligen Eigentümern.

Der Katalog existiert, um unabhängige DSH-Arbeit auffindbar zu machen, ohne ihren Erstellern
das Eigentum daran zu nehmen. Öffentliche Einträge zitieren das Original-Repository und einen
unveränderlichen Quell-Commit.

## Vorrang für dasselbe Plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Ein Pull Request, eröffnet vom Plugin-Ersteller oder der besitzenden Organisation.
2. Ein Community-Pull-Request, ausdrücklich genehmigt oder mitverfasst vom Ersteller.
3. Ein bestehender gültiger Community-Pull-Request.
4. Ein Katalog-Automatisierungs-Pull-Request.
5. Ein privater Kandidat ohne öffentlichen Pull Request.

Ein direkter Pull Request des Erstellers wird immer bevorzugt und ersetzt jeden offenen
Community-Kurations- oder Automatisierungs-Pull-Request für dasselbe kanonische Plugin,
unabhängig davon, welcher zuerst eröffnet wurde oder weiter fortgeschritten ist. Der Pull
Request des Erstellers wird zum Review-Vehikel; sein Branch wird nie überschrieben,
force-gepusht oder in den kuratierten Pull Request übertragen. Wurde ein kuratierter Eintrag
bereits gemergt, bleibt die Historie unangetastet, und der Ersteller kann ihn in einem neuen
Beitrag beanspruchen oder korrigieren.

## Öffentliche Zuschreibung

Jeder Katalogeintrag trägt das öffentliche GitHub-Handle des Erstellers, das
Original-Repository, die Repository-Node-ID, den Plugin-Unterpfad und den vollständigen
fixierten Commit. Das öffentliche Ersteller-Profil wird aus dem einzelnen Handle abgeleitet,
statt als zweite Identität gespeichert zu werden. Das separate Maintainer-Provenienz-Gate löst
die Node-ID auf und lehnt eine Abweichung der Repository-URL ab. Pull-Request-Beschreibungen
sollten `Created by @handle` angeben und die Metadaten von Quell-Repository und Quell-Commit
enthalten.

Eine Person, die in einer Discussion postet oder kommentiert, wird nicht automatisch als
Ersteller behandelt. Das Eigentum muss durch den Repository-Eigentümer oder die Organisation,
die Paket-Urheberschaft, Manifest-Metadaten oder die exakte fixierte Quellhistorie gestützt
werden.

## Git-Identität

<!-- creator-first:source-bound-git-identity -->

Commit-Autorschaft und Pull-Request-Autorschaft sind getrennt. Ein vom Ersteller stammender
Pull Request behält den Ersteller als Pull-Request-Autor, und dessen Commits bewahren die
Autorschaft auf natürliche Weise. Ein Maintainer- oder Automatisierungskonto kann als Committer
oder als verifizierter Co-Autor erscheinen, darf aber nicht die Autorschaft des Erstellers
ersetzen.

Verwende bei einem kuratierten Commit den Ersteller als Git-Autor oder füge einen
`Co-authored-by`-Trailer nur hinzu, wenn die exakte Identität quellgebunden und öffentlich
überprüfbar ist, etwa eine Identität, die bereits mit dem Commit des Erstellers im
Original-Repository verknüpft ist. Errate niemals eine E-Mail-Adresse, erfinde keine
Noreply-Adresse und verwende keine private Adresse, die außerhalb einer autorisierten
öffentlichen Quelle gefunden wurde.

Ist keine verifizierte Git-Identität verfügbar, autorisiert der Kurator oder das
Automatisierungskonto den Commit selbst und gibt stattdessen explizite, sichtbare
Namensnennung: `Created by @handle`, das passende öffentliche Profil und einen Link zum
Original-Repository im Eintrag und im Pull Request. Sichtbare YAML-Zuschreibung ist immer
erforderlich, unabhängig von der Git-Identitätszuordnung. Ein späterer direkter Pull Request
des Erstellers ersetzt einen offenen kuratierten Pull Request, statt dessen synthetische
Historie zu übernehmen.

## Respektvolle Erwähnung des Erstellers

Ein kuratierter Pull Request verwendet eine einzige respektvolle öffentliche
`@ersteller`-Erwähnung in seiner Beschreibung, neben dem Link zum Original-Repository. Er kann
zu einer Überprüfung oder einem ersetzenden direkten Pull Request einladen. Wiederhole die
Erwähnung nicht, eröffne keine Werbe-Issues, poste nicht cross-plattform und sende keine
unerwünschten Direktnachrichten.

## Katalog-Lizenz versus Upstream-Lizenz

Katalogfakten und redaktionelle YAML-Metadaten sind unter CC0-1.0 freigegeben. Diese Freigabe
ändert nicht die Lizenz des Upstream-Plugins. Upstream-Code, Dokumentation, Screenshots, Logos
und anderes kreatives Material unterliegen weiterhin ihren ursprünglichen Lizenzen und
Eigentümern.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
