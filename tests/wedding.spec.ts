import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

test.beforeEach(async ({ page }) => {
  // External Maps/fonts are independent of local layout and guestbook checks.
  await page.route("https://www.google.com/maps**", route => route.abort());
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
});

test("stable hydration with a different client clock, correct dates, maps and responsive layout", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && /hydrat|server rendered|didn't match/i.test(message.text())) errors.push(message.text()); });
  // A completely different browser clock reliably reproduces the old SSR mismatch.
  await page.clock.setFixedTime(new Date("2026-11-05T12:00:00+07:00"));
  await page.goto("/");
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hoàng Long");
  await expect(page.locator("#hero")).toContainText("28, 29-11-2026");
  await expect(page.locator("[data-countdown-value]").first()).toHaveText("23");
  await expect(page.locator("[data-countdown-value]").nth(1)).toHaveText("04");
  await expect(page.getByRole("timer")).toContainText("Ngày");
  await expect(page.getByRole("timer")).toContainText("Giây");
  await expect(page.locator("#wedding-info")).toContainText("28/11/2026");
  await expect(page.locator("#wedding-info")).toContainText("29/11/2026");
  await expect(page.locator("#wedding-info")).toContainText("16h00");
  await expect(page.locator("#wedding-info")).toContainText("09h00");
  await expect(page.getByRole("link", { name: "Chỉ đường đến lễ cưới bên chú rể" })).toHaveAttribute("href", /destination=20\.8152004%2C106\.3205681/);
  await expect(page.getByRole("link", { name: "Chỉ đường đến lễ cưới bên cô dâu" })).toHaveAttribute("href", /destination=20\.8066873%2C106\.4282514/);
  expect(await page.locator("a[href*=rsvp]").count()).toBe(0);
  expect(await page.getByText("A love made of little moments").count()).toBe(0);

  for (const width of testInfo.project.name === "mobile" ? [320, 375, 390, 430] : [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
    const cards = await page.locator("#gifts article").evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, width: rect.width, height: rect.height };
    }));
    expect(cards[0].top).toBeCloseTo(cards[1].top, 0);
    expect(cards[0].width).toBeCloseTo(cards[1].width, 0);
    expect(cards[0].height).toBeCloseTo(cards[1].height, 0);
  }
  await page.setViewportSize(testInfo.project.name === "mobile" ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
  // Trigger lazy images before checking they decode successfully.
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  await page.locator("#gifts").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("#gifts img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const qr = await page.locator("#gifts img").first().getAttribute("src");
  expect(qr).toBe("/media/qr/QR_groom.png");
  await page.screenshot({ path: `.local/qa/${testInfo.project.name}-gifts.png`, fullPage: false });
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `.local/qa/${testInfo.project.name}-page.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test("countdown stops at zero after the ceremony", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-12-01T09:00:00+07:00"));
  await page.goto("/");
  await expect(page.locator("[data-countdown-value]")).toHaveText(["00", "00", "00", "00"]);
  await expect(page.getByRole("heading", { name: "Ngày hạnh phúc đã đến" })).toBeVisible();
});

test("gallery opens, navigates, traps focus and closes with Escape", async ({ page }) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: /^Xem ảnh cưới 1:/ });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1 / 6");
  await page.getByRole("button", { name: "Ảnh tiếp theo" }).click();
  await expect(dialog).toContainText("2 / 6");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toContainText("1 / 6");
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("music uses the local looping track and respects manual pause", async ({ page, request }) => {
  await page.goto("/");
  const audio = page.locator("audio");
  await expect(audio).toHaveAttribute("src", "/media/sound/Music.mp3");
  await expect(audio).toHaveAttribute("loop", "");
  const media = await request.get("/media/sound/Music.mp3", { headers: { Range: "bytes=0-1023" } });
  expect([200, 206]).toContain(media.status());
  expect(media.headers()["content-type"]).toContain("audio/mpeg");
  const toggle = page.locator("[data-music-control]");
  if (await toggle.getAttribute("aria-pressed") !== "true") await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("heading", { level: 1 }).click();
  expect(await audio.evaluate(element => (element as HTMLAudioElement).paused)).toBe(true);
});

test("wishes persist for another visitor and retries do not duplicate them", async ({ page, browser }) => {
  await page.goto("/");
  await expect(page.getByText("Đang mở những lời yêu thương…")).toBeHidden();
  const suffix = randomUUID().slice(0, 8);
  const name = `Khách mời ${suffix}`;
  const message = `Chúc Long và Thanh trăm năm hạnh phúc! ${suffix}`;
  await page.getByLabel("Tên của bạn").fill(name);
  await page.getByLabel("Lời chúc yêu thương").fill(message);
  await page.getByRole("button", { name: "Gửi lời chúc", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Lời chúc của bạn đã được gửi" })).toBeVisible();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  const visitor = await browser.newContext();
  const response = await visitor.request.get("http://localhost:3100/api/wishes");
  const data = await response.json();
  expect(data.wishes.some((wish: { name: string; message: string }) => wish.name === name && wish.message === message)).toBe(true);
  expect(data.wishes.every((wish: Record<string, unknown>) => !("visitorHash" in wish))).toBe(true);
  const id = randomUUID();
  const input = { id, name: `Lời chúc qua API ${suffix}`, message: "Luôn bên nhau nhé!" };
  const sent = await visitor.request.post("http://localhost:3100/api/wishes", { data: input });
  expect(sent.status()).toBe(201);
  const retry = await visitor.request.post("http://localhost:3100/api/wishes", { data: input });
  expect(retry.status()).toBe(201);
  const limited = await visitor.request.post("http://localhost:3100/api/wishes", { data: { ...input, id: randomUUID() } });
  expect(limited.status()).toBe(429);
  const all = await (await visitor.request.get("http://localhost:3100/api/wishes")).json();
  expect(all.wishes.filter((wish: { id: string }) => wish.id === id)).toHaveLength(1);
  await visitor.close();
});

test("invalid, oversized and cross-origin wishes are rejected; failed sends retain the draft", async ({ request, page }) => {
  const input = { id: randomUUID(), name: "Khách mời", message: "Hạnh phúc nhé!" };
  expect((await request.post("/api/wishes", { data: { ...input, name: "   " } })).status()).toBe(400);
  expect((await request.post("/api/wishes", { data: { ...input, message: "x".repeat(601) } })).status()).toBe(400);
  expect((await request.post("/api/wishes", { data: { ...input, website: "spam.example" } })).status()).toBe(400);
  expect((await request.post("/api/wishes", { data: { ...input, message: "x".repeat(9000) } })).status()).toBe(413);
  expect((await request.post("/api/wishes", { data: input, headers: { Origin: "https://another.example" } })).status()).toBe(403);
  await page.goto("/");
  await page.route("**/api/wishes", route => route.request().method() === "POST" ? route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Chưa gửi được lời chúc. Bạn thử lại nhé." }) }) : route.continue());
  await page.getByLabel("Tên của bạn").fill("Tên vẫn còn");
  await page.getByLabel("Lời chúc yêu thương").fill("Lời chúc vẫn được giữ lại.");
  await page.getByRole("button", { name: "Gửi lời chúc", exact: true }).click();
  await expect(page.locator("#guestbook").getByRole("alert")).toContainText("Chưa gửi được lời chúc");
  await expect(page.getByLabel("Tên của bạn")).toHaveValue("Tên vẫn còn");
  await expect(page.getByLabel("Lời chúc yêu thương")).toHaveValue("Lời chúc vẫn được giữ lại.");
});
