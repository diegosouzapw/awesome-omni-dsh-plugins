# Referensi CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · **Bahasa Indonesia (id)**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Halaman ini mendokumentasikan CLI yang dipublikasikan persis seperti perilakunya pada versi
`1.0.1`. Setiap sinopsis dan flag di bawah ini berasal dari output `--help` perintah yang
dipublikasikan itu sendiri; tidak ada yang mendeskripsikan perilaku yang belum dirilis. CLI ini
dikembangkan di repositori ini di bawah [`cli/`](../../cli) dan dirilis ke npm sebagai
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), dengan atestasi provenance
yang mengikat setiap build ke commit dan workflow run yang menghasilkannya.

```bash
npx omni-dsh-plugins --help
```

## Prinsip desain di v1.0.1

- **Baca-saja secara default.** `catalog`, `search`, `info`, `list`, dan `doctor` tidak pernah
  mengubah profil, menulis file, atau menjalankan kode plugin.
- **Gerbang persetujuan untuk eksekusi kode.** `add`, `update`, dan `remove` menolak menjalankan
  kode siklus hidup DSH/pnpm kecuali Anda menyertakan `--allow-code-execution`. Tanpa itu,
  gunakan `--dry-run` untuk melihat rencana yang terverifikasi.
- **Kebijakan Windows native.** `add`/`update`/`remove` Windows native dengan eksekusi kode
  dinonaktifkan di v1.0.1; gunakan WSL. Dry-run dan perintah baca-saja tetap tersedia, dan
  penanda pemulihan Windows native memerlukan pemulihan manual yang terdokumentasi.
- **Input yang dipatok.** Input katalog bisa berupa direktori lokal, file snapshot, atau URL
  snapshot publik yang dipatok, opsional dikunci ke revisi 40 karakter yang tepat.

## Opsi umum

