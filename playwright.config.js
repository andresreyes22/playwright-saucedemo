
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Ejecuta las pruebas en serie para facilitar el seguimiento visual.
  fullyParallel: false,
  workers: 1,

  // Tiempo máximo por prueba.
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  // Abre el navegador y permite observar la ejecución.
  use: {
    ...devices['Desktop Chrome'],
    headless: false,
    browserName: 'chromium',
    viewport: { width: 1366, height: 768 },
    launchOptions: {
      slowMo: 300,
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
});
