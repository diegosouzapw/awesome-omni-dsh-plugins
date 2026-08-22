# カタログエントリのスキーマリファレンス

> 🌐 [English](../../docs/SCHEMA.md) · **日本語**

> **これは非公式のコミュニティプロジェクトです。DeepSeek とは提携・承認・スポンサー関係はありません。**
> DeepSeek の名称および商標は、それぞれの権利者に帰属します。

これは、[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) — `catalog/plugins/`
配下のすべてのファイルが満たさなければならない、公開のJSON Schema (draft 2020-12) — のフィールドご
とのリファレンスです。スキーマファイル自体が信頼できる情報源であり、このページとスキーマが食い違う場合
は、スキーマが優先されます。

検証には2つの層があります。公開スキーマは、境界付きの*安全な形状*(オプションのような値や無制限の値を
拒否するパターンと長さ)を強制します。その上に、`catalog validate` が必須のセマンティックパーサーを適用
します: バージョンに対する正確なSemVer、integrity値に対するSHA-512 SRI、ライセンスに対するSPDX表記の
パース、そして重複キーの拒否です。値がスキーマのパターンに一致していても、セマンティックには拒否される
場合があります。

トップレベルのルール: エントリは単一のYAMLオブジェクトであり、`additionalProperties: false`(未知のフ
ィールドは拒否されます)、そして**以下のすべての**フィールドが必須です。

## トップレベルフィールド

| フィールド             | 型    | 必須 | 概要                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   yes    | 正確に `1` でなければならない                                           |
| `id`              | string  |   yes    | 小文字のkebab-caseエントリID; ファイル名と一致しなければならない        |
| `name`            | string  |   yes    | 表示名、1〜120文字                                |
| `description`     | object  |   yes    | 精選された英語の要約と、その証拠パス                            |
| `unofficial`      | const   |   yes    | 正確に `true` でなければならない                                        |
| `kind`            | enum    |   yes    | 正規のアーティファクト判別子                            |
| `primaryCategory` | enum    |   yes    | 単一の主要な機能カテゴリ                            |
| `tags`            | array   |   yes    | 一意な小文字kebab-caseタグ(空でもよい)               |
| `source`          | object  |   yes    | 元のリポジトリ、ノードID、サブパス、固定されたコミット       |
| `creator`         | object  |   yes    | クリエイターの公開GitHubハンドル                            |
| `package`         | object  |   yes    | 正規のインストール記述子(npm **または** ソース)              |
| `dsh`             | object  |   yes    | DSHプロファイルと、ネイティブ統合の証拠パス                     |
| `repositoryScope` | enum    |   yes    | `dedicated` または `monorepo`                                     |
| `popularity`      | object  |   yes    | スターポリシーとスター数(スコープに応じた条件付き)            |
| `license`         | object  |   yes    | upstreamのSPDXライセンス表記                                     |
| `verification`    | object  |   yes    | 検証ステータス、チェック時刻、識別情報、スモークテスト      |
| `provenance`      | object  |   yes    | 公開のDiscussion/コメントのURL、または `null`                      |

### `schemaVersion`

定数 `1`。公開スキーマのバージョン1を識別します。他の値は無効です。

### `id`

`^[a-z0-9]+(?:-[a-z0-9]+)*$` に一致する文字列 — 小文字のkebab-case、先頭/末尾のハイフンや二重ハイフン
は不可。[CONTRIBUTING.md](../../CONTRIBUTING.md) に従い、エントリファイルは同一の値を用いて
`catalog/plugins/<id>.yaml` という名前にしなければなりません。バリデーターは不一致を拒否します
(`id-filename-mismatch`)。IDはまた、クリエイターの名前空間で始まらなければなりません:
`creator.github` ハンドルを小文字化し、`[a-z0-9]` 以外の文字が連続する箇所を単一の `-` に置き換えたも
のに、`-` を続けたものです(`id-creator-prefix`)。

### `name`

自由形式の表示名、`minLength: 1`、`maxLength: 120`。

### `description`

正確に2つの必須プロパティを持つオブジェクト(それ以外は許可されません):

| プロパティ       | 型   | ルール                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | 英語の要約、20〜320文字                                    |
| `evidencePath` | string | 相対リポジトリパスのパターン; 先頭の `/`、バックスラッシュ、`.`/`..` セグメントは不可 |

英語の要約は、`source.commit` 時点で存在する `evidencePath` のファイルから精選されなければなりません
— 他のカタログからコピーされたものであってはいけません。

### `unofficial`

定数 `true`。掲載が非公式であることを示す機械可読なマーカーです。

### `kind`

**唯一の** アーティファクトタイプ判別子です(第2の統合種別フィールドは存在しません)。以下のいずれかです:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

意味とランキングへの影響は [docs/CATEGORIES.md](../../docs/CATEGORIES.md) で定義されています。

### `primaryCategory`

13の機能カテゴリのいずれか:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

表示ラベルと選択のガイダンスは [docs/CATEGORIES.md](../../docs/CATEGORIES.md) にあります。

### `tags`

一意な文字列の配列で、それぞれが `^[a-z0-9]+(?:-[a-z0-9]+)*$`(小文字のkebab-case)に一致します。
スキーマによって課される最小数はありません。

### `source`

正確に4つの必須プロパティを持つオブジェクト:

