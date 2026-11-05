# Thiết lập lời chúc trên Vercel bằng Supabase

Website: **https://wedding-invitations-ochre.vercel.app**.

API /api/wishes trả HTTP 503 nếu deployment thiếu cấu hình, thiếu bảng/hàm hoặc không truy cập được database. Các bước dưới đây tạo nơi lưu chung cho mọi khách; lời chúc tồn tại qua các lần redeploy.

## 1. Tạo project

1. Đăng nhập hoặc tạo tài khoản tại [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn [New project](https://supabase.com/dashboard/new), chọn hoặc tạo organization của bạn.
3. Đặt tên project **long-thanh-wedding** và tạo mật khẩu database mạnh. Mật khẩu database không phải API key dùng ở bước 3.
4. Chọn **Southeast Asia (Singapore)**, rồi tạo project và chờ trạng thái sẵn sàng. Đây là [khu vực Supabase hỗ trợ](https://supabase.com/docs/guides/platform/regions).

## 2. Tạo bảng và hàm gửi lời chúc

1. Trong project vừa tạo, mở **SQL Editor → New query**.
2. Mở [supabase/guestbook.sql](../supabase/guestbook.sql), sao chép **toàn bộ** nội dung và dán vào SQL Editor.
3. Bấm **Run**. Khi hoàn tất, **Table Editor** sẽ có bảng **wedding_wishes**.

Script tạo cả bảng, index, quyền truy cập và hàm **add_wedding_wish**. Chạy toàn bộ script, kể cả phần cuối. Có thể chạy lại để cập nhật quyền và làm mới schema cache; dữ liệu lời chúc hiện có được giữ lại.

## 3. Lấy Project URL và khóa máy chủ

- **Project URL**: lấy URL của project, dạng https://your-project.supabase.co, từ hộp **Connect** hoặc thông tin kết nối API.
- **Secret key**: mở **Settings → API Keys**, tạo/copy một Secret key dạng **sb_secret_...**.

Code hỗ trợ Secret key mới và legacy service_role JWT. Secret key mới gửi qua header apikey; legacy JWT dùng thêm Authorization: Bearer theo [tài liệu Supabase](https://supabase.com/docs/guides/getting-started/api-keys). Publishable/anon key không có quyền backend của ứng dụng này.

## 4. Thêm biến trong Vercel

Mở project website → **Settings → Environment Variables**, thêm cho cả **Production** và **Preview**:

| Tên biến | Giá trị |
| --- | --- |
| SUPABASE_URL | Project URL ở bước 3 |
| SUPABASE_SECRET_KEY | Secret key sb_secret_... ở bước 3 |
| GUESTBOOK_RATE_LIMIT_SECRET | Chuỗi ngẫu nhiên dài tự tạo, khuyến nghị |
| NEXT_PUBLIC_SITE_URL | https://wedding-invitations-ochre.vercel.app |

Nếu dùng legacy service_role JWT, đặt trong **SUPABASE_SERVICE_ROLE_KEY** thay cho SUPABASE_SECRET_KEY. Giữ giá trị đúng project, không thêm dấu ngoặc kép khi nhập trên Vercel. NEXT_PUBLIC_SUPABASE_URL cũng được chấp nhận làm alias của Project URL.

Giữ secret key trong Vercel hoặc .env.local trên máy, không đưa vào GitHub, chat hay biến NEXT_PUBLIC_.

## 5. Push code mới và redeploy

1. Commit và push các thay đổi code lên nhánh GitHub đang kết nối với Vercel.
2. Chờ deployment mới thành công. Nếu đã deploy trước khi thêm biến môi trường, mở **Deployments → deployment mới nhất → Redeploy**.

Biến mới áp dụng cho deployment tiếp theo, theo [tài liệu Vercel](https://vercel.com/docs/environment-variables).

### Đã kết nối Supabase với Vercel nhưng vẫn báo thiếu cấu hình

1. Mở **đúng project website** trong Vercel, kiểm tra **Settings → Environment Variables** có **SUPABASE_URL** hoặc **NEXT_PUBLIC_SUPABASE_URL**, và **SUPABASE_SECRET_KEY** hoặc legacy **SUPABASE_SERVICE_ROLE_KEY**.
2. Kiểm tra các biến được áp dụng cho **Production** để website chính sử dụng được. Preview dành cho các deployment thử nghiệm.
3. Nếu dùng integration, kiểm tra tài nguyên Supabase đã gắn vào project website. [Vercel Marketplace integration](https://supabase.com/docs/guides/integrations/vercel-marketplace) đồng bộ URL và secret key tới các project được kết nối.
4. Chọn **Redeploy** sau khi lưu biến hoặc kết nối tài nguyên. Deployment cũ tiếp tục dùng cấu hình trước đó.

Key phải được lưu dưới đúng tên biến; ví dụ giá trị sb_secret_... đặt trong biến SUPABASE_SECRET_KEY. POSTGRES_URL và SUPABASE_JWT_SECRET không thay thế cho cặp Project URL/API key mà ứng dụng đang dùng.

Khi trả GUESTBOOK_NOT_CONFIGURED, API mới có trường **missingVariables** chỉ gồm **tên biến còn thiếu**, không có giá trị khóa. Lệnh guestbook:check in các tên này để đối chiếu với Vercel.

## 6. Kiểm tra

Mở **https://wedding-invitations-ochre.vercel.app/api/wishes**. Khi project mới chưa có lời chúc, kết quả đúng là:

```json
{"wishes":[]}
```

Hoặc chạy tại máy:

```bash
npm run guestbook:check -- https://wedding-invitations-ochre.vercel.app
```

Lệnh chỉ đọc trạng thái; không tạo lời chúc thử. Sau đó dùng biểu mẫu trên website để gửi một lời chúc và mở lại từ thiết bị khác để kiểm tra.

| Mã lỗi trong phản hồi API mới | Cách xử lý |
| --- | --- |
| GUESTBOOK_NOT_CONFIGURED | Thêm đủ URL và secret key vào đúng môi trường Vercel, rồi redeploy |
| GUESTBOOK_INVALID_URL | Dùng Project URL HTTPS của Supabase |
| GUESTBOOK_INVALID_KEY | Dùng secret key hoặc service_role JWT |
| GUESTBOOK_ACCESS_DENIED | Kiểm tra đúng key/project và chạy lại toàn bộ SQL để cấp quyền |
| GUESTBOOK_SCHEMA_MISSING | Chạy toàn bộ SQL trong đúng project Supabase |
| GUESTBOOK_UNAVAILABLE | Kiểm tra trạng thái project Supabase và Runtime Logs của Vercel |

Website hiển thị thông báo thân thiện cho khách; các chi tiết thiết lập nằm trong phản hồi API và Runtime Logs. Hệ thống báo gửi thành công sau khi database xác nhận đã lưu.
