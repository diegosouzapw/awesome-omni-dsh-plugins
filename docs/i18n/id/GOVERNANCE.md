# Tata Kelola Katalog

> 🌐 [English](../../docs/GOVERNANCE.md) · **Bahasa Indonesia (id)**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Bagaimana katalog publik ini dikelola: siapa yang memutuskan apa yang masuk, dalam urutan apa
kontribusi yang bersaing dihormati, pemeriksaan mana yang berjalan otomatis, dan penilaian mana
yang tetap menjadi keputusan manusia. Kebijakan yang dirujuk di sini ada di
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md), dan
[docs/RANKING.md](../../docs/RANKING.md); halaman ini menjelaskan bagaimana semuanya saling
terkait.

## Prinsip

1. **Kreator diutamakan.** Katalog ini ada untuk membuat karya kreator dapat ditemukan, tidak
   pernah untuk mengambil alih kepemilikannya. Untuk plugin kanonis yang sama, pull request
   langsung dari kreator mengesampingkan kurasi komunitas atau pull request otomatisasi yang
   sedang terbuka — urutan prioritas lengkap dan aturan identitas Git ada di
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Satu plugin, satu pull request yang ditinjau.** Tidak ada penggabungan batch, tidak ada
   impor massal yang dihasilkan otomatis ke katalog publik. Setiap entri mendapatkan
   tinjauannya sendiri.
3. **Bukti di atas kepercayaan.** Setiap bidang publik dapat ditelusuri ke repositori kreator
   asli pada commit yang dipatok. Pemeriksaan otomatis yang hijau tidak pernah diterima sebagai
   bukti asal-usul.
4. **Selalu tidak resmi.** Tidak ada status katalog yang disajikan sebagai tinjauan,
   sertifikasi, atau dukungan dari DeepSeek.

## Bagaimana perubahan masuk ke `main`

Semua perubahan mencapai `main` lewat pull request yang ditinjau — tidak ada push langsung.
Kebijakan kerja untuk branch default:

- **Hanya pull request.** Entri katalog, dokumentasi, dan perubahan skema semuanya masuk lewat
  PR; PR katalog harus mengikuti aturan satu-plugin-per-branch di
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Riwayat linear.** PR diintegrasikan sehingga `main` mempertahankan riwayat yang linear dan
  dapat diaudit; riwayat publik yang sudah digabungkan tidak ditulis ulang. Jika entri hasil
  kurasi digabungkan sebelum kreator muncul, kreator mengklaim atau mengoreksinya dalam
  kontribusi lanjutan, bukan penulisan ulang riwayat.
- **Resolusi thread tinjauan.** Percakapan tinjauan diselesaikan sebelum penggabungan; umpan
  balik yang belum terselesaikan memblokir integrasi.
