# 目录条目模式(Schema)参考

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · **中文（简体）**

> **非官方社区项目,与 DeepSeek 无关联、未经其认可,也未获其赞助。**
> DeepSeek 的名称与标识归其各自所有者所有。

本文档是 [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) 的逐字段参考,该文件是每个
`catalog/plugins/` 下的文件都必须满足的公开 JSON Schema(draft 2020-12)。模式(schema)文件本身才是
唯一真实来源;当本页与模式文件不一致时,以模式文件为准。

共有两层校验。公开模式强制执行有边界的*安全形状*(patterns 和长度限制,用于拒绝形如选项参数或无
边界的值)。在此基础上,`catalog validate` 还会应用强制性的语义解析器:版本号要求确切的 SemVer,
完整性(integrity)值要求 SHA-512 SRI,许可证要求 SPDX 表达式解析,并拒绝重复键。一个值即使匹配了
模式的 pattern,仍可能在语义层面被拒绝。

顶层规则：条目是单个 YAML 对象，`additionalProperties: false`（未知字段会被拒绝），并且下面所有字段都是必填的，只有 `media` 例外——它是唯一可选的字段。

## 顶层字段

| 字段             | 类型    | 是否必需 | 说明                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   是    | 必须精确等于 `1`                                           |
| `id`              | string  |   是    | 小写短横线命名(kebab-case)的条目 ID;必须与文件名一致        |
| `name`            | string  |   是    | 显示名称,1–120 个字符                                        |
| `description`     | object  |   是    | 精心撰写的英文摘要,以及其证据路径                             |
| `unofficial`      | const   |   是    | 必须精确等于 `true`                                        |
| `kind`            | enum    |   是    | 规范的制品类型判别符                                          |
| `primaryCategory` | enum    |   是    | 单一的主要能力分类                                            |
| `tags`            | array   |   是    | 唯一的小写短横线命名标签(可以为空)                           |
| `source`          | object  |   是    | 原始仓库、节点 ID、子路径和固定提交                           |
| `creator`         | object  |   是    | 创作者的公开 GitHub 用户名                                    |
| `package`         | object  |   是    | 规范的安装描述符(npm **或** source)                          |
| `dsh`             | object  |   是    | DSH 配置文件和原生集成证据路径                                |
| `repositoryScope` | enum    |   是    | `dedicated` 或 `monorepo`                                     |
| `popularity`      | object  |   是    | 星标政策和星标数(取决于 scope)                               |
| `license`         | object  |   是    | 上游 SPDX 许可证表达式                                        |
| `verification`    | object  |   是    | 验证状态、检查时间、身份和冒烟测试                            |
| `provenance`      | object  |   是    | 公开的 Discussion/评论 URL,或 `null`                         |
| `media`           | array   |    否    | 最多 6 张截图/视频，每个 URL 都固定到 `source.commit` |

### `schemaVersion`

常量 `1`。标识公开模式版本 1;任何其他值都是无效的。

### `id`

匹配 `^[a-z0-9]+(?:-[a-z0-9]+)*$` 的字符串 — 小写短横线命名,不能有前导/尾随连字符或双连字符。根据
[CONTRIBUTING.md](../../CONTRIBUTING.md),条目文件必须以相同的值命名为 `catalog/plugins/<id>.yaml`;
校验器会拒绝不一致的情况(`id-filename-mismatch`)。该 ID 还必须以创作者的命名空间开头:即将
`creator.github` 用户名转为小写(任何一串不在 `[a-z0-9]` 范围内的字符会被合并为一个 `-`)后再加上
`-`(`id-creator-prefix`)。

### `name`

自由格式的显示名称,`minLength: 1`,`maxLength: 120`。

### `description`

对象,恰好包含两个必需属性(不允许有其他属性):

| 属性           | 类型   | 规则                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | 英文摘要,20–320 个字符                                                |
| `evidencePath` | string | 相对仓库路径模式;不能有前导 `/`、不能有反斜杠、不能有 `.`/`..` 路径段 |

英文摘要必须依据 `evidencePath` 处文件在 `source.commit` 时的内容精心撰写——不能从其他目录照抄。

### `unofficial`

