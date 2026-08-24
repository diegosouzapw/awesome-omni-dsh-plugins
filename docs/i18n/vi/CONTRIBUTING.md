# Đóng góp

> 🌐 [English](../../../CONTRIBUTING.md) · [Português (Brasil)](../pt-BR/CONTRIBUTING.md) · [中文（简体）](../zh-CN/CONTRIBUTING.md) · **Tiếng Việt**

> **Đây là dự án cộng đồng không chính thức. Không liên kết, không được chứng thực, và không được DeepSeek tài trợ.**
> Tên gọi và nhãn hiệu của DeepSeek thuộc về chủ sở hữu tương ứng.

Cảm ơn bạn đã góp phần cải thiện danh mục. Mọi đóng góp đều ưu tiên nhà phát triển: sử dụng bằng chứng từ repository
gốc, giữ nguyên ghi công và đảm bảo mỗi plugin có thể được xét duyệt độc lập. Danh mục vốn được thiết kế để bắt đầu
trống rỗng; không có mục nào được chấp nhận nếu thiếu pull request được xét duyệt riêng của chính nó.

## Bắt đầu từ nhà phát triển

Một pull request do chính nhà phát triển plugin hoặc tổ chức sở hữu mở ra luôn được ưu tiên hơn. Nếu nhà phát triển
đã sẵn sàng đóng góp, hãy dùng nhánh và pull request của họ thay vì tái tạo lại công sức đó trong một nhánh biên tập
cộng đồng hay tự động hóa.

Việc biên tập của cộng đồng luôn được chào đón khi nó giúp ích cho một nhà phát triển chưa mở pull request. Nó không
thiết lập quyền sở hữu hay quyền ưu tiên trước một đóng góp trực tiếp sau này của nhà phát triển.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Mỗi nhánh và pull request chỉ dành cho một plugin

Tạo một nhánh riêng cho một plugin và mở một pull request từ nhánh đó. Nhánh và pull request chỉ được phép tạo hoặc
thay đổi đúng một file YAML dưới `catalog/plugins/`. Không trộn lẫn nhiều plugin, việc dọn dẹp tài liệu, các chỉ mục
được sinh tự động hay bất kỳ công việc bảo trì không liên quan nào vào nhánh hoặc pull request đó.

ID của mục và tên file phải là cùng một giá trị lowercase kebab-case. Người bảo trì xét duyệt và hợp nhất từng pull
request plugin một cách riêng lẻ; một lô chứa nhiều plugin sẽ không được tách ra hoặc hợp nhất một phần.

## Xác định nguồn gốc

Mọi trường công khai đều phải được tái dựng từ repository gốc của nhà phát triển, gói phần mềm, manifest, README,
giấy phép hoặc bản phát hành tại commit đã ghim. Không sao chép văn bản mô tả, cách phân loại, ảnh chụp màn hình, xếp
hạng, badge hay siêu dữ liệu được sinh tự động từ một danh mục hay công cụ tổng hợp khác. Một liên kết tìm thấy trong
một dự án bao trùm, marketplace, danh sách hay công cụ tổng hợp chỉ là một manh mối, không phải bằng chứng và không
phải nguồn của plugin.

Không bao giờ gửi một dự án bao trùm, công cụ tổng hợp, marketplace, danh mục trình cài đặt hay danh sách như một mục
danh mục, kể cả khi bản thân nó có thể cài đặt độc lập được. Chỉ dùng nó như một manh mối và xác định từng plugin con
có thể cài đặt độc lập về đúng nhà phát triển và repository gốc của nó. Một plugin nằm trong monorepo thật sự của nhà
phát triển có thể được gửi từ đúng subpath của nó, nhưng phải tuân theo chính sách về sao của monorepo bên dưới.

## Bằng chứng bắt buộc

Cung cấp đầy đủ những điều sau trong pull request:

- URL công khai chính thức của repository gốc và ID node repository bất biến của nó. Người bảo trì sẽ xác định ID
  node và từ chối nếu URL không khớp trong cổng kiểm soát nguồn gốc riêng biệt.
- Tên đăng nhập GitHub công khai của nhà phát triển và URL hồ sơ công khai tương ứng. YAML chỉ lưu tên đăng nhập một
  lần; URL hồ sơ được suy ra là `https://github.com/<handle>`.
