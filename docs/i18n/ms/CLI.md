# Rujukan CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · [한국어](../ko/CLI.md) · **Bahasa Melayu (ms)**

> **Projek komuniti tidak rasmi. Tiada gabungan, kelulusan atau tajaan daripada DeepSeek.**
> Nama dan tanda DeepSeek adalah kepunyaan pemilik masing-masing.

Halaman ini mendokumentasikan CLI yang diterbitkan tepat sebagaimana ia berkelakuan dalam
versi `1.0.1`. Setiap sinopsis dan bendera di bawah datang daripada output `--help` arahan
yang diterbitkan itu sendiri; tiada apa-apa di sini menerangkan tingkah laku yang belum
dikeluarkan. CLI dibangunkan dalam repositori ini di bawah [`cli/`](../../cli) dan
diterbitkan ke npm sebagai
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), dengan pengesahan
provenans yang mengikat setiap binaan kepada komit dan larian aliran kerja yang
menghasilkannya.

```bash
npx omni-dsh-plugins --help
```

## Prinsip reka bentuk dalam v1.0.1

- **Baca sahaja secara lalai.** `catalog`, `search`, `info`, `list` dan `doctor` tidak
  sesekali mengubah profil, menulis fail atau melancarkan kod pemalam.
- **Pintu gerbang kebenaran untuk pelaksanaan kod.** `add`, `update` dan `remove` menolak
  untuk menjalankan kod kitaran hayat DSH/pnpm melainkan anda memberikan
  `--allow-code-execution`. Tanpanya, gunakan `--dry-run` untuk melihat pelan yang
  disahkan.
- **Dasar Windows asli.** `add`/`update`/`remove` Windows asli dengan pelaksanaan kod
  dinyahdayakan dalam v1.0.1; gunakan WSL. Dry-run dan arahan baca sahaja kekal tersedia,
  dan penanda pemulihan Windows asli memerlukan pemulihan manual yang didokumenkan.
- **Input yang dipasak.** Input katalog boleh berupa direktori tempatan, fail snapshot,
  atau URL snapshot awam yang dipasak, secara pilihan dikunci kepada semakan 40 aksara
  yang tepat.

## Pilihan biasa

Pilihan ini muncul pada arahan yang menggunakan katalog (`catalog validate`, `search`,
`info`, `add`, `update`, `remove`, `doctor`):

| Pilihan                    | Maksud                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Direktori katalog tempatan, fail snapshot, atau URL snapshot awam yang dipasak |
| `--revision <sha>`        | Semakan snapshot 40 aksara yang tepat                               |
| `--json`                  | Mengeluarkan output JSON yang stabil                                            |

Pilihan global: `-V, --version` mencetak versi CLI; `-h, --help` mencetak bantuan untuk
mana-mana arahan (`dsh-plugins help [command]` juga berfungsi).

## Kod keluar

CLI menggunakan kod keluar proses konvensional:

| Kod keluar | Maksud                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Berjaya (termasuk keputusan "kosong tetapi sah" seperti katalog kosong)     |
| `1`       | Kegagalan: ralat pengesahan, entri tidak dijumpai, pilihan wajib tiada, atau semakan diagnostik yang melaporkan ralat |

Contoh yang diperhatikan dengan v1.0.1: `catalog validate` pada katalog kosong yang sah
keluar `0` dengan `0 entries valid; catalog is empty`; `info <unknown-id>` keluar `1`
dengan `Plugin not found`; `doctor` keluar `1` apabila mana-mana semakan (seperti
kehilangan boleh laku `dsh`) melaporkan ralat.

## Arahan

### `catalog` — mengesahkan permukaan katalog awam

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — mengesahkan YAML katalog dan semantik: penghuraian YAML
  selamat, skema awam, penghuraian ungkapan SPDX, SemVer tepat, SHA-512 SRI, dan
  penolakan ID pendua / nod-repositori-plus-subpath pendua. Ia tempatan dan baca sahaja:
  ia tidak menghubungi GitHub, menyelesaikan identiti repositori atau memeriksa bukti
  pada komit yang dipasak. Ini adalah arahan tepat yang dijalankan oleh tugas CI
  `catalog-validation` pada setiap pull request katalog.
- **`catalog docs-check [root]`** — menyemak bahawa dokumentasi katalog awam yang
  diperlukan wujud dan pagar Markdown seimbang.
- **`catalog github-forms-check [root]`** — menyemak borang isu GitHub awam berstruktur
  (tuntutan, pembetulan, penyingkiran).

