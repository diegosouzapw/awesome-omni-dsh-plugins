# Quản trị danh mục

> 🌐 [English](../../GOVERNANCE.md) · [Português (Brasil)](../pt-BR/GOVERNANCE.md) · [中文（简体）](../zh-CN/GOVERNANCE.md) · **Tiếng Việt**

> **Đây là dự án cộng đồng không chính thức. Không liên kết, không được chứng thực, và không được DeepSeek tài trợ.**
> Tên gọi và nhãn hiệu của DeepSeek thuộc về chủ sở hữu tương ứng.

Danh mục công khai được quản trị như thế nào: ai quyết định điều gì được đưa vào, thứ tự nào được tôn trọng khi có
các đóng góp cạnh tranh nhau, những kiểm tra nào chạy tự động, và những phán đoán nào vẫn cần con người thực hiện.
Các chính sách được tham chiếu ở đây nằm trong [CONTRIBUTING.md](../../CONTRIBUTING.md),
[docs/CREDIT.md](CREDIT.md) và [docs/RANKING.md](RANKING.md); trang này mô tả cách chúng phối hợp với nhau.

## Nguyên tắc

1. **Ưu tiên nhà phát triển.** Danh mục tồn tại để giúp công sức của nhà phát triển được khám phá, không bao giờ để
   chiếm lấy quyền sở hữu công sức đó. Đối với cùng một plugin chính tắc, một pull request trực tiếp từ nhà phát
   triển sẽ luôn thay thế bất kỳ pull request biên tập cộng đồng hay tự động hóa nào đang mở — thứ tự ưu tiên đầy đủ
   và các quy tắc danh tính Git nằm tại [docs/CREDIT.md](CREDIT.md).
2. **Một plugin, một pull request được xét duyệt.** Không hợp nhất theo lô, không nhập hàng loạt được sinh tự động
   vào danh mục công khai. Mỗi mục phải tự giành được sự xét duyệt của riêng nó.
3. **Bằng chứng thay vì niềm tin.** Mọi trường công khai đều truy nguyên về repository gốc của nhà phát triển tại
   một commit đã ghim. Một kiểm tra tự động thành công không bao giờ được chấp nhận như bằng chứng về nguồn gốc.
4. **Luôn không chính thức.** Không trạng thái nào của danh mục được trình bày như sự xét duyệt, chứng nhận hay
   chứng thực từ DeepSeek.

## Các thay đổi được đưa vào `main` như thế nào

Mọi thay đổi đều tới `main` thông qua các pull request được xét duyệt — không có việc push trực tiếp. Chính sách
làm việc cho nhánh mặc định:

- **Chỉ qua pull request.** Các mục danh mục, tài liệu và thay đổi schema đều đi vào qua một PR; các PR danh mục
  phải tuân theo quy tắc một-plugin-mỗi-nhánh trong [CONTRIBUTING.md](../../CONTRIBUTING.md).
- **Lịch sử tuyến tính.** Các PR được tích hợp sao cho `main` giữ được lịch sử tuyến tính, có thể kiểm toán; lịch
  sử công khai đã hợp nhất không bị viết lại. Nếu một mục biên tập đã được hợp nhất trước khi nhà phát triển xuất
  hiện, nhà phát triển sẽ nhận quyền sở hữu hoặc đính chính mục đó trong một đóng góp tiếp theo thay vì viết lại
  lịch sử.
- **Giải quyết luồng xét duyệt.** Các cuộc trao đổi trong xét duyệt được giải quyết trước khi hợp nhất; phản hồi
  chưa được giải quyết sẽ chặn việc tích hợp.
- **Hợp nhất bởi người bảo trì.** Chỉ người bảo trì mới hợp nhất một mục plugin, và chỉ sau khi mọi cổng kiểm soát
  trong [CONTRIBUTING.md](../../CONTRIBUTING.md) → "Cổng xét duyệt, xung đột và hợp nhất" đã vượt qua trên commit
  hiện tại của PR.

## Kiểm tra `catalog-validation`

Mọi pull request chạm vào `catalog/plugins/`, `schemas/` hay chính workflow này đều chạy job `catalog-validation`
(`.github/workflows/validate-catalog.yml`), được ghim vào CLI đã phát hành:

```bash
npx --yes omni-dsh-plugins catalog validate --catalog .
```

**Những gì nó xác thực** — chỉ cấu trúc và ngữ nghĩa cục bộ:

- Phân tích YAML an toàn cho mọi mục dưới `catalog/plugins/`.
- Tuân thủ schema công khai (xem [docs/SCHEMA.md](SCHEMA.md)).
- Phân tích biểu thức SPDX, phiên bản SemVer chính xác, giá trị integrity SHA-512 SRI hợp lệ.
- Từ chối trùng lặp: không có ID mục lặp lại và không có khóa node-repository-cộng-subpath chính tắc lặp lại.
- Danh mục không có mục nào (zero-entry) một cách cố ý vẫn được xác thực thành công
  (`0 entries valid; catalog is empty`).

