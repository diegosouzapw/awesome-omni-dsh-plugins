# Referensi Skema Entri Katalog

> 🌐 [English](../../docs/SCHEMA.md) · **Bahasa Indonesia (id)**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Ini adalah referensi bidang-demi-bidang untuk
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), JSON Schema publik
(draft 2020-12) yang harus dipenuhi oleh setiap file di bawah `catalog/plugins/`. File skema itu
sendiri adalah sumber kebenaran; ketika halaman ini dan skema tidak sesuai, skema yang berlaku.

Dua lapisan validasi berlaku. Skema publik menegakkan *bentuk aman* yang dibatasi (pola dan
panjang yang menolak nilai yang menyerupai opsi atau tak terbatas). Di atasnya, `catalog validate`
menerapkan parser semantik wajib: SemVer yang tepat untuk versi, SHA-512 SRI untuk nilai
integrity, parsing ekspresi SPDX untuk lisensi, dan penolakan kunci duplikat. Sebuah nilai dapat
cocok dengan pola skema dan tetap ditolak secara semantik.

Aturan tingkat atas: entri adalah satu objek YAML, `additionalProperties: false` (bidang yang
tidak dikenal ditolak), dan **semua** bidang berikut wajib diisi.

## Bidang tingkat atas

| Bidang             | Tipe    | Wajib | Ringkasan                                                      |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   ya    | Harus persis `1`                                               |
| `id`              | string  |   ya    | ID entri lowercase kebab-case; harus cocok dengan nama file    |
| `name`            | string  |   ya    | Nama tampilan, 1–120 karakter                                  |
| `description`     | object  |   ya    | Ringkasan bahasa Inggris yang dikurasi beserta jalur buktinya  |
| `unofficial`      | const   |   ya    | Harus persis `true`                                            |
| `kind`            | enum    |   ya    | Diskriminator artefak kanonis                                  |
| `primaryCategory` | enum    |   ya    | Satu kategori kapabilitas utama                                |
| `tags`            | array   |   ya    | Tag lowercase kebab-case unik (boleh kosong)                   |
| `source`          | object  |   ya    | Repositori asli, node ID, subpath, dan commit yang dipatok     |
| `creator`         | object  |   ya    | Handle GitHub publik kreator                                   |
| `package`         | object  |   ya    | Deskriptor instalasi kanonis (npm **atau** source)              |
| `dsh`             | object  |   ya    | Profil DSH dan jalur bukti integrasi native                    |
| `repositoryScope` | enum    |   ya    | `dedicated` atau `monorepo`                                    |
| `popularity`      | object  |   ya    | Kebijakan bintang dan jumlah bintang (bersyarat pada scope)     |
| `license`         | object  |   ya    | Ekspresi lisensi SPDX upstream                                 |
| `verification`    | object  |   ya    | Status verifikasi, waktu pemeriksaan, identitas, dan smoke test |
| `provenance`      | object  |   ya    | URL Discussion/komentar publik atau `null`                     |

### `schemaVersion`

Konstanta `1`. Mengidentifikasi versi skema publik 1; nilai lainnya tidak valid.

### `id`

String yang cocok dengan `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, tanpa hyphen di
awal/akhir atau ganda. Berdasarkan [CONTRIBUTING.md](../../CONTRIBUTING.md), file entri harus
dinamai `catalog/plugins/<id>.yaml` dengan nilai yang identik; validator menolak ketidakcocokan
(`id-filename-mismatch`). ID juga harus dimulai dengan namespace kreator: handle
`creator.github` dalam huruf kecil, dengan setiap rangkaian karakter di luar `[a-z0-9]`
digabungkan menjadi satu `-`, diikuti oleh `-` (`id-creator-prefix`).

### `name`

Nama tampilan bebas, `minLength: 1`, `maxLength: 120`.

### `description`

Objek dengan tepat dua properti wajib (tidak ada yang lain diizinkan):

| Properti       | Tipe   | Aturan                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | string | Ringkasan bahasa Inggris, 20–320 karakter                                |
| `evidencePath` | string | Pola jalur repo relatif; tanpa `/` di awal, tanpa backslash, tanpa segmen `.`/`..` |

Ringkasan bahasa Inggris harus dikurasi dari file di `evidencePath` sebagaimana ada pada
`source.commit` — bukan disalin dari katalog lain.

### `unofficial`

Konstanta `true`. Penanda yang dapat dibaca mesin bahwa listing ini tidak resmi.

### `kind`

**Satu-satunya** diskriminator jenis artefak (tidak ada bidang integration-kind kedua). Salah
satu dari:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Makna dan konsekuensi peringkatnya didefinisikan di
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Salah satu dari tiga belas kategori kapabilitas:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Label tampilan dan panduan pemilihan ada di
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Array string unik, masing-masing cocok dengan `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase
kebab-case). Skema tidak mewajibkan jumlah minimum.

### `source`

Objek dengan tepat empat properti wajib:

| Properti           | Tipe           | Aturan                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL `https://github.com/<owner>/<repo>`; owner mengikuti aturan username GitHub, nama repo 1–100 karakter, tidak boleh `.`/`..` atau berakhiran `.git` |
| `repositoryNodeId` | string         | Repository node ID GitHub yang tidak berubah, tidak boleh kosong       |
| `subpath`          | string atau null | Subpath plugin di dalam repositori (pola jalur relatif aman yang sama seperti `evidencePath`), atau `null` untuk plugin di root repositori |
| `commit`           | string         | OID commit heksadesimal 40 karakter penuh                              |

