import { createHash, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { listWishes, saveWish, WishRateLimitError } from "@/lib/guestbook-store";
import { wishInputSchema } from "@/lib/wishes";
import { GuestbookStorageError, needsGuestbookSetup } from "@/lib/guestbook-errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({ wishes: await listWishes() }, { headers });
    if (!request.cookies.has("wedding_guest")) {
      response.cookies.set("wedding_guest", randomUUID(), { httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:", maxAge: 60 * 60 * 24 * 365, path: "/" });
    }
    return response;
  } catch (error) {
    const code = error instanceof GuestbookStorageError ? error.code : "GUESTBOOK_UNAVAILABLE";
    console.error("Unable to read wedding wishes:", code, error instanceof Error ? error.message : "Unknown storage error");
    const message = needsGuestbookSetup(code) ? "Sổ lời chúc đang được chuẩn bị. Bạn ghé lại sau một chút nhé." : "Chưa thể tải lời chúc. Bạn vui lòng thử lại nhé.";
    return NextResponse.json({ error: message, code }, { status: 503, headers });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  let sameOrigin = !origin;
  if (origin) {
    try {
      const originUrl = new URL(origin);
      // Compare with the incoming Host so LAN previews and reverse proxies work too.
      sameOrigin = ["http:", "https:"].includes(originUrl.protocol) && originUrl.host === request.headers.get("host");
    } catch { sameOrigin = false; }
  }
  if (!sameOrigin || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403, headers });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Định dạng lời chúc không hợp lệ." }, { status: 415, headers });
  }

  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return NextResponse.json({ error: "Lời chúc quá dài. Bạn hãy rút ngắn lại nhé." }, { status: 413, headers });
      }
      chunks.push(chunk.value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Nội dung gửi lên không hợp lệ." }, { status: 400, headers });
  }
  const parsed = wishInputSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bạn hãy điền tên (tối đa 80 ký tự) và lời chúc (tối đa 600 ký tự) nhé." }, { status: 400, headers });
  }

  try {
    const address = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    // Guests sharing wedding Wi-Fi must each be able to send their own wish.
    const visitor = `${address}:${request.cookies.get("wedding_guest")?.value || "anonymous"}`;
    const salt = process.env.GUESTBOOK_RATE_LIMIT_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "local-wedding-guestbook";
    const visitorHash = createHash("sha256").update(`${salt}:${visitor}`).digest("hex");
    return NextResponse.json({ wish: await saveWish(parsed.data, visitorHash) }, { status: 201, headers });
  } catch (error) {
    if (error instanceof WishRateLimitError) {
      return NextResponse.json({ error: "Bạn vừa gửi lời chúc. Hãy chờ 20 giây trước khi gửi thêm nhé." }, { status: 429, headers: { ...headers, "Retry-After": "20" } });
    }
    const code = error instanceof GuestbookStorageError ? error.code : "GUESTBOOK_UNAVAILABLE";
    console.error("Unable to save wedding wish:", code, error instanceof Error ? error.message : "Unknown storage error");
    return NextResponse.json({ error: "Chưa gửi được lời chúc. Nội dung vẫn được giữ lại để bạn thử lần nữa nhé.", code }, { status: 503, headers });
  }
}
