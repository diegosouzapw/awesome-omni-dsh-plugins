# Mwongozo wa Kuchangia

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Kiswahili**

> **Mradi usio rasmi wa jamii. Hauhusiani na, haujaidhinishwa na, wala haujafadhiliwa na DeepSeek.**
> Majina na alama za DeepSeek ni mali ya wamiliki wao husika.

Asante kwa kuboresha katalogi. Michango inatanguliza waumbaji: tumia ushahidi wa hazina asili,
hifadhi utambuzi na weka kila programu-jalizi iweze kukaguliwa kwa uhuru. Katalogi huanza tupu kwa
makusudi; hakuna kiingilio kinachokubaliwa bila pull request yake mwenyewe iliyokaguliwa.

## Anza na muumba

Pull request iliyofunguliwa moja kwa moja na muumba wa programu-jalizi au shirika linalomiliki daima
inapendelewa. Ikiwa muumba yuko tayari kuchangia, tumia tawi lake na pull request yake badala ya
kuunda upya kazi yake katika tawi la mkusanya au la otomatiki.

Ukusanyaji wa jamii unakaribishwa unapomsaidia muumba ambaye hajafungua pull request. Haujengi
umiliki wala kipaumbele juu ya mchango wa moja kwa moja wa muumba unaokuja baadaye.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Programu-jalizi moja kwa kila tawi na pull request

Unda tawi maalum kwa programu-jalizi moja na fungua pull request moja kutoka tawi hilo. Tawi na pull
request lazima viunde au kubadilishe faili moja tu la YAML chini ya `catalog/plugins/`. Usichanganye
programu-jalizi, usafishaji wa nyaraka, faharasa zilizozalishwa au matengenezo yasiyohusiana katika
tawi au pull request hiyo.

ID ya kiingilio na jina la faili lazima viwe thamani moja ya herufi ndogo za kebab-case. Wasimamizi
hukagua na kuunganisha kila pull request ya programu-jalizi mmoja mmoja; kundi lenye programu-jalizi
nyingi haligawanywi wala kuunganishwa kwa sehemu.

## Tatua chanzo asili

Kila sehemu ya umma lazima ijengwe upya kutoka hazina asili ya muumba, kifurushi, manifest, README,
leseni au toleo kwenye commit iliyobandikwa. Usinakili maandishi, mpangilio wa jamii, picha za skrini,
upangaji, beji au metadata iliyozalishwa ya katalogi nyingine au mkusanyaji. Kiungo kinachopatikana
katika mradi mwavuli, soko, orodha au mkusanyaji ni dokezo tu, si ushahidi wala chanzo cha
programu-jalizi.

Kamwe usiwasilishe mradi mwavuli, mkusanyaji, soko, katalogi ya visakinishi au orodha kama kiingilio
cha katalogi, hata ikiwa inaweza kusakinishwa kwa uhuru. Itumie tu kama dokezo na kutatua kila
programu-jalizi ndogo inayoweza kusakinishwa kwa uhuru hadi kwa muumba wake halisi na hazina asili.
Programu-jalizi iliyo katika monorepo halisi ya muumba inaweza kuwasilishwa kutoka subpath yake halisi,
lakini lazima ifuate sera ya nyota za monorepo iliyo hapa chini.

## Ushahidi unaohitajika

Toa yote yafuatayo katika pull request:

- URL rasmi ya umma ya hazina asili na ID yake ya node ya hazina isiyobadilika. Wasimamizi hutatua ID
  ya node na kukataa kutolingana kwa URL katika lango tofauti la uthibitishaji wa asili.
- Handle ya umma ya GitHub ya muumba na URL ya umma ya wasifu inayolingana. YAML huhifadhi handle
  mara moja; URL ya wasifu hutokana kama `https://github.com/<handle>`.
- OID kamili ya commit ya chanzo ya herufi 40 na subpath halisi ya programu-jalizi, au `null` kwa
  programu-jalizi iliyo kwenye mizizi ya hazina.
