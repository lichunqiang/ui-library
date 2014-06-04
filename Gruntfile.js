'use strict';

module.exports = function(grunt) {

	var transport = require('grunt-cmd-transport');
	var style = transport.style.init(grunt);
	var text = transport.style.init(grunt);
	var script = transport.script.init(grunt);

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg : grunt.file.readJSON('package.json'),
		banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		copy : {
			cellula : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['cellula/**'],
					dest : 'dest/'
				}]
			}
		},
		transport : {
			options : {
				alias : '<%= pkg.alias %>',
				parsers : {
					'.js' : [script.jsParser]
				},
				paths : ['.']
			},
			cellula : {
				options : {
					idleading : 'dest/cellula/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/cellula',
					src : '**/*.js',
					dest : 'dest/cellula'
				}]
			},
			cellula_build : {
				options : {
					idleading : 'build/cellula/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/cellula',
					src : '**/cellula.js',
					dest : 'build/cellula'
				}]
			}
		},
		concat : {
			options : {
				paths : ['.'],
				include : 'relative'
				//banner : '<%= banner %>',
				//stripBanners : true
			},
			cellula : {
				options : {
					include : 'all'
				},
				files : [{
					expand : true,
					cwd : 'build/',
					src : ['cellula/**/cellula.js'],
					dest : 'build/',
					ext : '.js'
				}]
			}
		},
		uglify : {
			options : {
				banner : '<%= banner %>',
				mangle: false
			},
			dist : {
				src : 'build/cellula/0.4.1/cellula.js',
				dest : 'build/cellula/0.4.1/<%= pkg.name %>.min.js'
			},
		},
	});
	
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-nodeunit');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['copy', 'transport', 'concat']);

};
