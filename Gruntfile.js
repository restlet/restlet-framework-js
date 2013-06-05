module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadTasks('lib/grunt');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: ['build']
    },
    mkdir: {
      nodejs: {
        options: {
          create: ['build/nodejs/lib']
        }
      },
      browser: {
        options: {
          create: ['build/browser']
        }
      }
    },
    build: {
      nodejs: {
        dest: 'build/nodejs/',
   	    src: ['templates/nodejs/index.js',
   	          'templates/nodejs/commons.js',
   	          'templates/nodejs/restlet-core.js',
   	          'templates/nodejs/restlet-data.js',
   	          'templates/nodejs/restlet-representation.js',
   	          'templates/nodejs/restlet-resource.js',
   	          'templates/nodejs/restlet-util.js'],
   	    baseSrc: 'src/',
   	    translateClasses: true
  	  },
   	  browserSmallest: {
        dest: 'build/browser/',
        src: ['templates/browser/restlet-browser-smallest.js'],
        baseSrc: 'src/',
        singleFile: true,
        translateClasses: false
   	  },
   	  browserSmall: {
        dest: 'build/browser/',
        src: ['templates/browser/restlet-browser-small.js'],
        baseSrc: 'src/',
        singleFile: true,
        translateClasses: false
   	  },
   	  browserMedium: {
        dest: 'build/browser/',
        src: ['templates/browser/restlet-browser-medium.js'],
        baseSrc: 'src/',
        singleFile: true,
        translateClasses: false
   	  },
   	  browserMaximum: {
        dest: 'build/browser/',
        src: ['templates/browser/restlet-browser-maximum.js'],
        baseSrc: 'src/',
   	    singleFile: true,
        translateClasses: false
      }
	},
	min: {
      browserSmallest: 'build/browser/restlet-browser-smallest.js',
      browserSmall: 'build/browser/restlet-browser-small.js',
      browserMedium: 'build/browser/restlet-browser-medium.js',
      browserMaximum: 'build/browser/restlet-browser-maximum.js',
	},
    nodeunit: {
      nodejs: ['test/commons/**/*_test.js','test/nodejs/**/*_test.js']
    }
  });

  // Default task(s).
  grunt.registerTask('package', ['clean','mkdir','build','min']);
  grunt.registerTask('package:nodejs', ['clean','mkdir:nodejs','build:nodejs']);
  grunt.registerTask('package:browser', ['clean','mkdir:browser',
                                         'build:browserMaximum','min:browserMaximum',
                                         'build:browserMedium','min:browserMedium',
                                         'build:browserSmall','min:browserSmall',
                                         'build:browserSmallest','min:browserSmallest']);
  grunt.registerTask('test', ['nodeunit']);
  grunt.registerTask('test:nodejs', ['nodeunit']);
  grunt.registerTask('default', ['package','test']);
};