# Tata Kelola Katalog

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Bagaimana katalog publik diatur: siapa yang memutuskan apa yang masuk, dalam urutan mana
kontribusi yang bersaing dihormati, pemeriksaan mana yang berjalan otomatis, dan penilaian mana
yang tetap manusiawi. Kebijakan yang dirujuk di sini ada di [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](../../docs/CREDIT.md), dan [docs/RANKING.md](../../docs/RANKING.md); halaman
ini mendeskripsikan bagaimana semuanya saling terhubung.

## Prinsip

1. **Mengutamakan kreator.** Katalog ada untuk membuat karya kreator dapat ditemukan, bukan
   untuk mengambil kepemilikannya. Untuk plugin kanonis yang sama, pull request langsung dari
   kreator menggantikan pull request kurasi komunitas atau otomasi yang terbuka apa pun —
   urutan prioritas lengkap dan aturan identitas Git ada di [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Satu plugin, satu pull request yang ditinjau.** Tidak ada penggabungan batch, tidak ada
   impor massal yang dihasilkan ke katalog publik. Setiap entri mendapatkan tinjauannya sendiri.
3. **Bukti di atas kepercayaan.** Setiap bidang publik tertelusur ke repositori kreator asli
   pada commit yang dipatok. Pemeriksaan otomatis yang hijau tidak pernah diterima sebagai
   bukti asal.
4. **Tidak resmi, selalu.** Tidak ada status katalog yang disajikan sebagai tinjauan,
   sertifikasi, atau dukungan DeepSeek.

## Bagaimana perubahan mendarat di `main`

Semua perubahan mencapai `main` melalui pull request yang ditinjau — tidak ada push langsung.
Kebijakan yang berlaku untuk branch default:

- **Hanya pull request.** Entri katalog, dokumentasi, dan perubahan skema semuanya masuk
  melalui PR; PR katalog harus mengikuti aturan satu-plugin-per-branch di
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Riwayat linear.** PR diintegrasikan sehingga `main` menjaga riwayat yang linear dan dapat
  diaudit; riwayat publik yang sudah tergabung tidak ditulis ulang. Jika entri kurasi tergabung
  sebelum kreator muncul, kreator mengklaim atau mengoreksinya dalam kontribusi tindak lanjut,
  bukan lewat penulisan ulang riwayat.
- **Penyelesaian thread tinjauan.** Percakapan tinjauan diselesaikan sebelum penggabungan;
  umpan balik yang belum diselesaikan memblokir integrasi.
- **Penggabungan oleh maintainer.** Hanya maintainer yang menggabungkan entri plugin, dan hanya
  setelah setiap gerbang di [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Gerbang tinjauan,
  tabrakan, dan penggabungan" lolos pada commit PR saat ini.

## Pemeriksaan `catalog-validation`

Setiap pull request yang menyentuh `catalog/plugins/`, `schemas/`, atau workflow itu sendiri
menjalankan job `catalog-validation` (`.github/workflows/validate-catalog.yml`), dipatok ke CLI
yang dipublikasikan:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Apa yang divalidasi** — hanya struktur dan semantik lokal:

- Parsing YAML yang aman untuk setiap entri di bawah `catalog/plugins/`.
- Kepatuhan terhadap skema publik (lihat [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Parsing ekspresi SPDX, versi SemVer persis, nilai integritas SHA-512 SRI yang valid.
- Penolakan duplikat: tidak ada ID entri yang berulang dan tidak ada kunci kanonis
  repository-node-plus-subpath yang berulang.
- Katalog kosong-nol-entri yang sengaja tetap lolos (`0 entries valid; catalog is empty`).

**Apa yang TIDAK divalidasi** — dan karena itu apa yang tidak pernah dibuktikan oleh
pemeriksaan yang hijau:

- Identitas repositori jarak jauh: ia tidak menghubungi GitHub atau menyelesaikan node ID
  repositori terhadap URL.
- Bukti pada commit yang dipatok: deskripsi, lisensi, integrasi DSH, dan bukti smoke tidak
  diambil atau diperiksa.
- Kepemilikan kreator, jumlah bintang, atau tabrakan dengan pull request yang terbuka.

Penilaian itu milik gerbang provenance terpisah para maintainer, diterapkan sebelum
penggabungan dan dijelaskan di [CONTRIBUTING.md](../../CONTRIBUTING.md). Pemeriksaan lokal
adalah lantai, bukan batas atas.

## Status verifikasi

Verifikasi dicatat per entri terhadap commit persisnya yang dipatok, menggunakan status yang
didefinisikan di skema publik (`eligible`, `verified`, `stale`, `unavailable`, `archived`,
`quarantined`). Dua status positif sengaja dibuat sempit:

- `eligible` — struktur publik dan integrasi DSH native telah divalidasi.
- `verified` — sebagai tambahan, smoke test instalasi telah lolos untuk sumber atau paket yang
  dipatok; skema mewajibkan rekaman smoke-test hadir.

Tidak ada status — atau status lain mana pun — yang merupakan dukungan, jaminan, atau
sertifikasi keamanan. Semantik lengkapnya, termasuk bagaimana status berinteraksi dengan
peringkat, ada di [docs/RANKING.md](../../docs/RANKING.md); bentuk rekapannya ada di
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Klaim, koreksi, dan penghapusan

Formulir issue GitHub terstruktur (`.github/ISSUE_TEMPLATE/`) adalah jalur resmi untuk mengubah
entri yang tidak Anda ajukan:

| Formulir           | Siapa yang menggunakannya                              | Hasil                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Claim**      | Kreator yang pluginnya dikurasi oleh orang lain | Kepemilikan diikat ke sumber asli; kreator kemudian dapat berkontribusi langsung |
| **Correction** | Siapa pun yang menemukan metadata publik yang tidak akurat | Perbaikan yang ditinjau untuk entri terkait             |
| **Removal**    | Kreator yang ingin entri mereka dihapus, atau pelapor pelanggaran kebijakan | Penghapusan atau karantina entri yang ditinjau |

Aturan yang berlaku untuk ketiga alur:

- Klaim kepemilikan harus didukung bukti publik yang dapat diverifikasi (kepemilikan
  repositori, kepengarangan paket, metadata manifes, atau riwayat sumber yang dipatok) —
  berkomentar di Discussion tidak menetapkan kepengarangan
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Masalah keamanan pada plugin yang terdaftar disampaikan ke maintainer plugin itu sendiri
  terlebih dahulu; sisi katalog kemudian menangani koreksi atau karantina tanpa
  memublikasikan detail eksploit ([SECURITY.md](../../SECURITY.md)).
- Jangan pernah menyertakan kredensial, detail kontak pribadi, atau rahasia lain dalam
  formulir.

## Peran

- **Kreator** memiliki plugin mereka dan prioritas entri mereka. Mereka dapat berkontribusi
  langsung, menyetujui kurasi komunitas, atau mengklaim/mengoreksi/menghapus entri yang sudah
  ada.
- **Kontributor komunitas** boleh mengkurasi entri untuk kreator yang belum berkontribusi, di
  bawah aturan kontak hormat dan kredit di [docs/CREDIT.md](../../docs/CREDIT.md). Kurasi tidak
  pernah mengungguli kontribusi langsung kreator yang datang belakangan.
- **Maintainer** meninjau, menerapkan gerbang provenance, menyelesaikan tabrakan, dan
  menggabungkan. Mereka juga memelihara situs web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) dan CLI yang
  dipublikasikan dari sumber privat; data publik, skema, dan kebijakan repositori inilah yang
  dikonsumsi permukaan-permukaan tersebut.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
