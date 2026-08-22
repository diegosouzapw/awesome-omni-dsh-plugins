# CLI istinadı — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Azərbaycan dili**

> **Qeyri-rəsmi icma layihəsi. DeepSeek ilə əlaqəli deyil, DeepSeek tərəfindən dəstəklənmir və ya sponsorluq edilmir.**
> DeepSeek adları və nişanları müvafiq sahiblərinə məxsusdur.

Bu səhifə dərc edilmiş CLI-ni `1.0.1` versiyasında dəqiq olaraq davrandığı kimi sənədləşdirir.
Aşağıdakı hər sinopsis və bayraq dərc edilmiş əmrin öz `--help` çıxışından götürülüb; burada
heç nə buraxılmamış davranışı təsvir etmir. CLI bu repozitoriyada [`cli/`](../../cli) altında
inkişaf etdirilir və npm-də [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins)
kimi buraxılır; provenance attestasiyası hər build-i onu yaradan commit-ə və workflow
işləməsinə bağlayır.

```bash
npx omni-dsh-plugins --help
```

## v1.0.1-də dizayn prinsipləri

- **Susmaya görə yalnız-oxu.** `catalog`, `search`, `info`, `list` və `doctor` heç vaxt
  profilləri dəyişdirmir, fayl yazmır və əlavə kodunu işə salmır.
- **Kod icrası üçün razılıq qapısı.** `add`, `update` və `remove` `--allow-code-execution`
  bayrağını ötürmədiyiniz müddətdə DSH/pnpm həyat dövrü kodunu icra etməkdən imtina edir. Onsuz
  doğrulanmış planı görmək üçün `--dry-run` istifadə edin.
- **Yerli Windows siyasəti.** Kod icrası ilə yerli Windows `add`/`update`/`remove` v1.0.1-də
  deaktiv edilib; WSL istifadə edin. Dry-run və yalnız-oxu əmrlər əlçatan qalır və yerli Windows
  bərpa markerləri sənədləşdirilmiş əl ilə bərpanı tələb edir.
- **Sabitlənmiş girişlər.** Kataloq girişi yerli qovluq, snapshot faylı və ya sabitlənmiş ictimai
  snapshot URL-i ola bilər, istəyə bağlı olaraq dəqiq 40 simvollu revizyona kilidlənə bilər.

## Ümumi seçimlər

