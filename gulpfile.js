// Credit: http://una.im/gulp-local-psi/
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	concatify = require('gulp-concat'),
	minifycss = require('gulp-minify-css'),
	minifyhtml = require('gulp-minify-html'),
	imageop = require('gulp-image-optimization'),
	jshint = require('gulp-jshint'),
	ngrok = require('ngrok'),
	psi = require('psi'),
	sequence = require('run-sequence'),
	site = '',
	portVal = 8080;

var site = 'http://karoldavid.github.io/neighborhood-map/',
    key = 'AIzaSyAx61HO_UHNS9T1Nc_22Bs5PZE9pMI85to'; // page speed insights api token

// Paths to files
var paths = {
    scripts: ['js/data/*.js','js/app/*.js','js/function/*.js'],
    stylesheets: ['css/*.css', 'css/fonts/stylesheet.css', 'css/fonts/specimen_files/specimen_stylesheet.css'],
    images: ['img/**/*'],
    icons: ['src/img/icons/*.svg'],
    content: ['index_dev.html']
};

gulp.task('watch', function(){
	gulp.watch('js/*.js', ['scripts']);
	gulp.watch('css/**/*.css', ['styles']);
});

// Concats & minifies JavaScript files and outputs them to build/js/app.min.js
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .on('error', function(err){
        console.log(err);
        })
        .pipe(concatify('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js/'));
});

// Compiles css files and outputs them to build/css/
gulp.task('styles', function() {
    return gulp.src(paths.stylesheets)
                .pipe(minifycss())
                .pipe(concatify('style.min.css'))
                .pipe(gulp.dest('./build/css'));
});

// Minifies HTML file and outputs to build/*.html
gulp.task('content', function() {
    return gulp.src(paths.content)
        .pipe(rename("index.html"))
        .pipe(minifyhtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('.'));
});

// Optimizes image files and outputs them to build/image/*
gulp.task('images', function() {
    return gulp.src(paths.images)
                .pipe(imageop({
                    optimizationLevel: 5
                }))
                .pipe(gulp.dest('./build/image'));
});

// Lints app.js and outputs to beautified to console
gulp.task('lint', function() {
  return gulp.src('js/app/app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mobile', function () {
    return psi(site, {
        key: key,
        //nokey: 'true',
        strategy: 'mobile',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

gulp.task('desktop', function () {
    return psi(site, {
        //nokey: 'true',
        key: key,
        strategy: 'desktop',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});

gulp.task('browser-sync-psi', function() {
  browserSync({
    port: portVal,
    open: false,
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('psi-seq', function (cb) {
  return sequence(
    'browser-sync', // name of your server task here
    'ngrok-url',
    'desktop',
    'mobile',
    cb
  );
});

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(8080, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

// PSI sequence with 'browser-sync-psi'
gulp.task('psi-seq', function (cb) {
  return sequence(
    'browser-sync-psi',
    'ngrok-url',
    'desktop',
    'mobile',
    cb
  );
});

gulp.task('psi', ['psi-seq'], function() {
  console.log('Page Speed Insights Results:')
  process.exit();
})

// Watches for changes to files and executes scripts
gulp.task('script-watch', ['scripts']);
gulp.task('scss-watch', ['styles']);
gulp.task('content-watch', ['svgstore','content']);
gulp.task('image-watch', ['images', 'svgstore']);

// Executes all scripts
gulp.task('default', ['watch', 'scripts', 'styles', 'content', 'images', 'lint', 'mobile', 'desktop']);