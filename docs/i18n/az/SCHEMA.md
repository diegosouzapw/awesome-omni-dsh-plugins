# Kataloq qeydi sxemi istinadı

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Azərbaycan dili**

> **Qeyri-rəsmi icma layihəsi. DeepSeek ilə əlaqəli deyil, DeepSeek tərəfindən dəstəklənmir və ya sponsorluq edilmir.**
> DeepSeek adları və nişanları müvafiq sahiblərinə məxsusdur.

Bu, [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) üçün sahə-sahə istinaddır —
`catalog/plugins/` altındakı hər faylın qarşılamalı olduğu ictimai JSON Schema (draft 2020-12).
Sxem faylının özü həqiqət mənbəyidir; bu səhifə ilə sxem uyğun gəlmədikdə sxem üstündür.

İki qat doğrulama tətbiq olunur. İctimai sxem məhdudlaşdırılmış *təhlükəsiz formaları*
(opsiya-bənzər və ya hədsiz dəyərləri rədd edən nümunələr və uzunluqlar) tətbiq edir. Onun
üstündə `catalog validate` məcburi semantik parser-ləri tətbiq edir: versiyalar üçün dəqiq
SemVer, integrity dəyərləri üçün SHA-512 SRI, lisenziyalar üçün SPDX ifadə parser-i və
təkrarlanan açarların rəddi. Dəyər sxem nümunəsinə uyğun gəlib yenə də semantik olaraq rədd
edilə bilər.

Yuxarı səviyyə qaydaları: qeyd tək YAML obyektidir, `additionalProperties: false` (naməlum
sahələr rədd edilir) və aşağıdakı sahələrin **hamısı** tələb olunur.

## Yuxarı səviyyə sahələr

| Sahə              | Növ     | Tələb olunur | Xülasə                                                          |
| ----------------- | ------- | :----------: | --------------------------------------------------------------- |
| `schemaVersion`   | const   |     bəli     | Dəqiq `1` olmalıdır                                             |
| `id`              | string  |     bəli     | Kiçik hərflərlə kebab-case qeyd ID-si; fayl adı ilə eyni olmalıdır |
| `name`            | string  |     bəli     | Görünən ad, 1–120 simvol                                        |
| `description`     | object  |     bəli     | Kurasiya edilmiş ingiliscə xülasə və onun sübut yolu            |
| `unofficial`      | const   |     bəli     | Dəqiq `true` olmalıdır                                          |
| `kind`            | enum    |     bəli     | Kanonik artefakt diskriminatoru                                 |
| `primaryCategory` | enum    |     bəli     | Tək əsas imkan kateqoriyası                                     |
| `tags`            | array   |     bəli     | Unikal kiçik hərflərlə kebab-case teqlər (boş ola bilər)        |
| `source`          | object  |     bəli     | Orijinal repozitoriya, node ID, alt yol və sabitlənmiş commit   |
| `creator`         | object  |     bəli     | Yaradıcının ictimai GitHub handle-ı                             |
| `package`         | object  |     bəli     | Kanonik quraşdırma deskriptoru (npm **və ya** source)           |
| `dsh`             | object  |     bəli     | DSH profilləri və yerli inteqrasiya sübutunun yolu              |
| `repositoryScope` | enum    |     bəli     | `dedicated` və ya `monorepo`                                    |
| `popularity`      | object  |     bəli     | Ulduz siyasəti və ulduz sayı (əhatədən asılı olaraq)            |
| `license`         | object  |     bəli     | Yuxarı axın SPDX lisenziya ifadəsi                              |
| `verification`    | object  |     bəli     | Doğrulama statusu, yoxlama vaxtı, kimlik və tüstü-sınağı       |
| `provenance`      | object  |     bəli     | İctimai Discussion/şərh URL-ləri və ya `null`                   |

### `schemaVersion`

Sabit `1`. İctimai sxem versiyası 1-i müəyyən edir; istənilən başqa dəyər etibarsızdır.

### `id`

`^[a-z0-9]+(?:-[a-z0-9]+)*$` nümunəsinə uyğun string — kiçik hərflərlə kebab-case,
aparıcı/sonuncu və ya ikiqat defis olmadan. [CONTRIBUTING.md](../../CONTRIBUTING.md) sənədinə
əsasən, qeyd faylı eyni dəyərlə `catalog/plugins/<id>.yaml` adlandırılmalıdır; validator
uyğunsuzluğu rədd edir (`id-filename-mismatch`). ID həmçinin yaradıcının ad sahəsi (namespace)
ilə başlamalıdır: kiçik hərflərə çevrilmiş `creator.github` handle-ı, `[a-z0-9]` xaricindəki
hər simvol ardıcıllığı tək `-`-ə sıxılır, ardınca `-` (`id-creator-prefix`).

