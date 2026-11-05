import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "guestbook-cloud.spec.ts",
  outputDir: ".local/qa-cloud-results",
  workers: 1,
  fullyParallel: false,
  timeout: 30000,
  use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3101", trace: "retain-on-failure" },
  webServer: [
    { command: "node tests/fixtures/supabase-server.mjs", url: "http://127.0.0.1:3105/__health", reuseExistingServer: false },
    {
      command: "node node_modules/next/dist/bin/next start --port 3101",
      url: "http://localhost:3101",
      reuseExistingServer: false,
      env: {
        NEXT_DIST_DIR: ".local/next-build",
        SUPABASE_URL: "http://127.0.0.1:3105",
        NEXT_PUBLIC_SUPABASE_URL: "",
        SUPABASE_SECRET_KEY: "sb_secret_guestbook_test",
        SUPABASE_SERVICE_ROLE_KEY: "",
        AWS_LAMBDA_FUNCTION_NAME: "guestbook-cloud-test",
        VERCEL: ""
      }
    }
  ]
});
