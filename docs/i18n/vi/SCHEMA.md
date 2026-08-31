# Tài liệu tham khảo Schema mục danh mục

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Tiếng Việt**

> **Đây là dự án cộng đồng không chính thức. Không liên kết, không được chứng thực, và không được DeepSeek tài trợ.**
> Tên gọi và nhãn hiệu của DeepSeek thuộc về chủ sở hữu tương ứng.

Đây là tài liệu tham khảo theo từng trường cho
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml), JSON Schema công khai (draft 2020-12) mà mọi
file dưới `catalog/plugins/` phải thỏa mãn. Bản thân file schema là nguồn dữ liệu chân lý; khi trang này và schema
không khớp nhau, schema là căn cứ chính thức.

Có hai lớp xác thực được áp dụng. Schema công khai bắt buộc các *hình dạng an toàn* có giới hạn (mẫu và độ dài từ
chối các giá trị giống tùy chọn dòng lệnh hoặc không giới hạn). Bên trên đó, `catalog validate` áp dụng các bộ phân
tích ngữ nghĩa bắt buộc: SemVer chính xác cho phiên bản, SHA-512 SRI cho giá trị integrity, phân tích biểu thức SPDX
cho giấy phép, và từ chối khóa trùng lặp. Một giá trị có thể khớp mẫu của schema nhưng vẫn bị từ chối về mặt ngữ
nghĩa.

Quy tắc cấp cao nhất: mục nhập là một đối tượng YAML duy nhất, `additionalProperties: false`
(các trường không xác định bị từ chối), và mọi trường dưới đây đều bắt buộc trừ `media` —
trường tùy chọn duy nhất.

## Các trường cấp cao nhất

| Trường             | Kiểu    | Bắt buộc | Tóm tắt                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | hằng số   |   có    | Phải chính xác bằng `1`                                           |
| `id`              | chuỗi  |   có    | ID mục dạng lowercase kebab-case; phải khớp với tên file        |
| `name`            | chuỗi  |   có    | Tên hiển thị, 1–120 ký tự                                |
| `description`     | đối tượng  |   có    | Tóm tắt tiếng Anh đã biên tập cùng đường dẫn bằng chứng của nó |
| `unofficial`      | hằng số   |   có    | Phải chính xác bằng `true`                                        |
| `kind`            | enum    |   có    | Bộ phân biệt loại sản phẩm chính tắc                            |
| `primaryCategory` | enum    |   có    | Một danh mục năng lực chính duy nhất                            |
| `tags`            | mảng   |   có    | Các thẻ lowercase kebab-case duy nhất (có thể rỗng)               |
| `source`          | đối tượng  |   có    | Repository gốc, ID node, subpath và commit đã ghim       |
| `creator`         | đối tượng  |   có    | Tên đăng nhập GitHub công khai của nhà phát triển                                  |
| `package`         | đối tượng  |   có    | Mô tả cài đặt chính tắc (npm **hoặc** source)                    |
| `dsh`             | đối tượng  |   có    | Các profile DSH và đường dẫn bằng chứng tích hợp gốc             |
| `repositoryScope` | enum    |   có    | `dedicated` hoặc `monorepo`                                     |
| `popularity`      | đối tượng  |   có    | Chính sách sao và số sao (có điều kiện theo phạm vi)            |
| `license`         | đối tượng  |   có    | Biểu thức giấy phép SPDX gốc                                   |
| `verification`    | đối tượng  |   có    | Trạng thái xác minh, thời điểm kiểm tra, danh tính và smoke test      |
| `provenance`      | đối tượng  |   có    | URL Discussion/bình luận công khai hoặc `null`                      |
| `media`           | array   |    không    | Tối đa 6 ảnh chụp màn hình/video, mọi URL đều ghim vào `source.commit` |

### `schemaVersion`

Hằng số `1`. Xác định phiên bản 1 của schema công khai; mọi giá trị khác đều không hợp lệ.

### `id`

Chuỗi khớp `^[a-z0-9]+(?:-[a-z0-9]+)*$` — lowercase kebab-case, không có dấu gạch ngang ở đầu/cuối hoặc lặp đôi. Theo
[CONTRIBUTING.md](../../CONTRIBUTING.md), file của mục phải được đặt tên `catalog/plugins/<id>.yaml` với giá trị
giống hệt; trình xác thực từ chối trường hợp không khớp (`id-filename-mismatch`). ID cũng phải bắt đầu bằng namespace
của nhà phát triển: tên đăng nhập `creator.github` viết thường, với mọi chuỗi ký tự nằm ngoài `[a-z0-9]` được gộp
thành một dấu gạch ngang duy nhất, theo sau bởi `-` (`id-creator-prefix`).

