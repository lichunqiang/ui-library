## ui library ##

---

**交互场景库**

由于涉及组件和场景较多，正在陆陆续续更新中...

本地构建环境： `node v0.10.26` | `npm 1.4.3` | `grunt 0.4.5`

构建方法
--
1. 将项目克隆到本地：`git clone git@github.com:ar-insect/ui-library.git`

2. 切换到项目根目录下面，比如：`cd ~/enterprise`

3. 执行 `npm install` 安装项目所需要的插件

4. 本地开发完成后在`gruntfile.js`里面配置部署（依赖配置在`package.json`的`alias`）

5. 在项目的根目录执行 `grunt enterprise` 完成静态文件的编译和打包

6. 最后别忘记在本地测试ok提交代码哦~

Q&A
--
- 问：有没有案例可以参考一下呢？

答： 看完 example/itemList.htm 你基本上就知道了：）

- 问：如何在项目中安装arale组件呢？

答：很简单，比如需要安装`dialog`组件，进入项目根目录中执行`spm install arale.dialog`就会自动下载组件以及其依赖到`sea-modules'下面，具体可以访问`arale.org`
注意：以上操作仅限于在内网中使用，然后你在项目中这么引用 `require('arale/dialog/1.2.6/dialog.js')`

目录结构
--

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


如有问题或建议请 ar.insect@gmail.com
