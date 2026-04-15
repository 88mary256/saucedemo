import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

/**
 * Page Object for the SauceDemo inventory/products page (/inventory.html).
 * Handles product listing, sorting, and adding items to the cart.
 */
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  /**
   * Clicks the "Add to cart" button for a given product name.
   * Converts the product name to the kebab-case slug used in data-test attributes.
   * e.g. "Sauce Labs Backpack" → "add-to-cart-sauce-labs-backpack"
   */
  async addItemToCartByName(productName: string): Promise<void> {
    const slug = productName.toLowerCase().replaceAll(' ', '-');
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    const isVisible = await badge.isVisible();
    if (!isVisible) return 0;
    const text = await badge.textContent();
    return text ? Number.parseInt(text, 10) : 0;
  }

  async getInventoryItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }
}
