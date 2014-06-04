define("build/cellula/0.4.1/cellula", [ "dest/cellula/0.4.1/cellula-namespace", "dest/cellula/0.4.1/cellula-class", "dest/cellula/0.4.1/cellula-util", "dest/cellula/0.4.1/cellula-events", "dest/cellula/0.4.1/cellula-cell", "dest/cellula/0.4.1/cellula-element", "dest/cellula/0.4.1/cellula-collection" ], function(require, exports, module) {
    var _cellula = require("dest/cellula/0.4.1/cellula-namespace"), _class = require("dest/cellula/0.4.1/cellula-class"), _util = require("dest/cellula/0.4.1/cellula-util"), _events = require("dest/cellula/0.4.1/cellula-events"), _cell = require("dest/cellula/0.4.1/cellula-cell"), _element = require("dest/cellula/0.4.1/cellula-element"), _collection = require("dest/cellula/0.4.1/cellula-collection");
    module.exports = _cellula;
});

define("dest/cellula/0.4.1/cellula-namespace", [], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's namespace definition.
     * @description: defines util,class,cell,element,collection
     * @version: 0.4.1
     */
    var Cellula = {};
    Cellula._cellula = Cellula;
    Cellula.version = "0.4.1";
    Cellula._util = {};
    Cellula.Class = undefined;
    Cellula.Events = undefined;
    Cellula.Cell = undefined;
    Cellula.Element = undefined;
    Cellula.Collection = undefined;
    module.exports = Cellula;
});

define("dest/cellula/0.4.1/cellula-class", [ "dest/cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    var cellula = require("dest/cellula/0.4.1/cellula-namespace");
    /**
     * @fileOverview Cellula Framework's core class constructor definition.
     * @description: an outstanding javascript oop class constructor
     * @namespace: Cellula
     */
    // for reflection
    var __UNIQUE_CLASS_SET__ = {}, __COUNTER__ = 0;
    var Class = cellula.Class = function() {
        "use strict";
        __COUNTER__++;
        var CLASS_NAME = "Class_" + __COUNTER__;
        var uniqueInstance;
        var extendList = [];
        var idCounter = 0, __ancestor__ = "", _args = arguments, instanceSet = {};
        var toString = Object.prototype.toString, objTest = /\bObject\b/, arrTest = /\bArray\b/;
        var _class = function() {
            if (!this.constructor.__initializing__) {
                this.__cid__ = "cellula_" + this._class() + "_instance_" + ++idCounter;
                // extend
                var i, l = extendList.length, ex, n;
                for (i = 0; i < l; i++) {
                    ex = new extendList[i]();
                    for (n in ex) this[n] = n in this ? this[n] : ex[n];
                }
                // create a new proto
                var isNew = _args[2] || _args[1];
                if (isNew === "NEW") {
                    var tmp, p, q;
                    for (p in this) {
                        // object
                        if (objTest.test(toString.call(this[p]))) {
                            tmp = {};
                            // limited for hasOwnProperty?
                            for (q in this[p]) {
                                tmp[q] = this[p][q];
                            }
                            this[p] = tmp;
                        }
                        // array
                        if (arrTest.test(toString.call(this[p]))) this[p] = this[p].slice();
                    }
                }
                // add to set
                instanceSet[this.__cid__] = this;
                if (this.init) {
                    return this.init.apply(this, arguments);
                }
            }
        };
        // another way to define fnTest for browsers like firefox that the 'toString' method do not suppot to out put the commented line.
        // fnTest = /xyz/.test(function () {
        //     //xyz;
        // }) ? /\b_super\b/ : /.*/;
        var prototype = _class.prototype, fnTest = /xyz/.test(function() {
            var xyz;
        }) ? /\b_super\b/ : /.*/;
        if (!_args[0]) _args[0] = CLASS_NAME;
        _class.prototype = objTest.test(toString.call(_args[0])) ? _args[0] : _args[1] && objTest.test(toString.call(_args[1])) ? _args[1] : {};
        _class.prototype.constructor = prototype.constructor;
        if (typeof _args[0] === "string") CLASS_NAME = _args[0];
        var _getClass = function() {
            return CLASS_NAME;
        };
        _class.prototype._class = _getClass;
        _class.prototype.__getAncestor__ = function() {
            return __ancestor__;
        };
        // 定义parent的 __base__ 属性，遍历parent的 __base__ 属性
        _class.prototype.__setAncestor__ = function(b) {
            __ancestor__ = b;
        };
        __ancestor__ = CLASS_NAME;
        if (!__UNIQUE_CLASS_SET__[CLASS_NAME]) __UNIQUE_CLASS_SET__[CLASS_NAME] = _class; else throw new Error("Duplicated Class!");
        _class.inherits = function(parent) {
            if (typeof parent === "function" && parent.prototype._class && parent.prototype._class.toString() === _getClass.toString()) {
                //            if(typeof parent === 'function'){
                // Instantiate a base class (but only create the instance, don't run the init constructor)
                parent.__initializing__ = true;
                var _super = parent.prototype, proto = new parent(), prop = this.prototype;
                prop.__setAncestor__(proto.__getAncestor__ && proto.__getAncestor__() || __ancestor__);
                // set Ancestor Class name
                for (var name in prop) {
                    proto[name] = name !== "constructor" && name !== "_class" && typeof prop[name] === "function" && typeof _super[name] === "function" && fnTest.test(prop[name]) ? function(name, fn) {
                        return function() {
                            var tmp = this._super;
                            this._super = _super[name];
                            var ret = fn.apply(this, arguments);
                            tmp ? this._super = tmp : delete this._super;
                            return ret;
                        };
                    }(name, prop[name]) : prop[name];
                }
                this.prototype = proto;
                this.prototype.constructor = this;
                delete parent.__initializing__;
                //                for(var t in parent){
                //                    if(!this[t]) this[t] = parent[t];
                //                }
                // for extend
                var tempEx = parent.getExtended();
                var i, l = tempEx.length;
                for (i = 0; i < l; i++) {
                    extendList.push(tempEx[i]);
                }
            } else throw new Error("parent class type error!");
            return this;
        };
        //        _class.extend = function(func){ // func should be a `function`
        //            if(typeof func === 'function') { // copy extend attributes
        //                var proto = this.prototype, ex = new func, n;
        //                for (n in ex) proto[n] = n in proto ? proto[n] : ex[n];
        //            }
        //            return this;
        //        };
        _class.extend = function(func) {
            // func should be a `function`
            if (typeof func === "function") {
                // copy extend attributes
                extendList.push(func);
            }
            return this;
        };
        _class.getExtended = function() {
            return extendList;
        };
        _class.shareInstance = function() {
            return uniqueInstance || (uniqueInstance = new _class());
        };
        _class.info = function() {
            return {
                name: CLASS_NAME,
                count: idCounter,
                instances: instanceSet,
                ancestor: _class.prototype.__getAncestor__(),
                parent: ""
            };
        };
        return _class;
    };
    Class.classFromString = function(nameStr) {
        if (typeof nameStr === "string" && __UNIQUE_CLASS_SET__[nameStr]) return __UNIQUE_CLASS_SET__[nameStr];
    };
    Class.getInfo = function(nameStr) {
        if (typeof nameStr === "string" && __UNIQUE_CLASS_SET__[nameStr]) return __UNIQUE_CLASS_SET__[nameStr].info();
    };
    module.exports = Class;
});

