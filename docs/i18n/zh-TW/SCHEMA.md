# 目錄條目結構描述(Schema)參考

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **中文（繁體）**

> **非官方社群專案,與 DeepSeek 無關聯、未經其認可,也未獲其贊助。**
> DeepSeek 的名稱與標識歸其各自所有者所有。

本文件是 [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml) 的逐欄位參考,該檔案是
`catalog/plugins/` 底下每個檔案都必須符合的公開 JSON Schema(draft 2020-12)。結構描述檔案本身
才是唯一真實來源;當本頁與結構描述檔案不一致時,以結構描述檔案為準。

共有兩層驗證。公開結構描述強制執行有邊界的*安全形狀*(patterns 與長度限制,用於拒絕形似選項參
數或無邊界的值)。在此基礎上,`catalog validate` 還會套用強制性的語意剖析器:版本要求確切的
SemVer,完整性(integrity)值要求 SHA-512 SRI,授權要求 SPDX 表達式剖析,並拒絕重複鍵值。一個
值即使符合結構描述的 pattern,仍可能在語意層被拒絕。

頂層規則：條目是單一 YAML 物件，`additionalProperties: false`（未知欄位會被拒絕），且下列所有欄位皆為必填，只有 `media` 例外——它是唯一可選的欄位。

## 頂層欄位

| 欄位             | 型別    | 是否必要 | 說明                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   是    | 必須恰好等於 `1`                                           |
| `id`              | string  |   是    | 小寫連字號命名(kebab-case)的條目 ID;必須與檔名一致        |
| `name`            | string  |   是    | 顯示名稱,1–120 個字元                                        |
| `description`     | object  |   是    | 精心撰寫的英文摘要,以及其證據路徑                             |
| `unofficial`      | const   |   是    | 必須恰好等於 `true`                                        |
| `kind`            | enum    |   是    | 規範的 artifact 類型判別式                                     |
| `primaryCategory` | enum    |   是    | 單一的主要能力分類                                            |
| `tags`            | array   |   是    | 唯一的小寫連字號命名標籤(可以為空)                           |
| `source`          | object  |   是    | 原始儲存庫、節點 ID、子路徑與固定提交                         |
| `creator`         | object  |   是    | 創作者的公開 GitHub 帳號                                     |
| `package`         | object  |   是    | 規範的安裝描述子(npm **或** source)                          |
| `dsh`             | object  |   是    | DSH 設定檔與原生整合證據路徑                                  |
| `repositoryScope` | enum    |   是    | `dedicated` 或 `monorepo`                                     |
| `popularity`      | object  |   是    | 星標政策與星標數(取決於 scope)                               |
| `license`         | object  |   是    | 上游 SPDX 授權表達式                                          |
| `verification`    | object  |   是    | 驗證狀態、查核時間、身分與煙霧測試                            |
| `provenance`      | object  |   是    | 公開的 Discussion/留言網址,或 `null`                         |
| `media`           | array   |    否    | 最多 6 張螢幕截圖/影片，每個 URL 都釘選到 `source.commit` |

### `schemaVersion`

常數 `1`。標示公開結構描述版本 1;任何其他值都是無效的。

### `id`

需符合 `^[a-z0-9]+(?:-[a-z0-9]+)*$` 的字串 — 小寫連字號命名,不能有前導/尾隨或連續兩個連字
號。依 [CONTRIBUTING.md](../../CONTRIBUTING.md),條目檔案必須以相同的值命名為
`catalog/plugins/<id>.yaml`;驗證器會拒絕不一致的情況(`id-filename-mismatch`)。此 ID 也必
須以創作者的命名空間開頭:將 `creator.github` 帳號轉為小寫,並把每一段不屬於 `[a-z0-9]` 的
字元合併為單一連字號,再接上一個 `-`(`id-creator-prefix`)。

### `name`

自由格式的顯示名稱,`minLength: 1`,`maxLength: 120`。

### `description`

物件,恰好包含兩個必要屬性(不允許其他屬性):

