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

Downloads Chromium, Firefox, and WebKit to the local Playwright cache (`%USERPROFILE%\AppData\Local\ms-playwright` on Windows). This does **not** affect other projects or global configurations.

```bash
npx playwright install
```

---

## Project Structure

```
saucedemo/
├── playwright.config.ts        # Cross-browser config, storageState, trace & report settings
├── package.json
├── tsconfig.json
├── auth/
│   └── storageState.json       # Saved auth session (auto-generated, git-ignored)
├── src/
│   ├── pages/                  # Page Object Model (POM)
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   └── utils/
│       └── testData.ts         # Credentials and test data constants
└── tests/
    ├── auth.setup.ts           # Global auth setup — saves storageState
    ├── login.spec.ts
    ├── cart.spec.ts
    └── checkout.spec.ts
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
