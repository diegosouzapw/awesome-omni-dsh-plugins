# Menyumbang

> 🌐 [English](../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · [한국어](../ko/CONTRIBUTING.md) · **Bahasa Melayu (ms)**

> **Projek komuniti tidak rasmi. Tiada gabungan, kelulusan atau tajaan daripada DeepSeek.**
> Nama dan tanda DeepSeek adalah kepunyaan pemilik masing-masing.

Terima kasih kerana menambah baik katalog ini. Sumbangan mengutamakan pencipta: gunakan bukti
repositori asal, kekalkan atribusi dan pastikan setiap pemalam boleh disemak secara berasingan.
Katalog bermula kosong mengikut reka bentuk; tiada entri diterima tanpa pull request sendiri
yang disemak.

## Mulakan dengan pencipta

Pull request yang dibuka terus oleh pencipta pemalam atau organisasi pemilik sentiasa
diutamakan. Jika pencipta bersedia untuk menyumbang, gunakan cabang dan pull request mereka
dan bukannya mencipta semula kerja mereka dalam cabang kurator atau automasi.

Kurasi komuniti dialu-alukan apabila ia membantu pencipta yang belum membuka pull request. Ia
tidak mewujudkan pemilikan atau keutamaan berbanding sumbangan langsung pencipta yang datang
kemudian.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Satu pemalam bagi setiap cabang dan pull request

Cipta satu cabang khusus untuk satu pemalam dan buka satu pull request daripada cabang itu.
Cabang dan pull request itu mesti mencipta atau mengubah tepat satu fail YAML di bawah
`catalog/plugins/`. Jangan campurkan pemalam, pembersihan dokumentasi, indeks janaan atau
penyelenggaraan yang tidak berkaitan ke dalam cabang atau pull request tersebut.

ID entri dan nama fail mesti sama nilai kebab-case huruf kecilnya. Penyelenggara menyemak dan
menggabungkan setiap pull request pemalam secara individu; satu kelompok yang mengandungi
beberapa pemalam tidak dipecah atau digabungkan sebahagian.

## Menyelesaikan sumber asal

Setiap medan awam mesti dibina semula daripada repositori pencipta asal, pakej, manifes,
README, lesen atau keluaran pada komit yang dipasak. Jangan salin prosa, penetapan kategori,
tangkapan skrin, kedudukan, lencana atau metadata janaan daripada katalog atau agregator lain.
Pautan yang dijumpai dalam projek payung, pasar, senarai atau agregator hanya petunjuk, bukan
bukti dan bukan sumber pemalam.

Jangan sesekali hantar projek payung, agregator, pasar, katalog pemasang atau senarai sebagai
entri katalog, walaupun ia boleh dipasang secara bebas. Gunakan hanya sebagai petunjuk dan
selesaikan setiap pemalam anak yang boleh dipasang secara bebas kepada pencipta dan repositori
asal sebenarnya. Pemalam dalam monorepo sebenar pencipta boleh dihantar daripada subpath
tepatnya, tetapi ia mesti mematuhi dasar bintang monorepo di bawah.

## Bukti yang diperlukan

Sediakan semua perkara berikut dalam pull request:

- URL awam kanonik repositori asal dan ID nod repositori tak boleh ubahnya. Penyelenggara
  menyelesaikan ID nod dan menolak percanggahan URL dalam pintu gerbang provenans yang
  berasingan.
- Pengendali GitHub awam pencipta dan URL profil awam yang sepadan. YAML menyimpan pengendali
  sekali sahaja; URL profil diperoleh sebagai `https://github.com/<handle>`.
- OID komit sumber penuh 40 aksara dan subpath tepat pemalam, atau `null` untuk pemalam akar
  repositori.
- Penerangan bahasa Inggeris yang terhad dan laluan buktinya pada komit yang dipasak itu.
- `kind` artifak, kategori utama dan tag yang dipilih daripada
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Ungkapan lesen SPDX huluan lengkap yang dibuktikan pada komit yang dipasak.
- Deskriptor pemasangan kanonik yang dipasak pada versi npm tepat, atau pada repositori sumber,
  komit penuh dan subpath. Deskriptor itu adalah data, bukan arahan shell.
- Bukti integrasi DSH asli dan laluannya pada komit yang dipasak.
- Bukti ujian asap sedia ada yang tidak sensitif untuk pasakan artifak tepat itu, atau nilai
  eksplisit `not run`. Jangan pasang pemalam atau melaksanakan kod kitaran hayat pakej/pemalam
  `preinstall`, `install`, `postinstall`, `prepare` atau lain-lain semata-mata untuk menyediakan
  sumbangan katalog.
- Untuk repositori khusus, kiraan bintang yang boleh disahkan untuk repositori tepat itu,
  berserta sumber awam dan masa semakan. Untuk pemalam monorepo, gunakan dasar null yang
  diperlukan di bawah.
- Provenans Discussion atau komen awam apabila ia wujud; jika tidak, gunakan `null`.
- Nilai `unofficial: true` yang boleh dibaca mesin.

Jika tiada ujian asap yang layak sedia ada, gunakan `verification.status: eligible` dan
`verification.smokeTest: null`. Gunakan `verified` hanya apabila bukti ujian asap yang boleh
disemak untuk pasakan tepat itu wujud. Kedua-dua status itu bukan kelulusan atau pensijilan
keselamatan.

Jangan sesekali hantar kelayakan masuk, kuki, alamat e-mel persendirian, sumber tidak diterbitkan
atau rahsia lain.

## Peraturan YAML dan skema

Cipta `catalog/plugins/<plugin-id>.yaml` dan sahkan berdasarkan
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` mesti sama dengan nama
asas fail dan mesti bermula dengan ruang nama anda: pengendali `creator.github` anda dalam
huruf kecil (mana-mana rentetan aksara di luar `[a-z0-9]` menjadi satu `-`) diikuti dengan `-`,
contohnya `some-creator-my-plugin` untuk pengendali `Some-Creator`. Pengesahan katalog
menguatkuasakan kedua-duanya. Skema adalah sumber kebenaran untuk nama medan dan nilai yang
dibenarkan; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) mentakrifkan cara memilih satu-satunya
jenis artifak, kategori utama, tag dan skop repositori.

Deskriptor npm mesti mengandungi nama pakej yang sah dan versi tepat. Skema awam menolak nilai
seperti pilihan dan tidak terhad tetapi tidak melaksanakan semula SemVer atau SRI: pengesahan
katalog mesti menghurai versi, memerlukan SemVer tepat dan menghurai mana-mana nilai integriti
sebagai SHA-512 SRI yang sah. Deskriptor sumber terikat kepada `source.repository`,
`source.commit` dan `source.subpath` tanpa menduplikasi nilai sumber yang boleh berubah.

Pemasang mesti menggunakan tatasusunan argumen, melumpuhkan pelaksanaan shell dan meletakkan
penamat pilihan sebelum nilai kedudukan yang disediakan katalog di mana arahan yang dipanggil
menyokongnya. Pengesahan penyerahan tidak boleh memanggil pemasang atau kitaran hayat pemalam.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` adalah semakan struktur dan semantik tempatan, baca sahaja. Ia menghurai YAML
selamat, mengesahkan skema awam, menghurai ungkapan SPDX, memerlukan SemVer tepat dan SHA-512
SRI yang sah, serta menolak ID pendua dan kunci nod-repositori-plus-subpath kanonik. Ia tidak
menghubungi GitHub, menyelesaikan identiti repositori atau memeriksa laluan bukti pada komit
yang dipasak.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Sebelum entri mencapai `eligible`, penyelenggara secara berasingan menyelesaikan repositori
kanonik dan ID nod, mengikat pencipta kepada sumber asal, dan memeriksa penerangan, lesen,
integrasi DSH dan bukti asap yang diisytiharkan pada `source.commit`. Keputusan pengesahan
tempatan yang hijau bukan bukti provenans atau asal.

## Bintang repositori

Hanya bintang yang boleh disahkan kepunyaan repositori pemalam khusus yang tepat boleh
direkodkan. Bintang projek induk tidak boleh sesekali diatribusikan kepada pemalam yang
disimpan dalam monorepo yang lebih luas. Entri monorepo kekal layak untuk bahagian katalog
fungsian tetapi mesti mengisytiharkan:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Entri khusus menggunakan `repositoryScope: dedicated`, `starsPolicy: exact-repository` dan
kiraan bintang bukan negatif yang diperhatikan pada repositori yang sama itu. Baca
[docs/RANKING.md](../../docs/RANKING.md) sebelum menyerahkan data populariti.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Keutamaan pencipta dan hubungan yang menghormati

Untuk pemalam kanonik yang sama, keutamaannya ialah:

1. Pull request yang dibuka oleh pencipta atau organisasi pemilik.
2. Pull request komuniti yang diluluskan secara eksplisit oleh pencipta.
3. Pull request kurasi komuniti sah yang sedia ada.
4. Pull request automasi katalog.

Pull request pencipta langsung mengatasi mana-mana pull request kurasi atau automasi yang
terbuka, tanpa mengira mana yang dibuka dahulu atau lebih maju. Pull request pencipta menjadi
kenderaan semakan; penyelenggara tidak force-push cabang pencipta atau memindahkan kerja mereka
ke dalam pull request yang dikuratori. Jika entri yang dikuratori sudah digabungkan, sejarah
awam tidak ditulis semula. Pencipta boleh menggunakan permintaan tuntutan atau pembetulan dan
kemudian menyumbang pull request susulan secara langsung.

Pull request yang dikuratori sepatutnya menggunakan satu sebutan awam `@creator` yang
menghormati dalam penerangannya, di sebelah pautan ke repositori asal, menjemput pencipta
menyemak atau menggantikannya dengan pull request langsung. Jangan ulangi sebutan itu, buka
isu promosi, siar silang, hantar mesej peribadi tanpa diminta atau menghantar spam kepada
pencipta.

<!-- creator-first:source-bound-git-identity -->

Pull request dan komit yang dikarang pencipta mengekalkan kredit pencipta secara semula jadi.
Komit yang dikuratori boleh menggunakan pengarangan Git pencipta atau trailer `Co-authored-by`
hanya dengan identiti yang terikat sumber dan boleh disahkan secara awam. Jangan sesekali cipta
atau teka e-mel. Apabila tiada identiti Git yang disahkan tersedia, kurator mengarang komit dan
memberikan kredit `Created by @handle` yang eksplisit dengan pautan repositori asal dalam YAML
dan pull request. Akaun penyelenggara atau automasi boleh menjadi committer atau ko-pengarang
yang disahkan, tetapi tidak boleh menggantikan pengarangan pencipta. Lihat
[docs/CREDIT.md](../../docs/CREDIT.md) untuk dasar lengkap.

## Arahan pengesahan dan ketersediaan

CLI npm diterbitkan sebagai `omni-dsh-plugins@1.0.1`, jadi arahan di bawah tersedia
melalui `npx` hari ini. Gunakan tepat seperti yang ditulis; penyumbang tidak sepatutnya mencipta
arahan gantian.

Jalankan arahan ini daripada akar repositori:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` hanya melaksanakan semakan YAML, skema, SPDX, SemVer tepat, SHA-512 SRI dan
pendua tempatan yang diterangkan di atas, dan menerima katalog sifar-entri yang disengajakan. Ia
tidak membuktikan identiti repositori jauh atau bukti sumber yang dipasak. Arahan lain menyemak
dokumentasi awam yang diperlukan dan borang isu GitHub berstruktur. Lulus arahan ini secara
tempatan tidak melonggarkan keperluan bukti; penyelenggara masih menggunakan setiap pintu
gerbang keluaran yang sepadan sebelum menggabungkan.

## Pintu gerbang semakan, perlanggaran dan penggabungan

Penyelenggara menggunakan setiap pintu gerbang kepada komit pull request semasa sebelum
menggabungkan:

1. **Skop:** satu cabang khusus, satu fail YAML pemalam dan tiada perubahan tidak berkaitan.
2. **Identiti asal:** pencipta, repositori kanonik, ID nod, komit penuh dan subpath sepadan.
3. **Skema dan bukti:** YAML, kategori, SPDX, pasakan pemasangan, bukti DSH dan status asap
   konsisten secara dalaman tanpa melaksanakan kod kitaran hayat pemalam.
4. **Populariti:** bintang khusus boleh disahkan pada repositori tepat, atau bintang monorepo
   ialah `null` dengan `undefined-parent-repository`.
5. **Dokumentasi dan borang:** dokumen awam, pagar Markdown dan borang berstruktur kekal sah.
6. **Perlanggaran dan penyahduaan:** tiada entri yang digabungkan atau pull request terbuka
   mewakili pemalam kanonik yang sama.

Nama atau ID yang berbeza tidak menjadikan pemalam pendua berbeza. Layan ID nod repositori dan
subpath yang sama, pakej kanonik yang sama, atau sasaran pemasangan lain yang jelas serupa
sebagai perlanggaran. Selesaikan alias dan pull request bersaing sebelum penggabungan. Pull
request pencipta langsung menang perlanggaran dengan kurasi atau automasi; jika tidak,
penyelenggara memilih satu kenderaan semakan dan menutup atau mengalih hala pendua dan bukannya
menggabungkan kedua-duanya.

Hanya penyelenggara yang menggabungkan pemalam selepas semua pintu gerbang lulus. Setiap pemalam
yang diterima digabungkan secara individu; pengesahan, kurasi atau automasi tidak membayangkan
penggabungan automatik atau kelompok.

## Senarai semak pull request

- [ ] Saya menggunakan satu cabang khusus dan PR ini mengubah tepat satu entri pemalam.
- [ ] Sumbernya ialah repositori pencipta asal, bukan projek payung atau agregator.
- [ ] Pengendali/profil pencipta, repositori, ID nod, subpath dan komit penuh dibuktikan.
- [ ] `kind`, kategori dan tag mematuhi `docs/CATEGORIES.md`.
- [ ] Lesen SPDX dan deskriptor pemasangan yang dipasak dibuktikan.
- [ ] Integrasi DSH asli dan hasil asap atau status `not run` dibuktikan.
- [ ] Saya tidak melaksanakan kod kitaran hayat pemalam atau pakej untuk menyediakan sumbangan
      ini.
- [ ] Bintang khusus boleh disahkan, atau bintang monorepo menggunakan dasar null yang
      diperlukan.
- [ ] Saya menyemak entri sedia ada dan pull request terbuka untuk pemalam kanonik yang sama.
- [ ] Entri secara eksplisit tidak rasmi dan tidak mengandungi rahsia atau data peribadi
      persendirian.

## Dasar bahasa

Dokumentasi pelancaran dan penerangan katalog hanya dalam bahasa Inggeris. Pelancaran 43-lokal
kekal sebagai item senarai tugas pasca-MVP; jangan tambah dokumen lokal kosong atau terjemahan
pukal automatik.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
