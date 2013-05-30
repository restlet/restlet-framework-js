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
   	    baseSrc: 'src/'
  	  }/*,
   	  browserSmallest: {
   	    	  
   	  },
   	  browserSmall: {
   	   	  
   	  },
   	  browserMedium: {
   	    	  
   	  },
   	  browserMaximum: {
   	    	  
   	  }*/
	},
    /*copy: {
      nodejs: {
        files: [
          { src: 'templates/nodejs/index.js', dest: 'build/nodejs/', expand: true, flatten: true }
        ]
      }
    },*/
    nodeunit: {
      nodejs: ['test/commons/**/*_test.js','test/nodejs/**/*_test.js']
    }
  });

  // Default task(s).
  grunt.registerTask('package', ['clean','mkdir','build']);
  grunt.registerTask('test', ['nodeunit']);
  grunt.registerTask('default', ['package','test']);
};