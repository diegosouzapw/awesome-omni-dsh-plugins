# Töhfə vermə

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Azərbaycan dili**

> **Qeyri-rəsmi icma layihəsi. DeepSeek ilə əlaqəli deyil, onun tərəfindən dəstəklənmir və ya maliyyələşdirilmir.**
> DeepSeek adları və nişanları müvafiq sahiblərinə məxsusdur.

Kataloqu təkmilləşdirdiyiniz üçün təşəkkür edirik. Töhfələr yaradıcı-birinci prinsipi ilə qəbul
olunur: orijinal repozitoriyanın sübutlarından istifadə edin, müəllifliyi qoruyun və hər bir
plaginin müstəqil şəkildə nəzərdən keçirilə bilməsini təmin edin. Kataloq dizayn etibarilə boş
başlayır; öz nəzərdən keçirilmiş pull request-i olmadan heç bir qeydiyyat qəbul edilmir.

## Yaradıcıdan başlayın

Plaginin yaradıcısı və ya sahib təşkilat tərəfindən birbaşa açılan pull request həmişə üstünlük
təşkil edir. Əgər yaradıcı töhfə verməyə hazırdırsa, onun işini kurator və ya avtomatlaşdırma
branch-ında yenidən yaratmaq əvəzinə onun branch-ından və pull request-indən istifadə edin.

İcma kurasiyası hələ pull request açmamış yaradıcıya kömək etdiyi zaman xoş qarşılanır. O,
yaradıcının sonradan birbaşa verəcəyi töhfə üzərində mülkiyyət və ya prioritet yaratmır.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Hər branch və pull request üçün bir plagin

Bir plagin üçün ayrıca branch yaradın və həmin branch-dan bir pull request açın. Branch və pull
request `catalog/plugins/` altında dəqiq bir YAML faylı yaratmalı və ya dəyişdirməlidir. Bu
branch və ya pull request-ə pluginləri, sənədləşdirmə təmizliyini, generasiya edilmiş indeksləri
və ya əlaqəsiz baxımı qarışdırmayın.

Qeydiyyat ID-si və fayl adı eyni kiçik hərflərlə kebab-case dəyəri olmalıdır. Baxıcılar
(maintainer) hər plagin pull request-ini ayrıca nəzərdən keçirir və birləşdirir; bir neçə plagini
ehtiva edən topluma bölünmür və ya qismən birləşdirilmir.

## Orijinal mənbəni müəyyən edin

Hər bir açıq sahə sabitlənmiş commit-də orijinal yaradıcı repozitoriyasından, paketdən,
manifestdən, README-dən, lisenziyadan və ya buraxılışdan yenidən qurulmalıdır. Başqa kataloqun və
ya aqreqatorun mətnini, kateqoriya təyinatını, skrinşotlarını, reytinqini, nişanlarını (badge) və
ya generasiya edilmiş metaməlumatlarını kopyalamayın. Çətir (umbrella) layihəsində, bazarda
(marketplace), siyahıda və ya aqreqatorda tapılan link yalnız ip ucudur, sübut deyil və plaginin
mənbəyi deyil.

Çətir, aqreqator, bazar, quraşdırıcı kataloqu və ya siyahını, müstəqil quraşdırıla bilsə belə,
heç vaxt kataloq qeydiyyatı kimi təqdim etməyin. Onu yalnız ip ucu kimi istifadə edin və hər
müstəqil quraşdırıla bilən alt plagini onun həqiqi yaradıcısına və orijinal repozitoriyasına qədər
müəyyənləşdirin. Yaradıcısının həqiqi monorepo-sunda olan plagin öz dəqiq alt yolundan (subpath)
təqdim edilə bilər, lakin aşağıdakı monorepo ulduz siyasətinə əməl etməlidir.

## Tələb olunan sübutlar

Pull request-də aşağıdakıların hamısını təqdim edin:

- Orijinal repozitoriyanın kanonik açıq URL-i və onun dəyişməz repozitoriya node ID-si. Baxıcılar
  node ID-ni ayrıca mənşə (provenance) qapısında müəyyən edir və URL uyğunsuzluqlarını rədd edir.
- Yaradıcının açıq GitHub handle-ı və ona uyğun açıq profil URL-i. YAML handle-ı bir dəfə saxlayır;
  profil URL-i `https://github.com/<handle>` şəklində əldə edilir.
- Tam 40 simvollu mənbə commit OID-si və plaginin dəqiq alt yolu, ya da repozitoriyanın kök
  qovluğunda olan plagin üçün `null`.
