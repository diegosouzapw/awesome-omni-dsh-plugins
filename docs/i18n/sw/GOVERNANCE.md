# Utawala wa Katalogi

> **Mradi usio rasmi wa jamii. Hauhusiani na, haujaidhinishwa na, wala haujafadhiliwa na DeepSeek.**
> Majina na alama za DeepSeek ni mali ya wamiliki wao husika.

Jinsi katalogi ya umma inavyotawaliwa: nani anayeamua kinachoingia, kwa mpangilio gani michango
inayoshindana inaheshimiwa, ukaguzi gani unaendeshwa kiotomatiki, na maamuzi gani yanabaki ya kibinadamu.
Sera zinazorejelewa hapa ziko katika [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md) na [docs/RANKING.md](../../docs/RANKING.md); ukurasa huu
unaelezea jinsi zinavyofungamana.

## Kanuni

1. **Muumba kwanza.** Katalogi ipo ili kazi za waumbaji zigundulike, kamwe si kuchukua umiliki wake.
   Kwa programu-jalizi moja rasmi, pull request ya moja kwa moja ya muumba inachukua nafasi ya pull
   request yoyote wazi ya ukusanyaji wa jamii au otomatiki — mpangilio kamili wa kipaumbele na kanuni
   za utambulisho wa Git ziko katika [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Programu-jalizi moja, pull request moja iliyokaguliwa.** Hakuna kuunganisha kwa makundi, hakuna
   uagizaji wingi uliozalishwa kwenda kwenye katalogi ya umma. Kila kiingilio hupata ukaguzi wake mwenyewe.
3. **Ushahidi juu ya imani.** Kila sehemu ya umma hufuatilia hadi hazina asili ya muumba kwenye commit
   iliyobandikwa. Ukaguzi wa kijani wa kiotomatiki kamwe haukubaliwi kama uthibitisho wa chimbuko.
4. **Isiyo rasmi, daima.** Hakuna hali ya katalogi inayowasilishwa kama ukaguzi, uthibitisho au idhini
   ya DeepSeek.

## Jinsi mabadiliko yanavyofika kwenye `main`

Mabadiliko yote hufika kwenye `main` kupitia pull request zilizokaguliwa — hakuna kusukuma kwa moja
kwa moja. Sera ya kazi kwa tawi chaguomsingi:

- **Pull request pekee.** Viingilio vya katalogi, nyaraka na mabadiliko ya schema vyote huingia kupitia
  PR; PR za katalogi lazima zifuate kanuni ya programu-jalizi-moja-kwa-tawi iliyo katika
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Historia ya mstari.** PR huunganishwa ili `main` ihifadhi historia ya mstari inayoweza kukaguliwa;
  historia ya umma iliyounganishwa haiandikwi upya. Ikiwa kiingilio cha ukusanyaji kiliunganishwa kabla
  muumba hajajitokeza, muumba hukidai au kukirekebisha katika mchango wa ufuatiliaji badala ya kuandika
  upya historia.
- **Utatuzi wa mazungumzo ya ukaguzi.** Mazungumzo ya ukaguzi hutatuliwa kabla ya kuunganisha; maoni
  ambayo hayajatatuliwa huzuia muunganisho.
- **Kuunganisha kwa msimamizi.** Ni msimamizi pekee anayemuunganisha kiingilio cha programu-jalizi, na
  tu baada ya kila lango lililo katika [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Malango ya ukaguzi,
  migongano na kuunganisha" kupita kwenye commit ya sasa ya PR.

## Ukaguzi wa `catalog-validation`

Kila pull request inayogusa `catalog/plugins/`, `schemas/` au mtiririko wa kazi wenyewe huendesha kazi
ya `catalog-validation` (`.github/workflows/validate-catalog.yml`), iliyobandikwa kwenye CLI
iliyochapishwa:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Inachothibitisha** — muundo na semantiki za kienyeji pekee:

- Uchambuzi salama wa YAML wa kila kiingilio chini ya `catalog/plugins/`.
- Uzingatiaji wa schema ya umma (angalia [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Uchambuzi wa usemi wa SPDX, matoleo halisi ya SemVer, thamani halali za integrity za SRI ya SHA-512.
- Kukataliwa kwa marudio: hakuna ID za viingilio zilizorudiwa wala funguo rasmi za
  repository-node-plus-subpath zilizorudiwa.
- Katalogi tupu ya makusudi hupita (`0 entries valid; catalog is empty`).

**Isichothibitisha** — na kwa hivyo kile ambacho ukaguzi wa kijani kamwe hakushuhudii:

- Utambulisho wa hazina ya mbali: haiwasiliani na GitHub wala kutatua ID ya node ya hazina dhidi ya URL.
- Ushahidi kwenye commit iliyobandikwa: maelezo, leseni, muunganisho wa DSH na ushahidi wa moshi
  haviletwi wala kukaguliwa.
- Umiliki wa muumba, idadi za nyota, au mgongano na pull request wazi.

Maamuzi hayo ni ya malango tofauti ya asili ya wasimamizi, yanayotumika kabla ya kuunganisha na
yaliyoelezwa katika [CONTRIBUTING.md](../../CONTRIBUTING.md). Ukaguzi wa kienyeji ni sakafu, si
kiwango cha juu.

## Hali za uthibitishaji

Uthibitishaji hurekodiwa kwa kila kiingilio dhidi ya commit yake halisi iliyobandikwa, kwa kutumia hali
zilizofafanuliwa katika schema ya umma (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Hali mbili chanya kwa makusudi ni finyu:

- `eligible` — muundo wa umma na muunganisho asilia wa DSH vilithibitishwa.
- `verified` — zaidi ya hayo, jaribio la moshi la usakinishaji lilifaulu kwa chanzo au kifurushi
  kilichobandikwa; schema inahitaji rekodi ya jaribio la moshi kuwepo.

Hakuna hali — wala nyingine yoyote — iliyo idhini, hakikisho au cheti cha usalama. Semantiki kamili,
ikiwa ni pamoja na jinsi hali zinavyoingiliana na upangaji, ziko katika
[docs/RANKING.md](../../docs/RANKING.md); umbo la rekodi liko katika [docs/SCHEMA.md](../../docs/SCHEMA.md).

## Madai, marekebisho na uondoaji

Fomu za masuala ya GitHub zilizopangwa (`.github/ISSUE_TEMPLATE/`) ndiyo njia inayotawaliwa ya
kubadilisha kiingilio ambacho hukuwasilisha:

| Fomu           | Anayeitumia                              | Matokeo                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Dai**      | Muumba ambaye programu-jalizi yake ilikusanywa na mtu mwingine | Umiliki unafungwa kwenye chanzo asili; muumba anaweza kisha kuchangia moja kwa moja |
| **Marekebisho** | Yeyote anayegundua metadata ya umma isiyo sahihi | Marekebisho yaliyokaguliwa kwa kiingilio kilichoathirika             |
| **Uondoaji**    | Muumba anayetaka orodha yake iondolewe, au mripoti wa ukiukaji wa sera | Uondoaji au karantini iliyokaguliwa ya kiingilio |

Kanuni zinazotumika kwa mtiririko wote mitatu:

- Madai ya umiliki lazima yaungwe mkono na ushahidi wa umma unaoweza kuthibitishwa (umiliki wa hazina,
  uandishi wa kifurushi, metadata ya manifest au historia ya chanzo kilichobandikwa) — kuandika maoni
  kwenye Discussion hakuthibitishi uumbaji ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Matatizo ya usalama katika programu-jalizi iliyoorodheshwa huenda kwa mtunza wa programu-jalizi hiyo
  kwanza; upande wa katalogi kisha hushughulikia marekebisho au karantini bila kuchapisha maelezo ya
  unyonyaji ([SECURITY.md](../../SECURITY.md)).
- Kamwe usijumuishe vitambulisho, maelezo ya mawasiliano ya faragha au siri nyingine katika fomu.

## Majukumu

- **Waumbaji** wana umiliki wa programu-jalizi zao na kipaumbele cha orodha zao. Wanaweza kuchangia
  moja kwa moja, kuidhinisha ukusanyaji wa jamii, au kudai/kurekebisha/kuondoa kiingilio kilichopo.
- **Wachangiaji wa jamii** wanaweza kukusanya viingilio kwa waumbaji ambao hawajachangia bado, chini ya
  kanuni za mawasiliano ya heshima na sifa katika [docs/CREDIT.md](../../docs/CREDIT.md). Ukusanyaji
  kamwe haushindi mchango wa moja kwa moja wa muumba unaokuja baadaye.
- **Wasimamizi** hukagua, kutumia malango ya asili, kutatua migongano na kuunganisha. Pia hutunza tovuti
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) na CLI iliyochapishwa kutoka
  kwa chanzo binafsi; data ya umma, schema na sera za hazina hii ndizo nyuso hizo zinazotumia.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
