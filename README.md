[![Developer](https://img.shields.io/badge/developer-Daniel%20M.%20Hendricks-lightgrey.svg?colorB=9900cc )](https://www.danhendricks.com?utm_source=github.com&utm_medium=campaign&utm_content=button&utm_campaign=dmhendricks%2Fbootstrap-grid-css)
[![Release](https://img.shields.io/github/release/dmhendricks/bootstrap-grid-css.svg)](https://github.com/dmhendricks/bootstrap-grid-css/releases)
[![GitHub License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://raw.githubusercontent.com/dmhendricks/bootstrap-grid-css/master/LICENSE)
[![GitHub Downloads](https://img.shields.io/packagist/dt/dmhendricks/bootstrap-grid-css.svg?label=GitHub%20downloads)](https://github.com/dmhendricks/bootstrap-grid-css/releases)
[![NPM Downloads](https://img.shields.io/npm/dt/bootstrap-grid-css.svg?label=npm%20downloads)](https://www.npmjs.com/package/bootstrap-grid-css?utm_source=github.com&utm_medium=referral&utm_content=button&utm_campaign=dmhendricks%2Fbootstrap-grid-css)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/danielhendricks)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/dmhendricks/bootstrap-grid-css.svg?style=social)](https://twitter.com/danielhendricks)

# bootstrap-grid.css

**Original Copyright:** (c) 2011-2018 Twitter, Inc.

### :pushpin: [View Demo](https://dmhendricks.github.io/demo/bootstrap-grid-css/)

## Purpose

There are times when you only want to use the excellent Bootstrap grid functionality but don't want the extra classes and typography changes included, often when asked to work on existing client sites that do not include any responsive frameworks and you just want to get the changes done quickly and responsively. With Bootstrap 4, extracting the grid functionality is easy.

### Included Features

* Grid framework
* Responsive Utilities (ported from alpha)
* `.img-fluid` class (formerly `.img-responsive` in Bootstrap 3)
* `clearfix` utility

## Installation

### NPM

```bash
npm install bootstrap-grid-css
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

Linking to stylesheet example:

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
