# Kredit Kreator dan Prioritas Pull Request

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Bahasa Indonesia**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Katalog ini ada untuk membuat karya DSH independen dapat ditemukan tanpa mengambil alih
kepemilikan dari para kreatornya. Entri publik mengutip repositori asli dan commit sumber yang
tidak berubah.

## Prioritas untuk plugin yang sama

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Pull request yang dibuka oleh kreator plugin atau organisasi pemiliknya.
2. Pull request komunitas yang secara eksplisit disetujui atau ditulis bersama oleh kreator.
3. Pull request komunitas yang sudah ada dan valid.
4. Pull request otomatisasi katalog.
5. Kandidat privat tanpa pull request publik.

Pull request langsung dari kreator selalu diutamakan dan mengesampingkan kurasi komunitas atau
pull request otomatisasi yang sedang terbuka untuk plugin kanonis yang sama, terlepas dari mana
yang dibuka lebih dulu atau lebih maju. Pull request kreator menjadi wahana tinjauan; branch
mereka tidak pernah ditimpa, di-force-push, atau dipindahkan ke pull request kurasi. Jika entri
hasil kurasi sudah digabungkan, riwayat tetap utuh dan kreator dapat mengklaim atau
mengoreksinya dalam kontribusi baru.

## Atribusi publik

Setiap entri katalog membawa handle GitHub publik kreator, repositori asli, repository node ID,
subpath plugin, dan commit lengkap yang dipatok. Profil kreator publik diturunkan dari satu
handle tersebut, bukan disimpan sebagai identitas kedua. Gerbang provenance maintainer yang
terpisah menyelesaikan node ID dan menolak ketidakcocokan URL repositori. Deskripsi pull
request sebaiknya menyatakan `Created by @handle` dan menyertakan metadata repositori sumber
serta commit sumber.

Seseorang yang memposting atau berkomentar pada Discussion tidak otomatis diperlakukan sebagai
kreator. Kepemilikan harus didukung oleh pemilik repositori atau organisasi, kepenulisan paket,
metadata manifest, atau riwayat source yang dipatok secara persis.

## Identitas Git

<!-- creator-first:source-bound-git-identity -->

Authorship commit dan authorship pull request adalah dua hal yang terpisah. Pull request yang
berasal dari kreator mempertahankan kreator sebagai penulis pull request, dan commit mereka
mempertahankan authorship secara alami. Akun maintainer atau otomatisasi boleh muncul sebagai
committer atau sebagai co-author yang terverifikasi, tetapi tidak boleh menggantikan authorship
kreator.

Untuk commit hasil kurasi, gunakan kreator sebagai Git author atau tambahkan trailer
`Co-authored-by` hanya ketika identitas yang tepat terikat sumber dan dapat diverifikasi secara
publik, seperti identitas yang sudah melekat pada commit kreator di repositori asli. Jangan
pernah menebak alamat email, membuat-buat alamat noreply, atau menggunakan alamat privat yang
ditemukan di luar sumber publik yang berwenang.

Ketika identitas Git terverifikasi tidak tersedia, kurator atau akun otomatisasi yang menjadi
author commit dan memberi kredit eksplisit yang terlihat sebagai gantinya: `Created by @handle`,
profil publik yang cocok, dan tautan ke repositori asli dalam entri dan pull request. Atribusi
YAML yang terlihat selalu diwajibkan secara independen dari pemetaan identitas Git. Pull
request langsung dari kreator yang menyusul kemudian menggantikan pull request hasil kurasi yang
terbuka, bukan mewarisi riwayat sintetiknya.

## Penyebutan kreator yang menghormati

Pull request hasil kurasi menggunakan satu penyebutan publik `@creator` yang menghormati dalam
deskripsinya, di samping tautan repositori asli. Ini dapat mengundang tinjauan atau pull request
langsung sebagai penggantinya. Jangan mengulangi penyebutan tersebut, membuka issue promosi,
cross-post, atau mengirim pesan langsung tanpa diminta.

## Lisensi katalog versus lisensi upstream

Fakta katalog dan metadata editorial YAML didedikasikan di bawah CC0-1.0. Dedikasi tersebut
tidak mengubah lisensi plugin upstream. Kode, dokumentasi, tangkapan layar, logo, dan materi
kreatif lainnya dari upstream tetap tunduk pada lisensi dan pemiliknya yang asli.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