### `name`

Tên hiển thị tự do, `minLength: 1`, `maxLength: 120`.

### `description`

Đối tượng có đúng hai thuộc tính bắt buộc (không cho phép thuộc tính nào khác):

| Thuộc tính       | Kiểu   | Quy tắc                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `en`           | chuỗi | Tóm tắt tiếng Anh, 20–320 ký tự                                    |
| `evidencePath` | chuỗi | Mẫu đường dẫn repo tương đối; không có `/` ở đầu, không dấu gạch chéo ngược, không có đoạn `.`/`..` |

Tóm tắt tiếng Anh phải được biên tập từ file tại `evidencePath` đúng như nó tồn tại tại `source.commit` — không được
sao chép từ một danh mục khác.

### `unofficial`

Hằng số `true`. Điểm đánh dấu có thể đọc được bằng máy rằng mục niêm yết này là không chính thức.

### `kind`

Bộ phân biệt **duy nhất** cho loại sản phẩm (không tồn tại trường thứ hai về loại tích hợp). Là một trong:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Ý nghĩa và hệ quả đối với xếp hạng được định nghĩa tại [docs/CATEGORIES.md](CATEGORIES.md).

### `primaryCategory`

Một trong mười bốn danh mục năng lực:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization` · `finance-trading`

Nhãn hiển thị và hướng dẫn lựa chọn nằm tại [docs/CATEGORIES.md](CATEGORIES.md).

### `tags`

Mảng các chuỗi duy nhất, mỗi chuỗi khớp `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab-case). Schema không quy định
số lượng tối thiểu.

### `source`

Đối tượng có đúng bốn thuộc tính bắt buộc:

| Thuộc tính           | Kiểu           | Quy tắc                                                                  |
| ------------------ | -------------- | ------------------------------------------------------------------------ |
| `repository`       | chuỗi         | URL dạng `https://github.com/<owner>/<repo>`; owner tuân theo quy tắc username của GitHub, tên repo 1–100 ký tự, không được là `.`/`..` hay kết thúc bằng `.git` |
| `repositoryNodeId` | chuỗi         | ID node repository bất biến của GitHub, không rỗng                         |
| `subpath`          | chuỗi hoặc null | Subpath của plugin bên trong repository (cùng mẫu đường dẫn tương đối an toàn như `evidencePath`), hoặc `null` nếu plugin nằm ngay tại gốc repository |
| `commit`           | chuỗi         | OID commit hex đầy đủ 40 ký tự                                              |

Việc xác thực danh mục phải xác định `repositoryNodeId` và từ chối trường hợp URL repository không khớp — việc xác
định đó là một cổng kiểm soát riêng của người bảo trì, không thuộc kiểm tra cấu trúc cục bộ.

### `creator`

Đối tượng có một thuộc tính bắt buộc:

| Thuộc tính | Kiểu   | Quy tắc                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | chuỗi | Tên đăng nhập GitHub (1–39 ký tự, theo quy tắc handle của GitHub) |

URL hồ sơ công khai luôn được suy ra là `https://github.com/<handle>`; không lưu trữ trường hồ sơ thứ hai, nên hai
giá trị này không bao giờ có thể lệch nhau.

### `package`

Mô tả cài đặt chính tắc. Đó là dữ liệu, không bao giờ là một lệnh shell, và chỉ có đúng một trong hai hình dạng
(`oneOf`):

**Gói npm** — bắt buộc `ecosystem`, `name`, `version`; tùy chọn `integrity`:

| Thuộc tính    | Kiểu  | Quy tắc                                                                      |
| ----------- | ----- | ---------------------------------------------------------------------------- |
| `ecosystem` | hằng số | `npm`                                                                      |
| `name`      | chuỗi | Hình dạng tên gói npm (có thể có scope), tối đa 214 ký tự                 |
| `version`   | chuỗi | Hình dạng phiên bản chính xác `x.y.z` (có thể có prerelease/build); từ chối các dải phiên bản. Lớp ngữ nghĩa còn yêu cầu SemVer chính xác, có thể phân tích được |
| `integrity` | chuỗi | Hình dạng SRI `sha512-…` tùy chọn, 8–256 ký tự. Lớp ngữ nghĩa phải phân tích nó thành SHA-512 SRI hợp lệ |

