# Credit voor de maker en voorrang van pull requests

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Nederlands**

De catalogus bestaat om onafhankelijk DSH-werk vindbaar te maken zonder het eigendom ervan bij
de makers weg te nemen. Publieke invoeren citeren het oorspronkelijke repository en een
onveranderlijke broncommit.

## Voorrang voor dezelfde plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Een pull request geopend door de maker van de plugin of de eigenaarsorganisatie.
2. Een community-pull-request expliciet goedgekeurd of mede-geschreven door de maker.
3. Een bestaande geldige community-pull-request.
4. Een catalogusautomatisering-pull-request.
5. Een privékandidaat zonder publieke pull request.

Een directe pull request van de maker heeft altijd de voorkeur en heeft voorrang op elke
openstaande community-curatie- of automatiseringspull-request voor dezelfde canonieke plugin,
ongeacht wie eerder werd geopend of verder gevorderd is. De pull request van de maker wordt het
beoordelingsvoertuig; diens branch wordt nooit overschreven, geforceerd gepusht of verplaatst
naar de gecureerde pull request. Als een gecureerde invoer al is gemerged, blijft de
geschiedenis intact en kan de maker deze claimen of corrigeren in een nieuwe bijdrage.

## Publieke attributie

Elke catalogusinvoer draagt de publieke GitHub-handle van de maker, het oorspronkelijke
repository, het repository-node-ID, het pluginsubpad en de volledige vastgepinde commit. Het
publieke profiel van de maker wordt afgeleid van de enkele handle in plaats van als tweede
identiteit te worden opgeslagen. De aparte herkomstcontrole van beheerders herleidt het node-ID
en wijst een mismatch van de repository-URL af. Pull-request-beschrijvingen moeten
`Created by @handle` vermelden en de metadata van bronrepository en broncommit bevatten.

Iemand die reageert of een reactie plaatst op een Discussion wordt niet automatisch behandeld
als de maker. Eigenaarschap moet worden onderbouwd door de repository-eigenaar of -organisatie,
packageauteurschap, manifestmetadata of exacte vastgepinde bron­geschiedenis.

## Git-identiteit

<!-- creator-first:source-bound-git-identity -->

Commit-auteurschap en pull-request-auteurschap zijn gescheiden. Een pull request die van de
maker afkomstig is, houdt de maker als pull-request-auteur, en diens commits behouden het
auteurschap vanzelf. Een beheerders- of automatiseringsaccount mag verschijnen als committer of
als geverifieerde mede-auteur, maar mag het auteurschap van de maker niet vervangen.

Gebruik voor een gecureerde commit de maker als Git-auteur of voeg een
`Co-authored-by`-trailer alleen toe wanneer de exacte identiteit bronsgebonden en publiek
verifieerbaar is, zoals een identiteit die al is gekoppeld aan de commit van de maker in het
oorspronkelijke repository. Raad nooit een e-mailadres, verzin geen noreply-adres en gebruik
geen privéadres dat buiten een geautoriseerde publieke bron is gevonden.

Wanneer geen geverifieerde Git-identiteit beschikbaar is, is de curator of het
automatiseringsaccount de auteur van de commit en geeft in plaats daarvan expliciete zichtbare
credit: `Created by @handle`, het bijbehorende publieke profiel en een link naar het
oorspronkelijke repository in de invoer en de pull request. Zichtbare YAML-attributie is altijd
verplicht, onafhankelijk van de Git-identiteitskoppeling. Een latere directe pull request van de
maker vervangt een openstaande gecureerde pull request in plaats van diens synthetische
geschiedenis over te nemen.

## Respectvolle vermelding van de maker

Een gecureerde pull request gebruikt één respectvolle publieke `@creator`-vermelding in de
beschrijving, naast de link naar het oorspronkelijke repository. Deze mag uitnodigen tot
beoordeling of een vervangende directe pull request. Herhaal de vermelding niet, open geen
promotionele issues, cross-post niet en stuur geen ongevraagde directe berichten.

## Catalogus­licentie versus upstream-licentie

Catalogusfeiten en redactionele YAML-metadata zijn vrijgegeven onder CC0-1.0. Die vrijgave
verandert niets aan de licentie van de upstream-plugin. Upstream-code, documentatie,
screenshots, logo's en ander creatief materiaal blijven onderworpen aan hun oorspronkelijke
licenties en eigenaars.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
