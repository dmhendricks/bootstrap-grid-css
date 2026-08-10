[![Release](https://img.shields.io/github/release/dmhendricks/bootstrap-grid-css.svg)](https://github.com/dmhendricks/bootstrap-grid-css/releases)
[![GitHub License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://raw.githubusercontent.com/dmhendricks/bootstrap-grid-css/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/bootstrap-grid-only-css.svg?label=npm%20downloads)](https://www.npmjs.com/package/bootstrap-grid-only-css?utm_source=github.com&utm_medium=referral&utm_content=button&utm_campaign=dmhendricks%2Fbootstrap-grid-css)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/danielhendricks)

# bootstrap-grid.css

[View Demo](https://dmhendricks.github.io/bootstrap-grid-css/)

## Purpose

There are times when you only want Bootstrap's grid, without the typography resets and component styles that come with the full framework — typically when adding responsive layout to an existing site that already has its own styles.

This package is the Bootstrap grid, the flex/spacing utilities and a few extras, compiled to plain CSS and **scoped beneath `.bootstrap-wrapper`** so none of it applies to the rest of your page.

**Zero dependencies.** You get a stylesheet — no JavaScript, no runtime, no build step, nothing installed alongside it. Bootstrap itself is only a build-time dependency of this repository.

### Included features

* Grid: `.container`, `.row`, `.col-*` at every breakpoint, offsets, ordering, gutters
* Flex utilities: `.justify-content-*`, `.align-items-*`, `.align-self-*`, `.flex-*`
* Spacing utilities: `.m-*`, `.p-*` and their axis/side variants
* Display utilities: `.d-*`, including `.d-print-*`
* `.img-fluid`, `.clearfix`, `.visible` / `.invisible`
* Right-to-left builds

### Scoping

Bootstrap's own grid build defines `.container`, `.row` and `.col-*` globally, so dropping it into a site that already uses those names will change styling you did not intend to touch. Here every selector is nested beneath `.bootstrap-wrapper`:

```html
<div class="bootstrap-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-md-6">...</div>
      <div class="col-md-6">...</div>
    </div>
  </div>
</div>
```

Markup outside that wrapper is unaffected — including markup using those same class names. If you do not need that isolation, see [Do you actually need this?](#do-you-actually-need-this) below.

## Installation

```bash
npm install bootstrap-grid-only-css --save
```

Or download `dist/css/bootstrap-grid.min.css` from the [latest release](https://github.com/dmhendricks/bootstrap-grid-css/releases).

> Bower support was removed in 5.x; Bower has been deprecated for years.

## Usage

Include one stylesheet — expanded for development, minified for production, each with a right-to-left variant:

| File | Use |
| --- | --- |
| `bootstrap-grid.css` | Expanded, with source map |
| `bootstrap-grid.min.css` | Minified |
| `bootstrap-grid.rtl.css` | Right-to-left, expanded |
| `bootstrap-grid.rtl.min.css` | Right-to-left, minified |

```html
<link rel="stylesheet" href="dist/css/bootstrap-grid.min.css" />
```

### CDN: jsDelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only-css@5.3.8/dist/css/bootstrap-grid.min.css" />
```

### Example

Remember the wrapper — without it, nothing applies:

```html
<div class="bootstrap-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-md-4">.col-md-4</div>
      <div class="col-md-4">.col-md-4</div>
      <div class="col-md-4">.col-md-4</div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6 d-none d-md-block">Centred, hidden below md</div>
    </div>
  </div>
</div>
```

See the [demo](https://dmhendricks.github.io/bootstrap-grid-css/) for more, including copyable snippets for each example.

Grid documentation lives on the [Bootstrap site](https://getbootstrap.com/docs/5.3/layout/grid/); every class works the same way here, just nested under the wrapper.

## ⚠️ Upgrading from 4.x

Version 5.x is built from Bootstrap 5.3.8 and **is not a drop-in replacement**. Bootstrap 5 renamed or removed a number of classes; these are the ones that affect this package:

| 4.x | 5.x | Notes |
| --- | --- | --- |
| `.no-gutters` | `.g-0` | Renamed. `.g-*`, `.gx-*`, `.gy-*` (0–5) are also now available |
| `.hidden-{bp}-up` / `.hidden-{bp}-down` | `.d-{bp}-none` | Use the display utilities |
| `.visible-print-*` / `.hidden-print` | `.d-print-*` | e.g. `.d-print-none` |
| `.order-6` … `.order-12` | `.order-0` … `.order-5` | **Bootstrap 5 only generates 0–5**, plus `.order-first` / `.order-last` |
| `.img-fluid`, `.clearfix`, `.visible`, `.invisible` | unchanged | Still included |

Everything you are most likely using — `.container`, `.row`, `.col-*`, `.col-{bp}-*`, `.offset-*` — is unchanged. Bootstrap 5 also **adds** the flex alignment utilities that 4.x omitted ([#1](https://github.com/dmhendricks/bootstrap-grid-css/issues/1)), the `.row-cols-*` helpers, an `xxl` breakpoint and RTL builds.

**Bootstrap 5 drops Internet Explorer support.** If you need IE, stay on [4.1.3](https://github.com/dmhendricks/bootstrap-grid-css/releases/tag/4.1.3).

See Bootstrap's [v5 migration guide](https://getbootstrap.com/docs/5.3/migration/) for the full upstream list.

## Do you actually need this?

**For most projects, no — use Bootstrap's own grid build instead.**

Bootstrap ships an official grid-only stylesheet, so the original reason this package existed (Bootstrap 3 had no such build) is long gone. If you are starting fresh, or adding the grid to a site whose class names you control, use the upstream file:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap-grid.min.css"
>
```

See the [Bootstrap package on jsDelivr](https://cdn.jsdelivr.net/npm/bootstrap/dist/css/) for the available builds.

**The one thing this package does that Bootstrap's does not is scoping.** It is worth using only when you need Bootstrap's grid inside a page you do not fully control — a legacy site, a CMS theme, a client codebase with its own `.container` or `.row` — and cannot afford Bootstrap's selectors applying globally. That is a real situation, and it is the only one this package is for.

## Building from source

```bash
npm install
npm run build      # writes the four stylesheets to dist/css
npm test           # typecheck, verification checks, browser tests
```

The build compiles [`scss/bootstrap-grid.scss`](scss/bootstrap-grid.scss), which nests Bootstrap's own grid bundle beneath the wrapper class using `@use` and `meta.load-css`, then runs the output through PostCSS for prefixing, RTL generation and minification.

To use a different wrapper class, override `$bootstrap-wrapper-class` in [`scss/_variables.scss`](scss/_variables.scss) and rebuild.

## Credits & License

This project is a derivative build of [Bootstrap](https://getbootstrap.com/) 5.3.8, created by [The Bootstrap Authors](https://github.com/twbs/bootstrap/graphs/contributors) and originally Twitter, Inc. Bootstrap is released under the [MIT License](https://github.com/twbs/bootstrap/blob/main/LICENSE).

Modifications and packaging in this repository are also under the [MIT License](LICENSE).
