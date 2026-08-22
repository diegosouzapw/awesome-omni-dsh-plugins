# CLI Referansı — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Türkçe**

> **Resmi olmayan bir topluluk projesidir. DeepSeek ile bağlantılı, DeepSeek tarafından onaylanmış veya desteklenmiş değildir.**
> DeepSeek adları ve markaları kendi sahiplerine aittir.

Bu sayfa, yayımlanmış CLI'nin `1.0.1` sürümünde tam olarak nasıl davrandığını belgeler. Aşağıdaki
her komut özeti ve bayrak, yayımlanmış komutun kendi `--help` çıktısından gelir; burada
yayımlanmamış hiçbir davranış açıklanmaz. CLI bu depoda [`cli/`](../../cli) altında geliştirilir
ve her derlemeyi onu üreten commit ile iş akışı çalıştırmasına bağlayan bir köken (provenance)
kanıtı ile [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) olarak npm'e
yayımlanır.

```bash
npx omni-dsh-plugins --help
```

## v1.0.1'deki tasarım ilkeleri

- **Varsayılan olarak salt okunur.** `catalog`, `search`, `info`, `list` ve `doctor` profilleri
  asla değiştirmez, dosya yazmaz veya eklenti kodu çalıştırmaz.
- **Kod çalıştırma için onay kapısı.** `add`, `update` ve `remove`, siz
  `--allow-code-execution` bayrağını geçirmediğiniz sürece DSH/pnpm yaşam döngüsü kodunu
  çalıştırmayı reddeder. Bu olmadan, doğrulanmış planı görmek için `--dry-run` kullanın.
- **Yerel Windows politikası.** Kod çalıştırmalı yerel Windows `add`/`update`/`remove`, v1.0.1'de
  devre dışıdır; WSL kullanın. Deneme çalıştırması (dry-run) ve salt okunur komutlar kullanılabilir
  kalır, yerel Windows kurtarma işaretleri ise belgelenmiş manuel kurtarma gerektirir.
- **Sabitlenmiş girdiler.** Katalog girdisi yerel bir dizin, bir anlık görüntü (snapshot) dosyası
  veya isteğe bağlı olarak tam 40 karakterlik bir revizyona kilitlenmiş, sabitlenmiş genel bir
  anlık görüntü URL'si olabilir.

## Ortak seçenekler

Bu seçenekler, katalogu tüketen komutlarda görünür (`catalog validate`, `search`, `info`, `add`,
`update`, `remove`, `doctor`):

| Seçenek                    | Anlamı                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Yerel katalog dizini, anlık görüntü dosyası veya sabitlenmiş genel anlık görüntü URL'si |
| `--revision <sha>`        | Tam 40 karakterlik anlık görüntü revizyonu                               |
| `--json`                  | Kararlı JSON çıktısı üretir                                            |

Genel seçenekler: `-V, --version` CLI sürümünü yazdırır; `-h, --help` herhangi bir komut için
yardım yazdırır (`dsh-plugins help [command]` de çalışır).

## Çıkış kodları

CLI, geleneksel işlem çıkış kodlarını kullanır:

| Çıkış kodu | Anlamı                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Başarı (boş bir katalog gibi "boş ama geçerli" sonuçlar dahil)     |
| `1`       | Başarısızlık: doğrulama hatası, kayıt bulunamadı, gerekli seçenek eksik veya bir tanılama denetimi hata bildiriyor |

v1.0.1 ile gözlemlenen örnekler: geçerli boş bir katalogda `catalog validate`,
`0 entries valid; catalog is empty` ile `0` çıkışı yapar; `info <bilinmeyen-kimlik>`,
`Plugin not found` ile `1` çıkışı yapar; herhangi bir denetim (eksik bir `dsh` yürütülebilir
dosyası gibi) hata bildirdiğinde `doctor`, `1` çıkışı yapar.

## Komutlar

### `catalog` — genel katalog yüzeylerini doğrular

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — katalog YAML'ını ve semantiğini doğrular: güvenli YAML ayrıştırması,
  genel şema, SPDX ifade ayrıştırması, tam SemVer, SHA-512 SRI ve yinelenen kimlik /
  depo-düğüm-artı-alt-yol reddi. Yerel ve salt okunurdur: GitHub'a bağlanmaz, depo kimliğini
  çözmez veya sabitlenmiş commit'teki kanıtı incelemez. Bu, `catalog-validation` CI görevinin
  her katalog pull request'inde çalıştırdığı tam komuttur.
- **`catalog docs-check [root]`** — gerekli genel katalog belgelerinin var olduğunu ve Markdown
  çitlerinin (fences) dengeli olduğunu denetler.
- **`catalog github-forms-check [root]`** — yapılandırılmış genel GitHub issue formlarını
  (talep, düzeltme, kaldırma) denetler.

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — genel katalog alanlarında yerel olarak arama yapar

