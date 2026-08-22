# Mbinu ya Upangaji

Upangaji ni mandhari za uwazi juu ya viingilio vya katalogi ya umma vilivyounganishwa. Kamwe
hautumii alama mchanganyiko iliyofichwa na kamwe huchukuli nyota kutoka mradi mzazi pana kama
umaarufu wa programu-jalizi.

## Kigezo cha Programu-jalizi Bora kwa Nyota

Kiingilio kinastahili tu wakati kila sharti hapa chini ni kweli:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Viingilio vinavyostahili hutumia `popularity.starsPolicy: exact-repository` na nambari kamili isiyo
hasi katika `popularity.stars`. Usawa hutumia ID ya programu-jalizi isiyozingatia herufi kubwa/ndogo
kama mpangilio thabiti wa kuonyesha; usawa huo hauashirii tofauti ya ubora.

`kind` ndiyo kitambuzi pekee cha aina ya zao. Schema kwa makusudi haihifadhi aina ya pili ya
muunganisho wa DSH ambayo inaweza kuipinga.

## Ubaguzi wa wazi

Programu-jalizi iliyo ndani ya monorepo pana zaidi bado inastahili katalogi, lakini nyota zake za
mzazi hazijafafanuliwa kwa upangaji wa programu-jalizi. Lazima itumie `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` na `popularity.stars: null`. Inaonekana katika
sehemu za kazi na hutengwa na kila upangaji unaotegemea nyota.

Familia za programu-jalizi, mandhari, ngozi, ujuzi, preset, wateja, violesura, madaraja na miradi
pana ya mfumo hazionekani katika Programu-jalizi Bora kwa Nyota. Hupokea sehemu tofauti pale data
inayolinganisha ilipo. Wakusanyaji, masoko, katalogi za visakinishi na orodha si viingilio vya
katalogi na havipokei sehemu yoyote ya katalogi.

## Mandhari za upangaji

Mradi unaweza kuchapisha mandhari tofauti kwa nyota, ukuaji wa saa 24, ukuaji wa siku 7, visasisho vya
hivi karibuni, usakinishaji uliothibitishwa, familia za programu-jalizi, mandhari na ngozi, wateja na
violesura, na muunganisho wa mfumo. Kila mandhari lazima ifichue kanuni yake ya kujumuishwa na muda wa
snapshot.

Ikiwa viingilio vinavyostahili ni sifuri, Programu-jalizi Bora haionyeshwi. Muunganisho wa kwanza
unaostahili huunda mandhari ya Programu-jalizi Bora; lebo hubadilika kuwa Bora 10 tu baada ya viingilio
kumi vinavyostahili kuwepo. Hakuna kishika-nafasi au upangaji uliovundwa unaoruhusiwa.

## Uthibitishaji si idhini

`eligible` inamaanisha muundo wa umma na muunganisho wa DSH vilithibitishwa. `verified` zaidi
inamaanisha jaribio la moshi la usakinishaji lilifaulu kwa chanzo au kifurushi kilichobandikwa. Hakuna
hali iliyo idhini, hakikisho au cheti kamili cha usalama.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
