# CLIリファレンス — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · **日本語**

> **これは非公式のコミュニティプロジェクトです。DeepSeek とは提携・承認・スポンサー関係はありません。**
> DeepSeek の名称および商標は、それぞれの権利者に帰属します。

このページは、公開されているCLIがバージョン `1.0.1` で実際にどのように振る舞うかを、そのまま文書化した
ものです。以下のすべての概要とフラグは、公開されたコマンド自身の `--help` 出力に基づいています。ここに
は、未リリースの挙動は一切記載されていません。CLIはこのリポジトリの [`cli/`](../../cli) 配下で開発さ
れ、[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) としてnpmにリリースされてお
り、各ビルドを、それを生成したコミットとワークフロー実行に結びつける来歴の証明が付随します。

```bash
npx omni-dsh-plugins --help
```

## v1.0.1における設計原則

- **デフォルトで読み取り専用。** `catalog`、`search`、`info`、`list`、`doctor` は、プロファイルを変更し
  たり、ファイルを書き込んだり、プラグインのコードを実行したりすることは決してありません。
- **コード実行のための同意ゲート。** `add`、`update`、`remove` は、`--allow-code-execution` を渡さない
  限り、DSH/pnpmのライフサイクルコードの実行を拒否します。それを渡さない場合は、`--dry-run` を使って検
  証済みの計画を確認してください。
- **ネイティブWindowsポリシー。** コード実行を伴うネイティブWindowsの `add`/`update`/`remove` は、
  v1.0.1では無効化されています。WSLを使用してください。ドライランと読み取り専用コマンドは引き続き利用
  可能であり、ネイティブWindowsのリカバリーマーカーには、文書化された手動でのリカバリーが必要です。
- **固定された入力。** カタログの入力には、ローカルディレクトリ、スナップショットファイル、または任意で
  正確な40文字のリビジョンにロックされた、固定された公開スナップショットURLを指定できます。

## 共通オプション

これらのオプションは、カタログを利用するコマンド(`catalog validate`、`search`、`info`、`add`、
`update`、`remove`、`doctor`)に表示されます:

| オプション                    | 意味                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | ローカルのカタログディレクトリ、スナップショットファイル、または固定された公開スナップショットURL |
| `--revision <sha>`        | 正確な40文字のスナップショットリビジョン                               |
| `--json`                  | 安定したJSON出力を出す                                            |

グローバルオプション: `-V, --version` はCLIのバージョンを表示し、`-h, --help` はどのコマンドについても
ヘルプを表示します(`dsh-plugins help [command]` も機能します)。

## 終了コード

CLIは慣例的なプロセス終了コードを使用します:

| 終了コード | 意味                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | 成功(空のカタログなど、「空だが有効」な結果を含む)     |
| `1`       | 失敗: 検証エラー、エントリが見つからない、必須オプションの欠落、または診断チェックがエラーを報告した場合 |

v1.0.1で観測された例: 有効な空のカタログに対する `catalog validate` は、
`0 entries valid; catalog is empty` とともに `0` で終了します。`info <unknown-id>` は、
`Plugin not found` とともに `1` で終了します。`doctor` は、いずれかのチェック(`dsh` 実行可能ファイル
の欠落など)がエラーを報告した場合に `1` で終了します。

## コマンド

### `catalog` — 公開カタログの表面を検証する

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — カタログのYAMLとセマンティクスを検証します: 安全なYAMLパース、公開スキー
  マ、SPDX表記のパース、正確なSemVer、SHA-512 SRI、そして重複するID/リポジトリノード+サブパスの拒否で
  す。これはローカルかつ読み取り専用です: GitHubに接続したり、リポジトリの識別情報を解決したり、固定さ
  れたコミットにおける証拠を検査したりすることはありません。これは、`catalog-validation` CIジョブが、
  すべてのカタログプルリクエストに対して実行するのと全く同じコマンドです。
- **`catalog docs-check [root]`** — 必須の公開カタログドキュメントが存在し、Markdownのフェンスの対応が
  取れているかをチェックします。
- **`catalog github-forms-check [root]`** — 構造化された公開GitHub issueフォーム(クレーム、修正、削
  除)をチェックします。

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — 公開カタログのフィールドをローカルで検索する

```text
dsh-plugins search [options] <query...>
```

