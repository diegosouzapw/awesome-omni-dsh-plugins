# Sıralama metodologiyası

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Azərbaycan dili**

Sıralamalar birləşdirilmiş ictimai kataloq qeydləri üzərində şəffaf baxışlardır. Onlar heç vaxt
gizli birləşdirilmiş xaldan istifadə etmir və geniş ana layihənin ulduzlarını əlavə
populyarlığı kimi qiymətləndirmir.

## Ulduzlara görə Top əlavələr predikatı

Qeyd yalnız aşağıdakı şərtlərin hamısı doğru olduqda uyğun gəlir:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Uyğun gələn qeydlər `popularity.starsPolicy: exact-repository` və `popularity.stars` sahəsində
mənfi olmayan tam ədəd istifadə edir. Bərabərlik halında müəyyənedici görünüş ardıcıllığı kimi
registerdən asılı olmayan əlavə ID-si istifadə olunur; bərabərliyin pozulması keyfiyyət fərqi
demək deyil.

`kind` yeganə artefakt növü diskriminatorudur. Sxem qəsdən onunla ziddiyyət təşkil edə biləcək
ikinci DSH inteqrasiya növünü saxlamır.

## Açıq istisnalar

Daha geniş monorepo daxilindəki əlavə kataloq üçün uyğun qalır, amma onun ana layihə ulduzları
əlavə sıralaması üçün qeyri-müəyyəndir. O, `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` və `popularity.stars: null` istifadə
etməlidir. O, funksional bölmələrdə görünür və bütün ulduz-əsaslı sıralamalardan xaric edilir.

Əlavə ailələri, mövzular, dərilər, bacarıqlar, əvvəlcədən qurmalar, müştərilər, interfeyslər,
körpülər və daha geniş ekosistem layihələri Ulduzlara görə Top əlavələrdə görünmür. Onlar üçün
müqayisə edilə bilən məlumat mövcud olduqda ayrıca bölmələr verilir. Aqreqatorlar, bazarlar,
quraşdırıcı kataloqları və siyahılar kataloq qeydi deyil və heç bir kataloq bölməsi almır.

## Sıralama baxışları

Layihə ulduzlar, 24 saatlıq artım, 7 günlük artım, son yeniləmələr, doğrulanmış quraşdırmalar,
əlavə ailələri, mövzular və dərilər, müştərilər və interfeyslər və ekosistem inteqrasiyaları
üçün fərqli baxışlar dərc edə bilər. Hər baxış öz daxilolma qaydasını və snapshot vaxtını açıq
göstərməlidir.

Uyğun qeydlər sıfır olduqda, Top əlavələr render edilmir. İlk uyğun birləşdirmə Top əlavələr
baxışını yaradır; etiket yalnız on uyğun qeyd mövcud olduqdan sonra Top 10-a dəyişir. Heç bir
yer tutucu və ya uydurulmuş sıralamaya icazə verilmir.

## Doğrulama təsdiq deyil

`eligible` o deməkdir ki, ictimai struktur və DSH inteqrasiyası doğrulanıb. `verified` əlavə
olarak o deməkdir ki, sabitlənmiş mənbə və ya paket üçün quraşdırma tüstü-sınağı keçib. Heç bir
status təsdiq, zəmanət və ya mütləq təhlükəsizlik sertifikatı deyil.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
