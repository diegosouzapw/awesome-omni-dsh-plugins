# CLI 參考手冊 — `@diegosouza.pw/dsh-plugins@0.1.0`

> 🌐 [English](../../docs/CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **中文（繁體）**

> **非官方社群專案,與 DeepSeek 無關聯、未經其認可,也未獲其贊助。**
> DeepSeek 的名稱與標識歸其各自所有者所有。

本頁記錄已發布 CLI 在 `0.1.0` 版本中的確切行為。以下每一條指令概要與參數都取自已發布指令自身的 `--help` 輸出;此處不描述任何尚未發布的行為。此 CLI 從私有原始碼維護,並以帶作用域的套件 [`@diegosouza.pw/dsh-plugins`](https://www.npmjs.com/package/@diegosouza.pw/dsh-plugins) 發布到 npm。

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 --help
```

## v0.1.0 中的設計原則

- **預設唯讀。** `catalog`、`search`、`info`、`list` 與 `doctor` 絕不會修改設定檔(profile)、寫入檔案或啟動外掛程式碼。
- **執行程式碼需明確同意。** 除非傳入 `--allow-code-execution`,否則 `add`、`update` 與 `remove` 會拒絕執行 DSH/pnpm 生命週期程式碼。若不傳入該參數,可使用 `--dry-run` 查看已驗證的執行計畫。
- **原生 Windows 政策。** 在 v0.1.0 中,原生 Windows 上帶程式碼執行的 `add`/`update`/`remove` 已停用;請改用 WSL。Dry-run 與唯讀指令仍可使用,原生 Windows 的復原標記需依文件說明手動復原。
- **固定輸入。** 目錄輸入可以是本機目錄、快照檔案,或固定的公開快照網址,並可選擇鎖定到確切的 40 字元修訂版本(revision)。

## 常用選項

以下選項會出現在會用到目錄的指令中(`catalog validate`、`search`、`info`、`add`、`update`、`remove`、`doctor`):

| 選項                       | 意義                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| `--catalog <path-or-url>` | 本機目錄路徑、快照檔案,或固定的公開快照網址 |
| `--revision <sha>`        | 確切的 40 字元快照修訂版本                               |
| `--json`                  | 輸出穩定的 JSON                                            |

全域選項:`-V, --version` 印出 CLI 版本;`-h, --help` 印出任一指令的說明(`dsh-plugins help [command]` 同樣有效)。

## 結束代碼

此 CLI 使用慣例的行程結束代碼:

| 結束代碼 | 意義                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | 成功(包括「空但有效」的結果,例如空目錄)     |
| `1`       | 失敗:驗證錯誤、找不到條目、缺少必要選項,或診斷檢查回報錯誤 |

在 v0.1.0 中觀察到的範例:對一個有效的空目錄執行 `catalog validate` 會以 `0` 結束,並輸出
`0 entries valid; catalog is empty`;`info <unknown-id>` 會以 `1` 結束,並輸出 `Plugin not found`;
當任一檢查項(例如缺少 `dsh` 執行檔)回報錯誤時,`doctor` 會以 `1` 結束。

## 指令

### `catalog` — 驗證公開的目錄介面

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — 驗證目錄 YAML 與其語意:安全 YAML 解析、公開結構描述、SPDX 表達式解
  析、確切 SemVer、SHA-512 SRI,以及拒絕重複 ID /「儲存庫節點 ID + 子路徑」。它是本機且唯讀的:
  不會連上 GitHub、解析儲存庫身分,也不會檢查固定提交當下的證據。這正是 `catalog-validation` CI
  工作在每個目錄提取請求上執行的指令。
- **`catalog docs-check [root]`** — 檢查所需的公開目錄文件是否存在,以及 Markdown 圍欄是否配對
  平衡。
- **`catalog github-forms-check [root]`** — 檢查結構化的公開 GitHub Issue 表單(認領、更正、移
  除)。

```bash
# From the repository root:
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog validate --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog docs-check .
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog github-forms-check .
```

### `search` — 在本機搜尋公開目錄欄位

```text
dsh-plugins search [options] <query...>
```

依所選的目錄輸入,在本機搜尋公開目錄欄位。印出相符的條目;若沒有相符項,則印出
`No plugins found.`(結束代碼為 `0`)。

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 search memory --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 search notes markdown --catalog . --json
```

### `discover` — 在目錄之外尋找外掛

```text
dsh-plugins discover [options] <query...>
```

> **未包含在已發布的 `0.1.0` 中。** `discover` 隨 `1.0.0` 發布;本頁其他所有指令都適用於目前發布
> 到 npm 上的版本。對 `@0.1.0` 執行此指令,會因未知指令而失敗。

它會先搜尋經過策展的目錄,接著——除非傳入 `--offline`——再搜尋即時的 GitHub `dsh-plugin` 主
題(topic),因此即使某個外掛尚未提交,仍然可以被找到。目錄結果帶有目錄持有的證據(固定提交、
創作者、授權);社群結果不帶有任何這些資訊,並會被相應標示,因為它們完全沒有經過審查。

`--limit <n>` 會限制每一層的結果數量(預設 `8`)。`--json` 輸出穩定的機器可讀格式,該格式絕不
會在地化。

```bash
npx @diegosouza.pw/dsh-plugins@1.0.0 discover memory --catalog .
npx @diegosouza.pw/dsh-plugins@1.0.0 discover vision --offline --catalog . --json
```

### `info` — 顯示一個公開目錄條目

```text
dsh-plugins info [options] <id>
```

依規範外掛 ID 顯示一個公開目錄條目。當該 ID 不在目錄中時,以 `1` 結束,並輸出
`Plugin not found: <id>`。

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 info example-notes-search --catalog .
```

### `add` — 透過官方 DSH 委派新增一個目錄外掛

```text
dsh-plugins add [options] <id>
```

| 選項                                    | 意義                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `--profile <name>`       | 要異動的 DSH 設定檔(profile)(實務上為必填;不傳入指令會出錯) |
| `--dry-run`              | 顯示已驗證的執行計畫,不寫入檔案也不啟動子行程               |
| `--allow-code-execution` | 同意執行 DSH/pnpm 生命週期程式碼(原生 Windows 已停用;請改用 WSL) |
| `--catalog` / `--revision` / `--json` | 見上文的常用選項                                  |

此版本中 dry-run 的語意:指令會解析並驗證固定條目的執行計畫並將其印出,不建立任何檔案,也不
啟動任何子行程。實際安裝會委派給官方 DSH 工具,且只有在傳入 `--allow-code-execution` 時才會繼
續執行。

```bash
# Preview only — nothing is written, nothing executes:
npx @diegosouza.pw/dsh-plugins@0.1.0 add example-notes-search --profile default --dry-run

# Real install — explicit consent to lifecycle code:
npx @diegosouza.pw/dsh-plugins@0.1.0 add example-notes-search --profile default --allow-code-execution
```

### `update` — 透過官方 DSH 委派更新一個目錄外掛

```text
dsh-plugins update [options] <id>
```

選項與同意語意和 `add` 相同:`--profile <name>`、`--dry-run`、`--allow-code-execution`,以及上
文的常用目錄選項。

### `remove` — 透過官方 DSH 委派移除一個由目錄管理的外掛

```text
dsh-plugins remove [options] <id>
```

選項與同意語意和 `add` 相同。只會移除由目錄管理的安裝。

### `recover` — 復原保留的 POSIX 變更

```text
dsh-plugins recover
```

在 `add`/`update`/`remove` 被中斷後,復原保留的 POSIX 變更。若沒有待處理項,會印出
`No mutation recovery is pending.` 並以 `0` 結束。依文件所述的政策,原生 Windows 的復原仍需手
動進行。

### `list` — 列出由目錄管理的安裝

```text
dsh-plugins list [--profile <name>] [--json]
```

列出由目錄管理的安裝,不會修改設定檔。`--profile <name>` 會依 DSH 設定檔篩選。若沒有已安裝
項,會印出 `No catalog-managed plugins installed.` 並以 `0` 結束。

### `doctor` — 唯讀診斷

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

執行唯讀的 Node、DSH、原生 Windows 政策與目錄診斷。每一項檢查會回報 `ok` 或 `error`;只要出現
一個 `error`,整體結束代碼就是 `1`。以下是在沒有 `dsh` 執行檔的機器上的範例輸出:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## 本機驗證無法證明的事

`catalog validate` 通過(綠燈)只能確認結構與本機語意,無法證明遠端儲存庫身分、創作者所有
權,或固定提交當下的證據——維護者會在任何合併之前套用那些另外的溯源關卡,詳見
[CONTRIBUTING.md](../../CONTRIBUTING.md) 與 [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)。

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