define("dest/cellula/0.4.1/cellula-util", [ "dest/cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's core utility library definition.
     * @description: a utility library for Cellula that provides a lot of the functional programming support
     * @namespace: Cellula
     *
     * thanks to underscore.js and json2.js
     */
    var cellula = require("dest/cellula/0.4.1/cellula-namespace"), util = cellula._util;
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    var slice = util.slice = ArrayProto.slice, toString = util.toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
    var breaker = util.breaker = "breaker is used to break a loop";
    var isArray = util.isArray = function(obj) {
        if (nativeIsArray) return nativeIsArray(obj);
        return toString.call(obj) === "[object Array]";
    };
    var isObject = util.isObject = function(obj) {
        //return obj === Object(obj);
        return obj == null ? false : toString.call(obj) === "[object Object]";
    };
    var isString = util.isString = function(obj) {
        return toString.call(obj) === "[object String]";
    };
    var isFunction = util.isFunction = function(obj) {
        return toString.call(obj) === "[object Function]";
    };
    var isArguments = util.isArguments = function(obj) {
        return toString.call(obj) === "[object Arguments]";
    };
    var isNodeList = util.isNodeList = function(obj) {
        return toString.call(obj) === "[object NodeList]";
    };
    var isClass = util.isClass = function(func) {
        // deprecated
        return isFunction(func) && func.toString() === classCtor().toString();
    };
    var has = util.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    var isEmpty = util.isEmpty = function(obj, isEnum) {
        // isEnum is a flag that be used to judge enumerable properties of an object
        if (!obj) return true;
        if (isArray(obj) || isString(obj)) return obj.length === 0;
        for (var key in obj) {
            if (!(isEnum && !has(obj, key))) return false;
        }
        return true;
    };
    var iterator = util.iterator = function(v) {
        return v;
    };
    // There is no guarantee that for...in will return the indexes in any particular order
    // and it will return all enumerable properties,
    // including those with non–integer names and those that are inherited.
    var each = util.each = function(obj, fn, context, breaker) {
        if (!obj) return;
        var key;
        if (breaker != null) {
            for (key in obj) {
                if (isObject(obj) && has(obj, key) || isArray(obj) && key in obj) {
                    // || obj === Object(obj)
                    if (fn.call(context, obj[key], key, obj) === breaker) return key;
                }
            }
        } else {
            if (nativeForEach && nativeForEach === obj.forEach) {
                obj.forEach(fn, context);
            } else {
                for (key in obj) {
                    if (isObject(obj) && has(obj, key) || isArray(obj) && key in obj) {
                        fn.call(context, obj[key], key, obj);
                    }
                }
            }
        }
    };
    // Return the results of applying the iterator to each element.
    // Delegates to ES 5 's native 'map' if available.
    var map = util.map = function(obj, fn, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeMap && nativeMap === obj.map) return obj.map(fn, context);
        each(obj, function(value, index, list) {
            results[results.length] = fn.call(context, value, index, list);
        });
        return results;
    };
    // Retrieve the names of an object's properties.
    // Delegates to ES 5 's native 'Object.keys'
    var keys = util.keys = function(obj) {
        if (nativeKeys) return nativeKeys(obj);
        if (obj !== Object(obj)) throw new TypeError("Invalid object");
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys[keys.length] = key;
        return keys;
    };
    // Retrieve the values of an object's properties.
    var values = util.values = function(obj) {
        return map(obj, iterator);
    };
    var emptyFunc = util.emptyFunc = function() {};
    var bind = util.bind = function(func, context) {
        var bound, args;
        if (nativeBind && nativeBind === func.bind) return nativeBind.call(func, context);
        // to fix the inconformity with es5
        if (!isFunction(func)) throw new TypeError();
        args = slice.call(arguments, 2);
        return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, slice.call(arguments));
            emptyFunc.prototype = func.prototype;
            var self = new emptyFunc();
            var result = func.apply(self, slice.call(arguments));
            if (Object(result) === result) return result;
            return self;
        };
    };
    // Safely convert anything iterable into a real, live array.
    var toArray = util.toArray = function(obj) {
        if (!obj) return [];
        if (isArray(obj) || isArguments(obj)) return slice.call(obj);
        // return a new array, not obj itself
        return values(obj);
    };
    var toArrayByLen = util.toArrayByLen = function(obj) {
        var ret = [];
        if (obj.length) for (var ii = 0; ii < obj.length; ret[ii] = obj[ii++]) {}
        return ret;
    };
    var mix = util.mix = function() {
        var ret = arguments[0] || {};
        for (var i = 1, l = arguments.length; i < l; i++) {
            var t = arguments[i];
            if (isObject(t) || isArray(t)) {
                // if Array is not allowed --> isObject(t)
                for (var n in t) {
                    ret[n] = t[n];
                }
            }
        }
        return ret;
    };
    var deepMix = util.deepMix = function() {
        var ret = arguments[0] || {};
        for (var i = 1, l = arguments.length; i < l; i++) {
            var t = arguments[i];
            if (isObject(t) || isArray(t)) {
                //if Array is not allowed --> util.isObject(t)
                for (var n in t) {
                    ret[n] = isObject(ret[n]) && isObject(t[n]) ? deepMix({}, ret[n], t[n]) : t[n];
                }
            }
        }
        return ret;
    };
    var copy = util.copy = function(obj) {
        if (!(isObject(obj) || isArray(obj))) return obj;
        return isArray(obj) ? obj.slice() : mix({}, obj);
    };
    var aspect = util.aspect = function(obj) {
        if (!util.isObject(obj)) throw new Error("invalid parameter!");
        var __aspect__ = {
            //afterReturning
            //afterThrowing
            //destroy
            before: function(name, func, context) {
                if (!util.isString(name) || !util.isFunction(func)) throw new Error("invalid parameter!");
                var origin = obj[name], args = context ? util.slice.call(arguments, 3) : [];
                obj[name] = function() {
                    func.apply(context || obj, args);
                    return origin.apply(obj, arguments);
                };
            },
            after: function(name, func, context) {
                if (!util.isString(name) || !util.isFunction(func)) throw new Error("invalid parameter!");
                var origin = obj[name], args = context ? util.slice.call(arguments, 3) : [];
                obj[name] = function() {
                    var ret = origin.apply(obj, arguments);
                    func.apply(context || obj, args);
                    return ret;
                };
            },
            wrap: function(name, func) {
                // around
                if (!util.isString(name) || !util.isFunction(func)) throw new Error("invalid parameter!");
                var origin = obj[name];
                obj[name] = function() {
                    // arguments belongs to origin
                    var temp = obj._origin;
                    obj._origin = origin;
                    var ret = func.apply(obj, arguments);
                    obj._origin = temp;
                    return ret;
                };
            }
        };
        return __aspect__;
    };
    // console
    var nativeConsole = window ? window.console || {} : {};
    each([ "log", "info", "warn", "error" ], function(v) {
        util[v] = nativeConsole[v] && nativeConsole[v].apply ? function() {
            nativeConsole[v].apply(nativeConsole, toArrayByLen(arguments));
        } : emptyFunc;
    });
    var makeTpl = util.makeTpl = function(tpl, data) {
        var newTpl = tpl;
        for (n in data) {
            var reg = new RegExp("(\\$\\-\\{" + n + "\\})", "g");
            newTpl = newTpl.replace(reg, data[n]);
        }
        // replace extra placeholders with '' || if there's no matching data for it
        var r = new RegExp("(\\$\\-\\{[/#a-zA-Z0-9]+\\})", "g");
        newTpl = newTpl.replace(r, "");
        return newTpl;
    };
    var parseTpl = util.parseTpl = function(tpl, data) {
        if (!isString(tpl) || !isObject(data)) return tpl;
        var newTpl = tpl, tagReg = new RegExp("\\$\\-\\{#(.*)\\}");
        function parse(prop) {
            var regHead = new RegExp("(\\$\\-\\{#" + prop + "\\})", "g"), regTail = new RegExp("(\\$\\-\\{/" + prop + "\\})", "g"), reg = new RegExp("(\\$\\-\\{#" + prop + "\\})(.*)(\\$\\-\\{/" + prop + "\\})", "g");
            if (data[prop] === false || !data[prop]) {
                newTpl = newTpl.replace(reg, "");
            } else if (isArray(data[prop])) {
                var r = reg.exec(tpl);
                if (r) {
                    var t = r[2], s = "", d = data[prop];
                    for (var i = 0; i < d.length; i++) {
                        s += this.parseTpl.call(this, t, d[i]);
                    }
                    newTpl = newTpl.replace(reg, s);
                }
            } else {
                newTpl = newTpl.replace(regHead, "").replace(regTail, "");
            }
            return newTpl;
        }
        for (var n in data) {
            //newTpl = parse.call(this, n, newTpl);
            parse.call(this, n);
        }
        while (tagReg.test(newTpl)) {
            var p = tagReg.exec(newTpl)[1];
            p = p.substring(0, p.indexOf("}"));
            // to be strict
            parse.call(this, p);
        }
        return makeTpl(newTpl, data);
    };
    util.JSON = {};
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        // table of character substitutions
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, // The loop counter.
        k, // The member key.
        v, // The member value.
        length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
          case "string":
            return quote(value);

          case "number":
            return isFinite(value) ? String(value) : "null";

          case "boolean":
          case "null":
            return String(value);

          case "object":
            if (!value) {
                return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }
    util.JSON.stringify = function(value, replacer, space) {
        var i;
        gap = "";
        indent = "";
        if (typeof space === "number") {
            for (i = 0; i < space; i += 1) {
                indent += " ";
            }
        } else if (typeof space === "string") {
            indent = space;
        }
        rep = replacer;
        if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
            throw new Error("JSON.stringify");
        }
        return str("", {
            "": value
        });
    };
    util.JSON.parse = function(text, reviver) {
        var j;
        function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === "object") {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }
        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            j = eval("(" + text + ")");
            return typeof reviver === "function" ? walk({
                "": j
            }, "") : j;
        }
        throw new SyntaxError("JSON.parse");
    };
    var trim = util.trim = function(s) {
        return isString(s) ? s.replace(/^\s+/g, "").replace(/\s+$/g, "") : s;
    };
    var hasClass = util.hasClass = function(node, className) {
        if (node && node.nodeType == 1) {
            className = " " + className + " ";
            return (" " + node.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1;
        }
        return false;
    };
    var addClass = util.addClass = function(node, className) {
        if (node && node.nodeType == 1) {
            if (!trim(node.className)) return node.className = className;
            if (!hasClass(node, className)) node.className = trim(node.className) + " " + className;
        }
    };
    var removeClass = util.removeClass = function(node, className) {
        if (hasClass(node, className)) node.className = trim((" " + node.className + " ").replace(/[\n\t\r]/g, " ").replace(" " + className + " ", " "));
    };
    var getElementsByClassName = util.getElementsByClassName = function(searchClass, node, tag) {
        node = node || document;
        if (node.getElementsByClassName) {
            return node.getElementsByClassName(searchClass);
        } else {
            tag = tag || "*";
            var ret = [], els = node.getElementsByTagName(tag), //var els =  (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag);
            i = els.length, reg = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
            while (--i >= 0) {
                if (reg.test(els[i].className)) {
                    ret.push(els[i]);
                }
            }
            return ret;
        }
    };
    module.exports = util;
});

