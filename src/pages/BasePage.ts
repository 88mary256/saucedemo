import { Page } from '@playwright/test';

/**
 * Abstract base class for all Page Objects.
 * Holds the Playwright Page instance and exposes shared navigation helpers.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }
}
