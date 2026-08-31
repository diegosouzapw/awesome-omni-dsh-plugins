# Katalog Kaydı Şema Referansı

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Türkçe**

> **Resmi olmayan bir topluluk projesidir. DeepSeek ile bağlantılı, DeepSeek tarafından onaylanmış veya desteklenmiş değildir.**
> DeepSeek adları ve markaları kendi sahiplerine aittir.

Bu, `catalog/plugins/` altındaki her dosyanın karşılaması gereken genel JSON Şeması (taslak
2020-12) olan [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) için alan alan
referanstır. Şema dosyasının kendisi gerçek kaynaktır; bu sayfa ile şema çeliştiğinde, şema
kazanır.

İki doğrulama katmanı uygulanır. Genel şema, sınırlı *güvenli şekilleri* zorunlu kılar (seçenek
benzeri veya sınırsız değerleri reddeden desenler ve uzunluklar). Bunun üzerine, `catalog
validate`, zorunlu semantik ayrıştırıcılar uygular: sürümler için tam SemVer, bütünlük
değerleri için SHA-512 SRI, lisanslar için SPDX ifade ayrıştırması ve yinelenen anahtar reddi.
Bir değer şema desenine uyabilir ve yine de semantik olarak reddedilebilir.

Üst düzey kurallar: girdi tek bir YAML nesnesidir, `additionalProperties: false`
(bilinmeyen alanlar reddedilir) ve aşağıdaki alanların tümü zorunludur — tek isteğe bağlı alan
olan `media` hariç.

## Üst düzey alanlar

| Alan             | Tür    | Zorunlu | Özet                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   evet    | Tam olarak `1` olmalıdır                                           |
| `id`              | string  |   evet    | Küçük harfli kebab-case kayıt kimliği; dosya adıyla eşleşmelidir        |
| `name`            | string  |   evet    | Görüntü adı, 1–120 karakter                                |
| `description`     | object  |   evet    | Özenle hazırlanmış İngilizce özet artı kanıt yolu                |
| `unofficial`      | const   |   evet    | Tam olarak `true` olmalıdır                                        |
| `kind`            | enum    |   evet    | Kanonik yapı ayırt edicisi                              |
| `primaryCategory` | enum    |   evet    | Tek birincil yetenek kategorisi                            |
| `tags`            | array   |   evet    | Benzersiz küçük harfli kebab-case etiketler (boş olabilir)               |
| `source`          | object  |   evet    | Özgün depo, düğüm kimliği, alt yol ve sabitlenmiş commit       |
| `creator`         | object  |   evet    | Üreticinin genel GitHub kullanıcı adı                                |
| `package`         | object  |   evet    | Kanonik kurulum tanımlayıcısı (npm **veya** kaynak)            |
| `dsh`             | object  |   evet    | DSH profilleri ve yerel entegrasyon kanıt yolu             |
| `repositoryScope` | enum    |   evet    | `dedicated` veya `monorepo`                                     |
| `popularity`      | object  |   evet    | Yıldız politikası ve yıldız sayısı (kapsama bağlı)            |
| `license`         | object  |   evet    | Üst kaynak SPDX lisans ifadesi                                     |
| `verification`    | object  |   evet    | Doğrulama durumu, kontrol zamanı, kimlik ve smoke test      |
| `provenance`      | object  |   evet    | Genel Discussion/yorum URL'leri veya `null`                      |
| `media`           | array   |    hayır    | En fazla 6 ekran görüntüsü/video, her URL `source.commit`e sabitlenir |

### `schemaVersion`

Sabit `1`. Genel şema sürüm 1'i tanımlar; başka herhangi bir değer geçersizdir.

### `id`