**Cài đặt từ source** — chỉ bắt buộc `ecosystem`:

| Thuộc tính    | Kiểu  | Quy tắc    |
| ----------- | ----- | -------- |
| `ecosystem` | hằng số | `source` |

Một mô tả source cố tình không lưu trữ gì thêm: repository, commit và subpath được suy ra từ `source`, nên các giá
trị có thể thay đổi không bao giờ bị lặp lại.

### `dsh`

Bằng chứng tích hợp DSH gốc:

| Thuộc tính       | Kiểu   | Quy tắc                                                          |
| -------------- | ------ | ---------------------------------------------------------------- |
| `profiles`     | mảng  | Ít nhất một tên profile duy nhất khớp `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | chuỗi | Đường dẫn tương đối an toàn tới bằng chứng tích hợp DSH tại `source.commit` |

### `repositoryScope`

Hoặc `dedicated` (số sao repository thuộc về đúng plugin này) hoặc `monorepo` (plugin là một subpath hoặc gói bên
trong một dự án lớn hơn). Giá trị này quyết định các quy tắc độ phổ biến có điều kiện bên dưới.

### `popularity`

| Thuộc tính     | Kiểu            | Quy tắc                                                |
| ------------ | --------------- | ----------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` hoặc `undefined-parent-repository`  |
| `stars`      | số nguyên hoặc null | Số nguyên không âm, hoặc `null`                      |

Quy tắc có điều kiện (được thực thi bởi các khối `allOf` của schema):

- `repositoryScope: monorepo` **buộc** phải dùng `starsPolicy: undefined-parent-repository` và `stars: null`. Số sao
  của dự án gốc không bao giờ được gán cho một plugin trong monorepo.
- `repositoryScope: dedicated` **buộc** phải dùng `starsPolicy: exact-repository` và một số nguyên `stars >= 0`.

Xem [docs/RANKING.md](RANKING.md) để biết các giá trị này góp phần vào tiêu chí xếp hạng như thế nào.

### `license`

| Thuộc tính | Kiểu   | Quy tắc                                                          |
| -------- | ------ | ---------------------------------------------------------------- |
| `spdx`   | chuỗi | Hình dạng biểu thức SPDX, 2–256 ký tự, không có dấu gạch ngang ở đầu          |

Schema chỉ bắt buộc một hình dạng ký tự an toàn; việc xác thực danh mục phải phân tích và chuẩn hóa giá trị bằng một
bộ phân tích biểu thức SPDX thực sự. Ghi lại toàn bộ biểu thức gốc có bằng chứng tại commit đã ghim (ví dụ
`Apache-2.0` hoặc `MIT OR GPL-3.0-only`).

### `verification`

Việc xác minh áp dụng cho `source.commit`. Đối tượng có bốn thuộc tính bắt buộc:

| Thuộc tính             | Kiểu           | Quy tắc                                                  |
| -------------------- | -------------- | -------------------------------------------------------- |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | chuỗi         | Dấu thời gian định dạng `date-time` của lần kiểm tra           |
| `repositoryIdentity` | hằng số          | Phải bằng `resolved`                                     |
| `smokeTest`          | đối tượng hoặc null | Bản ghi smoke test, hoặc `null` khi không có bài kiểm tra hợp lệ nào |

Khi có, `smokeTest` yêu cầu:

| Thuộc tính        | Kiểu   | Quy tắc                                                             |
| --------------- | ------ | ------------------------------------------------------------------- |
| `installTarget` | hằng số  | `canonical-install-descriptor` — tham chiếu tới `package` hoặc source đã ghim mà không lặp lại các giá trị có thể thay đổi |
| `check`         | đối tượng | Bắt buộc `name` (hình dạng tên gói) và `version` (hình dạng phiên bản chính xác) |
| `result`        | hằng số  | `passed` — một smoke test thất bại sẽ không được ghi lại như một smoke test    |

