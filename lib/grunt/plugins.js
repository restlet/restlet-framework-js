var build = require('./build.js');
var util = require('./utils.js');

module.exports = function(grunt) {

  grunt.registerMultiTask('build', 'build JS files for distributions', function(){
    build.buildDistFiles.call(build, this.target, this.data, this.async());
  });

  grunt.registerMultiTask('min', 'minify JS files', function(){
    util.min.call(util, this.data, this.async());
  });
};
