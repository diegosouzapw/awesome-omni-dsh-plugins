# Tadbir Urus Katalog

> 🌐 [English](../../docs/GOVERNANCE.md) · **Bahasa Melayu (ms)**

> **Projek komuniti tidak rasmi. Tiada gabungan, kelulusan atau tajaan daripada DeepSeek.**
> Nama dan tanda DeepSeek adalah kepunyaan pemilik masing-masing.

Bagaimana katalog awam ditadbir: siapa yang memutuskan apa yang masuk, dalam susunan mana
sumbangan yang bersaing dihormati, semakan mana yang dijalankan secara automatik, dan
penilaian mana yang kekal manusia. Dasar yang dirujuk di sini terdapat di
[CONTRIBUTING.md](../../CONTRIBUTING.md), [docs/CREDIT.md](../../docs/CREDIT.md) dan
[docs/RANKING.md](../../docs/RANKING.md); halaman ini menerangkan bagaimana ia berpadu.

## Prinsip

1. **Pencipta diutamakan.** Katalog ini wujud untuk menjadikan kerja pencipta boleh
   ditemui, bukan untuk mengambil alih pemilikannya. Untuk pemalam kanonik yang sama,
   pull request pencipta langsung mengatasi mana-mana pull request kurasi komuniti atau
   automasi yang terbuka — susunan keutamaan lengkap dan peraturan identiti Git terdapat di
   [docs/CREDIT.md](../../docs/CREDIT.md).
2. **Satu pemalam, satu pull request yang disemak.** Tiada penggabungan kelompok, tiada
   import pukal terjana ke dalam katalog awam. Setiap entri memperoleh semakannya sendiri.
3. **Bukti mengatasi kepercayaan.** Setiap medan awam dikesan kembali ke repositori
   pencipta asal pada komit yang dipasak. Semakan automatik yang hijau tidak sesekali
   diterima sebagai bukti asal.
4. **Sentiasa tidak rasmi.** Tiada status katalog dipersembahkan sebagai semakan,
   pensijilan atau kelulusan DeepSeek.

## Bagaimana perubahan sampai ke `main`

Semua perubahan sampai ke `main` melalui pull request yang disemak — tiada tolak langsung.
Dasar operasi bagi cabang lalai:

- **Hanya pull request.** Entri katalog, dokumentasi dan perubahan skema semuanya masuk
  melalui PR; PR katalog mesti mematuhi peraturan satu-pemalam-bagi-setiap-cabang di
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Sejarah linear.** PR diintegrasikan supaya `main` mengekalkan sejarah linear yang
  boleh diaudit; sejarah awam yang digabungkan tidak ditulis semula. Jika entri yang
  dikuratori digabungkan sebelum pencipta tampil, pencipta menuntut atau membetulkannya
  dalam sumbangan susulan dan bukannya penulisan semula sejarah.
- **Penyelesaian benang semakan.** Perbualan semakan diselesaikan sebelum penggabungan;
  maklum balas yang belum diselesaikan menghalang integrasi.
- **Penggabungan penyelenggara.** Hanya penyelenggara menggabungkan entri pemalam, dan
  hanya selepas setiap pintu gerbang dalam [CONTRIBUTING.md](../../CONTRIBUTING.md) →
  "Pintu gerbang semakan, perlanggaran dan penggabungan" lulus pada komit PR semasa.

## Semakan `catalog-validation`

Setiap pull request yang menyentuh `catalog/plugins/`, `schemas/` atau aliran kerja itu
sendiri menjalankan tugas `catalog-validation`
(`.github/workflows/validate-catalog.yml`), dipasak kepada CLI yang diterbitkan:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Apa yang ia sahkan** — struktur dan semantik tempatan sahaja:

- Penghuraian YAML selamat bagi setiap entri di bawah `catalog/plugins/`.
- Pematuhan kepada skema awam (lihat [docs/SCHEMA.md](../../docs/SCHEMA.md)).
- Penghuraian ungkapan SPDX, versi SemVer tepat, nilai integriti SHA-512 SRI yang sah.
- Penolakan pendua: tiada ID entri berulang dan tiada kunci
  nod-repositori-plus-subpath kanonik berulang.
- Katalog sifar-entri yang disengajakan lulus (`0 entries valid; catalog is empty`).

**Apa yang TIDAK ia sahkan** — dan oleh itu apa yang tidak pernah dibuktikan oleh semakan
yang hijau:

