import { test, expect } from '@playwright/test';
import { InventoryPage } from '@pages/InventoryPage';

/**
 * Intentional failure test — for trace.zip demonstration only.
 *
 * Purpose: show how Playwright Trace Viewer captures every step,
 * network request, screenshot, and DOM snapshot on failure.
 *
 * Run with:
 *   npx playwright test intentional-failure.spec.ts
 *
 * Then inspect the trace:
 *   npx playwright show-trace test-results/<folder>/trace.zip
 */
test('DEMO FAILURE: expects wrong product count to trigger trace', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.navigate('/inventory.html');

  // SauceDemo always shows 6 products — we assert 99 to force the failure
  const actualCount = await inventoryPage.getInventoryItemCount();
  expect(actualCount).toBe(99);
});
