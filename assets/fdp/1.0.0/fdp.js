/**
 * @fileOverview fdp's form module definition based on Cellula.
 * @description: defines form module
 * @namespace: FDP
 * @version: 1.0.0
 */
define("fdp/1.0.0/fdp-form", [ "$", "cellula/0.4.1/cellula", "cellula/0.4.1/cellula-namespace", "cellula/0.4.1/cellula-class", "cellula/0.4.1/cellula-util", "cellula/0.4.1/cellula-events", "cellula/0.4.1/cellula-cell", "cellula/0.4.1/cellula-element", "cellula/0.4.1/cellula-collection", "fdp/1.0.0/fdp-namespace" ], function(require, exports, module) {
    // dependence
    var $ = require("$");
    var Cellula = require("cellula/0.4.1/cellula");
    var FDP = require("fdp/1.0.0/fdp-namespace");
    var FormItem = FDP.FormItem;
    var util = Cellula._util, Class = Cellula.Class, Element = Cellula.Element, Cell = Cellula.Cell, Coll = Cellula.Collection;
    var Form = FDP.Form = new Class("Form", {
        type: undefined,
        validateAll: false,
        submitBtn: null,
        //autoSubmit: true,
        collection: null,
        itemList: undefined,
        tableView: undefined,
        paging: undefined,
        //ajaxLoadingBox: undefined,
        init: function(cfg) {
            if (!this.key) this.key = this.__cid__;
            this._super(cfg);
            this._bindAll("search", "doSearch", "dataDispatch", "submit");
            this.collection = new Coll({
                type: FormItem
            });
            if (this.rootNode) this.submitBtn = $("input[type=submit]", this.rootNode);
            //this.disable(true);
            if (this.paging) {
                this.follow(this.paging);
                this.paging.follow(this);
                this.tableView && this.paging.follow(this.tableView);
                this.tableView && this.tableView.follow(this.paging);
                this.tableView && this.tableView.follow(this);
            }
            this.createItem();
            this.registerEvents();
        },
        registerEvents: function() {
            //var evt = this.type == 'single' ? this.submit : this.doSearch;
            $(this.rootNode).submit(this.type == "single" ? this.submit : this.doSearch);
        },
        createItem: function() {
            util.each(this.itemList, function(item) {
                this.register("FORMITEM:VALIDATE", item);
                this.collection.push(item);
            }, this);
        },
        submit: function(e) {
            e.preventDefault();
            // validate all FormItem...
            this.validate();
            if (this.validateAll) {
                //submit...
                console.log(this.getData());
            }
        },
        validate: function() {
            this.emit("FORMITEM:VALIDATE");
            //call formItem's validate
            util.each(this.collection.get(), function(item) {
                this.validateAll = item.validate;
                if (!item.validate) return "break";
            }, this, "break");
            return this.validateAll;
        },
        disable: function() {},
        getData: function() {
            // returns all elements' data
            var t = {};
            util.each(this.collection.get(), function(v) {
                t = util.mix(t, v.getData());
            }, this);
            return t;
        },
        receiver: function(e) {
            if (!e) return;
            var targ = e.target, evt = e.name.split(":")[1];
            switch (evt) {
              case "SETPAGEDEFAULT":
                this.pageDefault = arguments[1];
                break;

              case "SETPAGECOLLECTION":
                this.pageCollection = arguments[1];
                break;

              case "DOSEARCH":
                this.doSearch(arguments[1]);
                break;
            }
        },
        doSearch: function(e) {
            // TODO:
            // to deal with different framework's events handler
            var pageDefault, cll, size, sv, sizeData, postData, isEvent = false;
            if (e && e.preventDefault) {
                e.preventDefault();
                isEvent = true;
            }
            if ((isEvent || !isEvent && !e) && this.validate()) {
                // trigger by event // direct operation
                this.emit("PAGINATOR:GETDEFAULTPAGE");
                this.emit("PAGINATOR:GETCOLLECTION");
                pageDefault = this.pageDefault;
                cll = this.pageCollection;
                size = cll.get("size");
                sizeData = size.get();
                sv = util.values(sizeData)[0];
                postData = util.mix(this.getData(), util.isEmpty(sv) ? pageDefault.size : sv, pageDefault.number || {});
            } else {
                if (!isEvent && e && this.validate()) {
                    // triggered by paginator
                    postData = util.mix({}, this.getData(), e);
                }
            }
            if (postData) this.search(postData);
        },
        customSearch: function(data) {},
        search: function(data) {
            //console.log('search');
            this.customSearch.call(this, data);
        },
        dataDispatch: function(data) {
            /**
			 * data struct
			 * {
			 *     result:{
			 *         detail : [{...},{...}...]
			 *     },
			 *     paging:{
			 *        current: 1
			 *		  sizePerPage: 20
			 *		  totalItems: 6
			 *     }
			 * }
			 */
            //TODD:
            // data validate
            // ...
            // data stuct error
            if (!data.queryForm || !data.result || !data.result.paging) {
                //!(data.paging.size || data.paging.page || data.paging.number)
                //this.applyInterface('error');
                console.log("data stuct error!");
                return;
            }
            // TODO:
            // no result
            //if (data.result.length == 0) {
            //	console.log('no result.');
            //	return;
            //}
            // to table
            this.emit("TABLE:TABLERENDER", data.result.detail);
            // to paginator
            this.emit("PAGINATOR:PAGINGRENDER", data.result.paging);
        }
    }).inherits(Cell);
    module.exports = Form;
});

