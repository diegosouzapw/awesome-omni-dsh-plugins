# Rankningsmetodik

> 🌐 [English](../../docs/RANKING.md) · **Svenska**

> **Inofficiellt community-projekt. Inte anknutet till, godkänt av eller sponsrat av DeepSeek.**
> DeepSeek-namn och -märken tillhör respektive ägare.

Rankningar är transparenta vyer över sammanslagna offentliga katalogposter. De använder aldrig en
dold kombinerad poäng och behandlar aldrig stjärnor från ett brett överordnat projekt som
pluginpopularitet.

## Top Plugins by Stars-predikatet

En post kvalificerar sig endast när varje villkor nedan är sant:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kvalificerande poster använder `popularity.starsPolicy: exact-repository` och ett icke-negativt
heltal i `popularity.stars`. Lika resultat använder plugin-ID:t utan skiftlägeskänslighet som en
deterministisk visningsordning; särskiljningen vid lika resultat innebär inte någon
kvalitetsskillnad.

`kind` är den enda artefakttypsärskiljaren. Schemat lagrar avsiktligt inte en andra
DSH-integrationstyp som skulle kunna motsäga den.

## Uttryckliga uteslutningar

En plugin inuti ett bredare monorepo förblir katalogbehörig, men dess överordnade stjärnor är
odefinierade för pluginrankning. Den måste använda `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` och `popularity.stars: null`. Den visas i
funktionella sektioner och utesluts från varje stjärnbaserad rankning.

Pluginfamiljer, teman, skins, skills, presets, klienter, gränssnitt, bryggor och bredare
ekosystemprojekt visas inte i Top Plugins by Stars. De får separata sektioner där jämförbar data
finns. Aggregatorer, marknadsplatser, installationskataloger och listor är inte katalogposter och
får ingen katalogsektion.

## Rankningsvyer

Projektet kan publicera distinkta vyer för stjärnor, 24-timmars tillväxt, 7-dagars tillväxt,
senaste uppdateringar, verifierade installationer, pluginfamiljer, teman och skins, klienter och
gränssnitt samt ekosystemintegrationer. Varje vy måste redovisa sin egen inkluderingsregel och
ögonblicksbildens tidpunkt.

Vid noll behöriga poster renderas inte Top Plugins. Den första behöriga sammanslagningen skapar en
Top Plugins-vy; etiketten ändras till Top 10 först när tio kvalificerande poster finns. Ingen
platshållare eller påhittad rankning är tillåten.

## Verifiering är inte ett godkännande

`eligible` betyder att den offentliga strukturen och DSH-integrationen validerades. `verified`
betyder dessutom att ett installations-rök-test godkändes för den fastnålade källan eller paketet.
Ingen av statusarna är ett godkännande, en garanti eller en absolut säkerhetscertifiering.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
