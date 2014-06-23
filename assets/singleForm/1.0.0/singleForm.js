define("singleForm/1.0.0/singleForm", [ "cellula/0.4.1/cellula", "cellula/0.4.1/cellula-namespace", "cellula/0.4.1/cellula-class", "cellula/0.4.1/cellula-util", "cellula/0.4.1/cellula-events", "cellula/0.4.1/cellula-cell", "cellula/0.4.1/cellula-element", "cellula/0.4.1/cellula-collection", "fdp/1.0.0/fdp", "fdp/1.0.0/fdp-namespace", "fdp/1.0.0/fdp-formItem", "$", "fdp/1.0.0/fdp-form", "fdp/1.0.0/fdp-table", "fdp/1.0.0/fdp-paginator", "select/1.0.0/select", "select/1.0.0/selectSkin.css" ], function(require, exports, module) {
    var Cellula = require("cellula/0.4.1/cellula");
    var FDP = require("fdp/1.0.0/fdp");
    var Select = require("select/1.0.0/select");
    var $ = require("$");
    var util = Cellula._util, Class = Cellula.Class, Element = Cellula.Element, Cell = Cellula.Cell, Coll = Cellula.Collection;
    /** 用户名 **/
    var UserName = new Class("UserName", {
        //require: false,
        type: "input",
        label: "姓名",
        init: function(conf) {
            this._super(conf);
        },
        rule: {
            isString: function() {
                if (!/[\u4e00-\u9fa5]+/.test(this.element.value)) {
                    this.errorMessage = this.label + "只能包含中文字符";
                    return false;
                }
                return true;
            }
        }
    }).inherits(FDP.FormItem);
    /* 性别 */
    var Sex = new Class("Sex", {
        type: "radio",
        label: "性别",
        init: function(conf) {
            this._super(conf);
            this._bindAll("click");
            $(this.element).click(this.click);
        },
        click: function(e) {
            this.triggerValidate();
        }
    }).inherits(FDP.FormItem);
    /* 爱好  */
    var Hobby = new Class("Hobby", {
        require: false,
        type: "checkbox",
        label: "爱好",
        init: function(conf) {
            this._super(conf);
            this._bindAll("choose");
            $(this.element).click(this.choose);
        },
        choose: function(e) {
            this.triggerValidate();
        }
    }).inherits(FDP.FormItem);
    /* 类别  */
    var Type = new Class("type", {
        type: "select",
        label: "类别",
        init: function(conf) {
            this._super(conf);
            new Select({
                width: 100,
                size: 3,
                zIndex: 2
            }).apply(this.element);
        }
    }).inherits(FDP.FormItem);
    /* memo */
    var Memo = new Class("Memo", {
        require: false,
        type: "textarea",
        label: "备注",
        defaultTip: "",
        maxLength: undefined,
        init: function(conf) {
            this._super(conf);
            this.defaultTip = this.tip;
            this.maxLength = parseInt(this.element.getAttribute("data-maxlength"), 10) * 2;
            this._bindAll("limitWord");
            $(this.element).on("change keyup", this.limitWord);
        },
        limitWord: function(e) {
            if ($.trim(this.element.value) == "") this.tip = this.defaultTip;
            this.triggerValidate();
        },
        rule: {
            limitWord: function() {
                var val = this.element.value;
                var len = val.replace(/[\u4E00-\u9FBF]/g, "BB").length;
                if (len > this.maxLength) {
                    this.errorMessage = "输入已超过" + Math.floor((len - this.maxLength) / 2) + "个字。";
                    return false;
                } else {
                    this.tip = "还可以输入" + Math.ceil((this.maxLength - len) / 2) + "个字。";
                    return true;
                }
            }
        }
    }).inherits(FDP.FormItem);
    /** collection **/
    var formElements = {
        username: new UserName({
            key: "username"
        }),
        sex: new Sex({
            key: "sex"
        }),
        hobby: new Hobby({
            key: "hobby"
        }),
        type: new Type({
            key: "type"
        }),
        memo: new Memo({
            key: "memo"
        })
    };
    var ResumeForm = new Class("ResumeForm", {
        type: "single",
        itemList: null,
        //submitBtn: '#J_submit',
        init: function(conf) {
            this._super(conf);
            this.collection = new Coll({
                type: FDP.FormItem
            });
            this.createItem();
        },
        createItem: function() {
            util.each(this.itemList, function(item) {
                this.register("FORMITEM:VALIDATE", item);
                //item.register('FORM:ISVALIDATE', this);
                this.collection.push(item);
            }, this);
        }
    }).inherits(FDP.Form);
    var resumeForm = new ResumeForm({
        key: "resumeForm",
        itemList: formElements
    });
    module.exports = resumeForm;
});