| 屬性           | 型別   | 規則                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | 英文摘要,20–320 個字元                                                |
| `evidencePath` | string | 相對儲存庫路徑格式;不能有前導 `/`、不能有反斜線、不能有 `.`/`..` 路徑段 |

英文摘要必須依據 `evidencePath` 所指檔案在 `source.commit` 當下的內容精心撰寫——不能從其他目
錄照抄。

### `unofficial`

常數 `true`。標示該條目為非官方的機器可讀標記。

### `kind`

**唯一**的 artifact 類型判別式(不存在第二個整合類型欄位)。可為以下之一:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

意義及其對排名的影響定義於 [docs/CATEGORIES.md](../../docs/CATEGORIES.md)。

### `primaryCategory`

十四個能力分類之一:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

顯示標籤與選擇指引參見 [docs/CATEGORIES.md](../../docs/CATEGORIES.md)。

### `tags`

由唯一字串組成的陣列,每個元素都需符合 `^[a-z0-9]+(?:-[a-z0-9]+)*$`(小寫連字號命名)。結構描
述沒有強制要求最小數量。

### `source`

物件,恰好包含四個必要屬性:

| 屬性               | 型別           | 規則                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | `https://github.com/<owner>/<repo>` 格式的網址;owner 遵循 GitHub 使用者名稱規則,repo 名稱 1–100 個字元,不能是 `.`/`..`,也不能以 `.git` 結尾 |
| `repositoryNodeId` | string         | 不可變的 GitHub 儲存庫節點 ID,不能為空                                    |
| `subpath`          | string or null | 外掛在儲存庫內的子路徑(與 `evidencePath` 相同的安全相對路徑格式);若為儲存庫根目錄外掛,則為 `null` |
| `commit`           | string         | 完整的 40 字元十六進位提交 OID                                        |

目錄驗證必須解析 `repositoryNodeId`,並拒絕儲存庫網址不一致的情況——該解析屬於維護者一側的關
卡,不屬於本機結構檢查的一部分。

### `creator`

物件,包含一個必要屬性:

| 屬性     | 型別   | 規則                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | GitHub 使用者名稱(1–39 個字元,遵循 GitHub 帳號規則) |

公開個人檔案網址一律依 `https://github.com/<handle>` 推導得出;不儲存第二個個人檔案欄位,因此
兩者永遠不會不一致。

### `package`

規範的安裝描述子。它是資料,絕不是 shell 指令,並且恰好取以下兩種形狀之一(`oneOf`):

**npm 套件** — 必要的 `ecosystem`、`name`、`version`;選用的 `integrity`:

| 屬性        | 型別  | 規則                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | npm 套件名稱格式(可選擇加上作用域),最長 214 個字元                          |
| `version`   | string | 確切的 `x.y.z` 版本格式(可選 prerelease/build);拒絕版本範圍。語意層另外要求須為可剖析、確切的 SemVer |
| `integrity` | string | 選用的 `sha512-…` SRI 格式,8–256 個字元。語意層必須將其剖析為有效的 SHA-512 SRI |

**source 安裝** — 只需要 `ecosystem`:

| 屬性        | 型別  | 規則    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

source 描述子刻意不儲存其他任何內容:儲存庫、提交與子路徑均由 `source` 推導,因此可變值永遠不
會重複儲存。

### `dsh`

原生 DSH 整合證據:

| 屬性           | 型別   | 規則                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | array  | 至少一個符合 `^[A-Za-z0-9][A-Za-z0-9._-]*$` 的唯一設定檔名稱    |
| `evidencePath` | string | 指向 `source.commit` 當下 DSH 整合證據的安全相對路徑               |

### `repositoryScope`

取值為 `dedicated`(儲存庫星標屬於這個確切的外掛)或 `monorepo`(外掛是更大專案內的子路徑或套
件)。此值決定了下文的條件式熱度規則。

### `popularity`