Opsi-opsi ini muncul pada perintah yang mengonsumsi katalog (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Opsi                    | Makna                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Direktori katalog lokal, file snapshot, atau URL snapshot publik yang dipatok |
| `--revision <sha>`        | Revisi snapshot 40 karakter yang tepat                             |
| `--json`                  | Menghasilkan output JSON yang stabil                                |

Opsi global: `-V, --version` mencetak versi CLI; `-h, --help` mencetak bantuan untuk perintah
apa pun (`dsh-plugins help [command]` juga berfungsi).

## Kode keluar

CLI ini menggunakan kode keluar proses konvensional:

| Kode keluar | Makna                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Sukses (termasuk hasil "kosong tapi valid" seperti katalog kosong)         |
| `1`       | Gagal: error validasi, entri tidak ditemukan, opsi wajib hilang, atau pemeriksaan diagnostik yang melaporkan error |

Contoh yang diamati dengan v1.0.1: `catalog validate` pada katalog kosong yang valid keluar
dengan `0` beserta `0 entries valid; catalog is empty`; `info <unknown-id>` keluar dengan `1`
beserta `Plugin not found`; `doctor` keluar dengan `1` ketika pemeriksaan apa pun (seperti
executable `dsh` yang hilang) melaporkan error.

## Perintah

### `catalog` — memvalidasi permukaan katalog publik

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — memvalidasi YAML dan semantik katalog: parsing YAML yang aman,
  skema publik, parsing ekspresi SPDX, SemVer yang tepat, SHA-512 SRI, dan penolakan ID duplikat
  / repository-node-plus-subpath. Perintah ini lokal dan baca-saja: tidak menghubungi GitHub,
  tidak menyelesaikan identitas repositori, dan tidak memeriksa bukti pada commit yang dipatok.
  Inilah perintah persis yang dijalankan job CI `catalog-validation` pada setiap pull request
  katalog.
- **`catalog docs-check [root]`** — memeriksa bahwa dokumentasi katalog publik yang diwajibkan
  ada dan bahwa fence Markdown seimbang.
- **`catalog github-forms-check [root]`** — memeriksa formulir issue GitHub publik terstruktur
  (klaim, koreksi, penghapusan).

```bash
# Dari root repositori:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — mencari bidang katalog publik secara lokal

```text
dsh-plugins search [options] <query...>
```

Mencari bidang katalog publik secara lokal terhadap input katalog yang dipilih. Mencetak entri
yang cocok, atau `No plugins found.` (keluar `0`) ketika tidak ada yang cocok.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — menemukan plugin di luar katalog

```text
dsh-plugins discover [options] <query...>
```

> `discover` dirilis di `1.0.0`, rilis pertama dengan nama paket ini.

Mencari katalog yang dikurasi terlebih dahulu, lalu — kecuali `--offline` diberikan — topik
GitHub `dsh-plugin` yang live, sehingga plugin yang belum diajukan tetap dapat ditemukan. Hasil
katalog membawa bukti yang dimiliki katalog (commit yang dipatok, kreator, lisensi); hasil
komunitas tidak membawa satu pun dari itu dan diberi label sebagai demikian, karena belum ada
yang ditinjau tentangnya.

`--limit <n>` membatasi hasil per tingkat (default `8`). `--json` menghasilkan bentuk mesin yang
stabil, yang tidak pernah dilokalkan.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — menampilkan satu entri katalog publik

```text
dsh-plugins info [options] <id>
```

Menampilkan satu entri katalog publik berdasarkan ID plugin kanonis. Keluar dengan `1` beserta
`Plugin not found: <id>` ketika ID tidak ada di katalog.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — menambahkan satu plugin katalog lewat delegasi DSH resmi

```text
dsh-plugins add [options] <id>
```

| Opsi                   | Makna                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Profil DSH yang diubah (wajib dalam praktiknya; perintah error tanpa ini) |
| `--dry-run`              | Menampilkan rencana terverifikasi tanpa file atau subproses         |
| `--allow-code-execution` | Persetujuan untuk kode siklus hidup DSH/pnpm (Windows native dinonaktifkan; gunakan WSL) |
| `--catalog` / `--revision` / `--json` | Opsi umum di atas                                     |

Semantik dry-run di versi ini: perintah menyelesaikan dan memverifikasi rencana untuk entri yang
dipatok dan mencetaknya, tanpa membuat file dan tanpa menjalankan subproses. Instalasi
sebenarnya mendelegasikan ke tooling DSH resmi dan hanya berlanjut dengan
`--allow-code-execution`.

```bash
# Hanya pratinjau — tidak ada yang ditulis, tidak ada yang dijalankan:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Instalasi sungguhan — persetujuan eksplisit untuk kode siklus hidup:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — memperbarui satu plugin katalog lewat delegasi DSH resmi

```text
dsh-plugins update [options] <id>
```

Opsi dan semantik persetujuan yang sama seperti `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, ditambah opsi katalog umum.

### `remove` — menghapus satu plugin yang dikelola katalog lewat delegasi DSH resmi

```text
dsh-plugins remove [options] <id>
```

Opsi dan semantik persetujuan yang sama seperti `add`. Hanya instalasi yang dikelola katalog
yang dihapus.

### `recover` — memulihkan mutasi POSIX yang tertahan

```text
dsh-plugins recover
```

Memulihkan mutasi POSIX yang tertahan setelah `add`/`update`/`remove` yang terinterupsi. Ketika
tidak ada yang tertunda, perintah ini mencetak `No mutation recovery is pending.` dan keluar
dengan `0`. Pemulihan Windows native tetap manual, sesuai kebijakan yang terdokumentasi.

### `list` — mendaftar instalasi yang dikelola katalog

```text
dsh-plugins list [--profile <name>] [--json]
```

Mendaftar instalasi yang dikelola katalog tanpa mengubah profil. `--profile <name>` memfilter
berdasarkan profil DSH. Ketika tidak ada instalasi, perintah ini mencetak
`No catalog-managed plugins installed.` dan keluar dengan `0`.

### `doctor` — diagnostik baca-saja

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Menjalankan diagnostik Node, DSH, kebijakan Windows native, dan katalog yang bersifat baca-saja.
Setiap pemeriksaan melaporkan `ok` atau `error`; `error` apa pun membuat kode keluar keseluruhan
menjadi `1`. Contoh output pada mesin tanpa executable `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Apa yang tidak dibuktikan oleh validasi lokal

Hasil `catalog validate` yang hijau hanya mengonfirmasi struktur dan semantik lokal. Ini tidak
membuktikan identitas repositori jarak jauh, kepemilikan kreator, atau bukti pada commit yang
dipatok — maintainer menerapkan gerbang provenance terpisah tersebut sebelum penggabungan mana
pun, sebagaimana dijelaskan di [CONTRIBUTING.md](../../CONTRIBUTING.md) dan
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
