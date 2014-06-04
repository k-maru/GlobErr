/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      srcPath: "src/",
      srcFiles: "<%= meta.srcPath %>**/*.ts",
      buildPath: "build/"
    },
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>',
          sourceMap: true
      },
      build: {
          files: {
              '<%= meta.buildPath %>GlobErr.min.js': ['<%= meta.buildPath %>GlobErr.js']
          }
      }
    },
    typescript: {
      build: {
          src: "<%= meta.srcFiles %>",
          dest: "<%= meta.buildPath %>",
          options: {
              basePath: "<%= meta.srcPath %>",
              watch: {
                  path: "<%= meta.srcPath %>",
                  after: ["uglify"]
              },
              sourceMap: true,
              declaration: true,
              noImplicitAny: true,
              disallowAsi: true
          }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-typescript');

  // Default task.
  grunt.registerTask('default', ['typescript']);

};
