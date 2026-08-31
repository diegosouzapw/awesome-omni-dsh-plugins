# Rujukan Skema Entri Katalog

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Bahasa Melayu**

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

Peraturan peringkat atas: entri ialah satu objek YAML, `additionalProperties: false`
(medan yang tidak dikenali ditolak), dan semua medan di bawah adalah wajib kecuali `media` —
satu-satunya medan pilihan.

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
| `media`           | array   |    tidak    | Sehingga 6 tangkapan skrin/video, setiap URL disematkan pada `source.commit` |

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

Salah satu daripada empat belas kategori keupayaan:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

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

### `media`

Satu-satunya medan pilihan. Tatasusunan dengan paling banyak **6** item, setiap satu menerangkan satu tangkapan skrin atau video pendek pemalam:

| Sifat | Jenis | Peraturan |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` atau `video` |
| `url`    | string | URL GitHub yang tidak boleh berubah, maksimum 2048 aksara (lihat di bawah) |
| `alt`    | string | Teks alternatif, 1–120 aksara |

URL di sini mesti setegar `source.commit`. Laluan `raw.githubusercontent.com` yang membawa nama
cabang (`.../main/docs/shot.png`) memaparkan apa yang cabang itu simpan hari ini, jadi entri akan
menerbitkan imej yang belum disemak pada hari cabang itu bergerak. Dua bentuk diterima:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — laluan raw yang disematkan pada komit;
- `https://github.com/<owner>/<repo>/assets/…` — URL muat naik GitHub yang dialamatkan mengikut kandungan, untuk item `video`.

Skema hanya menguatkuasakan bentuk selamat (hos, rujukan heksadesimal 40 aksara, panjang
terhad). Selebihnya dikuatkuasakan `catalog validate` secara semantik: URL mesti menyematkan
`source.commit` **entri itu sendiri** dalam repositori **entri itu sendiri**, dan URL cabang
ditolak dengan `media[n].url must pin the entry commit, not a branch`.

Tinggalkan medan ini sepenuhnya apabila tiada apa-apa untuk ditunjukkan — `media: []` bukan cara
yang sah untuk berkata "tiada tangkapan skrin". Medan ini bersifat tambahan: entri yang
diterbitkan sebelum ia wujud kekal sah, dan pengguna yang mengabaikannya membaca setiap entri
tepat seperti dahulu.

## Entri `kind: skill`

Versi skema 1 juga mentakrifkan kontrak entri kedua yang berdiri sendiri untuk `kind: skill`,
diterbitkan sebagai [`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01
fasa 0). Ia tidak sesekali menyentuh skema pemalam di atas: entri dengan `kind: plugin` terus
disahkan tepat seperti sebelumnya, dan fail skema skill adalah sumber kebenaran untuk entri
skill sama seperti skema pemalam bagi entri pemalam.

Sesuatu skill tidak dipasang, ia **dimuatkan** oleh harness, jadi deskriptor pemasangan
khusus-pemalam (`package`, `dsh`) tidak wujud pada entri skill dan digantikan oleh `usage` +
`compat`. Skill juga kerap tinggal dalam subdirektori repositori yang menempatkan banyak
skill, jadi identiti dan penyahduaan ialah `source.repository` + `source.subpath`, bukannya
repositori sahaja. Entri skill tidak menerima galeri `media`: skill ialah teks yang dimuatkan
oleh harness, jadi tiada apa-apa untuk ditangkap skrin (`additionalProperties: false` yang
menguatkuasakannya).

Medan-medan ini mengekalkan tepat bentuk dan peraturan yang didokumenkan untuk entri pemalam
di atas: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`,
`tags`, `source`, `creator`, `repositoryScope`, `license`, `provenance`. Setiap medan adalah
wajib kecuali `triggers`, satu-satunya medan skill pilihan.

### Medan khusus skill

| Medan                | Jenis  | Diperlukan | Peraturan                                                   |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | konstan  |   ya    | Mesti tepat `skill`                                     |
| `skillScope`         | enum   |   ya    | `repository` (keseluruhan repositori **ialah** skill itu) atau `subdirectory` (skill tinggal di `source.subpath`) |
| `triggers`           | tatasusunan  |    tidak    | Bila skill itu terpicu — teks yang dinilai pengguna sebelum memuatkannya. Sekurang-kurangnya 1 rentetan unik, setiap satu 3–200 aksara; tinggalkan medan ini sepenuhnya apabila tiada (`triggers: []` tidak sah) |
| `usage.load`         | rentetan |   ya    | Cara harness memuatkan skill itu, 1–200 aksara; skill dimuatkan, tidak sesekali dipasang |
| `usage.evidencePath` | rentetan |   ya    | Laluan relatif selamat (corak yang sama seperti `description.evidencePath`) kepada bukti muatan pada `source.commit` |
| `compat.harnessMin`  | rentetan |   ya    | Versi harness minimum yang terhadapnya skill itu disahkan; bentuk `x.y.z` tepat (prarilis/binaan pilihan), maksimum 64 aksara. Lapisan semantik juga memerlukan SemVer yang boleh dihurai dan tepat |

Peraturan bersyarat (dikuatkuasakan oleh blok `allOf` skema skill):

- `skillScope: subdirectory` **memaksa** `source.subpath` menjadi rentetan laluan relatif
  selamat — skill yang ditempatkan dalam subdirektori mesti memasak subdirektori itu.
- `skillScope: repository` **memaksa** `source.subpath: null` — skill seluruh repositori
  tidak boleh mengisytiharkan subpath.

`verification` mengekalkan bentuk pemalam (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), tetapi `smokeTest` mesti tepat `null`: skill tiada ujian asap pemasangan, dan
semakan kandungan ialah pintu kemasukannya. Skema skill tidak membawa syarat
`status: verified` → `smokeTest` dan tiada syarat `repositoryScope` → `popularity`; gandingan
tersebut adalah peraturan skema pemalam sahaja.

### Lapisan semantik untuk skill

Di atas skema itu, pengesahan katalog menggunakan penghurai semantik mandatori yang sama
seperti untuk pemalam di mana medan itu wujud: `license.spdx` mesti dihurai sebagai ungkapan
SPDX yang sah (`invalid-spdx`), dan `compat.harnessMin` mesti SemVer tepat
(`invalid-semver`). Tiada kes `invalid-sri` — skill tiada `package.integrity`.

### Identiti dan penyahduaan skill

Kunci kanonik sesuatu skill ialah `skill:<source.repositoryNodeId>:<normalized subpath>`.
Subpath dinormalkan untuk tujuan identiti sahaja: garis miring terbalik menjadi `/`, segmen
kosong dan `.` digugurkan, dan hasil kosong (atau `subpath: null`) menjadi `.` — keseluruhan
repositori. Subpath yang mengandungi bait NUL atau segmen `..` ditolak, tidak sesekali
"dibersihkan". Dua skill daripada repositori yang sama ialah dua entri; repositori + subpath
yang sama dua kali ialah perlanggaran.

### Contoh skill minimum

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

## Apa yang tidak disemak oleh skema

Skema itu sengaja tempatan dan struktur. Ia **tidak** mengesahkan bahawa repositori itu
wujud, bahawa ID nod sepadan dengan URL, bahawa laluan bukti wujud pada komit yang dipasak,
bahawa kiraan bintang tepat, atau bahawa pencipta memiliki sumber itu. Semakan tersebut
tergolong dalam pintu gerbang semakan penyelenggara yang diterangkan di
[CONTRIBUTING.md](../../CONTRIBUTING.md) dan
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
