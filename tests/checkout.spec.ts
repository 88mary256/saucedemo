import { test, expect } from '@playwright/test';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { InventoryPage } from '@pages/InventoryPage';
import { checkoutInfo } from '@utils/testData';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Start every checkout test from the inventory page with one item in the cart
    await inventoryPage.navigate('/inventory.html');
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
  });

  test('complete full checkout flow', async ({ page }) => {
    // Step 1 — proceed from cart
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');

    // Step 2 — fill personal information
    await checkoutPage.fillPersonalInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode,
    );
    await expect(page).toHaveURL('/checkout-step-two.html');

    // Step 3 — review and finish
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL('/checkout-complete.html');

    expect(await checkoutPage.isOrderComplete()).toBe(true);
    expect(await checkoutPage.getSuccessMessage()).toContain('Thank you for your order');
  });

  test('checkout with empty personal info shows error', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout-step-one.html');

    await checkoutPage.fillPersonalInfo('', '', '');

    expect(await checkoutPage.errorMessage.isVisible()).toBe(true);
    expect(await checkoutPage.errorMessage.textContent()).toContain('First Name is required');
  });

  test('order summary shows correct item before finishing', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillPersonalInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode,
    );
    await expect(page).toHaveURL('/checkout-step-two.html');

    expect(await checkoutPage.orderItems.count()).toBe(1);
    expect(await checkoutPage.getSummaryTotal()).toContain('Total');
  });
});
