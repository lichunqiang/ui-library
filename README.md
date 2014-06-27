## ui library ##

---

由于涉及组件和场景较多，正在陆陆续续更新中...

本地构建环境： `node v0.10.26` | `npm 1.4.3` | `grunt 0.4.5`

**构建方法**
--

1. 将项目克隆到本地：`git clone git@github.com:ar-insect/ui-library.git`

2. 切换到项目根目录下面，比如：`cd ~/enterprise`

3. 执行 `npm install` 安装项目所需要的插件

4. 本地起一个localhost服务，比如访问：`http://localhost/example/singleForm.htm`

5. 本地开发完成后在`gruntfile.js`里面配置部署（依赖配置在`package.json`的`alias`）

6. 在项目的根目录执行 `grunt enterprise` 完成静态文件的编译和打包

7. 最后别忘记在本地测试ok提交代码哦~（提交前先`git fetch origin` `git diff master origin/master` 确认无误后再执行 `git merge origin/master`）

**Q&A**
--

- 问：这套ui-library主要用来完成什么任务？

答：库里面整合了基础视觉样式和交互组件，不依赖于服务器环境和后端，直接下载到本地开发、部署，在本地完成mockdata调试，最后再将代码提交到svn仓库。

- 问：有没有案例可以参考一下呢？

答：新手请先查看 `example` 下面到示例了解基本编码规范，然后再阅读`gruntfile.js`了解静态文件编译打包相关配置。

- 问：如何在项目中安装arale组件呢？

答：假如你需要在项目中使用`arale`的`dialog`组件，则可以进入项目根目录中执行`spm install arale.dialog`就会自动下载组件以及其依赖到`sea-modules`下面，关于组件具体细节可以访问站点`arale.org` （注意：以上操作仅限于在内网中使用），然后在项目中这么引用 `require('arale/dialog/1.2.6/dialog.js')`也可以将组件配置到`package.json`的`alias`，比如'dialog'：'arale/dialog/1.2.6/dialog.js'这样只需要`require('dialog')`就可以了，是不是更加方便了呢^v^

- 问：关于自己开发组件模块的规范是什么呢？

答：现在库里面已经有`cellula` `fdp`之类的公共模块了，理论上我们在开发环境中会涉及到2大类型的模块，一类是公共的模块，也就是可以供不同系统和业务使用的模块，它们通常是`js`底层的类库扩展或者是基于场景模型的构建，比如`cellula` `fdp`之类，它们存放在lib下面，另一类是纯业务型的模块组件，它们存放在`static`下面，而`assets`则是存放系统编译打包后的`js&css`也就是在线上环境被调用的静态文件就在这里。

**本地目录结构**
--

	|-- `assets` 静态文件资源库（存放编译打包后的js&css）
	
			|-- `accountswitcher` 
			
			|-- `alipay`
			
			|-- `arale`
			
			|-- `bizfundprod`
			
			|-- `cellula`
			
			|-- `enterpriseportal`
				
			|-- `fdp` `Form` `dataView` `paginator`
			
			|-- `gallery`
			
			|- `seajs-style`
			
			|-- `itemList` 一个使用`cellula`做的小玩意儿
			
			|-- `select`
			
			|-- `singleForm` 单表单模型
			
			|-- `tinyscrollbar`
			
			|-- ...
			
	|-- `data`
	
	|-- `example` 示例
			
	|-- `htdocs` 
	
		  |-- `bizfundprod`
		  
		  |-- ...
	
	|-- images
	
	|-- `lib` 公共js库
	
	/-- `static` 静态文件
	
	/-- `test` 单元测试
	
	Gruntfile.js 部署脚本
	
	package.js 项目配置

后续优化方案：

- 优化gruntfile，尽量做到配置最简化

## 关于 Cellula ##

----

is building...

## 关于 FDP ##

----

FDP(1.0.0)是一套非常轻量的富客户查询模型，同时它也支持`Single Form`应用场景，内部是基于`cellula v0.4.1`构建，依赖了`jQuery 1.7.2`

具体源码可以参考 lib/fdp

整个模型由`formItem` `form` `table` `paginator`几个模块组成

tips: 

- single Form只使用 form+formItem组合，searchingScene使用form+formItem+table+paginator组合

----------