- OID commit nguồn đầy đủ 40 ký tự và đúng subpath của plugin, hoặc `null` nếu plugin nằm ngay tại gốc repository.
- Một mô tả tiếng Anh có giới hạn và đường dẫn bằng chứng của nó tại commit đã ghim.
- Loại sản phẩm (`kind`), danh mục chính và các thẻ được chọn theo
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Toàn bộ biểu thức giấy phép SPDX gốc, có bằng chứng tại commit đã ghim.
- Một mô tả cài đặt chính thức được ghim vào đúng phiên bản npm, hoặc vào repository nguồn, commit đầy đủ và subpath.
  Mô tả này là dữ liệu, không bao giờ là một lệnh shell.
- Bằng chứng tích hợp DSH gốc và đường dẫn của nó tại commit đã ghim.
- Bằng chứng smoke test hiện có, không nhạy cảm cho đúng bản ghim đó, hoặc giá trị rõ ràng `not run`. Không cài đặt
  plugin hoặc thực thi `preinstall`, `install`, `postinstall`, `prepare` hay bất kỳ mã vòng đời gói/plugin nào khác
  chỉ để chuẩn bị cho một đóng góp vào danh mục.
- Đối với một repository riêng biệt, số sao có thể xác minh của đúng repository đó, cùng với nguồn công khai và thời
  điểm kiểm tra. Đối với một plugin trong monorepo, dùng chính sách null bắt buộc bên dưới.
- Bằng chứng nguồn gốc từ Discussion hoặc bình luận công khai nếu có; nếu không thì dùng `null`.
- Giá trị `unofficial: true` có thể đọc được bằng máy.

Nếu chưa có smoke test hợp lệ nào tồn tại, dùng `verification.status: eligible` và
`verification.smokeTest: null`. Chỉ dùng `verified` khi có bằng chứng smoke test có thể xét duyệt được cho đúng bản
ghim đó. Không trạng thái nào là sự chứng thực hay chứng nhận bảo mật.

Không bao giờ gửi thông tin xác thực, cookie, địa chỉ email cá nhân, mã nguồn chưa công bố hay bất kỳ bí mật nào khác.

## Quy tắc YAML và schema

Tạo file `catalog/plugins/<plugin-id>.yaml` và xác thực nó theo
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id` phải bằng đúng tên file (không có phần mở
rộng) và phải bắt đầu bằng namespace của bạn: tên đăng nhập `creator.github` viết thường (mọi chuỗi ký tự nằm ngoài
`[a-z0-9]` được gộp thành một dấu gạch ngang duy nhất) theo sau bởi dấu `-`, ví dụ `some-creator-my-plugin` cho tên
đăng nhập `Some-Creator`. Việc xác thực danh mục sẽ kiểm tra cả hai điều này. Schema là nguồn dữ liệu chân lý cho tên
trường và các giá trị được phép; [docs/CATEGORIES.md](../../docs/CATEGORIES.md) định nghĩa cách chọn duy nhất một
loại sản phẩm, danh mục chính, thẻ và phạm vi repository.

Một mô tả npm phải chứa tên gói hợp lệ và phiên bản chính xác. Schema công khai từ chối các giá trị giống tùy chọn
dòng lệnh và không giới hạn, nhưng không tự triển khai lại SemVer hay SRI: việc xác thực danh mục phải phân tích cú
pháp phiên bản, yêu cầu SemVer chính xác và phân tích mọi giá trị integrity như SHA-512 SRI hợp lệ. Một mô tả nguồn
được ràng buộc với `source.repository`, `source.commit` và `source.subpath` mà không lặp lại các giá trị nguồn có
thể thay đổi.

Trình cài đặt phải dùng mảng đối số, tắt việc thực thi shell và đặt dấu kết thúc tùy chọn trước các giá trị vị trí do
danh mục cung cấp ở nơi lệnh được gọi hỗ trợ điều đó. Việc xác thực khi gửi bài không được gọi trình cài đặt hay mã
vòng đời của plugin.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` là một kiểm tra cấu trúc và ngữ nghĩa cục bộ, chỉ đọc. Nó phân tích YAML an toàn, xác thực schema
công khai, phân tích biểu thức SPDX, yêu cầu SemVer chính xác và SHA-512 SRI hợp lệ, đồng thời từ chối ID trùng lặp
và các khóa node-repository-cộng-subpath chính tắc trùng lặp. Nó không kết nối tới GitHub, không xác định danh tính
repository hay kiểm tra các đường dẫn bằng chứng tại commit đã ghim.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Trước khi một mục đạt trạng thái `eligible`, người bảo trì sẽ tự xác định repository chính tắc và ID node, gắn kết
nhà phát triển với nguồn gốc, và kiểm tra mô tả, giấy phép, tích hợp DSH và bằng chứng smoke test đã khai báo tại
`source.commit`. Kết quả xác thực cục bộ thành công không phải là bằng chứng về nguồn gốc.