```bash
# Daripada akar repositori:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — mencari medan katalog awam secara tempatan

```text
dsh-plugins search [options] <query...>
```

Mencari medan katalog awam secara tempatan berbanding input katalog yang dipilih.
Mencetak entri yang sepadan, atau `No plugins found.` (keluar `0`) apabila tiada yang
sepadan.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — mencari pemalam di luar katalog

```text
dsh-plugins discover [options] <query...>
```

> `discover` dikeluarkan dalam `1.0.0`, keluaran pertama di bawah nama pakej ini.

Mencari katalog yang dikuratori dahulu, kemudian — melainkan `--offline` diberikan —
topik `dsh-plugin` GitHub secara langsung, jadi pemalam yang belum diserahkan tetap boleh
ditemui. Keputusan katalog membawa bukti yang dipegang katalog itu (komit yang dipasak,
pencipta, lesen); keputusan komuniti tidak membawa apa-apa daripadanya dan dilabel
sedemikian, kerana tiada apa-apa mengenainya telah disemak.

`--limit <n>` mengehadkan keputusan bagi setiap peringkat (lalai `8`). `--json`
mengeluarkan bentuk mesin yang stabil, yang tidak pernah dilokalkan.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — memaparkan satu entri katalog awam

```text
dsh-plugins info [options] <id>
```

Memaparkan satu entri katalog awam mengikut ID pemalam kanonik. Keluar `1` dengan
`Plugin not found: <id>` apabila ID itu tiada dalam katalog.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — menambah satu pemalam katalog melalui delegasi DSH rasmi

```text
dsh-plugins add [options] <id>
```

| Pilihan                   | Maksud                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Profil DSH untuk diubah (diperlukan pada amalannya; arahan itu ralat tanpanya) |
| `--dry-run`              | Memaparkan pelan yang disahkan tanpa fail atau subproses               |
| `--allow-code-execution` | Kebenaran kepada kod kitaran hayat DSH/pnpm (Windows asli dinyahdayakan; gunakan WSL) |
| `--catalog` / `--revision` / `--json` | Pilihan biasa di atas                                  |

Semantik dry-run dalam versi ini: arahan itu menyelesaikan dan mengesahkan pelan untuk
entri yang dipasak dan mencetaknya, tanpa mencipta fail dan tanpa melancarkan subproses.
Pemasangan sebenar didelegasikan kepada perkakas DSH rasmi dan hanya diteruskan dengan
`--allow-code-execution`.

```bash
# Pratonton sahaja — tiada apa ditulis, tiada apa dilaksanakan:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Pemasangan sebenar — kebenaran eksplisit kepada kod kitaran hayat:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — mengemas kini satu pemalam katalog melalui delegasi DSH rasmi

```text
dsh-plugins update [options] <id>
```

Pilihan dan semantik kebenaran yang sama seperti `add`: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, ditambah pilihan katalog biasa.

### `remove` — mengeluarkan satu pemalam yang diurus katalog melalui delegasi DSH rasmi

```text
dsh-plugins remove [options] <id>
```

Pilihan dan semantik kebenaran yang sama seperti `add`. Hanya pemasangan yang diurus
katalog dikeluarkan.

### `recover` — memulihkan mutasi POSIX yang dikekalkan

```text
dsh-plugins recover
```

Memulihkan mutasi POSIX yang dikekalkan selepas `add`/`update`/`remove` yang terganggu.
Dengan tiada apa yang tertunda, ia mencetak `No mutation recovery is pending.` dan keluar
`0`. Pemulihan Windows asli kekal manual, mengikut dasar yang didokumenkan.

### `list` — menyenaraikan pemasangan yang diurus katalog

```text
dsh-plugins list [--profile <name>] [--json]
```

Menyenaraikan pemasangan yang diurus katalog tanpa mengubah profil. `--profile <name>`
menapis mengikut profil DSH. Dengan tiada pemasangan, ia mencetak
`No catalog-managed plugins installed.` dan keluar `0`.

### `doctor` — diagnostik baca sahaja

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Menjalankan diagnostik baca sahaja untuk Node, DSH, dasar Windows asli dan katalog.
Setiap semakan melaporkan `ok` atau `error`; mana-mana `error` menjadikan kod keluar
keseluruhan `1`. Contoh output pada mesin tanpa boleh laku `dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Apa yang tidak dibuktikan oleh pengesahan tempatan

Larian `catalog validate` yang hijau hanya mengesahkan struktur dan semantik tempatan. Ia
tidak membuktikan identiti repositori jauh, pemilikan pencipta, atau bukti pada komit
yang dipasak — penyelenggara menggunakan pintu gerbang provenans berasingan itu sebelum
sebarang penggabungan, seperti yang diterangkan di
[CONTRIBUTING.md](../../CONTRIBUTING.md) dan
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
