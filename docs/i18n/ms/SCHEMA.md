# Rujukan Skema Entri Katalog

> 🌐 [English](../../docs/SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · [한국어](../ko/SCHEMA.md) · **Bahasa Melayu (ms)**

> **Projek komuniti tidak rasmi. Tiada gabungan, kelulusan atau tajaan daripada DeepSeek.**
> Nama dan tanda DeepSeek adalah kepunyaan pemilik masing-masing.

Ini adalah rujukan medan demi medan untuk
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), JSON Schema awam
(draf 2020-12) yang mesti dipatuhi oleh setiap fail di bawah `catalog/plugins/`. Fail
skema itu sendiri adalah sumber kebenaran; apabila halaman ini dan skema berbeza, skema
menang.

Dua lapisan pengesahan digunakan. Skema awam menguatkuasakan *bentuk selamat* yang
terhad (corak dan panjang yang menolak nilai seperti pilihan atau tidak terhad). Di
atasnya, `catalog validate` menggunakan penghurai semantik mandatori: SemVer tepat untuk
versi, SHA-512 SRI untuk nilai integriti, penghuraian ungkapan SPDX untuk lesen, dan
penolakan kunci pendua. Satu nilai boleh sepadan dengan corak skema tetapi masih ditolak
secara semantik.

Peraturan peringkat atas: entri adalah satu objek YAML tunggal, `additionalProperties: false`
(medan tidak dikenali ditolak), dan **semua** medan berikut diperlukan.

## Medan peringkat atas

| Medan             | Jenis   | Diperlukan | Ringkasan                                                      |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | konstan   |   ya    | Mesti tepat `1`                                           |
| `id`              | rentetan  |   ya    | ID entri kebab-case huruf kecil; mesti sepadan dengan nama fail |
| `name`            | rentetan  |   ya    | Nama paparan, 1–120 aksara                                |
| `description`     | objek  |   ya    | Ringkasan bahasa Inggeris yang dikuratori beserta laluan buktinya |
| `unofficial`      | konstan   |   ya    | Mesti tepat `true`                                        |
| `kind`            | enum    |   ya    | Diskriminator artifak kanonik                            |
| `primaryCategory` | enum    |   ya    | Satu kategori keupayaan utama                            |
| `tags`            | tatasusunan   |   ya    | Tag kebab-case huruf kecil yang unik (boleh kosong)              |
| `source`          | objek  |   ya    | Repositori asal, ID nod, subpath dan komit yang dipasak       |
| `creator`         | objek  |   ya    | Pengendali GitHub awam pencipta                              |
| `package`         | objek  |   ya    | Deskriptor pemasangan kanonik (npm **atau** sumber)           |
| `dsh`             | objek  |   ya    | Profil DSH dan laluan bukti integrasi asli             |
| `repositoryScope` | enum    |   ya    | `dedicated` atau `monorepo`                                     |
| `popularity`      | objek  |   ya    | Dasar bintang dan kiraan bintang (bersyarat kepada skop)            |
| `license`         | objek  |   ya    | Ungkapan lesen SPDX huluan                                |
| `verification`    | objek  |   ya    | Status pengesahan, masa semakan, identiti dan ujian asap      |
| `provenance`      | objek  |   ya    | URL Discussion/komen awam atau `null`                      |

### `schemaVersion`

Konstan `1`. Mengenal pasti versi skema awam 1; sebarang nilai lain tidak sah.

### `id`

