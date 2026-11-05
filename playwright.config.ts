import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "wedding.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } }
  ],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    env: {
      NEXT_DIST_DIR: ".local/next-build",
      GUESTBOOK_DATA_DIR: `.local/qa-wishes/${Date.now()}`,
      SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_URL: "",
      SUPABASE_SECRET_KEY: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      VERCEL: "",
      AWS_LAMBDA_FUNCTION_NAME: ""
    },
    timeout: 60000
  }
});