| 屬性         | 型別            | 規則                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` 或 `undefined-parent-repository`  |
| `stars`      | integer or null | 非負整數,或 `null`                                   |

條件規則(由結構描述的 `allOf` 區塊強制執行):

- `repositoryScope: monorepo` **強制要求** `starsPolicy: undefined-parent-repository` 與
  `stars: null`。母專案的星標絕不會歸給單體儲存庫中的外掛。
- `repositoryScope: dedicated` **強制要求** `starsPolicy: exact-repository`,以及一個
  `stars >= 0` 的整數。

關於這些值如何用於排名判斷,參見 [docs/RANKING.md](../../docs/RANKING.md)。

### `license`

| 屬性     | 型別   | 規則                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | string | SPDX 表達式格式,2–256 個字元,不能以連字號開頭                    |

結構描述只強制執行安全的字元格式;目錄驗證必須使用真正的 SPDX 表達式剖析器來剖析並正規化該
值。請記錄在固定提交當下有證據支持的完整上游表達式(例如 `Apache-2.0` 或
`MIT OR GPL-3.0-only`)。

### `verification`

驗證是針對 `source.commit` 進行的。物件,包含四個必要屬性:

| 屬性                 | 型別           | 規則                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | 查核時間的 `date-time` 格式時間戳記                       |
| `repositoryIdentity` | const          | 必須為 `resolved`                                       |
| `smokeTest`          | object or null | 煙霧測試紀錄;若不存在符合條件的測試,則為 `null`         |

若存在,`smokeTest` 需要:

| 屬性            | 型別   | 規則                                                             |
| --------------- | ------ | ------------------------------------------------------------------ |
| `installTarget` | const  | `canonical-install-descriptor` — 參照 `package` 或固定的 source,不重複儲存可變值 |
| `check`         | object | 必要的 `name`(套件名稱格式)與 `version`(確切版本格式)          |
| `result`        | const  | `passed` — 失敗的煙霧測試不會被記錄為煙霧測試                     |

條件規則:`status: verified` **要求** `smokeTest` 為非空物件。沒有可供審查的煙霧測試證據的條目
使用 `status: eligible` 與 `smokeTest: null`。任何狀態都不代表官方背書或安全認證——參見
[docs/RANKING.md](../../docs/RANKING.md)。

### `provenance`

公開的溯源連結,每一個都是 URI 或 `null`:

| 屬性         | 型別          | 規則                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string or null | 若存在,則為公開 Discussion 網址                       |
| `comment`    | string or null | 若存在,則為公開留言網址                              |

### `media`

唯一可選的欄位。一個最多包含 **6** 個項目的陣列，每個項目描述外掛的一張螢幕截圖或一段短影片：

| 屬性 | 型別 | 規則 |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` 或 `video` |
| `url`    | string | 不可變的 GitHub URL，最長 2048 個字元（見下文） |
| `alt`    | string | 替代文字，1–120 個字元 |

這裡的 URL 必須和 `source.commit` 一樣不可變。帶分支名稱的 `raw.githubusercontent.com` 路徑（`.../main/docs/shot.png`）顯示的是該分支今天的內容，因此分支一移動，條目就會發布一張未經審核的圖片。只接受兩種形式：

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — 釘選到提交的 raw 路徑；
- `https://github.com/<owner>/<repo>/assets/…` — GitHub 的內容定址上傳 URL，用於 `video` 項目。

schema 只保證安全形狀（主機、40 位十六進位參考、長度上限）。其餘由 `catalog validate` 在語意層保證：URL 必須釘選**條目自己的** `source.commit`，且位於**條目自己的**儲存庫中；分支 URL 會被拒絕，錯誤為 `media[n].url must pin the entry commit, not a branch`。

沒有可展示的內容時請完全省略此欄位——`media: []` 不是表達「沒有螢幕截圖」的有效方式。此欄位是增量的：在它出現之前發布的條目仍然有效，忽略它的消費者讀取每個條目的方式與以往完全相同。

## `kind: skill` 條目

結構描述版本 1 也為 `kind: skill` 定義了第二份自成一體的條目契約，發布為
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml)（SKL-01 第 0 階段）。它完全
不觸及上面的外掛結構描述：`kind: plugin` 的條目繼續照原樣通過驗證，而技能結構描述檔案對
技能條目而言是真實來源，正如外掛結構描述之於外掛條目。

