# Berkontribusi

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Bahasa Indonesia**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Terima kasih telah turut meningkatkan katalog. Kontribusi mengutamakan kreator: gunakan bukti
dari repositori asli, pertahankan atribusi, dan jaga agar setiap plugin dapat ditinjau secara
independen. Katalog dimulai dalam keadaan kosong berdasarkan desain; tidak ada entri yang
diterima tanpa pull request-nya sendiri yang ditinjau.

## Mulai dari kreator

Pull request yang dibuka langsung oleh kreator plugin atau organisasi pemiliknya selalu
diutamakan. Jika kreator siap berkontribusi, gunakan branch dan pull request mereka alih-alih
menciptakan ulang karya mereka di branch kurator atau otomasi.

Kurasi komunitas disambut baik ketika membantu kreator yang belum membuka pull request. Hal itu
tidak menetapkan kepemilikan atau prioritas atas kontribusi langsung kreator yang datang
belakangan.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Satu plugin per branch dan pull request

Buat branch khusus untuk satu plugin dan buka satu pull request dari branch tersebut. Branch
dan pull request harus membuat atau mengubah tepat satu file YAML di bawah `catalog/plugins/`.
Jangan mencampurkan plugin lain, pembersihan dokumentasi, indeks yang dihasilkan, atau
pemeliharaan yang tidak terkait ke dalam branch atau pull request tersebut.

ID entri dan nama file harus berupa nilai kebab-case huruf kecil yang sama. Maintainer meninjau
dan menggabungkan setiap pull request plugin secara individual; batch yang berisi beberapa
plugin tidak dipecah atau digabungkan sebagian.

## Menyelesaikan sumber asli

Setiap bidang publik harus direkonstruksi dari repositori kreator asli, paket, manifes, README,
lisensi, atau rilis pada commit yang dipatok. Jangan menyalin prosa, penugasan kategori,
tangkapan layar, peringkat, badge, atau metadata yang dihasilkan dari katalog atau agregator
lain. Tautan yang ditemukan di proyek payung, marketplace, daftar, atau agregator hanyalah
petunjuk, bukan bukti dan bukan sumber plugin.

Jangan pernah mengajukan proyek payung, agregator, marketplace, katalog installer, atau daftar
sebagai entri katalog, meskipun dapat diinstal secara independen. Gunakan hanya sebagai petunjuk
dan selesaikan setiap plugin anak yang dapat diinstal secara independen ke kreator sebenarnya
dan repositori aslinya. Plugin di dalam monorepo asli milik kreatornya dapat diajukan dari
subpath persisnya, tetapi harus mengikuti kebijakan bintang monorepo di bawah.

## Bukti yang diperlukan

Berikan semua hal berikut dalam pull request:

- URL publik kanonis dari repositori asli dan node ID repositorinya yang tidak dapat berubah.
  Maintainer menyelesaikan node ID tersebut dan menolak ketidakcocokan URL di gerbang
  provenance yang terpisah.
- Handle GitHub publik kreator dan URL profil publik yang cocok. YAML menyimpan handle sekali
  saja; URL profil diturunkan sebagai `https://github.com/<handle>`.
- OID commit sumber 40 karakter penuh dan subpath plugin yang persis, atau `null` untuk plugin
  di akar repositori.
- Deskripsi berbahasa Inggris yang dibatasi dan path buktinya pada commit yang dipatok tersebut.
- `kind` artefak, kategori utama, dan tag yang dipilih dari
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Ekspresi lisensi SPDX hulu yang lengkap, dibuktikan pada commit yang dipatok.
- Deskriptor instalasi kanonis yang dipatok ke versi npm persis, atau ke repositori sumber,
  commit penuh, dan subpath. Deskriptor adalah data, tidak pernah berupa perintah shell.
- Bukti integrasi DSH native dan path-nya pada commit yang dipatok.
- Bukti smoke yang sudah ada dan tidak sensitif untuk pin artefak persis tersebut, atau nilai
  eksplisit `not run`. Jangan menginstal plugin atau mengeksekusi `preinstall`, `install`,
  `postinstall`, `prepare`, atau kode siklus hidup paket/plugin lain hanya untuk menyiapkan
  kontribusi katalog.
- Untuk repositori dedicated, jumlah bintang yang dapat diverifikasi untuk repositori persis
  tersebut, beserta sumber publik dan waktu pemeriksaannya. Untuk plugin monorepo, gunakan
  kebijakan null yang diwajibkan di bawah.
- Provenance Discussion atau komentar publik jika ada; jika tidak, gunakan `null`.
- Nilai `unofficial: true` yang dapat dibaca mesin.

Jika belum ada smoke test yang memenuhi syarat, gunakan `verification.status: eligible` dan
`verification.smokeTest: null`. Gunakan `verified` hanya ketika bukti smoke yang dapat ditinjau
untuk pin persis tersebut ada. Kedua status tersebut bukanlah dukungan atau sertifikasi
keamanan.

