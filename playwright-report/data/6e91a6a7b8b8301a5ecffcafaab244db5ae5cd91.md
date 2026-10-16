# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: saucedemo.spec.js >> SauceDemo | Pruebas funcionales E2E >> 10. Agregar dos productos al carrito
- Location: tests/saucedemo.spec.js:124:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.shopping_cart_badge')
Expected: "3"
Received: "2"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" locator('.shopping_cart_badge') with timeout 5000ms
  - waiting for locator('.shopping_cart_badge')
    14 × locator resolved to <span class="shopping_cart_badge" data-test="shopping-cart-badge">2</span>
       - unexpected value "2"

```

```yaml
- text: "2"
```

# Test source

```ts
  34  |     await expect(
  35  |       page.getByText('Products', { exact: true })
  36  |     ).toBeVisible();
  37  |   });
  38  | 
  39  |   test('02. Usuario bloqueado muestra un error', async ({ page }) => {
  40  |     await login(page, USERS.locked);
  41  | 
  42  |     await expect(page.locator('[data-test="error"]'))
  43  |       .toContainText('locked out');
  44  |   });
  45  | 
  46  |   test('03. Credenciales incorrectas muestran un error', async ({ page }) => {
  47  |     await login(page, USERS.invalid);
  48  | 
  49  |     await expect(page.locator('[data-test="error"]'))
  50  |       .toContainText('Username and password do not match');
  51  |   });
  52  |   test('04. Login sin usuario ni contraseña muestra validación', async ({ page }) => {
  53  |     // Error intencional: selector por rol y nombre incorrectos
  54  |     await page.getByRole('button', { name: 'Log in' }).click();
  55  | 
  56  |     // Error intencional: selector y mensaje incorrectos
  57  |     await expect(page.locator('#login-error'))
  58  |       .toContainText('Username and password are required');
  59  |   });
  60  | 
  61  |   test('05. Login sin contraseña muestra validación', async ({ page }) => {
  62  |     await page.getByPlaceholder('Username').fill(USERS.standard);
  63  | 
  64  |     // Error intencional: selector de contraseña equivocado
  65  |     await page.getByPlaceholder('Passcode').fill('');
  66  | 
  67  |     await page.getByRole('button', { name: 'Login' }).click();
  68  | 
  69  |     // Error intencional: aserción sobre un mensaje incorrecto
  70  |     await expect(page.locator('[data-test="error"]'))
  71  |       .toContainText('Username is required');
  72  |   });
  73  | 
  74  |   test('06. Cerrar sesión regresa al login', async ({ page }) => {
  75  |     await loginSuccessful(page);
  76  | 
  77  |     await page.getByRole('button', { name: 'Open Menu' }).click();
  78  |     await page.getByRole('link', { name: 'Logout' }).click();
  79  | 
  80  |     await expect(page).toHaveURL(URL + '/');
  81  |     await expect(
  82  |       page.getByPlaceholder('Username')
  83  |     ).toBeVisible();
  84  |   });
  85  |   test('07. El catálogo muestra seis productos con precio', async ({ page }) => {
  86  |     await loginSuccessful(page);
  87  | 
  88  |     // Error intencional: cantidad incorrecta
  89  |     await expect(page.locator('.inventory_item')).toHaveCount(5);
  90  | 
  91  |     // Error intencional: selector demasiado específico e inexistente
  92  |     await expect(page.locator('.inventory_item .product_price'))
  93  |       .toHaveCount(6);
  94  | 
  95  |     // Error intencional: uso de un selector ambiguo
  96  |     const prices = page.locator('.inventory_item_price');
  97  | 
  98  |     for (const price of await prices.all()) {
  99  |       await expect(price).toContainText('€');
  100 |     }
  101 |   });
  102 | 
  103 |   test('08. Abrir el detalle de un producto', async ({ page }) => {
  104 |     await loginSuccessful(page);
  105 | 
  106 |     await page.getByText('Sauce Labs Backpack', { exact: true }).click();
  107 | 
  108 |     await expect(page.locator('.inventory_details_name'))
  109 |       .toHaveText('Sauce Labs Backpack');
  110 | 
  111 |     await expect(
  112 |       page.getByRole('button', { name: 'Add to cart' })
  113 |     ).toBeVisible();
  114 |   });
  115 | 
  116 |   test('09. Agregar un producto al carrito', async ({ page }) => {
  117 |     await loginSuccessful(page);
  118 | 
  119 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  120 | 
  121 |     await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  122 |   });
  123 | 
  124 |   test('10. Agregar dos productos al carrito', async ({ page }) => {
  125 |     await loginSuccessful(page);
  126 | 
  127 |     // Error intencional: el primer clic cambia el nombre del botón
  128 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  129 | 
  130 |     // Error intencional: intenta encontrar nuevamente un botón que ya cambió
  131 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  132 | 
  133 |     // Error intencional: aserción con valor incorrecto
> 134 |     await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
      |                                                        ^ Error: expect(locator).toHaveText(expected) failed
  135 |   });
  136 | 
  137 |   test('11. Eliminar un producto del carrito', async ({ page }) => {
  138 |     await loginSuccessful(page);
  139 | 
  140 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  141 |     await page.getByRole('link', { name: 'Shopping Cart' }).click();
  142 | 
  143 |     await expect(page.locator('.cart_item')).toHaveCount(1);
  144 | 
  145 |     await page.getByRole('button', { name: 'Remove' }).click();
  146 | 
  147 |     await expect(page.locator('.cart_item')).toHaveCount(0);
  148 |     await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  149 |   });
  150 | 
  151 |   test('12. Ordenar productos por precio ascendente', async ({ page }) => {
  152 |     await loginSuccessful(page);
  153 | 
  154 |     await page.locator('[data-test="product-sort-container"]')
  155 |       .selectOption('lohi');
  156 | 
  157 |     const prices = await page.locator('.inventory_item_price').allTextContents();
  158 |     const numericPrices = prices.map(price =>
  159 |       Number(price.replace('$', ''))
  160 |     );
  161 | 
  162 |     expect(numericPrices).toEqual(
  163 |       [...numericPrices].sort((a, b) => a - b)
  164 |     );
  165 |   });
  166 | 
  167 |   test('13. Continuar checkout con carrito de un producto', async ({ page }) => {
  168 |     await loginSuccessful(page);
  169 | 
  170 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  171 |     await page.locator('.shopping_cart_link').click();
  172 | 
  173 |     await expect(page.locator('.cart_item')).toHaveCount(1);
  174 | 
  175 |     await page.getByRole('button', { name: 'Checkout' }).click();
  176 | 
  177 |     await expect(page).toHaveURL(/checkout-step-one\.html/);
  178 |     await expect(page.getByPlaceholder('First Name')).toBeVisible();
  179 |   });
  180 | 
  181 |   test('14. Checkout sin nombre muestra una validación', async ({ page }) => {
  182 |     await loginSuccessful(page);
  183 | 
  184 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  185 |     await page.locator('.shopping_cart_link').click();
  186 |     await page.getByRole('button', { name: 'Checkout' }).click();
  187 | 
  188 |     await page.getByPlaceholder('Last Name').fill('QA');
  189 |     await page.getByPlaceholder('Zip/Postal Code').fill('170001');
  190 |     await page.getByRole('button', { name: 'Continue' }).click();
  191 | 
  192 |     await expect(page.locator('[data-test="error"]'))
  193 |       .toContainText('First Name is required');
  194 |   });
  195 |   test('15. Completar una compra exitosamente', async ({ page }) => {
  196 |     await loginSuccessful(page);
  197 | 
  198 |     // Error intencional: selector incorrecto
  199 |     await page.locator('.shopping-cart-link').click();
  200 | 
  201 |     await page.getByRole('button', { name: 'Checkout' }).click();
  202 | 
  203 |     await page.getByPlaceholder('First Name').fill('QA');
  204 |     await page.getByPlaceholder('Last Name').fill('Automation');
  205 |     await page.getByPlaceholder('Zip/Postal Code').fill('170001');
  206 | 
  207 |     // Error intencional: sincronización y navegación
  208 |     await page.getByRole('button', { name: 'Continue' }).click();
  209 |     await page.waitForTimeout(100);
  210 | 
  211 |     await expect(page).toHaveURL(/checkout-step-one\.html/);
  212 | 
  213 |     // Error intencional: cantidad esperada incorrecta
  214 |     await expect(page.locator('.cart_item')).toHaveCount(2);
  215 | 
  216 |     await expect(page.locator('.summary_total_label'))
  217 |       .toContainText('Total: $');
  218 | 
  219 |     await page.getByRole('button', { name: 'Finish' }).click();
  220 | 
  221 |     // Error intencional: aserción incorrecta
  222 |     await expect(page.locator('.complete-header'))
  223 |       .toHaveText('Your order has been completed!');
  224 |   });
  225 | });
  226 | 
```