/**
 * @fileOverview fdp's FormItem module definition based on Cellula.
 * @description: defines form module
 * @namespace: FDP
 * @version: 1.0.0
 */
define("fdp/1.0.0/fdp-formItem", [ "fdp/1.0.0/fdp-namespace", "cellula/0.4.1/cellula", "cellula/0.4.1/cellula-namespace", "cellula/0.4.1/cellula-class", "cellula/0.4.1/cellula-util", "cellula/0.4.1/cellula-events", "cellula/0.4.1/cellula-cell", "cellula/0.4.1/cellula-element", "cellula/0.4.1/cellula-collection", "$" ], function(require, exports, module) {
    var FDP = require("fdp/1.0.0/fdp-namespace");
    var Cellula = require("cellula/0.4.1/cellula");
    var $ = require("$");
    var util = Cellula._util, Class = Cellula.Class, Element = Cellula.Element, Cell = Cellula.Cell, Coll = Cellula.Collection;
    var itemType = [ "INPUT", "SELECT", "RADIO", "CHECKBOX", "TEXTAREA" ];
    var FormItem = FDP.FormItem = new Class("FormItem", {
        type: "input",
        // validated type is `input` `select` `radio` 'checkbox' `textarea` todo ...
        require: true,
        validate: false,
        hideClass: "fn-hide",
        errorClass: "mi-form-item-error",
        errorMessage: undefined,
        tipClass: "mi-form-explain",
        label: undefined,
        tip: undefined,
        element: undefined,
        tipElement: undefined,
        name: undefined,
        value: undefined,
        beforeValidate: undefined,
        afterValidate: undefined,
        init: function(conf) {
            this._super(conf);
            this.key = this.key ? this.key : this.__cid__;
            this.type = this.type.toUpperCase();
            if (this.allowItemType()) throw new Error("formItem type is error!");
            this.setElement();
            this._bindAll("focus", "blur");
            this.bindDefaultEvent();
        },
        revalidate: function(e) {
            this.triggerValidate(e);
        },
        allowItemType: function() {
            return $.inArray(this.type, itemType) == -1;
        },
        setElement: function() {
            var i, arr = [];
            var tipElement = this.rootNode && util.getElementsByClassName(this.tipClass, this.rootNode)[0];
            if (this.type == "INPUT" || this.type == "TEXTAREA" || this.type == "SELECT") {
                this.element = this.rootNode && this.rootNode.getElementsByTagName(this.type);
                if (this.element.length == 1) {
                    // single item
                    this.element = this.element[0];
                    this.name = this.element && this.element.name;
                } else {
                    // multiple (item team)
                    /*
					 * {
					 * 	ele: element,
					 *  name: name,
					 *  value: value
					 *  ...
					 * }
					 */
                    for (i = 0, len = this.element.length; i < len; i++) {
                        arr.push({
                            ele: this.element[i],
                            name: this.element[i].name,
                            value: this.element[i].value
                        });
                    }
                    this.element = arr;
                }
            }
            if (this.type == "RADIO" || this.type == "CHECKBOX") {
                this.element = $("[type=" + this.type + "]", this.rootNode);
                this.name = this.element && this.element[0].name;
            }
            if (tipElement) {
                this.tipElement = tipElement;
                this.tip = this.tipElement.innerHTML;
            }
        },
        getData: function() {
            var i, len, n, v, o = {}, data = {};
            if (util.isArray(this.element)) {
                for (i = 0, len = this.element.length; i < len; i++) {
                    //o = null;
                    n = this.element[i]["name"];
                    v = this.element[i]["value"];
                    o[n] = v;
                    util.mix(data, o);
                }
            } else data[this.name] = this.value;
            return data;
        },
        save: function(v) {
            var i, len;
            var arr = [];
            if (v === true) {
                this.validate = true;
                if (this.type == "INPUT" || this.type == "TEXTAREA") {
                    if (util.isArray(this.element)) {
                        for (i = 0, len = this.element.length; i < len; i++) {
                            this.element[i]["value"] = util.trim(this.element[i]["ele"].value);
                        }
                    } else {
                        this.value = this.element && util.trim(this.element.value);
                    }
                } else if (this.type == "SELECT") {
                    this.value = this.element && this.element.options[this.element.selectedIndex].value;
                } else if (this.type == "RADIO") {
                    for (i = 0, len = this.element.length; i < len; i++) {
                        if (this.element[i].checked) {
                            this.value = this.element[i].value;
                            break;
                        }
                    }
                } else if (this.type == "CHECKBOX") {
                    for (i = 0, len = this.element.length; i < len; i++) {
                        if (this.element[i].checked) {
                            arr.push(this.element[i].value);
                        }
                    }
                    this.value = arr.join(",");
                } else {
                    try {
                        this.value = this.element && util.trim(this.element.value);
                    } catch (e) {
                        throw new Error("formItem type is error!");
                    }
                }
            } else {
                // error...
                this.validate = false;
            }
        },
        bindDefaultEvent: function() {
            if (this.type == "INPUT" || this.type == "TEXTAREA") {
                $(this.element).blur(this.blur);
                $(this.element).focus(this.focus);
            }
        },
        setDefaultTip: function() {
            this.tipElement.innerHTML = this.tip;
            util.removeClass(this.tipElement.parentNode, this.errorClass);
        },
        isEmpty: function(v) {
            return util.isEmpty(v);
        },
        rule: {},
        rollback: function() {
            var r = true;
            if (util.isObject(this.rule)) {
                util.each(this.rule, function(fn, k) {
                    if (util.isFunction(fn)) {
                        if (!fn.call(this)) {
                            r = false;
                            return "break";
                        }
                    }
                }, this, "break");
            }
            return r;
        },
        /** This function is used to trigger a check **/
        triggerValidate: function() {
            var i, r, t, len;
            var value;
            var checked = false;
            // 验证之前触发 TODO
            if (this.beforeValidate && util.isFunction(this.beforeValidate)) this.beforeValidate.apply(this, arguments);
            if (this.require) {
                if (this.type == "INPUT" || this.type == "TEXTAREA" || this.type == "SELECT") {
                    // 验证是否为空
                    t = this.type == "SELECT" ? "请选择" : "请填写";
                    if (util.isArray(this.element)) {
                        //if (this.element[0].type.toUpperCase() == '')
                        for (i = 0, len = this.element.length; i < len; i++) {
                            if (this.isEmpty(this.element[i]["ele"].value)) {
                                this.save(false);
                                this.errorMessage = t + this.label;
                                this.error();
                                return false;
                            }
                        }
                    } else {
                        t = this.element.type.toUpperCase() == "FILE" ? "请选择" : t;
                        value = this.element.value;
                        if (this.isEmpty(value)) {
                            this.save(false);
                            this.errorMessage = t + this.label;
                            this.error();
                            return false;
                        }
                    }
                }
                if (this.type == "RADIO" || this.type == "CHECKBOX") {
                    util.each(this.element, function(item) {
                        if (item.checked) {
                            checked = true;
                            return "break";
                        }
                    }, this, "break");
                    if (!checked) {
                        this.save(false);
                        this.errorMessage = "请选择" + this.label;
                        this.error();
                        return false;
                    }
                }
                // 验证rule规则
                r = this.rollback();
                if (!r) {
                    this.save(false);
                    this.error();
                    return false;
                }
            } else {
                if (this.type == "INPUT" || this.type == "TEXTAREA") {
                    if (util.isArray(this.element)) {
                        for (i = 0, len = this.element.length; i < len; i++) {
                            if (!this.isEmpty(this.element[i]["ele"].value)) {
                                r = this.rollback();
                                if (!r) {
                                    this.save(false);
                                    this.error();
                                    return false;
                                }
                            }
                        }
                    } else {
                        value = this.element.value;
                        if (!this.isEmpty(value)) {
                            // 如果value不为空则验证。
                            r = this.rollback();
                            if (!r) {
                                this.save(false);
                                this.error();
                                return false;
                            }
                        }
                    }
                }
            }
            this.save(true);
            this.setDefaultTip();
            // 验证后触发 TODO
            if (this.afterValidate && util.isFunction(this.afterValidate)) this.afterValidate.apply(this, arguments);
        },
        error: function() {
            if (this.tipElement && !this.validate) {
                this.tipElement.innerHTML = this.errorMessage || window.console && console.log("errorMessage is null.") || "";
                util.addClass(this.tipElement.parentNode, this.errorClass);
            }
        },
        focus: function(e) {
            this.setDefaultTip();
        },
        blur: function(e) {
            this.triggerValidate(e);
        },
        receiver: function(e) {
            if (!e) return;
            var targ = e.target, evt = e.name.split(":")[1];
            switch (evt) {
              case "VALIDATE":
                this.revalidate(e);
                break;
            }
        }
    }).inherits(Cell);
    module.exports = FormItem;
});

