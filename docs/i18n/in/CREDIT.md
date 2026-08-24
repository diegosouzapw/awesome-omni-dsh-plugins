# Kredit Kreator dan Prioritas Pull Request

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Bahasa Indonesia**

Katalog ada untuk membuat karya DSH independen dapat ditemukan tanpa mengambil kepemilikan dari
para kreatornya. Entri publik mengutip repositori asli dan commit sumber yang tidak dapat
berubah.

## Prioritas untuk plugin yang sama

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Pull request yang dibuka oleh kreator plugin atau organisasi pemilik.
2. Pull request komunitas yang disetujui secara eksplisit atau ditulis bersama oleh kreator.
3. Pull request komunitas yang sudah ada dan valid.
4. Pull request otomasi katalog.
5. Kandidat privat tanpa pull request publik.

Pull request langsung dari kreator selalu diutamakan dan menggantikan pull request kurasi
komunitas atau otomasi yang terbuka apa pun untuk plugin kanonis yang sama, terlepas dari mana
yang dibuka lebih dulu atau lebih jauh perkembangannya. Pull request kreator menjadi wahana
tinjauan; branch mereka tidak pernah ditimpa, di-force-push, atau dipindahkan ke pull request
kurasi. Jika entri kurasi sudah tergabung, riwayat tetap utuh dan kreator dapat mengklaim atau
mengoreksinya dalam kontribusi baru.

## Atribusi publik

Setiap entri katalog membawa handle GitHub publik kreator, repositori asli, node ID repositori,
subpath plugin, dan commit penuh yang dipatok. Profil publik kreator diturunkan dari satu
handle itu alih-alih disimpan sebagai identitas kedua. Gerbang provenance maintainer yang
terpisah menyelesaikan node ID dan menolak ketidakcocokan URL repositori. Deskripsi pull request
sebaiknya menuliskan `Created by @handle` dan menyertakan metadata repositori sumber dan commit
sumber.

Seseorang yang memposting atau berkomentar di Discussion tidak otomatis diperlakukan sebagai
kreator. Kepemilikan harus didukung oleh pemilik repositori atau organisasi, kepengarangan
paket, metadata manifes, atau riwayat sumber yang dipatok persis.

## Identitas Git

<!-- creator-first:source-bound-git-identity -->

Kepengarangan commit dan kepengarangan pull request adalah terpisah. Pull request yang berasal
dari kreator menjaga kreator sebagai penulis pull request, dan commit mereka menjaga
kepengarangan secara alami. Akun maintainer atau otomasi dapat muncul sebagai committer atau
sebagai co-author yang terverifikasi, tetapi tidak boleh menggantikan kepengarangan kreator.

Untuk commit kurasi, gunakan kreator sebagai penulis Git atau tambahkan trailer
`Co-authored-by` hanya ketika identitas persisnya terikat ke sumber dan dapat diverifikasi
secara publik, misalnya identitas yang sudah melekat pada commit kreator di repositori asli.
Jangan pernah menebak email, mengarang alamat noreply, atau menggunakan alamat privat yang
ditemukan di luar sumber publik yang berwenang.

Ketika identitas Git yang terverifikasi tidak tersedia, kurator atau akun otomasi menjadi
penulis commit dan sebagai gantinya memberikan kredit terlihat yang eksplisit:
`Created by @handle`, profil publik yang cocok, dan tautan ke repositori asli di entri dan pull
request. Atribusi YAML yang terlihat selalu diwajibkan terlepas dari pemetaan identitas Git.
Pull request langsung dari kreator yang datang belakangan menggantikan pull request kurasi yang
terbuka alih-alih mewarisi riwayat sintetisnya.

## Sebutan kreator yang hormat

Pull request kurasi menggunakan satu sebutan `@creator` publik yang hormat di deskripsinya, di
samping tautan repositori asli. Ia boleh mengundang tinjauan atau pull request langsung
pengganti. Jangan mengulang sebutan, membuka issue promosi, cross-post, atau mengirim pesan
langsung yang tidak diminta.

## Lisensi katalog versus lisensi hulu

Fakta katalog dan metadata editorial YAML didedikasikan di bawah CC0-1.0. Dedikasi itu tidak
mengubah lisensi plugin hulu. Kode, dokumentasi, tangkapan layar, logo, dan materi kreatif lain
milik hulu tetap tunduk pada lisensi dan pemilik aslinya.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