Quy tắc có điều kiện: `status: verified` **yêu cầu** một đối tượng `smokeTest` khác null. Các mục không có bằng
chứng smoke test có thể xét duyệt được sẽ dùng `status: eligible` và `smokeTest: null`. Không trạng thái nào là sự
chứng thực hay chứng nhận bảo mật — xem [docs/RANKING.md](RANKING.md).

### `provenance`

Các liên kết nguồn gốc công khai, mỗi liên kết là một URI hoặc `null`:

| Thuộc tính     | Kiểu          | Quy tắc                                            |
| ------------ | ------------- | -------------------------------------------------- |
| `discussion` | chuỗi hoặc null | URL Discussion công khai nếu có            |
| `comment`    | chuỗi hoặc null | URL bình luận công khai nếu có               |

### `media`

Trường tùy chọn duy nhất. Một mảng có tối đa **6** mục, mỗi mục mô tả một ảnh chụp màn hình hoặc một video ngắn của plugin:

| Thuộc tính | Kiểu | Quy tắc |
| -------- | ------ | ----- |
| `kind`   | enum   | `screenshot` hoặc `video` |
| `url`    | string | URL GitHub bất biến, tối đa 2048 ký tự (xem bên dưới) |
| `alt`    | string | Văn bản thay thế, 1–120 ký tự |

URL ở đây phải bất biến như `source.commit`. Một đường dẫn `raw.githubusercontent.com` mang tên
nhánh (`.../main/docs/shot.png`) hiển thị nội dung nhánh đó có hôm nay, nên mục nhập sẽ công bố
một hình ảnh chưa được duyệt vào ngày nhánh dịch chuyển. Chỉ hai dạng được chấp nhận:

- `https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>` — đường dẫn raw đã ghim vào commit;
- `https://github.com/<owner>/<repo>/assets/…` — URL tải lên định địa chỉ theo nội dung của GitHub, dành cho mục `video`.

Schema chỉ bắt buộc hình dạng an toàn (máy chủ, tham chiếu thập lục phân 40 ký tự, độ dài giới
hạn). Phần còn lại do `catalog validate` bắt buộc về mặt ngữ nghĩa: URL phải ghim `source.commit`
**của chính mục nhập** trong kho **của chính mục nhập**, và URL nhánh bị từ chối với
`media[n].url must pin the entry commit, not a branch`.

Hãy bỏ hẳn trường này khi không có gì để hiển thị — `media: []` không phải cách hợp lệ để nói
"không có ảnh chụp màn hình". Trường này mang tính bổ sung: các mục được công bố trước khi nó tồn
tại vẫn hợp lệ, và một bên tiêu thụ bỏ qua nó vẫn đọc mọi mục y như trước.

## Mục nhập `kind: skill`

Schema phiên bản 1 cũng định nghĩa một hợp đồng mục nhập thứ hai, khép kín, dành cho
`kind: skill`, được công bố dưới dạng
[`schemas/skill.schema.yaml`](../../schemas/skill.schema.yaml) (SKL-01 giai đoạn 0). Nó không
bao giờ chạm vào schema plugin ở trên: các mục nhập với `kind: plugin` tiếp tục được xác thực
y như trước, và file schema skill là nguồn chân lý cho các mục nhập skill giống như cách
schema plugin là nguồn chân lý cho các mục nhập plugin.

Một skill không được cài đặt, nó được harness **tải**, nên các bộ mô tả cài đặt chỉ dành cho
plugin (`package`, `dsh`) không tồn tại trên mục nhập skill và được thay bằng `usage` +
`compat`. Một skill cũng thường sống trong thư mục con của một repository chứa nhiều skill,
nên danh tính và khử trùng lặp là `source.repository` + `source.subpath` thay vì chỉ riêng
repository. Mục nhập skill không chấp nhận thư viện `media`: skill là văn bản mà harness tải,
nên không có gì để chụp màn hình (`additionalProperties: false` chính là thứ bắt buộc điều đó).

Các trường sau giữ nguyên chính xác hình dạng và quy tắc đã được ghi cho mục nhập plugin ở
trên: `schemaVersion`, `id`, `name`, `description`, `unofficial`, `primaryCategory`, `tags`,
`source`, `creator`, `repositoryScope`, `license`, `provenance`. Mọi trường đều bắt buộc,
ngoại trừ `triggers`, trường skill duy nhất mang tính tùy chọn.

### Các trường riêng của skill

