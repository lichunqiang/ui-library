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
			/*
			move : {
				files : [{
					expand : true,
					cwd : './',
					src : ['enterprise/**'],
					dest : 'sea-modules'
				}]
			},
			*/
			/*
			 * assets 为静态文件的目录，存放编译打包后的js&css
			 */
			$ : { // jQuery 默认请求sea-modules下的 $
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['$.js'],
					dest : 'sea-modules'
				}]
			},
			arale : { // 为了避免解析依赖模块错误，需要事先将依赖的组件模块cp到项目根目录下
				files : [{
					expand : true,
					cwd : 'sea-modules/arale/',
					src : ['dialog/1.2.6/*', 'calendar/1.0.0/*'], // 追加arale组件
					dest : 'arale'
				}]
			},
			// 自定义插件，放在公共目录下面
			select : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['select/1.0.0/*'],
					dest : 'assets/js/common'
				}]
			},
			cellula : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['cellula/0.4.1/*.js'],
					dest : 'assets/js/common'
				}]
			},
			fdp : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['fdp/1.0.0/*.js'],
					dest : 'assets/js/common'
				}]
			}
		},
		transport : {
			options : {
				debug : false,
				alias : '<%= pkg.alias %>',
				parsers : {
					'.js' : [script.jsParser],
					'.css' : [style.css2jsParser]
				},
				paths : ['.']
			},
			select : {
				options : {
					idleading : 'assets/js/common/select/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/select/1.0.0',
					src : '*.js',
					dest : 'assets/js/common/select/1.0.0'
				}]
			},
			cellula : {
				options : {
					idleading : 'assets/js/common/cellula/0.4.1/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/cellula/0.4.1',
					src : '*.js',
					dest : 'assets/js/common/cellula/0.4.1'
				}]
			},
			fdp : {
				options : {
					idleading : 'assets/js/common/fdp/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/fdp/1.0.0',
					src : '*.js',
					dest : 'assets/js/common/fdp/1.0.0'
				}]
			},
			itemList : {
				options : {
					idleading : 'assets/js/itemList/0.1.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/itemList/0.1.0',
					src : '*.js',
					dest : 'assets/js/itemList/0.1.0'
				}]
			},
			singleForm : {
				options : {
					idleading : 'assets/js/singleForm/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/singleForm/1.0.0',
					src : '*.js',
					dest : 'assets/js/singleForm/1.0.0'
				}]
			},
			searchingScene : {
				options : {
					idleading : 'assets/js/searchingScene/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/searchingScene/1.0.0',
					src : '*.js',
					dest : 'assets/js/searchingScene/1.0.0'
				}]
			}
		},
		cssmin: {
	         options: {
	         	//keepSpecialComments: 0
	         },
	         compress: {
	             files: {
	                 'assets/css/common/base/1.0.0/base.css': ['static/css/base/1.0.0/*.css'],
	                 'assets/css/common/enterpriseportal/1.0.0/enterpriseportal.css': ['static/css/enterprise/1.0.0/*.css']
	             }
	         }
     	},
		concat : {
			options : {
				paths : ['.']
			},
			cellula: {
				files : {
					'assets/js/common/cellula/0.4.1/cellula.js': ['assets/js/common/cellula/0.4.1/*.js']
				}
			},
			fdp : {
				files : {
					'assets/js/common/fdp/1.0.0/fdp.js': ['assets/js/common/fdp/1.0.0/*.js']
				}
			},
			itemList: {
			}
		},
		/*
		uglify : {
			options : {
				//banner : '<%= banner %>',
				mangle : false
			},
			all : {
				files : [{
					expand : true,
					cwd : 'build/',
					src : '.js',
					dest : 'build/min'
				}]
			},
		},
		*/
		clean : {
			temp : ['arale', 'alipay', 'gallery', 'enterprise']
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	// Default task.
	grunt.registerTask('enterprise', [
		'copy:$', 
		'copy:arale', 
		'copy:select',
		'copy:cellula',
		'copy:fdp',
		'transport:select', 
		'transport:cellula',
		'transport:fdp',
		'transport:itemList',
		'transport:singleForm',
		'transport:searchingScene',
		'concat',
		'cssmin', 
		'clean'
	]);

};