技能不是被安裝的，而是由 harness **載入**的，因此僅外掛才有的安裝描述子（`package`、`dsh`）
在技能條目上不存在，取而代之的是 `usage` + `compat`。技能也經常位於託管多個技能的儲存庫的
子目錄中，因此身分與去重依據是 `source.repository` + `source.subpath`，而不只是儲存庫本身。
技能條目不接受 `media` 圖庫：技能是 harness 載入的文字，沒有可截圖的內容
（正是 `additionalProperties: false` 強制了這一點）。

以下欄位完全保持上面為外掛條目記錄的形狀和規則：
`schemaVersion`、`id`、`name`、`description`、`unofficial`、`primaryCategory`、`tags`、
`source`、`creator`、`repositoryScope`、`license`、`provenance`。除 `triggers`（唯一可選的
技能欄位）外，每個欄位都是必要的。

### 技能特有欄位

| 欄位                 | 型別   | 是否必要 | 規則                                                        |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | const  |   是    | 必須恰好等於 `skill`                                        |
| `skillScope`         | enum   |   是    | `repository`（整個儲存庫**就是**技能）或 `subdirectory`（技能位於 `source.subpath`） |
| `triggers`           | array  |   否    | 技能何時觸發——使用者在載入它之前評估的文字。至少 1 個唯一字串，每個 3–200 個字元；沒有觸發條件時請完全省略此欄位（`triggers: []` 是無效的） |
| `usage.load`         | string |   是    | harness 如何載入該技能，1–200 個字元；技能只會被載入，絕不會被安裝 |
| `usage.evidencePath` | string |   是    | 指向 `source.commit` 處載入證據的安全相對路徑（與 `description.evidencePath` 相同的格式） |
| `compat.harnessMin`  | string |   是    | 技能經過驗證的最低 harness 版本；恰好的 `x.y.z` 形狀（可選的 prerelease/build），最長 64 個字元。語意層還額外要求一個可解析的、精確的 SemVer |

條件規則（由技能結構描述的 `allOf` 區塊強制執行）：

- `skillScope: subdirectory` **強制** `source.subpath` 為安全相對路徑字串——託管在
  子目錄中的技能必須釘選該子目錄。
- `skillScope: repository` **強制** `source.subpath: null`——整儲存庫技能不得宣告子路徑。

`verification` 保持外掛的形狀（`status`、`checkedAt`、`repositoryIdentity`、`smokeTest`），
但 `smokeTest` 必須恰好等於 `null`：技能沒有安裝煙霧測試，內容審查才是准入關卡。技能結構
描述不帶 `status: verified` → `smokeTest` 條件，也不帶 `repositoryScope` → `popularity`
條件；這些耦合僅是外掛結構描述的規則。

### 技能的語意層

在結構描述之上，目錄驗證在欄位存在時套用與外掛相同的強制語意解析器：`license.spdx` 必須
解析為有效的 SPDX 表達式（`invalid-spdx`），`compat.harnessMin` 必須是精確的 SemVer
（`invalid-semver`）。不存在 `invalid-sri` 情形——技能沒有 `package.integrity`。

### 技能身分與去重

技能的規範鍵是 `skill:<source.repositoryNodeId>:<normalized subpath>`。子路徑僅出於身分
目的進行正規化：反斜線變為 `/`，空段和 `.` 段被捨棄，空結果（或 `subpath: null`）變為
`.`——即整個儲存庫。包含 NUL 位元組或 `..` 段的子路徑會被拒絕，絕不會被「清理」。同一
儲存庫的兩個技能是兩個條目；相同的儲存庫 + 子路徑出現兩次則是衝突。

### 最小技能範例

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

## 結構描述不檢查的事

此結構描述在設計上僅做本機與結構性檢查。它**不會**驗證儲存庫是否存在、節點 ID 是否與網址相
符、證據路徑是否在固定提交當下存在、星標數是否準確,或創作者是否擁有該來源的所有權。這些檢查
屬於 [CONTRIBUTING.md](../../CONTRIBUTING.md) 與 [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)
中所述的維護者審查關卡。

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
