# Thiệp cưới Hoàng Long & Hà Thanh

Website thiệp cưới tiếng Việt bằng Next.js 15, React 19, TypeScript và Tailwind CSS. Giao diện có một nền hoa lãng mạn màu be xuyên suốt, thẻ nội dung màu ngà và điểm nhấn vàng champagne, tối ưu cho điện thoại và máy tính.

## Chạy tại máy

Yêu cầu Node.js **22.x**, đã khai báo trong **package.json** và **.nvmrc**.

```bash
npm ci
npm run dev
```

Mở địa chỉ Next.js hiển thị trong terminal. Để xem từ điện thoại, kết nối cùng mạng Wi-Fi và truy cập địa chỉ Network tương ứng. Khi đưa website lên Internet, sử dụng HTTPS.

## Đưa mã nguồn lên GitHub

Đưa mã nguồn cùng tài nguyên web đã tối ưu lên GitHub; thư viện sẽ được cài lại bằng **npm ci** từ **package-lock.json**.

| Đưa lên GitHub | Bỏ qua, giữ tại máy |
| --- | --- |
| app/, components/, lib/ | node_modules/, .next/, .local/ |
| public/media/, public/fonts/ | resources/ chứa ảnh và nhạc gốc |
| scripts/, supabase/, tests/ | data/ chứa lời chúc lưu tại máy |
| package.json, package-lock.json, các file cấu hình | Log, cache, kết quả kiểm thử |
| .gitignore, .vercelignore, vercel.json, .env.example | .env.local, .env.production và biến môi trường bí mật |

