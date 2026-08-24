# Metodologi Peringkat

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Bahasa Indonesia**

Peringkat adalah tampilan transparan atas entri katalog publik yang telah tergabung. Mereka
tidak pernah menggunakan skor gabungan tersembunyi dan tidak pernah memperlakukan bintang dari
proyek induk yang luas sebagai popularitas plugin.

## Predikat Top Plugins by Stars

Sebuah entri memenuhi syarat hanya ketika setiap kondisi di bawah bernilai benar:

```text
kind == plugin (the canonical native DSH bundle discriminator)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

Entri yang memenuhi syarat menggunakan `popularity.starsPolicy: exact-repository` dan bilangan
bulat non-negatif di `popularity.stars`. Hasil seri menggunakan ID plugin tanpa membeda-bedakan
huruf besar-kecil sebagai urutan tampilan yang deterministik; pemecah seri tidak menyiratkan
perbedaan kualitas.

`kind` adalah satu-satunya diskriminator jenis artefak. Skema sengaja tidak menyimpan jenis
integrasi DSH kedua yang bisa bertentangan dengannya.

## Pengecualian eksplisit

Plugin di dalam monorepo yang lebih luas tetap memenuhi syarat katalog, tetapi bintang induknya
tidak terdefinisi untuk peringkat plugin. Ia harus menggunakan `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository`, dan `popularity.stars: null`. Ia muncul
di bagian fungsional dan dikeluarkan dari setiap peringkat berbasis bintang.

Keluarga plugin, tema, skin, skill, preset, klien, antarmuka, bridge, dan proyek ekosistem yang
lebih luas tidak muncul di Top Plugins by Stars. Mereka menerima bagian terpisah ketika data
yang sebanding ada. Agregator, marketplace, katalog installer, dan daftar bukanlah entri
katalog dan tidak menerima bagian katalog apa pun.

## Tampilan peringkat

Proyek dapat menerbitkan tampilan yang berbeda untuk bintang, pertumbuhan 24 jam, pertumbuhan
7 hari, pembaruan terbaru, instalasi terverifikasi, keluarga plugin, tema dan skin, klien dan
antarmuka, serta integrasi ekosistem. Setiap tampilan harus mengungkapkan aturan inklusinya
sendiri dan waktu snapshot-nya.

Pada nol entri yang memenuhi syarat, Top Plugins tidak dirender. Penggabungan pertama yang
memenuhi syarat membuat tampilan Top Plugins; labelnya berubah menjadi Top 10 hanya setelah ada
sepuluh entri yang memenuhi syarat. Tidak ada placeholder atau peringkat yang dikarang
diizinkan.

## Verifikasi bukanlah dukungan

`eligible` berarti struktur publik dan integrasi DSH telah divalidasi. `verified` sebagai
tambahan berarti smoke test instalasi telah lolos untuk sumber atau paket yang dipatok. Tidak
ada status yang merupakan dukungan, jaminan, atau sertifikasi keamanan mutlak.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