Bu seçimlər kataloqu istehlak edən əmrlərdə görünür (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Seçim                     | Məna                                                                 |
| ------------------------- | -------------------------------------------------------------------- |
| `--catalog <path-or-url>` | Yerli kataloq qovluğu, snapshot faylı və ya sabitlənmiş ictimai snapshot URL-i |
| `--revision <sha>`        | Dəqiq 40 simvollu snapshot revizyası                                 |
| `--json`                  | Sabit JSON çıxışı verir                                              |

Qlobal seçimlər: `-V, --version` CLI versiyasını çap edir; `-h, --help` istənilən əmr üçün
yardımı çap edir (`dsh-plugins help [command]` da işləyir).

## Çıxış kodları

CLI şərti proses çıxış kodlarından istifadə edir:

| Çıxış kodu | Məna                                                                             |
| ---------: | -------------------------------------------------------------------------------- |
| `0`        | Uğur (boş kataloq kimi "boş, amma etibarlı" nəticələr də daxil olmaqla)          |
| `1`        | Uğursuzluq: doğrulama xətası, qeyd tapılmadı, tələb olunan seçim çatışmır və ya xəta bildirən diaqnostik yoxlama |

v1.0.1 ilə müşahidə edilən nümunələr: etibarlı boş kataloq üzərində `catalog validate`
`0 entries valid; catalog is empty` mesajı ilə `0` çıxır; `info <unknown-id>` `Plugin not found`
mesajı ilə `1` çıxır; `doctor` hər hansı yoxlama (məsələn, çatışmayan `dsh` icra faylı) xəta
bildirdikdə `1` çıxır.

## Əmrlər

### `catalog` — ictimai kataloq səthlərini doğrulayır

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — kataloq YAML-ını və semantikanı doğrulayır: təhlükəsiz YAML
  parser-ləmə, ictimai sxem, SPDX ifadə parser-ləməsi, dəqiq SemVer, SHA-512 SRI və təkrarlanan
  ID / repozitoriya-node-üstəgəl-alt-yol rəddi. Yerli və yalnız-oxudur: GitHub ilə əlaqə
  saxlamır, repozitoriya kimliyini həll etmir və sabitlənmiş commit-də sübutları yoxlamır. Bu,
  `catalog-validation` CI işinin hər kataloq pull request-ində icra etdiyi dəqiq əmrdir.
- **`catalog docs-check [root]`** — tələb olunan ictimai kataloq sənədləşməsinin mövcud
  olduğunu və Markdown fence-lərinin balanslaşdırıldığını yoxlayır.
- **`catalog github-forms-check [root]`** — strukturlaşdırılmış ictimai GitHub issue formalarını
  (iddia, düzəliş, silinmə) yoxlayır.

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — ictimai kataloq sahələrini yerli olaraq axtarır

```text
dsh-plugins search [options] <query...>
```

Seçilmiş kataloq girişinə qarşı ictimai kataloq sahələrini yerli olaraq axtarır. Uyğun gələn
qeydləri çap edir; heç nə uyğun gəlmədikdə `No plugins found.` (çıxış `0`).

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — kataloqdan kənarda əlavələr tapır

```text
dsh-plugins discover [options] <query...>
```

> `discover` `1.0.0`-da göndərilir — bu paket adı altında ilk buraxılışda.

Əvvəlcə kurasiya edilmiş kataloqu axtarır, sonra — `--offline` verilməyibsə — canlı GitHub
`dsh-plugin` mövzusunu, beləliklə hələ təqdim edilməmiş əlavə də tapıla bilir. Kataloq
nəticələri kataloqun saxladığı sübutları daşıyır (sabitlənmiş commit, yaradıcı, lisenziya);
icma nəticələri bunların heç birini daşımır və belə etiketlənir, çünki onlar haqqında heç nə
nəzərdən keçirilməyib.

`--limit <n>` nəticələri pillə üzrə məhdudlaşdırır (susmaya görə `8`). `--json` heç vaxt
lokallaşdırılmayan sabit maşın formasını verir.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — bir ictimai kataloq qeydini göstərir

```text
dsh-plugins info [options] <id>
```

Kanonik əlavə ID-si ilə bir ictimai kataloq qeydini göstərir. ID kataloqda olmadıqda
`Plugin not found: <id>` mesajı ilə `1` çıxır.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — rəsmi DSH nümayəndəliyi vasitəsilə bir kataloq əlavəsini quraşdırır

```text
dsh-plugins add [options] <id>
```

| Seçim                                  | Məna                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| `--profile <name>`                     | Dəyişdiriləcək DSH profili (praktikada tələb olunur; əmr onsuz xəta verir) |
| `--dry-run`                            | Fayl və alt-proses olmadan doğrulanmış planı göstərir                |
| `--allow-code-execution`               | DSH/pnpm həyat dövrü koduna razılıq (yerli Windows deaktivdur; WSL istifadə edin) |
| `--catalog` / `--revision` / `--json`  | Yuxarıdakı ümumi seçimlər                                            |

Bu versiyada dry-run semantikası: əmr sabitlənmiş qeyd üçün planı həll və doğrulayır və onu çap
edir — heç bir fayl yaratmır, heç bir alt-proses işə salmır. Həqiqi quraşdırma rəsmi DSH
alətlərinə nümayəndəlik verir və yalnız `--allow-code-execution` ilə davam edir.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — rəsmi DSH nümayəndəliyi vasitəsilə bir kataloq əlavəsini yeniləyir

```text
dsh-plugins update [options] <id>
```

`add` ilə eyni seçimlər və razılıq semantikası: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, üstəgəl ümumi kataloq seçimləri.

### `remove` — rəsmi DSH nümayəndəliyi vasitəsilə kataloq tərəfindən idarə olunan bir əlavəni silir

```text
dsh-plugins remove [options] <id>
```

`add` ilə eyni seçimlər və razılıq semantikası. Yalnız kataloq tərəfindən idarə olunan
quraşdırmalar silinir.

### `recover` — saxlanılmış POSIX mutasiyasını bərpa edir

```text
dsh-plugins recover
```

Kəsilmiş `add`/`update`/`remove`-dan sonra saxlanılmış POSIX mutasiyasını bərpa edir. Gözləyən
heç nə olmadıqda `No mutation recovery is pending.` çap edir və `0` çıxır. Yerli Windows bərpası
sənədləşdirilmiş siyasətə uyğun olaraq əl ilə qalır.

### `list` — kataloq tərəfindən idarə olunan quraşdırmaları sadalayır

```text
dsh-plugins list [--profile <name>] [--json]
```

Profilləri dəyişdirmədən kataloq tərəfindən idarə olunan quraşdırmaları sadalayır.
`--profile <name>` DSH profilinə görə filtr edir. Quraşdırma olmadıqda
`No catalog-managed plugins installed.` çap edir və `0` çıxır.

### `doctor` — yalnız-oxu diaqnostika

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Yalnız-oxu Node, DSH, yerli Windows siyasəti və kataloq diaqnostikasını icra edir. Hər yoxlama
`ok` və ya `error` bildirir; istənilən `error` ümumi çıxış kodunu `1` edir. `dsh` icra faylı
olmayan maşında nümunə çıxış:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Yerli doğrulamanın sübut etmədiyi şeylər

Yaşıl `catalog validate` işləməsi yalnız struktur və yerli semantikanı təsdiqləyir. O, uzaq
repozitoriya kimliyini, yaradıcı sahibliyini və sabitlənmiş commit-də sübutu isbat etmir —
baxıcılar hər birləşdirmədən əvvəl bu ayrıca mənşə qapılarını tətbiq edir, necə ki
[CONTRIBUTING.md](../../CONTRIBUTING.md) və [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)
sənədlərində təsvir edilib.

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
