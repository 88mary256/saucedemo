import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { users } from '@utils/testData';

/**
 * Override storageState for this file.
 * Login tests need a fresh unauthenticated session — no pre-saved cookies.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('standard_user logs in successfully', async ({ page }) => {
    const { username, password } = users.standard_user;

    await loginPage.login(username, password);

    await expect(page).toHaveURL('/inventory.html');
  });

  test('locked_out_user sees locked account error', async () => {
    const { username, password } = users.locked_out_user;

    await loginPage.login(username, password);

    await expect.soft(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('empty credentials show username required error', async () => {
    await loginPage.login('', '');

    await expect.soft(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('missing password shows password required error', async () => {
    await loginPage.login(users.standard_user.username, '');

    await expect.soft(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });
});
