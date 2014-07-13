var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer');

// Modules for webserver and livereload
var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35728,
    serverport = 5000;


// Set up an express server (not starting it yet)
var server = express();
server.use(livereload({port: livereloadport})); // Add live reload
server.use(express.static('./build')); // Use our 'build' folder as rootfolder

// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
  res.sendfile('index.html', { root: 'dist' });
});



/* -------------------------
 *  Dev task
 * -------------------------
 */
gulp.task('dev', ['views', 'styles', 'lint', 'browserify'], function() {
  server.listen(serverport);          // Start webserver
  lrserver.listen(livereloadport);    // Start live reload
  gulp.task('watch');                  // Run the watch task, to keep taps on changes
});


/* -------------------------
 *  JSHint task
 * -------------------------
 */
gulp.task('lint', function() {
  gulp.src('app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/* -------------------------
 *  Styles task
 * -------------------------
 */
gulp.task('styles', function() {

});

/* -------------------------
 *  Browserify task
 * -------------------------
 */
gulp.task('browserify', function() {

  // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
  gulp.src(['app/scripts/app.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true                 // Enables source-maps
    }))
    .pipe(concat('bundle.js'))    // Bundle to a single file
    .pipe(gulp.dest('build/js')); // Output it to our dist folder
});

/* -------------------------
 *  Views task
 * -------------------------
 */
gulp.task('views', function() {
  // Get our index.html
  gulp.src('app/index.html')
    // And put it in the dist folder
    .pipe(gulp.dest('build/'))
    .pipe(refresh(lrserver));

  // Any other view files from app/views
  gulp.src('app/views/**/*')
    // Will be put in the dist/views folder
    .pipe(gulp.dest('build/views/'))
    .pipe(refresh(lrserver));
});

/* =========================
 *  Watch task
 * =========================
 */
gulp.task('watch', ['lint'], function() {
  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);
  // Watch our sass files
  gulp.watch(['app/styles/**/*.scss'], [
    'styles'
  ]);

  gulp.watch(['app/**/*.html'], [
    'views'
  ]);
});