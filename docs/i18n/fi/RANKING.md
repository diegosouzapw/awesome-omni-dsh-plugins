# Järjestysmetodologia

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei liity DeepSeekiin eikä DeepSeek ole hyväksynyt tai sponsoroinut sitä.**
> DeepSeekin nimet ja tunnukset kuuluvat niiden omistajalle.

Järjestykset ovat läpinäkyviä näkymiä yhdistettyihin julkisiin katalogimerkintöihin. Ne eivät
koskaan käytä piilotettua yhdistettyä pistemäärää eivätkä koskaan käsittele laajan emoprojektin
tähtiä liitännäisen suosiona.

## Top Plugins by Stars -ehto

Merkintä kelpuutetaan vain, kun jokainen alla oleva ehto on tosi:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Kelpuutetut merkinnät käyttävät arvoa `popularity.starsPolicy: exact-repository` ja
ei-negatiivista kokonaislukua kentässä `popularity.stars`. Tasapelit käyttävät kirjainkoosta
riippumatonta liitännäisen ID:tä määräävänä näyttöjärjestyksenä; tasapelin ratkaisu ei merkitse
laatueroa.

`kind` on ainoa artefaktityypin erottelija. Skeema ei tarkoituksella tallenna toista
DSH-integraation kindiä, joka voisi olla sen kanssa ristiriidassa.

## Nimenomaiset poissulkemiset

Laajemman monorepon sisällä oleva liitännäinen pysyy katalogikelpoisena, mutta sen emotähdet ovat
määrittelemättömät liitännäisjärjestystä varten. Sen on käytettävä arvoja
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository` ja
`popularity.stars: null`. Se näkyy toiminnallisissa osioissa, ja se suljetaan pois kaikista
tähtipohjaisista järjestyksistä.

Liitännäisperheet, teemat, skinit, taidot, presetit, asiakasohjelmat, käyttöliittymät, sillat ja
laajemmat ekosysteemiprojektit eivät näy Top Plugins by Stars -listalla. Ne saavat erilliset
osiot, kun vertailukelpoista dataa on olemassa. Kokoajat, markkinapaikat, asennuskatalogit ja
listat eivät ole katalogimerkintöjä eivätkä saa katalogiosiota.

## Järjestysnäkymät

Projekti voi julkaista erilliset näkymät tähdille, 24 tunnin kasvulle, 7 päivän kasvulle,
tuoreille päivityksille, varmennetuille asennuksille, liitännäisperheille, teemoille ja skineille,
asiakasohjelmille ja käyttöliittymille sekä ekosysteemintegraatioille. Jokaisen näkymän on
kerrottava oma sisällytyssääntönsä ja tilannevedoksen aikaleima.

Kun kelvollisia merkintöjä on nolla, Top Pluginsia ei renderöidä. Ensimmäinen kelvollinen
yhdistäminen luo Top Plugins -näkymän; nimike muuttuu Top 10:ksi vasta, kun kelpuutettuja
merkintöjä on kymmenen. Paikkamerkit tai keksityt järjestykset eivät ole sallittuja.

## Varmennus ei ole suositus

`eligible` tarkoittaa, että julkinen rakenne ja DSH-integraatio validoitiin. `verified` tarkoittaa
lisäksi, että asennuksen smoke-testi läpäistiin kiinnitetylle lähteelle tai paketille. Kumpikaan
tila ei ole suositus, takuu eikä absoluuttinen tietoturvasertifikaatti.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
