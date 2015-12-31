module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: [ 'browserify', 'jasmine'],
    files: [
      'src/scripts/main.js',
      'test/**/*.spec.js'
	],
	  preprocessors: {
		 'src/scripts/main.js': ['browserify'],
		 'test/**/*.js': [ 'browserify' ]
	   }
  });
};