/**
 * @fileOverview FDP namespace definition.
 * @namespace: FDP
 * @version: 1.0.0
 */
define("fdp/1.0.0/fdp-namespace", [], function(require, exports, module) {
    var FDP = {};
    //FDP._search = FDP;
    FDP.version = "1.0.0";
    FDP.Form = undefined;
    FDP.FormItem = undefined;
    FDP.Paginator = undefined;
    FDP.DataTable = undefined;
    module.exports = FDP;
});

/**
 * @fileOverview FDP's paging module definition based on Cellula.
 * @description: defines paginator module
 * @namespace: FDP
 * @version: 1.0.0
 */
define("fdp/1.0.0/fdp-paginator", [ "fdp/1.0.0/fdp-namespace", "cellula/0.4.1/cellula", "cellula/0.4.1/cellula-namespace", "cellula/0.4.1/cellula-class", "cellula/0.4.1/cellula-util", "cellula/0.4.1/cellula-events", "cellula/0.4.1/cellula-cell", "cellula/0.4.1/cellula-element", "cellula/0.4.1/cellula-collection", "$", "select/1.0.0/select" ], function(require, exports, module) {
    var FDP = require("fdp/1.0.0/fdp-namespace");
    var Cellula = require("cellula/0.4.1/cellula");
    var $ = require("$");
    var Select = require("select/1.0.0/select");
    var util = Cellula._util, Class = Cellula.Class, Element = Cellula.Element, Cell = Cellula.Cell, Coll = Cellula.Collection;
    var SizeElement = new Class("SizeElement", {
        value: undefined,
        save: function(val) {
            return this.set(new Function("return {size : {sizeDefault:" + this.value + "}}").call(this));
        },
        init: function(conf) {
            this._super(conf);
            this.set({
                size: {
                    sizeDefault: 20
                }
            });
        }
    }).inherits(Element);
    var NumberElement = new Class("NumberElement", {
        value: undefined,
        save: function() {
            return this.set(new Function("return {number : {currentPage:" + this.value + "}}").call(this));
        },
        init: function(conf) {
            this._super(conf);
            this.set({
                number: {
                    currentPage: 1
                }
            });
        }
    }).inherits(Element);
    var PageElement = new Class("PageElement", {
        save: function() {
            console.log("save page element data");
        },
        items: {},
        options: {},
        init: function(conf) {
            this._super(conf);
            this.set({
                sizePerPage: 20,
                totalItems: null,
                current: 1
            });
        }
    }).inherits(Element);
    var paginator = FDP.Paginator = new Class("Paginator", {
        hideClass: "fn-hide",
        sizeSelect: undefined,
        collection: undefined,
        pageDefault: {
            size: {
                sizeDefault: 20
            },
            number: {
                currentPage: 1
            },
            page: {
                first: 1,
                // optional
                last: null,
                // optional
                prev: null,
                // optional
                // prevDis: null,
                next: null,
                // optional
                //nextDis: null,
                totalItems: null,
                totalPages: null,
                // optional
                current: null,
                currentArray: null
            },
            sizeDefault: 20,
            sizeOptions: [ 10, 20, 50 ]
        },
        pageTpl: '<span class="mi-paging-info fn-ml15">每页</span>' + '<select name="size" id="J_size">' + '$-{#options}<option $-{#selected}selected $-{/selected} value="$-{num}">$-{num}</option>$-{/options}' + "</select>" + '<span class="mi-paging-info mi-paging-which"><input type="text" id="J_number" name="number" value="$-{current}"></span>' + '<a href="javascript:;" class="mi-paging-item mi-paging-goto"><span class="paging-text">跳转</span></a>' + '<span class="mi-paging-info fn-ml15"><span class="paging-text mi-paging-bold">$-{current}/$-{totalPages}</span>页</span>' + '$-{#pre}<a href="javascript:;" class="mi-paging-item mi-paging-prev fn-mr10"><span class="paging-text">上一页</span><span class="mi-paging-icon"></span></a>$-{/pre}' + '$-{#preDis}<span class="mi-paging-item mi-paging-prev mi-paging-prev-disabled fn-mr10"><span class="paging-text">上一页</span><span class="mi-paging-icon"></span></span>$-{/preDis}' + '$-{#next}<a href="javascript:;" class="mi-paging-item mi-paging-next"><span class="paging-text">下一页</span><span class="mi-paging-icon"></span></a>$-{/next}' + '$-{#nextDis}<span class="mi-paging-item mi-paging-next mi-paging-next-disabled"><span class="paging-text">下一页</span><span class="mi-paging-icon"></span></span>$-{/nextDis}',
        typeEnum: {
            first: "\\bfirst\\b",
            last: "\\blast\\b",
            prev: "\\bprev\\b",
            next: "\\bnext\\b",
            "goto": "\\bgoto\\b"
        },
        init: function(cfg) {
            this._super(cfg);
            this._bindAll("changeSize", "paginate");
            this.collection = new Coll();
            // type default Element
            this.collection.push(new SizeElement({
                key: "size"
            }));
            this.collection.push(new NumberElement({
                key: "number"
            }));
            this.collection.push(new PageElement({
                key: "page"
            }));
        },
        receiver: function(e) {
            if (!e) return;
            var targ = e.target, evt = e.name.split(":")[1];
            switch (evt) {
              case "PAGINGRENDER":
                this.render(arguments[1]);
                break;

              case "GETDEFAULTPAGE":
                this.getDefault();
                break;

              case "GETCOLLECTION":
                this.getCollection();
                break;

              case "SYSTEMERROR":
                util.addClass(this.rootNode, this.hideClass);
                break;

              case "NORESULT":
                util.addClass(this.rootNode, this.hideClass);
                break;
            }
        },
        getDefault: function() {
            this.emit("FORM:SETPAGEDEFAULT", this.pageDefault);
        },
        getCollection: function() {
            this.emit("FORM:SETPAGECOLLECTION", this.collection);
        },
        getOperationType: function(name) {
            for (var n in this.typeEnum) {
                if (new RegExp(this.typeEnum[n]).test(name)) return n;
            }
        },
        calcNumber: function(t) {
            var type = this.getOperationType(t.className), p = this.collection.get("page"), c = parseInt(p.get("current")), l = parseInt(p.get("totalPages"));
            if (type === undefined) {
                return /(\D*)(\d+)(\D*)/.exec(t.innerHTML) ? /(\D*)(\d+)(\D*)/.exec(t.innerHTML)[2] : undefined;
            }
            // if(type === 'first') return 1;
            if (type === "last") return l;
            if (type === "prev") return c - 1 > 1 ? c - 1 : 1;
            if (type === "next") return c + 1 < l ? c + 1 : l;
            return 1;
        },
        operate: function(ct) {
            var number = this.collection.get("number"), gotoNum = this.calcNumber(ct);
            if (number && gotoNum) {
                return number.set(util.keys(number.get())[0], gotoNum);
            }
            return false;
        },
        paginate: function(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            //console.log('paginate');
            var cll = this.collection;
            if (this.getOperationType(e.currentTarget.className) === "goto") {
                var pd = this.pageDefault;
                var gp = $("input[name=number]", this.rootNode);
                var size = cll.get("size"), sv = util.values(size.get())[0], number = cll.get("number");
                if (isNaN(parseInt(gp.val())) || parseInt(gp.val()) < 1) {
                    gp.val(util.values(pd.number)[0]);
                    number.value = util.values(pd.number)[0];
                } else {
                    number.value = gp.val();
                }
                number.save();
                if (util.isEmpty(sv)) size.set({
                    size: this.pageDefault.size
                });
                //size.save(); ?
                this.emit("FORM:DOSEARCH", util.mix({}, util.values(size.get())[0], util.values(number.get())[0]));
            } else {
                if (this.operate(e.currentTarget)) {
                    var size = cll.get("size"), sv = util.values(size.get())[0], number = cll.get("number");
                    if (util.isEmpty(sv)) size.set(this.pageDefault.size);
                    //size.save(); ?
                    this.emit("FORM:DOSEARCH", util.mix({}, util.values(size.get())[0], util.values(number.get())[0]));
                }
            }
        },
        changeSize: function(e) {
            var size = this.collection.get("size");
            size.value = this.sizeSelect.getValue();
            size.save();
            this.emit("FORM:DOSEARCH", util.mix({}, util.values(size.get())[0], this.pageDefault.number || {}));
        },
        prepareTplConfig: function(data) {
            var pageEl = this.collection.get("page");
            if (data) pageEl.set(data);
            var current = parseInt(pageEl.get("current")), total = parseInt(pageEl.get("totalItems")), pds = this.pageDefault.size, sv = util.values(this.collection.get("size").get())[0], size = parseInt(util.isEmpty(sv) ? util.values(pds)[0] : util.values(sv)[0]), m = total % size, pages = (total - m) / size + (m > 0 ? 1 : 0), sd = this.pageDefault.sizeDefault, half = (sd - 1) / 2, tplCfg;
            if (current < 1) current = 1;
            if (current > pages) current = pages;
            pageEl.set({
                totalPages: pages
            });
            tplCfg = {
                size: size,
                pre: current !== 1,
                preDis: !(current !== 1),
                next: current !== pages,
                nextDis: !(current !== pages),
                options: [],
                totalItems: total,
                startItem: (current - 1) * size + 1,
                endItem: current * size > total ? total : current * size,
                totalPages: pages,
                totalShow: pages > sd ? pages - half > current ? true : false : false,
                ellipsis: pages > sd ? pages - half - 1 > current ? true : false : false,
                items: [],
                current: current
            };
            for (var i = 1, l = pages > sd ? sd : pages, h = half; i <= l; i++) {
                var num = 1;
                if (pages > sd) {
                    if (current > half && current <= pages - half) num = current - h, h--;
                    if (current > pages - half) num = pages - sd + i;
                    if (current <= half) num = i;
                } else {
                    num = i;
                }
                tplCfg.items.push({
                    num: num,
                    currentClass: current === num ? true : false
                });
            }
            if (util.isArray(this.pageDefault.sizeOptions)) {
                for (var i = 0, op = this.pageDefault.sizeOptions; i < op.length; i++) {
                    tplCfg.options.push({
                        num: op[i],
                        selected: size === op[i]
                    });
                }
            }
            return tplCfg;
        },
        error: function() {
            this.show(false);
        },
        registerEvents: function() {
            if (this.sizeSelect) this.sizeSelect.onSelect = this.changeSize;
            $(".mi-paging-goto", this.rootNode).click(this.paginate);
            $(".mi-paging-item", this.rootNode).click(this.paginate);
        },
        render: function(data) {
            //data = data.result.paging;
            if (!util.isEmpty(data)) {
                //console.log(data);
                var sel, root = this.rootNode;
                root.innerHTML = util.parseTpl(this.pageTpl, this.prepareTplConfig(data));
                sel = $("select[name=size]", this.rootNode);
                if (sel.length) this.sizeSelect = new Select({
                    width: 58,
                    size: 3,
                    zIndex: 1
                }).apply(sel[0]);
                util.removeClass(root, this.hideClass);
                this.registerEvents();
            }
        }
    }).inherits(Cell);
    module.exports = paginator;
});

