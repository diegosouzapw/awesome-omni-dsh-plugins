# Yaradıcı atribusiyası və pull request üstünlüyü

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Azərbaycan dili**

Kataloq müstəqil DSH işlərini kəşf edilə bilən etmək üçün mövcuddur, sahibliyi yaradıcılarından
almadan. İctimai qeydlər orijinal repozitoriyanı və dəyişməz mənbə commit-ini sitat gətirir.

## Eyni əlavə üçün üstünlük

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Əlavənin yaradıcısı və ya sahib təşkilat tərəfindən açılan pull request.
2. Yaradıcı tərəfindən açıq şəkildə təsdiqlənmiş və ya həmmüəlliflik edilmiş icma pull request-i.
3. Mövcud etibarlı icma pull request-i.
4. Kataloq avtomatlaşdırma pull request-i.
5. Açıq pull request-i olmayan özəl namizəd.

Birbaşa yaradıcı pull request-i həmişə üstündür və eyni kanonik əlavə üçün istənilən açıq icma
kurasiyası və ya avtomatlaşdırma pull request-ini əvəz edir — hansının əvvəl açıldığından və ya
daha irəli getdiyindən asılı olmayaraq. Yaradıcının pull request-i baxış vasitəsinə çevrilir;
onun branch-ı heç vaxt üzərinə yazılmır, force-push edilmir və ya kurasiya edilmiş pull
request-ə köçürülmür. Kurasiya edilmiş qeyd artıq birləşdirilibsə, tarixçə toxunulmaz qalır və
yaradıcı onu yeni töhfədə iddia və ya düzəliş edə bilər.

## İctimai atribusiya

Hər kataloq qeydi yaradıcının ictimai GitHub handle-ını, orijinal repozitoriyanı, repozitoriya
node ID-sini, əlavə alt yolunu və tam sabitlənmiş commit-i daşıyır. İctimai yaradıcı profili
ikinci kimlik kimi saxlanmaq əvəzinə tək handle-dan əldə edilir. Ayrı baxıcı mənşə qapısı node
ID-ni həll edir və repozitoriya URL uyğunsuzluğunu rədd edir. Pull request təsvirləri
`Created by @handle` deməli və mənbə repozitoriyası ilə mənbə commit metaməlumatlarını daxil
etməlidir.

Discussion-da paylaşım edən və ya şərh yazan şəxs avtomatik olaraq yaradıcı kimi qəbul edilmir.
Sahiblik repozitoriya sahibi və ya təşkilatı, paket müəllifliyi, manifest metaməlumatları və ya
dəqiq sabitlənmiş mənbə tarixçəsi ilə dəstəklənməlidir.

## Git kimliyi

<!-- creator-first:source-bound-git-identity -->

Commit müəllifliyi və pull request müəllifliyi ayrıdır. Yaradıcıdan gələn pull request
yaradıcını pull request müəllifi olaraq saxlayır və onun commit-ləri müəllifliyi təbii şəkildə
qoruyur. Baxıcı və ya avtomatlaşdırma hesabı committer və ya yoxlanılmış həmmüəllif kimi görünə
bilər, amma yaradıcının müəllifliyini əvəz etməməlidir.

Kurasiya edilmiş commit üçün yaradıcını Git müəllifi kimi istifadə edin və ya `Co-authored-by`
trailer-ini yalnız dəqiq kimlik mənbəyə bağlı və açıq şəkildə yoxlanıla bilən olduqda əlavə
edin — məsələn, orijinal repozitoriyada yaradıcının commit-inə artıq əlavə edilmiş kimlik.
Heç vaxt e-poçt təxmin etməyin, noreply ünvanı uydurmayın və ya səlahiyyətli ictimai mənbədən
kənarda tapılmış özəl ünvandan istifadə etməyin.

Yoxlanılmış Git kimliyi mövcud olmadıqda, kurator və ya avtomatlaşdırma hesabı commit-in
müəllifi olur və əvəzində açıq görünən atribusiya verir: `Created by @handle`, uyğun ictimai
profil və qeyddə və pull request-də orijinal repozitoriyaya keçid. Görünən YAML atribusiyası Git
kimlik xəritələməsindən asılı olmayaraq həmişə müstəqil olaraq tələb olunur. Sonrakı birbaşa
yaradıcı pull request-i açıq kurasiya pull request-ini sintetik tarixçəsini miras almaq əvəzinə
əvəz edir.

## Hörmətli yaradıcı qeydi

Kurasiya edilmiş pull request öz təsvirində, orijinal repozitoriya keçidinin yanında bir dəfə
hörmətli ictimai `@creator` qeydindən istifadə edir. O, nəzərdən keçirməyə və ya əvəzləyici
birbaşa pull request-ə dəvət edə bilər. Qeydi təkrarlamayın, təşviqat issue-ları açmayın,
cross-post etməyin və istənilməyən birbaşa mesajlar göndərməyin.

## Kataloq lisenziyası və yuxarı axın lisenziyası

Kataloq faktları və redaktə YAML metaməlumatları CC0-1.0 altında ictimai mülkiyyətə verilib. Bu
həsr yuxarı axın əlavəsinin lisenziyasını dəyişdirmir. Yuxarı axın kodu, sənədləşməsi, ekran
görüntüləri, loqoları və digər yaradıcı materialları öz orijinal lisenziyalarına və
sahiblərinə tabe qalır.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