常量 `true`。表明该条目为非官方的机器可读标记。

### `kind`

**唯一**的制品类型判别符(不存在第二个集成类型字段)。取值之一:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

含义及其对排名的影响定义在 [docs/CATEGORIES.md](../../docs/CATEGORIES.md) 中。

### `primaryCategory`

十四个能力分类之一:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

显示标签和选择指南参见 [docs/CATEGORIES.md](../../docs/CATEGORIES.md)。

### `tags`

唯一字符串组成的数组,每个元素都匹配 `^[a-z0-9]+(?:-[a-z0-9]+)*$`(小写短横线命名)。模式没有强制
要求最小数量。

### `source`

对象,恰好包含四个必需属性:

| 属性               | 类型           | 规则                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` 格式的 URL;owner 遵循 GitHub 用户名规则,repo 名称 1–100 个字符,不能是 `.`/`..`,也不能以 `.git` 结尾 |
| `repositoryNodeId` | string         | 不可变的 GitHub 仓库节点 ID,不能为空                                    |
| `subpath`          | string or null | 插件在仓库内的子路径(与 `evidencePath` 相同的安全相对路径模式);若为仓库根目录插件,则为 `null` |
| `commit`           | string         | 完整的 40 个字符十六进制提交 OID                                        |

目录校验必须解析 `repositoryNodeId`,并拒绝仓库 URL 不一致的情况——该解析属于维护者一侧的门禁,不
属于本地结构检查的一部分。

### `creator`

对象,包含一个必需属性:

| 属性     | 类型   | 规则                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub 用户名(1–39 个字符,遵循 GitHub 用户名规则) |

公开主页 URL 始终按 `https://github.com/<handle>` 推导得出;不存储第二个主页字段,因此两者永远不会
不一致。

### `package`

规范的安装描述符。它是数据,绝不是 shell 命令,并且恰好取以下两种形状之一(`oneOf`):

**npm 软件包** — 必需 `ecosystem`、`name`、`version`;可选 `integrity`:

| 属性        | 类型  | 规则                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm 软件包名称形状(可选带作用域),最长 214 个字符                          |
| `version`   | string | 确切的 `x.y.z` 版本形状(可选 prerelease/build);拒绝版本范围。语义层还要求是可解析的、确切的 SemVer |
| `integrity` | string | 可选的 `sha512-…` SRI 形状,8–256 个字符。语义层必须将其解析为有效的 SHA-512 SRI |

**source 安装** — 仅需 `ecosystem`:

| 属性        | 类型  | 规则    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

source 描述符刻意不存储其他任何内容:仓库、提交和子路径均从 `source` 派生,因此可变值永远不会重复
存储。

### `dsh`

原生 DSH 集成证据:

| 属性           | 类型   | 规则                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | array  | 至少一个匹配 `^[A-Za-z0-9][A-Za-z0-9._-]*$` 的唯一配置文件名称    |
| `evidencePath` | string | 指向 `source.commit` 处 DSH 集成证据的安全相对路径               |

### `repositoryScope`

取值为 `dedicated`(仓库星标属于这个确切的插件)或 `monorepo`(插件是更大项目内的一个子路径或软件
包)。该值决定了下文的条件性热度规则。

### `popularity`

