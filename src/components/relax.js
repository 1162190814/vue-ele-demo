/*!
* relax javascript library v0.0.1
* by LuoShuai
* Date: 2019-7-31 11:47:37
*/
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.relax = factory();
})(this, function () {
    'use strict';

    var op = Object.prototype;

    var ohasOwn = op.hasOwnProperty;

    var $library = {
        jQuery: window.jQuery,
        Vue: window.Vue
    };

    var relax = function (selector, context) {
        return new relax.fn.init(selector, context);
    };

    relax.fn = relax.prototype = {
        constructor: relax,
        version: "0.0.1",
        init: function (selector, context) {
            try {
                return $library.jQuery(selector, context);
            } catch (e) {
                if (!$library.jQuery) {
                    throw "jQuery library is loaded!";
                } else {
                    relax.warn(e);
                }
            }
        }
    };

    relax.fn.init.prototype = relax.fn;

    var _relax = window.relax;

    window.relax = relax;

    relax.noConflict = function (deep) {
        if (deep && window.relax === relax) {
            window.relax = _relax;
        }
        return relax;
    };

    function vue(options) {
        try {
            return new $library.Vue(options);
        } catch (e) {
            if (!$library.Vue) {
                throw "Vue library is loaded!";
            } else {
                relax.warn(e);
            }
        }
    }

    vue.extend = function (options) {
        try {
            return $library.Vue.extend(options);
        } catch (e) {
            if (!$library.Vue) {
                throw "Vue library is loaded!";
            } else {
                relax.warn(e);
            }
        }
    };

    vue.component = function (tagName, options) {
        try {
            return $library.Vue.component(tagName, options);
        } catch (e) {
            if (!$library.Vue) {
                throw "Vue library is loaded!";
            } else {
                relax.warn(e);
            }
        }
    };

    function library(name, lib) {
        var maxLen = arguments.length;
        if (maxLen === 2) {
            $library[name] = lib;
        } else if (maxLen === 1) {
            return $library[name];
        } else {
            return $library;
        }
    }

    function shadowCopy(destination, source) {
        for (var property in source) {
            if (ohasOwn.call(source, property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    }

    var vmodels = {};
    var queue = {};

    var sp = String.prototype;

    //判定是否是原生函数
    var rnative = /\[native code\]/;

    var isNative = function (source, prop) {
        return !ohasOwn.call(source, prop) || !rnative.test(source[prop]);
    };

    //Refer to https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trim
    if (isNative(sp, "trim")) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        sp.trim = function () {
            return this.replace(rtrim, "");
        };
    }

    var toString = op.toString;

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    if (isNative(Array, "isArray")) {
        Array.isArray = function (arr) {
            return toString.call(arr) === "[object Array]";
        };
    }

    var ap = Array.prototype;

    var doc = window.document;

    var rootNode = doc.documentElement;

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    var aslice = ap.slice;
    try {
        // Can't be used with DOM elements in IE < 9
        aslice.call(rootNode);
    } catch (e) {
        ap.slice = function (start, end) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.slice called on null or undefined");
            }

            end = arguments.length !== 2 ? this.length : end;

            if (Array.isArray(this)) {
                return aslice.call(this, start, end);
            }

            var len = this.length >>> 0;

            start = start || 0;
            start = start >= 0 ? start : Math.max(0, len + start);

            var upTo = typeof end === "number" ? Math.min(end, len) : len;
            upTo = end < 0 ? len + end : upTo;

            var size = upTo - start;
            var result = new Array(len);

            if (size > 0) {
                var i = 0;
                if (this.charAt) {
                    for (; i < size; i++) {
                        result[i] = this.charAt(start + i);
                    }
                } else {
                    for (; i < size; i++) {
                        result[i] = this[start + i];
                    }
                }
            }

            return result;
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    if (isNative(ap, "forEach")) {
        ap.forEach = function (callback, thisArg) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.forEach called on null or undefined");
            }

            if (typeof callback !== "function") {
                throw new TypeError("callback is not a function");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in O) {
                    callback.call(thisArg, O[i], i, O);
                }
            }
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    if (isNative(ap, "map")) {
        ap.map = function (callback, thisArg) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.map called on null or undefined");
            }

            if (typeof callback !== "function") {
                throw new TypeError("callback is not a function");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            var result = [];
            for (var i = 0; i < len; i++) {
                if (i in O) {
                    result[i].push(callback.call(thisArg, O[i], i, O));
                }
            }

            return result;
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    if (isNative(ap, "some")) {
        ap.some = function (callback, thisArg) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.some called on null or undefined");
            }

            if (typeof callback !== "function") {
                throw new TypeError("callback is not a function");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in O && callback.call(thisArg, O[i], i, O)) {
                    return true;
                }
            }

            return false;
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    if (isNative(ap, "filter")) {
        ap.filter = function (callback, thisArg) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.filter called on null or undefined");
            }

            if (typeof callback !== "function") {
                throw new TypeError("callback is not a function");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            var result = [];
            for (var i = 0; i < len; i++) {
                if (i in O && callback.call(thisArg, O[i], i, O)) {
                    result.push(O[i]);
                }
            }

            return result;
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
    if (isNative(ap, "every")) {
        ap.every = function (callback, thisArg) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.every called on null or undefined");
            }

            if (typeof callback !== "function") {
                throw new TypeError("callback is not a function");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in O && !callback.call(thisArg, O[i], i, O)) {
                    return false;
                }
            }

            return true;
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    if (isNative(ap, "indexOf")) {
        ap.indexOf = function (searchElement, fromIndex) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.indexOf called on null or undefined");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var i = +fromIndex || 0;

            if (Math.abs(i) === Infinity) {
                i = 0;
            }

            if (i >= len) {
                return -1;
            }

            i = Math.max(i >= 0 ? i : len - Math.abs(i), 0);
            for (; i < len; i++) {
                if (i in O && O[i] === searchElement) {
                    return i;
                }
            }

            return -1;
        };
    }

    //Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    if (isNative(ap, "lastIndexOf")) {
        ap.lastIndexOf = function (searchElement, fromIndex) {
            if (this === null || this === void 0) {
                throw new TypeError("Array.prototype.lastIndexOf called on null or undefined");
            }

            var O = Object(this);
            var len = O.length >>> 0;

            if (len === 0) {
                return -1;
            }

            var i = arguments.length > 1 ? +fromIndex : len - 1;

            if (i === -(1 / 0)) {
                return -1;
            } else if (i === 1 / 0 || i >= len) {
                i = len - 1;
            }

            i = Math.min(i >= 0 ? i : len - Math.abs(i), len - 1);
            for (; i >= 0; i--) {
                if (i in O && O[i] === searchElement) {
                    return i;
                }
            }

            return -1;
        };
    }

    var enumBUG = !{ toString: null }.propertyIsEnumerable("toString");

    //Refer to https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (isNative(Object, "keys")) {
        var noEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];

        var len = noEnums.length;

        Object.keys = function (obj) {
            if (obj === null || obj === void 0 || typeof obj !== "object" && typeof obj !== "function") {
                throw new TypeError("Object.keys called on non-object");
            }

            var result = [];

            for (var o in obj) {
                if (ohasOwn.call(obj, o)) {
                    result.push(o);
                }
            }

            if (enumBUG) {
                for (var i = 0; i < len; i++) {
                    if (ohasOwn.call(obj, noEnums[i])) {
                        result.push(noEnums[i]);
                    }
                }
            }

            return result;
        };
    }

    //Refer to https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (isNative(Function.prototype, "bind")) {
        Function.prototype.bind = function (scope) {
            if (arguments.length < 2 && scope === void 0) {
                return this;
            }

            var fn = this;
            var argv = arguments;
            return function () {
                var args = [];
                var i = void 0;
                for (i = 1; i < argv.length; i++) {
                    args.push(argv[i]);
                }

                for (i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return fn.apply(scope, args);
            };
        };
    }

    //用于拆分字符串
    var rword = /[^, ]+/g;

    function noop() {}

    if (!ohasOwn.call(window, "console") || typeof window.console !== "object") {
        var _console = {
            memory: {}
        };

        "assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".replace(rword, function (fn) {
            _console[fn] = noop;
        });

        window["console"] = _console;
    }

    //判定是否是函数
    var rfunction = /^\s*\bfunction\b/;

    var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/;
    var isEnumerable = Object.propertyIsEnumerable;

    function isArrayLike(obj) {
        if (!obj) return false;
        var n = obj.length;
        if (n === n >>> 0) {
            //检测length属性是否为非负整数
            var _type = toString.call(obj);
            if (rarraylike.test(_type)) {
                return true;
            }
            if (_type !== "[object Object]") {
                return false;
            }
            try {
                if (isEnumerable.call(obj, "length") === false) {
                    //如果是原生对象
                    return rfunction.test(obj.item || obj.callee);
                }
                return true;
            } catch (e) {
                //IE的NodeList直接抛错
                return !obj.window; //IE6-8 window
            }
        }
        return false;
    }

    /**
     * @description 模拟forEach循环,并在fn返回结果为false时停止循环
     * @param {Array|Object} iteration  将要被迭代的对象支持伪数组
     * @param {Function} fn  每次迭代时的将要触发的回调函数
     */
    function forEach(iteration, fn) {
        if (iteration) {
            //排除null, undefined
            if (isArrayLike(iteration)) {
                for (var i = 0, n = iteration.length; i < n; i++) {
                    if (fn(iteration[i], i) === false) {
                        break;
                    }
                }
            } else {
                for (var o in iteration) {
                    if (ohasOwn.call(iteration, o) && fn(iteration[o], o) === false) {
                        break;
                    }
                }
            }
        }
    }

    forEach([sp, Boolean.prototype, Number.prototype], function (p) {
        if (isNative(p, "toJSON")) {
            p.toJSON = function () {
                return this.valueOf();
            };
        }
    });

    if (isNative(Date.prototype, "toJSON")) {
        var fix = function (n) {
            return n < 10 ? "0" + n : n;
        };

        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + fix(this.getUTCMonth() + 1) + "-" + fix(this.getUTCDate()) + "T" + fix(this.getUTCHours()) + ":" + fix(this.getUTCMinutes()) + ":" + fix(this.getUTCSeconds()) + "Z" : null;
        };
    }

    //Refer to https://github.com/douglascrockford/JSON-js
    if (!ohasOwn.call(window, "JSON") || toString.call(window.JSON) !== "[object JSON]") {
        var quote = function (string) {
            rescapable.lastIndex = 0;
            return rescapable.test(string) ? "\"" + string.replace(rescapable, function (a) {
                var c = meta[a];
                return typeof c === "string" ? c : '\\u' + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\"" : "\"" + string + "\"";
        };

        var str = function (key, holder) {
            var k = void 0;
            var v = void 0;
            var length = void 0;
            var mind = gap;
            var partial = void 0;
            var value = holder[key];

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
                        for (var i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null";
                        }

                        v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v;
                    }

                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (var _i = 0; _i < length; _i += 1) {
                            if (typeof rep[_i] === "string") {
                                k = rep[_i];
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
        };

        var rone = /^[\],:{}\s]*$/;
        var rtwo = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rthree = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rfour = /(?:^|:|,)(?:\s*\[)+/g;
        var rescapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var rdangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        var gap = void 0;
        var indent = void 0;
        var meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" };
        var rep = void 0;

        window.JSON = {
            stringify: function (value, replacer, space) {
                gap = "";
                indent = "";

                if (typeof space === "number") {
                    for (var i = 0; i < space; i += 1) {
                        indent += " ";
                    }
                } else if (typeof space === "string") {
                    indent = space;
                }

                rep = replacer;
                if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                    throw new Error("JSON.stringify");
                }

                return str("", { "": value });
            },
            parse: function (text, reviver) {
                var j = void 0;

                function walk(holder, key) {
                    var k = void 0;
                    var v = void 0;
                    var value = holder[key];
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
                rdangerous.lastIndex = 0;
                if (rdangerous.test(text)) {
                    text = text.replace(rdangerous, function (a) {
                        return '\\u' + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                if (rone.test(text.replace(rtwo, "@").replace(rthree, "]").replace(rfour, ""))) {
                    j = window["eval"]("(" + text + ")");
                    return typeof reviver === "function" ? walk({ "": j }, "") : j;
                }

                throw new SyntaxError("JSON.parse");
            }
        };
    }

    function ok(val) {
        return val;
    }

    function ng(e) {
        throw e;
    }

    function _done(onSuccess) {
        //添加成功回调
        return this.then(onSuccess, ng);
    }

    function _fail(onFail) {
        //添加出错回调
        return this.then(ok, onFail);
    }

    function defer() {
        var ret = {};
        ret.promise = new this(function (resolve, reject) {
            ret.resolve = resolve;
            ret.reject = reject;
        });
        return ret;
    }

    function _always(callback) {
        return this.then(function (d) {
            return callback(d, void 0);
        }, function (e) {
            return callback(void 0, e);
        });
    }

    if (!isNative(window, "Promise")) {
        //对Promise进行功能性修复
        var pp = window.Promise.prototype;
        if (isNative(pp, "done")) {
            pp.done = _done;
        }

        if (isNative(pp, "fail")) {
            pp.fail = _fail;
        }

        if (isNative(pp, "always")) {
            pp.always = _always;
        }

        if (isNative(window.Promise, "defer")) {
            window.Promise.defer = defer;
        }
    } else {
        var Promise$1 = function (executor) {
            this._callbacks = [];
            var self = this;
            if (typeof this !== "object") {
                throw new TypeError("Promises must be constructed via new");
            }
            if (typeof executor !== "function") {
                throw new TypeError("not a function");
            }
            executor(function (value) {
                _resolve(self, value);
            }, function (reason) {
                _reject(self, reason);
            });
        };

        var fireCallbacks = function (promise, fn) {
            var isAsync = void 0;
            if (typeof promise.async === "boolean") {
                isAsync = promise.async;
            } else {
                isAsync = promise.async = true;
            }
            if (isAsync) {
                window.setTimeout(fn, 0);
            } else {
                fn();
            }
        };

        //返回一个已经处于`resolved`状态的Promise对象


        var _resolve = function (promise, value) {
            //触发成功回调
            if (promise._state !== "pending") return;
            if (value && typeof value.then === "function") {
                //thenable对象使用then，Promise实例使用_then
                var method = value instanceof Promise$1 ? "_then" : "then";
                value[method](function (val) {
                    _transmit(promise, val, true);
                }, function (reason) {
                    _transmit(promise, reason, false);
                });
            } else {
                _transmit(promise, value, true);
            }
        };

        var _reject = function (promise, value) {
            //触发失败回调
            if (promise._state !== "pending") return;
            _transmit(promise, value, false);
        };

        //改变Promise的_fired值，并保持用户传参，触发所有回调


        var _transmit = function (promise, value, isResolved) {
            promise._fired = true;
            promise._value = value;
            promise._state = isResolved ? "fulfilled" : "rejected";
            fireCallbacks(promise, function () {
                forEach(promise._callbacks, function (data) {
                    promise._fire(data.onSuccess, data.onFail);
                });
            });
        };

        var _some = function (any, iterable) {
            iterable = Array.isArray(iterable) ? iterable : [];
            var n = 0,
                result = [],
                end = void 0;
            return new Promise$1(function (resolve, reject) {
                // 空数组直接resolve
                if (!iterable.length) {
                    resolve(result);
                }

                function loop(a, index) {
                    a.then(function (ret) {
                        if (!end) {
                            result[index] = ret; //保证回调的顺序
                            n++;
                            if (any || n >= iterable.length) {
                                resolve(any ? ret : result);
                                end = true;
                            }
                        }
                    }, function (e) {
                        end = true;
                        reject(e);
                    });
                }

                for (var i = 0, l = iterable.length; i < l; i++) {
                    loop(iterable[i], i);
                }
            });
        };

        Promise$1.resolve = function (value) {
            return new Promise$1(function (resolve) {
                resolve(value);
            });
        };
        //返回一个已经处于`rejected`状态的Promise对象
        Promise$1.reject = function (reason) {
            return new Promise$1(function (resolve, reject) {
                reject(reason);
            });
        };

        var personal = {
            _state: 1,
            _fired: 1,
            _value: 1,
            _callbacks: 1
        };

        Promise$1.prototype = {
            //一个Promise对象一共有3个状态：
            //- `pending`：还处在等待状态，并没有明确最终结果
            //- `resolved`：任务已经完成，处在成功状态
            //- `rejected`：任务已经完成，处在失败状态
            constructor: Promise$1,
            _state: "pending",
            _fired: false, //判定是否已经被触发
            _fire: function (onSuccess, onFail) {
                if (this._state === "rejected") {
                    if (this._state === "rejected") {
                        onFail(this._value);
                    } else {
                        throw this._value;
                    }
                } else {
                    if (typeof onSuccess === "function") {
                        onSuccess(this._value);
                    }
                }
            },
            _then: function (onSuccess, onFail) {
                if (this._fired) {
                    //在已有Promise上添加回调
                    var self = this;
                    fireCallbacks(self, function () {
                        self._fire(onSuccess, onFail);
                    });
                } else {
                    this._callbacks.push({ onSuccess: onSuccess, onFail: onFail });
                }
            },
            then: function (onSuccess, onFail) {
                onSuccess = typeof onSuccess === "function" ? onSuccess : ok;
                onFail = typeof onFail === "function" ? onFail : ng;
                var self = this; //在新的Promise上添加回调
                var nextPromise = new Promise$1(function (resolve, reject) {
                    self._then(function (value) {
                        try {
                            value = onSuccess(value);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        resolve(value);
                    }, function (value) {
                        try {
                            value = onFail(value);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        resolve(value);
                    });
                });
                for (var o in self) {
                    if (!personal[o]) {
                        nextPromise[o] = self[o];
                    }
                }
                return nextPromise;
            },

            "done": _done,
            "catch": _fail,
            "fail": _fail,
            "always": _always
        };

        Promise$1.all = function (iterable) {
            return _some(false, iterable);
        };

        Promise$1.race = function (iterable) {
            return _some(true, iterable);
        };

        Promise$1.defer = defer;

        window["Promise"] = Promise$1;
    }

    var class2type = {};

    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function (name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    /**
     * @description 用于获取对象字面量
     * @param {*} obj 任意对象
     * @return {String}
     */
    function type(obj) {
        if (obj === null) {
            return String(obj);
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    }

    var undefined$1 = void 0;

    /**
     * @description 判定目标是否是Undefined
     * @param {*} obj
     * @return {boolean}
     */
    function isUndefined(obj) {
        return obj === undefined$1;
    }

    /**
     * @description 判定目标是否是Null
     * @param {*} obj
     * @return {boolean}
     */
    function isNull(obj) {
        return obj === null;
    }

    /**
     * @description 判定目标是否是Boolean
     * @param {*} obj
     * @return {boolean}
     */
    function isBoolean(obj) {
        return type(obj) === "boolean";
    }

    /**
     * @description 判定目标是否是Number
     * @param {*} obj
     * @return {boolean}
     */
    function isNumber$1(obj) {
        return type(obj) === "number";
    }

    /**
     * @description 判定目标是否是String
     * @param {*} obj
     * @return {boolean}
     */
    function isString(obj) {
        return type(obj) === "string";
    }

    /**
     * @description 判定目标是否是Array
     * @param {*} obj
     * @return {boolean}
     */
    function isArray(obj) {
        return type(obj) === "array";
    }

    /**
     * @description 判定目标是否是Date
     * @param {*} obj
     * @return {boolean}
     */
    function isDate(obj) {
        return type(obj) === "date";
    }

    /**
     * @description 判定目标是否是RegExp
     * @param {*} obj
     * @return {boolean}
     */
    function isRegExp(obj) {
        return type(obj) === "regexp";
    }

    /**
     * @description 判定目标是否是Object
     * @param {*} obj
     * @return {boolean}
     */
    function isObject(obj) {
        return type(obj) === "object";
    }

    /**
     * @description 判定目标是否是Error
     * @param {*} obj
     * @return {boolean}
     */
    function isError(obj) {
        return type(obj) === "error";
    }

    /**
     * @description 判定目标是否是Function
     * @param {*} obj
     * @return {boolean}
     */
    function isFunction(obj) {
        return type(obj) === "function";
    }

    if (typeof alert === "object") {
        isFunction = function (obj) {
            try {
                return rfunction.test(String(obj));
            } catch (e) {
                return false;
            }
        };
    }

    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;

    /**
     * @description 判定目标是否是Window
     * @param {*} obj
     * @return {boolean}
     */
    var isWindow = function (obj) {
        rwindow.test(toString.call(obj));
    };

    if (!rwindow.test(toString.call(window))) {
        isWindow = function (obj) {
            if (!obj) {
                return false;
            }
            // 利用IE678 window == document为true,document == window竟然为false的神奇特性
            // 标准浏览器及IE9，IE10等使用 正则检测
            return obj == obj.document && obj.document != obj; //jshint ignore:line
        };
    }

    /**
     * @description 判定目标是否是EmptyObject
     * @param {*} obj
     * @return {boolean}
     */
    function isEmptyObject(obj) {
        if (!isObject(obj)) {
            return false;
        }
        for (var name in obj) {
            return false;
        }
        return true;
    }

    function isPlainObject(obj) {

        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor && !ohasOwn.call(obj, "constructor") && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        var key = void 0;

        if (enumBUG) {
            for (key in obj) {
                return ohasOwn.call(obj, key);
            }
        }

        for (key in obj) {}

        return key === undefined$1 || ohasOwn.call(obj, key);
    }

    shadowCopy(relax, {
        type: type,
        isUndefined: isUndefined,
        isNull: isNull,
        isBoolean: isBoolean,
        isNumber: isNumber$1,
        isString: isString,
        isArray: isArray,
        isDate: isDate,
        isRegExp: isRegExp,
        isObject: isObject,
        isError: isError,
        isFunction: isFunction,
        isWindow: isWindow,
        isEmptyObject: isEmptyObject,
        isPlainObject: isPlainObject
    });

    function innerExtend(isDeep, array) {
        var target = array[0];
        var copyIsArray = void 0;
        var clone = void 0;
        var name = void 0;
        for (var i = 1, length = array.length; i < length; i++) {
            //只处理非空参数
            var options = array[i];
            var noCloneArrayMethod = Array.isArray(options);
            for (name in options) {
                if (noCloneArrayMethod && !options.hasOwnProperty(name)) {
                    continue;
                }
                var src = void 0;
                var copy = void 0;
                try {
                    src = target[name];
                    copy = options[name]; //当options为VBS对象时报错
                } catch (e) {
                    continue;
                }

                // 防止环引用
                if (target === copy) {
                    continue;
                }
                if (isDeep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = innerExtend(isDeep, [clone, copy]);
                } else if (copy !== undefined$1) {
                    target[name] = copy;
                }
            }
        }
        return target;
    }

    var rcanMix = /object|function/;

    function mix() {
        var n = arguments.length;
        var isDeep = false;
        var i = 0;
        var array = [];
        if (arguments[0] === true) {
            isDeep = true;
            i = 1;
        }
        //将所有非空对象变成空对象
        for (; i < n; i++) {
            var el = arguments[i];
            el = el && rcanMix.test(typeof el) ? el : {};
            array.push(el);
        }
        if (array.length === 1) {
            array.unshift(this);
        }
        return innerExtend(isDeep, array);
    }

    var w3c = !!window.dispatchEvent;

    var eventHooks = {};

    var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/;
    function fixEvent(event) {
        var ret = {};
        for (var i in event) {
            ret[i] = event[i];
        }
        var target = ret.target = event.srcElement;
        if (event.type.indexOf("key") === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode;
        } else if (rmouseEvent.test(event.type)) {
            var doc$$1 = target.ownerDocument || doc$$1;
            var box = doc$$1.compatMode === "BackCompat" ? doc$$1.body : doc$$1.documentElement;
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
            ret.wheelDeltaY = ret.wheelDelta;
            ret.wheelDeltaX = 0;
        }
        ret.timeStamp = new Date() - 0;
        ret.originalEvent = event;
        ret.preventDefault = function () {
            //阻止默认行为
            event.returnValue = false;
        };
        ret.stopPropagation = function () {
            //阻止事件在DOM树中的传播
            event.cancelBubble = true;
        };
        return ret;
    }

    function on(el, type, fn, phase) {
        var hooks = eventHooks;
        var hook = hooks[type];
        if (typeof hook === "object") {
            type = hook.type || type;
            phase = hook.phase || !!phase;
            fn = hook.fix ? hook.fix(el, fn) : fn;
        }
        var callback = w3c ? fn : function (e) {
            fn.call(el, fixEvent(e));
        };
        if (w3c) {
            el.addEventListener(type, callback, phase);
        } else {
            el.attachEvent("on" + type, callback);
        }
        return callback;
    }

    function off(el, type, fn, phase) {
        var hooks = eventHooks;
        var hook = hooks[type];
        var callback = fn || noop;
        if (typeof hook === "object") {
            type = hook.type || type;
            phase = hook.phase || !!phase;
        }
        if (w3c) {
            el.removeEventListener(type, callback, phase);
        } else {
            el.detachEvent("on" + type, callback);
        }
    }

    var console$1 = window.console;

    var fa = Function.apply;

    /**
     * @description 用于在控制台打印普通日志
     * @param {...*} arguments
     */
    function log() {
        fa.call(console$1.log, console$1, arguments);
    }

    /**
     * @description 用于在控制台打印转译为JSON字符串的普通日志
     * @param {...*} arguments
     */
    function jsonLog() {
        var args = [];
        for (var i = 0, _len = arguments.length; i < _len; i++) {
            args.push(JSON.stringify(arguments[i]));
        }
        fa.call(console.log, console, args);
    }

    /**
     * @description 用于在控制台打印警告日志
     * @param {...*} arguments
     */
    function warn() {
        fa.call(console$1.warn, console$1, arguments);
    }

    /**
     * @description 用于在控制台打印错误日志
     * @param {...*} arguments
     */
    function error() {
        fa.call(console$1.error, console$1, arguments);
    }

    /**
     * @description 输出原生系统错误
     * @param {...*} arguments
     */
    var sysError = function (errorName, error) {
        throw (error || Error)(errorName);
    };

    var uuidstr = "####-####-####-####";
    var ruuid1 = /[#]/g;
    var ruuid2 = /[-]/g;

    /**
     * @description 生成一个随机字符串
     * @param {String} [bre] 随机字符串的分隔符
     * @return {String}
     */
    function uuid(bre) {
        var uuid = uuidstr.replace(ruuid1, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === "#" ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });

        return !bre ? uuid : uuid.replace(ruuid2, function () {
            return bre;
        });
    }

    /**
     * @description 立即执行传入的函数
     * @param {Function} fn  将要执行的函数
     * @param {Array} [params]  将要执行的函数的所有参数(此处将Arguments对象认为Array类型)
     * @return
     */
    function exec(fn, params) {
        return fn.apply(null, params || []);
    }

    var slice = ap.slice;

    /**
     * @description 立即执行传入的函数,执行完成后返回传入的函数
     * @param {Function} fn  将要执行的函数
     * @param {Array} [params]  将要执行的函数的所有参数(此处将Arguments对象认为Array类型)
     * @return
     */
    function preExec(fn, params) {
        params = slice.call(arguments, 1);
        fn.apply(null, params);
        return fn;
    }

    /**
     * @description 用于将字符串或数组转换成一个简单的对象
     * @param {String|Array} array  将要被转换的字符串或数组
     * @param {Object} [val] 对象属性的值
     * @return
     */
    function oneObject(array, val) {
        if (typeof array === "string") {
            array = array.match(rword) || [];
        }
        var result = {};
        var value = val !== void 0 ? val : 1;
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value;
        }
        return result;
    }

    var execScript = window.execScript || function (data) {
        return window["eval"].call(window, data);
    };

    /**
     * @description 用于在全局环境下执行一段js代码
     * @param {String} code  将要执行的js代码
     * @return
     */
    function globalEval(code) {
        if (code && code.trim()) {
            return execScript(code);
        }
    }

    /**
     * @description 通过对象的多层属性字符串声明直接获取对象的属性值
     * @param {Object} object  被取值的对象
     * @param {String} path 对象的多层属性字符串 例:对象var a = {b:{c:"测试"}},要改变a.b.c 那么 path 为b.c,"."为层级符号
     * @param {*} [value] 有此参数时为赋值,无此参数时为取值
     */
    function deepProp(object, path, value) {
        if (arguments.length === 3) {
            new Function("object,value", "object." + path + " = value;").call(window, object, value);
        } else if (arguments.length === 2) {
            return new Function("object", "return object." + path + ";").call(window, object);
        }
    }

    /*
    => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    relax.range(1, 11)
    => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    relax.range(0, 30, 5)
    => [0, 5, 10, 15, 20, 25]
    relax.range(0, -10, -1)
    => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
    relax.range(0)
    => []*/
    function range(start, end, step) {
        // 用于生成整数数组
        step = step || 1;
        if (end == null) {
            end = start || 0;
            start = 0;
        }
        var index = -1,
            length = Math.max(0, Math.ceil((end - start) / step)),
            result = new Array(length);
        while (++index < length) {
            result[index] = start;
            start += step;
        }
        return result;
    }

    /**
     * @description 用于判断一个属性是否是自身的属性而不是原型上的属性
     * @param {*} self  被判断的对象
     * @param {String} prop 被判断的对象的属性值
     * @return
     */
    function hasOwn(self, prop) {
        return ohasOwn.call(self, prop);
    }

    function nextTick(fn) {
        window.setImmediate(fn);
    }

    if (!window.setImmediate || !rnative.test(window.setImmediate)) {
        var frame = window.requestAnimationFrame;
        if (!frame) {
            var browsers = ["webkit", "moz", "o", "ms"];
            for (var i = 0; i < browsers.length; i++) {
                if (frame = window[browsers[i] + "RequestAnimationFrame"]) {
                    break;
                }
            }
        }

        if (rnative.test(frame)) {
            nextTick = function (fn) {
                frame(fn);
            };
        } else if (window.MutationObserver && rnative.test(window.MutationObserver)) {

            var _queue = [];
            var tick = doc.createTextNode("nextTick");

            new window.MutationObserver(function () {
                var len = _queue.length;
                for (var _i2 = 0; _i2 < len; _i2++) {
                    _queue[_i2]();
                }
                _queue = _queue.slice(len);
            }).observe(tick, { characterData: true });

            var bool = false;

            nextTick = function (fn) {
                _queue.push(fn);
                bool = !bool;
                tick.data = bool;
            };
        } else {

            nextTick = function (fn) {
                var img = new Image();
                img.onload = img.onerror = img.onreadystatechange = function () {
                    img = img.onload = img.onerror = img.onreadystatechange = null;
                    fn();
                };
                img.src = "data:image/png,";
            };

            var supAsyncImg = true;
            nextTick(function () {
                //IE8及以下对data:image数据格式的图片，onerror为同步执行
                supAsyncImg = false;
            });

            if (!supAsyncImg) {
                nextTick = function (fn) {
                    window.setTimeout(fn, 1);
                };
            }
        }
    }

    /*只有当前数组不存在此元素时只添加它*/
    function ensure(target, item) {
        if (target.indexOf(item) === -1) {
            return target.push(item);
        }
    }

    /*移除数组中指定位置的元素，返回布尔表示成功与否*/
    function removeAt(target, index) {
        return !!target.splice(index, 1).length;
    }

    /*移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否*/
    function remove(target, item) {
        var index = target.indexOf(item);
        if (~index) {
            return removeAt(target, index);
        }
        return false;
    }

    function contains(root, el) {
        if (arguments.length === 1) {
            el = root;
            root = rootNode;
        }
        try {
            //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
            while (el = el.parentNode) {
                if (el === root) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    var r20 = /%20/g;
    var rbracket = /\[\]$/;

    function paramInner(obj, prefix, add) {
        var name = void 0;
        if (isArray(obj)) {
            // Serialize array item.
            forEach(obj, function (v, i) {
                if (rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(v, prefix);
                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    paramInner(v, prefix + "[" + (isObject(v) ? i : "") + "]", add);
                }
            });
        } else if (isPlainObject(obj)) {
            // Serialize object item.
            for (name in obj) {
                paramInner(obj[name], prefix + "[" + name + "]", add);
            }
        } else {
            // Serialize scalar item.
            add(obj, prefix);
        }
    }

    function param(obj) {
        var prefix = void 0;
        var s = [];
        var add = function (value, key) {
            // If value is a function, invoke it and return its value
            value = typeof value === "function" ? value() : value == null ? "" : value;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };

        // 处理数组与类数组的jquery对象
        if (isArray(obj)) {
            // Serialize the form elements
            forEach(obj, add);
        } else {
            for (prefix in obj) {
                paramInner(obj[prefix], prefix, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    }

    function tryFn(fn, errorFn) {
        try {
            return isFunction(fn) && fn();
        } catch (e) {
            return isFunction(errorFn) && errorFn(e);
        }
    }

    function closure(run, jsCode, params) {
        var args = slice.call(arguments);
        if (isString(run)) {
            args.unshift(true);
        }
        run = args[0];
        jsCode = args[1].substring(args[1].indexOf("{") + 1, args[1].lastIndexOf("}"));
        var paramsStr = args[1].substring(args[1].indexOf("(") + 1);
        paramsStr = paramsStr.substring(paramsStr.indexOf("(") + 1, paramsStr.indexOf(")"));
        params = slice.call(args, 2);
        var fn = void 0;
        if (run) {
            fn = new Function(paramsStr, jsCode);
            return fn.apply(fn, params);
        } else {
            fn = new Function(paramsStr, "return function(){\n\t" + jsCode + "\n}");
            return fn.apply(fn, params);
        }
    }

    /**
     * @description 用于快速执行一个闭包函数
     * @param {Number} [start]  开始循环的数字
     * @param {Number} end  终止循环的数字
     * @param {Function} callback  每次迭代时的将要触发的回调函数
     */
    function sectionEach(start, end, callback) {
        if (arguments.length === 2 || arguments.length === 3) {
            if (arguments.length === 2) {
                callback = end;
                end = start;
                start = 0;
            }
            if (!isNumber$1(start) || !isNumber$1(end) || !isFunction(callback)) {
                return;
            }
            for (; start < end; start++) {
                callback(start);
            }
        }
    }

    function delayed(code, msec) {
        var out = setTimeout(code, msec);
        return function () {
            clearTimeout(out);
        };
    }

    function timer(code, msec) {
        var out = setInterval(code, msec);
        return function () {
            clearInterval(out);
        };
    }

    function hookFn(fn, args) {
        return fn.apply(null, slice.call(arguments, 1));
    }

    /**
     * @description 用于获得数组的部分
     * @param {*} self  被截取的数组
     * @param {number} start 起始下标
     * @param {number} end 结束下标
     * @return
     */
    function intercept(self, start, end) {
        return slice.call(self, start, end);
    }

    function replace(str, reg, source) {
        return str.replace(reg, function () {
            return source;
        });
    }

    var parseJSON = window.JSON.parse;

    var toJSON = window.JSON.stringify;

    function parseXML(data) {
        var xml = void 0;
        var tmp = void 0;
        if (!data || typeof data !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                // Standard
                tmp = new window.DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else {
                // IE
                xml = new window.ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            error("Invalid XML: " + data);
        }
        return xml;
    }

    function parseQuery(str, decode) {
        var query = {};
        if (decode) {
            str = decodeURIComponent(str);
        }
        var seg = str.split("&");
        var len = seg.length;
        var i = 0;
        var s = void 0;
        for (; i < len; i++) {
            if (!seg[i]) {
                continue;
            }
            s = seg[i].split("=");
            query[s[0]] = s[1] || "";
        }
        return query;
    }

    function url(url, decode) {
        if (arguments.length < 2) {
            decode = true;
        }

        if (decode) {
            url = decodeURIComponent(url);
        }

        if (arguments.length === 0) {
            url = window.location.href;
        }

        var one = url.indexOf("#");
        var two = url.indexOf("?");
        var maxLen = url.length;
        var minStart = Math.min(one, two);
        if (one === -1) {
            minStart = two;
        } else if (two === -1) {
            minStart = one;
        }

        var root = url.substring(0, minStart === -1 ? maxLen : minStart).replace(/.*\:[^\/]*\/?/, "/").replace(/^\.\//, "/");
        var hash = "";
        var queryString = "";

        if (one < two) {
            hash = url.substring(one, two === -1 ? maxLen : two);
            if (two !== -1) {
                queryString = url.substring(two + 1);
            }
        } else {
            hash = url.substring(one);
            if (two !== -1) {
                queryString = url.substring(two + 1, one === -1 ? maxLen : one);
            }
        }

        hash = hash.replace(url, "");

        var target = hash.replace(/^\#?\!?\/?/, "") || "/";

        var query = {};
        if (queryString) {
            query = parseQuery(queryString, decode);
        }
        var hashQuery = {};
        var hashString = hash.substring(1);
        if (hashString) {
            hashQuery = parseQuery(hashString, decode);
        }
        return {
            path: url,
            hash: hash,
            target: target,
            query: query,
            queryString: queryString,
            root: root,
            hashQuery: hashQuery
        };
    }

    var startReg = /^[^\/]+\/\*\*?!?\s?/;
    var endReg = /\*?\*\/[^\/]+$/;

    function notesFn(fn) {
        return fn.toString().replace(startReg, "").replace(endReg, "");
    }

    var parse = {
        url: url,
        notesFn: notesFn
    };

    var location = window.location;
    function baseDir() {
        return location.protocol + "//" + location.host + location.pathname.replace(/\/[^\/]*$/, "");
    }

    function encodeUrl(obj) {
        var arr = [];

        forEach(obj, function (v, k) {
            arr.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        });

        return arr.join("&");
    }

    function $apply(thanContext, args) {
        var than = thanContext;
        var context = null;
        if (isArray(thanContext)) {
            than = thanContext[0];
            context = thanContext[1];
        }
        return fa.call(than, context, args);
    }

    function $call(thanContext, args) {
        var than = thanContext;
        var context = null;
        if (isArray(thanContext)) {
            than = thanContext[0];
            context = thanContext[1];
        }
        return fa.call(than, context, slice.call(arguments, 1));
    }

    function $slice(arr, start, end) {
        return slice.apply(arr, slice.call(arguments, 1));
    }

    relax.mix = relax.fn.mix = mix;
    relax.$apply = $apply;
    relax.evetHooks = eventHooks;
    relax.on = on;
    relax.off = off;
    relax.$call = $call;
    relax.$slice = $slice;
    relax.noop = noop;
    relax.log = log;
    relax.jsonLog = jsonLog;
    relax.warn = warn;
    relax.error = error;
    relax.sysError = sysError;
    relax.uuid = uuid;
    relax.exec = exec;
    relax.preExec = preExec;
    relax.oneObject = oneObject;
    relax.globalEval = globalEval;
    relax.deepProp = deepProp;
    relax.hasOwn = hasOwn;
    relax.range = range;
    relax.forEach = forEach;
    relax.nextTick = nextTick;
    relax.Array = {
        ensure: ensure,
        removeAt: removeAt,
        remove: remove
    };
    relax.contains = contains;
    relax.param = param;
    relax.tryFn = tryFn;
    relax.closure = closure;
    relax.sectionEach = sectionEach;
    relax.delayed = delayed;
    relax.timer = timer;
    relax.hookFn = hookFn;
    relax.intercept = intercept;
    relax.replace = replace;
    relax.parse = parse;
    relax.baseDir = baseDir;
    relax.parseJSON = parseJSON;
    relax.toJSON = toJSON;
    relax.parseXML = parseXML;
    relax.encodeUrl = encodeUrl;

    var relaxFragment = document.createDocumentFragment();

    var cinerator = doc.createElement("div");

    var rtagName = /<([\w:]+)/; //取得其tagName
    var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;
    var rcreate = w3c ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig;
    var rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/; //需要处理套嵌关系的标签
    var rhtml = /<|&#?\w+;/;

    var tagHooks = {
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table>", "</table>"],
        td: [3, "<table><tr>", "</tr></table>"],
        g: [1, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', '</svg>'],
        //IE6-8在用innerHTML生成节点时，不能直接创建no-scope元素与HTML5的新标签
        _default: w3c ? [0, "", ""] : [1, "X<div>", "</div>"] //div可以不用闭合
    };
    tagHooks.th = tagHooks.td;
    tagHooks.optgroup = tagHooks.option;
    tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead;
    "circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use".replace(rword, function (tag) {
        tagHooks[tag] = tagHooks.g; //处理SVG
    });
    var scriptTypes = oneObject(["", "text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript"]);
    var script = doc.createElement("script");

    function isVML(src) {
        var nodeName = src.nodeName;
        return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === "";
    }

    function fixVML(node) {
        if (node.currentStyle.behavior !== "url(#default#VML)") {
            node.style.behavior = "url(#default#VML)";
            node.style.display = "inline-block";
            node.style.zoom = 1; //hasLayout
        }
    }

    function parseHTML(html) {
        var fragment = relaxFragment.cloneNode(false);
        if (typeof html !== "string") {
            return fragment;
        }
        if (!rhtml.test(html)) {
            fragment.appendChild(doc.createTextNode(html));
            return fragment;
        }
        html = html.replace(rxhtml, "<$1></$2>").trim();
        var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase(),

        //取得其标签名
        wrap = tagHooks[tag] || tagHooks._default,
            wrapper = cinerator,
            firstChild = void 0,
            neo = void 0,
            i = void 0,
            el = void 0;
        if (!w3c) {
            //fix IE
            html = html.replace(rcreate, "<br class=msNoScope>$1"); //在link style script等标签之前添加一个补丁
        }
        wrapper.innerHTML = wrap[1] + html + wrap[2];
        var els = wrapper.getElementsByTagName("script");
        if (els.length) {
            //使用innerHTML生成的script节点不会发出请求与执行text属性
            for (var _i3 = 0; el = els[_i3++];) {
                if (scriptTypes[el.type]) {
                    //以偷龙转凤方式恢复执行脚本功能
                    neo = script.cloneNode(false); //FF不能省略参数
                    forEach(el.attributes, function (attr) {
                        if (attr && attr.specified) {
                            neo[attr.name] = attr.value; //复制其属性
                            neo.setAttribute(attr.name, attr.value);
                        }
                    }); // jshint ignore:line
                    neo.text = el.text;
                    el.parentNode.replaceChild(neo, el); //替换节点
                }
            }
        }
        if (!w3c) {
            //fix IE
            var target = wrap[1] === "X<div>" ? wrapper.lastChild.firstChild : wrapper.lastChild;
            if (target && target.tagName === "TABLE" && tag !== "tbody") {
                //IE6-7处理 <thead> --> <thead>,<tbody>
                //<tfoot> --> <tfoot>,<tbody>
                //<table> --> <table><tbody></table>
                for (els = target.childNodes, i = 0; el = els[i++];) {
                    if (el.tagName === "TBODY" && !el.innerHTML) {
                        target.removeChild(el);
                        break;
                    }
                }
            }
            els = wrapper.getElementsByTagName("br");
            var n = els.length;
            while (el = els[--n]) {
                if (el.className === "msNoScope") {
                    el.parentNode.removeChild(el);
                }
            }
            for (els = wrapper.all, i = 0; el = els[i++];) {
                //fix VML
                if (isVML(el)) {
                    fixVML(el);
                }
            }
        }
        //移除我们为了符合套嵌关系而添加的标签
        for (var _i4 = wrap[0]; _i4--; wrapper = wrapper.lastChild) {}
        while (firstChild = wrapper.firstChild) {
            // 将wrapper上的节点转移到文档碎片上！
            fragment.appendChild(firstChild);
        }
        return fragment;
    }

    function clearHTML(node) {
        node.textContent = "";
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    }

    function innerHTML(node, html) {
        if (!w3c && !rcreate.test(html) && !rnest.test(html)) {
            try {
                node.innerHTML = html;
                return;
            } catch (e) {}
        }
        var a = parseHTML(html);
        clearHTML(node).appendChild(a);
    }

    var template = {
        templateSettings: {
            evaluate: /\{\%([\s\S]+?(\}?)+)\%\}/g,
            interpolate: /\{\%=([\s\S]+?)\%\}/g,
            encode: /\{\%!([\s\S]+?)\%\}/g,
            use: /\{\%#([\s\S]+?)\%\}/g,
            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            define: /\{\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\}/g,
            defineParams: /^\s*([\w$]+):([\s\S]+)/,
            conditional: /\{\%\?(\?)?\s*([\s\S]*?)\s*\%\}/g,
            iterate: /\{\%~\s*(?:\%\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\})/g,
            varname: "$T",
            strip: false,
            append: true,
            selfcontained: false,
            doNotSkipEncoded: false
        },
        template: undefined, //fn, compile template
        compile: undefined //fn, for express
    };

    template.encodeHTMLSource = function (doNotSkipEncoded) {
        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
            matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function (code) {
            return code ? code.toString().replace(matchHTML, function (m) {
                return encodeHTMLRules[m] || m;
            }) : "";
        };
    };

    var _globals = function () {
        return this || (0, eval)("this");
    }();

    var startend = {
        append: { start: "'+(", end: ")+'", startencode: "'+encodeHTML(" },
        split: { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
    };
    var skip = /$^/;

    function resolveDefs(c, block, def) {
        return (typeof block === "string" ? block : block.toString()).replace(c.define || skip, function (m, code, assign, value) {
            if (code.indexOf("def.") === 0) {
                code = code.substring(4);
            }
            if (!(code in def)) {
                if (assign === ":") {
                    if (c.defineParams) value.replace(c.defineParams, function (m, param, v) {
                        def[code] = { arg: param, text: v };
                    });
                    if (!(code in def)) def[code] = value;
                } else {
                    new Function("def", "def['" + code + "']=" + value)(def);
                }
            }
            return "";
        }).replace(c.use || skip, function (m, code) {
            if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
                if (def[d] && def[d].arg && param) {
                    var rw = (d + ":" + param).replace(/'|\\/g, "_");
                    def.__exp = def.__exp || {};
                    def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
                    return s + "def.__exp['" + rw + "']";
                }
            });
            var v = new Function("def", "return " + code)(def);
            return v ? resolveDefs(c, v, def) : v;
        });
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
    }

    template.template = function (tmpl, c, def) {
        c = c || template.templateSettings;
        var cse = c.append ? startend.append : startend.split,
            needhtmlencode = void 0,
            sid = 0,
            indv = void 0,
            errorCode = void 0,
            str = c.use || c.define ? resolveDefs(c, tmpl, def || {}) : tmpl;
        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str).replace(/'|\\/g, "\\$&").replace(c.interpolate || skip, function (m, code) {
            errorCode = m;
            return cse.start + unescape(code) + cse.end;
        }).replace(c.encode || skip, function (m, code) {
            errorCode = m;
            needhtmlencode = true;
            return cse.startencode + unescape(code) + cse.end;
        }).replace(c.conditional || skip, function (m, elsecase, code) {
            errorCode = m;
            return elsecase ? code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='" : code ? "';if(" + unescape(code) + "){out+='" : "';}out+='";
        }).replace(c.iterate || skip, function (m, iterate, vname, iname) {
            errorCode = m;
            if (!iterate) return "';} } out+='";
            sid += 1;
            indv = iname || "i" + sid;
            iterate = unescape(iterate);
            return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){" + vname + "=arr" + sid + "[" + indv + "+=1];out+='";
        }).replace(c.evaluate || skip, function (m, code) {
            errorCode = m;
            return "';" + unescape(code) + ";out+='";
        }) + "';return out;").replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r").replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
        //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

        if (needhtmlencode) {
            if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = template.encodeHTMLSource(c.doNotSkipEncoded);
            str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (" + template.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));" + str;
        }
        try {
            var fn = new Function(c.varname, str);
            return function (data) {
                try {
                    return fn(data);
                } catch (e) {
                    var err = ["relax Template Exception:\n\n\<error-message\>\n\n", e.message, "\n\n\<\/error-message\>\n\n\<error-code\>\n\n", errorCode, "\n\n\<\/error-code\>\n\n\<error-template\>\n\n", tmpl, "\n\n\<\/error-template\>\n\n"].join("");
                    error(err);
                }
            };
        } catch (e) {
            warn("Could not create a template function:" + str);
        }
    };

    /**
     * @description 用于预定义一个处理模板
     * @param {String} source dot字符串处理模板
     * @param {Object} [options] 调整模板处理函数默认值
     * @return {String}
     */
    function compileTMPL(source, options) {
        return template.template(source, null, options);
    }

    /**
     * @description 用于按默认配置直接处理模板
     * @param {String} source dot字符串处理模板
     * @param {Object} data 处理模板时所需的数据
     * @param {Object} [options] 调整模板处理函数默认值
     * @return {String}
     */
    function parseTMPL(source, data, options) {
        return template.template(source, null, options).call(template, data);
    }

    var readyList = [];
    var isReady = false;

    function readied() {
        isReady = true;
        forEach(readyList, function (fn) {
            fn();
        });
        readyList = [];
    }

    function doScrollCheck() {
        try {
            //IE下通过doScrollCheck检测DOM树是否创建完成
            rootNode.doScroll("left");
            readied();
        } catch (e) {
            setTimeout(doScrollCheck, 1);
        }
    }

    if (doc.readyState === "complete") {
        readied();
    } else if (w3c) {
        doc.addEventListener("DOMContentLoaded", readied, false);
    } else {
        doc.attachEvent("onreadystatechange", function () {
            if (doc.readyState === "complete") {
                readied();
            }
        });
        var isTop = void 0;
        try {
            isTop = window.frameElement === null;
        } catch (e) {}
        if (rootNode.doScroll && isTop && window.external) {
            doScrollCheck();
        }
    }

    function ready(fn) {
        if (!isReady) {
            readyList.push(fn);
        } else {
            fn();
        }
    }

    function define(selector, data) {
        var model = {
            data: selector
        };
        if (arguments.length === 2) {
            model.el = selector;
            model.data = data;
        }

        return vue(model);
    }

    function Priority() {
        this.sequence = [];
    }

    Priority.prototype = {
        constructor: Priority,
        add: function (priority, arbitrarily) {
            var self = this;
            var sequence = self.sequence;
            sequence.unshift(priority);
            var len = sequence.length;
            for (var _i5 = 0; _i5 < len; _i5++) {
                for (var j = 0; j < len - 1 - _i5; j++) {
                    if (sequence[j] > sequence[j + 1]) {
                        var temp = sequence[j + 1];
                        sequence[j + 1] = sequence[j];
                        sequence[j] = temp;
                    }
                }
            }
            self[priority] = arbitrarily;
            return this;
        },
        remove: function (priority) {
            var self = this;
            var sequence = self.sequence;
            for (var _i6 = 0; _i6 < sequence.length; _i6++) {
                if (sequence[_i6] === priority) {
                    sequence.splice(_i6, 1);
                    break;
                }
            }
            delete self[priority];
            return self;
        },
        forEach: function (fn) {
            var self = this;
            var sequence = self.sequence;
            for (var _i7 = 0; _i7 < sequence.length; _i7++) {
                fn.call(null, self[sequence[_i7]], sequence[_i7]);
            }
            return self;
        },
        iterator: function (fn, lastFn) {
            var self = this;
            var sequence = self.sequence;
            var i = 0;
            return function () {
                if (i === -1) {
                    return;
                }
                if (i === sequence.length) {
                    lastFn();
                    i = -1;
                    return;
                }
                var k = sequence[i];
                fn.call(null, self[k], k);
                i++;
            };
        }
    };

    function priority() {
        return new Priority();
    }

    function scan(selector, vmodel) {
        vmodel.$mount(selector);
    }

    //jsonrpc请求默认配置
    var defaults = {
        url: "",
        processData: false,
        cache: false,
        async: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json"
    };

    //jsonrpc默认数据模型
    var dataModel = {
        jsonrpc: "2.0",
        method: "",
        id: "",
        params: {}
    };

    var ajax = noop;

    var $ajax = function () {
        if (ajax === noop) {
            ajax = library("jQuery").ajax;
            if (!ajax) {
                ajax = noop;
            }
        }
        return ajax;
    };

    function jsonrpc(method, options) {
        var rpc = new RPC();
        rpc.$o_o$ = {
            uuid: uuid(),
            promise: new Promise(function (resolve, reject) {
                rpc.resolve = resolve;
                rpc.reject = reject;
            }),
            method: isString(method) ? method : "",
            options: isObject(options) ? options : {}
        };

        jsonrpc.trigger("init", [rpc]); //触发jsonrpc事件

        return rpc;
    }

    jsonrpc.events = {
        "init": [],
        "request": [],
        "result": []
    };

    jsonrpc.bind = function (type$$1, fn) {
        var events = jsonrpc.events[type$$1];
        if (events && isFunction(fn)) {
            events.push(fn);
        }
        return this;
    };

    jsonrpc.unbind = function (type$$1, fn) {
        var events = jsonrpc.events[type$$1];
        if (events && isFunction(fn)) {
            for (var _i8 = 0; _i8 < events.length; _i8++) {
                if (events[_i8] === fn) {
                    events.splice(_i8, 1);
                    break;
                }
            }
        }
        return this;
    };

    jsonrpc.trigger = function (type$$1, args) {
        var events = jsonrpc.events[type$$1];
        if (events) {
            args = isArray(args) ? args : [];
            forEach(events, function (fn) {
                fn.apply(null, args);
            });
        }
    };

    jsonrpc.defaults = function (opts) {
        for (var o in opts) {
            if (ohasOwn.call(opts, o)) {
                defaults[o] = opts[o];
            }
        }
    };

    jsonrpc.model = function (model) {
        for (var o in model) {
            if (ohasOwn.call(model, o)) {
                dataModel[o] = model[o];
            }
        }
    };

    jsonrpc.serialize = function (fn) {
        if (isFunction(fn)) {
            RPC.prototype.serialize = fn;
        }
    };

    jsonrpc.hookRequest = function (fn) {
        if (isFunction(fn)) {
            RPC.prototype.hookRequest = fn;
        }
    };

    var jsonRpcHandle = priority();

    jsonrpc.handle = function (param) {
        var t = type(param);

        if (t !== "function" && t !== "object") {
            throw new TypeError("param is not a function or an object");
        }

        param = t === "function" ? param() : param;

        if (!isObject(param)) {
            throw new TypeError("param is not a function or an object");
        }

        var priority$$1 = param.priority;
        var handle = param.handle;
        if (!isNumber$1(priority$$1)) {
            throw new TypeError("param.priority is not a number");
        }
        if (!isFunction(handle)) {
            throw new TypeError("param.handle is not a function");
        }

        jsonRpcHandle.add(priority$$1, handle);
    };

    var jsonRpcFilter = priority();

    jsonrpc.filter = function (param) {
        var t = type(param);

        if (t !== "function" && t !== "object") {
            throw new TypeError("param is not a function or an object");
        }

        param = t === "function" ? param() : param;

        if (!isObject(param)) {
            throw new TypeError("param is not a function or an object");
        }

        var priority$$1 = param.priority;
        var filter = param.filter;
        if (!isNumber$1(priority$$1)) {
            throw new TypeError("param.priority is not a number");
        }
        if (!isObject(filter)) {
            throw new TypeError("param.filter is not a object");
        }

        jsonRpcFilter.add(priority$$1, filter);
    };

    var jsonRpcFail = priority();

    jsonrpc.fail = function (param) {
        var t = type(param);

        if (t !== "function" && t !== "object") {
            throw new TypeError("param is not a function or an object");
        }

        param = t === "function" ? param() : param;

        if (!isObject(param)) {
            throw new TypeError("param is not a function or an object");
        }

        var priority$$1 = param.priority;
        var fail = param.fail;
        if (!isNumber$1(priority$$1)) {
            throw new TypeError("param.priority is not a number");
        }
        if (!isFunction(fail)) {
            throw new TypeError("param.fail is not a function");
        }

        jsonRpcFail.add(priority$$1, fail);
    };

    function handleExec(flag) {
        var self = this;
        jsonrpc.trigger("result", [self]);
        var priorities = jsonRpcHandle.sequence;
        var len = priorities.length;
        var args = slice.call(arguments, 1);

        var i = -1;

        var next = function (flag, result) {
            if (i === -2) {
                return;
            }
            i++;
            if (i < len) {
                jsonRpcHandle[priorities[i]].call(self, flag, result, next, args);
            } else {
                i = -2;
                filterExec.call(self, flag, result, args);
            }
        };

        next(flag);
    }

    var contrastTwo = {
        "true": "resolve",
        "false": "reject"
    };

    var contrastThree = {
        "true": "done",
        "false": "fail"
    };

    function filterExec(flag, result, args) {
        var self = this;
        var priorities = jsonRpcFilter.sequence;
        var len = priorities.length;
        var event = contrastTwo[flag];
        var name = contrastThree[flag];

        var i = -1;

        var next = function (result) {
            if (i === -2) {
                return;
            }
            i++;
            if (i < len) {
                var filter = jsonRpcFilter[priorities[i]];
                if (isFunction(filter[name])) {
                    filter[name].call(self, result, next, args);
                }
            } else {
                i = -2;
                if (isFunction(self.$o_o$.filter)) {
                    result = self.$o_o$.filter(flag, result);
                }
                self[event](result);
            }
        };

        next(result);
    }

    function RPC() {}

    function failExec(e, result) {
        if (e !== null) {
            error("JsonRpc Anomalies", e);
            return;
        }
        var self = this;
        var priorities = jsonRpcFail.sequence;
        var len = priorities.length;
        try {
            var _i9 = -1;

            var next = function (result) {
                if (_i9 === -2) {
                    return;
                }
                _i9++;
                if (_i9 < len) {
                    jsonRpcFail[priorities[_i9]].call(self, result, next);
                } else {
                    _i9 = -2;
                }
            };

            next(result);
        } catch (e) {
            error("JsonRpc Anomalies", e);
        }
    }

    RPC.prototype = {
        constructor: RPC,
        setup: function (options) {
            this.$o_o$.options = options;
            return this;
        },
        method: function (method) {
            this.$o_o$.method = method;
            return this;
        },
        hookRequest: function (opts, request) {
            request(opts);
        },
        serialize: function (model, method, record) {
            model.method = method;
            model.params = record;
            return JSON.stringify(model);
        },
        filter: function (fn) {
            this.$o_o$.filter = fn;
            return this;
        },
        request: function (record, done, fail, always) {
            var self = this;
            var opts = mix(true, {}, defaults, self.$o_o$.options);

            //处理提交数据-start
            var method = self.$o_o$.method;
            var model = mix(true, {}, dataModel);
            if (!ohasOwn.call(model, "id") || !model.id) {
                model.id = uuid();
            }

            opts.data = self.serialize(model, method, record);

            //处理提交数据-end

            //绑定结果的后续处理函数
            self.done(opts.success).done(done).fail(opts.error).fail(fail).always(opts.complete).always(always);

            opts.success = function (data, textStatus, jqXHR) {
                handleExec.call(self, true, data, textStatus, jqXHR);
            };

            opts.error = function (XMLHttpRequest, textStatus, errorThrown) {
                handleExec.call(self, false, XMLHttpRequest, textStatus, errorThrown);
            };

            delete opts.complete;

            self.hookRequest(opts, function (opts) {
                jsonrpc.trigger("request", [self]);
                $ajax()(opts); //发起请求
            });

            return self;
        },
        done: function (fn) {
            var self = this;
            if (isFunction(fn)) {
                self.$o_o$.promise.done(function (result) {
                    try {
                        fn.call(self, result);
                    } catch (e) {
                        failExec.call(self, e);
                    }
                }).fail(noop);
            }
            return self;
        },
        fail: function (fn) {
            var self = this;
            if (isFunction(fn)) {
                self.$o_o$.promise.fail(function (result) {
                    try {
                        if (fn.call(self, result) !== false) {
                            failExec.call(self, null, result);
                        }
                    } catch (e) {
                        failExec.call(self, e);
                    }
                }).fail(noop);
            } else if (fn === true) {
                self.$o_o$.promise.fail(function (result) {
                    try {
                        failExec.call(self, null, result);
                    } catch (e) {
                        failExec.call(self, e);
                    }
                }).fail(noop);
            }
            return self;
        },
        always: function (fn) {
            var self = this;
            if (isFunction(fn)) {
                self.$o_o$.promise.always(function (result) {
                    try {
                        fn.call(self, result);
                    } catch (e) {
                        failExec.call(self, e);
                    }
                }).fail(noop);
            }
            return self;
        }
    };

    RPC.prototype["then"] = function (fn) {
        return this.done(fn);
    };

    RPC.prototype["catch"] = function (fn) {
        return this.fail(fn);
    };

    //Refer to https://github.com/marcuswestin/store.js

    var store = {};
    var win = typeof window !== 'undefined' ? window : global;
    var doc$1 = win.document;
    var localStorageName = 'localStorage';
    var scriptTag = 'script';
    var storage = void 0;

    store.disabled = false;
    store.version = '1.3.20';
    store.set = function (key, value) {};
    store.get = function (key, defaultVal) {};
    store.has = function (key) {
        return store.get(key) !== undefined;
    };
    store.remove = function (key) {};
    store.clear = function () {};
    store.transact = function (key, defaultVal, transactionFn) {
        if (transactionFn == null) {
            transactionFn = defaultVal;
            defaultVal = null;
        }
        if (defaultVal == null) {
            defaultVal = {};
        }
        var val = store.get(key, defaultVal);
        transactionFn(val);
        store.set(key, val);
    };
    store.getAll = function () {};
    store.forEach = function () {};

    store.serialize = function (value) {
        return JSON.stringify(value);
    };
    store.deserialize = function (value) {
        if (typeof value !== 'string') {
            return undefined;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    };

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try {
            return localStorageName in win && win[localStorageName];
        } catch (err) {
            return false;
        }
    }

    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName];
        store.set = function (key, val) {
            if (val === undefined) {
                return store.remove(key);
            }
            storage.setItem(key, store.serialize(val));
            return val;
        };
        store.get = function (key, defaultVal) {
            var val = store.deserialize(storage.getItem(key));
            return val === undefined ? defaultVal : val;
        };
        store.remove = function (key) {
            storage.removeItem(key);
        };
        store.clear = function () {
            storage.clear();
        };
        store.getAll = function () {
            var ret = {};
            store.forEach(function (key, val) {
                ret[key] = val;
            });
            return ret;
        };
        store.forEach = function (callback) {
            for (var _i10 = 0; _i10 < storage.length; _i10++) {
                var key = storage.key(_i10);
                callback(key, store.get(key));
            }
        };
    } else if (doc$1 && doc$1.documentElement.addBehavior) {
        var storageOwner = void 0,
            storageContainer = void 0;
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile');
            storageContainer.open();
            storageContainer.write('<' + scriptTag + '>document.w=window</' + scriptTag + '><iframe src="/favicon.ico"></iframe>');
            storageContainer.close();
            storageOwner = storageContainer.w.frames[0].document;
            storage = storageOwner.createElement('div');
        } catch (e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc$1.createElement('div');
            storageOwner = doc$1.body;
        }
        var withIEStorage = function (storeFunction) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift(storage);
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage);
                storage.addBehavior('#default#userData');
                storage.load(localStorageName);
                var result = storeFunction.apply(store, args);
                storageOwner.removeChild(storage);
                return result;
            };
        };

        // In IE7, keys cannot start with a digit or contain certain chars.
        // See https://github.com/marcuswestin/store.js/issues/40
        // See https://github.com/marcuswestin/store.js/issues/83
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
        var ieKeyFix = function (key) {
            return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___');
        };
        store.set = withIEStorage(function (storage, key, val) {
            key = ieKeyFix(key);
            if (val === undefined) {
                return store.remove(key);
            }
            storage.setAttribute(key, store.serialize(val));
            storage.save(localStorageName);
            return val;
        });
        store.get = withIEStorage(function (storage, key, defaultVal) {
            key = ieKeyFix(key);
            var val = store.deserialize(storage.getAttribute(key));
            return val === undefined ? defaultVal : val;
        });
        store.remove = withIEStorage(function (storage, key) {
            key = ieKeyFix(key);
            storage.removeAttribute(key);
            storage.save(localStorageName);
        });
        store.clear = withIEStorage(function (storage) {
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            for (var _i11 = attributes.length - 1; _i11 >= 0; _i11--) {
                storage.removeAttribute(attributes[_i11].name);
            }
            storage.save(localStorageName);
        });
        store.getAll = function (storage) {
            var ret = {};
            store.forEach(function (key, val) {
                ret[key] = val;
            });
            return ret;
        };
        store.forEach = withIEStorage(function (storage, callback) {
            var attributes = storage.XMLDocument.documentElement.attributes;
            for (var _i12 = 0, attr; attr = attributes[_i12]; ++_i12) {
                callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
            }
        });
    }

    try {
        var testKey = '__storejs__';
        store.set(testKey, testKey);
        if (store.get(testKey) != testKey) {
            store.disabled = true;
        }
        store.remove(testKey);
    } catch (e) {
        store.disabled = true;
    }
    store.enabled = !store.disabled;

    var pf = (navigator.platform || "").toLowerCase();
    var ua = navigator.userAgent.toLowerCase();
    var s = void 0;

    function toFixedVersion(ver, floatLength) {
        ver = ("" + ver).replace(/_/g, ".");
        floatLength = floatLength || 1;
        ver = String(ver).split(".");
        ver = ver[0] + "." + (ver[1] || "0");
        ver = Number(ver).toFixed(floatLength);
        return ver;
    }

    function updateProperty(target, name, ver) {
        target.name = name;
        target.version = ver;
        target[name] = ver;
    }

    // 提供三个基础对象,每个对象都有name, version(version必然为字符串)
    // 取得用户操作系统名字与版本号，如果是0表示不是此操作系统
    var platform = {
        name: window.orientation != undefined ? 'iPod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],
        version: 0,
        iPod: 0,
        iPad: 0,
        iPhone: 0,
        android: 0,
        win: 0,
        linux: 0,
        mac: 0
    };

    (s = ua.match(/windows ([\d.]+)/)) ? updateProperty(platform, "win", toFixedVersion(s[1])) : (s = ua.match(/windows nt ([\d.]+)/)) ? updateProperty(platform, "win", toFixedVersion(s[1])) : (s = ua.match(/linux ([\d.]+)/)) ? updateProperty(platform, "linux", toFixedVersion(s[1])) : (s = ua.match(/mac ([\d.]+)/)) ? updateProperty(platform, "mac", toFixedVersion(s[1])) : (s = ua.match(/ipod ([\d.]+)/)) ? updateProperty(platform, "iPod", toFixedVersion(s[1])) : (s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? updateProperty(platform, "iPad", toFixedVersion(s[1])) : (s = ua.match(/iphone ([\d.]+)/)) ? updateProperty(platform, "iPhone", toFixedVersion(s[1])) : (s = ua.match(/android ([\d.]+)/)) ? updateProperty(platform, "android", toFixedVersion(s[1])) : 0;
    //============================================
    //取得用户的浏览器名与版本,如果是0表示不是此浏览器
    var browser = {
        name: "unknown",
        version: 0,
        ie: 0,
        firefox: 0,
        chrome: 0,
        opera: 0,
        safari: 0,
        mobileSafari: 0,
        adobeAir: 0 //adobe 的air内嵌浏览器
    };

    (s = ua.match(/trident.*; rv\:([\d.]+)/)) ? updateProperty(browser, "ie", toFixedVersion(s[1])) : //IE11的UA改变了没有MSIE
    (s = ua.match(/msie ([\d.]+)/)) ? updateProperty(browser, "ie", toFixedVersion(s[1])) : (s = ua.match(/firefox\/([\d.]+)/)) ? updateProperty(browser, "firefox", toFixedVersion(s[1])) : (s = ua.match(/chrome\/([\d.]+)/)) ? updateProperty(browser, "chrome", toFixedVersion(s[1])) : (s = ua.match(/opera.([\d.]+)/)) ? updateProperty(browser, "opera", toFixedVersion(s[1])) : (s = ua.match(/adobeair\/([\d.]+)/)) ? updateProperty(browser, "adobeAir", toFixedVersion(s[1])) : (s = ua.match(/version\/([\d.]+).*safari/)) ? updateProperty(browser, "safari", toFixedVersion(s[1])) : 0;

    //下面是各种微调
    //mobile safari 判断，可与safari字段并存
    (s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? updateProperty(browser, "mobileSafari", toFixedVersion(s[1])) : 0;

    if (platform.iPad) {
        updateProperty(browser, 'mobileSafari', '0.0');
    }

    var documentMode = void 0;
    //仅在ie下提供一个特殊对象jFree.documentMode,应对ie下浏览器模式与文档模式不统一的情况
    if (browser.ie) {
        //IE下可以通过设置 <meta http-equiv="X-UA-Compatible" content="IE=8"/>改变文档模式
        //一切以实际渲染效果为准
        var mode = document.documentMode;
        documentMode = mode ? mode : window.XMLHttpRequest ? 7 : 6;
    }

    //============================================
    //取得用户浏览器的渲染引擎名与版本,如果是0表示不是此浏览器
    var engine = {
        name: 'unknown',
        version: 0,
        trident: 0,
        gecko: 0,
        webkit: 0,
        presto: 0
    };

    (s = ua.match(/trident\/([\d.]+)/)) ? updateProperty(engine, "trident", toFixedVersion(s[1])) : (s = ua.match(/gecko\/([\d.]+)/)) ? updateProperty(engine, "gecko", toFixedVersion(s[1])) : (s = ua.match(/applewebkit\/([\d.]+)/)) ? updateProperty(engine, "webkit", toFixedVersion(s[1])) : (s = ua.match(/presto\/([\d.]+)/)) ? updateProperty(engine, "presto", toFixedVersion(s[1])) : 0;

    if (browser.ie) {
        if (browser.ie === 6) {
            updateProperty(engine, "trident", toFixedVersion("4"));
        } else if (browser.ie === 7 || browser.ie === 8) {
            updateProperty(engine, "trident", toFixedVersion("5"));
        }
    }

    var oldIE = browser.ie && browser.version <= 7;
    var supportPushState = !!window.history.pushState;
    var supportHashChange = !!("onhashchange" in window && (!window.VBArray || !oldIE));
    var $win = void 0;
    var $window = function () {
        if ($win) {
            return $win;
        } else {
            $win = relax(window);
            return $win;
        }
    };

    var History = function () {
        /**监控url地址改变**/
        //判断是否已经开启
        this.started = false;
        //关联location
        this.location = window.location;
        //配置默认值
        this.defaults = {
            basepath: "/",
            noBasePathNoChange: true,
            html5Mode: false,
            hashPrefix: "!",
            iframeID: null, //IE6-7，如果有在页面写死了一个iframe，这样似乎刷新的时候不会丢掉之前的历史
            interval: 50, //IE6-7,使用轮询，这是其时间时隔
            fireAnchor: true, //决定是否将滚动条定位于与hash同ID的元素上
            routeElementJudger: noop // 判断a元素是否是触发router切换的链接
        };
    };

    /** 默认配置信息 **/
    History.prototype = {
        constructor: History,
        /*
         * @param options 配置参数
         * @param options.hashPrefix hash以什么字符串开头，默认是 "!"，对应实际效果就是"#!"
         * @param options.routeElementJudger 判断a元素是否是触发router切换的链接的函数，return true则触发切换，默认为relax.noop，history内部有一个判定逻辑，是先判定a元素的href属性是否以hashPrefix开头，如果是则当做router切换元素，因此综合判定规则是 href.indexOf(hashPrefix) == 0 || routeElementJudger(ele, ele.href)，如果routeElementJudger返回true则跳转至href，如果返回的是字符串，则跳转至返回的字符串，如果返回false则返回浏览器默认行为
         * @param options.html5Mode 是否采用html5模式，即不使用hash来记录历史，默认false
         * @param options.fireAnchor 决定是否将滚动条定位于与hash同ID的元素上，默认为true
         * @param options.basepath 根目录，默认为"/"
         */
        start: function (options) {
            var self = this;
            if (self.started) {
                warn("History(" + self.uuid + ") has already been started");
                return;
            } else {
                self.uuid = uuid();
                self.started = true;
            }
            var defaults = mix(self.defaults, options);
            //IE6不支持maxHeight, IE7支持XMLHttpRequest, IE8支持window.Element，querySelector,
            //IE9支持window.Node, window.HTMLElement, IE10不支持条件注释
            //确保html5Mode属性存在,并且是一个布尔
            self.html5Mode = !!defaults.html5Mode;
            //监听模式
            self.monitorMode = self.html5Mode ? "popstate" : "hashchange";
            if (!supportPushState) {
                if (self.html5Mode) {
                    warn("当前浏览器不支持HTML5 pushState，将强制使用hash hack!");
                    self.html5Mode = false;
                }
                self.monitorMode = "hashchange";
            }
            if (!supportHashChange) {
                warn("当前浏览器不支持HTML5 pushState，不支持hashchange,将强制使用轮询监测!");
                self.monitorMode = "iframepoll";
            }
            self.prefix = "#" + defaults.hashPrefix + "/";
            //确认前后都存在斜线， 如"aaa/ --> /aaa/" , "/aaa --> /aaa/", "aaa --> /aaa/", "/ --> /"
            self.basepath = ("/" + defaults.basepath + "/").replace(/^\/+|\/+$/g, "/"); // 去最左右两边的斜线

            self.fragment = self.getFragment();

            var anchorElement = document.createElement('a');
            anchorElement.href = self.basepath;
            self.rootpath = self._getAbsolutePath(anchorElement);
            var html = '<!doctype html><html><body>@</body></html>';
            if (defaults.domain) {
                html = html.replace("\<body\>", "\<script\>document.domain =" + defaults.domain + "\</script\><body\>");
            }
            self.iframeHTML = html;
            if (self.monitorMode === "iframepoll") {
                //IE6,7在hash改变时不会产生历史，需要用一个iframe来共享历史
                ready(function () {
                    if (self.iframe) {
                        return;
                    }
                    var iframe = self.iframe || document.getElementById(self.iframeID) || document.createElement('iframe');
                    iframe.src = 'javascript:0';
                    iframe.style.display = 'none';
                    iframe.tabIndex = -1;
                    document.body.appendChild(iframe);
                    self.iframe = iframe.contentWindow;
                    self._setIframeHistory(self.prefix + self.fragment);
                });
            }

            // 支持popstate 就监听popstate
            // 支持hashchange 就监听hashchange
            // 否则的话只能每隔一段时间进行检测了
            function checkUrl() {
                var iframe = self.iframe;
                if (self.monitorMode === "iframepoll" && !iframe) {
                    return false;
                }
                var pageHash = self.getFragment();
                var hash = void 0;
                if (iframe) {
                    //IE67
                    var iframeHash = self.getHash(iframe);
                    //与当前页面hash不等于之前的页面hash，这主要是用户通过点击链接引发的
                    if (pageHash !== self.fragment) {
                        self._setIframeHistory(self.prefix + pageHash);
                        hash = pageHash;
                        //如果是后退按钮触发hash不一致
                    } else if (iframeHash !== self.fragment) {
                        self.location.hash = self.prefix + iframeHash;
                        hash = iframeHash;
                    }
                } else if (pageHash !== self.fragment) {
                    hash = pageHash;
                }
                if (hash !== void 0) {
                    self.fragment = hash;
                    self.fireRouteChange(hash, { fromHistory: true });
                }
            }

            // 支持popstate 就监听popstate
            // 支持hashchange 就监听hashchange(IE8,IE9,FF3)
            // 否则的话只能每隔一段时间进行检测了(IE6, IE7)
            if (self.monitorMode === "popstate") {
                $window().bind("popstate." + this.uuid, checkUrl);
                self._fireLocationChange = checkUrl;
            } else if (self.monitorMode === "hashchange") {
                $window().bind("hashchange." + this.uuid, checkUrl);
            } else if (self.monitorMode === "iframepoll") {
                self.checkUrl = setInterval(checkUrl, defaults.interval);
            }
            //根据当前的location立即进入不同的路由回调
            ready(function () {
                self.fireRouteChange(self.fragment || "/", { replace: true });
            });
        },

        // 中断URL的监听
        stop: function () {
            $window().unbind("popstate." + this.uuid);
            $window().unbind("hashchange." + this.uuid);
            clearInterval(this.checkUrl);
            History.started = false;
        },
        trigger: function (target) {
            window.location.href = this.prefix + target;
        },

        events: [],
        bind: function (fn) {
            if (isFunction(fn)) {
                this.events.push(fn);
            }
        },
        getFragment: function (fragment) {
            if (fragment == null) {
                if (this.monitorMode === "popstate") {
                    fragment = this.getPath();
                } else {
                    fragment = this.getHash(window);
                }
            }
            return fragment.replace(/^[#\/]|\s+$/g, "");
        },
        getHash: function (window) {
            // IE6直接用location.hash取hash，可能会取少一部分内容
            // 比如 http://www.cnblogs.com/rubylouvre#stream/xxxxx?lang=zh_c
            // ie6 => location.hash = #stream/xxxxx
            // 其他浏览器 => location.hash = #stream/xxxxx?lang=zh_c
            // firefox 会自作多情对hash进行decodeURIComponent
            // 又比如 http://www.cnblogs.com/rubylouvre/#!/home/q={%22thedate%22:%2220121010~20121010%22}
            // firefox 15 => #!/home/q={"thedate":"20121010~20121010"}
            // 其他浏览器 => #!/home/q={%22thedate%22:%2220121010~20121010%22}
            var path = (window || this).location.href;
            return this._getHash(path.slice(path.indexOf("#")));
        },
        _getHash: function (path) {
            if (path.indexOf("#/") === 0) {
                return decodeURIComponent(path.slice(2));
            }
            if (path.indexOf("#!/") === 0) {
                return decodeURIComponent(path.slice(3));
            }
            return "";
        },
        getPath: function () {
            var path = decodeURIComponent(this.location.pathname + this.location.search);
            var root = this.basepath.slice(0, -1);
            if (!path.indexOf(root)) {
                path = path.slice(root.length);
            }
            return path.slice(1);
        },
        _getAbsolutePath: function (a) {
            return !a.hasAttribute ? a.getAttribute("href", 4) : a.href;
        },
        fireRouteChange: function (hash, options) {
            var flag = false;
            if (this.defaults.noBasePathNoChange) {
                if (this.basepath === "/") {
                    flag = true;
                } else {
                    var basepath = this.basepath.slice(1);
                    if (basepath.charAt(basepath.length - 1) === "/") {
                        basepath = basepath.slice(0, -1);
                    }
                    if (hash.indexOf(basepath) === 0) {
                        flag = true;
                    }
                }
            } else {
                flag = true;
            }
            if (flag) {
                this.events.forEach(function (fn) {
                    fn(hash, options);
                });
                if (this.defaults.fireAnchor) {
                    scrollToAnchorId(hash.replace(/\?.*/g, ""));
                }
            }
        },
        _setHash: function (location, hash, replace) {
            var href = location.href.replace(/(javascript:|#).*$/, '');
            if (replace) {
                location.replace(href + hash);
            } else {
                location.hash = hash;
            }
        },
        _setIframeHistory: function (hash, replace) {
            if (!this.iframe) {
                return;
            }
            var idoc = this.iframe.document;
            idoc.open();
            idoc.write(this.iframeHTML);
            idoc.close();
            this._setHash(idoc.location, hash, replace);
        }
    };

    //得到页面第一个符合条件的A标签
    function getFirstAnchor(list) {
        for (var _i13 = 0, el; el = list[_i13++];) {
            if (el.nodeName === "A") {
                return el;
            }
        }
    }

    function scrollToAnchorId(hash, el) {
        if (el = document.getElementById(hash)) {
            el.scrollIntoView();
        } else if (el = getFirstAnchor(document.getElementsByName(hash))) {
            el.scrollIntoView();
        } else {
            window.scrollTo(0, 0);
        }
    }

    var router = new History();

    /**
     * @description 用于解析各种时间数据
     *  @param {String} type 将要调用的子方法名
     *  @param {...*} [params] 调用的子方法名所需参数
     *  @return
     */
    function date(type, params) {
        var fn = date[type];
        params = slice.call(arguments, 1);
        if (type && fn) {
            return fn.apply(fn, params);
        }
    }

    /**
     * @description 判断闰年
     * @param {Date} date 日期对象
     * @return
     */
    date.isLeapYear = function (date) {
        return 0 == date.getYear() % 4 && (date.getYear() % 100 != 0 || date.getYear() % 400 == 0);
    };

    /**
     * @description 日期对象转换为指定格式的字符串
     *
     * @param {String} [formatStr] 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
     * @param {Date} [date] 日期对象, 如果缺省，则为当前时间
     *                     YYYY/yyyy/YY/yy 表示年份
     *                     MM/M 月份
     *                     W/w 星期
     *                     dd/DD/d/D 日期
     *                     hh/HH/h/H 时间
     *                     mm/m 分钟
     *                     ss/SS/s/S 秒
     * @return  {String}
     */
    date.dateToStr = function (formatStr, date) {
        formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
        date = arguments[1] || new Date();
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, date.getYear() % 100 > 9 ? (date.getYear() % 100).toString() : '0' + date.getYear() % 100);
        str = str.replace(/MM/, date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1));
        str = str.replace(/M/g, date.getMonth() + 1);
        str = str.replace(/w|W/g, Week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;
    };

    /**
     * @description 日期计算
     * @param {String} strInterval 可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @param {Number} num
     * @param {Date} date 日期对象
     * @return {Date}返回日期对象
     */
    date.dateAdd = function (strInterval, num, date) {
        date = arguments[2] || new Date();
        switch (strInterval) {
            case 's':
                return new Date(date.getTime() + 1000 * num);
            case 'n':
                return new Date(date.getTime() + 60000 * num);
            case 'h':
                return new Date(date.getTime() + 3600000 * num);
            case 'd':
                return new Date(date.getTime() + 86400000 * num);
            case 'w':
                return new Date(date.getTime() + 86400000 * 7 * num);
            case 'm':
                return new Date(date.getFullYear(), date.getMonth() + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            case 'y':
                return new Date(date.getFullYear() + num, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        }
    };

    /**
     * @description 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
     *
     * @param {String} strInterval  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @param {Date} dtStart  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @param {Date} dtEnd  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
     * @return {number} 计算后的时间差值
     */
    date.dateDiff = function (strInterval, dtStart, dtEnd) {
        switch (strInterval) {
            case 's':
                return parseInt((dtEnd - dtStart) / 1000);
            case 'n':
                return parseInt((dtEnd - dtStart) / 60000);
            case 'h':
                return parseInt((dtEnd - dtStart) / 3600000);
            case 'd':
                return parseInt((dtEnd - dtStart) / 86400000);
            case 'w':
                return parseInt((dtEnd - dtStart) / (86400000 * 7));
            case 'm':
                return dtEnd.getMonth() + 1 + (dtEnd.getFullYear() - dtStart.getFullYear()) * 12 - (dtStart.getMonth() + 1);
            case 'y':
                return dtEnd.getFullYear() - dtStart.getFullYear();
        }
    };

    /**
     * @description 字符串转换为日期对象
     *
     * @param {String} dateStr 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
     * @return {Date}
     */
    date.strToDate = function (dateStr) {
        var data = dateStr;
        var reCat = /(\d{1,4})/gm;
        var t = data.match(reCat);
        t[1] = t[1] - 1;
        var d = new Date(t.join(','));
        return d;
    };

    /**
     * @description 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
     * @param {String} formatStr
     * @param {String} dateStr
     * @return {Date}
     */
    date.strFormatToDate = function (formatStr, dateStr) {
        var year = 0;
        var start = -1;
        var len = dateStr.length;
        if ((start = formatStr.indexOf('yyyy')) > -1 && start < len) {
            year = dateStr.substr(start, 4);
        }
        var month = 0;
        if ((start = formatStr.indexOf('MM')) > -1 && start < len) {
            month = parseInt(dateStr.substr(start, 2)) - 1;
        }
        var day = 0;
        if ((start = formatStr.indexOf('dd')) > -1 && start < len) {
            day = parseInt(dateStr.substr(start, 2));
        }
        var hour = 0;
        if (((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len) {
            hour = parseInt(dateStr.substr(start, 2));
        }
        var minute = 0;
        if ((start = formatStr.indexOf('mm')) > -1 && start < len) {
            minute = dateStr.substr(start, 2);
        }
        var second = 0;
        if ((start = formatStr.indexOf('ss')) > -1 && start < len) {
            second = dateStr.substr(start, 2);
        }
        return new Date(year, month, day, hour, minute, second);
    };

    /**
     * @description 日期对象转换为毫秒数
     * @param {Date} date
     * @return {Number}
     */
    date.dateToLong = function (date) {
        return date.getTime();
    };

    /**
     * @description 字符串日期对象转换为毫秒数
     * @param {String} formatStr
     * @param {String} dateStr
     * @return {Number}
     */
    date.strToLong = function (formatStr, dateStr) {
        return this.dateToLong(this.strFormatToDate(formatStr, dateStr));
    };

    /**
     * @description 毫秒转换为日期对象
     * @param {Number} dateVal 日期的毫秒数
     * @return {Date}
     */
    date.longToDate = function (dateVal) {
        return new Date(dateVal);
    };
    /**
     * @description 判断字符串是否为日期格式
     * @param {String} str 字符串
     * @param {String} formatStr 日期格式， 如下 yyyy-MM-dd
     * @return
     */
    date.isDate = function (str, formatStr) {
        if (formatStr == null) {
            formatStr = "yyyyMMdd";
        }
        var yIndex = formatStr.indexOf("yyyy");
        if (yIndex == -1) {
            return false;
        }
        var year = str.substring(yIndex, yIndex + 4);
        var mIndex = formatStr.indexOf("MM");
        if (mIndex == -1) {
            return false;
        }
        var month = str.substring(mIndex, mIndex + 2);
        var dIndex = formatStr.indexOf("dd");
        if (dIndex == -1) {
            return false;
        }
        var day = str.substring(dIndex, dIndex + 2);
        if (!isNumber(year) || year > "2100" || year < "1900") {
            return false;
        }
        if (!isNumber(month) || month > "12" || month < "01") {
            return false;
        }
        if (day > getMaxDay(year, month) || day < "01") {
            return false;
        }
        return true;
    };

    /**
     * @description 获取某年某月的最大天数
     * @param {Number} year 年份
     * @param {Number} month 月份
     * @return {Number}
     */
    date.getMaxDay = function (year, month) {
        if (month == 4 || month == 6 || month == 9 || month == 11) return "30";
        if (month == 2) if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) return "29";else return "28";
        return "31";
    };

    /**
     * @description 把日期分割成数组 [年、月、日、时、分、秒]
     * @param {Date} myDate
     * @return {Array}
     */
    date.toArray = function (myDate) {
        myDate = arguments[0] || new Date();
        var myArray = Array();
        myArray[0] = myDate.getFullYear();
        myArray[1] = myDate.getMonth();
        myArray[2] = myDate.getDate();
        myArray[3] = myDate.getHours();
        myArray[4] = myDate.getMinutes();
        myArray[5] = myDate.getSeconds();
        return myArray;
    };
    /**
     * @description 取得日期数据信息
     * 参数 interval 表示数据类型
     * y 年 M月 d日 w星期 ww周 h时 n分 s秒
     * @param {String} interval
     * @param {Date} myDate
     * @return {Number}
     */
    date.datePart = function (interval, myDate) {
        myDate = arguments[1] || new Date();
        var partStr = '';
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        switch (interval) {
            case 'y':
                partStr = myDate.getFullYear();
                break;
            case 'M':
                partStr = myDate.getMonth() + 1;
                break;
            case 'd':
                partStr = myDate.getDate();
                break;
            case 'w':
                partStr = Week[myDate.getDay()];
                break;
            case 'ww':
                partStr = myDate.WeekNumOfYear();
                break;
            case 'h':
                partStr = myDate.getHours();
                break;
            case 'm':
                partStr = myDate.getMinutes();
                break;
            case 's':
                partStr = myDate.getSeconds();
                break;
        }
        return partStr;
    };

    /**
     * @description 取得当前日期所在月的最大天数
     * @param {Date} date
     * @return {Number}
     */
    date.maxDayOfDate = function (date) {
        date = arguments[0] || new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() + 1);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        var newDate = new Date(time);
        return newDate.getDate();
    };

    relax.shadowCopy = shadowCopy;
    relax.library = library;
    relax.vue = vue;
    relax.clearHTML = clearHTML;
    relax.innerHTML = innerHTML;
    relax.parseHTML = parseHTML;
    relax.compileTMPL = compileTMPL;
    relax.parseTMPL = parseTMPL;
    relax.ready = ready;
    relax.define = define;
    relax.priority = priority;
    relax.scan = scan;
    relax.jsonrpc = jsonrpc;
    relax.RPC = RPC;
    relax.router = router;
    relax.platform = platform;
    relax.browser = browser;
    relax.engine = engine;
    relax.documentMode = documentMode;
    relax.store = store;
    relax.vmodels = vmodels;
    relax.queue = queue;
    relax.date = date;

    return relax;
});