`^[a-z0-9]+(?:-[a-z0-9]+)*$` ile eşleşen dize — küçük harfli kebab-case, baştaki/sondaki veya
çift tire yok. [CONTRIBUTING.md](../../CONTRIBUTING.md) belgesine göre, kayıt dosyası aynı
değerle `catalog/plugins/<id>.yaml` olarak adlandırılmalıdır; doğrulayıcı bir uyuşmazlığı
reddeder (`id-filename-mismatch`). Kimlik ayrıca üreticinin ad alanıyla (namespace) başlamalıdır:
küçük harfe çevrilmiş `creator.github` kullanıcı adı — `[a-z0-9]` dışındaki her karakter dizisi
tek bir `-`'ye daraltılır — ardından `-` gelir (`id-creator-prefix`).

### `name`

Serbest biçimli görüntü adı, `minLength: 1`, `maxLength: 120`.

### `description`

Tam olarak iki zorunlu özelliği olan nesne (başka hiçbiri izin verilmez):

| Özellik       | Tür   | Kurallar                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | İngilizce özet, 20–320 karakter                                    |
| `evidencePath` | string | Göreli depo yolu deseni; başında `/` yok, ters eğik çizgi yok, `.`/`..` segmenti yok |

İngilizce özet, `source.commit`'te var olduğu haliyle `evidencePath`'teki dosyadan özenle
hazırlanmalıdır — başka bir katalogdan kopyalanmamalıdır.

### `unofficial`

Sabit `true`. Kaydın resmi olmadığını gösteren makine tarafından okunabilir işaret.

### `kind`

**Tek** yapı türü ayırt edicisi (ikinci bir entegrasyon türü alanı yoktur). Şunlardan biri:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Anlamları ve sıralama sonuçları [docs/CATEGORIES.md](CATEGORIES.md) içinde tanımlanmıştır.

### `primaryCategory`

On dört yetenek kategorisinden biri:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Görüntü etiketleri ve seçim rehberliği [docs/CATEGORIES.md](CATEGORIES.md) içindedir.

### `tags`

Her biri `^[a-z0-9]+(?:-[a-z0-9]+)*$` ile eşleşen (küçük harfli kebab-case) benzersiz dizelerden
oluşan dizi. Şema tarafından minimum sayı zorunlu kılınmaz.

### `source`

Tam olarak dört zorunlu özelliği olan nesne:

| Özellik           | Tür           | Kurallar                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` URL'si; sahip GitHub kullanıcı adı kurallarını izler, depo adı 1–100 karakter, `.`/`..` olamaz veya `.git` ile bitemez |
| `repositoryNodeId` | string         | Değişmez GitHub depo düğüm kimliği, boş olamaz                         |
| `subpath`          | string veya null | Depo içindeki eklenti alt yolu (`evidencePath` ile aynı güvenli göreli yol deseni), veya depo köküne yerleşik bir eklenti için `null` |
| `commit`           | string         | Tam 40 karakterlik onaltılık commit OID'si                               |

Katalog doğrulaması `repositoryNodeId`'yi çözmeli ve bir depo URL uyuşmazlığını reddetmelidir —
bu çözümleme, yerel yapısal denetimin bir parçası değil, sürdürücü tarafı bir kapıdır.

### `creator`

Tek bir zorunlu özelliği olan nesne:

| Özellik | Tür   | Kurallar                                             |
| -------- | ------ | -------------------------------------------------- |
| `github` | string | GitHub kullanıcı adı (1–39 karakter, GitHub kullanıcı adı kuralları) |

Genel profil URL'si her zaman `https://github.com/<handle>` olarak türetilir; ikinci bir profil
alanı saklanmaz, bu nedenle ikisi asla birbirinden ayrışamaz.

### `package`

Kanonik kurulum tanımlayıcısı. Verilerdir, asla bir kabuk (shell) komutu değildir ve tam olarak
iki şekilden birini alır (`oneOf`):

**npm paketi** — zorunlu `ecosystem`, `name`, `version`; isteğe bağlı `integrity`:

