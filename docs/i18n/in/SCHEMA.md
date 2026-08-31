# Referensi Skema Entri Katalog

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Bahasa Indonesia**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Ini adalah referensi bidang-demi-bidang untuk [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
JSON Schema publik (draft 2020-12) yang harus dipenuhi oleh setiap file di bawah
`catalog/plugins/`. File skema itu sendiri adalah sumber kebenaran; ketika halaman ini dan
skema tidak sesuai, skema yang menang.

Dua lapisan validasi berlaku. Skema publik memberlakukan *bentuk aman* yang dibatasi (pola dan
panjang yang menolak nilai yang menyerupai opsi atau tidak terbatas). Di atasnya,
`catalog validate` menerapkan parser semantik yang wajib: SemVer persis untuk versi, SHA-512
SRI untuk nilai integritas, parsing ekspresi SPDX untuk lisensi, dan penolakan kunci duplikat.
Sebuah nilai bisa cocok dengan pola skema namun tetap ditolak secara semantik.

शीर्ष-स्तरीय नियम: प्रविष्टि एक ही YAML ऑब्जेक्ट है, `additionalProperties: false`
(अज्ञात फ़ील्ड अस्वीकार किए जाते हैं), और नीचे दिए गए सभी फ़ील्ड आवश्यक हैं, सिवाय `media` के —
एकमात्र वैकल्पिक फ़ील्ड।

## Bidang tingkat atas

| Bidang            | Tipe    | Wajib | Ringkasan                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ya    | Harus persis `1`                                           |
| `id`              | string  |   ya    | ID entri kebab-case huruf kecil; harus cocok dengan nama file        |
| `name`            | string  |   ya    | Nama tampilan, 1–120 karakter                                |
| `description`     | object  |   ya    | Ringkasan berbahasa Inggris hasil kurasi beserta path buktinya                |
| `unofficial`      | const   |   ya    | Harus persis `true`                                        |
| `kind`            | enum    |   ya    | Diskriminator artefak kanonis                              |
| `primaryCategory` | enum    |   ya    | Satu kategori kapabilitas utama                            |
| `tags`            | array   |   ya    | Tag kebab-case huruf kecil yang unik (boleh kosong)               |
| `source`          | object  |   ya    | Repositori asli, node ID, subpath, dan commit yang dipatok       |
| `creator`         | object  |   ya    | Handle GitHub publik kreator                                |
| `package`         | object  |   ya    | Deskriptor instalasi kanonis (npm **atau** sumber)              |
| `dsh`             | object  |   ya    | Profil DSH dan path bukti integrasi native             |
| `repositoryScope` | enum    |   ya    | `dedicated` atau `monorepo`                                     |
| `popularity`      | object  |   ya    | Kebijakan bintang dan jumlah bintang (kondisional terhadap scope)            |
| `license`         | object  |   ya    | Ekspresi lisensi SPDX hulu                              |
| `verification`    | object  |   ya    | Status verifikasi, waktu pemeriksaan, identitas, dan smoke test      |
| `provenance`      | object  |   ya    | URL Discussion/komentar publik atau `null`                      |
| `media`           | array   |    tidak    | अधिकतम 6 स्क्रीनशॉट/वीडियो, हर URL `source.commit` पर पिन |

### `schemaVersion`

Konstanta `1`. Mengidentifikasi skema publik versi 1; nilai lain apa pun tidak valid.

### `id`

String yang cocok dengan `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case huruf kecil, tanpa tanda
hubung di awal/akhir atau ganda. Sesuai [CONTRIBUTING.md](../../CONTRIBUTING.md), file entri
harus dinamai `catalog/plugins/<id>.yaml` dengan nilai yang identik; validator menolak
ketidakcocokan (`id-filename-mismatch`). ID juga harus dimulai dengan namespace kreator:
handle `creator.github` dalam huruf kecil, dengan setiap rangkaian karakter di luar `[a-z0-9]`
diringkas menjadi satu `-`, diikuti `-` (`id-creator-prefix`).

### `name`

Nama tampilan bentuk bebas, `minLength: 1`, `maxLength: 120`.

### `description`

Objek dengan tepat dua properti wajib (yang lain tidak diizinkan):

| Properti       | Tipe   | Aturan                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Ringkasan berbahasa Inggris, 20–320 karakter                                    |
| `evidencePath` | string | Pola path repositori relatif; tanpa `/` di awal, tanpa backslash, tanpa segmen `.`/`..` |

Ringkasan berbahasa Inggris harus dikurasi dari file pada `evidencePath` sebagaimana adanya
pada `source.commit` — bukan disalin dari katalog lain.

### `unofficial`

Konstanta `true`. Penanda yang dapat dibaca mesin bahwa entri ini tidak resmi.

### `kind`

Diskriminator jenis artefak **satu-satunya** (tidak ada bidang integration-kind kedua). Salah
satu dari:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Arti dan konsekuensi peringkatnya didefinisikan di [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Salah satu dari empat belas kategori kapabilitas:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Label tampilan dan panduan pemilihannya ada di [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array string unik, masing-masing cocok dengan `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case huruf
kecil). Tidak ada jumlah minimum yang ditetapkan oleh skema.