Rentetan yang sepadan dengan `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case huruf kecil, tiada
tanda sempang di hadapan/belakang atau berganda. Menurut
[CONTRIBUTING.md](../../CONTRIBUTING.md), fail entri mesti dinamakan
`catalog/plugins/<id>.yaml` dengan nilai yang sama persis; pengesah menolak ketidaksepadanan
(`id-filename-mismatch`). ID itu juga mesti bermula dengan ruang nama pencipta: pengendali
`creator.github` dalam huruf kecil, dengan setiap rentetan aksara di luar `[a-z0-9]`
digugurkan menjadi satu `-`, diikuti dengan `-` (`id-creator-prefix`).

### `name`

Nama paparan bebas bentuk, `minLength: 1`, `maxLength: 120`.

### `description`

Objek dengan tepat dua sifat diperlukan (tiada lain dibenarkan):

| Sifat       | Jenis   | Peraturan                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | rentetan | Ringkasan bahasa Inggeris, 20–320 aksara                                    |
| `evidencePath` | rentetan | Corak laluan repo relatif; tiada `/` di hadapan, tiada garis miring terbalik, tiada segmen `.`/`..` |

Ringkasan bahasa Inggeris mesti dikuratori daripada fail di `evidencePath` sebagaimana ia
wujud pada `source.commit` — bukan disalin daripada katalog lain.

### `unofficial`

Konstan `true`. Penanda boleh dibaca mesin bahawa senarai itu tidak rasmi.

### `kind`

Satu-satunya diskriminator jenis artifak (tiada medan jenis-integrasi kedua wujud). Salah
satu daripada:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Makna dan akibat kedudukan ditakrifkan di [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Salah satu daripada tiga belas kategori keupayaan:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Label paparan dan panduan pemilihan terdapat di [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Tatasusunan rentetan unik, setiap satu sepadan dengan `^[a-z0-9]+(?:-[a-z0-9]+)*$`
(kebab-case huruf kecil). Tiada kiraan minimum dikenakan oleh skema.

### `source`

Objek dengan tepat empat sifat diperlukan:

| Sifat           | Jenis           | Peraturan                                                                  |
| ------------------ | -------------- | ------------------------------------------------------------------------ |
| `repository`       | rentetan         | URL `https://github.com/<owner>/<repo>`; pemilik mengikut peraturan nama pengguna GitHub, nama repo 1–100 aksara, tidak boleh `.`/`..` atau berakhir dengan `.git` |
| `repositoryNodeId` | rentetan         | ID nod repositori GitHub tak boleh ubah, tidak kosong                        |
| `subpath`          | rentetan atau null | Subpath pemalam dalam repositori (corak laluan relatif selamat yang sama seperti `evidencePath`), atau `null` untuk pemalam akar repositori |
| `commit`           | rentetan         | OID komit heksadesimal penuh 40 aksara                                    |

Pengesahan katalog mesti menyelesaikan `repositoryNodeId` dan menolak percanggahan URL
repositori — resolusi itu adalah pintu gerbang sisi-penyelenggara, bukan sebahagian daripada
semakan struktur tempatan.

### `creator`

Objek dengan satu sifat diperlukan:

| Sifat | Jenis   | Peraturan                                             |
| -------- | ------ | -------------------------------------------------- |
| `github` | rentetan | Nama pengguna GitHub (1–39 aksara, peraturan pengendali GitHub) |

URL profil awam sentiasa diperoleh sebagai `https://github.com/<handle>`; tiada medan
profil kedua disimpan, jadi kedua-duanya tidak boleh sesekali berbeza.

### `package`

Deskriptor pemasangan kanonik. Ia adalah data, bukan arahan shell, dan mengambil tepat satu
daripada dua bentuk (`oneOf`):

**Pakej npm** — diperlukan `ecosystem`, `name`, `version`; pilihan `integrity`:

| Sifat    | Jenis  | Peraturan                                                                      |
| ----------- | ----- | --------------------------------------------------------------------------- |
| `ecosystem` | konstan | `npm`                                                                      |
| `name`      | rentetan | Bentuk nama pakej npm (boleh berskop), maksimum 214 aksara                 |
| `version`   | rentetan | Bentuk versi `x.y.z` tepat (prarilis/binaan pilihan); julat ditolak. Lapisan semantik juga memerlukan SemVer yang boleh dihurai dan tepat |
| `integrity` | rentetan | Bentuk SRI `sha512-…` pilihan, 8–256 aksara. Lapisan semantik mesti menghuraikannya sebagai SHA-512 SRI yang sah |

**Pemasangan sumber** — hanya diperlukan `ecosystem`:

| Sifat    | Jenis  | Peraturan    |
| ----------- | ----- | -------- |
| `ecosystem` | konstan | `source` |