Validasi katalog harus menyelesaikan `repositoryNodeId` dan menolak ketidakcocokan URL
repositori — resolusi tersebut adalah gerbang di sisi maintainer, bukan bagian dari pemeriksaan
struktural lokal.

### `creator`

Objek dengan satu properti wajib:

| Properti | Tipe   | Aturan                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | Username GitHub (1–39 karakter, aturan handle GitHub) |

URL profil publik selalu diturunkan sebagai `https://github.com/<handle>`; tidak ada bidang
profil kedua yang disimpan, sehingga keduanya tidak akan pernah berbeda.

### `package`

Deskriptor instalasi kanonis. Ini adalah data, bukan perintah shell, dan mengambil tepat satu
dari dua bentuk (`oneOf`):

**Paket npm** — wajib `ecosystem`, `name`, `version`; opsional `integrity`:

| Properti    | Tipe  | Aturan                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Bentuk nama paket npm (opsional scoped), maks 214 karakter                 |
| `version`   | string | Bentuk versi `x.y.z` yang tepat (prerelease/build opsional); rentang ditolak. Lapisan semantik selanjutnya mewajibkan SemVer yang tepat dan dapat di-parsing |
| `integrity` | string | Bentuk SRI `sha512-…` opsional, 8–256 karakter. Lapisan semantik harus mem-parsing-nya sebagai SHA-512 SRI yang valid |

**Instalasi source** — hanya wajib `ecosystem`:

| Properti    | Tipe  | Aturan    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Deskriptor source secara sengaja tidak menyimpan hal lain: repositori, commit, dan subpath
diturunkan dari `source`, sehingga nilai yang dapat berubah tidak pernah diduplikasi.

### `dsh`

Bukti integrasi DSH native:

| Properti       | Tipe   | Aturan                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | array  | Setidaknya satu nama profil unik yang cocok dengan `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Jalur relatif aman ke bukti integrasi DSH pada `source.commit`   |

### `repositoryScope`

Salah satu `dedicated` (bintang repositori milik plugin persis ini) atau `monorepo` (plugin
adalah subpath atau paket di dalam proyek yang lebih luas). Nilai ini menentukan aturan
popularitas bersyarat di bawah ini.

### `popularity`

| Properti     | Tipe            | Aturan                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` atau `undefined-parent-repository`  |
| `stars`      | integer atau null | Integer non-negatif, atau `null`                      |

Aturan bersyarat (ditegakkan oleh blok `allOf` skema):

- `repositoryScope: monorepo` **mewajibkan** `starsPolicy: undefined-parent-repository` dan
  `stars: null`. Bintang proyek induk tidak pernah diatribusikan ke plugin monorepo.
- `repositoryScope: dedicated` **mewajibkan** `starsPolicy: exact-repository` dan integer
  `stars >= 0`.

Lihat [docs/RANKING.md](../../docs/RANKING.md) untuk cara nilai-nilai ini digunakan dalam
predikat peringkat.

### `license`

| Properti | Tipe   | Aturan                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | Bentuk ekspresi SPDX, 2–256 karakter, tanpa hyphen di awal        |

Skema hanya menegakkan bentuk karakter yang aman; validasi katalog harus mem-parsing dan
menormalkan nilai tersebut dengan parser ekspresi SPDX yang sebenarnya. Catat ekspresi upstream
lengkap yang dibuktikan pada commit yang dipatok (misalnya `Apache-2.0` atau
`MIT OR GPL-3.0-only`).

### `verification`

Verifikasi berlaku untuk `source.commit`. Objek dengan empat properti wajib:

| Properti             | Tipe           | Aturan                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Timestamp berformat `date-time` dari pemeriksaan        |
| `repositoryIdentity` | const          | Harus `resolved`                                        |
| `smokeTest`          | object atau null | Catatan smoke test, atau `null` ketika tidak ada tes yang memenuhi syarat |

Ketika ada, `smokeTest` mewajibkan:

| Properti        | Tipe   | Aturan                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — merujuk ke `package` atau source yang dipatok tanpa menduplikasi nilai yang dapat berubah |
| `check`         | object | Wajib `name` (bentuk nama paket) dan `version` (bentuk versi tepat) |
| `result`        | const  | `passed` — smoke test yang gagal tidak dicatat sebagai smoke test   |

Aturan bersyarat: `status: verified` **mewajibkan** objek `smokeTest` yang tidak null. Entri
tanpa bukti smoke test yang dapat ditinjau menggunakan `status: eligible` dan
`smokeTest: null`. Tidak ada status yang merupakan dukungan atau sertifikasi keamanan — lihat
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Tautan provenance publik, masing-masing berupa URI atau `null`:

| Properti     | Tipe          | Aturan                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string atau null | URL Discussion publik jika ada                    |
| `comment`    | string atau null | URL komentar publik jika ada                      |

## Apa yang tidak diperiksa oleh skema

Skema ini secara sengaja bersifat lokal dan struktural. Skema ini **tidak** memverifikasi bahwa
repositori benar-benar ada, bahwa node ID cocok dengan URL, bahwa jalur bukti ada pada commit
yang dipatok, bahwa jumlah bintang akurat, atau bahwa kreator memiliki sumber tersebut.
Pemeriksaan tersebut menjadi bagian gerbang tinjauan maintainer yang dijelaskan di
[CONTRIBUTING.md](../../CONTRIBUTING.md) dan [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
