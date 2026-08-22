# Ghi công nhà phát triển và thứ tự ưu tiên pull request

Danh mục tồn tại để giúp công việc DSH độc lập được khám phá mà không tước đi quyền sở hữu của nhà phát triển đối
với công sức đó. Các mục công khai trích dẫn repository gốc và một commit nguồn bất biến.

## Thứ tự ưu tiên cho cùng một plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Pull request do chính nhà phát triển plugin hoặc tổ chức sở hữu mở ra.
2. Pull request cộng đồng được nhà phát triển phê duyệt rõ ràng hoặc đồng tác giả.
3. Pull request cộng đồng hợp lệ đã tồn tại.
4. Pull request tự động hóa danh mục.
5. Một ứng viên riêng tư không có pull request công khai.

Một pull request trực tiếp từ nhà phát triển luôn được ưu tiên và thay thế bất kỳ pull request biên tập cộng đồng
hay tự động hóa nào đang mở cho cùng một plugin chính tắc, bất kể cái nào mở trước hay đang tiến xa hơn. Pull
request của nhà phát triển trở thành phương tiện xét duyệt; nhánh của họ không bao giờ bị ghi đè, force-push hay
chuyển sang pull request biên tập. Nếu một mục biên tập đã được hợp nhất, lịch sử vẫn được giữ nguyên và nhà phát
triển có thể nhận quyền sở hữu hoặc đính chính nó trong một đóng góp mới.

## Ghi công công khai

Mỗi mục danh mục mang theo tên đăng nhập GitHub công khai của nhà phát triển, repository gốc, ID node repository,
subpath plugin và commit đầy đủ đã ghim. Hồ sơ nhà phát triển công khai được suy ra từ tên đăng nhập duy nhất thay
vì được lưu như một danh tính thứ hai. Cổng kiểm soát nguồn gốc riêng biệt của người bảo trì sẽ xác định ID node và
từ chối trường hợp URL repository không khớp. Phần mô tả của pull request nên ghi `Created by @handle` và bao gồm
siêu dữ liệu repository nguồn cùng commit nguồn.

Một người đăng bài hoặc bình luận trên một Discussion không tự động được coi là nhà phát triển. Quyền sở hữu phải
được hỗ trợ bởi chủ sở hữu repository hoặc tổ chức, quyền tác giả gói, siêu dữ liệu manifest hoặc lịch sử nguồn đã
ghim chính xác.

## Danh tính Git

<!-- creator-first:source-bound-git-identity -->

Quyền tác giả commit và quyền tác giả pull request là hai điều tách biệt. Một pull request bắt nguồn từ nhà phát
triển giữ nhà phát triển làm tác giả pull request, và các commit của họ giữ nguyên quyền tác giả một cách tự nhiên.
Một tài khoản người bảo trì hoặc tự động hóa có thể xuất hiện như committer hoặc đồng tác giả đã xác minh, nhưng
không được thay thế quyền tác giả của nhà phát triển.

Đối với một commit biên tập, chỉ dùng nhà phát triển làm tác giả Git hoặc thêm dòng `Co-authored-by` khi danh tính
chính xác đó gắn với nguồn và có thể xác minh công khai, chẳng hạn một danh tính đã gắn với commit của nhà phát
triển trong repository gốc. Không bao giờ đoán một địa chỉ email, tự tạo ra một địa chỉ noreply, hay dùng một địa
chỉ riêng tư tìm thấy ngoài một nguồn công khai được cho phép.

Khi không có danh tính Git đã xác minh nào, người biên tập hoặc tài khoản tự động hóa đứng tên commit và ghi công
rõ ràng thay vào đó: `Created by @handle`, hồ sơ công khai tương ứng và một liên kết tới repository gốc trong mục và
pull request. Ghi công YAML hiển thị luôn bắt buộc, độc lập với việc ánh xạ danh tính Git. Một pull request trực
tiếp sau này từ nhà phát triển sẽ thay thế một pull request biên tập đang mở thay vì kế thừa lịch sử tổng hợp của nó.

## Nhắc tên nhà phát triển một cách tôn trọng

Một pull request biên tập dùng đúng một lần nhắc tên công khai tôn trọng `@creator` trong phần mô tả của nó, cạnh
liên kết repository gốc. Nó có thể mời xét duyệt hoặc một pull request trực tiếp thay thế. Không lặp lại việc nhắc
tên, không mở issue quảng cáo, không đăng chéo hay gửi tin nhắn riêng không được mời.

## Giấy phép danh mục so với giấy phép gốc

Các sự kiện của danh mục và siêu dữ liệu YAML mang tính biên tập được cống hiến theo CC0-1.0. Việc cống hiến đó
không thay đổi giấy phép của plugin gốc. Mã nguồn, tài liệu, ảnh chụp màn hình, logo và các tài liệu sáng tạo khác ở
nguồn gốc vẫn tuân theo giấy phép và chủ sở hữu ban đầu của chúng.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