### `source`

Objek dengan tepat empat properti wajib:

| Properti           | Tipe           | Aturan                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL `https://github.com/<owner>/<repo>`; owner mengikuti aturan username GitHub, nama repo 1–100 karakter, tidak boleh `.`/`..` atau berakhiran `.git` |
| `repositoryNodeId` | string         | Node ID repositori GitHub yang tidak dapat berubah, tidak boleh kosong                         |
| `subpath`          | string atau null | Subpath plugin di dalam repositori (pola path relatif aman yang sama seperti `evidencePath`), atau `null` untuk plugin di akar repositori |
| `commit`           | string         | OID commit heksadesimal 40 karakter penuh                               |

Validasi katalog harus menyelesaikan `repositoryNodeId` dan menolak ketidakcocokan URL
repositori — penyelesaian itu adalah gerbang di sisi maintainer, bukan bagian dari pemeriksaan
struktur lokal.

### `creator`

Objek dengan satu properti wajib:

| Properti | Tipe   | Aturan                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | Username GitHub (1–39 karakter, aturan handle GitHub) |

URL profil publik selalu diturunkan sebagai `https://github.com/<handle>`; tidak ada bidang
profil kedua yang disimpan, sehingga keduanya tidak pernah bisa berbeda.

### `package`

Deskriptor instalasi kanonis. Ia adalah data, tidak pernah perintah shell, dan mengambil tepat
satu dari dua bentuk (`oneOf`):

**paket npm** — wajib `ecosystem`, `name`, `version`; opsional `integrity`:

| Properti    | Tipe  | Aturan                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Bentuk nama paket npm (opsional dengan scope), maks 214 karakter                 |
| `version`   | string | Bentuk versi `x.y.z` persis (prarilis/build opsional); rentang ditolak. Lapisan semantik juga mewajibkan SemVer persis yang dapat di-parse |
| `integrity` | string | Bentuk SRI `sha512-…` opsional, 8–256 karakter. Lapisan semantik harus mem-parse-nya sebagai SHA-512 SRI yang valid |

**instalasi sumber** — hanya wajib `ecosystem`:

| Properti    | Tipe  | Aturan    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Deskriptor sumber sengaja tidak menyimpan apa pun selain itu: repositori, commit, dan subpath
diturunkan dari `source`, sehingga nilai yang dapat berubah tidak pernah diduplikasi.

### `dsh`

Bukti integrasi DSH native:

| Properti       | Tipe   | Aturan                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Minimal satu nama profil unik yang cocok dengan `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Path relatif aman ke bukti integrasi DSH pada `source.commit` |

### `repositoryScope`

Antara `dedicated` (bintang repositori milik plugin persis ini) atau `monorepo` (plugin adalah
subpath atau paket di dalam proyek yang lebih luas). Nilai ini menggerakkan aturan popularitas
kondisional di bawah.

### `popularity`

| Properti     | Tipe            | Aturan                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` atau `undefined-parent-repository`  |
| `stars`      | integer atau null | Bilangan bulat non-negatif, atau `null`                      |

Aturan kondisional (diberlakukan oleh blok `allOf` skema):

- `repositoryScope: monorepo` **memaksa** `starsPolicy: undefined-parent-repository` dan
  `stars: null`. Bintang proyek induk tidak pernah diatribusikan ke plugin monorepo.
- `repositoryScope: dedicated` **memaksa** `starsPolicy: exact-repository` dan `stars >= 0`
  bertipe integer.

Lihat [docs/RANKING.md](../../docs/RANKING.md) untuk bagaimana nilai-nilai ini memberi makan
predikat peringkat.

### `license`

| Properti | Tipe   | Aturan                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | Bentuk ekspresi SPDX, 2–256 karakter, tanpa tanda hubung di awal          |