- Identiti repositori jauh: ia tidak menghubungi GitHub atau menyelesaikan ID nod
  repositori berbanding URL.
- Bukti pada komit yang dipasak: penerangan, lesen, integrasi DSH dan bukti asap tidak
  diambil atau diperiksa.
- Pemilikan pencipta, kiraan bintang, atau perlanggaran dengan pull request terbuka.

Penilaian tersebut tergolong dalam pintu gerbang provenans berasingan penyelenggara,
digunakan sebelum penggabungan dan diterangkan di
[CONTRIBUTING.md](../../CONTRIBUTING.md). Semakan tempatan itu adalah lantai, bukan bar.

## Status pengesahan

Pengesahan direkodkan bagi setiap entri berbanding komit tepat yang dipasak, menggunakan
status yang ditakrifkan dalam skema awam (`eligible`, `verified`, `stale`, `unavailable`,
`archived`, `quarantined`). Dua status positif itu sengaja dibuat sempit:

- `eligible` — struktur awam dan integrasi DSH asli disahkan.
- `verified` — tambahan pula, ujian asap pemasangan lulus untuk sumber atau pakej yang
  dipasak; skema memerlukan rekod ujian asap itu hadir.

Tiada status — atau mana-mana yang lain — adalah kelulusan, jaminan atau pensijilan
keselamatan. Semantik penuh, termasuk bagaimana status berinteraksi dengan kedudukan,
terdapat di [docs/RANKING.md](../../docs/RANKING.md); bentuk rekod terdapat di
[docs/SCHEMA.md](../../docs/SCHEMA.md).

## Tuntutan, pembetulan dan penyingkiran

Borang isu GitHub berstruktur (`.github/ISSUE_TEMPLATE/`) adalah laluan tadbir untuk
mengubah entri yang anda tidak serahkan:

| Borang           | Siapa yang menggunakannya                              | Hasil                                             |
| -------------- | ---------------------------------------- | ---------------------------------------------------- |
| **Tuntutan**      | Pencipta yang pemalamnya dikuratori oleh orang lain | Pemilikan diikat kepada sumber asal; pencipta kemudian boleh menyumbang secara langsung |
| **Pembetulan** | Sesiapa yang mengesan metadata awam yang tidak tepat | Pembetulan yang disemak kepada entri yang terjejas             |
| **Penyingkiran**    | Pencipta yang mahu senarainya dikeluarkan, atau pelapor pelanggaran dasar | Penyingkiran atau kuarantin entri yang disemak |

Peraturan yang digunakan pada ketiga-tiga aliran:

- Tuntutan pemilikan mesti disokong oleh bukti awam yang boleh disahkan (pemilikan
  repositori, pengarangan pakej, metadata manifes atau sejarah sumber yang dipasak) —
  mengulas pada Discussion tidak mewujudkan status pencipta
  ([docs/CREDIT.md](../../docs/CREDIT.md)).
- Masalah keselamatan dalam pemalam yang disenaraikan pergi kepada penyelenggara pemalam
  itu sendiri dahulu; sisi katalog kemudian mengendalikan pembetulan atau kuarantin tanpa
  menerbitkan butiran eksploitasi ([SECURITY.md](../../SECURITY.md)).
- Jangan sesekali sertakan kelayakan masuk, butiran hubungan persendirian atau rahsia lain
  dalam borang.

## Peranan

- **Pencipta** memiliki pemalam mereka dan keutamaan senarai mereka. Mereka boleh
  menyumbang secara langsung, meluluskan kurasi komuniti, atau menuntut/membetulkan/
  mengeluarkan entri sedia ada.
- **Penyumbang komuniti** boleh mengkuratori entri untuk pencipta yang belum menyumbang,
  di bawah peraturan hubungan yang menghormati dan kredit di
  [docs/CREDIT.md](../../docs/CREDIT.md). Kurasi tidak pernah mengatasi sumbangan pencipta
  langsung yang datang kemudian.
- **Penyelenggara** menyemak, menggunakan pintu gerbang provenans, menyelesaikan
  perlanggaran dan menggabungkan. Mereka juga menyelenggara laman web
  ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) dan CLI yang
  diterbitkan daripada sumber persendirian; data awam, skema dan dasar repositori ini
  adalah apa yang digunakan oleh permukaan tersebut.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
