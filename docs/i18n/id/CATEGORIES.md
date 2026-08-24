# Kategori Katalog

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Bahasa Indonesia**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Setiap entri katalog memiliki satu jenis artefak, satu kategori kapabilitas utama, dan nol atau
lebih tag. Kategori utama menentukan di mana entri tersebut muncul; tag menyediakan pencarian
lintas kategori tanpa menduplikasi entri.

## Jenis artefak

<!-- catalog-policy:aggregators-never-entries -->

| Nilai | Makna | Diberi peringkat bintang sebagai plugin |
|---|---|---:|
| `plugin` | Bundle DSH native yang dapat diinstal | Hanya ketika setiap kondisi peringkat terpenuhi |
| `plugin-family` | Repositori yang berisi beberapa plugin DSH | Tidak; bagian terpisah |
| `skin-theme` | Skin UI atau tema visual DSH | Tidak; bagian terpisah |
| `skill` | Skill agen dengan dukungan DSH | Tidak |
| `preset-profile` | Profil atau preset DSH | Tidak |
| `client-interface` | Client desktop, TUI, editor, atau remote | Tidak |
| `bridge-adapter` | Integrasi dari produk lain ke DSH | Tidak |
| `ecosystem-project` | Proyek yang lebih luas yang berisi integrasi DSH | Tidak |

Repositori umbrella, agregator, marketplace, katalog installer, atau daftar tidak pernah menjadi
entri katalog, bahkan ketika agregator itu sendiri dapat diinstal. Ia hanya boleh digunakan
sebagai petunjuk. Telusuri setiap petunjuk hingga ke artefak anak yang dapat diinstal secara
independen dan selesaikan kreator sebenarnya, repositori asli, paket, dan subpath source artefak
tersebut sebelum mengajukannya. Monorepo asli milik kreator boleh menjadi repositori asli untuk
plugin anak, tetapi anak tersebut harus menggunakan subpath persisnya dan kebijakan bintang
monorepo.

Bidang `kind` adalah diskriminator artefak DSH kanonis. Tidak ada jenis integration terpisah:
`plugin` sudah berarti bundle DSH native, sementara `ecosystem-project` sudah berarti proyek
yang lebih luas dengan integrasi DSH. Ini mencegah pasangan klasifikasi yang saling
bertentangan.

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

Pilih kategori yang paling merepresentasikan fungsi utama plugin, bukan kategori yang paling
mungkin meningkatkan visibilitas.

## Tag antarmuka

Tag antarmuka standar mencakup `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless`, dan `theme`. Tag kapabilitas lowercase kebab-case
tambahan diizinkan ketika mendeskripsikan bukti yang terlihat pada sumber asli yang dipatok.

## Cakupan repositori

Gunakan `dedicated` hanya ketika bintang repositori adalah milik plugin persis yang dikatalogkan.
Gunakan `monorepo` ketika plugin adalah subpath atau paket di dalam proyek yang lebih luas.
Entri monorepo harus menggunakan `popularity.starsPolicy: undefined-parent-repository` dan
`popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