選択されたカタログの入力に対して、公開カタログのフィールドをローカルで検索します。一致するエントリを表
示するか、何も一致しない場合は `No plugins found.`(終了コード `0`)を表示します。

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — カタログを超えてプラグインを見つける

```text
dsh-plugins discover [options] <query...>
```

> `discover` は、このパッケージ名での最初のリリースである `1.0.0` から搭載されています。

まずキュレートされたカタログを検索し、次に — `--offline` が指定されていない限り — ライブのGitHubの
`dsh-plugin` トピックを検索します。そのため、まだ提出されていないプラグインでも見つけることができま
す。カタログの結果には、カタログが保持する証拠(固定されたコミット、クリエイター、ライセンス)が伴いま
すが、コミュニティの結果にはそれらが一切伴わず、その旨がラベル付けされます。なぜなら、それらについては
何もレビューされていないからです。

`--limit <n>` は、階層ごとの結果数の上限を設定します(デフォルトは `8`)。`--json` は、決してローカラ
イズされない、安定したマシン向けの形式を出力します。

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — 1件の公開カタログエントリを表示する

```text
dsh-plugins info [options] <id>
```

正規のプラグインIDによって、1件の公開カタログエントリを表示します。IDがカタログに存在しない場合は、
`Plugin not found: <id>` とともに `1` で終了します。

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — 公式DSH委譲を通じて、1件のカタログプラグインを追加する

```text
dsh-plugins add [options] <id>
```

| オプション                   | 意味                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | 変更対象のDSHプロファイル(実質的には必須; これがないとコマンドはエラーになる) |
| `--dry-run`              | ファイルやサブプロセスなしで、検証済みの計画を表示する               |
| `--allow-code-execution` | DSH/pnpmのライフサイクルコードへの同意(ネイティブWindowsは無効; WSLを使用) |
| `--catalog` / `--revision` / `--json` | 上記の共通オプション                                  |

このバージョンにおけるドライランの意味論: このコマンドは、固定されたエントリの計画を解決・検証してそれ
を表示し、ファイルは作成せず、サブプロセスも起動しません。実際のインストールは公式のDSHツールに委譲さ
れ、`--allow-code-execution` がある場合にのみ進行します。

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — 公式DSH委譲を通じて、1件のカタログプラグインを更新する

```text
dsh-plugins update [options] <id>
```

`add` と同じオプションと同意の意味論です: `--profile <name>`、`--dry-run`、
`--allow-code-execution`、それに加えて共通のカタログオプションです。

### `remove` — 公式DSH委譲を通じて、1件のカタログ管理下のプラグインを削除する

```text
dsh-plugins remove [options] <id>
```

`add` と同じオプションと同意の意味論です。削除されるのはカタログ管理下のインストールのみです。

### `recover` — 保持されたPOSIXの変更をリカバリーする

```text
dsh-plugins recover
```

中断された `add`/`update`/`remove` の後、保持されたPOSIXの変更をリカバリーします。保留中のものが何も
ない場合は `No mutation recovery is pending.` と表示して `0` で終了します。ネイティブWindowsのリカバ
リーは、文書化されたポリシーに従い、引き続き手動です。

### `list` — カタログ管理下のインストールを一覧表示する

```text
dsh-plugins list [--profile <name>] [--json]
```

プロファイルを変更せずに、カタログ管理下のインストールを一覧表示します。`--profile <name>` はDSHプロ
ファイルでフィルタリングします。インストールが何もない場合は `No catalog-managed plugins installed.`
と表示して `0` で終了します。

### `doctor` — 読み取り専用の診断

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

読み取り専用のNode、DSH、ネイティブWindowsポリシー、カタログの診断を実行します。各チェックは `ok` また
は `error` を報告します。いずれかが `error` の場合、全体の終了コードは `1` になります。`dsh` 実行可能
ファイルがないマシンでの出力例:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## ローカル検証が証明しないこと

`catalog validate` が緑であることは、構造とローカルセマンティクスのみを確認します。それは、リモートの
リポジトリの識別情報、クリエイターの所有権、または固定されたコミットにおける証拠を証明するものではあり
ません — メンテナーは、[CONTRIBUTING.md](../../CONTRIBUTING.md) と
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) に記載されているとおり、これらの別個の来歴ゲートを、あ
らゆるマージの前に適用します。

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
