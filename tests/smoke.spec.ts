import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

test('login page loads correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();

  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});