| Özellik    | Tür  | Kurallar                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm paket adı şekli (isteğe bağlı olarak kapsamlı), en fazla 214 karakter                 |
| `version`   | string | Tam `x.y.z` sürüm şekli (isteğe bağlı ön sürüm/derleme); aralıklar reddedilir. Semantik katman ayrıca ayrıştırılabilir, tam bir SemVer gerektirir |
| `integrity` | string | İsteğe bağlı `sha512-…` SRI şekli, 8–256 karakter. Semantik katman bunu geçerli SHA-512 SRI olarak ayrıştırmalıdır |

**kaynak kurulumu** — yalnızca zorunlu `ecosystem`:

| Özellik    | Tür  | Kurallar    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Bir kaynak tanımlayıcısı kasıtlı olarak başka hiçbir şey saklamaz: depo, commit ve alt yol
`source`'tan türetilir, bu nedenle değişken değerler asla tekrarlanmaz.

### `dsh`

Yerel DSH entegrasyon kanıtı:

| Özellik       | Tür   | Kurallar                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | `^[A-Za-z0-9][A-Za-z0-9._-]*$` ile eşleşen en az bir benzersiz profil adı |
| `evidencePath` | string | `source.commit`'teki DSH entegrasyon kanıtına güvenli göreli yol |

### `repositoryScope`

Ya `dedicated` (depo yıldızları tam olarak bu eklentiye ait) ya da `monorepo` (eklenti daha
geniş bir projenin içinde bir alt yol veya paket). Bu değer, aşağıdaki koşullu popülerlik
kurallarını yönlendirir.

### `popularity`

| Özellik     | Tür            | Kurallar                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` veya `undefined-parent-repository`  |
| `stars`      | integer veya null | Negatif olmayan tam sayı, veya `null`                      |

Koşullu kurallar (şemanın `allOf` bloklarıyla zorunlu kılınır):

- `repositoryScope: monorepo`, `starsPolicy: undefined-parent-repository` ve `stars: null`'ı
  **zorunlu kılar**. Üst proje yıldızları asla bir monorepo eklentisine atfedilmez.
- `repositoryScope: dedicated`, `starsPolicy: exact-repository` ve bir tam sayı
  `stars >= 0`'ı **zorunlu kılar**.

Bu değerlerin sıralama koşulunu nasıl beslediği için bkz. [docs/RANKING.md](RANKING.md).

### `license`

| Özellik | Tür   | Kurallar                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | SPDX ifade şekli, 2–256 karakter, başında tire yok          |

Şema yalnızca güvenli bir karakter şeklini zorunlu kılar; katalog doğrulaması değeri gerçek bir
SPDX ifade ayrıştırıcısıyla ayrıştırmalı ve normalleştirmelidir. Sabitlenmiş commit'te kanıtlanan
tam üst kaynak ifadeyi kaydedin (örneğin `Apache-2.0` veya `MIT OR GPL-3.0-only`).

### `verification`

Doğrulama, `source.commit`'e uygulanır. Dört zorunlu özelliği olan nesne:

| Özellik             | Tür           | Kurallar                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Denetimin `date-time` biçimli zaman damgası           |
| `repositoryIdentity` | const          | `resolved` olmalıdır                                     |
| `smokeTest`          | object veya null | Smoke-test kaydı, veya uygun bir test mevcut olmadığında `null` |

Mevcut olduğunda, `smokeTest` şunu gerektirir:

| Özellik        | Tür   | Kurallar                                                             |
| --------------- | ------ | ------------------------------------------------------------------ |
| `installTarget` | const  | `canonical-install-descriptor` — değişken değerleri tekrarlamadan `package`'a veya sabitlenmiş kaynağa referans verir |
| `check`         | object | Zorunlu `name` (paket adı şekli) ve `version` (tam sürüm şekli)      |
| `result`        | const  | `passed` — başarısız bir smoke test, bir smoke test olarak kaydedilmez    |

Koşullu kural: `status: verified`, null olmayan bir `smokeTest` nesnesi **gerektirir**.
İncelenebilir smoke kanıtı olmayan kayıtlar `status: eligible` ve `smokeTest: null` kullanır.
Hiçbir durum bir onay veya güvenlik sertifikası değildir — bkz. [docs/RANKING.md](RANKING.md).

### `provenance`

Her biri bir URI veya `null` olan genel köken bağlantıları:

| Özellik     | Tür          | Kurallar                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string veya null | Bir tane var olduğunda genel Discussion URL'si            |
| `comment`    | string veya null | Bir tane var olduğunda genel yorum URL'si            |

### `media`

Tek isteğe bağlı alan. En fazla **6** öğeden oluşan bir dizi; her öğe eklentinin bir ekran görüntüsünü veya kısa bir videosunu tanımlar:

| Özellik | Tür | Kurallar |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` veya `video` |
| `url`    | string | Değişmez GitHub URL'si, en fazla 2048 karakter (aşağıya bakın) |
| `alt`    | string | Alternatif metin, 1–120 karakter |