- Maelezo ya Kiingereza yenye ukomo fulani na njia yake ya ushahidi kwenye commit hiyo iliyobandikwa.
- `kind` ya zao, jamii kuu na lebo zilizochaguliwa kutoka [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Usemi kamili wa leseni ya SPDX ya upstream ulio na ushahidi kwenye commit iliyobandikwa.
- Kielezi rasmi cha usakinishaji kilichobandikwa kwenye toleo halisi la npm, au kwenye hazina ya chanzo,
  commit kamili na subpath. Kielezi ni data, kamwe si amri ya shell.
- Ushahidi wa muunganisho asilia wa DSH na njia yake kwenye commit iliyobandikwa.
- Ushahidi uliopo, usio nyeti wa moshi kwa pin halisi ya zao hilo, au thamani ya wazi `not run`.
  Usisakinishe programu-jalizi wala kutekeleza `preinstall`, `install`, `postinstall`, `prepare` au
  msimbo mwingine wa mzunguko wa maisha wa kifurushi/plugin ili kuandaa mchango wa katalogi pekee.
- Kwa hazina maalum, idadi ya nyota inayoweza kuthibitishwa kwa hazina hiyo halisi, pamoja na chanzo
  cha umma na muda wa ukaguzi. Kwa programu-jalizi ya monorepo, tumia sera ya null inayohitajika hapa chini.
- Asili ya Discussion au maoni ya umma ikiwepo; vinginevyo tumia `null`.
- Thamani ya `unofficial: true` inayosomeka na mashine.

Ikiwa hakuna jaribio la moshi linalostahili lililopo tayari, tumia `verification.status: eligible` na
`verification.smokeTest: null`. Tumia `verified` tu wakati ushahidi wa moshi unaoweza kukaguliwa kwa
pin halisi upo. Hali yoyote si idhini wala cheti cha usalama.

Kamwe usiwasilishe vitambulisho, vidakuzi, barua pepe za kibinafsi, msimbo usiochapishwa au siri nyingine.

## Kanuni za YAML na schema

Unda `catalog/plugins/<plugin-id>.yaml` na uithibitishe dhidi ya
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` lazima ilingane na basename ya
faili na lazima ianze na namespace yako: handle yako ya `creator.github` kwa herufi ndogo (mtiririko
wowote wa herufi nje ya `[a-z0-9]` unakuwa `-` moja) ikifuatiwa na `-`, kwa mfano
`some-creator-my-plugin` kwa handle `Some-Creator`. Uthibitishaji wa katalogi hutekeleza yote mawili.
Schema ndiyo chanzo cha ukweli kwa majina ya sehemu na thamani zinazoruhusiwa;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) inafafanua jinsi ya kuchagua aina moja ya zao, jamii kuu,
lebo na wigo wa hazina.

Kielezi cha npm lazima kiwe na jina halali la kifurushi na toleo halisi. Schema ya umma hukataa thamani
zinazofanana na chaguo na zisizo na ukomo lakini haitekelezi upya SemVer au SRI: uthibitishaji wa
katalogi lazima uchambue toleo, uhitaji SemVer halisi na uchambue thamani yoyote ya integrity kama SRI
halali ya SHA-512. Kielezi cha chanzo kimefungwa kwa `source.repository`, `source.commit` na
`source.subpath` bila kurudia thamani za chanzo zinazobadilika.

Visakinishi lazima vitumie safu za hoja, vizime utekelezaji wa shell na kuweka kikomo cha chaguo kabla
ya thamani za nafasi zinazotolewa na katalogi pale amri inayoitiwa inapoitumia. Uthibitishaji wa
uwasilishaji lazima usiite kisakinishi au mzunguko wa maisha wa programu-jalizi.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` ni ukaguzi wa kimuundo na kisemantiki wa kienyeji na wa kusoma tu. Huchambua YAML
salama, huthibitisha schema ya umma, huchambua usemi wa SPDX, huhitaji SemVer halisi na SRI halali ya
SHA-512, na hukataa ID zilirudishwa na funguo rasmi za repository-node-plus-subpath zilizorudishwa.
Haiwasiliani na GitHub, haitatui utambulisho wa hazina wala kukagua njia za ushahidi kwenye commit
iliyobandikwa.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Kabla kiingilio hakijafikia `eligible`, wasimamizi kwa kando hutatua hazina rasmi na ID ya node,
kumfunga muumba kwenye chanzo asili, na kukagua maelezo, leseni, muunganisho wa DSH na ushahidi wa
moshi uliotangazwa kwenye `source.commit`. Matokeo ya kijani ya uthibitishaji wa kienyeji si uthibitisho
wa asili wala chimbuko.

## Nyota za hazina

Ni nyota zinazothibitika kuwa za hazina hiyo halisi maalum ya programu-jalizi pekee ndizo zinazoweza
kurekodiwa. Nyota za mradi mzazi lazima kamwe zisihusishwe na programu-jalizi iliyohifadhiwa ndani ya
monorepo pana zaidi. Kiingilio cha monorepo bado kinastahili sehemu za kazi za katalogi lakini lazima
kitangaze:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Kiingilio maalum hutumia `repositoryScope: dedicated`, `starsPolicy: exact-repository` na idadi ya
nyota isiyokuwa hasi iliyoonekana kwenye hazina hiyo hiyo. Soma [docs/RANKING.md](../../docs/RANKING.md)
kabla ya kuwasilisha data ya umaarufu.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Kipaumbele cha muumba na mawasiliano ya heshima

Kwa programu-jalizi moja rasmi, kipaumbele ni:

1. Pull request iliyofunguliwa na muumba au shirika linalomiliki.
2. Pull request ya jamii iliyoidhinishwa wazi na muumba.
3. Pull request halali ya ukusanyaji wa jamii iliyopo.
4. Pull request ya otomatiki ya katalogi.

Pull request ya moja kwa moja ya muumba inachukua nafasi ya pull request yoyote wazi ya ukusanyaji au
otomatiki, bila kujali ipi iliyofunguliwa kwanza au ipi iliyo mbali zaidi. Pull request ya muumba
inakuwa chombo cha ukaguzi; wasimamizi hawafanyi force-push kwenye tawi la muumba wala kuhamisha kazi
yake kwenda kwenye pull request ya ukusanyaji. Ikiwa kiingilio cha ukusanyaji tayari kimeunganishwa,
historia ya umma haiandikwi upya. Muumba anaweza kutumia dai au ombi la marekebisho na kisha kuchangia
pull request ya ufuatiliaji moja kwa moja.

Pull request ya ukusanyaji inapaswa kutumia mtajo mmoja wa heshima wa umma wa `@creator` katika
maelezo yake, kando ya kiungo cha hazina asili, ikimwalika muumba kukagua au kuibadilisha kwa pull
request ya moja kwa moja. Usirudie mtajo, usifungue masuala ya matangazo, usichapishe mtandaoni kwa
sehemu nyingine, usitume ujumbe wa moja kwa moja usioombwa au kumsumbua muumba kwa njia nyingine yoyote.

<!-- creator-first:source-bound-git-identity -->

Pull request na commits zilizoandikwa na muumba huhifadhi sifa za muumba kwa asili. Commits za
ukusanyaji zinaweza kutumia uandishi wa Git wa muumba au trailer ya `Co-authored-by` tu ikiwa utambulisho
umefungwa kwa chanzo na unaweza kuthibitishwa hadharani. Kamwe usivundue wala kukisia barua pepe.
Wakati hakuna utambulisho wa Git uliothibitishwa, mkusanya ndiye huandika commit na kutoa sifa za wazi
za `Created by @handle` pamoja na kiungo cha hazina asili katika YAML na pull request. Akaunti ya
msimamizi au otomatiki inaweza kuwa committer au co-author iliyothibitishwa, lakini lazima isichukue
nafasi ya uandishi wa muumba. Angalia [docs/CREDIT.md](../../docs/CREDIT.md) kwa sera kamili.

## Amri za uthibitishaji na upatikanaji

CLI ya npm imechapishwa kama `omni-dsh-plugins@1.0.1`, kwa hivyo amri zilizo hapa chini zinapatikana
kupitia `npx` leo. Zitumie kama zilivyoandikwa; wachangiaji wasivunde amri mbadala.

Endesha amri hizi kutoka kwenye mizizi ya hazina:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` hufanya tu ukaguzi wa kienyeji wa YAML, schema, SPDX, SemVer halisi, SRI ya SHA-512
na ukaguzi wa marudio ulioelezwa hapo juu, na hukubali katalogi tupu ya makusudi. Haithibitishi utambulisho wa
hazina ya mbali wala ushahidi wa chanzo kilichobandikwa. Amri nyingine hukagua nyaraka za umma
zinazohitajika na fomu za masuala ya GitHub zilizopangwa. Kupita kwa amri hizi kienyeji hakulegezi
mahitaji ya ushahidi; wasimamizi bado hutumia kila lango husika la toleo kabla ya kuunganisha.

## Malango ya ukaguzi, migongano na kuunganisha

Wasimamizi hutumia kila lango kwenye commit ya sasa ya pull request kabla ya kuunganisha:

1. **Wigo:** tawi moja maalum, faili moja la YAML la programu-jalizi na hakuna mabadiliko yasiyohusiana.
2. **Utambulisho asili:** muumba, hazina rasmi, ID ya node, commit kamili na subpath zinalingana.
3. **Schema na ushahidi:** YAML, jamii, SPDX, pin ya usakinishaji, ushahidi wa DSH na hali ya moshi
   zinaendana ndani bila kutekeleza msimbo wa mzunguko wa maisha wa programu-jalizi.
4. **Umaarufu:** nyota maalum zinaweza kuthibitishwa kwenye hazina halisi, au nyota za monorepo ni
   `null` ikiwa na `undefined-parent-repository`.
5. **Nyaraka na fomu:** nyaraka za umma, fences za Markdown na fomu zilizopangwa zinabaki halali.
6. **Mgongano na uondoaji wa marudio:** hakuna kiingilio kilichounganishwa au pull request wazi
   inayowakilisha programu-jalizi moja rasmi hiyo hiyo.

Majina au ID tofauti hazifanyi programu-jalizi rudufu kuwa tofauti. Chukulia ID moja ya node ya
hazina na subpath, kifurushi kimoja rasmi, au lengo jingine la usakinishaji linalothibitika kuwa sawa
kama mgongano. Tatua majina mbadala na pull request zinazoshindana kabla ya kuunganisha. Pull request ya
moja kwa moja ya muumba hushinda mgongano na ukusanyaji au otomatiki; vinginevyo wasimamizi huchagua
chombo kimoja cha ukaguzi na kufunga au kuelekeza upya marudio badala ya kuunganisha zote mbili.

Ni msimamizi pekee anayemuunganisha programu-jalizi baada ya malango yote kupita. Kila programu-jalizi
iliyokubaliwa huunganishwa mmoja mmoja; uthibitishaji, ukusanyaji au otomatiki haimaanishi kuunganishwa
kiotomatiki au kwa makundi.

## Orodha ya ukaguzi ya pull request

- [ ] Nilitumia tawi moja maalum na PR hii inabadilisha kiingilio kimoja tu cha programu-jalizi.
- [ ] Chanzo ni hazina asili ya muumba, si mwavuli au mkusanyaji.
- [ ] Handle/wasifu wa muumba, hazina, ID ya node, subpath na commit kamili vina ushahidi.
- [ ] Aina, jamii na lebo zinafuata `docs/CATEGORIES.md`.
- [ ] Leseni ya SPDX na kielezi cha usakinishaji kilichobandikwa vina ushahidi.
- [ ] Muunganisho asilia wa DSH na matokeo ya moshi au hali ya `not run` vina ushahidi.
- [ ] Sikutekeleza msimbo wa mzunguko wa maisha wa programu-jalizi au kifurushi kuandaa mchango huu.
- [ ] Nyota maalum zinaweza kuthibitishwa, au nyota za monorepo zinatumia sera ya null inayohitajika.
- [ ] Nimekagua kiingilio kilichopo na pull request wazi kwa programu-jalizi moja rasmi hiyo hiyo.
- [ ] Kiingilio ni isiyo rasmi wazi na hakina siri au data ya kibinafsi ya faragha.

## Sera ya lugha

Nyaraka za uzinduzi na maelezo ya katalogi ni ya Kiingereza pekee. Upanuzi wa lugha 43 bado ni kipengele
cha backlog baada ya MVP; usiongeze nyaraka tupu za lugha au tafsiri za kiotomatiki za wingi.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
