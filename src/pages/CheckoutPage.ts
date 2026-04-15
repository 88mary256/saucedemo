import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

/**
 * Page Object covering all three checkout steps in SauceDemo:
 *  - Step One (/checkout-step-one.html): personal information form
 *  - Step Two (/checkout-step-two.html): order overview
 *  - Complete (/checkout-complete.html): order confirmation
 */
export class CheckoutPage extends BasePage {
  // Step One — personal information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step Two — order overview
  readonly finishButton: Locator;
  readonly orderItems: Locator;
  readonly summaryTotal: Locator;

  // Complete — confirmation
  readonly successHeader: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('[data-test="finish"]');
    this.orderItems = page.locator('.cart_item');
    this.summaryTotal = page.locator('.summary_total_label');

    this.successHeader = page.locator('.complete-header');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async fillPersonalInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async isOrderComplete(): Promise<boolean> {
    return this.successHeader.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successHeader.textContent()) ?? '';
  }

  async getSummaryTotal(): Promise<string> {
    return (await this.summaryTotal.textContent()) ?? '';
  }
}