Buradaki URL, `source.commit` kadar değişmez olmalıdır. Dal adı taşıyan bir
`raw.githubusercontent.com` yolu (`.../main/docs/shot.png`) o dalın bugün içerdiğini gösterir;
yani dal hareket ettiği gün girdi, incelenmemiş bir görseli yayımlamış olur. İki biçim kabul
edilir:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — commit'e sabitlenmiş raw yolu;
- `https://github.com/<owner>/<repo>/assets/…` — GitHub'ın içerik adresli yükleme URL'si, `video` öğeleri için.

Şema yalnızca güvenli biçimi zorunlu kılar (ana makine, 40 karakterlik onaltılık başvuru,
sınırlı uzunluk). Gerisini `catalog validate` anlamsal olarak zorunlu kılar: URL, **girdinin
kendi** deposunda **girdinin kendi** `source.commit`ine sabitlenmelidir ve bir dal URL'si
`media[n].url must pin the entry commit, not a branch` ile reddedilir.

Gösterilecek bir şey yoksa alanı tamamen atlayın — `media: []`, "ekran görüntüsü yok" demenin
geçerli bir yolu değildir. Alan eklemelidir: o var olmadan önce yayımlanmış girdiler geçerli
kalır ve alanı yok sayan bir tüketici her girdiyi tam olarak eskisi gibi okur.

## `kind: skill` girdileri

Şema sürüm 1, `kind: skill` için ikinci, kendi başına yeterli bir girdi sözleşmesi de tanımlar;
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) olarak yayımlanmıştır (SKL-01
faz 0). Yukarıdaki eklenti şemasına asla dokunmaz: `kind: plugin` girdileri tam olarak eskisi
gibi doğrulanmaya devam eder ve skill şema dosyası, eklenti şemasının eklenti girdileri için
olduğu gibi, skill girdileri için doğruluk kaynağıdır.

