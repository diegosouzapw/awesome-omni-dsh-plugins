# 目錄分類

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **中文（繁體）**

每一個目錄條目都恰好有一個作品類型(artifact kind)、一個主要能力分類,以及零個或多個標籤
(tags)。主要分類決定條目出現在哪裡;標籤則提供跨分類搜尋的能力,而不需要重複建立條目。

## 作品類型(Artifact kinds)

<!-- catalog-policy:aggregators-never-entries -->

| 值 | 意義 | 是否依星標數排名為外掛 |
|---|---|---:|
| `plugin` | 可安裝的原生 DSH 套件 | 僅在符合所有排名條件時才會 |
| `plugin-family` | 內含多個 DSH 外掛的儲存庫 | 否;獨立區塊 |
| `skin-theme` | DSH 使用者介面面板美化(skin)或視覺主題 | 否;獨立區塊 |
| `skill` | 支援 DSH 的代理技能(agent skill) | 否 |
| `preset-profile` | DSH 設定檔或預設值 | 否 |
| `client-interface` | 桌面、TUI、編輯器或遠端用戶端 | 否 |
| `bridge-adapter` | 從其他產品整合進 DSH 的橋接器 | 否 |
| `ecosystem-project` | 內含 DSH 整合的更廣泛專案 | 否 |

傘型儲存庫(umbrella repository)、聚合器(aggregator)、市集(marketplace)、安裝器目錄或
清單類專案絕不屬於目錄條目,即使該聚合器本身可以被安裝也一樣。它只能作為線索使用。你應追蹤
每一條線索,找到可獨立安裝的子作品,並在提交之前先確認該作品實際的創作者、原始儲存庫、套件
與來源子路徑。真正屬於創作者本人的 monorepo,可以作為子外掛的原始儲存庫,但子外掛必須使用
該確切的子路徑,並套用 monorepo 的星標數政策。

`kind` 欄位是唯一的標準 DSH 作品判別欄位。並沒有另外一個獨立的整合類型欄位:`plugin` 本身
就代表原生 DSH 套件,而 `ecosystem-project` 本身就代表內含 DSH 整合的更廣泛專案。這樣可以避
免出現互相矛盾的分類組合。

## 主要能力分類

| 值 | 顯示標籤 |
|---|---|
| `user-interface-dashboards` | 使用者介面與儀表板 |
| `memory-rag` | 記憶與 RAG |
| `search-research` | 搜尋與研究 |
| `coding-developer-tools` | 程式撰寫與開發者工具 |
| `browser-automation` | 瀏覽器與自動化 |
| `vision-audio-multimodal` | 視覺、音訊與多模態 |
| `sessions-productivity` | 工作階段與生產力 |
| `security-permissions-approvals` | 安全性、權限與核准 |
| `diagnostics-observability` | 診斷與可觀測性 |
| `models-providers-routing` | 模型、供應商與路由 |
| `messaging-notifications` | 訊息與通知 |
| `data-external-services` | 資料與外部服務 |
| `entertainment-customization` | 娛樂與客製化 |

請選擇最能代表該外掛主要功能的分類,而不是最有可能提高曝光度的分類。

## 介面標籤(Interface tags)

標準介面標籤包含 `web-ui`、`sidebar`、`settings`、`tui`、`cli`、`desktop`、`mobile`、
`remote`、`editor`、`headless` 與 `theme`。只要能力有明確證據可在固定的原始來源中看到,也
允許額外使用小寫、以連字號分隔(kebab-case)的能力標籤。

## 儲存庫範圍(Repository scope)

只有在儲存庫星標數確實屬於該確切收錄外掛本身時,才可使用 `dedicated`。若該外掛是更廣泛專案
中的子路徑或套件,則使用 `monorepo`。monorepo 條目必須使用
`popularity.starsPolicy: undefined-parent-repository` 與 `popularity.stars: null`。

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
