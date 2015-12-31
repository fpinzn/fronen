'use strict'
/* global describe, before, it, arguments */

require('mocha')

let assert = require('assert')
let del = require('del')
let fs = require('fs')
let JS = require('../javascript')
let intercept = require('intercept-stdout')
let path = require('path')
let through = require('through2')

function srcPath (filename) {
  return path.join(__dirname, 'fixtures', filename)
}

function destFilePath (filename) {
  return path.join(__dirname, 'temp', filename)
}

describe('javascript building process', function (done) {
  this.timeout(0)

  let destPath = path.join(__dirname, 'temp')

  function assertMatchRegexInFileContents (regex, file, ddone, msg) {
    return function () {
      assert(regex.test(fs.readFileSync(file)), msg)
      ddone()
    }
  }

  before(function (done) {
    del(destPath).then(function () {
      done()
    })
  })

  it('receives 3 params (src glob, dest, opts)', function (done) {
    assert(JS.build.length === 3)
    done()
  })

  it('keeps the modules defined in source in the bundle', function (done) {
    let check = assertMatchRegexInFileContents(/testString/, destFilePath('module.js'), done)
    JS.build(srcPath('module.js'), destPath, {callback: check, filename: 'module.js'})
  })

  it('parses ec2015 syntax', function (done) {
    let check = assertMatchRegexInFileContents(/ec2015/, destFilePath('ec2015.js'), done)
    JS.build(srcPath('ec2015.js'), destPath, {callback: check, filename: 'ec2015.js'})
  })

  it('parses jsx files', function (done) {
    let check = assertMatchRegexInFileContents(/react/, destFilePath('react.js'), done)
    JS.build(srcPath('react.jsx'), destPath, {callback: check, filename: 'react.js'})
  })

  it('generates sourcemaps by default', function (done) {
    let check = assertMatchRegexInFileContents(/sourceMappingURL/, destFilePath('sourceMaps.js'), done)
    JS.build(srcPath('react.jsx'), destPath, {callback: check, filename: 'sourceMaps.js'})
  })

  it('doesnt generates sourcemaps when minified', function (done) {
    function noMatchCheck (msg) {
      assert(!/sourceMappingURL/.test(fs.readFileSync(destFilePath('react.min.js'))), msg)
      done()
    }
    JS.build(srcPath('react.jsx'), destPath, {minify: true, callback: noMatchCheck, filename: 'react.min.js'})
  })
})

describe('javascript linting process', function (done) {
  it('writes linting errors and warnings to stdout ', function (done) {
    let stdoutput = ''
    let unhook_intercept = intercept(function (txt) {
      stdoutput += txt
      return ''
    })
    // read warnings from stdout?
    JS.lint(srcPath('nonstandard.js')).on('finish', function () {
      assert(/error/.test(stdoutput))
      unhook_intercept()
      done()
    })
  })

  it('catches styling errors while using a custom reporter', function (done) {
    let reporter = through.obj(function (obj, enc, cb) {
      assert(obj.standard.results[0].errorCount > 0)
      done()
    })
    JS.lint(srcPath('nonstandard.js'), {reporter: reporter})
  })
})
