# カタログのカテゴリ

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **日本語**

各カタログエントリは、1つのアーティファクトの種類、1つの主要な機能カテゴリ、そして0個以上のタグを持ちま
す。主要カテゴリはエントリが表示される場所を決定し、タグはエントリを重複させることなくカテゴリ横断的な検
索を可能にします。

## アーティファクトの種類

<!-- catalog-policy:aggregators-never-entries -->

| 値 | 意味 | プラグインとしてスターでランク付けされるか |
|---|---|---:|
| `plugin` | インストール可能なネイティブDSHバンドル | すべてのランキング条件を満たす場合のみ |
| `plugin-family` | 複数のDSHプラグインを含むリポジトリ | いいえ; 別セクション |
| `skin-theme` | DSHのUIスキンまたはビジュアルテーマ | いいえ; 別セクション |
| `skill` | DSHサポート付きのエージェントskill | いいえ |
| `preset-profile` | DSHのプロファイルまたはプリセット | いいえ |
| `client-interface` | デスクトップ、TUI、エディタ、またはリモートクライアント | いいえ |
| `bridge-adapter` | 他の製品からDSHへの統合 | いいえ |
| `ecosystem-project` | DSH統合を含む、より大きなプロジェクト | いいえ |

アンブレラリポジトリ、アグリゲーター、マーケットプレイス、インストーラーカタログ、またはリストは、そのア
グリゲーター自体がインストール可能であっても、カタログエントリには決してなりません。それは手がかりとして
のみ使用できます。それぞれの手がかりを、独立してインストール可能な子アーティファクトまでたどり、それを提
出する前に、そのアーティファクトの実際のクリエイター、元のリポジトリ、パッケージ、ソースのサブパスを特定
してください。クリエイターの正真正銘のモノレポが、子プラグインの元のリポジトリである場合もありますが、そ
の子は正確なそのサブパスと、モノレポのスターポリシーを使用しなければなりません。

`kind` フィールドは、正規のDSHアーティファクトの判別子です。別個の統合種別は存在しません: `plugin` はす
でにネイティブDSHバンドルを意味し、`ecosystem-project` はすでにDSH統合を含むより大きなプロジェクトを意味
します。これにより、矛盾する分類の組み合わせが防止されます。

## 主要な機能カテゴリ

| 値 | 表示ラベル |
|---|---|
| `user-interface-dashboards` | ユーザーインターフェースとダッシュボード |
| `memory-rag` | メモリとRAG |
| `search-research` | 検索とリサーチ |
| `coding-developer-tools` | コーディングと開発者ツール |
| `browser-automation` | ブラウザと自動化 |
| `vision-audio-multimodal` | ビジョン、オーディオ、マルチモーダル |
| `sessions-productivity` | セッションと生産性 |
| `security-permissions-approvals` | セキュリティ、権限、承認 |
| `diagnostics-observability` | 診断とオブザーバビリティ |
| `models-providers-routing` | モデル、プロバイダー、ルーティング |
| `messaging-notifications` | メッセージングと通知 |
| `data-external-services` | データと外部サービス |
| `entertainment-customization` | エンターテインメントとカスタマイズ |

視認性を高める可能性が最も高いカテゴリではなく、プラグインの主な役割を最もよく表すカテゴリを選択してくだ
さい。

## インターフェースタグ

標準のインターフェースタグには、`web-ui`、`sidebar`、`settings`、`tui`、`cli`、`desktop`、`mobile`、
`remote`、`editor`、`headless`、`theme` が含まれます。固定された元のソースで確認できる証拠を説明する場
合、追加の小文字kebab-case形式の機能タグも使用できます。

## リポジトリスコープ

リポジトリのスターが、カタログ化された正確なそのプラグインに属している場合にのみ `dedicated` を使用して
ください。プラグインが、より広いプロジェクト内のサブパスまたはパッケージである場合は `monorepo` を使用し
てください。モノレポのエントリは、`popularity.starsPolicy: undefined-parent-repository` と
`popularity.stars: null` を使用しなければなりません。

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