Skema hanya memberlakukan bentuk karakter yang aman; validasi katalog harus mem-parse dan
menormalisasi nilainya dengan parser ekspresi SPDX sungguhan. Catat ekspresi hulu lengkap yang
dibuktikan pada commit yang dipatok (misalnya `Apache-2.0` atau `MIT OR GPL-3.0-only`).

### `verification`

Verifikasi berlaku untuk `source.commit`. Objek dengan empat properti wajib:

| Properti             | Tipe           | Aturan                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Timestamp berformat `date-time` dari pemeriksaan           |
| `repositoryIdentity` | const          | Harus `resolved`                                     |
| `smokeTest`          | object atau null | Rekaman smoke-test, atau `null` ketika tidak ada test yang memenuhi syarat |

Ketika ada, `smokeTest` mewajibkan:

| Properti        | Tipe   | Aturan                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — merujuk `package` atau sumber yang dipatok tanpa menduplikasi nilai yang dapat berubah |
| `check`         | object | Wajib `name` (bentuk nama paket) dan `version` (bentuk versi persis) |
| `result`        | const  | `passed` — smoke test yang gagal tidak dicatat sebagai smoke test    |

Aturan kondisional: `status: verified` **mewajibkan** objek `smokeTest` yang bukan null. Entri
tanpa bukti smoke yang dapat ditinjau menggunakan `status: eligible` dan `smokeTest: null`.
Tidak ada status yang merupakan dukungan atau sertifikasi keamanan — lihat
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Tautan provenance publik, masing-masing berupa URI atau `null`:

| Properti     | Tipe          | Aturan                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string atau null | URL Discussion publik jika ada            |
| `comment`    | string atau null | URL komentar publik jika ada               |

### `media`

एकमात्र वैकल्पिक फ़ील्ड। अधिकतम **6** आइटम की सूची, जिनमें से हर एक प्लगइन का एक स्क्रीनशॉट या एक छोटा वीडियो बताता है:

| गुण | प्रकार | नियम |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` या `video` |
| `url`    | string | अपरिवर्तनीय GitHub URL, अधिकतम 2048 अक्षर (नीचे देखें) |
| `alt`    | string | वैकल्पिक पाठ, 1–120 अक्षर |

यहाँ का URL उतना ही अपरिवर्तनीय होना चाहिए जितना `source.commit`। ब्रांच नाम वाला
`raw.githubusercontent.com` पथ (`.../main/docs/shot.png`) वही दिखाता है जो वह ब्रांच आज रखती है,
इसलिए जिस दिन ब्रांच आगे बढ़ेगी उस दिन प्रविष्टि एक बिना समीक्षा वाली छवि प्रकाशित कर देगी। केवल दो
रूप स्वीकार्य हैं:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — कमिट पर पिन किया गया raw पथ;
- `https://github.com/<owner>/<repo>/assets/…` — GitHub का सामग्री-आधारित अपलोड URL, `video` आइटम के लिए।

स्कीमा केवल सुरक्षित आकार लागू करती है (होस्ट, 40 अक्षरों का हेक्साडेसिमल संदर्भ, सीमित लंबाई)।
बाकी `catalog validate` अर्थ के स्तर पर लागू करता है: URL को **प्रविष्टि के अपने** रिपॉज़िटरी में
**प्रविष्टि के अपने** `source.commit` को पिन करना चाहिए, और ब्रांच URL को
`media[n].url must pin the entry commit, not a branch` के साथ अस्वीकार किया जाता है।

जब दिखाने के लिए कुछ न हो तो फ़ील्ड पूरी तरह छोड़ दें — `media: []` "कोई स्क्रीनशॉट नहीं" कहने का
मान्य तरीका नहीं है। यह फ़ील्ड योगात्मक है: इसके अस्तित्व से पहले प्रकाशित प्रविष्टियाँ मान्य रहती
हैं, और इसे अनदेखा करने वाला उपभोक्ता हर प्रविष्टि पहले जैसी ही पढ़ता है।

## Entri `kind: skill`

Skema versi 1 juga mendefinisikan kontrak entri kedua yang mandiri untuk `kind: skill`,
diterbitkan sebagai [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01
fase 0). Kontrak itu tidak pernah menyentuh skema plugin di atas: entri dengan `kind: plugin`
tetap tervalidasi persis seperti sebelumnya, dan file skema skill adalah sumber kebenaran
untuk entri skill sama seperti skema plugin untuk entri plugin.

