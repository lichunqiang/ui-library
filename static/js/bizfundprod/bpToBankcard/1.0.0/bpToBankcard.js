define(function(require, exports, module) {
	
	var Cellula = require('cellula');
	var FDP = require('fdp');
	var Select = require('select');
	var $ = require('$');
	var AccountSwitcher = require('accountswitcher');
	var Money = require('money');
	
	var util = Cellula._util, 
		Class = Cellula.Class, 
		Element = Cellula.Element, 
		Cell = Cellula.Cell, 
		Coll = Cellula.Collection;
	/* 
	 * mockAsyn 
	 * need remove later
	 */
	$.extend({
		ajax: function(opts) {
			if (!console.info) {
				console.info = console.log;
			}
			console.info('DUMMY AJAX started.');
			var params = typeof opts.data === 'string' ? jQuery.deparam(opts.data) : opts.data;
			console.info(params);
			setTimeout(function() {
				if (opts.url == 'accountSwitch.json') {
					opts.success({
						queryForm: params,
	                    stat: 'ok',
						errorCode: '',
						errorMsg: '',
						result: [{
								accountId: "1000011110",
								accountName: "账户A",
								accountEmail: "alipayb01@alitest.com",
								order: 0,
								current: false
							}, {
								accountId: "1000011111",
								accountName: "账户B",
								accountEmail: "alipayb02@alitest.com",
								order: 1,
								current: false
							}, {
								accountId: "1000011113",
								accountName: "",
								accountEmail: "alipayb01@alitest.com",
								order: 2,
								current: false
							}, {
								accountId: "1000011115",
								accountName: "asdf啊士大夫啊啊",
								accountEmail: "alip32b5301@alitasdfasdfzxcvzxcest.com",
								order: 3,
								current: true
							}, {
								accountId: "1000011340",
								accountName: "",
								accountEmail: "alipayb345601@alitest.com",
								order: 4,
								current: false
							}, {
								accountId: "1000011210",
								accountName: "啊士大夫",
								accountEmail: "alipab01@alitest.com",
								order: 5,
								current: false
							}, {
								accountId: "1004311111",
								accountName: "踩刹车",
								accountEmail: "alipa01@alitest.com",
								order: 6,
								current: false
							}]
						
					}, 'success');
				}
				
			}, 500);
			
		}
		
	});
	/* 付款账户  */
	var CardNo = new Class('CardNo', {
		type : 'input',
		label : '付款账户',
		acountList: undefined,
		accountSwitcher: null,
		init : function(conf) {
			this._super(conf);
			this.acountList = window.accountSwitchList;
			if (this.acountList) this.element.value = this.acountList[0].accountId;
			this.accountSwitcher = AccountSwitcher.init({
		   		//dataList: this.acountList,
		        bSwitchDefault: true,
		        accountSwitchInput: $(this.element)
		    });
		},
		rule : {
		}
	}).inherits(FDP.FormItem);
	/** 批次号 **/
	var BatchNo = new Class('BatchNo', {
		type : 'input',
		label : '批次号',
		init : function(conf) {
			this._super(conf);
		},
		rule : {
			digits: function() {
				if (!/^[0-9]+$/.test(this.element.value)) {
					this.errorMessage = this.label + '应为当天日期开头的11-20位数字，如：2014052021219810';
					return false;
				}
				return true;
			},
			size: function() {
				if (!/^[0-9]{11,20}$/.test(this.element.value)) {
					this.errorMessage = this.label + '应为当天日期开头的11-20位数字，如：2014052021219810';
					return false;
				}
				return true;
			},
			availableBatchNo: function() {
				
				return true;
			}
		}
	}).inherits(FDP.FormItem);
	/** 付款文件 **/
	var UploadFile = new Class('UploadFile', {
		type : 'input',
		label : '付款文件',
		init : function(conf) {
			this._super(conf);
			this._bindAll('trigger');
			$(this.element).change(this.trigger);
		},
		trigger: function() {
			this.triggerValidate();
		},
		rule: {
			availableFileType: function() {
				var allow = ['.csv', '.xls'],
			    	extension = /\.[^\.]+$/.exec(this.element.value);
				if (!extension) {
					this.errorMessage = '无效的文件类型，请重新选择' + this.label;
					return false;
			    }
				if ($.inArray(extension[0].toLowerCase(), allow) == -1) {
			    	this.errorMessage = '无效的文件类型，请重新选择' + this.label;
			    	return false;
			    }
				return true;
			}
		}
	}).inherits(FDP.FormItem);
	/* 总笔数 */
	var TotalCount = new Class('TotalCount', {
		type : 'input',
		label : '总笔数',
		max: undefined,
		init : function(conf) {
			this._super(conf);
			this.max = parseInt(this.element.getAttribute('data-max'), 10);
		},
		rule : {
			format: function() {
				if (!/^[1-9]\d*$/.test(this.element.value)) {
					this.errorMessage = this.label + '的格式不正确';
					return false;
				}
				return true;
			},
			limit: function() {
				if (parseInt(this.element.value, 10) <= 0) {
					this.errorMessage = this.label + '必须大于或者等于1';
					return false;
				}
				if (this.max < parseInt(this.element.value, 10)) {
					this.errorMessage = this.label + '最多' + this.max + '笔';
					return false;
				}
 				return true;
			}
		}
	}).inherits(FDP.FormItem);
	/* 总金额 */
	var TotalAmount = new Class('TotalAmount', {
		type : 'input',
		label : '总金额',
		reg: new RegExp('^\\d+(\\.\\d{0,2})?$'),
		toMoney: undefined,
		init : function(conf) {
			this._super(conf);
			this._bindAll('trigger');
			this.toMoney = $('.toMoney', this.rootNode);
			$(this.element).on('keyup', this.trigger);
		},
		trigger: function() {
			var val = $.trim(this.element.value);
			if (this.reg.test(val)) {
				var upperCase = Money.convert(val);
				upperCase && this.toMoney.text(upperCase);
				this.toMoney.removeClass('fn-hide');
			} else {
				this.errorMessage = this.label + '的格式不正确';
				this.error();
				this.toMoney.addClass('fn-hide');
			}
		},
		rule : {
			money: function() {
				if (!this.reg.test(this.element.value)) {
					this.errorMessage = this.label + '的格式不正确';
			    	return false;
				}
				return true;
			},
			limit: function() {
				if (parseFloat(this.element.value) == 0) {
					this.errorMessage = this.label + '至少为0.01元';
			    	return false;
				}
				return true;
			}
		}
	}).inherits(FDP.FormItem);
	/* 到账时间  */
	var ReceiveDateTime = new Class('ReceiveDateTime', {
		type : 'radio',
		label : '到账时间',
		init : function(conf) {
			this._super(conf);
			this._bindAll('trigger');
			$(this.element).click(this.trigger);
		},
		trigger : function(e) {
			this.triggerValidate();
		}
	}).inherits(FDP.FormItem);
	/* 类别  */
	var Purpose = new Class('Purpose', {
		type : 'select',
		label : '用途',
		select: undefined,
		init : function(conf) {
			var _self = this;
			var isFirst = true;
			this._super(conf);
			this.select = new Select({
				width : 220,
				size : 5,
				zIndex : 2,
				onSelect: function() {
					if (!isFirst) {
						_self.triggerValidate();
					}
					isFirst = false;
				}
			}).apply(this.element);
		}
	}).inherits(FDP.FormItem);
	/* memo */
	var Memo = new Class('Memo', {
		require : false,
		type : 'input',
		label : '备注',
		defaultTip : '',
		maxLength : undefined,
		init : function(conf) {
			this._super(conf);
			this.defaultTip = this.tip;
			this.maxLength = parseInt(this.element.getAttribute('data-maxlength'), 10) * 2;
			this._bindAll('limitWord');
			$(this.element).on('change keyup', this.limitWord);
		},
		limitWord : function(e) {
			if ($.trim(this.element.value) == '')
				this.tip = this.defaultTip;
			this.triggerValidate();
		},
		rule : {
			limitWord : function() {
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
	}).inherits(FDP.FormItem);
	/** collection **/
	var formElements = {
		cardNo: new CardNo({
			key: 'cardNo'
		}),
		batchNo : new BatchNo({
			key : 'batchNo'
		}),
		uploadFile : new UploadFile({
			key : 'uploadFile'
		}),
		totalCount : new TotalCount({
			key : 'totalCount'
		}),
		totalAmount : new TotalAmount({
			key : 'totalAmount'
		}),
		receiveDateTime : new ReceiveDateTime({
			key : 'receiveDateTime'
		}),
		purpose : new Purpose({
			key : 'purpose'
		}),
		memo : new Memo({
			key : 'memo'
		})
	};
	
	var BpToBankcardForm = new Class('BpToBankcardForm', {
		type : 'single',
		itemList : null,
		init : function(conf) {
			this._super(conf);
			this.collection = new Coll({
				type : FDP.FormItem
			});
			this.createItem();
			//console.log( this.submitBtn[0] );
		},
		createItem : function() {
			util.each(this.itemList, function(item) {
				this.register('FORMITEM:VALIDATE', item);
				//item.register('FORM:ISVALIDATE', this);
				this.collection.push(item);
			}, this);
		}
	}).inherits(FDP.Form);
	
	var bpToBankcardForm = new BpToBankcardForm({
		key : 'bpToBankcardForm',
		itemList : formElements
	});
	
	module.exports = bpToBankcardForm;
	
});
