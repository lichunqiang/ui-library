## ui library ##

---

**交互场景库**

由于涉及组件和场景较多，正在陆陆续续更新中...

本地构建环境： `node v0.10.26` | `npm 1.4.3` | `grunt 0.4.5`

构建方法

----

1. 将项目克隆到本地：`git clone git@github.com:ar-insect/ui-library.git`

2. 切换到项目根目录下面，比如：`cd ~/enterprise`

3. 执行 `npm install` 安装项目所需要的插件

4. 本地开发完成后在`gruntfile.js`里面配置部署（依赖配置在`package.json`的`alias`）

5. 在项目的根目录执行 `grunt enterprise` 完成静态文件的编译和打包

6. 最后别忘记在本地测试ok提交代码哦~

Q&A

----

- 问：有没有案例可以参考一下呢？

答： 看完 example/itemList.htm 你基本上就知道了：）

- 问：如何在项目中安装arale组件呢？

答：很简单，比如需要安装`dialog`组件，进入项目根目录中执行`spm install arale.dialog`就会自动下载组件以及其依赖到`sea-modules'下面，具体可以访问`arale.org`
注意：以上操作仅限于在内网中使用，然后你在项目中这么引用 `require('arale/dialog/1.2.6/dialog.js')`

目录结构


/-- `example` 示例


/-- `assets` 静态文件资源库（存放编译打包后的js&css）


	/-- js
	
		
		/-- common 公共模块
		

			/-- cellula
			
				
			/-- fdp `Form` `dataView` `paginator`
			

			/-- select
			
		
		/-- itemList 一个使用`cellula`做的小玩意儿
		
		
		/-- singleForm 单表单模型
		
		
		/-- searchingScene 异步查询场景模型
		

	/-- css
	

		/-- common
		

			/-- base
			

			/-- enterpriseportal
			
			
			/-- ...


/-- `lib` 公共js库


/-- `sea-modules` sea模块

 			
	 /-- .. arale组件等
	 

/-- `static` 静态资源


/-- `test` 单元测试


Gruntfile.js 部署脚本


package.js 项目配置


## 关于 Cellula ##

----

is building...


## 关于 FDP ##

----


FDP(1.0.0)是一套非常轻量的富客户查询模型，同时它也支持Single Form应用场景，内部是基于cellula v0.4.1构建，依赖了jQuery 1.7.2。

具体源码可以参考 `lib/fdp`

整个模型由formItem，form，table，paginator几个模块组成；

tips:

- single Form只使用 form+formItem组合，searchingScene使用form+formItem+table+paginator组合

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

@triggerValidate Function ：手动触发校验，内部在触发`focus` `blur`会自动调用，但如果绑定其它事件通常是需要手动调用的，例如：

	var Memo = new Class('Memo', {
                require: false,
                type: 'textarea',
                label: '备注',
                defaultTip: '',
                maxLength: undefined,
                init: function(conf) {
                    this._super(conf);
                    this.defaultTip = this.tip;
                    this.maxLength = parseInt( this.element.getAttribute('data-maxlength'), 10 ) * 2;
                    this._bindAll('limitWord');
                    $(this.element).on('change keyup', this.limitWord);
                },
                limitWord: function(e) {
                    if ($.trim(this.element.value) == '') this.tip = this.defaultTip;
                    this.triggerValidate(); // 手动触发校验
                },
                rule: {
                    limitWord: function() {
                       var val = this.element.value;
                       var len = val.replace(/[\u4E00-\u9FBF]/g, 'BB').length;
                       if (len > this.maxLength) {
                           this.errorMessage = '输入已超过' + Math.floor((len - this.maxLength) / 2) + '个字。';
                           return false;
                       } else {
                           this.tip = '还可以输入' + Math.ceil((this.maxLength - len) / 2) + '个字。';
                           return true;
                       }
                    }
                }
            }).inherits(SearchingScene.FormItem);



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

is Building...


## Searching Form 应用场景 ##

----

is Building...


----
如有问题或建议请 ar.insect@gmail.com
