'use strict'
module.exports = javascript

let assign = require('lodash').assign
	, browserify = require('browserify')
	, babelify = require('babelify')
	, buffer = require('vinyl-buffer')
	, gulp = require('gulp')
	, gutil = require('gulp-util')
	, source = require('vinyl-source-stream')
	, uglify = require('gulp-uglify')
	, watchify = require('watchify')

function javascript (src, dest, opts) {

	opts = assign({
		minify: false,
		filename: 'bundle.js',
		callback: function () {}
	}, opts)
	opts['debug'] = !opts['minify']

	let bundler = watchify(browserify(src, opts))
		.on('update', bundle)
		.on('time', function (time) {})
		.on('bytes', function(bytes){})
		.on('log', function (msg){})

	bundle()

	function bundle() {

		bundler = bundler.transform(babelify).bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.pipe(source(opts.filename))

		if(opts.minify) bundler = bundler.pipe(buffer()).pipe(uglify())

		bundler.pipe(gulp.dest(dest))
			.on('finish', opts.callback)
	}

}
