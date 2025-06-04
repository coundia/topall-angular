# Topall Angular Starter

A modern Angular 19 starter using the standalone API with Tailwind CSS 4.1, DaisyUI 5.x, ngx-translate and Chart.js. The project provides a fully standalone UI/UX structure that follows the SRP approach.

## Features

- Angular 19 Standalone API
- Tailwind CSS v4.1
- DaisyUI v5.x (theme customizable via `data-theme`)
- ngx-translate with dynamic multi-file loader
- Chart.js & ng2-charts
- Signal / Computed / SRP

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/coundia/topall-angular.git
cd topall-angular
npm install
```

## Development server

```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Useful commands

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm start`      | Launch the application               |
| `npm run build`  | Build for production                 |
| `npm run test`   | Run unit tests                       |
| `npm run watch`  | Rebuild on each modification         |

## Translation

This starter uses `@ngx-translate/core` together with `MultiTranslateHttpLoader` to load multiple translation files.

Add your translation files as follows:

```ts
export function httpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    'general',
    'nav',
    'notification',
    'security',
    'errors',
    // add your files here
  ]);
}
```

## Theme & Design

DaisyUI supports dynamic themes:

```html
<html data-theme="light">
<!-- or -->
<html data-theme="dark">
<!-- or your custom theme -->
<html data-theme="tenant-theme">
```

## Charts

Integration with `ng2-charts` and `Chart.js`:

```ts
import { NgChartsModule } from 'ng2-charts';
```

## Tests

Configured with Karma and Jasmine:

```bash
npm run test
```

## Coming next

- Animations and accessibility improvements

---

Made with ❤️