**Giữ public/** trong repository: đây là ảnh, QR, nhạc và font mà website sử dụng. Build không cần thư mục resources/.

Các file .next/, resources/, log và next-env.d.ts từng được commit đã được bỏ theo dõi trong Git; file tại máy vẫn còn nguyên. Commit các thay đổi và push lên repository hiện tại như bình thường:

```bash
git add .
git commit -m "Prepare source for GitHub and Vercel"
git push
```

Nếu remote origin chưa được cấu hình, thêm địa chỉ repository GitHub của bạn trước khi push.

### Tạo bản mã nguồn sạch cho repository mới

Các commit cũ vẫn chứa file build và ảnh gốc. .gitignore áp dụng cho lần commit tiếp theo và không làm nhỏ lịch sử đã có. Cách xử lý file đã được theo dõi được mô tả trong [tài liệu GitHub](https://docs.github.com/en/get-started/git-basics/ignoring-files).

Để bắt đầu một repository mới chỉ với mã nguồn hiện tại, chạy:

```bash
npm run export:source
```

Script tạo thư mục có tên theo thời gian trong **.local/github-ready/** và in đường dẫn cụ thể. Thư mục xuất chứa mã nguồn, tài nguyên web và cấu hình; đã loại dependency, build, tài nguyên gốc, dữ liệu cục bộ, file bí mật và lịch sử Git. Lệnh này cần Git được cài trên máy và chạy trong repository hiện tại.

Mở terminal tại thư mục vừa xuất, rồi dùng repository GitHub trống của bạn:

```bash
git init -b main
git add .
git commit -m "Initial wedding website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Thay YOUR_USERNAME và YOUR_REPOSITORY bằng thông tin của bạn. Lịch sử của repository hiện tại được giữ nguyên.

## Deploy lên Vercel

Đã có **vercel.json** với preset Next.js, lệnh cài **npm ci** và lệnh build **npm run build**. Phiên bản Node.js được cố định ở nhánh **22.x**. Xem [cấu hình Vercel](https://vercel.com/docs/project-configuration/vercel-json) và [phiên bản Node.js được hỗ trợ](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

1. Push mã nguồn lên GitHub.
2. Trong Vercel, chọn **Add New → Project**, import repository đó.
3. Dùng **Framework Preset: Next.js**, **Root Directory: ./**; giữ Output Directory mặc định của framework.
4. Thêm các biến môi trường của sổ lời chúc theo phần **Lưu lời chúc** bên dưới. Trên Vercel cần **SUPABASE_URL** và **SUPABASE_SECRET_KEY** (hoặc legacy **SUPABASE_SERVICE_ROLE_KEY**) để khách gửi lời chúc được lưu lâu dài. Có [hướng dẫn tạo Supabase từng bước](docs/supabase-setup.md).
5. Chọn **Deploy**. Website dùng tài nguyên có sẵn trong public/; thư viện và bản build được tạo trên Vercel.
6. Sau khi có tên miền thật, đặt **NEXT_PUBLIC_SITE_URL** thành URL HTTPS của website và redeploy để ảnh xem trước khi chia sẻ dùng đúng địa chỉ.

**Không đặt NEXT_DIST_DIR trên Vercel**. Mã nguồn tự dùng .next khi chạy trên Vercel. NEXT_DIST_DIR dành cho build kiểm thử tại máy.

**.vercelignore** loại cache, thư viện tại máy, ảnh gốc và file kiểm thử khỏi gói upload qua Vercel CLI, theo [tài liệu .vercelignore](https://vercel.com/docs/deployments/vercel-ignore). Khi triển khai từ GitHub, .gitignore cùng trạng thái file đã được theo dõi quyết định nội dung repository.

## Nội dung

- Ngày đầu trang: **28, 29-11-2026**.
- Chú rể có hai mốc: **Bữa cơm thân mật — 16h00, thứ Bảy 28/11/2026** và **Lễ Thành hôn — 11h00, Chủ Nhật 29/11/2026**, tại Tân Kỳ, Hải Phòng. Địa điểm chung: **AN KIDS - Siêu thị Mẹ và Bé**, tọa độ **20.8152004, 106.3205681**.
- Cô dâu có hai mốc: **Bữa cơm thân mật — 16h00, thứ Bảy 28/11/2026** và **Lễ Đón dâu — 09h00, Chủ Nhật 29/11/2026**, tại Chí Minh, Hải Phòng. Địa điểm chung: **Nhà văn hóa thôn Gia Lộc**, tọa độ **20.8066873, 106.4282514**.
- Mỗi bên có bản đồ và liên kết Google Maps chỉ đường theo đúng tọa độ trong liên kết đã cung cấp. Liên kết HTTPS dùng được trên Android, iOS và máy tính.
- Bộ đếm hướng tới lễ cưới đầu tiên, **28/11/2026 lúc 16h00 (UTC+7)**. Lần render máy chủ và trình duyệt đều dùng placeholder; chỉ đọc thời gian trong effect, tránh lỗi hydration. Hết thời gian sẽ dừng ở 0.
- Album chọn 6 ảnh thật, bố cục 2 cột trên điện thoại và 3 cột trên màn hình lớn; chạm để xem ảnh đầy đủ. Hỗ trợ phím mũi tên, Escape và điều hướng bàn phím.
- Nhạc lấy từ **resources/sound/Music.mp3**, phát lặp ở âm lượng 35%. Website thử phát khi mở trang; trình duyệt có thể yêu cầu tương tác đầu tiên. Nút bật/tắt luôn hiển thị và tôn trọng việc khách chủ động tắt nhạc.
- Đã bỏ RSVP và phần câu chuyện mẫu.
- Mừng cưới: hai cột cân xứng, QR nguyên vẹn, có nút sao chép tài khoản và tải QR về điện thoại.

| Bên | Ngân hàng | Chủ tài khoản | Số tài khoản | QR nguồn |
| --- | --- | --- | --- | --- |
| Chú rể | MB | NGUYEN HOANG LONG | 0560131149005 | resources/qr/QR_groom.png |
| Cô dâu | BIDV | NGUYEN HA THANH | 1600306634 | resources/qr/QR_bride.png |

Chỉnh thông tin ngày, tên, ảnh và tọa độ tại **lib/wedding.ts**; chỉnh tài khoản tại **components/GiftSection.tsx**.

## Ảnh, QR và nhạc

Tài nguyên gốc lưu cục bộ tại **resources/** và được bỏ qua trong Git. File dùng trên web nằm ở **public/media/**, đã được tạo sẵn và cần đưa vào Git khi triển khai.

Khi thay ảnh, QR hoặc nhạc nguồn, đặt lại file gốc vào resources/images, resources/qr và resources/sound trên máy, rồi chạy:

```bash
npm run assets
```

Sau đó commit các file public/media/ đã cập nhật. Khi clone repository mới hoặc deploy Vercel, dùng trực tiếp public/media/ có sẵn.

Script tạo ảnh WebP tối đa 1600 × 2000 px, tự xoay theo EXIF và loại metadata máy ảnh; QR giữ PNG không mất dữ liệu. Nhạc được sao chép nguyên bản. Ảnh gốc khoảng 78 MB, bộ WebP khoảng 1,4 MB; ảnh trên trang tiếp tục được tối ưu bởi next/image. Script không sửa ảnh gốc.

Font Inter và Playfair Display được lưu tại **public/fonts/**, có đầy đủ ký tự tiếng Việt và giấy phép OFL đi kèm. Website không cần tải font từ Google khi khách mở thiệp.

Ảnh **public/media/backgrounds/beige-floral-continuous.webp** tạo một nền hoa màu be chung, cố định phía sau toàn bộ nội dung khi cuộn. Các phần nội dung dùng nền trong suốt, nên hoa lá không bị cắt hoặc khởi động lại ở ranh giới mỗi phần; các thẻ và QR có nền ngà để dễ đọc. Xem [file ảnh và prompt tạo ảnh](docs/backgrounds.md).

## Lưu lời chúc

Khách điền tên và lời chúc, gửi qua **POST /api/wishes**. **GET /api/wishes** trả về 100 lời chúc mới nhất. Nội dung chỉ báo gửi thành công sau khi máy chủ xác nhận đã lưu, dùng chung cho mọi khách và tồn tại sau khi tải lại trang.

Tên tối đa 80 ký tự, lời chúc tối đa 600 ký tự. Có kiểm tra phía máy chủ, giới hạn kích thước request, ô honeypot và khoảng chờ 20 giây giữa các lần gửi. Mỗi lần gửi có UUID để thử lại khi mất mạng mà không tạo bản trùng. Nội dung khách được render dưới dạng văn bản; lỗi gửi giữ nguyên bản nháp.

### Local hoặc VPS với ổ đĩa lưu lâu dài

Mặc định dữ liệu được lưu tại **data/wishes.jsonl**, được loại khỏi Git. Có thể đặt **GUESTBOOK_DATA_DIR** tới thư mục lưu lâu dài bằng biến môi trường. Đặt quyền ghi cho tiến trình Node và sao lưu thư mục này.

Cách này dành cho **một tiến trình Node**. Khi chạy nhiều instance hoặc serverless, dùng Supabase bên dưới. Sau reverse proxy, cấu hình proxy ghi đè đúng header địa chỉ IP khách để giới hạn tần suất hoạt động đúng.

### Vercel, serverless hoặc nhiều instance

Phải cấu hình cơ sở dữ liệu để lời chúc tồn tại qua các lần triển khai:

1. Tạo một project Supabase.
2. Chạy toàn bộ **supabase/guestbook.sql** trong SQL Editor của project.
3. Sao chép **.env.example** thành **.env.local** khi thử tại máy, hoặc thêm biến trong phần Environment Variables của hosting:
   - **SUPABASE_URL**: URL project Supabase.
   - **SUPABASE_SECRET_KEY**: Secret key mới dạng sb_secret_..., chỉ dùng phía máy chủ. Nếu dùng legacy service_role JWT thì đặt **SUPABASE_SERVICE_ROLE_KEY** thay thế.
   - **GUESTBOOK_RATE_LIMIT_SECRET**: chuỗi ngẫu nhiên dài, khuyến nghị.
   - **NEXT_PUBLIC_SITE_URL**: URL thật của website, để tạo ảnh xem trước khi chia sẻ.
4. Build và triển khai lại.

Không đặt secret key/service role key trong biến bắt đầu bằng NEXT_PUBLIC_. Bảng bật RLS; khách truy cập qua API của Next.js, không truy cập trực tiếp bảng. Hàm SQL xử lý gửi, giới hạn tần suất và thử lại trong cùng giao dịch. Project URL có thể lấy từ SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_URL.

Nếu chạy trên Vercel/serverless mà thiếu cấu hình, API trả lỗi rõ ràng và không ghi dữ liệu vào ổ đĩa tạm. Tích hợp Supabase đã có mã nguồn và schema; cần project cùng biến môi trường thật để dùng trên hosting.

Nếu hiện thông báo chưa thể tải lời chúc, làm theo [hướng dẫn Supabase](docs/supabase-setup.md) hoặc kiểm tra API bằng lệnh chỉ đọc:

```bash
npm run guestbook:check -- https://wedding-invitations-ochre.vercel.app
```

API mới trả mã lỗi để phân biệt thiếu biến môi trường, sai key, thiếu bảng/hàm SQL và lỗi kết nối. Giao diện giữ nguyên bản nháp khi gửi lỗi và cho phép tải lại sau khi cấu hình được sửa.

## Build và kiểm tra

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

Kiểm thử trình duyệt dùng bản build riêng để không ảnh hưởng thư mục .next của dev server.

PowerShell:

```powershell
$env:NEXT_DIST_DIR = '.local/next-build'
npm run build
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.local/pw-browsers'
npx playwright install chromium
npm run test:e2e
npm run test:cloud
```

macOS/Linux:

```bash
NEXT_DIST_DIR=.local/next-build npm run build
PLAYWRIGHT_BROWSERS_PATH=.local/pw-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=.local/pw-browsers npm run test:e2e
PLAYWRIGHT_BROWSERS_PATH=.local/pw-browsers npm run test:cloud
```

Kiểm thử bao gồm desktop và điện thoại: hydration khi đồng hồ lệch, bộ đếm sau ngày cưới, tràn ngang ở 320–1440 px, hai cột QR cân đối, album ảnh, nhạc bật/tắt, gửi lời chúc dùng chung, chống gửi trùng, giới hạn tần suất, dữ liệu không hợp lệ và giữ bản nháp khi lỗi mạng. Maps và Google Fonts được chặn trong test để kiểm tra không phụ thuộc dịch vụ ngoài. Ảnh chụp kiểm tra lưu ở **.local/qa/**.

**test:cloud** chạy Next.js ở chế độ dùng backend từ xa với một Supabase REST giả lập trong tests/fixtures. Bộ kiểm thử xác nhận header cho secret key mới, tương thích JWT cũ, mã lỗi cấu hình, luồng lưu/đọc lời chúc và khả năng phục hồi sau lỗi. Bộ này không dùng database thật và không xác nhận deployment Vercel đã cấu hình xong.

Đã cập nhật Next.js lên bản vá 15.5.29 và các dependency chạy thực tế. Tại thời điểm kiểm tra, **npm audit --omit=dev** không báo lỗ hổng; audit đầy đủ còn 6 cảnh báo mức moderate trong chuỗi công cụ ESLint/TypeScript liên quan minimatch.

Bản đồ nhúng cần kết nối Google Maps. Kiểm thử kích thước điện thoại chạy trên Chromium giả lập; nên xem thêm trên Safari/iPhone thật trước khi gửi thiệp rộng rãi.
