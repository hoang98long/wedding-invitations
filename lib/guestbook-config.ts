import { GuestbookStorageError } from "./guestbook-errors";

function clean(value: string | undefined) {
  return value?.trim().replace(/^(["'])(.*)\1$/, "$2").trim() || "";
}

export function databaseConfig(env: Readonly<Record<string, string | undefined>> = process.env) {
  const rawUrl = clean(env.SUPABASE_URL) || clean(env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(env.SUPABASE_SECRET_KEY) || clean(env.SUPABASE_SERVICE_ROLE_KEY);
  const serverless = Boolean(env.VERCEL || env.AWS_LAMBDA_FUNCTION_NAME);
  if (!rawUrl && !key && !serverless) return null;
  if (!rawUrl || !key) {
    const missingVariables = [...(!rawUrl ? ["SUPABASE_URL"] : []), ...(!key ? ["SUPABASE_SECRET_KEY"] : [])];
    throw new GuestbookStorageError("GUESTBOOK_NOT_CONFIGURED", "Set SUPABASE_URL and SUPABASE_SECRET_KEY (or the legacy SUPABASE_SERVICE_ROLE_KEY), then redeploy.", missingVariables);
  }

  let projectUrl: URL;
  try {
    projectUrl = new URL(rawUrl);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(projectUrl.hostname);
    if ((projectUrl.protocol !== "https:" && !(local && projectUrl.protocol === "http:")) || projectUrl.username || projectUrl.password || projectUrl.search || projectUrl.hash) throw new Error("Invalid project URL");
  } catch {
    throw new GuestbookStorageError("GUESTBOOK_INVALID_URL", "SUPABASE_URL must be the HTTPS Project URL from Supabase. Local Supabase may use HTTP on localhost.");
  }
  const url = projectUrl.toString().replace(/\/$/, "").replace(/\/rest\/v1$/, "");
  const modern = key.startsWith("sb_secret_");
  if (!modern) {
    let role: unknown;
    try {
      const parts = key.split(".");
      if (parts.length === 3) role = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")).role;
    } catch { /* Invalid keys receive a useful error without printing their value. */ }
    if (role !== "service_role") {
      throw new GuestbookStorageError("GUESTBOOK_INVALID_KEY", "Use a backend secret key (sb_secret_...) or legacy service_role key, rather than a publishable/anon key.");
    }
  }

  const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json" };
  // Modern sb_secret keys are not JWTs and must not be sent as Bearer tokens.
  if (!modern) headers.Authorization = `Bearer ${key}`;
  return { url, headers };
}
