# Berkontribusi

> 🌐 [English](../../CONTRIBUTING.md) · **Bahasa Indonesia (id)**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Terima kasih telah membantu meningkatkan katalog ini. Kontribusi mengutamakan kreator: gunakan
bukti dari repositori asli, pertahankan atribusi, dan pastikan setiap plugin dapat ditinjau
secara independen. Katalog dimulai kosong secara sengaja; tidak ada entri yang diterima tanpa
pull request tersendiri yang ditinjau.

## Mulai dari kreator

Pull request yang dibuka langsung oleh kreator plugin atau organisasi pemiliknya selalu
diutamakan. Jika kreator siap berkontribusi, gunakan branch dan pull request milik mereka,
bukan merekonstruksi ulang pekerjaan mereka di branch kurator atau otomatisasi.

Kurasi komunitas diterima ketika membantu kreator yang belum membuka pull request. Kurasi
tersebut tidak membentuk kepemilikan atau prioritas atas kontribusi langsung dari kreator yang
menyusul kemudian.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Satu plugin per branch dan pull request

Buat branch khusus untuk satu plugin dan buka satu pull request dari branch tersebut. Branch dan
pull request tersebut harus membuat atau mengubah tepat satu file YAML di bawah
`catalog/plugins/`. Jangan mencampur plugin, pembersihan dokumentasi, indeks yang dihasilkan
otomatis, atau pemeliharaan yang tidak terkait ke dalam branch atau pull request tersebut.

ID entri dan nama file harus memiliki nilai lowercase kebab-case yang sama. Maintainer meninjau
dan menggabungkan setiap pull request plugin secara individual; batch yang berisi beberapa
plugin tidak dipecah atau digabungkan sebagian.

## Menelusuri sumber asli

Setiap bidang publik harus direkonstruksi dari repositori kreator asli, paket, manifest, README,
lisensi, atau rilis pada commit yang dipatok. Jangan menyalin prosa, penetapan kategori, tangkapan
layar, peringkat, badge, atau metadata hasil generate dari katalog atau agregator lain. Tautan
yang ditemukan di proyek umbrella, marketplace, daftar, atau agregator hanyalah petunjuk, bukan
bukti dan bukan sumber plugin.

Jangan pernah mengajukan umbrella, agregator, marketplace, katalog installer, atau daftar sebagai
entri katalog, bahkan ketika itu dapat diinstal secara independen. Gunakan itu hanya sebagai
petunjuk dan telusuri setiap plugin anak yang dapat diinstal secara independen ke kreator dan
repositori aslinya yang sebenarnya. Plugin di dalam monorepo asli milik kreatornya sendiri dapat
diajukan dari subpath persisnya, tetapi harus mengikuti kebijakan bintang monorepo di bawah ini.

## Bukti yang diperlukan

Sertakan semua hal berikut dalam pull request:

- URL publik kanonis dari repositori asli dan repository node ID-nya yang tidak berubah.
  Maintainer menyelesaikan node ID tersebut dan menolak ketidakcocokan URL pada gerbang
  provenance yang terpisah.
- Handle GitHub publik kreator dan URL profil publik yang cocok. YAML menyimpan handle sekali;
  URL profil diturunkan sebagai `https://github.com/<handle>`.
- OID commit sumber 40 karakter penuh dan subpath plugin yang tepat, atau `null` untuk plugin
  di root repositori.
- Deskripsi bahasa Inggris yang dibatasi beserta jalur buktinya pada commit yang dipatok.
- `kind` artefak, kategori utama, dan tag yang dipilih dari
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Ekspresi lisensi SPDX upstream yang lengkap, dibuktikan pada commit yang dipatok.
- Deskriptor instalasi kanonis yang dipatok ke versi npm yang tepat, atau ke repositori sumber,
  commit lengkap, dan subpath. Deskriptor tersebut adalah data, bukan perintah shell.
- Bukti integrasi DSH native beserta jalurnya pada commit yang dipatok.
- Bukti smoke test yang sudah ada dan tidak sensitif untuk pin artefak yang tepat itu, atau
  nilai eksplisit `not run`. Jangan menginstal plugin atau menjalankan `preinstall`, `install`,
  `postinstall`, `prepare`, atau kode siklus hidup paket/plugin lainnya hanya untuk menyiapkan
  kontribusi katalog.
- Untuk repositori dedicated, jumlah bintang yang dapat diverifikasi untuk repositori persis
  itu, beserta sumber publik dan waktu pemeriksaan. Untuk plugin monorepo, gunakan kebijakan
  null yang diwajibkan di bawah ini.
- Provenance Discussion atau komentar publik jika ada; jika tidak, gunakan `null`.
- Nilai `unofficial: true` yang dapat dibaca mesin.

Jika belum ada smoke test yang memenuhi syarat, gunakan `verification.status: eligible` dan
`verification.smokeTest: null`. Gunakan `verified` hanya ketika bukti smoke test yang dapat
ditinjau untuk pin yang tepat itu ada. Tidak satu pun dari kedua status tersebut merupakan
dukungan atau sertifikasi keamanan.