Jangan pernah mengirimkan kredensial, cookie, alamat email pribadi, sumber yang belum
dipublikasikan, atau rahasia lainnya.

## Aturan YAML dan skema

Buat `catalog/plugins/<plugin-id>.yaml` dan validasi terhadap
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` harus sama dengan
basename file dan harus dimulai dengan namespace Anda: handle `creator.github` Anda dalam huruf
kecil (setiap rangkaian karakter di luar `[a-z0-9]` menjadi satu `-`) diikuti `-`, misalnya
`some-creator-my-plugin` untuk handle `Some-Creator`. Validasi katalog memberlakukan keduanya. Skema adalah sumber kebenaran untuk
nama bidang dan nilai yang diizinkan; [docs/CATEGORIES.md](../../docs/CATEGORIES.md)
mendefinisikan cara memilih satu jenis artefak, kategori utama, tag, dan ruang lingkup
repositori.

Deskriptor npm harus memuat nama paket yang valid dan versi persis. Skema publik menolak nilai
yang menyerupai opsi dan nilai yang tidak terbatas, tetapi tidak mengimplementasikan ulang
SemVer atau SRI: validasi katalog harus mem-parse versi, mewajibkan SemVer persis, dan
mem-parse nilai integritas apa pun sebagai SHA-512 SRI yang valid. Deskriptor sumber terikat ke
`source.repository`, `source.commit`, dan `source.subpath` tanpa menduplikasi nilai sumber yang
dapat berubah.

Installer harus menggunakan array argumen, menonaktifkan eksekusi shell, dan menempatkan
terminator opsi sebelum nilai posisional yang disediakan katalog ketika perintah yang dipanggil
mendukungnya. Validasi pengajuan tidak boleh memanggil installer atau siklus hidup plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` adalah pemeriksaan struktur dan semantik lokal yang baca-saja. Ia mem-parse
YAML yang aman, memvalidasi skema publik, mem-parse ekspresi SPDX, mewajibkan SemVer persis dan
SHA-512 SRI yang valid, dan menolak ID duplikat serta kunci kanonis
repository-node-plus-subpath. Ia tidak menghubungi GitHub, menyelesaikan identitas repositori,
atau memeriksa path bukti pada commit yang dipatok.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Sebelum entri mencapai `eligible`, maintainer secara terpisah menyelesaikan repositori kanonis
dan node ID, mengikat kreator ke sumber asli, dan memeriksa deskripsi, lisensi, integrasi DSH,
serta bukti smoke yang dideklarasikan pada `source.commit`. Hasil validasi lokal yang hijau
bukanlah bukti provenance atau asal.

## Bintang repositori

Hanya bintang yang secara terverifikasi milik repositori plugin dedicated persis tersebut yang
boleh dicatat. Bintang proyek induk tidak boleh pernah diatribusikan ke plugin yang disimpan di
dalam monorepo yang lebih luas. Entri monorepo tetap memenuhi syarat untuk bagian katalog yang
fungsional tetapi harus mendeklarasikan:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Entri dedicated menggunakan `repositoryScope: dedicated`, `starsPolicy: exact-repository`, dan
jumlah bintang non-negatif yang diamati pada repositori yang sama. Baca
[docs/RANKING.md](../../docs/RANKING.md) sebelum mengirimkan data popularitas.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Prioritas kreator dan kontak yang hormat

Untuk plugin kanonis yang sama, prioritasnya adalah:

1. Pull request yang dibuka oleh kreator atau organisasi pemilik.
2. Pull request komunitas yang disetujui secara eksplisit oleh kreator.
3. Pull request kurasi komunitas yang sudah ada dan valid.
4. Pull request otomasi katalog.

Pull request langsung dari kreator menggantikan pull request kurasi atau otomasi yang terbuka
apa pun, terlepas dari mana yang dibuka lebih dulu atau lebih jauh perkembangannya. Pull
request kreator menjadi wahana tinjauan; maintainer tidak melakukan force-push pada branch
kreator atau memindahkan karya mereka ke pull request kurasi. Jika entri kurasi sudah
tergabung, riwayat publik tidak ditulis ulang. Kreator dapat menggunakan permintaan klaim atau
koreksi lalu berkontribusi dengan pull request tindak lanjut secara langsung.

Pull request kurasi sebaiknya menggunakan satu sebutan `@creator` publik yang hormat di
deskripsinya, di samping tautan ke repositori asli, mengundang kreator untuk meninjau atau
menggantinya dengan pull request langsung. Jangan mengulang sebutan, membuka issue promosi,
cross-post, mengirim pesan langsung yang tidak diminta, atau melakukan spam terhadap kreator
dengan cara lain.

<!-- creator-first:source-bound-git-identity -->

