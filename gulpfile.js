/**
 * Gulpfile for bootstrap-grid-css
 *
 * @author Daniel M. Hendricks
 * @license MIT
 * {@link https://github.com/dmhendricks/bootstrap-grid-css GitHub repository}
 */

var pkg           = require( './package.json' );
var gulp          = require( 'gulp' );
var rename        = require( 'gulp-rename' );
var minifycss     = require( 'gulp-uglifycss' );
var sass          = require( 'gulp-sass' );
var autoprefixer  = require( 'gulp-autoprefixer' );
var cache         = require( 'gulp-cache' );
var lineec        = require( 'gulp-line-ending-corrector' );
var filter        = require( 'gulp-filter' );
var notify        = require( 'gulp-notify' );

const AUTOPREFIXER_BROWSERS = [ 'last 2 version', '> 1%', 'ie >= 9', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4', 'bb >= 10' ];

gulp.task( 'styles', function() {
	return gulp
		.src( [ './scss/*.scss', '!./scss/_*.scss' ] )
		.pipe(
			sass({
				errLogToConsole: true,
				outputStyle: 'expanded',
				precision: 10
			})
		)
		.on( 'error', sass.logError )
		.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
		.pipe( lineec() )
		.pipe( gulp.dest( './dist/css' ) )
		.pipe( filter( '**/*.css' ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( minifycss() )
		.pipe( lineec() )
		.pipe( gulp.dest( './dist/css' ) )
		.pipe( notify({ message: 'TASK: "styles" completed', onLast: true }) );
});

gulp.task(
	'default',
	gulp.parallel(
		'styles',
		function watchFiles() {
			gulp.watch( './scss/*.scss', gulp.parallel( 'styles' ) );
		}
	)
);
