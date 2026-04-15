# SauceDemo E-Commerce Smoke Suite

Automated UI test suite for [SauceDemo](https://www.saucedemo.com/) built with **Playwright** and **TypeScript**.

Covers login, cart, and checkout flows across **Chromium, Firefox, and WebKit** in parallel.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

## Installation

### 1. Install dependencies

If your machine has a private npm registry configured (e.g., a corporate registry), use the public npm registry explicitly:

```bash
npm install --registry https://registry.npmjs.org
```

Otherwise:

```bash
npm install
```

### 2. Install Playwright browser binaries

Downloads Chromium, Firefox, and WebKit to the local Playwright cache.
This does **not** affect other projects or global configurations.

```bash
npx playwright install
```

### 3. Set up test credentials

Copy the sample env file and fill in the real values:

```bash
cp .env.sample .env
```

Then open `.env` and replace `YOUR_PASSWORD` with the actual password.

> `.env` is listed in `.gitignore` and must **never** be committed.
> Playwright 1.45+ loads `.env` automatically — no extra dependencies needed.

---

## Project Structure

```
saucedemo/
├── playwright.config.ts              # Cross-browser config, storageState, trace & report
├── package.json
├── tsconfig.json
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI workflow
├── auth/
│   └── storageState.json             # Saved auth session (auto-generated, git-ignored)
├── .env                              # Real credentials — git-ignored, do not commit
├── .env.sample                       # Sample credentials — committed, copy to create .env
├── src/
│   ├── pages/                        # Page Object Model (POM)
│   │   ├── BasePage.ts               # Abstract base with shared helpers
│   │   ├── LoginPage.ts              # Login page (/)
│   │   ├── InventoryPage.ts          # Products page (/inventory.html)
│   │   ├── CartPage.ts               # Cart page (/cart.html)
│   │   └── CheckoutPage.ts           # Checkout steps one, two & complete
│   └── utils/
│       └── testData.ts               # Typed user credentials and checkout data (reads from .env)
└── tests/
    ├── auth.setup.ts                 # Global auth setup — logs in and saves storageState
    ├── login.spec.ts                 # Login flow tests
    ├── cart.spec.ts                  # Add-to-cart tests
    └── checkout.spec.ts              # Full checkout flow tests
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests headlessly across all browsers |
| `npm run test:headed` | Run with visible browser windows |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:trace` | Run with trace enabled on every test |
| `npm run test:report` | Open the last HTML report |

---

## Authentication Strategy

The `auth.setup.ts` file runs once before all tests. It logs in to SauceDemo and saves the browser session (cookies + localStorage) to `auth/storageState.json`. All three browser projects reuse this file — avoiding repeated logins on every test.

> `auth/storageState.json` is listed in `.gitignore` and should never be committed.

---

## Trace Viewer (Debugging)

Traces are collected automatically on the first retry of a failing test. To inspect a trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Or open the HTML report which includes a trace link per failed test:

```bash
npm run test:report
```

---

## CI — GitHub Actions

Tests run automatically on every push and pull request via [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

The workflow uploads the Playwright HTML report and any `trace.zip` files as artifacts accessible from the GitHub Actions run summary.
