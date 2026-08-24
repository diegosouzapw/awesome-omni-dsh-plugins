# Danh mục phân loại

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **Tiếng Việt**

Mỗi mục trong danh mục có một loại sản phẩm, một danh mục năng lực chính và không hoặc nhiều thẻ. Danh mục chính
quyết định nơi mục đó xuất hiện; các thẻ hỗ trợ tìm kiếm xuyên danh mục mà không cần nhân bản mục đó.

## Các loại sản phẩm

<!-- catalog-policy:aggregators-never-entries -->

| Giá trị | Ý nghĩa | Có được xếp hạng theo sao như một plugin không |
|---|---|---:|
| `plugin` | Gói DSH gốc có thể cài đặt | Chỉ khi mọi điều kiện xếp hạng đều thỏa mãn |
| `plugin-family` | Repository chứa nhiều plugin DSH | Không; có mục riêng |
| `skin-theme` | Skin giao diện hoặc theme trực quan của DSH | Không; có mục riêng |
| `skill` | Kỹ năng (skill) của agent có hỗ trợ DSH | Không |
| `preset-profile` | Profile hoặc preset của DSH | Không |
| `client-interface` | Client desktop, TUI, editor hoặc từ xa | Không |
| `bridge-adapter` | Tích hợp từ một sản phẩm khác vào DSH | Không |
| `ecosystem-project` | Dự án rộng hơn có chứa một tích hợp DSH | Không |

Một repository bao trùm, công cụ tổng hợp, marketplace, danh mục trình cài đặt hay danh sách không bao giờ là một
mục danh mục, kể cả khi bản thân công cụ tổng hợp đó có thể cài đặt được. Nó chỉ có thể được dùng như một manh mối.
Hãy đi theo mỗi manh mối tới một sản phẩm con có thể cài đặt độc lập và xác định nhà phát triển thực sự, repository
gốc, gói và subpath nguồn của sản phẩm đó trước khi gửi nó. Một monorepo thật sự của nhà phát triển có thể là
repository gốc cho một plugin con, nhưng plugin con đó phải dùng đúng subpath đó và chính sách sao của monorepo.

Trường `kind` là bộ phân biệt sản phẩm DSH chính tắc. Không có trường loại tích hợp riêng biệt: `plugin` đã có nghĩa
là một gói DSH gốc, còn `ecosystem-project` đã có nghĩa là một dự án rộng hơn có tích hợp DSH. Điều này ngăn ngừa
các cặp phân loại mâu thuẫn nhau.

## Các danh mục năng lực chính

| Giá trị | Nhãn hiển thị |
|---|---|
| `user-interface-dashboards` | Giao diện người dùng và bảng điều khiển |
| `memory-rag` | Bộ nhớ và RAG |
| `search-research` | Tìm kiếm và nghiên cứu |
| `coding-developer-tools` | Lập trình và công cụ dành cho nhà phát triển |
| `browser-automation` | Trình duyệt và tự động hóa |
| `vision-audio-multimodal` | Thị giác, âm thanh và đa phương thức |
| `sessions-productivity` | Phiên làm việc và năng suất |
| `security-permissions-approvals` | Bảo mật, quyền hạn và phê duyệt |
| `diagnostics-observability` | Chẩn đoán và khả năng quan sát |
| `models-providers-routing` | Mô hình, nhà cung cấp và định tuyến |
| `messaging-notifications` | Nhắn tin và thông báo |
| `data-external-services` | Dữ liệu và dịch vụ bên ngoài |
| `entertainment-customization` | Giải trí và tùy biến |

Hãy chọn danh mục đại diện tốt nhất cho công việc chính của plugin, không phải danh mục có khả năng tăng lượt xem
nhiều nhất.

## Thẻ giao diện

Các thẻ giao diện tiêu chuẩn bao gồm `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`, `mobile`, `remote`,
`editor`, `headless` và `theme`. Các thẻ năng lực lowercase kebab-case bổ sung khác được cho phép khi chúng mô tả
bằng chứng có thể quan sát được trong nguồn gốc đã ghim.

## Phạm vi repository

Chỉ dùng `dedicated` khi số sao repository thuộc về đúng plugin được đưa vào danh mục. Dùng `monorepo` khi plugin là
một subpath hoặc gói bên trong một dự án lớn hơn. Một mục trong monorepo phải dùng
`popularity.starsPolicy: undefined-parent-repository` và `popularity.stars: null`.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
