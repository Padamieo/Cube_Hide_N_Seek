module.exports = function(grunt){

    var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
  uglify:{
    options:{
      banner: '/*<%= pkg.name %> V<%= pkg.version %> made on <%= grunt.template.today("yyyy-mm-dd") %>*/\r',
      mangle: true,
      beautify: false
    },
    nodeapp:{
      files:{
        'build/app.min.js': [
          'src/js/**.js'
        ]
      }
    },
    serve:{
      files:{
        'build/serve/app.js': [
          'src/serve/app.js'
        ]
      }
    },
    client_world:{
      files:{
        'build/serve/js/client_world.js': [
          'src/serve/js/client_world.js'
        ]
      }
    },
    server_world:{
      files:{
        'build/serve/js/server_world.js': [
          'src/serve/js/server_world.js'
        ]
      }
    }
  },
	concat: {
		options: {
			stripBanners: true,
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		dist: {
			src: 'src/**/*.js',
			dest: 'build/app.min.js'
		}
	},
	copy: {
		build:{
			files:[{
				cwd: 'src/',
				src: ['**', '!**/*.js', '!**/*.jpg', '!**/*.css'],
				dest: 'build/',
				nonull: false,
				expand: true,
				flatten: false,
				filter: 'isFile',
			},]
		},
    lib:{
      files:[{
				cwd: 'bower_components/',
				src: [
          'threejs/build/three.js',
          'threejs/examples/js/renderers/Projector.js',
        ],
				dest: 'build/serve/js/lib/',
				nonull: false,
				expand: true,
				flatten: true,
				filter: 'isFile',
			},]
    },
    node:{
      files:[{
				cwd: 'node_modules/',
				src: [
          'express/**',
          'three/**',
          'socket.io/**'
        ],
				dest: 'build/serve/node_modules/',
				nonull: false,
				expand: true,
				flatten: false,
				filter: 'isFile',
			},]
    },
	},
    connect: {
      run: {
        options:{
          livereload: true,
          port: 88,
          base: './build',
          hostname: "localhost",
          keepalive: true
        }
      },
      dev:{
        options:{
          livereload: true,
          port: 88,
          base: './build',
          hostname: "localhost",
          keepalive: false
        }
      }
    },
    watch:{
      options: {
        livereload: true,
      },
      css:{
        files: ['src/**.css', 'src/css/**.css'],
        tasks: ['cssmin'],
      },
      js:{
        files: ['src/**.js'],
        tasks: ['uglify:nodeapp','uglify:serve','uglify:client_world','uglify:server_world'],
      },
      html:{
        files: ['src/**.html'],
        tasks: ['copy:build','copy:lib','copy:node'],
      }
    },
		cssmin:{
			minify:{
				expand: true,
				cwd: 'src/css/',
				src: ['**/*.css'],
				dest: 'build/css/',
				ext: '.css',
			}
		},
    open: {
      all: {
        path: 'http://<%= connect.run.options.hostname%>:<%= connect.run.options.port%>',
        app: 'Chrome'
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : 'build/scripts.js'
        },
        options: {
          server: {
            baseDir: "build"
          },
          baseDir: "./build",
          watchTask: true
        }
      }
    }
	});

	// Load the grunt tasks
	//grunt.loadNpmTasks('grunt-browserify'); // not using this
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect'); // not sure we need this
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat'); // not sure we need this
	grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browser-sync');

	// our default task, others will come later
	grunt.registerTask('default', [
    'uglify:nodeapp',
    'uglify:serve',
    'uglify:client_world',
    'uglify:server_world',
    'cssmin',
    'copy:build',
    'copy:lib',
    'copy:node',
    'open',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('build', [
    'uglify:nodeapp',
    'uglify:serve',
    'uglify:client_world',
    'uglify:server_world',
    'cssmin',
    'copy:build',
    'copy:lib',
    'copy:node'
  ]);

  grunt.registerTask('do', ['copy:node']);

};
