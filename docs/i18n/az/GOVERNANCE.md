# Kataloq idarəetməsi

> **Qeyri-rəsmi icma layihəsi. DeepSeek ilə əlaqəli deyil, DeepSeek tərəfindən dəstəklənmir və ya sponsorluq edilmir.**
> DeepSeek adları və nişanları müvafiq sahiblərinə məxsusdur.

İctimai kataloqun necə idarə edildiyi: kim daxil olanı müəyyənləşdirir, rəqabət aparan töhfələr
hansı ardıcıllıqla qəbul edilir, hansı yoxlamalar avtomatik icra olunur və hansı qərarlar insan
qərarı olaraq qalır. Burada istinad edilən siyasətlər [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md) və [docs/RANKING.md](../../docs/RANKING.md)
sənədlərindədir; bu səhifə onların bir-birinə necə uyğunlaşdığını təsvir edir.

## Prinsiplər

1. **Yaradıcı-önləşdirilmiş.** Kataloq yaradıcıların işini kəşf edilə bilən etmək üçün mövcuddur,
   heç vaxt ona sahib çıxmaq üçün deyil. Eyni kanonik əlavə üçün birbaşa yaradıcı pull
   request-i istənilən açıq icma kurasiyası və ya avtomatlaşdırma pull request-indən üstündür —
   tam üstünlük sırası və Git kimlik qaydaları [docs/CREDIT.md](../../docs/CREDIT.md)
   sənədindədir.
2. **Bir əlavə, bir nəzərdən keçirilmiş pull request.** Toplu birləşdirmə yoxdur, ictimai
   kataloqa generasiya edilmiş kütləvi idxal yoxdur. Hər qeyd öz baxışını qazanır.
3. **Etibardan çox sübut.** Hər ictimai sahə sabitlənmiş commit-də orijinal yaradıcı
   repozitoriyasına gedib çıxır. Yaşıl avtomatik yoxlama heç vaxt mənşə sübutu kimi qəbul
   edilmir.
4. **Həmişə qeyri-rəsmi.** Heç bir kataloq statusu DeepSeek baxışı, sertifikatı və ya təsdiqi
   kimi təqdim edilmir.

## Dəyişikliklər `main`-ə necə daxil olur

Bütün dəyişikliklər `main`-ə nəzərdən keçirilmiş pull request-lər vasitəsilə çatır — birbaşa
push yoxdur. Susmaya görə branch üçün iş siyasəti:

- **Yalnız pull request-lər.** Kataloq qeydləri, sənədləşmə və sxem dəyişikliklərinin hamısı PR
  vasitəsilə daxil olur; kataloq PR-ləri [CONTRIBUTING.md](../../CONTRIBUTING.md) sənədindəki
  budaq-başına-bir-əlavə qaydasına əməl etməlidir.
- **Xətti tarixçə.** PR-lər elə inteqrasiya olunur ki, `main` xətti, audit edilə bilən tarixçəni
  qorusun; birləşdirilmiş ictimai tarixçə yenidən yazılmır. Kurasiya edilmiş qeyd yaradıcı
  ortaya çıxmazdan əvvəl birləşdirilibsə, yaradıcı tarixçəni yenidən yazmaq əvəzinə növbəti
  töhfədə onu iddia və ya düzəliş edir.
- **Baxış mövzularının həlli.** Baxış söhbətləri birləşdirmədən əvvəl həll olunur; həll
  olunmamış rəy inteqrasiyanı bloklayır.
