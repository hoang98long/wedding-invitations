import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { databaseConfig } from "../lib/guestbook-config";
import { GuestbookStorageError } from "../lib/guestbook-errors";

test.beforeEach(async ({ request }) => {
  await request.post("http://127.0.0.1:3105/__scenario", { data: { scenario: "ready" } });
});

test("modern server keys and legacy service_role keys use the correct REST authentication", () => {
  const modern = databaseConfig({ NEXT_PUBLIC_SUPABASE_URL: " https://example.supabase.co/rest/v1/ ", SUPABASE_SECRET_KEY: '"sb_secret_example"' });
  expect(modern?.url).toBe("https://example.supabase.co");
  expect(modern?.headers.apikey).toBe("sb_secret_example");
  expect(modern?.headers.Authorization).toBeUndefined();
  const legacyKey = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.test-signature`;
  expect(databaseConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: legacyKey })?.headers.Authorization).toBe(`Bearer ${legacyKey}`);
});

test("serverless needs durable configuration and public keys cannot impersonate the backend", () => {
  expect(databaseConfig({})).toBeNull();
  for (const environment of [{ VERCEL: "1" }, { SUPABASE_URL: "https://example.supabase.co", SUPABASE_SECRET_KEY: "sb_publishable_public" }]) {
    try { databaseConfig(environment); throw new Error("Expected setup failure"); } catch (error) {
      expect(error).toBeInstanceOf(GuestbookStorageError);
      expect((error as Error).message).not.toContain("sb_publishable_public");
    }
  }
});

test("hosted reads, writes and retries work with a modern Supabase key", async ({ request }) => {
  expect((await request.get("/api/wishes")).status()).toBe(200);
  const input = { id: randomUUID(), name: "Khách mời trên Vercel", message: "Chúc hai bạn luôn hạnh phúc bên nhau!" };
  const sent = await request.post("/api/wishes", { data: input });
  expect(sent.status()).toBe(201);
  expect((await sent.json()).wish.message).toBe(input.message);
  expect((await request.post("/api/wishes", { data: input })).status()).toBe(201);
  const list = await (await request.get("/api/wishes")).json();
  expect(list.wishes).toHaveLength(1);
  expect(list.wishes[0].id).toBe(input.id);
  expect(await (await request.get("http://127.0.0.1:3105/__headers")).json()).toEqual({ correctApiKey: true, authorizationPresent: false });
});

test("missing schema and denied database access return actionable codes without exposing secrets", async ({ request }) => {
  for (const [scenario, code] of [["schema-missing", "GUESTBOOK_SCHEMA_MISSING"], ["access-denied", "GUESTBOOK_ACCESS_DENIED"], ["unavailable", "GUESTBOOK_UNAVAILABLE"]]) {
    await request.post("http://127.0.0.1:3105/__scenario", { data: { scenario } });
    const response = await request.get("/api/wishes");
    expect(response.status()).toBe(503);
    const text = await response.text();
    expect(JSON.parse(text).code).toBe(code);
    expect(text).not.toContain("sb_secret_");
    expect(JSON.parse(text).wishes).toBeUndefined();
  }
});

test("guestbook recovers after setup is fixed and keeps the visitor's draft", async ({ page, request }) => {
  await request.post("http://127.0.0.1:3105/__scenario", { data: { scenario: "schema-missing" } });
  await page.route("https://www.google.com/maps**", route => route.abort());
  await page.goto("/");
  const section = page.locator("#guestbook");
  await expect(section.getByRole("alert")).toContainText("đang được chuẩn bị");
  await page.getByLabel("Tên của bạn").fill("Khách đang chờ");
  await page.getByLabel("Lời chúc yêu thương").fill("Chúc hai bạn trọn đời bên nhau.");
  const submit = page.getByRole("button", { name: "Gửi lời chúc", exact: true });
  await expect(submit).toBeDisabled();
  await request.post("http://127.0.0.1:3105/__scenario", { data: { scenario: "ready" } });
  await section.getByRole("button", { name: "Thử tải lại" }).click();
  await expect(submit).toBeEnabled();
  await expect(page.getByLabel("Tên của bạn")).toHaveValue("Khách đang chờ");
  await submit.click();
  await expect(section.getByRole("status").filter({ hasText: "Lời chúc của bạn đã được gửi" })).toBeVisible();
});

test("an HTML error response from hosting never leaks a JSON parser error into the page", async ({ page }) => {
  await page.route("https://www.google.com/maps**", route => route.abort());
  await page.route("**/api/wishes", route => route.fulfill({ status: 503, contentType: "text/html", body: "<h1>Service Unavailable</h1>" }));
  await page.goto("/");
  await expect(page.locator("#guestbook").getByRole("alert")).toContainText("Chưa thể tải lời chúc");
  await expect(page.locator("#guestbook")).not.toContainText("Unexpected token");
});
