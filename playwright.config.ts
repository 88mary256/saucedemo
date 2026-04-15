import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the SauceDemo E-Commerce Smoke Suite.
 * Runs tests across Chromium, Firefox, and WebKit in parallel.
 * Uses storageState to skip re-login on every test.
 */
export default defineConfig({
  testDir: './tests',

  /* Run all tests in parallel */
  fullyParallel: true,

  /* Fail the build on CI if test.only is left in source */
  forbidOnly: !!process.env.CI,

  /* Retry once on CI, no retries locally */
  retries: process.env.CI ? 1 : 0,

  /* Limit parallel workers on CI */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter: HTML report + built-in list output */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    /* Base URL for all tests */
    baseURL: 'https://www.saucedemo.com',

    /* Collect trace on first retry to enable Trace Viewer debugging */
    trace: 'on-first-retry',

    /* Capture screenshot only on failure */
    screenshot: 'only-on-failure',

    /* Capture video only on first retry */
    video: 'on-first-retry',
  },

  projects: [
    /* ─── Auth Setup ─────────────────────────────────────────────────────────
     * Runs first and saves the authenticated browser state to disk.
     * All other projects depend on this setup completing successfully.
     * ─────────────────────────────────────────────────────────────────────── */
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    /* ─── Cross-browser test projects ────────────────────────────────────── */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /* Reuse the authenticated session saved by the setup project */
        storageState: 'auth/storageState.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'auth/storageState.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'auth/storageState.json',
      },
      dependencies: ['setup'],
    },
  ],
});
