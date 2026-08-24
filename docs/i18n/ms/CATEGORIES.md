# Kategori Katalog

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Bahasa Melayu**

> **Projek komuniti tidak rasmi. Tiada gabungan, kelulusan atau tajaan daripada DeepSeek.**
> Nama dan tanda DeepSeek adalah kepunyaan pemilik masing-masing.

Setiap entri katalog mempunyai satu jenis artifak, satu kategori keupayaan utama dan sifar
atau lebih tag. Kategori utama menentukan di mana entri itu muncul; tag menyediakan carian
merentas kategori tanpa menduplikasi entri itu.

## Jenis artifak

<!-- catalog-policy:aggregators-never-entries -->

| Nilai | Maksud | Disenaraikan bintang sebagai pemalam |
|---|---|---:|
| `plugin` | Bungkusan DSH asli yang boleh dipasang | Hanya apabila setiap syarat kedudukan dipenuhi |
| `plugin-family` | Repositori yang mengandungi beberapa pemalam DSH | Tidak; bahagian berasingan |
| `skin-theme` | Kulit UI DSH atau tema visual | Tidak; bahagian berasingan |
| `skill` | Skill ejen dengan sokongan DSH | Tidak |
| `preset-profile` | Profil atau prasetel DSH | Tidak |
| `client-interface` | Klien desktop, TUI, editor atau jauh | Tidak |
| `bridge-adapter` | Integrasi daripada produk lain ke dalam DSH | Tidak |
| `ecosystem-project` | Projek yang lebih luas yang mengandungi integrasi DSH | Tidak |

Repositori payung, agregator, pasar, katalog pemasang atau senarai tidak sesekali menjadi
entri katalog, walaupun agregator itu sendiri boleh dipasang. Ia hanya boleh digunakan
sebagai petunjuk. Ikuti setiap petunjuk kepada artifak anak yang boleh dipasang secara
bebas dan selesaikan pencipta sebenar, repositori asal, pakej dan subpath sumber artifak
itu sebelum menyerahkannya. Monorepo pencipta yang tulen boleh menjadi repositori asal
untuk pemalam anak, tetapi anak itu mesti menggunakan subpath tepatnya dan dasar bintang
monorepo.

Medan `kind` adalah diskriminator artifak DSH kanonik. Tiada jenis integrasi berasingan
wujud: `plugin` sudah bermaksud bungkusan DSH asli, manakala `ecosystem-project` sudah
bermaksud projek yang lebih luas dengan integrasi DSH. Ini mengelakkan pasangan
klasifikasi yang bercanggah.

## Kategori keupayaan utama

| Nilai | Label paparan |
|---|---|
| `user-interface-dashboards` | Antara muka pengguna dan papan pemuka |
| `memory-rag` | Memori dan RAG |
| `search-research` | Carian dan penyelidikan |
| `coding-developer-tools` | Pengekodan dan alat pembangun |
| `browser-automation` | Pelayar dan automasi |
| `vision-audio-multimodal` | Penglihatan, audio dan multimodal |
| `sessions-productivity` | Sesi dan produktiviti |
| `security-permissions-approvals` | Keselamatan, kebenaran dan kelulusan |
| `diagnostics-observability` | Diagnostik dan pemerhatian |
| `models-providers-routing` | Model, penyedia dan penghalaan |
| `messaging-notifications` | Pemesejan dan pemberitahuan |
| `data-external-services` | Data dan perkhidmatan luaran |
| `entertainment-customization` | Hiburan dan penyesuaian |

Pilih kategori yang paling mewakili tugas utama pemalam itu, bukan kategori yang paling
mungkin meningkatkan keterlihatan.

## Tag antara muka

Tag antara muka piawai termasuk `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` dan `theme`. Tag keupayaan kebab-case huruf kecil
tambahan dibenarkan apabila ia menerangkan bukti yang kelihatan dalam sumber asal yang
dipasak.

## Skop repositori

Gunakan `dedicated` hanya apabila bintang repositori kepunyaan pemalam yang dikatalog
tepat itu. Gunakan `monorepo` apabila pemalam itu adalah subpath atau pakej dalam projek
yang lebih luas. Entri monorepo mesti menggunakan
`popularity.starsPolicy: undefined-parent-repository` dan `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