- Məhdud uzunluqlu ingiliscə təsvir və onun həmin sabitlənmiş commit-dəki sübut yolu.
- [docs/CATEGORIES.md](../../docs/CATEGORIES.md) əsasında seçilmiş artefaktın `kind`-ı, əsas
  kateqoriyası və teqləri.
- Sabitlənmiş commit-də sübut edilmiş tam upstream SPDX lisenziya ifadəsi.
- Dəqiq npm versiyasına, və ya mənbə repozitoriyasına, tam commit-ə və alt yola sabitlənmiş
  kanonik quraşdırma deskriptoru. Deskriptor məlumatdır, heç vaxt shell əmri deyil.
- Native DSH inteqrasiyasının sübutu və onun sabitlənmiş commit-dəki yolu.
- Həmin dəqiq artefakt sabitləməsi üçün mövcud, həssas olmayan smoke test sübutu, ya da açıq
  `not run` dəyəri. Kataloq töhfəsini hazırlamaq üçün sadəcə plagini quraşdırmayın və ya
  `preinstall`, `install`, `postinstall`, `prepare` və ya digər paket/plagin həyat dövrü kodunu
  icra etməyin.
- Ayrılmış (dedicated) repozitoriya üçün, açıq mənbə və yoxlama vaxtı ilə birlikdə həmin dəqiq
  repozitoriya üçün yoxlanıla bilən ulduz sayı. Monorepo plagini üçün aşağıdakı tələb olunan null
  siyasətindən istifadə edin.
- Mövcud olduqda açıq Discussion və ya şərh mənşəyi; əks halda `null` istifadə edin.
- Maşın tərəfindən oxuna bilən `unofficial: true` dəyəri.

Uyğun smoke test artıq mövcud deyilsə, `verification.status: eligible` və
`verification.smokeTest: null` istifadə edin. `verified` yalnız dəqiq sabitləmə üçün nəzərdən
keçirilə bilən smoke sübutu mövcud olduqda istifadə edin. Heç bir vəziyyət təsdiq (endorsement) və
ya təhlükəsizlik sertifikatı deyil.

Heç vaxt etimadnamələr (credentials), cookie-lər, şəxsi e-poçt ünvanları, nəşr olunmamış mənbə
kodu və ya digər sirləri təqdim etməyin.

## YAML və schema qaydaları

