'use strict'

var gulp = require('gulp')

const LIB = './lib'
const DIST = './dist'

var javascript_dev = require('./.gulp/javascript.js').build(LIB, DIST)
var javascript_dist = require('./.gulp/javascript.js').build(LIB, DIST, {minify: true})

console.log(javascript_dev, javascript_dist)

gulp.task('js', javascript_dev)
