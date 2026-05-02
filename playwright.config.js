import { defineConfig, devices } from '@playwright/test';

// Uses demo mode: `npm run dev:test` runs Vite with --mode test so it picks
// up `.env.test` with empty Supabase vars, which makes isSupabaseConfigured
// false and boots the app with DEMO_USER + sample trips. No network calls,
// reproducible state every run.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5191',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:5191',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
