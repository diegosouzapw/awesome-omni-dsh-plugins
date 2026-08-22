# Referensi CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Bahasa Indonesia**

> **Proyek komunitas tidak resmi. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak disponsori oleh DeepSeek.**
> Nama dan merek DeepSeek adalah milik pemiliknya masing-masing.

Halaman ini mendokumentasikan CLI yang dipublikasikan persis seperti perilakunya di versi
`1.0.1`. Setiap synopsis dan flag di bawah berasal dari output `--help` milik perintah yang
dipublikasikan itu sendiri; tidak ada di sini yang mendeskripsikan perilaku yang belum dirilis.
CLI dikembangkan di repositori ini di bawah [`cli/`](../../cli) dan dirilis ke npm sebagai
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), dengan provenance
attestation yang mengikat setiap build ke commit dan workflow run yang menghasilkannya.

```bash
npx omni-dsh-plugins --help
```

## Prinsip desain di v1.0.1

- **Baca-saja secara default.** `catalog`, `search`, `info`, `list`, dan `doctor` tidak pernah
  mengubah profil, menulis file, atau menjalankan kode plugin.
- **Gerbang persetujuan untuk eksekusi kode.** `add`, `update`, dan `remove` menolak menjalankan
  kode siklus hidup DSH/pnpm kecuali Anda menambahkan `--allow-code-execution`. Tanpanya,
  gunakan `--dry-run` untuk melihat rencana yang terverifikasi.
- **Kebijakan Windows native.** `add`/`update`/`remove` dengan eksekusi kode dinonaktifkan di
  v1.0.1 pada Windows native; gunakan WSL. Dry-run dan perintah baca-saja tetap tersedia, dan
  penanda pemulihan Windows native memerlukan pemulihan manual yang terdokumentasi.
- **Input yang dipatok.** Input katalog dapat berupa direktori lokal, file snapshot, atau URL
  snapshot publik yang dipatok, opsional dikunci ke revisi 40 karakter yang persis.

## Opsi umum

Opsi ini muncul pada perintah yang mengonsumsi katalog (`catalog validate`, `search`, `info`,
`add`, `update`, `remove`, `doctor`):

| Opsi                    | Arti                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Direktori katalog lokal, file snapshot, atau URL snapshot publik yang dipatok |
| `--revision <sha>`        | Revisi snapshot 40 karakter yang persis                               |
| `--json`                  | Mengeluarkan output JSON yang stabil                                            |

Opsi global: `-V, --version` mencetak versi CLI; `-h, --help` mencetak bantuan untuk perintah
apa pun (`dsh-plugins help [command]` juga berfungsi).

## Kode keluar

CLI menggunakan kode keluar proses konvensional:

| Kode keluar | Arti                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Sukses (termasuk hasil "kosong tetapi valid" seperti katalog kosong)     |
| `1`       | Gagal: kesalahan validasi, entri tidak ditemukan, opsi wajib yang hilang, atau pemeriksaan diagnostik yang melaporkan kesalahan |

Contoh yang diamati dengan v1.0.1: `catalog validate` pada katalog kosong yang valid keluar
dengan `0` disertai `0 entries valid; catalog is empty`; `info <unknown-id>` keluar dengan `1`
disertai `Plugin not found`; `doctor` keluar dengan `1` ketika pemeriksaan apa pun (misalnya
executable `dsh` yang hilang) melaporkan kesalahan.

## Perintah

### `catalog` — memvalidasi permukaan katalog publik

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — memvalidasi YAML dan semantik katalog: parsing YAML yang aman, skema
  publik, parsing ekspresi SPDX, SemVer persis, SHA-512 SRI, dan penolakan ID /
  repository-node-plus-subpath duplikat. Ia lokal dan baca-saja: tidak menghubungi GitHub,
  menyelesaikan identitas repositori, atau memeriksa bukti pada commit yang dipatok. Ini adalah
  perintah persis yang dijalankan job CI `catalog-validation` pada setiap pull request katalog.
- **`catalog docs-check [root]`** — memeriksa bahwa dokumentasi katalog publik yang diwajibkan
  ada dan fence Markdown-nya seimbang.
