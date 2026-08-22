# Tài liệu tham khảo CLI — `omni-dsh-plugins@1.0.1`

> 🌐 [English](../../CLI.md) · [Português (Brasil)](../pt-BR/CLI.md) · [中文（简体）](../zh-CN/CLI.md) · **Tiếng Việt**

> **Đây là dự án cộng đồng không chính thức. Không liên kết, không được chứng thực, và không được DeepSeek tài trợ.**
> Tên gọi và nhãn hiệu của DeepSeek thuộc về chủ sở hữu tương ứng.

Trang này ghi lại chính xác hành vi của CLI đã phát hành ở phiên bản `1.0.1`. Mọi cú pháp lệnh và cờ dưới đây đều
lấy từ chính đầu ra `--help` của lệnh đã phát hành; không có gì ở đây mô tả hành vi chưa phát hành. CLI được phát
triển trong repository này dưới [`cli/`](../../cli), và được phát hành lên npm với tên
[`omni-dsh-plugins`](https://www.npmjs.com/package/omni-dsh-plugins), kèm theo một bản đính kèm chứng nhận nguồn
gốc (provenance attestation) gắn mỗi bản build với commit và lần chạy workflow đã tạo ra nó.

```bash
npx omni-dsh-plugins --help
```

## Nguyên tắc thiết kế trong v1.0.1

- **Mặc định chỉ đọc.** `catalog`, `search`, `info`, `list` và `doctor` không bao giờ chỉnh sửa hồ sơ, ghi file hay
  chạy mã của plugin.
- **Cổng đồng ý cho việc thực thi mã.** `add`, `update` và `remove` từ chối chạy mã vòng đời DSH/pnpm trừ khi bạn
  truyền `--allow-code-execution`. Nếu không truyền, hãy dùng `--dry-run` để xem kế hoạch đã xác thực.
- **Chính sách Windows gốc.** Việc chạy `add`/`update`/`remove` trên Windows gốc kèm thực thi mã bị vô hiệu hóa
  trong v1.0.1; hãy dùng WSL. Chế độ chạy thử (dry-run) và các lệnh chỉ đọc vẫn khả dụng, và các dấu hiệu khôi phục
  trên Windows gốc yêu cầu khôi phục thủ công theo tài liệu.
- **Đầu vào đã ghim.** Đầu vào danh mục có thể là một thư mục cục bộ, một file snapshot, hoặc một URL snapshot công
  khai đã ghim, tùy chọn khóa vào một bản sửa đổi (revision) chính xác 40 ký tự.

## Các tùy chọn chung

Các tùy chọn sau xuất hiện trên các lệnh tiêu thụ danh mục (`catalog validate`, `search`, `info`, `add`, `update`,
`remove`, `doctor`):

| Tùy chọn                    | Ý nghĩa                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `--catalog <path-or-url>` | Thư mục danh mục cục bộ, file snapshot, hoặc URL snapshot công khai đã ghim |
| `--revision <sha>`        | Bản sửa đổi snapshot chính xác 40 ký tự                               |
| `--json`                  | Xuất kết quả JSON ổn định                                              |

Tùy chọn toàn cục: `-V, --version` in ra phiên bản CLI; `-h, --help` in ra trợ giúp cho bất kỳ lệnh nào
(`dsh-plugins help [command]` cũng hoạt động).

## Mã thoát

CLI dùng các mã thoát tiến trình theo quy ước thông thường:

| Mã thoát | Ý nghĩa                                                                    |
| --------: | -------------------------------------------------------------------------- |
| `0`       | Thành công (bao gồm cả các kết quả "rỗng nhưng hợp lệ" như một danh mục rỗng)     |
| `1`       | Thất bại: lỗi xác thực, không tìm thấy mục, thiếu tùy chọn bắt buộc, hoặc một kiểm tra chẩn đoán báo cáo lỗi |

Ví dụ quan sát được với v1.0.1: `catalog validate` trên một danh mục rỗng hợp lệ thoát với mã `0` kèm thông báo
`0 entries valid; catalog is empty`; `info <unknown-id>` thoát với mã `1` kèm `Plugin not found`; `doctor` thoát
với mã `1` khi bất kỳ kiểm tra nào (chẳng hạn thiếu file thực thi `dsh`) báo cáo lỗi.

## Các lệnh

### `catalog` — xác thực các bề mặt công khai của danh mục

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — xác thực YAML và ngữ nghĩa của danh mục: phân tích YAML an toàn, schema công khai, phân
  tích biểu thức SPDX, SemVer chính xác, SHA-512 SRI, và từ chối ID trùng lặp / khóa node-repository-cộng-subpath
  trùng lặp. Đây là kiểm tra cục bộ, chỉ đọc: nó không kết nối tới GitHub, không xác định danh tính repository hay
  kiểm tra bằng chứng tại commit đã ghim. Đây chính xác là lệnh mà job CI `catalog-validation` chạy trên mỗi pull
  request danh mục.
- **`catalog docs-check [root]`** — kiểm tra rằng tài liệu danh mục công khai bắt buộc đã tồn tại và các khối
  Markdown được cân bằng.
- **`catalog github-forms-check [root]`** — kiểm tra các biểu mẫu issue GitHub công khai có cấu trúc (nhận quyền
  sở hữu, đính chính, gỡ bỏ).

```bash
# Từ thư mục gốc của repository:
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

### `search` — tìm kiếm các trường công khai của danh mục ngay tại máy

```text
dsh-plugins search [options] <query...>
```

Tìm kiếm các trường công khai của danh mục cục bộ dựa trên đầu vào danh mục đã chọn. In ra các mục khớp, hoặc
`No plugins found.` (mã thoát `0`) khi không có gì khớp.

```bash
npx omni-dsh-plugins search memory --catalog .
npx omni-dsh-plugins search notes markdown --catalog . --json
```

### `discover` — tìm plugin ngoài phạm vi danh mục

```text
dsh-plugins discover [options] <query...>
```

> `discover` xuất hiện từ `1.0.0`, bản phát hành đầu tiên dưới tên gói này.

Tìm trong danh mục đã biên tập trước, sau đó — trừ khi truyền `--offline` — tìm tiếp trong chủ đề `dsh-plugin` trực
tiếp trên GitHub, để một plugin chưa được gửi vào danh mục vẫn có thể được tìm thấy. Kết quả từ danh mục mang theo
bằng chứng mà danh mục đang lưu giữ (commit đã ghim, nhà phát triển, giấy phép); kết quả từ cộng đồng không mang
theo bất kỳ bằng chứng nào trong số đó và được gắn nhãn tương ứng, vì chưa có gì về chúng được xét duyệt.

`--limit <n>` giới hạn số kết quả mỗi tầng (mặc định `8`). `--json` xuất ra hình dạng máy ổn định, không bao giờ
được bản địa hóa.

```bash
npx omni-dsh-plugins discover memory --catalog .
npx omni-dsh-plugins discover vision --offline --catalog . --json
```

### `info` — hiển thị một mục danh mục công khai

```text
dsh-plugins info [options] <id>
```

Hiển thị một mục danh mục công khai theo ID plugin chính tắc. Thoát với mã `1` kèm `Plugin not found: <id>` khi ID
không có trong danh mục.

```bash
npx omni-dsh-plugins info example-notes-search --catalog .
```

### `add` — thêm một plugin danh mục thông qua cơ chế ủy quyền chính thức của DSH

```text
dsh-plugins add [options] <id>
```

| Tùy chọn                   | Ý nghĩa                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `--profile <name>`       | Profile DSH cần thay đổi (trên thực tế là bắt buộc; lệnh sẽ báo lỗi nếu thiếu) |
| `--dry-run`              | Hiển thị kế hoạch đã xác thực mà không tạo file hay tiến trình con               |
| `--allow-code-execution` | Đồng ý cho mã vòng đời DSH/pnpm (bị vô hiệu hóa trên Windows gốc; hãy dùng WSL) |
| `--catalog` / `--revision` / `--json` | Các tùy chọn chung ở trên                                  |

Ngữ nghĩa của chạy thử (dry-run) trong phiên bản này: lệnh xác định và xác thực kế hoạch cho mục đã ghim rồi in nó
ra, không tạo file nào và không chạy tiến trình con nào. Việc cài đặt thực sự ủy quyền cho công cụ DSH chính thức và
chỉ được tiến hành khi có `--allow-code-execution`.

```bash
# Chỉ xem trước — không có gì được ghi ra, không có gì được thực thi:
npx omni-dsh-plugins add example-notes-search --profile default --dry-run

# Cài đặt thực sự — đồng ý rõ ràng với mã vòng đời:
npx omni-dsh-plugins add example-notes-search --profile default --allow-code-execution
```

### `update` — cập nhật một plugin danh mục thông qua cơ chế ủy quyền chính thức của DSH

```text
dsh-plugins update [options] <id>
```

Cùng các tùy chọn và ngữ nghĩa đồng ý như `add`: `--profile <name>`, `--dry-run`, `--allow-code-execution`, cùng
với các tùy chọn chung của danh mục.

### `remove` — gỡ bỏ một plugin do danh mục quản lý thông qua cơ chế ủy quyền chính thức của DSH

```text
dsh-plugins remove [options] <id>
```

Cùng các tùy chọn và ngữ nghĩa đồng ý như `add`. Chỉ những bản cài đặt do danh mục quản lý mới bị gỡ bỏ.

### `recover` — khôi phục một thay đổi POSIX đang chờ

```text
dsh-plugins recover
```

Khôi phục một thay đổi POSIX đang chờ sau khi `add`/`update`/`remove` bị gián đoạn. Khi không có gì đang chờ, lệnh
in ra `No mutation recovery is pending.` và thoát với mã `0`. Việc khôi phục trên Windows gốc vẫn cần thao tác thủ
công, theo chính sách đã ghi trong tài liệu.

### `list` — liệt kê các bản cài đặt do danh mục quản lý

```text
dsh-plugins list [--profile <name>] [--json]
```

Liệt kê các bản cài đặt do danh mục quản lý mà không chỉnh sửa hồ sơ. `--profile <name>` lọc theo profile DSH. Khi
không có bản cài đặt nào, lệnh in ra `No catalog-managed plugins installed.` và thoát với mã `0`.

### `doctor` — chẩn đoán chỉ đọc

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Chạy các kiểm tra chẩn đoán chỉ đọc về Node, DSH, chính sách Windows gốc và danh mục. Mỗi kiểm tra báo cáo `ok` hoặc
`error`; bất kỳ `error` nào cũng khiến mã thoát tổng thể là `1`. Ví dụ đầu ra trên một máy không có file thực thi
`dsh`:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## Những gì việc xác thực cục bộ không chứng minh

Một lần chạy `catalog validate` thành công chỉ xác nhận cấu trúc và ngữ nghĩa cục bộ. Nó không chứng minh danh tính
repository từ xa, quyền sở hữu của nhà phát triển, hay bằng chứng tại commit đã ghim — người bảo trì sẽ áp dụng các
cổng kiểm soát nguồn gốc riêng biệt đó trước khi hợp nhất, như mô tả tại [CONTRIBUTING.md](../../CONTRIBUTING.md)
và [docs/GOVERNANCE.md](GOVERNANCE.md).

<!-- i18n-source-hash: df7d45f7db05885b95d155865cb2b37c65c150743bb071809b1d2d7f5335105c -->
