import { test, expect } from '@playwright/test';
import { CartPage } from '@pages/CartPage';
import { InventoryPage } from '@pages/InventoryPage';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.navigate('/inventory.html');
  });

  test('add single item updates cart badge to 1', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('add multiple items updates cart badge correctly', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');

    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('cart page shows the added item', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);

    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getItemNames()).toContain('Sauce Labs Backpack');
  });

  test('cart is empty when no items are added', async ({ page }) => {
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);

    expect(await cartPage.getItemCount()).toBe(0);
  });
});
