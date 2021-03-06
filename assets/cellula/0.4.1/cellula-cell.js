define("cellula/0.4.1/cellula-cell", [ "cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's cell definition.
     * @description: defines cell
     * @namespace: Cellula
     */
    var cellula = require("cellula/0.4.1/cellula-namespace"), util = cellula._util;
    var cell = cellula.Cell = new cellula.Class("Cell", {
        key: undefined,
        rootNode: undefined,
        collection: undefined,
        _rootClass: "Cell",
        // Bind all of an object's methods to that object. Useful for ensuring that
        // all callbacks defined on an object belong to it.
        _bindAll: function() {
            for (var n = 0; n < arguments.length; n++) {
                this[arguments[n]] = util.bind(this[arguments[n]], this);
            }
            return this;
        },
        _setup: function(cfg) {
            if (util.isObject(cfg)) {
                for (var n in cfg) {
                    n in this && cfg.hasOwnProperty(n) && (!util.isFunction(cfg[n]) || n != "init") && (this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n]);
                }
            }
            //this.rootNode = null;
            this.rootNode = this.getRoot();
        },
        init: function(cfg) {
            this._setup(cfg);
        },
        getCollection: function() {
            return this.collection;
        },
        //TODO:
        setCollection: function() {},
        setElement: function() {},
        // TODO: rm this.getNode
        getNode: function(root, target, tag) {
            // id || unique style
            root = root || "";
            target = target || document;
            tag = tag || "div";
            var node = document.getElementById(root);
            if (node) return node;
            if (!root) return;
            var nodesArray = util.getElementsByClassName(root, target, tag);
            if (nodesArray.length === 1) return nodesArray[0];
        },
        // TODO: rm this.getNode
        getRoot: function() {
            // TODO: rm this.getNode
            return util.isEmpty(this.rootNode) ? this.getNode(this.key) : this.rootNode;
        },
        //TODO : delete
        show: function(flag, node) {
            // deprecated
            if (!this.rootNode) this.rootNode = this.getRoot();
            node = node || this.rootNode;
            if (flag) return util.removeClass(node, this.hideClass);
            util.addClass(node, this.hideClass);
        },
        error: function() {},
        // deprecated
        render: function() {
            this.registerEvents();
        },
        registerEvents: function() {}
    }).extend(cellula.Events);
    module.exports = cell;
});