## Số sao repository

Chỉ những số sao có thể xác minh thuộc về đúng repository plugin riêng biệt mới được ghi lại. Số sao của một dự án
gốc không bao giờ được gán cho một plugin nằm trong monorepo lớn hơn. Một mục trong monorepo vẫn đủ điều kiện cho các
mục danh mục theo chức năng, nhưng phải khai báo:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

Một mục riêng biệt dùng `repositoryScope: dedicated`, `starsPolicy: exact-repository` và số sao không âm quan sát
được trên chính repository đó. Đọc [docs/RANKING.md](../../docs/RANKING.md) trước khi gửi dữ liệu độ phổ biến.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Ưu tiên nhà phát triển và liên hệ tôn trọng

Đối với cùng một plugin chính tắc, thứ tự ưu tiên là:

1. Pull request do chính nhà phát triển hoặc tổ chức sở hữu mở ra.
2. Pull request cộng đồng được nhà phát triển phê duyệt rõ ràng.
3. Pull request biên tập cộng đồng hợp lệ đã tồn tại.
4. Pull request tự động hóa danh mục.

Một pull request trực tiếp từ nhà phát triển sẽ luôn thay thế bất kỳ pull request biên tập cộng đồng hay tự động hóa
nào đang mở, bất kể cái nào được mở trước hay đang tiến xa hơn. Pull request của nhà phát triển trở thành phương tiện
xét duyệt; người bảo trì không force-push nhánh của nhà phát triển hay chuyển công sức của họ sang pull request biên
tập. Nếu một mục biên tập đã được hợp nhất, lịch sử công khai sẽ không bị viết lại. Nhà phát triển có thể dùng yêu
cầu nhận quyền sở hữu hoặc đính chính, sau đó đóng góp trực tiếp bằng một pull request tiếp theo.

Một pull request biên tập nên dùng đúng một lần nhắc tôn trọng công khai `@creator` trong phần mô tả của nó, cạnh một
liên kết tới repository gốc, mời nhà phát triển xét duyệt hoặc thay thế nó bằng một pull request trực tiếp. Không lặp
lại việc nhắc tên, không mở issue quảng cáo, không đăng chéo, không gửi tin nhắn riêng không mời mà đến hay quấy rối
nhà phát triển theo bất kỳ cách nào khác.

<!-- creator-first:source-bound-git-identity -->

Các pull request và commit do nhà phát triển thực hiện tự nhiên giữ nguyên ghi công của họ. Các commit biên tập chỉ
được dùng danh tính Git của nhà phát triển hoặc dòng `Co-authored-by` khi có một danh tính gắn với nguồn, có thể xác
minh công khai. Không bao giờ tự bịa ra hay đoán một địa chỉ email. Khi không có danh tính Git đã xác minh nào, người
biên tập đứng tên commit và ghi công rõ ràng `Created by @handle` cùng liên kết repository gốc trong YAML và pull
request. Một tài khoản người bảo trì hoặc tự động hóa có thể là committer hoặc đồng tác giả đã xác minh, nhưng không
được thay thế quyền tác giả của nhà phát triển. Xem [docs/CREDIT.md](../../docs/CREDIT.md) để biết chính sách đầy
đủ.

## Lệnh xác thực và tính khả dụng

CLI npm được phát hành với tên `omni-dsh-plugins@1.0.1`, vì vậy các lệnh dưới đây đều khả dụng qua `npx` ngay hôm
nay. Hãy dùng chúng đúng như được viết; người đóng góp không nên tự bịa ra lệnh thay thế.