### `name`

Sərbəst formalı görünən ad, `minLength: 1`, `maxLength: 120`.

### `description`

Dəqiq iki tələb olunan xassəsi olan obyekt (başqalarına icazə verilmir):

| Xassə          | Növ    | Qaydalar                                                                  |
| -------------- | ------ | ------------------------------------------------------------------------- |
| `en`           | string | İngiliscə xülasə, 20–320 simvol                                           |
| `evidencePath` | string | Nisbi repozitoriya yolu nümunəsi; aparıcı `/` yox, tərs çəp xətlər yox, `.`/`..` seqmentləri yox |

İngiliscə xülasə `evidencePath` faylından, `source.commit` anında olduğu kimi kurasiya
edilməlidir — başqa kataloqdan kopyalanmamalıdır.

### `unofficial`

Sabit `true`. Qeydin qeyri-rəsmi olduğuna dair maşın tərəfindən oxuna bilən işarə.

### `kind`

**Yeganə** artefakt növü diskriminatoru (ikinci inteqrasiya növü sahəsi mövcud deyil).
Bunlardan biri:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Mənalar və sıralama nəticələri [docs/CATEGORIES.md](../../docs/CATEGORIES.md) sənədində
müəyyən edilib.

### `primaryCategory`

On üç imkan kateqoriyasından biri:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Görünən etiketlər və seçım təlimatları [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
sənədindədir.

### `tags`

Unikal string-lər massivi; hər biri `^[a-z0-9]+(?:-[a-z0-9]+)*$` nümunəsinə uyğun (kiçik
hərflərlə kebab-case). Sxem tərəfindən minimum say tələb olunmur.

### `source`

Dəqiq dörd tələb olunan xassəsi olan obyekt:

| Xassə              | Növ            | Qaydalar                                                                  |
| ------------------ | -------------- | ------------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` URL-i; owner GitHub istifadəçi adı qaydalarına tabedir, repo adı 1–100 simvol, `.`/`..` ola bilməz və `.git` ilə bitə bilməz |
| `repositoryNodeId` | string         | Dəyişməz GitHub repozitoriya node ID-si, boş olmayan                      |
| `subpath`          | string və ya null | Repozitoriya daxilində əlavənin alt yolu (`evidencePath` ilə eyni təhlükəsiz nisbi yol nümunəsi) və ya repozitoriya kökündəki əlavə üçün `null` |
| `commit`           | string         | Tam 40 simvollu onaltılıq commit OID-si                                   |

Kataloq doğrulaması `repositoryNodeId`-ni həll etməli və repozitoriya URL uyğunsuzluğunu rədd
etməlidir — bu həll baxıcı tərəfində qapıdır, yerli struktur yoxlamasının hissəsi deyil.

### `creator`

Tək tələb olunan xassəsi olan obyekt:

| Xassə    | Növ    | Qaydalar                                          |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub istifadəçi adı (1–39 simvol, GitHub handle qaydaları) |

İctimai profil URL-i həmişə `https://github.com/<handle>` kimi əldə edilir; ikinci profil
sahəsi saxlanmır, buna görə də bu ikisi heç vaxt bir-birindən fərqlənə bilməz.

### `package`

Kanonik quraşdırma deskriptoru. Bu, məlumatdır, heç vaxt qabıq (shell) əmri deyil və dəqiq iki
formadan birini alır (`oneOf`):

**npm paketi** — tələb olunan `ecosystem`, `name`, `version`; isteğe bağlı `integrity`:

| Xassə       | Növ   | Qaydalar                                                                       |
| ----------- | ----- | ------------------------------------------------------------------------------ |
| `ecosystem` | const | `npm`                                                                          |
| `name`      | string | npm paket adı forması (isteğe bağlı scope ilə), maksimum 214 simvol            |
| `version`   | string | Dəqiq `x.y.z` versiya forması (isteğe bağlı prerelease/build); aralıqlar rədd edilir. Semantik qat əlavə olaraq parser-lənə bilən, dəqiq SemVer tələb edir |
| `integrity` | string | İsteğe bağlı `sha512-…` SRI forması, 8–256 simvol. Semantik qat onu etibarlı SHA-512 SRI kimi parser-ləməlidir |

**source quraşdırması** — yalnız tələb olunan `ecosystem`:

| Xassə       | Növ   | Qaydalar |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Source deskriptoru qəsdən başqa heç nə saxlamır: repozitoriya, commit və alt yol `source`-dan
əldə edilir, beləliklə dəyişkən dəyərlər heç vaxt dublikatlaşmır.

### `dsh`

Yerli DSH inteqrasiyasının sübutu:

| Xassə          | Növ    | Qaydalar                                                               |
| -------------- | ------ | ---------------------------------------------------------------------- |
| `profiles`     | array  | `^[A-Za-z0-9][A-Za-z0-9._-]*$` nümunəsinə uyğun ən azı bir unikal profil adı |
| `evidencePath` | string | `source.commit` anında DSH inteqrasiya sübutuna təhlükəsiz nisbi yol  |

### `repositoryScope`

Ya `dedicated` (repozitoriya ulduzları dəqiq bu əlavəyə aiddir), ya da `monorepo` (əlavə daha
geniş layihənin içində alt yol və ya paketdir). Bu dəyər aşağıdakı şərti populyarlıq
qaydalarını idarə edir.

### `popularity`

| Xassə        | Növ               | Qaydalar                                              |
| ------------ | ----------------- | ----------------------------------------------------- |
| `starsPolicy`| enum              | `exact-repository` və ya `undefined-parent-repository` |
| `stars`      | integer və ya null | Mənfi olmayan tam ədəd və ya `null`                   |

Şərti qaydalar (sxemin `allOf` blokları tərəfindən tətbiq edilir):

- `repositoryScope: monorepo` `starsPolicy: undefined-parent-repository` və `stars: null`
  dəyərlərini **məcbur edir**. Ana layihənin ulduzları heç vaxt monorepo əlavəsinə aid edilmir.
- `repositoryScope: dedicated` `starsPolicy: exact-repository` və tam ədəd `stars >= 0`
  dəyərlərini **məcbur edir**.

Bu dəyərlərin sıralama predikatını necə qidalandırdığını görmək üçün
[docs/RANKING.md](../../docs/RANKING.md) sənədinə baxın.

### `license`

| Xassə  | Növ    | Qaydalar                                                       |
| ------ | ------ | -------------------------------------------------------------- |
| `spdx` | string | SPDX ifadə forması, 2–256 simvol, aparıcı defis yox            |

Sxem yalnız təhlükəsiz simvol formasını tətbiq edir; kataloq doğrulaması dəyəri həqiqi SPDX
ifadə parser-i ilə parser-ləməli və normallaşdırmalıdır. Sabitlənmiş commit-də sübut edilmiş
tam yuxarı axın ifadəsini qeyd edin (məsələn `Apache-2.0` və ya `MIT OR GPL-3.0-only`).

### `verification`

Doğrulama `source.commit`-ə tətbiq olunur. Dörd tələb olunan xassəsi olan obyekt:

| Xassə                | Növ             | Qaydalar                                                 |
| -------------------- | --------------- | -------------------------------------------------------- |
| `status`             | enum            | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string          | Yoxlamanın `date-time` formatlı vaxt damğası             |
| `repositoryIdentity` | const           | `resolved` olmalıdır                                     |
| `smokeTest`          | object və ya null | Tüstü-sınağı qeydi və ya uyğun sınaq olmadıqda `null`  |

Mövcud olduqda, `smokeTest` tələb edir:

| Xassə           | Növ    | Qaydalar                                                                  |
| --------------- | ------ | ------------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — dəyişkən dəyərləri dublikatlaşdırmadan `package`-a və ya sabitlənmiş mənbəyə istinad edir |
| `check`         | object | Tələb olunan `name` (paket adı forması) və `version` (dəqiq versiya forması) |
| `result`        | const  | `passed` — uğursuz tüstü-sınağı tüstü-sınağı kimi qeyd edilmir            |

Şərti qayda: `status: verified` null olmayan `smokeTest` obyektini **tələb edir**. Baxıla bilən
tüstü-sınağı sübutu olmayan qeydlər `status: eligible` və `smokeTest: null` istifadə edir.
Heç bir status təsdiq və ya təhlükəsizlik sertifikatı deyil — bax
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

İctimai mənşə keçidləri; hər biri URI və ya `null`:

| Xassə        | Növ              | Qaydalar                                         |
| ------------ | ---------------- | ------------------------------------------------ |
| `discussion` | string və ya null | Mövcud olduqda ictimai Discussion URL-i          |
| `comment`    | string və ya null | Mövcud olduqda ictimai şərh URL-i                |

## Sxemin yoxlamadığı şeylər

Sxem qəsdən yerli və strukturaldır. O, repozitoriyanın mövcud olduğunu, node ID-nin URL-ə
uyğun gəldiyini, sübut yollarının sabitlənmiş commit-də mövcud olduğunu, ulduz sayının dəqiq
olduğunu və ya yaradıcının mənbəyə sahib olduğunu yoxla**mır**. Bu yoxlamalar
[CONTRIBUTING.md](../../CONTRIBUTING.md) və [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)
sənədlərində təsvir edilən baxıcı baxış qapılarına aiddir.

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
