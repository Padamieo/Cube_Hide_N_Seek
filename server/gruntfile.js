module.exports = function(grunt){
	
    var pkg = grunt.file.readJSON('package.json');
	
	grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	uglify: {
		options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		build: {
			src: 'src/**/*.js',
			dest: 'build/app.min.js'
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
			files:[
				{
				cwd: 'src/',
				src: ['**', '!*/*.js', '!**/*.jpg'],
				dest: 'build/',
				nonull: false,
				expand: true,
				flatten: false,
				filter: 'isFile',
				},
			]
		}
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
    open: {
      all: {
        path: 'http://<%= connect.run.options.hostname%>:<%= connect.run.options.port%>'
      }
    },
	watch: {
		options: {
			livereload: true,
		},
		index:{
			files: ['src/**'],
			tasks: ['copy', 'concat'],
			options:{
				livereload: 35729
			}
		}
	}
	});
  
	// Load the grunt tasks
	//grunt.loadNpmTasks('grunt-browserify'); // not using this
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-open');
	
	// our default task, others will come later
	grunt.registerTask('default', ['uglify', 'copy', 'open', 'connect:run']);
	grunt.registerTask('dev', ['concat', 'copy', 'open', 'connect:dev', 'watch']);
  
};