| 属性         | 类型            | 规则                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` 或 `undefined-parent-repository`  |
| `stars`      | integer or null | 非负整数,或 `null`                                   |

条件规则(由模式的 `allOf` 代码块强制执行):

- `repositoryScope: monorepo` **强制要求** `starsPolicy: undefined-parent-repository` 和
  `stars: null`。父项目的星标绝不会归属给单体仓库中的插件。
- `repositoryScope: dedicated` **强制要求** `starsPolicy: exact-repository`,以及一个
  `stars >= 0` 的整数。

关于这些值如何用于排名判定,参见 [docs/RANKING.md](../../docs/RANKING.md)。

### `license`

| 属性     | 类型   | 规则                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | SPDX 表达式形状,2–256 个字符,不能以连字符开头                    |

模式只强制执行安全的字符形状;目录校验必须使用真正的 SPDX 表达式解析器来解析并规范化该值。请记录在
固定提交处有证据支持的完整上游表达式(例如 `Apache-2.0` 或 `MIT OR GPL-3.0-only`)。

### `verification`

验证针对 `source.commit` 进行。对象,包含四个必需属性:

| 属性                 | 类型           | 规则                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | 检查时间的 `date-time` 格式时间戳                       |
| `repositoryIdentity` | const          | 必须为 `resolved`                                       |
| `smokeTest`          | object or null | 冒烟测试记录;若不存在符合条件的测试,则为 `null`         |

当存在时,`smokeTest` 需要:

| 属性            | 类型   | 规则                                                             |
| --------------- | ------ | ------------------------------------------------------------------ |
| `installTarget` | const  | `canonical-install-descriptor` — 引用 `package` 或固定的 source,不重复存储可变值 |
| `check`         | object | 必需的 `name`(软件包名称形状)和 `version`(确切版本形状)          |
| `result`        | const  | `passed` — 失败的冒烟测试不会被记录为冒烟测试                     |

条件规则:`status: verified` **要求** `smokeTest` 是非空对象。没有可供审查的冒烟测试证据的条目使用
`status: eligible` 和 `smokeTest: null`。任何状态都不代表官方背书或安全认证——参见
[docs/RANKING.md](../../docs/RANKING.md)。

### `provenance`

公开的溯源链接,每一个都是 URI 或 `null`:

| 属性         | 类型          | 规则                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string or null | 存在时为公开 Discussion URL                       |
| `comment`    | string or null | 存在时为公开评论 URL                              |

### `media`

唯一可选的字段。一个最多包含 **6** 项的数组，每项描述插件的一张截图或一段短视频：

| 属性 | 类型 | 规则 |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` 或 `video` |
| `url`    | string | 不可变的 GitHub URL，最长 2048 个字符（见下文） |
| `alt`    | string | 替代文本，1–120 个字符 |

这里的 URL 必须和 `source.commit` 一样不可变。带分支名的 `raw.githubusercontent.com` 路径（`.../main/docs/shot.png`）显示的是该分支今天的内容，因此一旦分支移动，条目就会发布一张未经审核的图片。只接受两种形式：

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — 固定到提交的 raw 路径；
- `https://github.com/<owner>/<repo>/assets/…` — GitHub 的内容寻址上传 URL，用于 `video` 项。

schema 只保证安全形状（主机、40 位十六进制引用、长度上限）。其余由 `catalog validate` 在语义层保证：URL 必须固定到**本条目自己的** `source.commit`，且位于**本条目自己的**仓库中；分支 URL 会被拒绝，报错 `media[n].url must pin the entry commit, not a branch`。

没有可展示的内容时请完全省略该字段——`media: []` 不是表达“没有截图”的有效方式。该字段是增量的：在它出现之前发布的条目依然有效，忽略它的消费者读取每个条目的方式与以前完全相同。

## `kind: skill` 条目

模式版本 1 还为 `kind: skill` 定义了第二份自成一体的条目契约，发布为
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml)（SKL-01 第 0 阶段）。它完全
不触及上面的插件模式：`kind: plugin` 的条目继续按原样通过校验，而技能模式文件对技能条目而言
是真实来源，正如插件模式之于插件条目。

技能不是被安装的，而是由 harness **加载**的，因此仅插件才有的安装描述符（`package`、`dsh`）
在技能条目上不存在，取而代之的是 `usage` + `compat`。技能也经常位于托管多个技能的仓库的
子目录中，因此身份与去重依据是 `source.repository` + `source.subpath`，而不只是仓库本身。
技能条目不接受 `media` 图库：技能是 harness 加载的文本，没有可截图的内容
（正是 `additionalProperties: false` 强制了这一点）。

以下字段完全保持上面为插件条目记录的形状和规则：
`schemaVersion`、`id`、`name`、`description`、`unofficial`、`primaryCategory`、`tags`、
`source`、`creator`、`repositoryScope`、`license`、`provenance`。除 `triggers`（唯一可选的
技能字段）外，每个字段都是必需的。

### 技能特有字段