```text
dsh-plugins search [options] <query...>
```

Seçilen katalog girdisine karşı genel katalog alanlarında yerel olarak arama yapar. Eşleşen
kayıtları veya hiçbir şey eşleşmediğinde `No plugins found.` (çıkış `0`) yazdırır.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — katalogun ötesindeki eklentileri bulur

```text
dsh-plugins discover [options] <query...>
```

> `discover`, bu paket adı altındaki ilk sürüm olan `1.0.0` içinde gönderilir.

Önce özenle hazırlanmış (curated) kataloğu, ardından — `--offline` verilmediği sürece — canlı
GitHub `dsh-plugin` konusunu arar; böylece henüz gönderilmemiş bir eklenti de bulunabilir olur.
Katalog sonuçları, katalogun sahip olduğu kanıtı (sabitlenmiş commit, üretici, lisans) taşır;
topluluk sonuçları bunların hiçbirini taşımaz ve bu şekilde etiketlenir, çünkü haklarında hiçbir
şey incelenmemiştir.

`--limit <n>`, katman başına sonuçları sınırlar (varsayılan `8`). `--json`, asla yerelleştirilmeyen
kararlı makine şeklini üretir.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — tek bir genel katalog kaydını gösterir

```text
dsh-plugins info [options] <id>
```

Kanonik eklenti kimliğine göre tek bir genel katalog kaydını gösterir. Kimlik katalogda
bulunmadığında `Plugin not found: <id>` ile `1` çıkışı yapar.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — resmi DSH devretme mekanizması üzerinden bir katalog eklentisi ekler

```text
dsh-plugins add [options] <id>
```

| Seçenek                   | Anlamı                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Değiştirilecek DSH profili (pratikte gereklidir; komut bunsuz hata verir) |
| `--dry-run`              | Dosya veya alt süreç olmadan doğrulanmış planı gösterir               |
| `--allow-code-execution` | DSH/pnpm yaşam döngüsü koduna onay verir (yerel Windows'ta devre dışı; WSL kullanın) |
| `--catalog` / `--revision` / `--json` | Yukarıdaki ortak seçenekler                                  |

Bu sürümdeki dry-run anlambilimi: komut, sabitlenmiş kayıt için planı çözer, doğrular ve
yazdırır; hiçbir dosya oluşturmaz ve hiçbir alt süreç başlatmaz. Gerçek kurulum resmi DSH
araçlarına devredilir ve yalnızca `--allow-code-execution` ile devam eder.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — resmi DSH devretme mekanizması üzerinden bir katalog eklentisini günceller

```text
dsh-plugins update [options] <id>
```

`add` ile aynı seçenekler ve onay anlambilimi: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, artı ortak katalog seçenekleri.

### `remove` — resmi DSH devretme mekanizması üzerinden katalog tarafından yönetilen bir eklentiyi kaldırır

```text
dsh-plugins remove [options] <id>
```

`add` ile aynı seçenekler ve onay anlambilimi. Yalnızca katalog tarafından yönetilen kurulumlar
kaldırılır.

### `recover` — tutulan bir POSIX değişikliğini kurtarır

```text
dsh-plugins recover
```

Kesintiye uğramış bir `add`/`update`/`remove` sonrası tutulan bir POSIX değişikliğini kurtarır.
Bekleyen hiçbir şey olmadığında `No mutation recovery is pending.` yazdırır ve `0` çıkışı yapar.
Belgelenmiş politikaya göre, yerel Windows kurtarma işlemi manuel kalır.

### `list` — katalog tarafından yönetilen kurulumları listeler

```text
dsh-plugins list [--profile <name>] [--json]
```

Profilleri değiştirmeden katalog tarafından yönetilen kurulumları listeler. `--profile <name>`,
DSH profiline göre filtreler. Hiçbir kurulum yokken `No catalog-managed plugins installed.`
yazdırır ve `0` çıkışı yapar.

### `doctor` — salt okunur tanılama

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Salt okunur Node, DSH, yerel Windows politikası ve katalog tanılamalarını çalıştırır. Her
denetim `ok` veya `error` bildirir; herhangi bir `error`, genel çıkış kodunu `1` yapar. `dsh`
yürütülebilir dosyası olmayan bir makinedeki örnek çıktı:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Yerel doğrulamanın kanıtlamadığı

Yeşil bir `catalog validate` çalıştırması yalnızca yapıyı ve yerel semantiği doğrular. Uzak depo
kimliğini, üretici sahipliğini veya sabitlenmiş commit'teki kanıtı kanıtlamaz — sürdürücüler,
[CONTRIBUTING.md](../../CONTRIBUTING.md) ve [docs/GOVERNANCE.md](GOVERNANCE.md) içinde
açıklandığı gibi, herhangi bir birleştirmeden önce bu ayrı köken kapılarını uygular.

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