| プロパティ           | 型           | ルール                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` のURL; オーナーはGitHubのユーザー名ルールに従い、リポジトリ名は1〜100文字で、`.`/`..` であってはならず、`.git` で終わってはならない |
| `repositoryNodeId` | string         | 不変のGitHubリポジトリノードID、空でないこと                         |
| `subpath`          | string または null | リポジトリ内のプラグインのサブパス(`evidencePath` と同じ安全な相対パスパターン)、またはリポジトリルートのプラグインの場合は `null` |
| `commit`           | string         | 完全な40文字の16進数コミットOID                               |

カタログの検証は `repositoryNodeId` を解決し、リポジトリURLの不一致を拒否しなければなりません — この解
決はメンテナー側のゲートであり、ローカルの構造チェックの一部ではありません。

### `creator`

単一の必須プロパティを持つオブジェクト:

| プロパティ | 型   | ルール                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHubユーザー名(1〜39文字、GitHubハンドルのルール) |

公開プロフィールURLは常に `https://github.com/<handle>` として導出されます。第2のプロフィールフィール
ドは保存されないため、両者が食い違うことは決してありません。

### `package`

正規のインストール記述子です。それはデータであり、シェルコマンドでは決してなく、2つの形のうちいずれか
1つを取ります(`oneOf`):

**npmパッケージ** — `ecosystem`、`name`、`version` が必須; `integrity` は任意:

| プロパティ    | 型  | ルール                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npmパッケージ名の形(スコープ付きも可)、最大214文字                 |
| `version`   | string | 正確な `x.y.z` バージョン形式(オプションのプレリリース/ビルド); 範囲指定は拒否される。セマンティック層は加えて、パース可能な正確なSemVerを要求する |
| `integrity` | string | 任意の `sha512-…` SRI形式、8〜256文字。セマンティック層は、これを有効なSHA-512 SRIとしてパースしなければならない |

**ソースインストール** — `ecosystem` のみが必須:

| プロパティ    | 型  | ルール    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

ソース記述子は、意図的にそれ以外を何も保存しません: リポジトリ、コミット、サブパスは `source` から導出
されるため、可変の値が重複して保存されることは決してありません。

### `dsh`

ネイティブDSH統合の証拠:

| プロパティ       | 型   | ルール                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | array  | `^[A-Za-z0-9][A-Za-z0-9._-]*$` に一致する、一意なプロファイル名を1つ以上 |
| `evidencePath` | string | `source.commit` 時点でのDSH統合の証拠への安全な相対パス |

### `repositoryScope`

`dedicated`(リポジトリのスターがこの正確なプラグインに属する)または `monorepo`(プラグインがより広
いプロジェクト内のサブパスまたはパッケージである)のいずれかです。この値は、以下の条件付きの人気度ルー
ルを左右します。

### `popularity`

| プロパティ     | 型            | ルール                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` または `undefined-parent-repository`  |
| `stars`      | integer または null | 非負の整数、または `null`                      |

条件付きルール(スキーマの `allOf` ブロックによって強制されます):

- `repositoryScope: monorepo` は `starsPolicy: undefined-parent-repository` と `stars: null`
  を**強制します**。親プロジェクトのスターがモノレポのプラグインに帰属することは決してありません。
- `repositoryScope: dedicated` は `starsPolicy: exact-repository` と、`stars >= 0` の整数を
  **強制します**。

これらの値がランキングの述語にどのように反映されるかについては、[docs/RANKING.md](../../docs/RANKING.md)
を参照してください。

### `license`

| プロパティ | 型   | ルール                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | SPDX表記の形、2〜256文字、先頭のハイフンは不可          |

スキーマは安全な文字の形のみを強制します。カタログの検証は、実際のSPDX表記パーサーを使ってその値をパー
スし、正規化しなければなりません。固定されたコミットで証拠づけられた、upstreamの完全な表記を記録してく
ださい(例えば `Apache-2.0` や `MIT OR GPL-3.0-only`)。

### `verification`

検証は `source.commit` に適用されます。4つの必須プロパティを持つオブジェクト:

| プロパティ             | 型           | ルール                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | チェック時刻の `date-time` 形式のタイムスタンプ           |
| `repositoryIdentity` | const          | `resolved` でなければならない                                     |
| `smokeTest`          | object または null | スモークテストの記録、または、対象となるテストが存在しない場合は `null` |

存在する場合、`smokeTest` には以下が必須です:

| プロパティ        | 型   | ルール                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — 可変の値を重複させることなく、`package` または固定されたソースを参照する |
| `check`         | object | 必須の `name`(パッケージ名の形)と `version`(正確なバージョン形式) |
| `result`        | const  | `passed` — 失敗したスモークテストがスモークテストとして記録されることはない    |

条件付きルール: `status: verified` は、null でない `smokeTest` オブジェクトを**要求します**。レビュー
可能なスモークの証拠がないエントリは `status: eligible` と `smokeTest: null` を使用します。どのステー
タスも、推奨やセキュリティ認証ではありません — [docs/RANKING.md](../../docs/RANKING.md) を参照してくだ
さい。

### `provenance`

公開の来歴リンクで、それぞれURIまたは `null` です:

| プロパティ     | 型          | ルール                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string または null | 存在する場合は、公開Discussionのurl            |
| `comment`    | string または null | 存在する場合は、公開コメントのurl               |

## スキーマがチェックしないこと

このスキーマは、意図的にローカルかつ構造的なものです。それは、リポジトリが存在すること、ノードIDがURL
と一致すること、証拠パスが固定されたコミット時点で存在すること、スター数が正確であること、クリエイター
がそのソースを所有していることを**検証しません**。それらのチェックは、
[CONTRIBUTING.md](../../CONTRIBUTING.md) と [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) に記載され
ている、メンテナーのレビューゲートに属します。

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