/**
 * @fileOverview fdp's table module definition based on Cellula.
 * @description: defines datatable module
 * @namespace: FDP
 * @version: 1.0.0
 */
define("fdp/1.0.0/fdp-table", [ "fdp/1.0.0/fdp-namespace", "cellula/0.4.1/cellula", "cellula/0.4.1/cellula-namespace", "cellula/0.4.1/cellula-class", "cellula/0.4.1/cellula-util", "cellula/0.4.1/cellula-events", "cellula/0.4.1/cellula-cell", "cellula/0.4.1/cellula-element", "cellula/0.4.1/cellula-collection", "$" ], function(require, exports, module) {
    var FDP = require("fdp/1.0.0/fdp-namespace");
    var Cellula = require("cellula/0.4.1/cellula");
    var $ = require("$");
    var util = Cellula._util, Class = Cellula.Class, Element = Cellula.Element, Cell = Cellula.Cell, Coll = Cellula.Collection;
    var dataTable = FDP.DataTable = new Class("DataTable", {
        hideClass: "fn-hide",
        tableTpl: {
            head: null,
            body: null
        },
        tips: {
            noResult: null,
            error: null
        },
        tipNodes: {},
        initTip: function() {
            for (var n in this.tips) {
                this.tipNodes[n] = this.getNode(this.tips[n]);
            }
        },
        init: function(cfg) {
            this._super(cfg);
            this.initTip();
        },
        registerEvents: function() {},
        prepareTplConfig: function(data) {},
        show: function(bool) {
            var call = bool ? util.removeClass : util.addClass;
            call(this.rootNode, this.hideClass);
        },
        error: function() {
            this.show(false);
            util.removeClass(this.tipNodes.error, this.hideClass);
        },
        showNoResult: function() {
            this.show(false);
            util.removeClass(this.tipNodes.noResult, this.hideClass);
        },
        receiver: function(e) {
            if (!e) return;
            var targ = e.target, evt = e.name.split(":")[1];
            switch (evt) {
              case "TABLERENDER":
                this.render(arguments[1]);
                break;

              case "SYSTEMERROR":
                this.show(false);
                break;
            }
        },
        render: function(data) {
            var root = this.rootNode;
            util.addClass(this.tipNodes.error, this.hideClass);
            util.addClass(this.tipNodes.noResult, this.hideClass);
            if (data.length === 0) {
                this.showNoResult();
                this.emit("TABLEVIEW:NORESULT");
                return false;
            }
            var table = root.getElementsByTagName("table")[0], thead = table.getElementsByTagName("thead")[0], tbody = table.getElementsByTagName("tbody")[0], tpl = "";
            if (thead) table.removeChild(thead);
            if (tbody) table.removeChild(tbody);
            data = this.prepareTplConfig(data);
            var div = document.createElement("div");
            div.innerHTML = "<table><thead>" + util.parseTpl(this.tableTpl.head, data) + "</thead></table>";
            thead = div.getElementsByTagName("thead")[0];
            table.appendChild(thead);
            div.innerHTML = "<table><tbody>" + util.parseTpl(this.tableTpl.body, data) + "</tbody></table>";
            tbody = div.getElementsByTagName("tbody")[0];
            table.appendChild(tbody);
            this.show(true);
            this.registerEvents();
        }
    }).inherits(Cell);
    module.exports = dataTable;
});

/**
 * @fileOverview FDP definition.
 * @namespace: FDP
 * @version: 1.0.0
 */
define("fdp/1.0.0/fdp", [ "fdp/1.0.0/fdp-namespace", "fdp/1.0.0/fdp-formItem", "cellula/0.4.1/cellula", "cellula/0.4.1/cellula-namespace", "cellula/0.4.1/cellula-class", "cellula/0.4.1/cellula-util", "cellula/0.4.1/cellula-events", "cellula/0.4.1/cellula-cell", "cellula/0.4.1/cellula-element", "cellula/0.4.1/cellula-collection", "$", "fdp/1.0.0/fdp-form", "fdp/1.0.0/fdp-table", "fdp/1.0.0/fdp-paginator", "select/1.0.0/select" ], function(require, exports, module) {
    var _fdp = require("fdp/1.0.0/fdp-namespace"), _formItem = require("fdp/1.0.0/fdp-formItem"), _form = require("fdp/1.0.0/fdp-form"), _table = require("fdp/1.0.0/fdp-table"), _paginator = require("fdp/1.0.0/fdp-paginator");
    module.exports = _fdp;
});