| 字段                 | 类型   | 是否必需 | 规则                                                        |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   是    | 必须精确等于 `skill`                                        |
| `skillScope`         | enum   |   是    | `repository`（整个仓库**就是**技能）或 `subdirectory`（技能位于 `source.subpath`） |
| `triggers`           | array  |   否    | 技能何时触发——用户在加载它之前评估的文本。至少 1 个唯一字符串，每个 3–200 个字符；没有触发条件时请完全省略该字段（`triggers: []` 是无效的） |
| `usage.load`         | string |   是    | harness 如何加载该技能，1–200 个字符；技能只会被加载，绝不会被安装 |
| `usage.evidencePath` | string |   是    | 指向 `source.commit` 处加载证据的安全相对路径（与 `description.evidencePath` 相同的模式） |
| `compat.harnessMin`  | string |   是    | 技能经过验证的最低 harness 版本；精确的 `x.y.z` 形状（可选的 prerelease/build），最长 64 个字符。语义层还额外要求一个可解析的、精确的 SemVer |

条件规则（由技能模式的 `allOf` 块强制执行）：

- `skillScope: subdirectory` **强制** `source.subpath` 为安全相对路径字符串——托管在
  子目录中的技能必须固定该子目录。
- `skillScope: repository` **强制** `source.subpath: null`——整仓库技能不得声明子路径。

`verification` 保持插件的形状（`status`、`checkedAt`、`repositoryIdentity`、`smokeTest`），
但 `smokeTest` 必须精确等于 `null`：技能没有安装冒烟测试，内容审查才是准入门禁。技能模式
不携带 `status: verified` → `smokeTest` 条件，也不携带 `repositoryScope` → `popularity`
条件；这些耦合仅是插件模式的规则。

### 技能的语义层

在模式之上，目录校验在字段存在时应用与插件相同的强制语义解析器：`license.spdx` 必须解析为
有效的 SPDX 表达式（`invalid-spdx`），`compat.harnessMin` 必须是精确的 SemVer
（`invalid-semver`）。不存在 `invalid-sri` 情形——技能没有 `package.integrity`。

### 技能身份与去重

技能的规范键是 `skill:<source.repositoryNodeId>:<normalized subpath>`。子路径仅出于身份
目的进行规范化：反斜杠变为 `/`，空段和 `.` 段被丢弃，空结果（或 `subpath: null`）变为
`.`——即整个仓库。包含 NUL 字节或 `..` 段的子路径会被拒绝，绝不会被"清理"。同一仓库的
两个技能是两个条目；相同的仓库 + 子路径出现两次则是冲突。

### 最小技能示例

```yaml
schemaVersion: 1
id: alice-dsh-commit-lint-skill
name: DSH Commit Lint Skill
description:
  en: Loads a commit-message linting skill that checks Conventional Commit shape before the harness commits.
  evidencePath: skills/commit-lint/SKILL.md
unofficial: true
kind: skill
skillScope: subdirectory
primaryCategory: coding-developer-tools
tags:
  - git
  - linting
triggers:
  - When the user asks to commit staged work
source:
  repository: https://github.com/alice/dsh-skills
  repositoryNodeId: R_kgDOexample1
  subpath: skills/commit-lint
  commit: 0123456789abcdef0123456789abcdef01234567
creator:
  github: alice
usage:
  load: dsh skill load skills/commit-lint
  evidencePath: skills/commit-lint/SKILL.md
compat:
  harnessMin: 1.4.0
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
license:
  spdx: MIT
verification:
  status: eligible
  checkedAt: 2026-08-30T12:00:00Z
  repositoryIdentity: resolved
  smokeTest: null
provenance:
  discussion: null
  comment: null
```

## 模式不检查的内容

该模式在设计上只做本地和结构性检查。它**不会**验证仓库是否存在、节点 ID 是否与 URL 匹配、证据路径
是否在固定提交处存在、星标数是否准确,或创作者是否拥有该来源的所有权。这些检查属于
[CONTRIBUTING.md](../../CONTRIBUTING.md) 和 [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md) 中所述的
维护者审查门禁。

<!-- i18n-source-hash: 7928f14612f5cf4a63bfedceed6c38d862a829a4f88a0045efd277aec2b62f47 -->
