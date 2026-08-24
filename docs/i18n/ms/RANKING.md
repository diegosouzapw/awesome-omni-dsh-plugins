# Metodologi Kedudukan

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Bahasa Melayu**

> **Projek komuniti tidak rasmi. Tiada gabungan, kelulusan atau tajaan daripada DeepSeek.**
> Nama dan tanda DeepSeek adalah kepunyaan pemilik masing-masing.

Kedudukan adalah pandangan telus atas entri katalog awam yang digabungkan. Ia tidak pernah
menggunakan skor gabungan tersembunyi dan tidak pernah melayan bintang daripada projek
induk yang luas sebagai populariti pemalam.

## Predikat Pemalam Teratas mengikut Bintang

Satu entri layak hanya apabila setiap syarat di bawah adalah benar:

```text
kind == plugin (diskriminator bungkusan DSH asli kanonik)
repositoryScope == dedicated
verification.status in [eligible, verified]
repositori aktif dan tidak diarkibkan
bintang kepunyaan repositori pemalam yang tepat
entri digabungkan ke dalam katalog awam
```

Entri yang layak menggunakan `popularity.starsPolicy: exact-repository` dan integer
bukan negatif dalam `popularity.stars`. Seri menggunakan ID pemalam tidak sensitif-huruf
sebagai susunan paparan deterministik; pemecah seri itu tidak membayangkan perbezaan
kualiti.

`kind` adalah satu-satunya diskriminator jenis artifak. Skema sengaja tidak menyimpan
jenis integrasi DSH kedua yang boleh bercanggah dengannya.

## Pengecualian eksplisit

Pemalam dalam monorepo yang lebih luas kekal layak katalog, tetapi bintang induknya
tidak ditakrifkan untuk kedudukan pemalam. Ia mesti menggunakan `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` dan `popularity.stars: null`. Ia
muncul dalam bahagian fungsian dan dikecualikan daripada setiap kedudukan berasaskan
bintang.

Keluarga pemalam, tema, kulit, skill, prasetel, klien, antara muka, jambatan dan projek
ekosistem yang lebih luas tidak muncul dalam Pemalam Teratas mengikut Bintang. Mereka
menerima bahagian berasingan di mana data yang boleh dibandingkan wujud. Agregator, pasar,
katalog pemasang dan senarai bukan entri katalog dan tidak menerima bahagian katalog.

## Pandangan kedudukan

Projek ini boleh menerbitkan pandangan berasingan untuk bintang, pertumbuhan 24 jam,
pertumbuhan 7 hari, kemas kini terkini, pemasangan yang disahkan, keluarga pemalam, tema
dan kulit, klien dan antara muka, serta integrasi ekosistem. Setiap pandangan mesti
mendedahkan peraturan kemasukannya sendiri dan masa snapshot.

Pada sifar entri yang layak, Pemalam Teratas tidak dipaparkan. Penggabungan pertama yang
layak mencipta pandangan Pemalam Teratas; label berubah kepada 10 Teratas hanya selepas
sepuluh entri yang layak wujud. Tiada kedudukan pemegang tempat atau rekaan yang
dibenarkan.

## Pengesahan bukan kelulusan

`eligible` bermaksud struktur awam dan integrasi DSH disahkan. `verified` tambahan pula
bermaksud ujian asap pemasangan lulus untuk sumber atau pakej yang dipasak. Tiada status
adalah kelulusan, jaminan atau pensijilan keselamatan mutlak.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