Pull request dan commit yang ditulis kreator menjaga kredit kreator secara alami. Commit kurasi
dapat menggunakan kepengarangan Git kreator atau trailer `Co-authored-by` hanya dengan identitas
yang terikat ke sumber dan dapat diverifikasi secara publik. Jangan pernah mengarang atau
menebak email. Ketika identitas Git yang terverifikasi tidak tersedia, kurator menjadi penulis
commit dan memberikan kredit `Created by @handle` yang eksplisit beserta tautan repositori asli
di YAML dan pull request. Akun maintainer atau otomasi boleh menjadi committer atau co-author
yang terverifikasi, tetapi tidak boleh menggantikan kepengarangan kreator. Lihat
[docs/CREDIT.md](../../docs/CREDIT.md) untuk kebijakan lengkapnya.

## Perintah validasi dan ketersediaan

CLI npm dipublikasikan sebagai `omni-dsh-plugins@1.0.1`, sehingga perintah di bawah tersedia
melalui `npx` hari ini. Gunakan persis seperti tertulis; kontributor tidak perlu menciptakan
perintah pengganti.

Jalankan perintah ini dari akar repositori:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` hanya melakukan pemeriksaan YAML, skema, SPDX, SemVer persis, SHA-512 SRI,
dan duplikat secara lokal seperti dijelaskan di atas, dan menerima katalog kosong-nol-entri yang
sengaja. Ia tidak membuktikan identitas repositori jarak jauh atau bukti sumber yang dipatok.
Perintah lain memeriksa dokumentasi publik yang diwajibkan dan formulir issue GitHub
terstruktur. Lolosnya perintah ini secara lokal tidak melonggarkan persyaratan bukti; maintainer
tetap menerapkan setiap gerbang rilis terkait sebelum menggabungkan.

## Gerbang tinjauan, tabrakan, dan penggabungan

Maintainer menerapkan setiap gerbang pada commit pull request saat ini sebelum menggabungkan:

1. **Cakupan:** satu branch khusus, satu file YAML plugin, dan tidak ada perubahan yang tidak
   terkait.
2. **Identitas asli:** kreator, repositori kanonis, node ID, commit penuh, dan subpath cocok.
3. **Skema dan bukti:** YAML, kategori, SPDX, pin instalasi, bukti DSH, dan status smoke
   konsisten secara internal tanpa mengeksekusi kode siklus hidup plugin.
4. **Popularitas:** bintang dedicated dapat diverifikasi pada repositori persis tersebut, atau
   bintang monorepo bernilai `null` dengan `undefined-parent-repository`.
5. **Dokumentasi dan formulir:** dokumen publik, fence Markdown, dan formulir terstruktur tetap
   valid.
6. **Tabrakan dan deduplikasi:** tidak ada entri yang sudah tergabung atau pull request terbuka
   yang merepresentasikan plugin kanonis yang sama.

Nama atau ID yang berbeda tidak membuat plugin duplikat menjadi berbeda. Perlakukan node ID
repositori dan subpath yang sama, paket kanonis yang sama, atau target instalasi lain yang
terbukti identik sebagai tabrakan. Selesaikan alias dan pull request yang bersaing sebelum
penggabungan. Pull request langsung dari kreator memenangkan tabrakan dengan kurasi atau
otomasi; jika tidak, maintainer memilih satu wahana tinjauan dan menutup atau mengalihkan
duplikat alih-alih menggabungkan keduanya.

Hanya maintainer yang menggabungkan plugin setelah semua gerbang lolos. Setiap plugin yang
diterima digabungkan secara individual; validasi, kurasi, atau otomasi tidak berarti
penggabungan otomatis atau batch.

## Checklist pull request

- [ ] Saya menggunakan satu branch khusus dan PR ini mengubah tepat satu entri plugin.
- [ ] Sumbernya adalah repositori kreator asli, bukan proyek payung atau agregator.
- [ ] Handle/profil kreator, repositori, node ID, subpath, dan commit penuh memiliki bukti.
- [ ] Kind, kategori, dan tag mengikuti `docs/CATEGORIES.md`.
- [ ] Lisensi SPDX dan deskriptor instalasi yang dipatok memiliki bukti.
- [ ] Integrasi DSH native dan hasil smoke atau status `not run` memiliki bukti.
- [ ] Saya tidak mengeksekusi kode siklus hidup plugin atau paket untuk menyiapkan kontribusi ini.
- [ ] Bintang dedicated dapat diverifikasi, atau bintang monorepo menggunakan kebijakan null yang diwajibkan.
- [ ] Saya memeriksa entri yang sudah ada dan pull request terbuka untuk plugin kanonis yang sama.
- [ ] Entri ini secara eksplisit tidak resmi dan tidak memuat rahasia atau data pribadi privat.

## Kebijakan bahasa

Dokumentasi peluncuran dan deskripsi katalog hanya berbahasa Inggris. Rilis 43 locale tetap
menjadi item backlog pasca-MVP; jangan menambahkan dokumen locale kosong atau terjemahan massal
otomatis.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