Bir skill kurulmaz, harness tarafından **yüklenir**; bu yüzden yalnızca eklentiye özgü kurulum
tanımlayıcıları (`package`, `dsh`) bir skill girdisinde yoktur ve yerlerini `usage` + `compat`
alır. Bir skill ayrıca sıkça, çok sayıda skill barındıran bir deponun alt dizininde yaşar; bu
yüzden kimlik ve yinelenme ayıklama, tek başına depo yerine `source.repository` +
`source.subpath` ikilisidir. Bir skill girdisi `media` galerisi kabul etmez: skill, harness'ın
yüklediği metindir, dolayısıyla ekran görüntüsü alınacak bir şey yoktur (bunu zorunlu kılan
`additionalProperties: false`'tur).

Şu alanlar, yukarıda eklenti girdileri için belgelenen şekil ve kuralları tam olarak korur:
`schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Tek isteğe bağlı skill alanı
olan `triggers` dışında her alan zorunludur.

### Skill'e özgü alanlar

| Alan                 | Tür    | Zorunlu | Kurallar                                                    |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   evet    | Tam olarak `skill` olmalıdır                                |
| `skillScope`         | enum   |   evet    | `repository` (tüm depo skill'in **kendisidir**) veya `subdirectory` (skill `source.subpath` konumunda yaşar) |
| `triggers`           | array  |   hayır    | Skill'in ne zaman tetiklendiği — kullanıcının onu yüklemeden önce değerlendirdiği metin. En az 1 benzersiz dize, her biri 3–200 karakter; hiç yoksa alanı tamamen atlayın (`triggers: []` geçersizdir) |
| `usage.load`         | string |   evet    | Harness'ın skill'i nasıl yüklediği, 1–200 karakter; bir skill yüklenir, asla kurulmaz |
| `usage.evidencePath` | string |   evet    | `source.commit`teki yükleme kanıtına giden güvenli göreli yol (`description.evidencePath` ile aynı desen) |
| `compat.harnessMin`  | string |   evet    | Skill'in doğrulandığı en düşük harness sürümü; tam `x.y.z` şekli (isteğe bağlı prerelease/build), en fazla 64 karakter. Anlamsal katman ayrıca ayrıştırılabilir, tam bir SemVer gerektirir |

Koşullu kurallar (skill şemasının `allOf` blokları tarafından zorunlu kılınır):

- `skillScope: subdirectory`, `source.subpath`in güvenli bir göreli yol dizesi olmasını
  **zorlar** — bir alt dizinde barındırılan skill o alt dizini sabitlemek zorundadır.
- `skillScope: repository`, `source.subpath: null` olmasını **zorlar** — tüm depoyu kapsayan
  bir skill alt yol bildirmemelidir.

`verification`, eklenti şeklini korur (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), ancak `smokeTest` tam olarak `null` olmalıdır: bir skill'in kurulum smoke
test'i yoktur ve kabul kapısı içerik incelemesidir. Skill şeması, `status: verified` →
`smokeTest` koşulunu ve `repositoryScope` → `popularity` koşullarını taşımaz; bu bağlantılar
yalnızca eklenti şeması kurallarıdır.

### Skill'ler için anlamsal katman

Şemanın üzerine, katalog doğrulaması, alanların var olduğu yerlerde eklentilerle aynı zorunlu
anlamsal ayrıştırıcıları uygular: `license.spdx` geçerli bir SPDX ifadesi olarak
ayrıştırılmalıdır (`invalid-spdx`) ve `compat.harnessMin` tam bir SemVer olmalıdır
(`invalid-semver`). `invalid-sri` durumu yoktur — bir skill'in `package.integrity`si yoktur.

### Skill kimliği ve yinelenme ayıklama

Bir skill'in kanonik anahtarı `skill:<source.repositoryNodeId>:<normalized subpath>`tır. Alt
yol yalnızca kimlik amaçlı normalize edilir: ters eğik çizgiler `/` olur, boş ve `.`
parçaları atılır ve boş bir sonuç (veya `subpath: null`) `.` olur — yani tüm depo. NUL bayt
veya `..` parçaları içeren bir alt yol reddedilir, asla "temizlenmez". Aynı deponun iki
skill'i iki girdidir; aynı depo + alt yolun iki kez geçmesi ise bir çakışmadır.

### Asgari skill örneği

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## Şemanın denetlemediği

Şema kasıtlı olarak yerel ve yapısaldır. Deponun var olduğunu, düğüm kimliğinin URL ile
eşleştiğini, kanıt yollarının sabitlenmiş commit'te var olduğunu, yıldız sayısının doğru
olduğunu veya üreticinin kaynağa sahip olduğunu **doğrulamaz**. Bu denetimler,
[CONTRIBUTING.md](../../CONTRIBUTING.md) ve [docs/GOVERNANCE.md](GOVERNANCE.md) içinde
açıklanan sürdürücü inceleme kapılarına aittir.

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