Jangan pernah mengirimkan kredensial, cookie, alamat email pribadi, sumber yang belum
dipublikasikan, atau rahasia lainnya.

## Aturan YAML dan skema

Buat `catalog/plugins/<plugin-id>.yaml` dan validasi terhadap
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` harus sama dengan nama
dasar file dan harus dimulai dengan namespace Anda: handle `creator.github` Anda dalam huruf
kecil (setiap rangkaian karakter di luar `[a-z0-9]` menjadi satu `-`) diikuti oleh `-`, misalnya
`some-creator-my-plugin` untuk handle `Some-Creator`. Validasi katalog menegakkan keduanya. Skema
adalah sumber kebenaran untuk nama bidang dan nilai yang diizinkan;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) mendefinisikan cara memilih satu jenis artefak,
kategori utama, tag, dan cakupan repositori.

Deskriptor npm harus berisi nama paket yang valid dan versi yang tepat. Skema publik menolak
nilai yang menyerupai opsi dan yang tak terbatas, tetapi tidak mengimplementasikan ulang SemVer
atau SRI: validasi katalog harus mem-parsing versi, mewajibkan SemVer yang tepat, dan mem-parsing
nilai integrity apa pun sebagai SHA-512 SRI yang valid. Deskriptor sumber terikat pada
`source.repository`, `source.commit`, dan `source.subpath` tanpa menduplikasi nilai sumber yang
dapat berubah.

Installer harus menggunakan array argumen, menonaktifkan eksekusi shell, dan menempatkan
terminator opsi sebelum nilai posisional yang disediakan katalog jika perintah yang dipanggil
mendukungnya. Validasi pengajuan tidak boleh memanggil installer atau siklus hidup plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` adalah pemeriksaan struktural dan semantik lokal yang bersifat baca-saja.
Perintah ini mem-parsing YAML yang aman, memvalidasi skema publik, mem-parsing ekspresi SPDX,
mewajibkan SemVer yang tepat dan SHA-512 SRI yang valid, serta menolak ID duplikat dan kunci
gabungan repository-node-plus-subpath kanonis. Perintah ini tidak menghubungi GitHub, tidak
menyelesaikan identitas repositori, dan tidak memeriksa jalur bukti pada commit yang dipatok.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Sebelum sebuah entri mencapai status `eligible`, maintainer secara terpisah menyelesaikan
repositori kanonis dan node ID, mengikat kreator ke sumber asli, dan memeriksa deskripsi,
lisensi, integrasi DSH, dan bukti smoke test yang dideklarasikan pada `source.commit`. Hasil
validasi lokal yang hijau bukanlah bukti provenance atau asal-usul.

## Bintang repositori

Hanya bintang yang dapat diverifikasi milik repositori plugin dedicated yang tepat yang boleh
dicatat. Bintang proyek induk tidak boleh pernah diatribusikan ke plugin yang disimpan di dalam
monorepo yang lebih luas. Entri monorepo tetap memenuhi syarat untuk bagian katalog fungsional
tetapi harus mendeklarasikan:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Entri dedicated menggunakan `repositoryScope: dedicated`, `starsPolicy: exact-repository`, dan
jumlah bintang non-negatif yang diamati pada repositori yang sama. Baca
[docs/RANKING.md](../../docs/RANKING.md) sebelum mengajukan data popularitas.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Prioritas kreator dan kontak yang menghormati

Untuk plugin kanonis yang sama, urutan prioritasnya adalah:

1. Pull request yang dibuka oleh kreator atau organisasi pemiliknya.
2. Pull request komunitas yang secara eksplisit disetujui oleh kreator.
3. Pull request kurasi komunitas yang sudah ada dan valid.
4. Pull request otomatisasi katalog.

Pull request langsung dari kreator selalu mengesampingkan pull request kurasi atau otomatisasi
yang sedang terbuka, terlepas dari mana yang dibuka lebih dulu atau lebih maju. Pull request
kreator menjadi wahana tinjauan; maintainer tidak melakukan force-push pada branch kreator atau
memindahkan pekerjaan mereka ke pull request kurasi. Jika entri hasil kurasi sudah digabungkan,
riwayat publik tidak ditulis ulang. Kreator dapat menggunakan permintaan klaim atau koreksi lalu
mengontribusikan pull request lanjutan secara langsung.

Pull request hasil kurasi sebaiknya menggunakan satu penyebutan publik `@creator` yang
menghormati dalam deskripsinya, di samping tautan ke repositori asli, mengundang kreator untuk
meninjau atau menggantinya dengan pull request langsung. Jangan mengulangi penyebutan tersebut,
membuka issue promosi, cross-post, mengirim pesan langsung tanpa diminta, atau menyepam kreator
dengan cara lain.

<!-- creator-first:source-bound-git-identity -->