define("dest/cellula/0.4.1/cellula-events", [ "dest/cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's event definition.
     * @description: defines the Event Object
     * @namespace: Cellula
     */
    var cellula = require("dest/cellula/0.4.1/cellula-namespace"), util = cellula._util, idCounter = 0, idFlagHead = "cellula_", idFlagTail = "_instance_", reg = new RegExp("^" + idFlagHead + ".*" + idFlagTail + "\\d+$");
    function _check(obj) {
        return obj && reg.test(obj.__cid__);
    }
    function Events() {
        this.__cid__ = idFlagHead + "Events" + idFlagTail + ++idCounter;
        var list = {}, // name:[]
        followers = {}, interfaces = {}, uniqueMapping = {};
        //{instance:{name:'name'}, ...} for detect multiple cases
        this._check = _check;
        this._apis = {};
        // {apiname:'funcname' || function}
        this._getMapping = function() {
            return util.copy(list);
        };
        this.getFollowers = function() {
            return util.copy(followers);
        };
        this._getApiList = function() {
            return util.copy(interfaces);
        };
        this.follow = function(whom, events, opt) {
            // just ensure that target's any activity would make the follower known
            if (!_check(whom)) return "Not Support!";
            // log.warn
            // all - follow all events
            if (!events) return whom.register(this);
            // {multiple:false}
            // string - follow the specific event
            // array - follow an array of specific events
            whom.register(events, this);
        };
        this.unfollow = function(whom, events) {
            if (!_check(whom)) return "Not Support!";
            // log.warn
            // all - follow all events
            // TODO: delete all events mappings with this follower ???
            if (!events) return whom.cancel(this);
            // string - follow the specific event
            // array - follow an array of specific events
            whom.cancel(events, this);
        };
        this.register = function(events, context, opt) {
            // opt - multiple:false
            // all - register all events
            // TODO: with follow
            if (_check(events)) return followers[events.__cid__] = events;
            if (!_check(context)) return "Not Support!";
            // log.warn
            // string
            if (util.isString(events)) events = [ events ];
            // array
            if (util.isArray(events)) {
                util.each(events, function(v) {
                    var arr = list[v] = list[v] || [];
                    arr.push(context);
                    // opt - multiple:false
                    if (opt && opt["multiple"] == false) {
                        var l = arr.length, i;
                        for (i = 0; i < l - 1; i++) {
                            if (arr[i] === context) {
                                arr.pop();
                                break;
                            }
                        }
                    }
                });
            }
        };
        this.cancel = function(events, context) {
            // all - cancel all events of a specific context (follower)
            // TODO: with unfollow
            if (_check(events)) return delete followers[events.__cid__];
            // all clear mapping list
            if (!events) return list = {};
            // events without context
            if (!context) {
                // events without context - string
                if (util.isString(events)) events = [ events ];
                // events without context - array
                if (util.isArray(events)) return util.each(events, function(v) {
                    delete list[v];
                });
            }
            // events with context
            // string
            if (util.isString(events)) events = [ events ];
            // array
            if (util.isArray(events)) {
                var l, i, ret, temp;
                util.each(events, function(v) {
                    temp = list[v];
                    ret = [];
                    for (i = 0, l = temp.length; i < l; i++) {
                        // a loop is much faster
                        if (temp[i] !== context) ret.push(temp[i]);
                    }
                    list[v] = ret;
                });
            }
        };
        this.emit = function(events) {
            var follower, other, calls, event, pack, args = util.slice.call(arguments, 1, arguments.length);
            // slice could be optimized
            // all
            if (!events) events = util.keys(list);
            // string
            if (util.isString(events)) events = [ events ];
            // array
            if (util.isArray(events)) {
                while (event = events.shift()) {
                    pack = {
                        target: this,
                        name: event
                    };
                    other = util.copy(followers);
                    calls = util.copy(list[event]);
                    if (calls) {
                        while (follower = calls.shift()) {
                            follower.receiver.apply(follower, [ pack ].concat(args));
                            delete other[follower.__cid__];
                        }
                    }
                    util.each(other, function(v) {
                        v.receiver.apply(v, [ pack ].concat(args));
                    });
                }
            }
        };
        this.receiver = function() {};
        // unique response interface
        function makeNode(func, context) {
            return {
                func: func,
                context: context,
                next: null
            };
        }
        function makeLinkedList(head) {
            return {
                head: head,
                tail: head,
                push: function(node) {
                    if (!this.head) (this.head = node) && (this.tail = node); else (this.tail.next = node) && (this.tail = node);
                    return this;
                }
            };
        }
        this.registerApi = function(name, context, alias) {
            // @type name could be `string` or `array`, alias should be `string`
            // if(!this._apis) return util.warn('invalid instance!');
            if (!context) return util.warn("invalid parameter!");
            if (alias && !util.isString(alias)) return util.warn("invalid parameter!");
            if (!util.isArray(name)) name = [ name ];
            util.each(name, function(v) {
                if (util.isString(v)) {
                    var all = alias ? [ v, alias ] : [ v ], func = context._apis[v], _cid = context.__cid__;
                    if (util.isString(func)) func = context[v];
                    if (util.isFunction(func)) {
                        util.each(all, function(val) {
                            uniqueMapping[_cid] = uniqueMapping[_cid] || {};
                            uniqueMapping[_cid][val] = val;
                            var node = makeNode(func, context);
                            if (!interfaces[val]) interfaces[val] = makeLinkedList(node); else interfaces[val].push(node);
                        });
                    } else util.warn("the " + v + " method does not exist in context's api list!");
                } else return util.warn("invalid parameter!");
            }, this);
        };
        this.applyApi = function(name) {
            // @type `string`, `apiName`, `apiName:KeyWords`
            if (!name || !util.isString(name)) return util.warn("invalid parameter!");
            var itr, ret = [], sp = ":", names = name.split(sp), val = names[0], key = names[1], head = interfaces[val], args = util.slice.call(arguments, 1);
            if (head) {
                itr = head.head;
                while (itr) {
                    if (!key) {
                        ret.push(itr.func.apply(itr.context, args)) && (itr = itr.next);
                        continue;
                    }
                    if (itr.context.__cid__.indexOf(key) > -1) ret.push(itr.func.apply(itr.context, args));
                    itr = itr.next;
                }
            }
            return ret;
        };
        this.removeApi = function(name, context) {
            // `name` or `alias` string @type
            if (!name) return util.warn("invalid parameter!");
            if (!util.isArray(name)) name = [ name ];
            // pass `all` to clear the list
            if (name[0] === "all") return interfaces = {};
            function removeContext(nameArr, targ) {
                util.each(nameArr, function(v) {
                    if (interfaces[v]) {
                        var itr, pre;
                        itr = pre = interfaces[v].head;
                        while (itr) {
                            if (itr.context == targ) {
                                if (itr == pre) interfaces[v].head = pre = itr.next; else pre.next = itr.next;
                            } else pre = itr;
                            itr = itr.next;
                        }
                    }
                });
            }
            // pass `context` to clear context's api
            if (_check(name[0])) return removeContext(uniqueMapping[name[0].__cid__], name[0]);
            if (!context) util.each(name, function(v) {
                delete interfaces[v];
            }); else removeContext(name, context);
        };
    }
    cellula.Events = Events;
    module.exports = Events;
});

