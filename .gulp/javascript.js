'use strict'
let JavaScript = {}
module.exports = JavaScript

let assign = require('lodash').assign
let browserify = require('browserify')
let babelify = require('babelify')
let buffer = require('vinyl-buffer')
let gulp = require('gulp')
let gutil = require('gulp-util')
let source = require('vinyl-source-stream')
let standard = require('gulp-standard')
let uglify = require('gulp-uglify')
let watchify = require('watchify')

JavaScript.build = function (src, dest, opts) {
  opts = assign({
    minify: false,
    filename: 'bundle.js',
    callback: function () {}
  }, opts)
  opts['debug'] = !opts['minify']

  let bundler = watchify(browserify(src, opts))
  .on('update', bundle)
  .on('time', function (time) {})
  .on('bytes', function (bytes) {})
  .on('log', function (msg) {})

  bundle()

  function bundle () {
    bundler = bundler.transform(babelify).bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(opts.filename))

    if (opts.minify) bundler = bundler.pipe(buffer()).pipe(uglify())

    bundler.pipe(gulp.dest(dest))
    .on('finish', opts.callback)
  }

  return bundler
}

JavaScript.lint = function (srcGlob, opts) {
  opts = assign({
    breakOnError: false,
    breakOnWarning: false
  }, opts)
  return gulp.src(srcGlob).pipe(standard()).pipe(standard.reporter('default', opts))
}