**Những gì nó KHÔNG xác thực** — và do đó những gì một kiểm tra thành công không bao giờ chứng minh:

- Danh tính repository từ xa: nó không kết nối tới GitHub hay xác định ID node repository khớp với URL.
- Bằng chứng tại commit đã ghim: mô tả, giấy phép, tích hợp DSH và bằng chứng smoke test không được tải về hay
  kiểm tra.
- Quyền sở hữu của nhà phát triển, số sao, hay xung đột với các pull request đang mở.

Những phán đoán đó thuộc về các cổng kiểm soát nguồn gốc riêng biệt của người bảo trì, được áp dụng trước khi hợp
nhất và mô tả tại [CONTRIBUTING.md](../../CONTRIBUTING.md). Kiểm tra cục bộ là mức sàn, không phải mức chuẩn.

## Các trạng thái xác minh

Việc xác minh được ghi lại cho từng mục dựa trên đúng commit đã ghim của mục đó, dùng các trạng thái được định nghĩa
trong schema công khai (`eligible`, `verified`, `stale`, `unavailable`, `archived`, `quarantined`). Hai trạng thái
tích cực được thiết kế cố ý hẹp:

- `eligible` — cấu trúc công khai và tích hợp DSH gốc đã được xác thực.
- `verified` — thêm vào đó, một bài kiểm tra cài đặt (smoke test) đã thành công cho nguồn hoặc gói đã ghim; schema
  yêu cầu bản ghi smoke test phải hiện diện.

Không trạng thái nào — kể cả các trạng thái khác — là sự chứng thực, bảo đảm hay chứng nhận bảo mật. Ngữ nghĩa đầy
đủ, bao gồm cách các trạng thái tương tác với xếp hạng, nằm tại [docs/RANKING.md](RANKING.md); hình dạng bản ghi
nằm tại [docs/SCHEMA.md](SCHEMA.md).

## Nhận quyền sở hữu, đính chính và gỡ bỏ

Các biểu mẫu issue GitHub có cấu trúc (`.github/ISSUE_TEMPLATE/`) là con đường được quản trị để thay đổi một mục mà
bạn không phải người gửi:

| Biểu mẫu           | Ai sử dụng                              | Kết quả                                             |
| -------------- | ---------------------------------------- | --------------------------------------------------- |
| **Nhận quyền sở hữu**      | Một nhà phát triển có plugin bị người khác biên tập đưa vào | Quyền sở hữu được gắn với nguồn gốc; nhà phát triển sau đó có thể đóng góp trực tiếp |
| **Đính chính** | Bất kỳ ai phát hiện siêu dữ liệu công khai không chính xác | Một bản sửa đã được xét duyệt cho mục bị ảnh hưởng             |
| **Gỡ bỏ**    | Một nhà phát triển muốn gỡ bỏ mục niêm yết của họ, hoặc người báo cáo vi phạm chính sách | Gỡ bỏ hoặc cách ly mục đã được xét duyệt |

Các quy tắc áp dụng cho cả ba luồng:

- Yêu cầu nhận quyền sở hữu phải được hỗ trợ bởi bằng chứng công khai có thể xác minh (quyền sở hữu repository,
  quyền tác giả gói, siêu dữ liệu manifest hay lịch sử nguồn đã ghim) — chỉ bình luận trên một Discussion không
  thiết lập tư cách nhà phát triển ([docs/CREDIT.md](CREDIT.md)).
- Các vấn đề bảo mật trong một plugin được niêm yết trước tiên phải đến với người bảo trì của chính plugin đó; phía
  danh mục sau đó xử lý việc đính chính hoặc cách ly mà không công bố chi tiết khai thác
  ([SECURITY.md](../../SECURITY.md)).
- Không bao giờ đưa thông tin xác thực, thông tin liên hệ cá nhân hay bất kỳ bí mật nào khác vào một biểu mẫu.

## Vai trò

- **Nhà phát triển** sở hữu plugin và quyền ưu tiên của mục niêm yết của họ. Họ có thể đóng góp trực tiếp, phê
  duyệt việc biên tập của cộng đồng, hoặc nhận quyền sở hữu/đính chính/gỡ bỏ một mục đã có.
- **Người đóng góp cộng đồng** có thể biên tập các mục cho những nhà phát triển chưa đóng góp, theo các quy tắc về
  liên hệ tôn trọng và ghi công trong [docs/CREDIT.md](CREDIT.md). Việc biên tập không bao giờ vượt quyền ưu tiên
  một đóng góp trực tiếp sau này của nhà phát triển.
- **Người bảo trì** xét duyệt, áp dụng các cổng kiểm soát nguồn gốc, giải quyết xung đột và hợp nhất. Họ cũng duy
  trì website ([dsh-plugins.omniroute.online](https://dsh-plugins.omniroute.online)) và CLI đã phát hành từ mã
  nguồn riêng tư; dữ liệu công khai, schema và chính sách của repository này chính là những gì hai bề mặt đó sử
  dụng.

<!-- i18n-source-hash: d43a6ba221ce5d31c551bad845038f0e6453100435f2358c4d69b97ba9dede2a -->
