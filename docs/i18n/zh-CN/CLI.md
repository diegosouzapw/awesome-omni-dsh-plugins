# CLI 参考手册 — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · **中文（简体）**

> **非官方社区项目,与 DeepSeek 无关联、未经其认可,也未获其赞助。**
> DeepSeek 的名称与标识归其各自所有者所有。

本页记录已发布 CLI 在 `1.0.1` 版本中的确切行为。下文的每一条命令概要和参数都来自已发布命令自身的 `--help` 输出;此处不描述任何尚未发布的行为。该 CLI 在本仓库的 [`cli/`](../../cli) 目录下开发,并作为 [`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins) 发布到 npm,并附带溯源证明(provenance attestation),将每次构建绑定到产生它的提交和工作流运行。

```bash
npx omni-dsh-plugins --help
```

## v1.0.1 中的设计原则

- **默认只读。** `catalog`、`search`、`info`、`list` 和 `doctor` 绝不会修改配置文件(profile)、写入文件或启动插件代码。
- **代码执行需明确同意。** 除非传入 `--allow-code-execution`,否则 `add`、`update` 和 `remove` 会拒绝运行 DSH/pnpm 生命周期代码。若不传入该参数,可使用 `--dry-run` 查看已验证的执行计划。
- **原生 Windows 政策。** 在 v1.0.1 中,原生 Windows 上带代码执行的 `add`/`update`/`remove` 已被禁用;请使用 WSL。Dry-run 和只读命令仍然可用,原生 Windows 的恢复标记需要按文档说明进行手动恢复。
- **固定输入。** 目录输入可以是本地目录、快照文件,或固定的公开快照 URL,并可选地锁定到确切的 40 个字符的修订版本(revision)。

## 通用选项

以下选项出现在消费目录的命令中(`catalog validate`、`search`、`info`、`add`、`update`、`remove`、`doctor`):

| 选项                       | 含义                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| `--catalog <path-or-url>` | 本地目录路径、快照文件,或固定的公开快照 URL |
| `--revision <sha>`        | 确切的 40 个字符快照修订版本                               |
| `--json`                  | 输出稳定的 JSON                                            |

全局选项:`-V, --version` 输出 CLI 版本号;`-h, --help` 输出任意命令的帮助信息(`dsh-plugins help [command]` 同样有效)。

## 退出码

该 CLI 使用常规的进程退出码:

| 退出码 | 含义                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | 成功(包括“为空但有效”的结果,例如空目录)     |
| `1`       | 失败:校验错误、条目未找到、缺少必需选项,或诊断检查报告了错误 |

在 v1.0.1 中观察到的示例:对一个有效的空目录运行 `catalog validate` 会以 `0` 退出,并输出
`0 entries valid; catalog is empty`;`info <unknown-id>` 会以 `1` 退出,并输出 `Plugin not found`;
当任何检查项(例如缺少 `dsh` 可执行文件)报告错误时,`doctor` 会以 `1` 退出。

## 命令

### `catalog` — 校验公开的目录表面

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — 校验目录 YAML 及其语义:安全 YAML 解析、公开模式、SPDX 表达式解析、确切
  SemVer、SHA-512 SRI,以及拒绝重复 ID /“仓库节点 ID + 子路径”。它是本地的、只读的:不会联系
  GitHub、解析仓库身份,也不会检查固定提交处的证据。这正是 `catalog-validation` CI 任务在每个目录
  拉取请求上运行的命令。
- **`catalog docs-check [root]`** — 检查所需的公开目录文档是否存在,以及 Markdown 代码围栏是否配对
  平衡。
- **`catalog github-forms-check [root]`** — 检查结构化的公开 GitHub issue 表单(认领、更正、移除)。

```bash
# From the repository root:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — 在本地搜索公开目录字段

```text
dsh-plugins search [options] <query...>
```

根据所选的目录输入,在本地搜索公开目录字段。打印匹配的条目;若没有匹配项,则打印
`No plugins found.`(退出码为 `0`)。

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — 在目录之外查找插件

```text
dsh-plugins discover [options] <query...>
```

> `discover` 随 `1.0.0` 发布,这是使用该软件包名称的首个版本。

它会先搜索经过策展的目录,然后——除非传入 `--offline`——再搜索实时的 GitHub `dsh-plugin` 主题
(topic),因此即使某个插件尚未提交,也仍然可以被找到。目录结果携带目录持有的证据(固定提交、创作
者、许可证);社区结果不携带任何这些信息,并会被相应标注,因为它们完全没有经过审查。

`--limit <n>` 限制每一层级的结果数量(默认 `8`)。`--json` 输出稳定的机器可读格式,该格式绝不会本
地化。

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — 显示一个公开目录条目

```text
dsh-plugins info [options] <id>
```

按规范插件 ID 显示一个公开目录条目。当该 ID 不在目录中时,以 `1` 退出,并输出
`Plugin not found: <id>`。

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — 通过官方 DSH 委托添加一个目录插件

```text
dsh-plugins add [options] <id>
```

| 选项                                    | 含义                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `--profile <name>`       | 要变更的 DSH 配置文件(profile)(实践中为必填;不传入会导致命令报错) |
| `--dry-run`              | 显示已验证的执行计划,不写入文件也不启动子进程               |
| `--allow-code-execution` | 同意执行 DSH/pnpm 生命周期代码(原生 Windows 已禁用;请使用 WSL) |
| `--catalog` / `--revision` / `--json` | 见上文的通用选项                                  |

该版本中 dry-run 的语义:命令会解析并验证固定条目的执行计划并将其打印出来,不创建任何文件,也不
启动任何子进程。实际安装会委托给官方 DSH 工具,并且只有在传入 `--allow-code-execution` 时才会继续
执行。

```bash
# Preview only — nothing is written, nothing executes:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — 通过官方 DSH 委托更新一个目录插件

```text
dsh-plugins update [options] <id>
```

选项和同意语义与 `add` 相同:`--profile <name>`、`--dry-run`、`--allow-code-execution`,以及上文的
通用目录选项。

### `remove` — 通过官方 DSH 委托移除一个目录管理的插件

```text
dsh-plugins remove [options] <id>
```

选项和同意语义与 `add` 相同。仅会移除由目录管理的安装。

### `recover` — 恢复保留的 POSIX 变更

```text
dsh-plugins recover
```

在 `add`/`update`/`remove` 被中断后,恢复保留的 POSIX 变更。若没有待处理项,则打印
`No mutation recovery is pending.` 并以 `0` 退出。根据文档中的政策,原生 Windows 的恢复仍需手动
进行。

### `list` — 列出目录管理的安装

```text
dsh-plugins list [--profile <name>] [--json]
```

列出由目录管理的安装,不会修改配置文件。`--profile <name>` 按 DSH 配置文件进行过滤。若没有已安装
项,则打印 `No catalog-managed plugins installed.` 并以 `0` 退出。

### `doctor` — 只读诊断

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

运行只读的 Node、DSH、原生 Windows 政策和目录诊断。每项检查会报告 `ok` 或 `error`;只要出现一个
`error`,整体退出码就是 `1`。以下是在没有 `dsh` 可执行文件的机器上的示例输出:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## 本地校验无法证明的内容

`catalog validate` 通过(绿色)只能确认结构和本地语义,不能证明远程仓库身份、创作者所有权,或
固定提交处的证据——维护者会在任何合并之前应用那些单独的溯源门禁,详见
[CONTRIBUTING.md](../../CONTRIBUTING.md) 和 [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)。

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