`catalog/plugins/<plugin-id>.yaml` yaradın və onu
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) ilə yoxlayın. Sahə adları və
icazə verilən dəyərlər üçün mənbə həqiqət schema-dır; [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
tək artefakt kind-ının, əsas kateqoriyanın, teqlərin və repozitoriya əhatəsinin (scope) necə
seçiləcəyini müəyyən edir.

npm deskriptoru etibarlı paket adı və dəqiq versiya ehtiva etməlidir. Açıq schema opsiya-bənzər və
hüdudsuz dəyərləri rədd edir, lakin SemVer və ya SRI-ı yenidən tətbiq etmir: kataloq validasiyası
versiyanı təhlil etməli, dəqiq SemVer tələb etməli və istənilən integrity dəyərini etibarlı
SHA-512 SRI kimi təhlil etməlidir. Mənbə deskriptoru dəyişkən mənbə dəyərlərini təkrarlamadan
`source.repository`, `source.commit` və `source.subpath`-a bağlıdır.

Quraşdırıcılar arqument massivlərindən istifadə etməli, shell icrasını deaktiv etməli və çağırılan
əmr dəstəklədiyi halda kataloqun təqdim etdiyi mövqe (positional) dəyərlərindən əvvəl opsiya
sonlandırıcısı qoymalıdır. Təqdimat validasiyası quraşdırıcını və ya plagin həyat dövrünü
çağırmamalıdır.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` lokal, yalnız-oxunan struktur və semantik yoxlamadır. O, təhlükəsiz YAML-ı
təhlil edir, açıq schema-nı doğrulayır, SPDX ifadələrini təhlil edir, dəqiq SemVer və etibarlı
SHA-512 SRI tələb edir, təkrarlanan ID-ləri və kanonik repozitoriya-node-üstəgəl-subpath açarlarını
rədd edir. O, GitHub ilə əlaqə saxlamır, repozitoriya kimliyini müəyyən etmir və ya sabitlənmiş
commit-dəki sübut yollarını yoxlamır.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Bir qeydiyyat `eligible` statusuna çatmazdan əvvəl, baxıcılar ayrıca kanonik repozitoriyanı və
node ID-ni müəyyən edir, yaradıcını orijinal mənbəyə bağlayır və elan edilmiş təsviri, lisenziyanı,
DSH inteqrasiyasını və smoke sübutunu `source.commit`-də yoxlayır. Lokal yaşıl validasiya nəticəsi
mənşə və ya mənbə sübutu deyil.

## Repozitoriya ulduzları

Yalnız dəqiq ayrılmış plagin repozitoriyasına aid olduğu yoxlanıla bilən ulduzlar qeyd oluna
bilər. Valideyn layihənin ulduzları heç vaxt daha geniş monorepo daxilində saxlanan plaginə aid
edilməməlidir. Monorepo qeydiyyatı kataloqun funksional bölmələri üçün uyğun qalır, lakin bunu
bəyan etməlidir:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Ayrılmış qeydiyyat `repositoryScope: dedicated`, `starsPolicy: exact-repository` və eyni
repozitoriyada müşahidə olunan mənfi olmayan ulduz sayından istifadə edir. Populyarlıq
(popularity) məlumatını təqdim etməzdən əvvəl [docs/RANKING.md](../../docs/RANKING.md) sənədini
oxuyun.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Yaradıcı üstünlüyü və hörmətli əlaqə

Eyni kanonik plagin üçün üstünlük sırası belədir:

1. Yaradıcı və ya sahib təşkilat tərəfindən açılan pull request.
2. Yaradıcı tərəfindən açıq şəkildə təsdiqlənmiş icma pull request-i.
3. Mövcud etibarlı icma kurasiya pull request-i.
4. Kataloq avtomatlaşdırma pull request-i.

Birbaşa yaradıcı pull request-i, hansının əvvəl açıldığından və ya daha irəli getdiyindən asılı
olmayaraq, istənilən açıq kurasiya və ya avtomatlaşdırma pull request-indən üstün tutulur.
Yaradıcının pull request-i nəzərdən keçirmə vasitəsinə çevrilir; baxıcılar yaradıcının branch-ına
force-push etmir və onun işini kurasiya edilmiş pull request-ə köçürmür. Kurasiya edilmiş
qeydiyyat artıq birləşdirilibsə, açıq tarixçə yenidən yazılmır. Yaradıcı iddia (claim) və ya
düzəliş sorğusundan istifadə edə və sonra birbaşa növbəti pull request ilə töhfə verə bilər.

Kurasiya edilmiş pull request öz təsvirində, orijinal repozitoriyaya link ilə yanaşı, yaradıcını
nəzərdən keçirməyə və ya onu birbaşa pull request ilə əvəz etməyə dəvət edən bir dəfə hörmətli
açıq `@yaradıcı` qeydindən istifadə etməlidir. Qeydi təkrarlamayın, təşviqat issue-ları açmayın,
cross-post etməyin, istənilməyən birbaşa mesajlar göndərməyin və ya yaradıcını başqa cür spam
etməyin.

<!-- creator-first:source-bound-git-identity -->

Yaradıcı tərəfindən yazılmış pull request-lər və commit-lər yaradıcının kreditini təbii şəkildə
qoruyur. Kurasiya edilmiş commit-lər yalnız mənbəyə bağlı, açıq şəkildə yoxlanıla bilən kimlik
olduqda yaradıcının Git müəllifliyindən və ya `Co-authored-by` trailer-indən istifadə edə bilər.
Heç vaxt e-poçt uydurmayın və ya təxmin etməyin. Heç bir yoxlanılmış Git kimliyi mövcud
olmadıqda, kurator commit-in müəllifi olur və YAML-da və pull request-də orijinal repozitoriya
linki ilə açıq `Created by @handle` kreditini verir. Baxıcı və ya avtomatlaşdırma hesabı committer
və ya yoxlanılmış həmmüəllif ola bilər, lakin yaradıcının müəllifliyini əvəz etməməlidir. Tam
siyasət üçün [docs/CREDIT.md](../../docs/CREDIT.md) sənədinə baxın.

## Validasiya əmrləri və əlçatanlıq

npm CLI-si `omni-dsh-plugins@1.0.1` kimi nəşr olunub, ona görə də aşağıdakı əmrlər bu
gün `npx` vasitəsilə əlçatandır. Onları tam olaraq yazıldığı kimi istifadə edin; töhfəçilər
əvəzedici əmrlər uydurmamalıdır.

Bu əmrləri repozitoriyanın kök qovluğundan icra edin:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` yalnız yuxarıda təsvir edilmiş lokal YAML, schema, SPDX, dəqiq SemVer,
SHA-512 SRI və təkrarlanma yoxlamalarını yerinə yetirir və qəsdən sıfır qeydiyyatlı kataloqu qəbul
edir. O, uzaqdakı repozitoriya kimliyini və ya sabitlənmiş mənbə sübutunu isbat etmir. Digər
əmrlər tələb olunan açıq sənədləşməni və strukturlaşdırılmış GitHub issue formalarını yoxlayır. Bu
əmrlərin lokal olaraq uğurla keçməsi sübut tələblərini yumşaltmır; baxıcılar birləşdirmədən əvvəl
yenə də hər müvafiq buraxılış (release) qapısını tətbiq edir.

## Nəzərdən keçirmə qapıları, toqquşmalar və birləşdirmə

Baxıcılar birləşdirmədən əvvəl hər bir qapını cari pull request commit-inə tətbiq edir:

1. **Əhatə (Scope):** bir ayrılmış branch, bir plagin YAML faylı və heç bir əlaqəsiz dəyişiklik.
2. **Orijinal kimlik:** yaradıcı, kanonik repozitoriya, node ID, tam commit və alt yol uyğun gəlir.
3. **Schema və sübut:** YAML, kateqoriyalar, SPDX, quraşdırma sabitləməsi, DSH sübutu və smoke
   statusu plagin həyat dövrü kodunu icra etmədən daxili olaraq uyğundur.
4. **Populyarlıq:** ayrılmış ulduzlar dəqiq repozitoriyada yoxlanıla bilər, ya da monorepo
   ulduzları `undefined-parent-repository` ilə `null`-dur.
5. **Sənədləşmə və formalar:** açıq sənədlər, Markdown fence-ləri və strukturlaşdırılmış formalar
   etibarlı qalır.
6. **Toqquşma və dublikatların aradan qaldırılması:** heç bir birləşdirilmiş qeydiyyat və ya açıq
   pull request eyni kanonik plagini təmsil etmir.

Fərqli adlar və ya ID-lər dublikat pluginləri fərqli etmir. Eyni repozitoriya node ID-si və alt
yolunu, eyni kanonik paketi, ya da başqa aşkar şəkildə eyni quraşdırma hədəfini toqquşma kimi
qiymətləndirin. Birləşdirmədən əvvəl aliasları və rəqib pull request-ləri həll edin. Birbaşa
yaradıcı pull request-i kurasiya və ya avtomatlaşdırma ilə toqquşmada qalib gəlir; əks halda
baxıcılar bir nəzərdən keçirmə vasitəsi seçir və hər ikisini birləşdirmək əvəzinə dublikatları
bağlayır və ya yönləndirir.

Yalnız baxıcı bütün qapılar keçdikdən sonra plagini birləşdirir. Hər qəbul edilmiş plagin ayrıca
birləşdirilir; validasiya, kurasiya və ya avtomatlaşdırma avtomatik və ya kütləvi (batch)
birləşdirməni nəzərdə tutmur.

## Pull request yoxlama siyahısı

- [ ] Bir ayrılmış branch istifadə etdim və bu PR dəqiq bir plagin qeydiyyatını dəyişdirir.
- [ ] Mənbə orijinal yaradıcı repozitoriyasıdır, çətir və ya aqreqator deyil.
- [ ] Yaradıcının handle/profili, repozitoriya, node ID, alt yol və tam commit sübut edilib.
- [ ] kind, kateqoriya və teqlər `docs/CATEGORIES.md`-ə uyğundur.
- [ ] SPDX lisenziyası və sabitlənmiş quraşdırma deskriptoru sübut edilib.
- [ ] Native DSH inteqrasiyası və smoke nəticəsi və ya `not run` statusu sübut edilib.
- [ ] Bu töhfəni hazırlamaq üçün plagin və ya paket həyat dövrü kodunu icra etmədim.
- [ ] Ayrılmış ulduzlar yoxlanıla bilər, ya da monorepo ulduzları tələb olunan null siyasətindən
      istifadə edir.
- [ ] Eyni kanonik plagin üçün mövcud qeydiyyat və açıq pull request olub-olmadığını yoxladım.
- [ ] Qeydiyyat açıq şəkildə qeyri-rəsmidir və heç bir sirr və ya şəxsi məlumat ehtiva etmir.

## Dil siyasəti

Buraxılış sənədləşməsi və kataloq təsvirləri yalnız ingilis dilindədir. 43 lokal üçün genişlənmə
post-MVP backlog elementi olaraq qalır; boş lokal sənədlər və ya avtomatik kütləvi tərcümələr
əlavə etməyin.

<!-- i18n-source-hash: 54fa0daef6ededc936a6f681d0cbe7463ec4080757d199e691824dfdc8b388f4 -->
