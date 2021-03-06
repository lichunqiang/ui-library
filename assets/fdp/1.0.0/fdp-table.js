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