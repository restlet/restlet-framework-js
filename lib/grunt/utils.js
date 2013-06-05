var fs = require('fs');
var shell = require('shelljs');
//var shell = require('shelljs');
var grunt = require('grunt');
//var spawn = require('child_process').spawn;

var modules = {
  core: {
    packages: ['org.restlet','org.restlet.engine','org.restlet.engine.adapter',
               'org.restlet.engine.application','org.restlet.engine.component',
               'org.restlet.routing','org.restlet.services',
               'org.restlet.engine.headers','org.restlet.engine.util'],
    includes: ['org.restlet.resource.Finder.js']
  },
  data: {
    packages: ['org.restlet.data']
  },
  representation: {
    packages: ['org.restlet.representation']
  },
  resource: {
    packages: ['org.restlet.resource','org.restlet.engine.resource'],
    excludes: ['org.restlet.resource.Finder.js']
  },
  util: {
    packages: ['org.restlet.util']
	//util.includes=org.restlet.engine.headers.HeaderConstants
  }
};

module.exports = {
  each: function(array, fn){
    for (var i=0; i<array.length; i++){
      fn(array[i]);
    }
  },
  has: function(array, elt){
    for (var i=0; i<array.length; i++){
      if (array[i]==elt){
        return true;
      }
    }
    return false;
  },
  getFilename: function(filepath){
    var tokens = filepath.split('/');
    return tokens[tokens.length-1];
  },
  getModuleNameFromFilename: function(filename){
    if (filename=='commons.js') {
      return 'commons';
    } else if (filename!='index.js'){
   	  return filename.substring('restlet-'.length, filename.length-3);
    } else {
   	  return '';
    }
  },
  startsWith: function(s, pattern){
    return (s.match("^"+pattern)==pattern);
  },
  
  isIncludeLine: function(line) {
    return (/^\#include /.test(line) && /\#$/.test(line));
  },

  isRequireIncludeLine: function(line){
    return (/^\#require-include /.test(line) && /\#$/.test(line));
  },

  getIncludeFilepath: function(line){
    return line.substring('#include '.length, line.length-1);
  },

  getIncludeModuleName: function(line){
    return line.substring('#require-include '.length, line.length-1);
  },

  isIfndef: function(line) {
	// // [ifndef nodejs] 
	return (/^\/\/ \[ifndef /.test(line.trim()) && /\]$/.test(line));
  },

  getDistNameFromIfndef: function(line){
    // // [ifndef nodejs] 
    return line.trim().substring('\/\/ [ifndef '.length, line.trim().length-1);
  },

  isIfdef: function(line) {
    // // [ifdef nodejs] uncomment
    return (/^\/\/ \[ifdef /.test(line.trim()) && /\] uncomment$/.test(line));
  },

  getDistNameFromIfdef: function(line){
    // // [ifndef nodejs] 
    return line.trim().substring('\/\/ \[ifdef '.length, line.trim().length-('] uncomment'.length));
  },

  isEnddef: function(line){
    // // [enddef] 
    return ('\/\/ \[enddef\]'== line.trim());
  },

  uncommentLine: function(line){
    var indentation = line.substring(0, line.indexOf('\/\/'));
    var line = line.substring(line.indexOf('//')+2);
    return indentation + line;
  },

  isTargetsMatch: function(targetList, target){
    var arr = targetList.split(' ');
    for (var i=0; i<arr.length; i++) {
      if (arr[i]==target) {
        return true;
      }
    }
    return false;
  },

  extractClassName: function(s){
    return s.substring('\[class '.length, s.length-1);
  },
  
  isCommonClass: function(className){
    return (className=='Class' || className=='DateFormat' || className=='StringBuilder');
  },

  isCommonClassForFilepath: function(filepath){
    return (/Array.js$/.test(filepath) || /Class.js$/.test(filepath)
  		|| /DateFormat.js$/.test(filepath) || /Number.js$/.test(filepath)
  		|| /String.js$/.test(filepath) || /StringBuilder.js$/.test(filepath));
  },

  getPackageName: function(s){
	var us = s.substring(0, s.length-'.js'.length);
    var index = us.lastIndexOf('.');
    if (index!=-1) {
      return us.substring(0, index);
    } else {
      return '';
    }
  },

  getModuleName: function(fileName, packageName){
	  /*if (fileName.indexOf('.Finder.js')) {
		  console.log('>> Finder');
	  }*/
    for (var elt in modules) {
      var module = modules[elt];
      if (module.excludes!=null && this.has(module.excludes, fileName)){
    	  /*if (fileName.indexOf('.Finder.js')) {
    		  console.log('  >> elt = '+elt+' -> excludesFinder');
    	  }*/
        continue;
      } else if ((module.includes!=null && this.has(module.includes, fileName))
    		  || (module.packages!=null && this.has(module.packages, packageName))){
    	  /*if (fileName.indexOf('.Finder.js')) {
    		  console.log('  >> elt = '+elt+' -> find');
    	  }*/
        return elt;
      }
    }
    return '';
  },
  
  getModuleNameFromFileName: function(fileName) {
    var uFileName = fileName.replace(/\//g, '.');
    var packageName = this.getPackageName(uFileName);
    if (packageName!='') {
      return this.getModuleName(uFileName, packageName);
    } else {
      return '';
    }
  },
  
  handleClassPattern: function(line, currentModuleName, classModules, baseSrc, translateClasses){
    var currentThis = this;
	var matches = line.match(/\[class [a-zA-Z]+\]/g);
    if (matches!=null && matches.length>0) {
      this.each(matches, function(match){
        var className = currentThis.extractClassName(match);
        if (translateClasses) {
          var module = classModules[match];
          if (currentThis.isCommonClass(className)) {
            module = 'commons';
          }
          if (module==null) {
            var files = grunt.file.expand(baseSrc+'**/'+className+'.js');
            if (files!=null && files.length>0) {
              module = currentThis.getModuleNameFromFileName(files[0].substring(baseSrc.length));
              if (module!=null && module!='' && module!=currentModuleName) {
                classModules[className] = module;
              } else {
                classModules[className] = '';
                module = '';
              }
            } else {
              module = '';
            }
          }
          line = line.replace(new RegExp('\\[class '+className+'\\]','g'), module!='' ? module+'.'+className : className);
        } else {
          line = line.replace(new RegExp('\\[class '+className+'\\]','g'), className);
        }
      });
      return line;
    } else {
      return line;
    }
  },

  getUsedModules: function(classModules, specifiedModuleNames){
    var usedModules = {};
    for (var elt in classModules) {
   	  var module = classModules[elt];
      if (module!='' && usedModules[module]==null && !this.has(specifiedModuleNames, module)) {
   		usedModules[module] = '';
   	  }
    }
    var modules = [];
    for (var elt in usedModules) {
   	  modules.push(elt);
    }
    return modules;
  },
  
  java32flags: function(){
    if (process.platform === "win32") return '';
    if (shell.exec('java -version -d32 2>&1', {silent: true}).code !== 0) return '';
    return ' -d32 -client';
  },

  singleStrict: function(src, insert, newline){
    var useStrict = newline ? "$1\n'use strict';" : "$1'use strict';";
    return src
      .replace(/\s*("|')use strict("|');\s*/g, insert) // remove all file-specific strict mode flags
      .replace(/(\(function\([^)]*\)\s*\{)/, useStrict); // add single strict mode flag
  },

  min: function(file, done) {
    var minFile = file.replace(/\.js$/, '.min.js');
    shell.exec(
        'java ' +
            this.java32flags() + ' ' +
            '-jar lib/closure-compiler/compiler.jar ' +
            '--compilation_level SIMPLE_OPTIMIZATIONS ' +
            '--language_in ECMASCRIPT5_STRICT ' +
            '--js ' + file + ' ' +
            '--js_output_file ' + minFile,
      function(code) {
        //console.log('code = '+code);
        if (code !== 0){
          grunt.fail.warn('Error minifying ' + file);
          //console.log(code);
        }
        grunt.file.write(minFile, this.singleStrict(grunt.file.read(minFile), '\n'));
        grunt.log.ok(file + ' minified into ' + minFile);
        done();
    }.bind(this));
  }
};