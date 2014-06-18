define(function(require, exports, module) {
	
	var Cellula = require('cellula');
	var FDP = require('fdp');
	var $ = require('$');
	
	var dialogStyle = require('arale/dialog/1.2.6/dialog.css');
	var Dialog = require('arale/dialog/1.2.6/dialog.js');
	var calendarStyle = require('arale/calendar/1.0.0/calendar.css');
	var Calendar = require('arale/calendar/1.0.0/calendar.js');
	var Select = require('select');
	
	var util = Cellula._util, Class = Cellula.Class, Element = Cellula.Element, Cell = Cellula.Cell, Coll = Cellula.Collection;

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
			var _self = this;
			this._bindAll('changeDateRange');
			this.startDateInput = this.element[0]['ele'];
			this.endDateInput = this.element[1]['ele'];
			// default callback today date
			this.startDateInput.value = this.getCurrentDate();
			this.endDateInput.value = this.getCurrentDate();
			this.startCal = new Calendar({
				trigger : this.startDateInput,
				focus : this.startDateInput.value,
				range : [new Date(this.config.calendarRangeStart).format('isoDate'), this.endDateInput.value]
			});
			this.endCal = new Calendar({
				trigger : this.endDateInput,
				focus : this.endDateInput.value,
				range : [this.startDateInput.value, this.config.calendarRangeEnd.format('isoDate')]
			});

			this.startCal.on('selectDate', function(date) {
				$('a[data-picker]', _self.rootNode).removeClass('block-link-active');
				_self.startCal.range([new Date(_self.config.calendarRangeStart).format('isoDate'), $(_self.endCal.get('trigger')).val()]);
				_self.endCal.range([date, _self.config.calendarRangeEnd.format('isoDate')]);
			});
			this.startCal.before('show', function() {
				$(_self.rootNode).removeClass('mi-form-item-error');
				$('.mi-form-explain', _self.rootNode).text('');
			});

			this.endCal.on('selectDate', function(date) {
				$('a[data-picker]', _self.rootNode).removeClass('block-link-active');
				_self.startCal.range([new Date(_self.config.calendarRangeStart).format('isoDate'), date]);
				_self.endCal.range([$(_self.startCal.get('trigger')).val(), _self.config.calendarRangeEnd.format('isoDate')]);
			});
			this.endCal.before('show', function() {
				$(_self.rootNode).removeClass('mi-form-item-error');
				$('.mi-form-explain', _self.rootNode).text('');
			});

			$('a[data-picker]', _self.rootNode).on('click', this.changeDateRange);
		},
		changeDateRange : function(e) {
			var _self = this;
			var start, end;
			var pickId = $(e.target).attr('data-picker');
			var today = (new Date()).format('isoDate');
			e.preventDefault();
			switch (pickId) {
				case 'today' :
					start = today;
					end = today;
					break;
				case 'yesterday' :
					start = (new Date(new Date() - 1 * _ONEDAYRANGE)).format('isoDate');
					end = (new Date(new Date() - 1 * _ONEDAYRANGE)).format('isoDate');
					break;
				case 'week' :
					start = (new Date(new Date() - 6 * _ONEDAYRANGE)).format('isoDate');
					end = today;
					break;
				case 'month' :
					start = (new Date(new Date() - 29 * _ONEDAYRANGE)).format('isoDate');
					end = today;
					break;
				default :
					break;
			}
			setTimeout(function() {
				_self.startCal.range([null, null]);
				_self.startCal.set('focus', start);
				if (_self.startCal.dates.inRange(start)) {
					_self.startCal.dates.select(start, $(_self.startDateInput));
				}
			}, 20);
			setTimeout(function() {
				_self.endCal.range([null, null]);
				_self.endCal.set('focus', end);
				if (_self.endCal.dates.inRange(end)) {
					_self.endCal.dates.select(end, $(_self.endDateInput));
				}
				$(e.target).addClass('block-link-active');
			}, 50);
			$(this.rootNode).removeClass('mi-form-item-error');
			$('.mi-form-explain', this.rootNode).text('');
		},
		getCurrentDate : function() {
			var date = new Date;
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			month = (month < 10 ? "0" + month : month);
			var day = date.getDate();
			day = (day < 10 ? "0" + day : day);
			return (year.toString() + '-' + month.toString() + '-' + day.toString());
		}
	}).inherits(FDP.FormItem);
	/** 批次号 **/
	var BatchNo = new Class('BatchNo', {
		require : false,
		type : 'input',
		label : '批次号',
		init : function(conf) {
			this._super(conf);

		}
	}).inherits(FDP.FormItem);
	
	var BatchStatus = new Class('BatchStatus', {
		type : 'select',
		label : '状态',
		init : function(conf) {
			this._super(conf);
			new Select({
				width : 100,
				size : 3,
				zIndex : 2
			}).apply(this.element);
		}
	}).inherits(FDP.FormItem);
	
	var TableView = new Class('TableView', {
		tips : {
			noResult : 'error-box',
			error : 'sys-error-box'
		},
		init : function(conf) {
			this._super(conf);
		},
		tableTpl : {
			head : '<tr>' + '<th>创建时间</th>' + '<th>商户订单号</th>' + '<th>商品名称</th>' + '<th class="ft-right">订单金额(元)</th>' + '<th>交易状态</th>' + '<th>买家账户|名称</th>' + '<th class="ft-right">操作</th>' + '</tr>',
			body : '$-{#rows}<tr>' + '<td class="ft-right">$-{gmtCreate}</td>' + '<td>$-{outTradeNo}</td>' + '<td>$-{goodsTitle}</td>' + '<td>$-{totalAmount}</td>' + '<td>$-{tradeStatus}</td>' + '<td>$-{consumerLoginId} $-{consumerName}</td>' + '<td>--</td>' + '</tr>$-{/rows}'
		},
		prepareTplConfig : function(data) {
			var dataConf = {
				rows : []
			};

			for (var i = 0, len = data.length; i < len; i++) {
				dataConf.rows.push(data[i]);
			}

			return dataConf;
		},
		registerEvents : function() {

		}
	}).inherits(FDP.DataTable);

	var Paging = new Class('Paging', {
		init : function(conf) {
			this._super(conf);
		}
	}).inherits(FDP.Paginator);

	var SearchForm = new Class('SearchForm', {
		asyn : null,
		init : function(conf) {
			this._super(conf);
		},
		ajaxLoadingBox : (function() {
			var _ajax = this.asyn;
			$('#J_loadingContent').on('cancel', function() {
				if (_ajax && _ajax.readystate != 4) {
					_ajax.abort();
				}
			});
			function loadingMove() {
				var oP = $('#J_loadingContent .mi-progress-bar')[0].style, t = 100000, oPbpx;
				clearTimeout(loadingMove._t);
				var _run = function() {
					if (t > 0) {
						t--;
						oP.left = (parseFloat(oP.left) + 2.96) + 'px';
						if (parseFloat(oP.left) >= 296) {
							oP.left = '0px';
						}
						oPbpx = $('#J_loadingContent .mi-progress-bar').css('background-position-x');
						oP.backgroundPosition = (parseFloat(oPbpx) + 0.65) + 'px -60px';
						if (parseFloat(oPbpx) + 0.65 >= 26) {
							oP.backgroundPosition = '0px -60px';
						}
						loadingMove._t = setTimeout(_run, 20);
					}
				};
				_run();
			};
			return new Dialog({
				//trigger: '#loading-btn',
				content : $('#J_loadingContent'),
				closeTpl : ''
			}).after('show', function() {
				var _self = this;
				loadingMove();
				setTimeout(function() {
					$('#J_loadingContent .btn-cancel').on('click', function(e) {
						_self.hide();
						$('#J_loadingContent').trigger('cancel');
						e.preventDefault();
					});
					$('#J_loadingContent .btn-cancel').removeClass('fn-hide');
				}, 3000);
			}).after('hide', function() {
				clearTimeout(loadingMove._t);
				$('#J_loadingContent .btn-cancel').addClass('fn-hide');
			});
		})(),
		/*
		 * Allow the custom query
		 */
		customSearch : function(data) {
			console.log('request:', data);
			var _self = this;
			this.ajaxLoadingBox.show();
			this.asyn = $.ajax({
				url : '../data/reco.php',
				type : 'POST',
				data : data,
				timeout : 10000,
				success : function(resp) {
					console.log('response:', resp);
					
					if (resp.status == 'succeed') {
						_self.ajaxLoadingBox.hide();
						_self.dataDispatch(resp);
					} else
						this.emit('FORM:SYSTEMERROR');
				},
				error : function(xhr, stat, error) {
					_self.ajaxLoadingBox.hide();
					this.emit('FORM:SYSTEMERROR');
					window.debug && console.log('error: ', xhr, stat, error);
				}
			});
		}
	}).inherits(FDP.Form);

	var searchForm = new SearchForm({
		key : 'searchForm',
		itemList : {
			applyDate : new ApplyDate({
				key : 'applyDate'
			}),
			batchNo : new BatchNo({
				key : 'batchNo'
			}),
			batchStatus : new BatchStatus({
				key : 'batchStatus'
			})
		},
		/* this is the table module, In need of a mount */
		tableView : new TableView({
			key : 'detailTable'
		}),
		/* this is the paging module, In need of a mount */
		paging : new Paging({
			key : 'paginator'
		})
	});
	
	

});