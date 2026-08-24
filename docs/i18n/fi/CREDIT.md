# Luojan tunnustaminen ja pull requestien etusijajärjestys

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Suomi**

> **Epävirallinen yhteisöprojekti. Ei liity DeepSeekiin eikä DeepSeek ole hyväksynyt tai sponsoroinut sitä.**
> DeepSeekin nimet ja tunnukset kuuluvat niiden omistajalle.

Katalogi on olemassa, jotta itsenäinen DSH-työ olisi löydettävissä ottamatta omistajuutta pois
luojilta. Julkiset merkinnät viittaavat alkuperäiseen repositorioon ja muuttumattomaan
lähdecommittiin.

## Saman liitännäisen etusijajärjestys

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Liitännäisen luojan tai omistavan organisaation avaama pull request.
2. Yhteisön pull request, jonka luoja on nimenomaisesti hyväksynyt tai jonka luoja on
   yhteiskirjoittanut.
3. Olemassa oleva kelvollinen yhteisön pull request.
4. Katalogin automaation pull request.
5. Yksityinen ehdokas, jolla ei ole julkista pull requestia.

Luojan suoraa pull requestia suositaan aina, ja se syrjäyttää minkä tahansa avoimen yhteisön
kuratointi- tai automaatio-pull-requestin saman kanonisen liitännäisen kohdalla riippumatta siitä,
kumpi avattiin ensin tai kumpi on pidemmällä. Luojan pull requestista tulee tarkastuksen väline;
hänen branchiaan ei koskaan kirjoiteta yli, force-pushata tai siirretä kuratoituun pull
requestiin. Jos kuratoitu merkintä on jo yhdistetty, historia säilyy ennallaan ja luoja voi vaatia
sen omakseen tai korjata sen uudessa osallistumisessa.

## Julkinen tunnustaminen

Jokainen katalogimerkintä sisältää luojan julkisen GitHub-tunnuksen, alkuperäisen repositorion,
repositorion solmutunnuksen, liitännäisen alipolun ja täydellisen kiinnitetyn commitin. Julkinen
luojaprofiili johdetaan yhdestä tunnuksesta sen sijaan, että se tallennettaisiin toisena
identiteettinä. Erillinen ylläpitäjän alkuperäportti selvittää solmutunnuksen ja hylkää
repositorion URL-ristiriidan. Pull requestien kuvauksissa tulisi lukea `Created by @handle` ja
niiden tulisi sisältää lähderepositorion ja lähdecommitin metadata.

Henkilöä, joka julkaisee tai kommentoi Discussionissa, ei automaattisesti pidetä luojana.
Omistajuutta on tuettava repositorion omistajan tai organisaation, paketin tekijyyden,
manifestin metadatan tai tarkan kiinnitetyn lähdehistorian perusteella.

## Git-identiteetti

<!-- creator-first:source-bound-git-identity -->

Commitin tekijyys ja pull requestin tekijyys ovat eri asioita. Luojan alkuun panema pull request
pitää luojan pull requestin tekijänä, ja hänen committinsa säilyttävät tekijyyden luonnostaan.
Ylläpitäjä- tai automaatiotili voi näkyä committerina tai todennettuna yhteiskirjoittajana, mutta
se ei saa korvata luojan tekijyyttä.

Kuratoidussa commitissa käytä luojaa Git-tekijänä tai lisää `Co-authored-by`-rivi vain, kun tarkka
identiteetti on lähteeseen sidottu ja julkisesti todennettavissa, kuten identiteetti, joka on jo
liitetty luojan committiin alkuperäisessä repositoriossa. Älä koskaan arvaa sähköpostiosoitetta,
keksi noreply-osoitetta tai käytä yksityistä osoitetta, joka löytyi valtuutetun julkisen lähteen
ulkopuolelta.

Kun todennettua Git-identiteettiä ei ole saatavilla, kuraattori tai automaatiotili kirjoittaa
commitin ja antaa sen sijaan eksplisiittisen näkyvän tunnustuksen: `Created by @handle`, vastaava
julkinen profiili ja linkki alkuperäiseen repositorioon merkinnässä ja pull requestissa. Näkyvä
YAML-tunnustus vaaditaan aina Git-identiteettikartoituksesta riippumatta. Myöhempi luojan suora
pull request korvaa avoimen kuratoidun pull requestin sen sijaan, että se perisi sen synteettisen
historian.

## Kunnioittava luoja-maininta

Kuratoitu pull request käyttää yhtä kunnioittavaa julkista `@creator`-mainintaa kuvauksessaan
alkuperäisen repositorion linkin vieressä. Se saa kutsua tarkastukseen tai korvaavaan suoraan pull
requestiin. Älä toista mainintaa, avaa mainosluontoisia issueita, cross-postaa tai lähetä
pyytämättömiä suoria viestejä.

## Katalogin lisenssi versus upstream-lisenssi

Katalogin faktat ja toimitukselliset YAML-metatiedot on luovutettu CC0-1.0-lisenssillä. Tämä
luovutus ei muuta upstream-liitännäisen lisenssiä. Upstream-koodi, dokumentaatio, kuvakaappaukset, logot ja
muu luova materiaali pysyvät alkuperäisten lisenssiensä ja omistajiensa alaisina.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