- **Penggabungan oleh maintainer.** Hanya maintainer yang menggabungkan entri plugin, dan hanya
  setelah setiap gerbang di [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Review gates,
  collisions and merge" lulus pada commit PR saat ini.

## Pemeriksaan `catalog-validation`

Setiap pull request yang menyentuh `catalog/plugins/`, `schemas/`, atau workflow itu sendiri
menjalankan job `catalog-validation` (`.github/workflows/validate-catalog.yml`), yang dipatok ke
CLI yang dipublikasikan:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Apa yang divalidasi** — hanya struktur dan semantik lokal:

- Parsing YAML yang aman untuk setiap entri di bawah `catalog/plugins/`.
- Kesesuaian dengan skema publik (lihat [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsing ekspresi SPDX, versi SemVer yang tepat, nilai integrity SHA-512 SRI yang valid.
- Penolakan duplikat: tidak ada ID entri yang berulang dan tidak ada kunci
  repository-node-plus-subpath kanonis yang berulang.
- Katalog nol-entri yang disengaja lulus (`0 entries valid; catalog is empty`).

**Apa yang TIDAK divalidasi** — dan karenanya apa yang tidak pernah dibuktikan oleh pemeriksaan
yang hijau:

- Identitas repositori jarak jauh: tidak menghubungi GitHub atau menyelesaikan node ID
  repositori terhadap URL.
- Bukti pada commit yang dipatok: deskripsi, lisensi, integrasi DSH, dan bukti smoke test tidak
  diambil atau diperiksa.
- Kepemilikan kreator, jumlah bintang, atau tabrakan dengan pull request yang terbuka.

Penilaian-penilaian tersebut menjadi bagian gerbang provenance terpisah milik maintainer, yang
diterapkan sebelum penggabungan dan dijelaskan di
[CONTRIBUTING.md](../../CONTRIBUTING.md). Pemeriksaan lokal adalah lantai, bukan standar
tertinggi.

## Status verifikasi

Verifikasi dicatat per entri terhadap commit yang dipatok persis, menggunakan status yang
didefinisikan dalam skema publik (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Kedua status positif dengan sengaja dibuat sempit:

- `eligible` — struktur publik dan integrasi DSH native telah divalidasi.
- `verified` — tambahan, smoke test instalasi lulus untuk source atau paket yang dipatok; skema
  mewajibkan catatan smoke test hadir.

Baik status ini maupun status lainnya bukanlah dukungan, jaminan, atau sertifikasi keamanan.
Semantik lengkapnya, termasuk bagaimana status berinteraksi dengan peringkat, ada di
[docs/RANKING.md](../../docs/RANKING.md); bentuk catatannya ada di
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Klaim, koreksi, dan penghapusan

Formulir issue GitHub terstruktur (`.github/ISSUE_TEMPLATE/`) adalah jalur yang dikelola untuk
mengubah entri yang tidak Anda ajukan sendiri:

| Formulir       | Siapa yang menggunakannya                | Hasil                                             |
| -------------- | ----------------------------------------- | --------------------------------------------------- |
| **Klaim**      | Kreator yang plugin-nya dikurasi oleh orang lain | Kepemilikan diikat ke sumber asli; kreator kemudian dapat berkontribusi langsung |
| **Koreksi** | Siapa pun yang menemukan metadata publik yang tidak akurat | Perbaikan yang ditinjau pada entri yang terdampak |
| **Penghapusan**    | Kreator yang ingin listing-nya dihapus, atau pelapor pelanggaran kebijakan | Penghapusan atau karantina entri yang ditinjau |

Aturan yang berlaku untuk ketiga alur tersebut:

- Klaim kepemilikan harus didukung oleh bukti publik yang dapat diverifikasi (kepemilikan
  repositori, kepenulisan paket, metadata manifest, atau riwayat source yang dipatok) —
  berkomentar pada Discussion tidak menetapkan status kreator
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Masalah keamanan pada plugin yang terdaftar diarahkan ke maintainer plugin itu sendiri
  terlebih dahulu; sisi katalog kemudian menangani koreksi atau karantina tanpa mempublikasikan
  detail eksploit ([SECURITY.md](../../SECURITY.md)).
- Jangan pernah menyertakan kredensial, detail kontak pribadi, atau rahasia lainnya dalam
  sebuah formulir.

## Peran

- **Kreator** memiliki plugin mereka dan prioritas listing mereka. Mereka dapat berkontribusi
  secara langsung, menyetujui kurasi komunitas, atau mengklaim/mengoreksi/menghapus entri yang
  sudah ada.
- **Kontributor komunitas** boleh mengurasi entri untuk kreator yang belum berkontribusi,
  di bawah aturan kontak yang menghormati dan kredit di [docs/CREDIT.md](../../docs/CREDIT.md).
  Kurasi tidak pernah mengungguli kontribusi langsung dari kreator yang menyusul kemudian.
- **Maintainer** meninjau, menerapkan gerbang provenance, menyelesaikan tabrakan, dan
  menggabungkan. Mereka juga memelihara situs web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) dan CLI yang
  dipublikasikan dari sumber privat; data publik, skema, dan kebijakan repositori ini adalah
  apa yang dikonsumsi oleh kedua permukaan tersebut.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
