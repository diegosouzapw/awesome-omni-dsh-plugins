# Skaparkredit och pull request-företräde

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Katalogen finns för att göra oberoende DSH-arbete upptäckbart utan att ta ägandeskapet från
skaparna. Offentliga poster hänvisar till det ursprungliga repositoryt och en oföränderlig
källcommit.

## Företräde för samma plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. En pull request som öppnas av pluginskaparen eller den ägande organisationen.
2. En community-pull-request som uttryckligen godkänts av skaparen eller som skaparen är
   medförfattare till.
3. En befintlig giltig community-pull-request.
4. En katalogautomatiserings-pull-request.
5. En privat kandidat utan offentlig pull request.

En direkt pull request från skaparen föredras alltid och ersätter varje öppen
community-kuraterings- eller automatiserings-pull-request för samma kanoniska plugin, oavsett
vilken som öppnades först eller är längre kommen. Skaparens pull request blir
granskningsfordonet; deras branch skrivs aldrig över, force-pushas aldrig och flyttas aldrig in i
den kuraterade pull requesten. Om en kuraterad post redan har slagits samman förblir historiken
intakt och skaparen kan göra anspråk på den eller korrigera den i ett nytt bidrag.

## Offentlig attribution

Varje katalogpost bär skaparens offentliga GitHub-handle, ursprungliga repository,
repository-node-ID, pluginunderstig och fullständiga fastnålade commit. Den offentliga
skaparprofilen härleds från det enda handlet i stället för att lagras som en andra identitet. Den
separata underhållarproveniensgrinden löser node-ID:t och avvisar en repository-URL som inte
matchar. Pull request-beskrivningar bör ange `Created by @handle` och
inkludera metadata om källrepository och källcommit.

En person som publicerar eller kommenterar i en Discussion behandlas inte automatiskt som
skaparen. Ägandeskap måste stödjas av repository-ägaren eller -organisationen, paketskaparskap,
manifestmetadata eller den exakta fastnålade källhistoriken.

## Git-identitet

<!-- creator-first:source-bound-git-identity -->

Commit-författarskap och pull request-författarskap är åtskilda. En pull request med skaparen som
ursprung behåller skaparen som pull request-författare, och deras commits bevarar naturligt
författarskapet. En underhållar- eller automatiseringskonto får framträda som committer eller som
verifierad medförfattare, men får inte ersätta skaparens författarskap.

För en kuraterad commit ska du använda skaparen som Git-författare eller lägga till en
`Co-authored-by`-trailer endast när den exakta identiteten är källbunden och offentligt
verifierbar, såsom en identitet som redan är kopplad till skaparens commit i det ursprungliga
repositoryt. Gissa aldrig en e-postadress, tillverka aldrig en noreply-adress och använd aldrig en
privat adress som hittats utanför en auktoriserad offentlig källa.

När en verifierad Git-identitet inte är tillgänglig författar kuratorn eller
automatiseringskontot commiten och ger i stället uttrycklig synlig kredit: `Created by @handle`,
motsvarande offentliga profil och en länk till det ursprungliga repositoryt i posten och pull
requesten. Synlig YAML-attribution krävs alltid oberoende av Git-identitetsmappningen. En senare
direkt pull request från skaparen ersätter en öppen kuraterad pull request i stället för att ärva
dess syntetiska historik.

## Respektfull skaparomnämnande

En kuraterad pull request använder ett respektfullt offentligt `@creator`-omnämnande i sin
beskrivning bredvid länken till det ursprungliga repositoryt. Den får bjuda in till granskning
eller till en ersättande direkt pull request. Upprepa inte omnämnandet, öppna inte
kampanjartade issues, korspublicera inte och skicka inte oönskade direktmeddelanden.

## Kataloglicens kontra upstream-licens

Katalogfakta och redaktionell YAML-metadata är tillgängliggjorda under CC0-1.0. Detta
tillgängliggörande ändrar inte upstream-pluginets licens. Upstream-kod, dokumentation,
skärmdumpar, logotyper och annat kreativt material fortsätter omfattas av sina ursprungliga
licenser och ägare.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
