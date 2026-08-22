# Metodologi Peringkat

> 🌐 [English](../../docs/RANKING.md) · **Bahasa Indonesia (id)**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Peringkat adalah tampilan transparan atas entri katalog publik yang sudah digabungkan. Peringkat
ini tidak pernah menggunakan skor gabungan yang tersembunyi dan tidak pernah memperlakukan
bintang dari proyek induk yang lebih luas sebagai popularitas plugin.

## Predikat Top Plugins by Stars

Sebuah entri memenuhi syarat hanya ketika setiap kondisi di bawah ini terpenuhi:

```text
kind == plugin (diskriminator bundle DSH native kanonis)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Entri yang memenuhi syarat menggunakan `popularity.starsPolicy: exact-repository` dan integer
non-negatif di `popularity.stars`. Untuk kasus seri, ID plugin case-insensitive digunakan
sebagai urutan tampilan deterministik; tie-break tersebut tidak menyiratkan perbedaan kualitas.

`kind` adalah satu-satunya diskriminator jenis artefak. Skema secara sengaja tidak menyimpan
jenis integrasi DSH kedua yang dapat bertentangan dengannya.

## Pengecualian eksplisit

Plugin di dalam monorepo yang lebih luas tetap memenuhi syarat katalog, tetapi bintang
induknya tidak terdefinisi untuk peringkat plugin. Ia harus menggunakan
`repositoryScope: monorepo`, `popularity.starsPolicy: undefined-parent-repository`, dan
`popularity.stars: null`. Ia muncul di bagian fungsional dan dikecualikan dari setiap peringkat
berbasis bintang.

Plugin family, tema, skin, skill, preset, client, interface, bridge, dan proyek ekosistem yang
lebih luas tidak muncul di Top Plugins by Stars. Mereka mendapat bagian terpisah di mana data
yang sebanding tersedia. Agregator, marketplace, katalog installer, dan daftar bukanlah entri
katalog dan tidak mendapat bagian katalog.

## Tampilan peringkat

Proyek ini dapat mempublikasikan tampilan terpisah untuk bintang, pertumbuhan 24 jam,
pertumbuhan 7 hari, pembaruan terbaru, instalasi terverifikasi, plugin family, tema dan skin,
client dan interface, serta integrasi ekosistem. Setiap tampilan harus mengungkapkan aturan
inklusinya sendiri dan waktu snapshot-nya.

Pada nol entri yang memenuhi syarat, Top Plugins tidak dirender. Penggabungan pertama yang
memenuhi syarat membuat tampilan Top Plugins; labelnya berubah menjadi Top 10 hanya setelah ada
sepuluh entri yang memenuhi syarat. Tidak ada placeholder atau peringkat yang dikarang yang
diizinkan.

## Verifikasi bukan dukungan

`eligible` berarti struktur publik dan integrasi DSH telah divalidasi. `verified` tambahannya
berarti smoke test instalasi lulus untuk source atau paket yang dipatok. Tidak satu pun dari
status tersebut merupakan dukungan, jaminan, atau sertifikasi keamanan mutlak.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
