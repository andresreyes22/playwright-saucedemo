# Playwright Automation - SauceDemo

## 1. Descripción

Proyecto de automatización de pruebas funcionales E2E utilizando **Playwright y JavaScript** sobre el sitio de práctica [SauceDemo](https://www.saucedemo.com/).

El proyecto permite validar los principales flujos de una tienda virtual, visualizar la ejecución de las pruebas en el navegador y generar reportes con evidencias de los errores.

## 2. Tecnologías

- **Playwright Test:** automatización y ejecución de pruebas.
- **JavaScript:** lenguaje de programación.
- **Chromium:** navegador utilizado para las pruebas.
- **HTML Reporter:** generación de reportes de ejecución.

## 3. Cobertura de pruebas

La suite contiene 15 pruebas funcionales:

- **Login:** exitoso, usuario bloqueado, credenciales inválidas y campos obligatorios.
- **Sesión:** cierre de sesión.
- **Catálogo:** listado de productos, precios y detalle.
- **Carrito:** agregar y eliminar productos.
- **Ordenamiento:** productos por precio ascendente.
- **Checkout:** navegación, validaciones y finalización de compra.

## 4. Instalación y ejecución

### 4.1. Instalar dependencias

Si el proyecto ya está creado, ejecuta:

```bash
npm install -D @playwright/test
```

Instala el navegador Chromium:

```bash
npx playwright install chromium
```

### 4.2. Ejecutar las pruebas abriendo el navegador

```bash
npx playwright test --headed
```

**¿Qué hace?**

Ejecuta las pruebas automatizadas mostrando el navegador Chromium en pantalla. Permite observar cómo Playwright navega por la página, inicia sesión, agrega productos al carrito y completa el checkout.

### 4.3. Ejecutar un archivo específico

```bash
npx playwright test tests/saucedemo.spec.js --headed
```

**¿Qué hace?**

Ejecuta únicamente las pruebas definidas en `tests/saucedemo.spec.js`, mostrando el navegador.

### 4.4. Ejecutar las pruebas sin abrir el navegador

```bash
npx playwright test
```

**¿Qué hace?**

Ejecuta las pruebas en modo headless, sin mostrar una ventana del navegador. Es útil para ejecuciones rápidas y pipelines de integración continua (CI/CD).

### 4.5. Consultar el reporte HTML

```bash
npx playwright show-report
```

**¿Qué hace?**

Abre el reporte HTML generado por Playwright para consultar las pruebas aprobadas, fallidas y sus detalles.

### 4.6. Ejecutar una prueba por su nombre

```bash
npx playwright test -g "Login exitoso" --headed
```

**¿Qué hace?**

Ejecuta solamente la prueba cuyo nombre coincide con el texto indicado, mostrando el navegador.

### 4.7. Depurar una prueba paso a paso

```bash
npx playwright test --debug
```

**¿Qué hace?**

Abre el inspector de Playwright para depurar las pruebas, avanzar paso a paso y revisar las acciones y los localizadores utilizados.

## 5. Evidencias de ejecución

El proyecto está configurado para guardar evidencias cuando una prueba falla:

- **Screenshots:** capturas de pantalla del fallo.
- **Video:** grabación de la ejecución fallida.
- **Trace:** traza para investigar las acciones y los errores.

La ubicación de las evidencias depende de la configuración y del directorio de resultados de Playwright, normalmente `test-results/`.

El reporte HTML se genera en `playwright-report/`.

## 6. Estructura del proyecto

```text
playwright-saucedemo/
├── tests/
│   └── saucedemo.spec.js
├── playwright.config.js
├── package.json
├── playwright-report/
└── test-results/
```

## 7. Consideraciones

- Utilizar el sitio exclusivamente para pruebas de práctica.
- Verificar que las pruebas finalicen correctamente antes de publicar resultados.
- Revisar los reportes y las evidencias cuando existan fallos.
- Mantener los datos de prueba y los localizadores actualizados ante cambios en la aplicación.

## 8. Objetivo

Fortalecer las habilidades de automatización QA mediante pruebas E2E, validaciones funcionales, análisis de resultados y generación de evidencias con Playwright.