| Trường               | Kiểu   | Bắt buộc | Quy tắc                                                     |
| -------------------- | ------ | :------: | ----------------------------------------------------------- |
| `kind`               | hằng số  |   có    | Phải chính xác bằng `skill`                                 |
| `skillScope`         | enum   |   có    | `repository` (toàn bộ repository **chính là** skill) hoặc `subdirectory` (skill nằm tại `source.subpath`) |
| `triggers`           | mảng  |   không    | Khi nào skill kích hoạt — văn bản mà người dùng đánh giá trước khi tải nó. Ít nhất 1 chuỗi duy nhất, mỗi chuỗi 3–200 ký tự; hãy bỏ hẳn trường này khi không có gì (`triggers: []` là không hợp lệ) |
| `usage.load`         | chuỗi |   có    | Cách harness tải skill, 1–200 ký tự; một skill được tải, không bao giờ được cài đặt |
| `usage.evidencePath` | chuỗi |   có    | Đường dẫn tương đối an toàn (cùng mẫu như `description.evidencePath`) tới bằng chứng tải tại `source.commit` |
| `compat.harnessMin`  | chuỗi |   có    | Phiên bản harness tối thiểu mà skill đã được kiểm chứng; hình dạng `x.y.z` chính xác (prerelease/build tùy chọn), tối đa 64 ký tự. Tầng ngữ nghĩa còn yêu cầu thêm một SemVer chính xác, phân tích được |

Các quy tắc có điều kiện (được các khối `allOf` của schema skill bắt buộc):

- `skillScope: subdirectory` **buộc** `source.subpath` phải là một chuỗi đường dẫn tương đối
  an toàn — skill được lưu trong thư mục con phải ghim thư mục con đó.
- `skillScope: repository` **buộc** `source.subpath: null` — skill toàn-repository không được
  khai báo subpath.

`verification` giữ nguyên hình dạng của plugin (`status`, `checkedAt`, `repositoryIdentity`,
`smokeTest`), nhưng `smokeTest` phải chính xác bằng `null`: skill không có smoke test cài
đặt, và việc xét duyệt nội dung chính là cổng tiếp nhận. Schema skill không mang điều kiện
`status: verified` → `smokeTest` và không mang các điều kiện `repositoryScope` →
`popularity`; những ràng buộc đó chỉ là quy tắc của schema plugin.

### Tầng ngữ nghĩa cho skill

Bên trên schema, việc xác thực catalog áp dụng cùng các bộ phân tích ngữ nghĩa bắt buộc như
với plugin ở những trường tồn tại: `license.spdx` phải phân tích được thành một biểu thức
SPDX hợp lệ (`invalid-spdx`), và `compat.harnessMin` phải là một SemVer chính xác
(`invalid-semver`). Không có trường hợp `invalid-sri` — skill không có `package.integrity`.

### Danh tính skill và khử trùng lặp

Khóa chính tắc của một skill là `skill:<source.repositoryNodeId>:<normalized subpath>`.
Subpath chỉ được chuẩn hóa cho mục đích danh tính: dấu gạch chéo ngược trở thành `/`, các
phân đoạn rỗng và `.` bị loại bỏ, và kết quả rỗng (hoặc `subpath: null`) trở thành `.` —
toàn bộ repository. Subpath chứa byte NUL hoặc phân đoạn `..` sẽ bị từ chối, không bao giờ
được "làm sạch". Hai skill của cùng một repository là hai mục nhập; cùng repository +
subpath xuất hiện hai lần là một va chạm.

### Ví dụ skill tối thiểu

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

## Những gì schema không kiểm tra

Schema được thiết kế cố ý mang tính cục bộ và cấu trúc. Nó **không** xác minh repository có tồn tại hay không, ID
node có khớp với URL hay không, các đường dẫn bằng chứng có tồn tại tại commit đã ghim hay không, số sao có chính xác
hay không, hay nhà phát triển có thực sự sở hữu nguồn hay không. Những kiểm tra đó thuộc về các cổng kiểm soát xét
duyệt của người bảo trì được mô tả tại [CONTRIBUTING.md](../../CONTRIBUTING.md) và
[docs/GOVERNANCE.md](GOVERNANCE.md).

<!-- i18n-source-hash: dd689b0ee2a7910f069d498c831668b022852a8a20cc64efb3516ce6e289c4dd -->