- **`catalog github-forms-check [root]`** — memeriksa formulir issue GitHub publik terstruktur
  (claim, correction, removal).

```bash
# From the repository root:
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

> `discover` hadir di `1.0.0`, rilis pertama dengan nama paket ini.

Mencari katalog hasil kurasi terlebih dahulu, lalu — kecuali `--offline` diberikan — topic
`dsh-plugin` GitHub live, sehingga plugin yang belum diajukan tetap dapat ditemukan. Hasil
katalog membawa bukti yang dimiliki katalog (commit yang dipatok, kreator, lisensi); hasil
komunitas tidak membawa bukti apa pun dan diberi label demikian, karena tidak ada apa pun
tentangnya yang telah ditinjau.

`--limit <n>` membatasi hasil per tingkatan (default `8`). `--json` mengeluarkan bentuk mesin
yang stabil, yang tidak pernah dilokalkan.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — menampilkan satu entri katalog publik

```text
dsh-plugins info [options] <id>
```

Menampilkan satu entri katalog publik berdasarkan ID plugin kanonis. Keluar dengan `1` disertai
`Plugin not found: <id>` ketika ID tidak ada di katalog.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — menambahkan satu plugin katalog lewat delegasi resmi DSH

```text
dsh-plugins add [options] <id>
```

| Opsi                   | Arti                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Profil DSH yang akan dimutasi (wajib dalam praktiknya; perintah error tanpanya) |
| `--dry-run`              | Menampilkan rencana terverifikasi tanpa file atau subproses               |
| `--allow-code-execution` | Persetujuan untuk kode siklus hidup DSH/pnpm (Windows native dinonaktifkan; gunakan WSL) |
| `--catalog` / `--revision` / `--json` | Opsi umum di atas                                  |

Semantik dry-run di versi ini: perintah menyelesaikan dan memverifikasi rencana untuk entri
yang dipatok lalu mencetaknya, tanpa membuat file dan tanpa menjalankan subproses apa pun.
Instalasi sesungguhnya didelegasikan ke tooling resmi DSH dan hanya berlanjut dengan
`--allow-code-execution`.

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — memperbarui satu plugin katalog lewat delegasi resmi DSH

```text
dsh-plugins update [options] <id>
```

Opsi dan semantik persetujuan yang sama seperti `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, ditambah opsi katalog umum.

### `remove` — menghapus satu plugin yang dikelola katalog lewat delegasi resmi DSH

```text
dsh-plugins remove [options] <id>
```

Opsi dan semantik persetujuan yang sama seperti `add`. Hanya instalasi yang dikelola katalog
yang dihapus.

### `recover` — memulihkan mutasi POSIX yang tertahan

```text
dsh-plugins recover
```

Memulihkan mutasi POSIX yang tertahan setelah `add`/`update`/`remove` yang terinterupsi.
Ketika tidak ada yang tertunda, ia mencetak `No mutation recovery is pending.` dan keluar `0`.
Pemulihan Windows native tetap manual, sesuai kebijakan yang terdokumentasi.

### `list` — mendaftar instalasi yang dikelola katalog

```text
dsh-plugins list [--profile <name>] [--json]
```

Mendaftar instalasi yang dikelola katalog tanpa mengubah profil. `--profile <name>` memfilter
berdasarkan profil DSH. Ketika tidak ada instalasi, ia mencetak
`No catalog-managed plugins installed.` dan keluar `0`.

### `doctor` — diagnostik baca-saja

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Menjalankan diagnostik baca-saja untuk Node, DSH, kebijakan Windows native, dan katalog. Setiap
pemeriksaan melaporkan `ok` atau `error`; `error` apa pun membuat kode keluar keseluruhan `1`.
Contoh output pada mesin tanpa executable `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Apa yang tidak dibuktikan validasi lokal

Jalannya `catalog validate` yang hijau hanya mengonfirmasi struktur dan semantik lokal. Ia
tidak membuktikan identitas repositori jarak jauh, kepemilikan kreator, atau bukti pada commit
yang dipatok — maintainer menerapkan gerbang provenance terpisah itu sebelum penggabungan apa
pun, seperti dijelaskan di [CONTRIBUTING.md](../../CONTRIBUTING.md) dan
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
