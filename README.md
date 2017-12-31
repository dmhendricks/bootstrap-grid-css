[![Latest Version](https://img.shields.io/github/release/dmhendricks/bootstrap-grid-css.svg)](https://github.com/dmhendricks/bootstrap-grid-css/releases)
[![GitHub License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://raw.githubusercontent.com/dmhendricks/bootstrap-grid-css/master/LICENSE)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/danielhendricks)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/dmhendricks/bootstrap-grid-css.svg?style=social)](https://twitter.com/danielhendricks)

# bootstrap-grid.css

**Version:** 4.0.0-alpha.6

**License:** MIT ([https://github.com/twbs/bootstrap/blob/master/LICENSE](https://github.com/twbs/bootstrap/blob/master/LICENSE))

**Contents Copyright:** (c) 2011-2018 Twitter, Inc.

## Purpose

There are times when you only want to use the excellent Bootstrap grid functionality but don't want the extra classes and typography changes included, often when asked to work on existing client sites that do not include any responsive frameworks and you just want to get the changes done quickly and responsively. With Bootstrap 4, extracting the grid functionality is easy.

### Included Features

* Grid framework
* Responsive Utilities
* `.img-fluid` class (formerly `.img-responsive` in Bootstrap 3)
* `clearfix` utility

### Bower Installation

```
bower install bootstrap4-grid-only
```

## Usage

I have already taken the liberty of extracting the grid and responsive utilities mixins (for those who don't know how or don't want to bother keeping it updated), which can be found in `dist/css/bootstrap-grid.css`. I also wrapped the classes with the `.bootstrap-wrapper` class **to avoid conflicts with other libraries** that may already be used in a project.

Simply download the appropriate CSS file and include it in your HTML header (you only need one):
* `bootstrap-grid.css` - The expanded version
* `bootstrap-grid.min.css` - The minified version

Documentation for the [grid system](http://v4-alpha.getbootstrap.com/layout/grid/) and [responsive utilities](http://v4-alpha.getbootstrap.com/layout/responsive-utilities/) may be found on the [Bootstrap 4 web site](http://v4-alpha.getbootstrap.com/).

### Basic Usage Example

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

## Custom Build Tutorial

You can make your own custom build of Bootstrap by downloading the source, making changes to the SCSS files and compiling.

Here is how you can accomplish what I have done here:

1. Download and extract the Bootstrap [source files](http://v4-alpha.getbootstrap.com/getting-started/download/)
2. Modify the SCSS files as desired. For example, to generate this build I added the `.bootstrap-wrapper` class to `scss/bootstrap-grid.scss` (lines 36 and 62), included the responsive utilities (line 43) and `.img-fluid` class (lines 59-60).
3. Once you are done making your changes, use a program like [Koala](http://koala-app.com/) or [Scout](http://scout-app.io/) to compile the SCSS files into usable CSS files.

## Credits

Please support [humans.txt](http://humanstxt.org/). It's an initiative for knowing the people behind a web site. It's an unobtrusive text file that contains information about the different people who have contributed to building the web site.

**Twitter Bootstrap 4:**

	URL: https://getbootstrap.com
	Author: The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	Twitter: @getbootstrap