**FormItem**
每一个表单控件可以是一个formItem，以下构建一个formItem

    var UserName = new Class('UserName', {
				//require: false,
				type: 'input',
				label : '姓名',
				init : function(conf) {
					this._super(conf);
				},
				rule: {
					isString: function() {
						if (!/[\u4e00-\u9fa5]+/.test(this.element.value)) {
							this.errorMessage = this.label + '只能包含中文字符';
							return false;
						}
						return true;
					}
				}
			}).inherits(SearchingScene.FormItem);

@require Boolean ：是否校验，如果设置为`false`则会跳过校验，但是如果非空同时有验证规则还是会进行校验的；

@element Object ：控件原生dom节点，如果是一个组合的控件域，则为一个Dom Array，比如，一个日期时间范围的组合控件，`this.element[0]`则对应第一个控件的对象，`this.element[1]`对应第二个控件的对象，以此类推，每个控件对象的结构如下：

      {
	 	  ele: element, 
	      name: name, 
	      value: value 
	  }

以下给出一个组合控件域的具体实现demo：

    var ApplyDate = new Class('ApplyDate', {
			//require: false,
			type : 'input',
			label : '申请时间',
			startCal : null,
			endCal : null,
			startDateInput : undefined,
			endDateInput : undefined,
			config : {
				calendarRangeStart : (new Date() - 557 * 24 * 3600 * 1000),
				calendarRangeEnd : (new Date())
			},
			init : function(conf) {
				this._super(conf);
				this._bindAll('changeDateRange');
				this.startDateInput = this.element[0]['ele'];
				this.endDateInput = this.element[1]['ele'];
				// default callback today date
				this.startDateInput.value = this.getCurrentDate();
				this.endDateInput.value = this.getCurrentDate();
				//...
				$('a[data-picker]', this.rootNode).on('click', this.changeDateRange);
			},
			changeDateRange : function(e) {
				//...
			},
			getCurrentDate : function() {
				//...
			}
		}).inherits(SearchingScene.FormItem);

@label String ：控件对应的label

@errorMessage String ：自定义报错文案

@type String ：控件的类型，目前支持`input` `select` `radio` `checkbox` `textarea`

@rule Objict ：对象中的每个Func将是一个校验规则，返回`true`|`false`表示校验通过与否

@triggerValidate Function ：手动触发校验

----------

tips: 

- 如果需要对控件绑定其它事件则可以在init构造函数初始化中完成
- formItem对`input`,`textarea`默认绑定了blur，focus事件

**Form**
以下构建一个Form

    var ResumeForm = new Class('ResumeForm', {
		type: 'single', // single Form 
		itemList: null,
		init: function(conf) {
			this._super(conf);
			this.collection = new Coll({ type: SearchingScene.FormItem });
			this.createItem();
		},
		createItem: function() {
			util.each(this.itemList, function(item) {
				// 因为在Form submit之前还需要对coll中的每个formItem进行校验
				this.register('FORMITEM:VALIDATE', item);
				this.collection.push(item);
			}, this);
		},
		// 如果type:'single'则可以重写submit方法
		submit: function(e) {
			e.preventDefault();
			// validate all FormItem...
			this.validate();
			if (this.validateAll) {
				//submit...
				console.log( this.getData() );
			}
		}
	}).inherits(SearchingScene.SearchingForm);

@validateAll Boolean ：`true`|`false` 表示表单校验是否通过

@customSearch Function ：自定义查询接口，在使用searchingScene查询场景时使用，例如：

    		/*
			 * Allow the custom query
			 */
			customSearch: function(data) {
				console.log('request:', data);
				var _self = this;
				this.ajaxLoadingBox.show();
				this.asyn = $.ajax({
					url: '/searchingScene/example/data/reco.php',
					type: 'POST',
					data: data,
					timeout: 10000,
					success: function(resp) {
						console.log('response:', resp);
						if (resp.status == 'succeed') {
							_self.ajaxLoadingBox.hide();
							_self.dataDispatch(resp);
						} else 
							this.emit('FORM:SYSTEMERROR');
					},
					error: function(xhr, stat, error) {
						_self.ajaxLoadingBox.hide();
						this.emit('FORM:SYSTEMERROR');
						window.debug && console.log('error: ', xhr, stat, error);
					}
				});
			}

## Single Form 应用场景 ##

----

is building...

## Searching Form 应用场景 ##

----

is building...


如有问题或建议请 mail: ar.insect@gmail.com


欢迎加入讨论

    ECMAScrpt群： 162605336

    NodeJs群： 206317938

    HTML5群：6330011

    前端项目构建群：201496372

    前端职业咨询：158054390
