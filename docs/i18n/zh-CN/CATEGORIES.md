# 目录分类

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · **中文（简体）**

每个目录条目都有一个制品类型(artifact kind)、一个主要能力分类,以及零个或多个标签。主分类决定
条目出现在哪里;标签则提供跨分类的搜索能力,而不会重复该条目。

## 制品类型

<!-- catalog-policy:aggregators-never-entries -->

| 取值 | 含义 | 是否按插件参与星标排名 |
|---|---|---:|
| `plugin` | 可安装的原生 DSH 插件包 | 仅当满足所有排名条件时 |
| `plugin-family` | 包含多个 DSH 插件的仓库 | 否;单独板块 |
| `skin-theme` | DSH UI 皮肤或视觉主题 | 否;单独板块 |
| `skill` | 支持 DSH 的智能体技能 | 否 |
| `preset-profile` | DSH 配置文件或预设 | 否 |
| `client-interface` | 桌面端、TUI、编辑器或远程客户端 | 否 |
| `bridge-adapter` | 从其他产品接入 DSH 的集成 | 否 |
| `ecosystem-project` | 包含 DSH 集成的更大项目 | 否 |

综合项目、聚合网站、市场、安装器目录或列表本身绝不能作为目录条目,即使该聚合网站本身可以被安装。
它只能被用作线索。请沿着每条线索找到可独立安装的子制品,并在提交前溯源该制品真实的创作者、原始
仓库、软件包和源代码子路径。创作者真实的单体仓库(monorepo)可以作为子插件的原始仓库,但子插件必
须使用其确切的子路径,并遵循单体仓库的星标政策。

`kind` 字段是规范的 DSH 制品类型判别符。不存在单独的集成类型字段:`plugin` 已经表示原生 DSH 插件
包,而 `ecosystem-project` 已经表示包含 DSH 集成的更大项目。这可以避免出现相互矛盾的分类组合。

## 主要能力分类

| 取值 | 显示标签 |
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

选择最能代表插件主要功能的分类,而不是最有可能提升曝光度的分类。

## 界面标签

标准界面标签包括 `web-ui`、`sidebar`、`settings`、`tui`、`cli`、`desktop`、`mobile`、`remote`、
`editor`、`headless` 和 `theme`。当额外的小写短横线命名(kebab-case)能力标签能够描述固定的原始来
源中可见的证据时,也允许使用。

## 仓库范围

只有当仓库星标确实属于该确切被收录的插件时,才使用 `dedicated`。当插件是更大项目内的一个子路径或
软件包时,使用 `monorepo`。单体仓库条目必须使用 `popularity.starsPolicy:
undefined-parent-repository` 和 `popularity.stars: null`。

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
