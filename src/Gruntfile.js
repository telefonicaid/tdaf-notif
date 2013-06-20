'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkgFile: 'package.json',
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js',
        options: {
          jshintrc: '.jshintrc'
        }
      },
      lib: {
        src: ['lib/**/*.js'],
        options: {
          jshintrc: 'lib/.jshintrc'
        }
      },
      test: {
        src: ['test/**/*.js'],
        options: {
          jshintrc: 'test/.jshintrc'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'test']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'test']
      }
    },

    simplemocha: {
      options: {
        ui: 'bdd',
        reporter: 'spec',
        timeout: '0'
      },
      unit: {
        src: [
          'tools/mocha-globals.js',
          'test/unit/**/*.js'
        ]
      }
    },

    githubPages: {
      target: {
          options: {
              commitMessage: 'UPDATE Doc'
          },
          src: 'site'
      }
    },

    exec: {
      istanbul: {
        cmd: 'node ./node_modules/.bin/istanbul cover --root lib/ --dir site/coverage -- grunt test  &&  ' +
             'node ./node_modules/.bin/istanbul report --dir site/coverage/ cobertura'
      },
      doxfoundation: {
        cmd: 'node ./node_modules/.bin/dox-foundation --source lib --target doc;rm -fR site/doc/;mv doc site/'
      },
      githubPagesInit: {
        cmd: 'bash tools/github-pages.sh'
      },
      platoMove: {
        cmd: 'mv report site/'
      }
    },

    plato: {
      options: {
        jshint : grunt.file.readJSON('.jshintrc')
      },
      lib: {
        files: {
          'report': '<%= jshint.lib.src %>'
        }
      }
    },

    gjslint: {
      options: {
        reporter: {
          name: 'console'
        },
        flags: [
          '--flagfile .gjslintrc' //use flag file'
        ],
        force: false
      },
      lib: {
        src: '<%= jshint.lib.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-github-pages');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-gjslint');

  grunt.loadTasks ('tools/tasks');

  grunt.registerTask('test', ['simplemocha']);

  grunt.registerTask('init-dev-env', ['hook:pre-commit']);

  grunt.registerTask('init-pages', ['exec:githubPagesInit']);

  grunt.registerTask('coverage', ['exec:istanbul']);

  grunt.registerTask('complexity', ['plato', 'exec:platoMove']);

  grunt.registerTask('doc', ['exec:doxfoundation']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);

  grunt.registerTask('site', ['exec:doxfoundation', 'exec:istanbul', 'plato', 'exec:platoMove', 'githubPages:target']);
};
