import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the SauceDemo E-Commerce Smoke Suite.
 * Runs tests across Chromium, Firefox, and WebKit in parallel.
 * Uses storageState to skip re-login on every test.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: process.env.CI ? 'never' : 'always' }],
  ],

  use: {
    /* Base URL for all tests */
    baseURL: 'https://www.saucedemo.com',
    headless: !!process.env.CI,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
        storageState: '.auth/storageState.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/storageState.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: '.auth/storageState.json',
      },
      dependencies: ['setup'],
    },
  ],
});
