[![Developer](https://img.shields.io/badge/developer-Daniel%20M.%20Hendricks-lightgrey.svg?colorB=9900cc )](https://www.danhendricks.com?utm_source=github.com&utm_medium=campaign&utm_content=button&utm_campaign=dmhendricks%2Fbootstrap-grid-css)
[![Release](https://img.shields.io/github/release/dmhendricks/bootstrap-grid-css.svg)](https://github.com/dmhendricks/bootstrap-grid-css/releases)
[![GitHub License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://raw.githubusercontent.com/dmhendricks/bootstrap-grid-css/master/LICENSE)
[![GitHub Downloads](https://img.shields.io/github/downloads/dmhendricks/bootstrap-grid-css/total.svg?label=GitHub%20downloads)](https://github.com/dmhendricks/bootstrap-grid-css/releases)
[![NPM Downloads](https://img.shields.io/npm/dt/bootstrap-grid-only-css.svg?label=npm%20downloads)](https://www.npmjs.com/package/bootstrap-grid-only-css?utm_source=github.com&utm_medium=referral&utm_content=button&utm_campaign=dmhendricks%2Fbootstrap-grid-css)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/danielhendricks)

# bootstrap-grid.css

### :pushpin: [View Demo](https://dmhendricks.github.io/demo/bootstrap-grid-css/)

## Purpose

There are times when you only want to use the excellent Bootstrap grid functionality but don't want the extra classes and typography changes included, often when asked to work on existing client sites that do not include any responsive frameworks and you just want to get the changes done quickly and responsively. With Bootstrap 4, extracting the grid functionality is easy.

### Included Features

* Grid framework
* Responsive Utilities (ported from alpha)
* `.img-fluid` class (formerly `.img-responsive` in Bootstrap 3)
* `clearfix` utility

## ⚠️ Deprecation

**This project is largely deprecated for Bootstrap 5 and newer.**

Modern versions of Bootstrap provide an official grid-only build, making this package unnecessary for most use cases. If you only need Bootstrap's grid system without the rest of the framework, you can use Bootstrap's `bootstrap-grid.min.css` directly.

For example, via jsDelivr:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap-grid.min.css"
>
```

See the [Bootstrap package on jsDelivr](https://cdn.jsdelivr.net/npm/bootstrap/dist/css/) for the available grid builds.

### When is this project still useful?

One feature this project provides that Bootstrap's official grid-only build does not is **scoping**. The Bootstrap grid classes in this package are scoped beneath `.bootstrap-wrapper`, which can be useful when adding Bootstrap's grid to an existing site without exposing Bootstrap's grid and utility selectors globally.

For example:

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

If you do not need this isolation, you should generally use Bootstrap's official grid-only build instead.

## Installation

### NPM

```bash
npm install bootstrap-grid-only-css --save
```

### Bower Installation

```bash
bower install bootstrap4-grid-only
```

## Usage

Unlike traditional Bootstrapped, the grid must be wrapped with the `.bootstrap-wrapper` class in an attempt to minimize potential conflicts with other libraries.

Simply download the appropriate CSS file and include it in your HTML header (you only need one):
* `bootstrap-grid.css` - The expanded version
* `bootstrap-grid.min.css` - The minified version

Documentation for the [grid system](https://getbootstrap.com/docs/4.1/layout/grid/) may be found on the [Bootstrap web site](https://getbootstrap.com/).

### Linking Stylesheets

Add the following to the head of your web page:

```html
<link rel="stylesheet" href="dist/css/bootstrap-grid.min.css" />
```

#### CDN: jsDelivr

Supports both HTTP and HTTPS.

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/dmhendricks/bootstrap-grid-css@4.1.3/dist/css/bootstrap-grid.min.css" />
```

### Basic Usage Example

```html
<div class="bootstrap-wrapper">
	<div class="container">
		<div class="row">
			<div class="col-md-4">.col-md-4</div>
			<div class="col-md-4">.col-md-4</div>
			<div class="col-md-4">.col-md-4</div>
		</div>
		<div class="row hidden-sm-down"> <!-- Hidden on small screens -->
			<div class="col-md-6">.col-md-6</div>
			<div class="col-md-6">.col-md-6</div>
		</div>
	</div>
</div>
```

See the [demo](https://dmhendricks.github.io/demo/bootstrap-grid-css/) for more information.

## Custom Build Tutorial

You can make your own custom build of Bootstrap by downloading the source, making changes to the SCSS files and compiling.

Here is how to accomplish what I have done here:

1. Download and extract the Bootstrap [source files](https://github.com/twbs/bootstrap/)
2. Modify the SCSS files as desired. For example, to generate this build I added the `.bootstrap-wrapper` class to `scss/bootstrap-grid.scss` (lines 23 and 50), included the responsive utilities (line 43) and `.img-fluid` class (line 48). I also ported the `scss/utilities/_visibility.scss` [responsive utilities](http://v4-alpha.getbootstrap.com/layout/responsive-utilities/) that were found in alpha for convenience.
3. Once you are done making your changes, use a program like [Koala](http://koala-app.com/) or [Scout](http://scout-app.io/) to compile the SCSS files into usable CSS files. If you have Gulp and npm installed, you can simply run the command: `gulp styles`

## Credits & License

This project is a derivative build of [Bootstrap](https://getbootstrap.com/) 4.1.3, created by [The Bootstrap Authors](https://github.com/twbs/bootstrap/graphs/contributors) and originally Twitter, Inc. Bootstrap is released under the [MIT License](https://github.com/twbs/bootstrap/blob/main/LICENSE).

Modifications and packaging in this repository are also under the [MIT License](LICENSE).
