# Thiệp cưới Hoàng Long & Hà Thanh

Website thiệp cưới tiếng Việt bằng Next.js 15, React 19, TypeScript và Tailwind CSS. Giao diện màu ngà, xanh olive và vàng champagne, tối ưu cho điện thoại và máy tính.

## Chạy tại máy

Yêu cầu Node.js 22 trở lên.

```bash
npm ci
npm run dev
```

Mở địa chỉ Next.js hiển thị trong terminal. Để xem từ điện thoại, kết nối cùng mạng Wi-Fi và truy cập địa chỉ Network tương ứng. Khi đưa website lên Internet, sử dụng HTTPS.

## Nội dung

- Ngày đầu trang: **28, 29-11-2026**.
- Chú rể: **16h00, thứ Bảy 28/11/2026**, Tân Kỳ, Hải Phòng. Địa điểm: **AN KIDS - Siêu thị Mẹ và Bé**, tọa độ **20.8152004, 106.3205681**.
- Cô dâu: **09h00, Chủ Nhật 29/11/2026**, Chí Minh, Hải Phòng. Địa điểm: **Nhà văn hóa thôn Gia Lộc**, tọa độ **20.8066873, 106.4282514**.
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

Thư mục gốc thực tế của repository là **resources/**. File dùng trên web nằm ở **public/media/**, đã được tạo sẵn và cần đưa vào Git khi triển khai.

Khi thay ảnh, QR hoặc nhạc nguồn, chạy:

```bash
npm run assets
```

Script tạo ảnh WebP tối đa 1600 × 2000 px, tự xoay theo EXIF và loại metadata máy ảnh; QR giữ PNG không mất dữ liệu. Nhạc được sao chép nguyên bản. Ảnh gốc khoảng 78 MB, bộ WebP khoảng 1,4 MB; ảnh trên trang tiếp tục được tối ưu bởi next/image. Script không sửa ảnh gốc.

Font Inter và Playfair Display được lưu tại **public/fonts/**, có đầy đủ ký tự tiếng Việt và giấy phép OFL đi kèm. Website không cần tải font từ Google khi khách mở thiệp.

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
   - **SUPABASE_SERVICE_ROLE_KEY**: service role key, chỉ dùng phía máy chủ.
   - **GUESTBOOK_RATE_LIMIT_SECRET**: chuỗi ngẫu nhiên dài, khuyến nghị.
   - **NEXT_PUBLIC_SITE_URL**: URL thật của website, để tạo ảnh xem trước khi chia sẻ.
4. Build và triển khai lại.

Không đặt service role key trong biến bắt đầu bằng NEXT_PUBLIC_. Bảng bật RLS; khách truy cập qua API của Next.js, không truy cập trực tiếp bảng. Hàm SQL xử lý gửi, giới hạn tần suất và thử lại trong cùng giao dịch.

Nếu chạy trên Vercel/serverless mà thiếu cấu hình, API trả lỗi rõ ràng và không ghi dữ liệu vào ổ đĩa tạm. Tích hợp Supabase đã có mã nguồn và schema; cần project cùng biến môi trường thật để dùng trên hosting.

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
```

macOS/Linux:

```bash
NEXT_DIST_DIR=.local/next-build npm run build
PLAYWRIGHT_BROWSERS_PATH=.local/pw-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=.local/pw-browsers npm run test:e2e
```

Kiểm thử bao gồm desktop và điện thoại: hydration khi đồng hồ lệch, bộ đếm sau ngày cưới, tràn ngang ở 320–1440 px, hai cột QR cân đối, album ảnh, nhạc bật/tắt, gửi lời chúc dùng chung, chống gửi trùng, giới hạn tần suất, dữ liệu không hợp lệ và giữ bản nháp khi lỗi mạng. Maps và Google Fonts được chặn trong test để kiểm tra không phụ thuộc dịch vụ ngoài. Ảnh chụp kiểm tra lưu ở **.local/qa/**.

Đã cập nhật Next.js lên bản vá 15.5.29 và các dependency chạy thực tế. Tại thời điểm kiểm tra, **npm audit --omit=dev** không báo lỗ hổng; audit đầy đủ còn 6 cảnh báo mức moderate trong chuỗi công cụ ESLint/TypeScript liên quan minimatch.

Bản đồ nhúng cần kết nối Google Maps. Kiểm thử kích thước điện thoại chạy trên Chromium giả lập; nên xem thêm trên Safari/iPhone thật trước khi gửi thiệp rộng rãi.