Chạy các lệnh này từ thư mục gốc của repository:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` chỉ thực hiện các kiểm tra YAML, schema, SPDX, SemVer chính xác, SHA-512 SRI và trùng lặp cục bộ
đã mô tả ở trên, và chấp nhận danh mục không có mục nào một cách cố ý. Nó không chứng minh danh tính repository từ xa
hay bằng chứng nguồn đã ghim. Các lệnh khác kiểm tra tài liệu công khai bắt buộc và các biểu mẫu issue GitHub có cấu
trúc. Việc các lệnh này chạy thành công cục bộ không làm giảm nhẹ yêu cầu về bằng chứng; người bảo trì vẫn áp dụng
từng cổng phát hành tương ứng trước khi hợp nhất.

## Cổng xét duyệt, xung đột và hợp nhất

Người bảo trì áp dụng mọi cổng kiểm soát cho commit hiện tại của pull request trước khi hợp nhất:

1. **Phạm vi:** một nhánh riêng biệt, một file YAML plugin và không có thay đổi không liên quan.
2. **Danh tính gốc:** nhà phát triển, repository chính tắc, ID node, commit đầy đủ và subpath khớp với nhau.
3. **Schema và bằng chứng:** YAML, danh mục, SPDX, bản ghim cài đặt, bằng chứng DSH và trạng thái smoke test nhất
   quán nội bộ mà không cần thực thi mã vòng đời plugin.
4. **Độ phổ biến:** số sao riêng biệt có thể xác minh trên đúng repository, hoặc số sao monorepo là `null` với
   `undefined-parent-repository`.
5. **Tài liệu và biểu mẫu:** tài liệu công khai, các khối Markdown và biểu mẫu có cấu trúc vẫn hợp lệ.
6. **Xung đột và loại trùng lặp:** không có mục đã hợp nhất hay pull request đang mở nào đại diện cho cùng một plugin
   chính tắc.

Tên hay ID khác nhau không làm cho các plugin trùng lặp trở nên khác biệt. Hãy coi cùng một ID node repository và
subpath, cùng một gói chính tắc, hoặc một mục tiêu cài đặt khác được chứng minh là giống hệt như một xung đột. Giải
quyết các bí danh và các pull request cạnh tranh trước khi hợp nhất. Một pull request trực tiếp từ nhà phát triển sẽ
thắng trong một xung đột với biên tập hoặc tự động hóa; nếu không, người bảo trì chọn một phương tiện xét duyệt và
đóng hoặc chuyển hướng các bản trùng lặp thay vì hợp nhất cả hai.

Chỉ người bảo trì mới hợp nhất một plugin sau khi mọi cổng kiểm soát đã vượt qua. Mỗi plugin được chấp nhận được hợp
nhất một cách riêng lẻ; việc xác thực, biên tập hay tự động hóa không hàm ý việc hợp nhất tự động hay theo lô.

## Danh sách kiểm tra pull request

- [ ] Tôi đã dùng một nhánh riêng biệt và PR này chỉ thay đổi đúng một mục plugin.
- [ ] Nguồn là repository gốc của nhà phát triển, không phải một dự án bao trùm hay công cụ tổng hợp.
- [ ] Tên đăng nhập/hồ sơ nhà phát triển, repository, ID node, subpath và commit đầy đủ đều có bằng chứng.
- [ ] Loại sản phẩm, danh mục và thẻ tuân theo `docs/CATEGORIES.md`.
- [ ] Giấy phép SPDX và mô tả cài đặt đã ghim đều có bằng chứng.
- [ ] Tích hợp DSH gốc và kết quả smoke test hoặc trạng thái `not run` đều có bằng chứng.
- [ ] Tôi không thực thi mã vòng đời plugin hay gói phần mềm để chuẩn bị cho đóng góp này.
- [ ] Số sao riêng biệt có thể xác minh, hoặc số sao monorepo dùng chính sách null bắt buộc.
- [ ] Tôi đã kiểm tra xem đã có mục hoặc pull request đang mở nào cho cùng plugin chính tắc này chưa.
- [ ] Mục này được khai báo rõ ràng là không chính thức và không chứa bí mật nào.

## Chính sách ngôn ngữ

Tài liệu ra mắt và mô tả danh mục chỉ dùng tiếng Anh. Việc triển khai 43 ngôn ngữ vẫn là hạng mục tồn đọng sau MVP;
không thêm tài liệu ngôn ngữ trống hay bản dịch hàng loạt tự động.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
