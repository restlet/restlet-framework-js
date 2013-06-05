var grunt = require('grunt');
var util = require("./utils.js");

module.exports = {

  buildDistFiles: function(target, config, fn){
	var currentThis = this;
    var files = grunt.file.expand(config.src);
    util.each(files, function(filepath) {
    	var filename = util.getFilename(filepath);
        var classModules = {};
        //grunt.log.writeln('Handling file ' + filename + ' for distribution ' + target + '...');
    	var src = grunt.file.read(filepath);
    	var currentModuleName = util.getModuleNameFromFilename(filename);
    	src = currentThis.evaluateTemplateFile(target, src, config.baseSrc,
    			currentModuleName, classModules,
    			config.translateClasses);
    	if (config.singleFile) {
          grunt.file.write(config.dest + filename, src);
          grunt.log.ok('File ' + config.dest + filename + ' created.');
    	} else {
    	  if (filename == 'index.js') {
            grunt.file.write(config.dest + filename, src);
    	  } else {
            grunt.file.write(config.dest + 'lib/' + filename, src);
    	  }
          grunt.log.ok('File ' + config.dest + 'lib/' + filename + ' created.');
    	}
    });
    grunt.log.write('Distribution ' + target + ' created.').ok();
    fn();
  },
  
  evaluateTemplateFile: function(target, src, baseSrc, currentModuleName, classModules, translateClasses) {
    var currentThis = this;
    var lines = src.split(grunt.util.normalizelf('\n'));
    var newLines = [];
    var specifiedModuleNames = [];
    // Handling lines
    util.each(lines, function(line) {
      if (util.isIncludeLine(line)) {
        var includeFilepath = util.getIncludeFilepath(line);
        var includeContent = grunt.file.read((util.isCommonClassForFilepath(includeFilepath)?'commons':'src') + '/' + includeFilepath);
        includeContent = currentThis.cleanJavaScriptContent(target, includeContent, currentModuleName, classModules, baseSrc, translateClasses);
        newLines.push(includeContent);
      } else if (util.isRequireIncludeLine(line)) {
        var moduleName = util.getIncludeModuleName(line);
        newLines.push('var '+moduleName+' = require("./restlet-'+moduleName+'.js");');
        specifiedModuleNames.push(moduleName);
      } else {
        newLines.push(line);
      }
    });
    // Adding initial includes
    var usedModules = util.getUsedModules(classModules, specifiedModuleNames);
    if (usedModules.length>0) {
      newLines.unshift('');
    }
    util.each(usedModules, function(moduleName) {
      newLines.unshift('var '+moduleName+' = require("./restlet-'+moduleName+'.js");');
    });
    return newLines.join(grunt.util.normalizelf('\n'));
  },
  
  cleanJavaScriptContent: function(target, src, currentModuleName, classModules, baseSrc, translateClasses) {
    /*
     * // [ifndef nodejs]
     * // [ifdef nodejs] uncomment
     * // [enddef]
     */
	var lines = src.split(grunt.util.normalizelf('\n'));
	var newLines = [];
	var skipLines = false;
	var uncomment = false;
    util.each(lines, function(line) {
      if (util.isIfndef(line)) {
        var ifndefTarget = util.getDistNameFromIfndef(line);
        if (util.isTargetsMatch(ifndefTarget,target)) {
          skipLines = true;
        }
      } else if (util.isIfdef(line)) {
        var ifdefTarget = util.getDistNameFromIfdef(line);
        if (util.isTargetsMatch(ifdefTarget,target)) {
          uncomment = true;
        }
      } else if (util.isEnddef(line)) {
        skipLines = false;
        uncomment = false;
      } else if (!skipLines) {
        line = util.handleClassPattern(line, currentModuleName, classModules, baseSrc, translateClasses); 
        if (!uncomment) {
          newLines.push(line);
        } else {
          newLines.push(util.uncommentLine(line));
        }
      }
    });
    return newLines.join(grunt.util.normalizelf('\n'));
  }
};