Pull request dan commit yang dibuat langsung oleh kreator secara alami mempertahankan kredit
kreator. Commit hasil kurasi boleh menggunakan Git authorship kreator atau trailer
`Co-authored-by` hanya dengan identitas yang terikat sumber dan dapat diverifikasi secara publik.
Jangan pernah mengarang atau menebak alamat email. Ketika tidak ada identitas Git yang
terverifikasi, kurator yang menjadi author commit dan memberi kredit eksplisit yang terlihat
`Created by @handle` beserta tautan repositori asli di YAML dan pull request. Akun maintainer
atau otomatisasi boleh menjadi committer atau co-author yang terverifikasi, tetapi tidak boleh
menggantikan authorship kreator. Lihat [docs/CREDIT.md](../../docs/CREDIT.md) untuk kebijakan
lengkapnya.

## Perintah validasi dan ketersediaan

CLI npm dipublikasikan sebagai `omni-dsh-plugins@1.0.1`, sehingga perintah di bawah ini tersedia
lewat `npx` hari ini. Gunakan persis seperti yang tertulis; kontributor tidak boleh mengarang
perintah pengganti.

Jalankan perintah-perintah ini dari root repositori:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` hanya melakukan pemeriksaan YAML lokal, skema, SPDX, SemVer yang tepat,
SHA-512 SRI, dan duplikat yang dijelaskan di atas, dan menerima katalog nol-entri yang memang
disengaja. Perintah ini tidak membuktikan identitas repositori jarak jauh atau bukti sumber yang
dipatok. Perintah lainnya memeriksa dokumentasi publik yang diwajibkan dan formulir issue GitHub
terstruktur. Lulus perintah-perintah ini secara lokal tidak melonggarkan persyaratan bukti;
maintainer tetap menerapkan setiap gerbang rilis yang sesuai sebelum menggabungkan.

## Gerbang tinjauan, tabrakan, dan penggabungan

Maintainer menerapkan setiap gerbang pada commit pull request saat ini sebelum menggabungkan:

1. **Cakupan:** satu branch khusus, satu file YAML plugin, dan tidak ada perubahan yang tidak
   terkait.
2. **Identitas asli:** kreator, repositori kanonis, node ID, commit lengkap, dan subpath sesuai.
3. **Skema dan bukti:** YAML, kategori, SPDX, pin instalasi, bukti DSH, dan status smoke test
   konsisten secara internal tanpa menjalankan kode siklus hidup plugin.
4. **Popularitas:** bintang dedicated dapat diverifikasi pada repositori yang tepat, atau
   bintang monorepo bernilai `null` dengan `undefined-parent-repository`.
5. **Dokumentasi dan formulir:** dokumen publik, fence Markdown, dan formulir terstruktur tetap
   valid.
6. **Tabrakan dan deduplikasi:** tidak ada entri yang sudah digabungkan atau pull request
   terbuka yang merepresentasikan plugin kanonis yang sama.

Nama atau ID yang berbeda tidak membuat plugin duplikat menjadi berbeda. Perlakukan repository
node ID dan subpath yang sama, paket kanonis yang sama, atau target instalasi lain yang
terbukti identik sebagai tabrakan. Selesaikan alias dan pull request yang bersaing sebelum
digabungkan. Pull request langsung dari kreator memenangkan tabrakan dengan kurasi atau
otomatisasi; jika tidak, maintainer memilih satu wahana tinjauan dan menutup atau mengalihkan
duplikat, bukan menggabungkan keduanya.

Hanya maintainer yang menggabungkan sebuah plugin setelah semua gerbang lulus. Setiap plugin
yang diterima digabungkan secara individual; validasi, kurasi, atau otomatisasi tidak menyiratkan
penggabungan otomatis atau batch.

## Daftar periksa pull request

- [ ] Saya menggunakan satu branch khusus dan PR ini mengubah tepat satu entri plugin.
- [ ] Sumbernya adalah repositori kreator asli, bukan umbrella atau agregator.
- [ ] Handle/profil kreator, repositori, node ID, subpath, dan commit lengkap dibuktikan.
- [ ] Kind, kategori, dan tag mengikuti `docs/CATEGORIES.md`.
- [ ] Lisensi SPDX dan deskriptor instalasi yang dipatok dibuktikan.
- [ ] Integrasi DSH native dan hasil smoke test atau status `not run` dibuktikan.
- [ ] Saya tidak menjalankan kode siklus hidup plugin atau paket untuk menyiapkan kontribusi ini.
- [ ] Bintang dedicated dapat diverifikasi, atau bintang monorepo menggunakan kebijakan null
      yang diwajibkan.
- [ ] Saya memeriksa entri yang sudah ada dan pull request terbuka untuk plugin kanonis yang
      sama.
- [ ] Entri secara eksplisit bersifat tidak resmi dan tidak berisi rahasia atau data pribadi.

## Kebijakan bahasa

Dokumentasi peluncuran dan deskripsi katalog hanya berbahasa Inggris. Peluncuran 43-lokal tetap
menjadi item backlog pasca-MVP; jangan menambahkan dokumen lokal kosong atau terjemahan massal
otomatis.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
