const origin = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;
if (!origin) {
  console.error("Cách dùng: npm run guestbook:check -- https://wedding-invitations-ochre.vercel.app");
  process.exit(1);
}

const instructions = {
  GUESTBOOK_NOT_CONFIGURED: "Vercel → Settings → Environment Variables: thêm SUPABASE_URL và SUPABASE_SECRET_KEY cho Production/Preview, rồi redeploy.",
  GUESTBOOK_INVALID_URL: "Dùng Project URL dạng https://your-project.supabase.co từ Supabase, rồi redeploy.",
  GUESTBOOK_INVALID_KEY: "Dùng Secret key sb_secret_... hoặc legacy service_role JWT. Publishable/anon key không có quyền lưu lời chúc.",
  GUESTBOOK_ACCESS_DENIED: "Kiểm tra secret key đúng project và chạy lại supabase/guestbook.sql để cấp quyền cho service_role.",
  GUESTBOOK_SCHEMA_MISSING: "Mở SQL Editor của đúng project Supabase, chạy toàn bộ supabase/guestbook.sql, rồi thử lại.",
  GUESTBOOK_UNAVAILABLE: "Kiểm tra trạng thái project Supabase và Runtime Logs trên Vercel. Project có thể đang tạm dừng hoặc mất kết nối."
};

try {
  const url = new URL("/api/wishes", origin);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("URL website không hợp lệ.");
  const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  if (response.ok && Array.isArray(body?.wishes)) {
    console.log(`OK: API lời chúc trả HTTP ${response.status}, đọc được ${body.wishes.length} lời chúc. Không tạo dữ liệu thử.`);
  } else {
    console.error(`API lời chúc trả HTTP ${response.status}.`);
    if (Array.isArray(body?.missingVariables)) {
      const missing = body.missingVariables.filter(name => ["SUPABASE_URL", "SUPABASE_SECRET_KEY"].includes(name));
      if (missing.length) console.error(`Deployment đang thiếu: ${missing.join(", ")}.`);
    }
    console.error(instructions[body?.code] || "Kiểm tra đã chạy supabase/guestbook.sql, thêm biến môi trường trong Vercel, và redeploy bản code mới. Xem docs/supabase-setup.md.");
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error && error.name === "TimeoutError" ? "Không nhận được phản hồi sau 15 giây. Kiểm tra URL và Deployment Protection." : "Không thể kết nối website. Kiểm tra URL, mạng và Deployment Protection trên Vercel.");
  process.exitCode = 1;
}
