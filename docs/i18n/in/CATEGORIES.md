# Kategori Katalog

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Bahasa Indonesia**

Setiap entri katalog memiliki satu jenis artefak, satu kategori kapabilitas utama, dan nol atau
lebih tag. Kategori utama menentukan di mana entri muncul; tag menyediakan pencarian lintas
kategori tanpa menduplikasi entri.

## Jenis artefak

<!-- catalog-policy:aggregators-never-entries -->

| Nilai | Arti | Berperingkat bintang sebagai plugin |
|---|---|---:|
| `plugin` | Bundel DSH native yang dapat diinstal | Hanya ketika setiap kondisi peringkat terpenuhi |
| `plugin-family` | Repositori yang berisi beberapa plugin DSH | Tidak; bagian terpisah |
| `skin-theme` | Skin UI atau tema visual DSH | Tidak; bagian terpisah |
| `skill` | Skill agen dengan dukungan DSH | Tidak |
| `preset-profile` | Profil atau preset DSH | Tidak |
| `client-interface` | Klien desktop, TUI, editor, atau jarak jauh | Tidak |
| `bridge-adapter` | Integrasi dari produk lain ke DSH | Tidak |
| `ecosystem-project` | Proyek yang lebih luas yang berisi integrasi DSH | Tidak |

Repositori payung, agregator, marketplace, katalog installer, atau daftar tidak pernah menjadi
entri katalog, bahkan ketika agregator itu sendiri dapat diinstal. Ia hanya boleh digunakan
sebagai petunjuk. Telusuri setiap petunjuk ke artefak anak yang dapat diinstal secara
independen dan selesaikan kreator sebenarnya, repositori asli, paket, dan subpath sumber dari
artefak tersebut sebelum mengajukannya. Monorepo kreator sungguhan boleh menjadi repositori
asli untuk plugin anak, tetapi anak tersebut harus menggunakan subpath persis itu dan kebijakan
bintang monorepo.

Bidang `kind` adalah diskriminator artefak DSH kanonis. Tidak ada jenis integrasi yang terpisah:
`plugin` sudah berarti bundel DSH native, sedangkan `ecosystem-project` sudah berarti proyek
yang lebih luas dengan integrasi DSH. Ini mencegah pasangan klasifikasi yang kontradiktif.

## Kategori kapabilitas utama

| Nilai | Label tampilan |
|---|---|
| `user-interface-dashboards` | User interface and dashboards |
| `memory-rag` | Memory and RAG |
| `search-research` | Search and research |
| `coding-developer-tools` | Coding and developer tools |
| `browser-automation` | Browser and automation |
| `vision-audio-multimodal` | Vision, audio and multimodal |
| `sessions-productivity` | Sessions and productivity |
| `security-permissions-approvals` | Security, permissions and approvals |
| `diagnostics-observability` | Diagnostics and observability |
| `models-providers-routing` | Models, providers and routing |
| `messaging-notifications` | Messaging and notifications |
| `data-external-services` | Data and external services |
| `entertainment-customization` | Entertainment and customization |

Pilih kategori yang paling merepresentasikan pekerjaan utama plugin, bukan kategori yang paling
mungkin meningkatkan visibilitas.

## Tag antarmuka

Tag antarmuka standar mencakup `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless`, dan `theme`. Tag kapabilitas kebab-case huruf kecil
tambahan diizinkan ketika mereka mendeskripsikan bukti yang terlihat di sumber asli yang
dipatok.

## Ruang lingkup repositori

Gunakan `dedicated` hanya ketika bintang repositori milik plugin yang dikatalogkan persis
tersebut. Gunakan `monorepo` ketika plugin adalah subpath atau paket di dalam proyek yang lebih
luas. Entri monorepo harus menggunakan `popularity.starsPolicy: undefined-parent-repository`
dan `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
