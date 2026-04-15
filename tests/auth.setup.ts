import { test as setup } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { LoginPage } from '@pages/LoginPage';
import { defaultUser } from '@utils/testData';

const AUTH_FILE = '.auth/storageState.json';

/**
 * Global authentication setup.
 * Runs once before all browser projects.
 * Logs in with the default user and saves the browser session to disk
 * so every test can reuse it without re-logging in.
 */
setup('authenticate', async ({ page }) => {
  // Ensure the auth directory exists before writing the state file
  mkdirSync('.auth', { recursive: true });

  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(defaultUser.username, defaultUser.password);

  // Verify login succeeded before saving state
  await page.waitForURL('**/inventory.html');

  await page.context().storageState({ path: AUTH_FILE });
});
