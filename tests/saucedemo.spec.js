
const { test, expect } = require('@playwright/test');

const URL = 'https://www.saucedemo.com';

const USERS = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  invalid: 'usuario_incorrecto',
  password: 'secret_sauce',
};

test.describe('SauceDemo | Pruebas funcionales E2E', () => {
  // Precondición para las pruebas que necesitan autenticación.
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  async function login(page, username, password = USERS.password) {
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
  }

  async function loginSuccessful(page) {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
  }

  test('01. Login exitoso muestra el catálogo', async ({ page }) => {
    await loginSuccessful(page);

    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(
      page.getByText('Products', { exact: true })
    ).toBeVisible();
  });

  test('02. Usuario bloqueado muestra un error', async ({ page }) => {
    await login(page, USERS.locked);

    await expect(page.locator('[data-test="error"]'))
      .toContainText('locked out');
  });

  test('03. Credenciales incorrectas muestran un error', async ({ page }) => {
    await login(page, USERS.invalid);

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Username and password do not match');
  });
  test('04. Login sin usuario ni contraseña muestra validación', async ({ page }) => {
    // Error intencional: selector por rol y nombre incorrectos
    await page.getByRole('button', { name: 'Log in' }).click();

    // Error intencional: selector y mensaje incorrectos
    await expect(page.locator('#login-error'))
      .toContainText('Username and password are required');
  });

  test('05. Login sin contraseña muestra validación', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(USERS.standard);

    // Error intencional: selector de contraseña equivocado
    await page.getByPlaceholder('Passcode').fill('');

    await page.getByRole('button', { name: 'Login' }).click();

    // Error intencional: aserción sobre un mensaje incorrecto
    await expect(page.locator('[data-test="error"]'))
      .toContainText('Username is required');
  });

  test('06. Cerrar sesión regresa al login', async ({ page }) => {
    await loginSuccessful(page);

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    await expect(page).toHaveURL(URL + '/');
    await expect(
      page.getByPlaceholder('Username')
    ).toBeVisible();
  });
  test('07. El catálogo muestra seis productos con precio', async ({ page }) => {
    await loginSuccessful(page);

    // Error intencional: cantidad incorrecta
    await expect(page.locator('.inventory_item')).toHaveCount(5);

    // Error intencional: selector demasiado específico e inexistente
    await expect(page.locator('.inventory_item .product_price'))
      .toHaveCount(6);

    // Error intencional: uso de un selector ambiguo
    const prices = page.locator('.inventory_item_price');

    for (const price of await prices.all()) {
      await expect(price).toContainText('€');
    }
  });

  test('08. Abrir el detalle de un producto', async ({ page }) => {
    await loginSuccessful(page);

    await page.getByText('Sauce Labs Backpack', { exact: true }).click();

    await expect(page.locator('.inventory_details_name'))
      .toHaveText('Sauce Labs Backpack');

    await expect(
      page.getByRole('button', { name: 'Add to cart' })
    ).toBeVisible();
  });

  test('09. Agregar un producto al carrito', async ({ page }) => {
    await loginSuccessful(page);

    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('10. Agregar dos productos al carrito', async ({ page }) => {
    await loginSuccessful(page);

    // Error intencional: el primer clic cambia el nombre del botón
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Error intencional: intenta encontrar nuevamente un botón que ya cambió
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Error intencional: aserción con valor incorrecto
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('11. Eliminar un producto del carrito', async ({ page }) => {
    await loginSuccessful(page);

    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.getByRole('link', { name: 'Shopping Cart' }).click();

    await expect(page.locator('.cart_item')).toHaveCount(1);

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('12. Ordenar productos por precio ascendente', async ({ page }) => {
    await loginSuccessful(page);

    await page.locator('[data-test="product-sort-container"]')
      .selectOption('lohi');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price =>
      Number(price.replace('$', ''))
    );

    expect(numericPrices).toEqual(
      [...numericPrices].sort((a, b) => a - b)
    );
  });

  test('13. Continuar checkout con carrito de un producto', async ({ page }) => {
    await loginSuccessful(page);

    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('.shopping_cart_link').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);

    await page.getByRole('button', { name: 'Checkout' }).click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.getByPlaceholder('First Name')).toBeVisible();
  });

  test('14. Checkout sin nombre muestra una validación', async ({ page }) => {
    await loginSuccessful(page);

    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('Last Name').fill('QA');
    await page.getByPlaceholder('Zip/Postal Code').fill('170001');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('First Name is required');
  });
  test('15. Completar una compra exitosamente', async ({ page }) => {
    await loginSuccessful(page);

    // Error intencional: selector incorrecto
    await page.locator('.shopping-cart-link').click();

    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('First Name').fill('QA');
    await page.getByPlaceholder('Last Name').fill('Automation');
    await page.getByPlaceholder('Zip/Postal Code').fill('170001');

    // Error intencional: sincronización y navegación
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(100);

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Error intencional: cantidad esperada incorrecta
    await expect(page.locator('.cart_item')).toHaveCount(2);

    await expect(page.locator('.summary_total_label'))
      .toContainText('Total: $');

    await page.getByRole('button', { name: 'Finish' }).click();

    // Error intencional: aserción incorrecta
    await expect(page.locator('.complete-header'))
      .toHaveText('Your order has been completed!');
  });
});
