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

/**
* Build the files from `src` to the folder `dest` given the `opts` options
*
* @arg src {String | Array<Strings> } Browserify input glob. NOT a standard gulp input glob.
* @arg dest {String} path to the folder to compile the sources to.
* @arg opts {Object} options object that both configures this pipeline and is passed into browserify.
* @arg opts.minify {boolean} [false] pass true if the code is to be uglified. For production only.
* @arg opt.filename {string} [bundle.js] The name of the file to compiled the source into.
* @arg opt.callback {function} function to be called back when the bundling is done.
*/
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
/**
* Lints the files from `srcGlob` using the standard style.
*
* @arg {Array | String} srcGlob: Gulp glob of the files to be linted.
* @arg {Object} opts: Option file, all arguments optional.
* @arg opts.reporter {WriteableStream, Reporter} Writeable Object Stream to pipe the results of the lint into.
* @arg opts.breakOnError {boolean}
* @arg opts.breakOnWarning {boolean}
*/
JavaScript.lint = function (srcGlob, opts) {
  opts = assign({
    breakOnError: false,
    breakOnWarning: false
  }, opts)
  opts['reporter'] = opts['reporter'] || standard.reporter('default', opts)

  return gulp.src(srcGlob).pipe(standard()).pipe(opts['reporter'])
}
