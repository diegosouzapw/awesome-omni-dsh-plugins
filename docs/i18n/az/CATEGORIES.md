# Kataloq kateqoriyaları

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Azərbaycan dili**

Hər kataloq qeydinin bir artefakt növü (kind), bir əsas imkan kateqoriyası və sıfır və ya daha
çox teqi var. Əsas kateqoriya qeydin harada göründüyünü müəyyən edir; teqlər qeydi
dublikatlaşdırmadan kateqoriyalararası axtarış təmin edir.

## Artefakt növləri

<!-- catalog-policy:aggregators-never-entries -->

| Dəyər | Məna | Ulduz sıralamasında əlavə kimi |
|---|---|---:|
| `plugin` | Quraşdırıla bilən yerli DSH paketi | Yalnız bütün sıralama şərtləri ödənildikdə |
| `plugin-family` | Bir neçə DSH əlavəsi ehtiva edən repozitoriya | Xeyr; ayrıca bölmə |
| `skin-theme` | DSH UI dərisi və ya vizual mövzu | Xeyr; ayrıca bölmə |
| `skill` | DSH dəstəkli agent bacarığı | Xeyr |
| `preset-profile` | DSH profili və ya əvvəlcədən qurma | Xeyr |
| `client-interface` | Masaüstü, TUI, redaktor və ya uzaqdan müştəri | Xeyr |
| `bridge-adapter` | Başqa məhsuldan DSH-yə inteqrasiya | Xeyr |
| `ecosystem-project` | DSH inteqrasiyası ehtiva edən daha geniş layihə | Xeyr |

Çətir (umbrella) repozitoriya, aqreqator, bazar (marketplace), quraşdırıcı kataloqu və ya
siyahı heç vaxt kataloq qeydi deyil, hətta aqreqatorun özü quraşdırıla bilən olduqda belə. O,
yalnız ip ucu kimi istifadə edilə bilər. Hər ip ucunu müstəqil quraşdırıla bilən alt artefakta
qədər izləyin və təqdim etməzdən əvvəl həmin artefaktın həqiqi yaradıcısını, orijinal
repozitoriyasını, paketini və mənbə alt yolunu müəyyənləşdirin. Həqiqi yaradıcı monorepo-su alt
əlavə üçün orijinal repozitoriya ola bilər, amma alt əlavə həmin dəqiq alt yoldan və monorepo
ulduz siyasətindən istifadə etməlidir.

`kind` sahəsi kanonik DSH artefakt diskriminatorudur. Ayrı inteqrasiya növü yoxdur: `plugin`
artıq yerli DSH paketi deməkdir, `ecosystem-project` isə artıq DSH inteqrasiyalı daha geniş
layihə deməkdir. Bu, ziddiyyətli təsnifat cütlərinin qarşısını alır.

## Əsas imkan kateqoriyaları

| Dəyər | Görünən etiket |
|---|---|
| `user-interface-dashboards` | İstifadəçi interfeysi və panel |
| `memory-rag` | Yaddaş və RAG |
| `search-research` | Axtarış və tədqiqat |
| `coding-developer-tools` | Kodlaşdırma və tərtibatçı alətləri |
| `browser-automation` | Brauzer və avtomatlaşdırma |
| `vision-audio-multimodal` | Görüntü, səs və multimodal |
| `sessions-productivity` | Sessiyalar və məhsuldarlıq |
| `security-permissions-approvals` | Təhlükəsizlik, icazələr və təsdiqlər |
| `diagnostics-observability` | Diaqnostika və müşahidəolunma |
| `models-providers-routing` | Modellər, provayderlər və yönləndirmə |
| `messaging-notifications` | Mesajlaşma və bildirişlər |
| `data-external-services` | Məlumat və xarici xidmətlər |
| `entertainment-customization` | Əyləncə və fərdiləşdirmə |

Əlavənin əsas işini ən yaxşı təmsil edən kateqoriyanı seçin, görünmə ehtimalını artıracaq
kateqoriyanı deyil.

## İnterfeys teqləri

Standart interfeys teqlərinə `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` və `theme` daxildir. Sabitlənmiş orijinal mənbədə
görünən sübutu təsvir etdikdə əlavə kiçik hərflərlə kebab-case imkan teqlərinə icazə verilir.

## Repozitoriya əhatəsi

`dedicated` istifadə edin yalnız repozitoriya ulduzları dəqiq kataloqlaşdırılan əlavəyə aid
olduqda. Əlavə daha geniş layihənin içində alt yol və ya paket olduqda `monorepo` istifadə
edin. Monorepo qeydi `popularity.starsPolicy: undefined-parent-repository` və
`popularity.stars: null` istifadə etməlidir.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