Deskriptor sumber sengaja tidak menyimpan apa-apa lagi: repositori, komit dan subpath
diperoleh daripada `source`, jadi nilai boleh berubah tidak pernah diduplikasi.

### `dsh`

Bukti integrasi DSH asli:

| Sifat       | Jenis   | Peraturan                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | tatasusunan  | Sekurang-kurangnya satu nama profil unik yang sepadan dengan `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | rentetan | Laluan relatif selamat kepada bukti integrasi DSH pada `source.commit` |

### `repositoryScope`

Sama ada `dedicated` (bintang repositori kepunyaan pemalam tepat ini) atau `monorepo`
(pemalam adalah subpath atau pakej dalam projek yang lebih luas). Nilai ini menentukan
peraturan populariti bersyarat di bawah.

### `popularity`

| Sifat     | Jenis            | Peraturan                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` atau `undefined-parent-repository`  |
| `stars`      | integer atau null | Integer bukan negatif, atau `null`                      |

Peraturan bersyarat (dikuatkuasakan oleh blok `allOf` skema):

- `repositoryScope: monorepo` **memaksa** `starsPolicy: undefined-parent-repository` dan
  `stars: null`. Bintang projek induk tidak sesekali diatribusikan kepada pemalam monorepo.
- `repositoryScope: dedicated` **memaksa** `starsPolicy: exact-repository` dan integer
  `stars >= 0`.

Lihat [docs/RANKING.md](../../docs/RANKING.md) untuk cara nilai ini digunakan dalam predikat
kedudukan.

### `license`

| Sifat | Jenis   | Peraturan                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | rentetan | Bentuk ungkapan SPDX, 2–256 aksara, tiada tanda sempang di hadapan          |

Skema hanya menguatkuasakan bentuk aksara selamat; pengesahan katalog mesti menghurai dan
menormalkan nilai itu dengan penghurai ungkapan SPDX sebenar. Rekodkan ungkapan huluan
lengkap yang dibuktikan pada komit yang dipasak (contohnya `Apache-2.0` atau
`MIT OR GPL-3.0-only`).

### `verification`

Pengesahan digunakan pada `source.commit`. Objek dengan empat sifat diperlukan:

| Sifat             | Jenis           | Peraturan                                                |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | rentetan         | Cap masa berformat `date-time` bagi semakan itu           |
| `repositoryIdentity` | konstan          | Mesti `resolved`                                     |
| `smokeTest`          | objek atau null | Rekod ujian asap, atau `null` apabila tiada ujian yang layak wujud |

Apabila hadir, `smokeTest` memerlukan:

| Sifat        | Jenis   | Peraturan                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | konstan  | `canonical-install-descriptor` — merujuk `package` atau sumber yang dipasak tanpa menduplikasi nilai boleh berubah |
| `check`         | objek | `name` (bentuk nama pakej) dan `version` (bentuk versi tepat) diperlukan |
| `result`        | konstan  | `passed` — ujian asap yang gagal tidak direkodkan sebagai ujian asap    |

Peraturan bersyarat: `status: verified` **memerlukan** objek `smokeTest` bukan-null. Entri
tanpa bukti asap yang boleh disemak menggunakan `status: eligible` dan `smokeTest: null`.
Tiada status yang menjadi kelulusan atau pensijilan keselamatan — lihat
[docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Pautan provenans awam, setiap satu URI atau `null`:

| Sifat     | Jenis          | Peraturan                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | rentetan atau null | URL Discussion awam apabila ia wujud            |
| `comment`    | rentetan atau null | URL komen awam apabila ia wujud               |

## Apa yang tidak disemak oleh skema

Skema itu sengaja tempatan dan struktur. Ia **tidak** mengesahkan bahawa repositori itu
wujud, bahawa ID nod sepadan dengan URL, bahawa laluan bukti wujud pada komit yang dipasak,
bahawa kiraan bintang tepat, atau bahawa pencipta memiliki sumber itu. Semakan tersebut
tergolong dalam pintu gerbang semakan penyelenggara yang diterangkan di
[CONTRIBUTING.md](../../CONTRIBUTING.md) dan
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
