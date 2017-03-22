'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    mocha_istanbul: {
      coverage: {
        src: [
          'test/**/*.js', 'src/**/*.js',
        ],
        options: {
          mask: '*.js'
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*',
          check: {
            lines: 70,
            statements: 70
          }
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
        ignores: ['src/node_modules/**'],
        esversion: 6,
        node: true,
        mocha: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['jshint', 'mocha_istanbul:coverage', 'istanbul_check_coverage']);

};