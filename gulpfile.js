var gulp = require('gulp')
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')
var autoprefixer = require('gulp-autoprefixer')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var stylus = require('gulp-stylus')
var jeet = require('jeet')
var server = require('pushstate-server')
var through2 = require('through2')
var del = require('del')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var assign = require('lodash').assign
var Karma = require('karma').Server

gulp.task('server', function() {
	server.start({port: 3000, directory: './dist'})
})


gulp.task('styles', function(){
  gulp.src(['src/styles/main.styl'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message)
        this.emit('end')
    }}))
    .pipe(stylus({use: [jeet()]}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/'))
})

/*
* Extracted from https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
*/

// add custom browserify options here
var customOpts = {
  entries: ['./src/scripts/main.js'],
  debug: true
}
var opts = assign({}, watchify.args, customOpts)
var b = watchify(browserify(opts))

// add transformations here
// i.e. b.transform(coffeeify)

gulp.task('js', bundle) // so you can run `gulp js` to build the file
b.on('update', bundle) // on any dep update, runs the bundler
b.on('log', gutil.log) // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
}

gulp.task('copy-statics', function(){
  gulp.src('src/index.html').pipe(gulp.dest('dist'))
  gulp.src(['src/assets/*', 'src/assets/**/*']).pipe(gulp.dest('dist/assets'))
})

gulp.task('clean', function(){
  del('dist')
})

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
	new Karma({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Karma({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build', ['clean', 'styles', 'js', 'copy-statics'])

gulp.task('default', ['build', 'server', 'tdd'], function(){
  gulp.watch(["src/styles/*.styl", "src/styles/**/*.styl"], ['styles'])
  gulp.watch(["src/scripts/*.js", "src/scripts/**/*.js"], ['js'])
  gulp.watch(["src/assets/*", "src/assets/**/*", "src/index.html"], ['copy-statics'])
})