Sebuah skill tidak diinstal, melainkan **dimuat** oleh harness, sehingga deskriptor instalasi
khusus plugin (`package`, `dsh`) tidak ada pada entri skill dan digantikan oleh `usage` +
`compat`. Skill juga sering berada di subdirektori dari sebuah repositori yang menampung
banyak skill, sehingga identitas dan dedupe adalah `source.repository` + `source.subpath`,
bukan repositori saja. Entri skill tidak mengizinkan galeri `media`: skill adalah teks yang
dimuat harness, jadi tidak ada yang bisa di-screenshot (`additionalProperties: false` yang
menegakkannya).

Bidang-bidang ini mempertahankan persis bentuk dan aturan yang didokumentasikan untuk entri
plugin di atas: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`,
`tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`. Setiap bidang wajib
kecuali `triggers`, satu-satunya bidang skill yang opsional.

### Bidang khusus skill

| Bidang               | Tipe   | Wajib | Aturan                                                        |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   ya    | Harus persis `skill`                                          |
| `skillScope`         | enum   |   ya    | `repository` (seluruh repositori **adalah** skill itu) atau `subdirectory` (skill berada di `source.subpath`) |
| `triggers`           | array  |    tidak    | Kapan skill terpicu — teks yang dievaluasi pengguna sebelum memuatnya. Setidaknya 1 string unik, masing-masing 3–200 karakter; hilangkan bidang ini sepenuhnya bila tidak ada satu pun (`triggers: []` tidak valid) |
| `usage.load`         | string |   ya    | Cara harness memuat skill, 1–200 karakter; skill dimuat, tidak pernah diinstal |
| `usage.evidencePath` | string |   ya    | Path relatif aman (pola yang sama seperti `description.evidencePath`) ke bukti pemuatan pada `source.commit` |
| `compat.harnessMin`  | string |   ya    | Versi harness minimum tempat skill diverifikasi; bentuk `x.y.z` persis (prarilis/build opsional), maks 64 karakter. Lapisan semantik juga mewajibkan SemVer persis yang dapat di-parse |

Aturan kondisional (diberlakukan oleh blok `allOf` skema skill):

- `skillScope: subdirectory` **memaksa** `source.subpath` berupa string path relatif aman —
  skill yang di-host di subdirektori harus mematok subdirektori itu.
- `skillScope: repository` **memaksa** `source.subpath: null` — skill seluruh-repositori tidak
  boleh mendeklarasikan subpath.

`verification` mempertahankan bentuk plugin (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), tetapi `smokeTest` harus persis `null`: skill tidak punya smoke test instalasi,
dan tinjauan konten adalah gerbang penerimaannya. Skema skill tidak membawa kondisional
`status: verified` → `smokeTest` maupun kondisional `repositoryScope` → `popularity`;
keterkaitan itu adalah aturan skema plugin saja.

### Lapisan semantik untuk skill

Di atas skema, validasi katalog menerapkan parser semantik wajib yang sama seperti untuk
plugin pada bidang yang ada: `license.spdx` harus dapat di-parse sebagai ekspresi SPDX yang
valid (`invalid-spdx`), dan `compat.harnessMin` harus berupa SemVer persis (`invalid-semver`).
Tidak ada kasus `invalid-sri` — skill tidak memiliki `package.integrity`.

### Identitas dan dedupe skill

Kunci kanonis sebuah skill adalah `skill:<source.repositoryNodeId>:<normalized subpath>`.
Subpath dinormalisasi hanya untuk keperluan identitas: backslash menjadi `/`, segmen kosong
dan `.` dibuang, dan hasil kosong (atau `subpath: null`) menjadi `.` — seluruh repositori.
Subpath yang mengandung byte NUL atau segmen `..` ditolak, tidak pernah "dibersihkan". Dua
skill dari repositori yang sama adalah dua entri; repositori + subpath yang sama dua kali
adalah kolisi.

### Contoh skill minimal

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

## Apa yang tidak diperiksa skema

Skema sengaja bersifat lokal dan struktural. Ia **tidak** memverifikasi bahwa repositori itu
ada, bahwa node ID cocok dengan URL, bahwa path bukti ada pada commit yang dipatok, bahwa
jumlah bintang akurat, atau bahwa kreator memiliki sumber tersebut. Pemeriksaan itu adalah
milik gerbang tinjauan maintainer yang dijelaskan di [CONTRIBUTING.md](../../CONTRIBUTING.md)
dan [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
