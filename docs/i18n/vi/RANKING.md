# Phương pháp xếp hạng

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **Tiếng Việt**

Các bảng xếp hạng là góc nhìn minh bạch trên các mục danh mục công khai đã hợp nhất. Chúng không bao giờ dùng một
điểm số tổng hợp ẩn và không bao giờ coi số sao từ một dự án gốc rộng hơn là độ phổ biến của plugin.

## Tiêu chí Top Plugins theo số sao

Một mục chỉ đủ điều kiện khi mọi điều kiện dưới đây đều đúng:

```text
kind == plugin (bộ phân biệt gói DSH gốc chính tắc)
repositoryScope == dedicated
verification.status thuộc [eligible, verified]
repository đang hoạt động và chưa bị lưu trữ (archived)
số sao thuộc về đúng repository của plugin
mục đã được hợp nhất vào danh mục công khai
```

Các mục đủ điều kiện dùng `popularity.starsPolicy: exact-repository` và một số nguyên không âm trong
`popularity.stars`. Trường hợp hòa dùng ID plugin không phân biệt hoa/thường làm thứ tự hiển thị xác định; việc phá
hòa này không hàm ý sự khác biệt về chất lượng.

`kind` là bộ phân biệt duy nhất cho loại sản phẩm. Schema cố tình không lưu một trường loại tích hợp DSH thứ hai có
thể mâu thuẫn với nó.

## Các loại trừ rõ ràng

Một plugin nằm trong một monorepo lớn hơn vẫn đủ điều kiện vào danh mục, nhưng số sao của dự án gốc không được xác
định cho việc xếp hạng plugin. Nó phải dùng `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository` và `popularity.stars: null`. Nó xuất hiện trong các mục theo
chức năng và bị loại khỏi mọi bảng xếp hạng theo sao.

Các họ plugin, theme, skin, skill, preset, client, interface, bridge và các dự án hệ sinh thái rộng hơn không xuất
hiện trong Top Plugins by Stars. Chúng có các mục riêng nơi có dữ liệu có thể so sánh được. Các công cụ tổng hợp,
marketplace, danh mục trình cài đặt và danh sách không phải là mục danh mục và không có mục riêng nào trong danh
mục.

## Các góc nhìn xếp hạng

Dự án có thể phát hành các góc nhìn riêng biệt cho số sao, tăng trưởng trong 24 giờ, tăng trưởng trong 7 ngày, cập
nhật gần đây, bản cài đặt đã xác minh, họ plugin, theme và skin, client và interface, và các tích hợp hệ sinh thái.
Mỗi góc nhìn phải công khai chính quy tắc bao gồm của nó và thời điểm chụp nhanh (snapshot).

Ở số không mục đủ điều kiện, Top Plugins sẽ không được hiển thị. Lần hợp nhất đủ điều kiện đầu tiên tạo ra một góc
nhìn Top Plugins; nhãn chỉ đổi thành Top 10 sau khi có đủ mười mục đủ điều kiện. Không được phép có bảng xếp hạng
giả lập hay bịa đặt.

## Xác minh không phải là chứng thực

`eligible` nghĩa là cấu trúc công khai và tích hợp DSH đã được xác thực. `verified` thêm vào đó nghĩa là một bài
kiểm tra cài đặt (smoke test) đã thành công cho nguồn hoặc gói đã ghim. Không trạng thái nào là sự chứng thực, bảo
đảm hay chứng nhận bảo mật tuyệt đối.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