- **Baxıcı birləşdirməsi.** Əlavə qeydini yalnız baxıcı birləşdirir və yalnız
  [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Baxış qapıları, toqquşmalar və birləşdirmə"
  bölməsindəki hər qapı cari PR commit-də keçdikdən sonra.

## `catalog-validation` yoxlaması

`catalog/plugins/`, `schemas/` və ya workflow-un özünə toxunan hər pull request
`catalog-validation` işini icra edir (`.github/workflows/validate-catalog.yml`) və dərc edilmiş
CLI-yə sabitlənir:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Nəyi doğrulayır** — yalnız yerli struktur və semantika:

- `catalog/plugins/` altındakı hər qeydin təhlükəsiz YAML parser-lənməsi.
- İctimai sxemə uyğunluq (bax [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- SPDX ifadə parser-ləməsi, dəqiq SemVer versiyaları, etibarlı SHA-512 SRI integrity dəyərləri.
- Dublikat rəddi: təkrarlanan qeyd ID-ləri və təkrarlanan kanonik
  repozitoriya-node-üstəgəl-alt-yol açarları yoxdur.
- Qəsdən sıfır qeydiyyatlı kataloq keçir (`0 entries valid; catalog is empty`).

**Nəyi doğrulamır** — və buna görə də yaşıl yoxlamanın heç vaxt sübut etmədiyi şeylər:

- Uzaq repozitoriya kimliyi: GitHub ilə əlaqə saxlamır və repozitoriya node ID-sini URL-ə qarşı
  həll etmir.
- Sabitlənmiş commit-də sübut: təsvirlər, lisenziyalar, DSH inteqrasiyası və tüstü-sınağı
  sübutları yüklənmir və yoxlanmır.
- Yaradıcı sahibliyi, ulduz sayları və ya açıq pull request-lərlə toqquşma.

Bu qərarlar baxıcıların ayrıca mənşə qapılarına aiddir, birləşdirmədən əvvəl tətbiq olunur və
[CONTRIBUTING.md](../../CONTRIBUTING.md) sənədində təsvir edilib. Yerli yoxlama minimumdur,
son hədd deyil.

## Doğrulama statusları

Doğrulama hər qeyd üçün onun dəqiq sabitlənmiş commit-inə qarşı qeyd edilir və ictimai sxemdə
müəyyən edilmiş statuslardan istifadə edir (`eligible`, `verified`, `stale`, `unavailable`,
`archived`, `quarantined`). İki müsbət status qəsdən dar tutumludur:

- `eligible` — ictimai struktur və yerli DSH inteqrasiyası doğrulanıb.
- `verified` — əlavə olaraq, sabitlənmiş mənbə və ya paket üçün quraşdırma tüstü-sınağı keçib;
  sxem tüstü-sınağı qeydinin mövcud olmasını tələb edir.

Heç bir status — nə bunlar, nə də başqası — təsdiq, zəmanət və ya təhlükəsizlik sertifikatı
deyil. Statusların sıralama ilə necə qarşılıqlı təsiri daxil olmaqla tam semantika
[docs/RANKING.md](../../docs/RANKING.md) sənədindədir; qeyd forması
[docs/SCHEMA.md](../../docs/SCHEMA.md) sənədindədir.

## İddialar, düzəlişlər və silinmələr

Strukturlaşdırılmış GitHub issue formaları (`.github/ISSUE_TEMPLATE/`) təqdim etmədiyiniz qeydi
dəyişdirmək üçün idarə olunan yoldur:

| Forma            | Kim istifadə edir                          | Nəticə                                              |
| ---------------- | ---------------------------------------- | --------------------------------------------------- |
| **İddia (Claim)** | Əlavəsi başqası tərəfindən kurasiya edilmiş yaradıcı | Sahiblik orijinal mənbəyə bağlanır; yaradıcı bundan sonra birbaşa töhfə verə bilər |
| **Düzəliş (Correction)** | Qeyri-dəqiq ictimai metaməlumat görən istənilən şəxs | Təsirlənmiş qeydə nəzərdən keçirilmiş düzəliş     |
| **Silinmə (Removal)** | Qeydinin silinməsini istəyən yaradıcı və ya siyasət pozuntusunu bildirən şəxs | Qeydin nəzərdən keçirilmiş silinməsi və ya karantini |

Hər üç axına tətbiq olunan qaydalar:

- Sahiblik iddiaları yoxlanıla bilən ictimai sübutla dəstəklənməlidir (repozitoriya sahibliyi,
  paket müəllifliyi, manifest metaməlumatları və ya sabitlənmiş mənbə tarixçəsi) —
  Discussion-da şərh yazmaq yaradıcılığı müəyyən etmir ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Siyahıya salınmış əlavədəki təhlükəsizlik problemləri əvvəlcə həmin əlavənin öz baxıcısına
  göndərilir; kataloq tərəfi sonra düzəliş və ya karantini istismar təfərrüatını dərc etmədən
  idarə edir ([SECURITY.md](../../SECURITY.md)).
- Formada heç vaxt etimadnamələr, şəxsi əlaqə məlumatları və ya digər sirlər daxil etməyin.

## Rollar

- **Yaradıcılar** öz əlavələrinə və qeydlərinin üstünlüyünə sahibdirlər. Birbaşa töhfə verə,
  icma kurasiyasını təsdiqləyə və ya mövcud qeydi iddia/düzəliş/silmə edə bilərlər.
- **İcma töhfəçiləri** hələ töhfə verməmiş yaradıcılar üçün qeydləri,
  [docs/CREDIT.md](../../docs/CREDIT.md) sənədindəki hörmətli-əlaqə və atribusiya qaydaları
  çərçivəsində kurasiya edə bilərlər. Kurasiya heç vaxt sonrakı birbaşa yaradıcı töhfəsindən
  üstün olmur.
- **Baxıcılar** nəzərdən keçirir, mənşə qapılarını tətbiq edir, toqquşmaları həll edir və
  birləşdirir. Onlar həmçinin veb saytı
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) və dərc edilmiş CLI-ni
  özəl mənbədən saxlayırlar; bu repozitoriyanın ictimai məlumatları, sxemi və siyasətləri həmin
  səthlərin istehlak etdiyi şeylərdir.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
