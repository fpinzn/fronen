'use strict'

require('mocha')

let assert = require('assert')
	, del = require('del')
	, fs = require('fs')
	, javascript = require('../javascript')
	, path = require('path')


describe('javascript building process', function (done) {
	this.timeout(0)

	let destPath = path.join(__dirname, 'temp')

	function srcPath (filename) {
		return path.join(__dirname, 'fixtures', filename)
	}

	function destFilePath (filename) {
		return path.join(__dirname, 'temp', filename)
	}

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
		assert(javascript.length == 3)
		done()
	})

	it('keeps the modules defined in source in the bundle', function (done) {

		let check = assertMatchRegexInFileContents(/testString/, destFilePath('module.js'), done)
		javascript(srcPath('module.js'), destPath, {callback: check, filename: 'module.js'})
	})

	it('parses ec2015 syntax', function (done) {

		let check = assertMatchRegexInFileContents(/ec2015/, destFilePath('ec2015.js'), done)
		javascript(srcPath('ec2015.js'), destPath, {callback: check, filename: 'ec2015.js'})
	})

	it('parses jsx files', function (done) {

		let check = assertMatchRegexInFileContents(/react/, destFilePath('react.js'), done)
		javascript(srcPath('react.jsx'), destPath, {callback: check, filename: 'react.js'})
	})

	it('generates sourcemaps by default', function (done) {
		let check = assertMatchRegexInFileContents(/sourceMappingURL/, destFilePath('sourceMaps.js'), done)
		javascript(srcPath('react.jsx'), destPath, {callback: check, filename: 'sourceMaps.js'})
	})

	it('doesnt generates sourcemaps when minified', function (done) {
		function noMatchCheck (msg) {
			assert(!/sourceMappingURL/.test(fs.readFileSync(destFilePath('react.min.js'))), msg)
			done()
		}
		javascript(srcPath('react.jsx'), destPath, {minify: true, callback: noMatchCheck, filename: 'react.min.js'})
	})
})