define("dest/cellula/0.4.1/cellula-cell", [ "dest/cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's cell definition.
     * @description: defines cell
     * @namespace: Cellula
     */
    var cellula = require("dest/cellula/0.4.1/cellula-namespace"), util = cellula._util;
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
            this.rootNode = null;
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

define("dest/cellula/0.4.1/cellula-element", [ "dest/cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's element definition.
     * @description: defines element
     * @namespace: Cellula
     */
    var cellula = require("dest/cellula/0.4.1/cellula-namespace"), util = cellula._util;
    function __get__(data, prop) {
        // returns all elements by default, prop is optional,
        // returns all elements by default
        if (!prop) return util.mix({}, data);
        // returns the specific element with the given prop, if element is not exist returns undefiend
        if (util.isString(prop)) return data[prop];
        // returns the specific elements with the given props in an array
        if (util.isArray(prop)) return util.map(prop, function(v) {
            return data[v];
        });
    }
    var element = cellula.Element = new cellula.Class("Element", {
        key: "",
        _data: {},
        //_isValidated : false,
        //silent : false,
        _previous: {},
        storage: {
            // localStorage
            toStorage: function(prop) {
                // save _data's attributes to localStorage
                var storage, __self__ = this.__self__;
                if (storage = window.localStorage) {
                    if (!window.JSON) window.JSON = util.JSON;
                    function iterator(v, i) {
                        storage.setItem(i, typeof v !== "object" ? v : JSON.stringify(v));
                    }
                    // all
                    if (!prop) return util.each(__self__._data, iterator);
                    // string
                    // util.isString(prop) && this.has(prop)
                    if (__self__.has(prop)) return iterator(__self__.get(prop), prop);
                    // array
                    if (util.isArray(prop)) {
                        return util.each(prop, function(v) {
                            if (this.has(v)) iterator(this.get(v), v);
                        }, __self__);
                    }
                } else {}
            },
            //set:function (prop) { },
            get: function(prop) {
                // returns all values in Storage object
                var _cached = {}, storage, __self__ = this.__self__;
                if (storage = window.localStorage) {
                    util.each(__self__._data, function(v, i) {
                        if (i in storage) _cached[i] = storage[i];
                    });
                    return __get__(_cached, prop);
                }
            }
        },
        _setup: function(cfg) {
            this.storage.__self__ = this;
            if (util.isObject(cfg)) {
                for (var n in cfg) {
                    n in this && util.has(cfg, n) && (!util.isFunction(cfg[n]) || n != "init") && (this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n]);
                }
            }
        },
        init: function(cfg) {
            this._setup(cfg);
            if (!this.key) this.key = this.__cid__;
        },
        set: function(key, value, opt) {
            //if(!util.isObject(cfg['value'])) throw 'data structure error!';
            if (!key) throw new Error("data structure error!");
            var attrs, ret = -1;
            // Handle both "key", "value" and {key: value} -style arguments.
            if (util.isObject(key)) {
                attrs = key;
                opt = value;
            }
            if (util.isString(key)) {
                attrs = {};
                attrs[key] = value;
            }
            attrs = util.deepMix({}, this._data, attrs);
            //attrs = util.mix({}, this._data, attrs);
            ret = this.validate(attrs, this);
            if (ret !== undefined) {
                // validate method should not return anything if there's no error
                //this.errHandler(ret);
                // trigger error message
                //this.trigger('error');
                // this.applyInterface();
                return ret;
            }
            // data backup
            this._previous = util.mix({}, this._data);
            //this._data = util.mix({}, attrs);
            this._data = attrs;
            //this._isValidated = true;
            //return true;
            return this;
        },
        has: function(key) {
            return this._data.hasOwnProperty(key);
        },
        reset: function(obj, opt) {
            // empty the _data attribute by default when no arguments detected
            if (!obj) return (this._previous = util.mix({}, this._data)) && (this._data = {});
            if (util.isObject(obj)) {
                var attrs = util.mix({}, obj), ret = this.validate(attrs, this);
                if (ret !== undefined) {
                    // validate method should not return anything if there's no error
                    // trigger error message
                    this.trigger("error");
                    // this.applyInterface();
                    return false;
                }
                this._previous = util.mix({}, this._data);
                //this._data = util.mix({}, attrs);
                this._data = attrs;
                return true;
            }
            return false;
        },
        removeAttribute: function() {},
        save: function() {},
        destroy: function() {
            return this.applyInterface("Collection.remove", this.key);
        },
        //errHandler : function(msg){}, // deprecated
        validate: function(data, el) {},
        getPrevious: function(prop) {
            // returns all elements by default, prop is optional,
            return __get__(this._previous, prop);
        },
        get: function(prop) {
            // returns all elements by default, prop is optional,
            return __get__(this._data, prop);
        }
    });
    module.exports = element;
});

define("dest/cellula/0.4.1/cellula-collection", [ "dest/cellula/0.4.1/cellula-namespace" ], function(require, exports, module) {
    /**
     * @fileOverview Cellula Framework's collection definition.
     * @description: it could be a collection of either elements or cells
     * @namespace: Cellula
     */
    var cellula = require("dest/cellula/0.4.1/cellula-namespace"), util = cellula._util;
    var collection = cellula.Collection = new cellula.Class("Collection", {
        type: cellula.Element,
        //undefined,
        _index: [],
        // [{key:'key',cid:'cid'}...]
        _elements: {},
        //{key:'key',el:element}
        _initCfg: function(cfg) {
            if (util.isObject(cfg)) {
                for (var n in this) {
                    if (cfg.hasOwnProperty(n)) {
                        this[n] = util.isObject(this[n]) && util.isObject(cfg[n]) ? util.deepMix({}, this[n], cfg[n]) : cfg[n] ? cfg[n] : this[n];
                    }
                }
            }
        },
        _elConfig: function(obj) {
            if (util.isObject(obj)) {
                var t = new this.type(obj);
                t.registerInterface("remove", this);
                //if(t._isValidated){
                this._elements[t.key] = t;
                this._index.push(t.key);
            }
        },
        init: function(cfg, els) {
            //if(!util.isInstanceOfClass(this.type)) throw new TypeError('"type" is invalid!');
            this._initCfg(cfg);
            if (util.isArray(els)) {
                util.each(els, function(obj) {
                    this._elConfig(obj);
                }, this);
            } else this._elConfig(els);
        },
        clear: function() {
            this._index = [];
            this._elements = {};
        },
        // getHash : toJSON ???
        reverse: function() {
            this._index.reverse();
            return this;
        },
        size: function() {
            return this._index.length;
        },
        add: function(el, toIndex) {
            toIndex = parseInt(toIndex);
            if (isNaN(toIndex)) return this.push(el);
            if (el instanceof this.type) {
                this._elements[el.key] = el;
                if (toIndex <= 0) return this._index.unshift(el.key);
                if (toIndex >= this._index.length) return this._index.push(el.key);
                var t = this._index.concat([]), s = t.splice(toIndex);
                t.push(el.key);
                this._index = t.concat(s);
            }
            return this._index.length;
        },
        remove: function(el) {
            // key,el,  cid(deprecated, cause key is always asigned)
            if (el) {
                // key
                if (util.isString(el)) {
                    delete this._elements[el];
                    util.each(this._index, function(v, i) {
                        if (v == el) this._index.splice(i, 1);
                    }, this);
                }
                // el
                if (el instanceof this.type) {
                    delete this._elements[el.key];
                    util.each(this._index, function(v, i) {
                        if (v == el.key) this._index.splice(i, 1);
                    }, this);
                }
            }
            return this;
        },
        shift: function() {},
        push: function(el) {
            if (el instanceof this.type) {
                this._elements[el.key] = el;
                return this._index.push(el.key);
            }
        },
        pop: function() {
            var key = this._index.pop(), el = this._elements[key];
            delete this._elements[key];
            return el;
        },
        get: function(key) {
            // returns all elements by default, key is optional,
            // returns all elements by default
            // key === undefined ?
            if (!key) return util.values(util.mix({}, this._elements));
            // returns the specific element with the given key, if element is not exist returns undefiend
            if (util.isString(key)) return this._elements[key] ? this._elements[key] : this._elements[this._index[key]];
            // returns the specific elements with the given keys in an array
            if (util.isArray(key)) {
                var t = [];
                util.each(key, function(v) {
                    if (util.isString(v)) t.push(this._elements[v] ? this._elements[v] : this._elements[this._index[v]]);
                }, this);
                return t;
            }
        },
        save: function(key) {
            var els = this._elements, ret, i, l, n;
            if (this.type.prototype.__getAncestor__() === "Cell") {
                // if cell apply cell.collecton.save
                if (util.isString(key)) return els[key] && els[key].collection ? els[key].collection.save() : false;
                if (util.isArray(key)) {
                    for (i = 0, l = key.length; i < l; i++) {
                        ret = els[key[i]] && els[key[i]].collection ? els[key[i]].collection.save() : false;
                        if (!ret) return ret;
                    }
                }
                // key === undefined?
                if (!key) {
                    for (n in els) {
                        ret = els[n] && els[n].collection ? els[n].collection.save() : false;
                        if (!ret) return ret;
                    }
                }
                return true;
            }
            if (this.type.prototype.__getAncestor__() === "Element") {
                // if element
                // saves all elements by default, or [key1, key2, key3...] is optional,
                // apply element's save method,if no error returns true
                if (util.isString(key)) return els[key] ? els[key].save() : false;
                if (util.isArray(key)) {
                    for (i = 0, l = key.length; i < l; i++) {
                        ret = els[key[i]] ? els[key[i]].save() : false;
                        if (!ret) return ret;
                    }
                }
                // key === undefined?
                if (!key) {
                    for (n in els) {
                        ret = els[n] ? els[n].save() : false;
                        if (!ret) return ret;
                    }
                }
                return true;
            }
            return false;
        }
    }, "NEW");
    module.exports = collection;
});
