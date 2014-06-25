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
			 * assets 为静态文件的目录，存放编译打包后的js&css
			 */
			sea: {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['sea.js', 'seajs-style/**'],
					dest : 'assets'
				}]
			},
			$ : { // jQuery 默认请求sea-modules下的 $
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['$.js'],
					dest : 'assets'
				}]
			},
			cp_araleModule: {
				files : [{
					expand : true,
					cwd : 'sea-modules/',
					src : ['arale/**', 'alipay/**', 'gallery/**'],
					dest : 'assets'
				}]
			},
			arale : { // 为了避免解析依赖模块错误，需要事先将依赖的组件模块cp到项目根目录下
				files : [{
					expand : true,
					cwd : 'sea-modules/',
					src : ['arale/**', 'alipay/**', 'gallery/**'],
					dest : '.'
				}]
			},
			// 自定义插件，放在公共目录下面
			select : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['select/1.0.0/*'],
					dest : 'assets'
				}]
			},
			money : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['money/1.0.0/*'],
					dest : 'assets'
				}]
			},
			tinyscrollbar: {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['tinyscrollbar/1.0.0/*'],
					dest : 'assets'
				}]
			},
			accountswitcher:  {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['accountswitcher/1.0.3/*'],
					dest : 'assets'
				}]
			},
			mockAsyn: {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['mockAsyn/1.0.0/*'],
					dest : 'assets'
				}]
			},
			cellula : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['cellula/0.4.1/*.js'],
					dest : 'assets'
				}]
			},
			fdp : {
				files : [{
					expand : true,
					cwd : 'lib/',
					src : ['fdp/1.0.0/*.js'],
					dest : 'assets'
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
				paths : ['assets']
			},
			select : {
				options : {
					idleading : 'select/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/select/1.0.0',
					src : '*.js',
					dest : 'assets/select/1.0.0'
				}]
			},
			money : {
				options : {
					idleading : 'money/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/money/1.0.0',
					src : '*.js',
					dest : 'assets/money/1.0.0'
				}]
			},
			tinyscrollbar: {
				options : {
					idleading : 'tinyscrollbar/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/tinyscrollbar/1.0.0',
					src : '*.js',
					dest : 'assets/tinyscrollbar/1.0.0'
				}]
			},
			accountswitcher: {
				options : {
					idleading : 'accountswitcher/1.0.3/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/accountswitcher/1.0.3',
					src : '*.js',
					dest : 'assets/accountswitcher/1.0.3'
				}]
			},
			cellula : {
				options : {
					idleading : 'cellula/0.4.1/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/cellula/0.4.1',
					src : '*.js',
					dest : 'assets/cellula/0.4.1'
				}]
			},
			fdp : {
				options : {
					idleading : 'fdp/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/fdp/1.0.0',
					src : '*.js',
					dest : 'assets/fdp/1.0.0'
				}]
			},
			mockAsyn: {
				options : {
					idleading : 'mockAsyn/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'lib/mockAsyn/1.0.0',
					src : '*.js',
					dest : 'assets/mockAsyn/1.0.0'
				}]
			},
			itemList : {
				options : {
					idleading : 'itemList/0.1.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/itemList/0.1.0',
					src : '*.js',
					dest : 'assets/itemList/0.1.0'
				}]
			},
			singleForm : {
				options : {
					idleading : 'singleForm/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/singleForm/1.0.0',
					src : '*.js',
					dest : 'assets/singleForm/1.0.0'
				}]
			},
			searchingScene : {
				options : {
					idleading : 'searchingScene/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/searchingScene/1.0.0',
					src : '*.js',
					dest : 'assets/searchingScene/1.0.0'
				}]
			},
			bpToBankcard: {
				options : {
					idleading : 'bizfundprod/bpToBankcard/1.0.0/'
				},
				files : [{
					expand : true,
					filter : 'isFile',
					cwd : 'static/js/bizfundprod/bpToBankcard/1.0.0',
					src : '*.js',
					dest : 'assets/bizfundprod/bpToBankcard/1.0.0'
				}]
			}
		},
		cssmin: {
	         options: {
	         	//keepSpecialComments: 0
	         },
	         compress: {
	             files: {
	                 'assets/enterpriseportal/enterprise/1.0.0/enterprise.css': ['static/css/enterpriseportal/base/1.0.0/*.css', 'static/css/patch/1.0.0/*.css', 'static/css/enterpriseportal/enterprise/1.0.0/*.css'],
	                 'assets/bizfundprod/bf/1.0.0/bf.css': ['static/css/bizfundprod/bf/1.0.0/*.css', 'static/css/bizfundprod/bp/1.0.0/*.css']
	             }
	         }
     	},
		concat : {
			options : {
				paths : ['.']
			},
			cellula: {
				files : {
					'assets/cellula/0.4.1/cellula.js': ['assets/cellula/0.4.1/*.js']
				}
			},
			fdp : {
				files : {
					'assets/fdp/1.0.0/fdp.js': ['assets/fdp/1.0.0/*.js']
				}
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
			temp : ['arale', 'alipay', 'gallery']
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
		'copy', 
		'transport', 
		'concat',
		'cssmin', 
		'clean'
	]);

};
