"use strict";
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = function(cb, mod) {
    return function __require() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
            exports: {}
        }).exports, mod), mod.exports;
    };
};
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toESM = function(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod);
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// node_modules/rxjs/dist/cjs/internal/util/isFunction.js
var require_isFunction = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isFunction.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isFunction = void 0;
        function isFunction(value) {
            return typeof value === "function";
        }
        exports2.isFunction = isFunction;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/createErrorClass.js
var require_createErrorClass = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/createErrorClass.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.createErrorClass = void 0;
        function createErrorClass(createImpl) {
            var _super = function _super(instance) {
                Error.call(instance);
                instance.stack = new Error().stack;
            };
            var ctorFunc = createImpl(_super);
            ctorFunc.prototype = Object.create(Error.prototype);
            ctorFunc.prototype.constructor = ctorFunc;
            return ctorFunc;
        }
        exports2.createErrorClass = createErrorClass;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/UnsubscriptionError.js
var require_UnsubscriptionError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/UnsubscriptionError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.UnsubscriptionError = void 0;
        var createErrorClass_1 = require_createErrorClass();
        exports2.UnsubscriptionError = createErrorClass_1.createErrorClass(function(_super) {
            return function UnsubscriptionErrorImpl(errors) {
                _super(this);
                this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
                    return i + 1 + ") " + err.toString();
                }).join("\n  ") : "";
                this.name = "UnsubscriptionError";
                this.errors = errors;
            };
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/util/arrRemove.js
var require_arrRemove = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/arrRemove.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.arrRemove = void 0;
        function arrRemove(arr, item) {
            if (arr) {
                var index = arr.indexOf(item);
                0 <= index && arr.splice(index, 1);
            }
        }
        exports2.arrRemove = arrRemove;
    }
});
// node_modules/rxjs/dist/cjs/internal/Subscription.js
var require_Subscription = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/Subscription.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isSubscription = exports2.EMPTY_SUBSCRIPTION = exports2.Subscription = void 0;
        var isFunction_1 = require_isFunction();
        var UnsubscriptionError_1 = require_UnsubscriptionError();
        var arrRemove_1 = require_arrRemove();
        var Subscription = function() {
            function Subscription2(initialTeardown) {
                this.initialTeardown = initialTeardown;
                this.closed = false;
                this._parentage = null;
                this._finalizers = null;
            }
            Subscription2.prototype.unsubscribe = function() {
                var e_1, _a, e_2, _b;
                var errors;
                if (!this.closed) {
                    this.closed = true;
                    var _parentage = this._parentage;
                    if (_parentage) {
                        this._parentage = null;
                        if (Array.isArray(_parentage)) {
                            try {
                                for(var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()){
                                    var parent_1 = _parentage_1_1.value;
                                    parent_1.remove(this);
                                }
                            } catch (e_1_1) {
                                e_1 = {
                                    error: e_1_1
                                };
                            } finally{
                                try {
                                    if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                                } finally{
                                    if (e_1) throw e_1.error;
                                }
                            }
                        } else {
                            _parentage.remove(this);
                        }
                    }
                    var initialFinalizer = this.initialTeardown;
                    if (isFunction_1.isFunction(initialFinalizer)) {
                        try {
                            initialFinalizer();
                        } catch (e) {
                            errors = _instanceof(e, UnsubscriptionError_1.UnsubscriptionError) ? e.errors : [
                                e
                            ];
                        }
                    }
                    var _finalizers = this._finalizers;
                    if (_finalizers) {
                        this._finalizers = null;
                        try {
                            for(var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()){
                                var finalizer = _finalizers_1_1.value;
                                try {
                                    execFinalizer(finalizer);
                                } catch (err) {
                                    errors = errors !== null && errors !== void 0 ? errors : [];
                                    if (_instanceof(err, UnsubscriptionError_1.UnsubscriptionError)) {
                                        errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                                    } else {
                                        errors.push(err);
                                    }
                                }
                            }
                        } catch (e_2_1) {
                            e_2 = {
                                error: e_2_1
                            };
                        } finally{
                            try {
                                if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                            } finally{
                                if (e_2) throw e_2.error;
                            }
                        }
                    }
                    if (errors) {
                        throw new UnsubscriptionError_1.UnsubscriptionError(errors);
                    }
                }
            };
            Subscription2.prototype.add = function(teardown) {
                var _a;
                if (teardown && teardown !== this) {
                    if (this.closed) {
                        execFinalizer(teardown);
                    } else {
                        if (_instanceof(teardown, Subscription2)) {
                            if (teardown.closed || teardown._hasParent(this)) {
                                return;
                            }
                            teardown._addParent(this);
                        }
                        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
                    }
                }
            };
            Subscription2.prototype._hasParent = function(parent) {
                var _parentage = this._parentage;
                return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
            };
            Subscription2.prototype._addParent = function(parent) {
                var _parentage = this._parentage;
                this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [
                    _parentage,
                    parent
                ] : parent;
            };
            Subscription2.prototype._removeParent = function(parent) {
                var _parentage = this._parentage;
                if (_parentage === parent) {
                    this._parentage = null;
                } else if (Array.isArray(_parentage)) {
                    arrRemove_1.arrRemove(_parentage, parent);
                }
            };
            Subscription2.prototype.remove = function(teardown) {
                var _finalizers = this._finalizers;
                _finalizers && arrRemove_1.arrRemove(_finalizers, teardown);
                if (_instanceof(teardown, Subscription2)) {
                    teardown._removeParent(this);
                }
            };
            Subscription2.EMPTY = function() {
                var empty = new Subscription2();
                empty.closed = true;
                return empty;
            }();
            return Subscription2;
        }();
        exports2.Subscription = Subscription;
        exports2.EMPTY_SUBSCRIPTION = Subscription.EMPTY;
        function isSubscription(value) {
            return _instanceof(value, Subscription) || value && "closed" in value && isFunction_1.isFunction(value.remove) && isFunction_1.isFunction(value.add) && isFunction_1.isFunction(value.unsubscribe);
        }
        exports2.isSubscription = isSubscription;
        function execFinalizer(finalizer) {
            if (isFunction_1.isFunction(finalizer)) {
                finalizer();
            } else {
                finalizer.unsubscribe();
            }
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/config.js
var require_config = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/config.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.config = void 0;
        exports2.config = {
            onUnhandledError: null,
            onStoppedNotification: null,
            Promise: void 0,
            useDeprecatedSynchronousErrorHandling: false,
            useDeprecatedNextContext: false
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/timeoutProvider.js
var require_timeoutProvider = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/timeoutProvider.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.timeoutProvider = void 0;
        exports2.timeoutProvider = {
            setTimeout: function setTimeout1(handler, timeout) {
                var args = [];
                for(var _i = 2; _i < arguments.length; _i++){
                    args[_i - 2] = arguments[_i];
                }
                var delegate = exports2.timeoutProvider.delegate;
                if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
                    return delegate.setTimeout.apply(delegate, __spreadArray([
                        handler,
                        timeout
                    ], __read(args)));
                }
                return setTimeout.apply(void 0, __spreadArray([
                    handler,
                    timeout
                ], __read(args)));
            },
            clearTimeout: function clearTimeout1(handle) {
                var delegate = exports2.timeoutProvider.delegate;
                return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
            },
            delegate: void 0
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/util/reportUnhandledError.js
var require_reportUnhandledError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/reportUnhandledError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.reportUnhandledError = void 0;
        var config_1 = require_config();
        var timeoutProvider_1 = require_timeoutProvider();
        function reportUnhandledError(err) {
            timeoutProvider_1.timeoutProvider.setTimeout(function() {
                var onUnhandledError = config_1.config.onUnhandledError;
                if (onUnhandledError) {
                    onUnhandledError(err);
                } else {
                    throw err;
                }
            });
        }
        exports2.reportUnhandledError = reportUnhandledError;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/noop.js
var require_noop = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/noop.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.noop = void 0;
        function noop() {}
        exports2.noop = noop;
    }
});
// node_modules/rxjs/dist/cjs/internal/NotificationFactories.js
var require_NotificationFactories = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/NotificationFactories.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.createNotification = exports2.nextNotification = exports2.errorNotification = exports2.COMPLETE_NOTIFICATION = void 0;
        exports2.COMPLETE_NOTIFICATION = function() {
            return createNotification("C", void 0, void 0);
        }();
        function errorNotification(error) {
            return createNotification("E", void 0, error);
        }
        exports2.errorNotification = errorNotification;
        function nextNotification(value) {
            return createNotification("N", value, void 0);
        }
        exports2.nextNotification = nextNotification;
        function createNotification(kind, value, error) {
            return {
                kind: kind,
                value: value,
                error: error
            };
        }
        exports2.createNotification = createNotification;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/errorContext.js
var require_errorContext = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/errorContext.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.captureError = exports2.errorContext = void 0;
        var config_1 = require_config();
        var context = null;
        function errorContext(cb) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                var isRoot = !context;
                if (isRoot) {
                    context = {
                        errorThrown: false,
                        error: null
                    };
                }
                cb();
                if (isRoot) {
                    var _a = context, errorThrown = _a.errorThrown, error = _a.error;
                    context = null;
                    if (errorThrown) {
                        throw error;
                    }
                }
            } else {
                cb();
            }
        }
        exports2.errorContext = errorContext;
        function captureError(err) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling && context) {
                context.errorThrown = true;
                context.error = err;
            }
        }
        exports2.captureError = captureError;
    }
});
// node_modules/rxjs/dist/cjs/internal/Subscriber.js
var require_Subscriber = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/Subscriber.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.EMPTY_OBSERVER = exports2.SafeSubscriber = exports2.Subscriber = void 0;
        var isFunction_1 = require_isFunction();
        var Subscription_1 = require_Subscription();
        var config_1 = require_config();
        var reportUnhandledError_1 = require_reportUnhandledError();
        var noop_1 = require_noop();
        var NotificationFactories_1 = require_NotificationFactories();
        var timeoutProvider_1 = require_timeoutProvider();
        var errorContext_1 = require_errorContext();
        var Subscriber = function(_super) {
            __extends(Subscriber2, _super);
            function Subscriber2(destination) {
                var _this = _super.call(this) || this;
                _this.isStopped = false;
                if (destination) {
                    _this.destination = destination;
                    if (Subscription_1.isSubscription(destination)) {
                        destination.add(_this);
                    }
                } else {
                    _this.destination = exports2.EMPTY_OBSERVER;
                }
                return _this;
            }
            Subscriber2.create = function(next, error, complete) {
                return new SafeSubscriber(next, error, complete);
            };
            Subscriber2.prototype.next = function(value) {
                if (this.isStopped) {
                    handleStoppedNotification(NotificationFactories_1.nextNotification(value), this);
                } else {
                    this._next(value);
                }
            };
            Subscriber2.prototype.error = function(err) {
                if (this.isStopped) {
                    handleStoppedNotification(NotificationFactories_1.errorNotification(err), this);
                } else {
                    this.isStopped = true;
                    this._error(err);
                }
            };
            Subscriber2.prototype.complete = function() {
                if (this.isStopped) {
                    handleStoppedNotification(NotificationFactories_1.COMPLETE_NOTIFICATION, this);
                } else {
                    this.isStopped = true;
                    this._complete();
                }
            };
            Subscriber2.prototype.unsubscribe = function() {
                if (!this.closed) {
                    this.isStopped = true;
                    _super.prototype.unsubscribe.call(this);
                    this.destination = null;
                }
            };
            Subscriber2.prototype._next = function(value) {
                this.destination.next(value);
            };
            Subscriber2.prototype._error = function(err) {
                try {
                    this.destination.error(err);
                } finally{
                    this.unsubscribe();
                }
            };
            Subscriber2.prototype._complete = function() {
                try {
                    this.destination.complete();
                } finally{
                    this.unsubscribe();
                }
            };
            return Subscriber2;
        }(Subscription_1.Subscription);
        exports2.Subscriber = Subscriber;
        var _bind = Function.prototype.bind;
        function bind(fn, thisArg) {
            return _bind.call(fn, thisArg);
        }
        var ConsumerObserver = function() {
            function ConsumerObserver2(partialObserver) {
                this.partialObserver = partialObserver;
            }
            ConsumerObserver2.prototype.next = function(value) {
                var partialObserver = this.partialObserver;
                if (partialObserver.next) {
                    try {
                        partialObserver.next(value);
                    } catch (error) {
                        handleUnhandledError(error);
                    }
                }
            };
            ConsumerObserver2.prototype.error = function(err) {
                var partialObserver = this.partialObserver;
                if (partialObserver.error) {
                    try {
                        partialObserver.error(err);
                    } catch (error) {
                        handleUnhandledError(error);
                    }
                } else {
                    handleUnhandledError(err);
                }
            };
            ConsumerObserver2.prototype.complete = function() {
                var partialObserver = this.partialObserver;
                if (partialObserver.complete) {
                    try {
                        partialObserver.complete();
                    } catch (error) {
                        handleUnhandledError(error);
                    }
                }
            };
            return ConsumerObserver2;
        }();
        var SafeSubscriber = function(_super) {
            __extends(SafeSubscriber2, _super);
            function SafeSubscriber2(observerOrNext, error, complete) {
                var _this = _super.call(this) || this;
                var partialObserver;
                if (isFunction_1.isFunction(observerOrNext) || !observerOrNext) {
                    partialObserver = {
                        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
                        error: error !== null && error !== void 0 ? error : void 0,
                        complete: complete !== null && complete !== void 0 ? complete : void 0
                    };
                } else {
                    var context_1;
                    if (_this && config_1.config.useDeprecatedNextContext) {
                        context_1 = Object.create(observerOrNext);
                        context_1.unsubscribe = function() {
                            return _this.unsubscribe();
                        };
                        partialObserver = {
                            next: observerOrNext.next && bind(observerOrNext.next, context_1),
                            error: observerOrNext.error && bind(observerOrNext.error, context_1),
                            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
                        };
                    } else {
                        partialObserver = observerOrNext;
                    }
                }
                _this.destination = new ConsumerObserver(partialObserver);
                return _this;
            }
            return SafeSubscriber2;
        }(Subscriber);
        exports2.SafeSubscriber = SafeSubscriber;
        function handleUnhandledError(error) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                errorContext_1.captureError(error);
            } else {
                reportUnhandledError_1.reportUnhandledError(error);
            }
        }
        function defaultErrorHandler(err) {
            throw err;
        }
        function handleStoppedNotification(notification, subscriber) {
            var onStoppedNotification = config_1.config.onStoppedNotification;
            onStoppedNotification && timeoutProvider_1.timeoutProvider.setTimeout(function() {
                return onStoppedNotification(notification, subscriber);
            });
        }
        exports2.EMPTY_OBSERVER = {
            closed: true,
            next: noop_1.noop,
            error: defaultErrorHandler,
            complete: noop_1.noop
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/symbol/observable.js
var require_observable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/symbol/observable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.observable = void 0;
        exports2.observable = function() {
            return typeof Symbol === "function" && Symbol.observable || "@@observable";
        }();
    }
});
// node_modules/rxjs/dist/cjs/internal/util/identity.js
var require_identity = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/identity.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.identity = void 0;
        function identity(x) {
            return x;
        }
        exports2.identity = identity;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/pipe.js
var require_pipe = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/pipe.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.pipeFromArray = exports2.pipe = void 0;
        var identity_1 = require_identity();
        function pipe() {
            var fns = [];
            for(var _i = 0; _i < arguments.length; _i++){
                fns[_i] = arguments[_i];
            }
            return pipeFromArray(fns);
        }
        exports2.pipe = pipe;
        function pipeFromArray(fns) {
            if (fns.length === 0) {
                return identity_1.identity;
            }
            if (fns.length === 1) {
                return fns[0];
            }
            return function piped(input) {
                return fns.reduce(function(prev, fn) {
                    return fn(prev);
                }, input);
            };
        }
        exports2.pipeFromArray = pipeFromArray;
    }
});
// node_modules/rxjs/dist/cjs/internal/Observable.js
var require_Observable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/Observable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.Observable = void 0;
        var Subscriber_1 = require_Subscriber();
        var Subscription_1 = require_Subscription();
        var observable_1 = require_observable();
        var pipe_1 = require_pipe();
        var config_1 = require_config();
        var isFunction_1 = require_isFunction();
        var errorContext_1 = require_errorContext();
        var Observable = function() {
            function Observable2(subscribe) {
                if (subscribe) {
                    this._subscribe = subscribe;
                }
            }
            Observable2.prototype.lift = function(operator) {
                var observable = new Observable2();
                observable.source = this;
                observable.operator = operator;
                return observable;
            };
            Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
                var _this = this;
                var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new Subscriber_1.SafeSubscriber(observerOrNext, error, complete);
                errorContext_1.errorContext(function() {
                    var _a = _this, operator = _a.operator, source = _a.source;
                    subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
                });
                return subscriber;
            };
            Observable2.prototype._trySubscribe = function(sink) {
                try {
                    return this._subscribe(sink);
                } catch (err) {
                    sink.error(err);
                }
            };
            Observable2.prototype.forEach = function(next, promiseCtor) {
                var _this = this;
                promiseCtor = getPromiseCtor(promiseCtor);
                return new promiseCtor(function(resolve, reject) {
                    var subscriber = new Subscriber_1.SafeSubscriber({
                        next: function next1(value) {
                            try {
                                next(value);
                            } catch (err) {
                                reject(err);
                                subscriber.unsubscribe();
                            }
                        },
                        error: reject,
                        complete: resolve
                    });
                    _this.subscribe(subscriber);
                });
            };
            Observable2.prototype._subscribe = function(subscriber) {
                var _a;
                return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
            };
            Observable2.prototype[observable_1.observable] = function() {
                return this;
            };
            Observable2.prototype.pipe = function() {
                var operations = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    operations[_i] = arguments[_i];
                }
                return pipe_1.pipeFromArray(operations)(this);
            };
            Observable2.prototype.toPromise = function(promiseCtor) {
                var _this = this;
                promiseCtor = getPromiseCtor(promiseCtor);
                return new promiseCtor(function(resolve, reject) {
                    var value;
                    _this.subscribe(function(x) {
                        return value = x;
                    }, function(err) {
                        return reject(err);
                    }, function() {
                        return resolve(value);
                    });
                });
            };
            Observable2.create = function(subscribe) {
                return new Observable2(subscribe);
            };
            return Observable2;
        }();
        exports2.Observable = Observable;
        function getPromiseCtor(promiseCtor) {
            var _a;
            return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config_1.config.Promise) !== null && _a !== void 0 ? _a : Promise;
        }
        function isObserver(value) {
            return value && isFunction_1.isFunction(value.next) && isFunction_1.isFunction(value.error) && isFunction_1.isFunction(value.complete);
        }
        function isSubscriber(value) {
            return value && _instanceof(value, Subscriber_1.Subscriber) || isObserver(value) && Subscription_1.isSubscription(value);
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/util/lift.js
var require_lift = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/lift.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.operate = exports2.hasLift = void 0;
        var isFunction_1 = require_isFunction();
        function hasLift(source) {
            return isFunction_1.isFunction(source === null || source === void 0 ? void 0 : source.lift);
        }
        exports2.hasLift = hasLift;
        function operate(init) {
            return function(source) {
                if (hasLift(source)) {
                    return source.lift(function(liftedSource) {
                        try {
                            return init(liftedSource, this);
                        } catch (err) {
                            this.error(err);
                        }
                    });
                }
                throw new TypeError("Unable to lift unknown Observable type");
            };
        }
        exports2.operate = operate;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/OperatorSubscriber.js
var require_OperatorSubscriber = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/OperatorSubscriber.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.OperatorSubscriber = exports2.createOperatorSubscriber = void 0;
        var Subscriber_1 = require_Subscriber();
        function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
            return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
        }
        exports2.createOperatorSubscriber = createOperatorSubscriber;
        var OperatorSubscriber = function(_super) {
            __extends(OperatorSubscriber2, _super);
            function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
                var _this = _super.call(this, destination) || this;
                _this.onFinalize = onFinalize;
                _this.shouldUnsubscribe = shouldUnsubscribe;
                _this._next = onNext ? function(value) {
                    try {
                        onNext(value);
                    } catch (err) {
                        destination.error(err);
                    }
                } : _super.prototype._next;
                _this._error = onError ? function(err) {
                    try {
                        onError(err);
                    } catch (err2) {
                        destination.error(err2);
                    } finally{
                        this.unsubscribe();
                    }
                } : _super.prototype._error;
                _this._complete = onComplete ? function() {
                    try {
                        onComplete();
                    } catch (err) {
                        destination.error(err);
                    } finally{
                        this.unsubscribe();
                    }
                } : _super.prototype._complete;
                return _this;
            }
            OperatorSubscriber2.prototype.unsubscribe = function() {
                var _a;
                if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                    var closed_1 = this.closed;
                    _super.prototype.unsubscribe.call(this);
                    !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
                }
            };
            return OperatorSubscriber2;
        }(Subscriber_1.Subscriber);
        exports2.OperatorSubscriber = OperatorSubscriber;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/refCount.js
var require_refCount = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/refCount.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.refCount = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function refCount() {
            return lift_1.operate(function(source, subscriber) {
                var connection = null;
                source._refCount++;
                var refCounter = OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, void 0, void 0, function() {
                    if (!source || source._refCount <= 0 || 0 < --source._refCount) {
                        connection = null;
                        return;
                    }
                    var sharedConnection = source._connection;
                    var conn = connection;
                    connection = null;
                    if (sharedConnection && (!conn || sharedConnection === conn)) {
                        sharedConnection.unsubscribe();
                    }
                    subscriber.unsubscribe();
                });
                source.subscribe(refCounter);
                if (!refCounter.closed) {
                    connection = source.connect();
                }
            });
        }
        exports2.refCount = refCount;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/ConnectableObservable.js
var require_ConnectableObservable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/ConnectableObservable.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.ConnectableObservable = void 0;
        var Observable_1 = require_Observable();
        var Subscription_1 = require_Subscription();
        var refCount_1 = require_refCount();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var lift_1 = require_lift();
        var ConnectableObservable = function(_super) {
            __extends(ConnectableObservable2, _super);
            function ConnectableObservable2(source, subjectFactory) {
                var _this = _super.call(this) || this;
                _this.source = source;
                _this.subjectFactory = subjectFactory;
                _this._subject = null;
                _this._refCount = 0;
                _this._connection = null;
                if (lift_1.hasLift(source)) {
                    _this.lift = source.lift;
                }
                return _this;
            }
            ConnectableObservable2.prototype._subscribe = function(subscriber) {
                return this.getSubject().subscribe(subscriber);
            };
            ConnectableObservable2.prototype.getSubject = function() {
                var subject = this._subject;
                if (!subject || subject.isStopped) {
                    this._subject = this.subjectFactory();
                }
                return this._subject;
            };
            ConnectableObservable2.prototype._teardown = function() {
                this._refCount = 0;
                var _connection = this._connection;
                this._subject = this._connection = null;
                _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
            };
            ConnectableObservable2.prototype.connect = function() {
                var _this = this;
                var connection = this._connection;
                if (!connection) {
                    connection = this._connection = new Subscription_1.Subscription();
                    var subject_1 = this.getSubject();
                    connection.add(this.source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subject_1, void 0, function() {
                        _this._teardown();
                        subject_1.complete();
                    }, function(err) {
                        _this._teardown();
                        subject_1.error(err);
                    }, function() {
                        return _this._teardown();
                    })));
                    if (connection.closed) {
                        this._connection = null;
                        connection = Subscription_1.Subscription.EMPTY;
                    }
                }
                return connection;
            };
            ConnectableObservable2.prototype.refCount = function() {
                return refCount_1.refCount()(this);
            };
            return ConnectableObservable2;
        }(Observable_1.Observable);
        exports2.ConnectableObservable = ConnectableObservable;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/performanceTimestampProvider.js
var require_performanceTimestampProvider = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/performanceTimestampProvider.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.performanceTimestampProvider = void 0;
        exports2.performanceTimestampProvider = {
            now: function now() {
                return (exports2.performanceTimestampProvider.delegate || performance).now();
            },
            delegate: void 0
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/animationFrameProvider.js
var require_animationFrameProvider = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/animationFrameProvider.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.animationFrameProvider = void 0;
        var Subscription_1 = require_Subscription();
        exports2.animationFrameProvider = {
            schedule: function schedule(callback) {
                var request = requestAnimationFrame;
                var cancel = cancelAnimationFrame;
                var delegate = exports2.animationFrameProvider.delegate;
                if (delegate) {
                    request = delegate.requestAnimationFrame;
                    cancel = delegate.cancelAnimationFrame;
                }
                var handle = request(function(timestamp) {
                    cancel = void 0;
                    callback(timestamp);
                });
                return new Subscription_1.Subscription(function() {
                    return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
                });
            },
            requestAnimationFrame: function requestAnimationFrame1() {
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                var delegate = exports2.animationFrameProvider.delegate;
                return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
            },
            cancelAnimationFrame: function cancelAnimationFrame1() {
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                var delegate = exports2.animationFrameProvider.delegate;
                return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
            },
            delegate: void 0
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/dom/animationFrames.js
var require_animationFrames = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/dom/animationFrames.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.animationFrames = void 0;
        var Observable_1 = require_Observable();
        var performanceTimestampProvider_1 = require_performanceTimestampProvider();
        var animationFrameProvider_1 = require_animationFrameProvider();
        function animationFrames(timestampProvider) {
            return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
        }
        exports2.animationFrames = animationFrames;
        function animationFramesFactory(timestampProvider) {
            return new Observable_1.Observable(function(subscriber) {
                var provider = timestampProvider || performanceTimestampProvider_1.performanceTimestampProvider;
                var start = provider.now();
                var id = 0;
                var run = function run1() {
                    if (!subscriber.closed) {
                        id = animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(function(timestamp) {
                            id = 0;
                            var now = provider.now();
                            subscriber.next({
                                timestamp: timestampProvider ? now : timestamp,
                                elapsed: now - start
                            });
                            run();
                        });
                    }
                };
                run();
                return function() {
                    if (id) {
                        animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(id);
                    }
                };
            });
        }
        var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();
    }
});
// node_modules/rxjs/dist/cjs/internal/util/ObjectUnsubscribedError.js
var require_ObjectUnsubscribedError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/ObjectUnsubscribedError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.ObjectUnsubscribedError = void 0;
        var createErrorClass_1 = require_createErrorClass();
        exports2.ObjectUnsubscribedError = createErrorClass_1.createErrorClass(function(_super) {
            return function ObjectUnsubscribedErrorImpl() {
                _super(this);
                this.name = "ObjectUnsubscribedError";
                this.message = "object unsubscribed";
            };
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/Subject.js
var require_Subject = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/Subject.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AnonymousSubject = exports2.Subject = void 0;
        var Observable_1 = require_Observable();
        var Subscription_1 = require_Subscription();
        var ObjectUnsubscribedError_1 = require_ObjectUnsubscribedError();
        var arrRemove_1 = require_arrRemove();
        var errorContext_1 = require_errorContext();
        var Subject2 = function(_super) {
            __extends(Subject3, _super);
            function Subject3() {
                var _this = _super.call(this) || this;
                _this.closed = false;
                _this.currentObservers = null;
                _this.observers = [];
                _this.isStopped = false;
                _this.hasError = false;
                _this.thrownError = null;
                return _this;
            }
            Subject3.prototype.lift = function(operator) {
                var subject = new AnonymousSubject(this, this);
                subject.operator = operator;
                return subject;
            };
            Subject3.prototype._throwIfClosed = function() {
                if (this.closed) {
                    throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
                }
            };
            Subject3.prototype.next = function(value) {
                var _this = this;
                errorContext_1.errorContext(function() {
                    var e_1, _a;
                    _this._throwIfClosed();
                    if (!_this.isStopped) {
                        if (!_this.currentObservers) {
                            _this.currentObservers = Array.from(_this.observers);
                        }
                        try {
                            for(var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()){
                                var observer = _c.value;
                                observer.next(value);
                            }
                        } catch (e_1_1) {
                            e_1 = {
                                error: e_1_1
                            };
                        } finally{
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            } finally{
                                if (e_1) throw e_1.error;
                            }
                        }
                    }
                });
            };
            Subject3.prototype.error = function(err) {
                var _this = this;
                errorContext_1.errorContext(function() {
                    _this._throwIfClosed();
                    if (!_this.isStopped) {
                        _this.hasError = _this.isStopped = true;
                        _this.thrownError = err;
                        var observers = _this.observers;
                        while(observers.length){
                            observers.shift().error(err);
                        }
                    }
                });
            };
            Subject3.prototype.complete = function() {
                var _this = this;
                errorContext_1.errorContext(function() {
                    _this._throwIfClosed();
                    if (!_this.isStopped) {
                        _this.isStopped = true;
                        var observers = _this.observers;
                        while(observers.length){
                            observers.shift().complete();
                        }
                    }
                });
            };
            Subject3.prototype.unsubscribe = function() {
                this.isStopped = this.closed = true;
                this.observers = this.currentObservers = null;
            };
            Object.defineProperty(Subject3.prototype, "observed", {
                get: function get() {
                    var _a;
                    return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
                },
                enumerable: false,
                configurable: true
            });
            Subject3.prototype._trySubscribe = function(subscriber) {
                this._throwIfClosed();
                return _super.prototype._trySubscribe.call(this, subscriber);
            };
            Subject3.prototype._subscribe = function(subscriber) {
                this._throwIfClosed();
                this._checkFinalizedStatuses(subscriber);
                return this._innerSubscribe(subscriber);
            };
            Subject3.prototype._innerSubscribe = function(subscriber) {
                var _this = this;
                var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
                if (hasError || isStopped) {
                    return Subscription_1.EMPTY_SUBSCRIPTION;
                }
                this.currentObservers = null;
                observers.push(subscriber);
                return new Subscription_1.Subscription(function() {
                    _this.currentObservers = null;
                    arrRemove_1.arrRemove(observers, subscriber);
                });
            };
            Subject3.prototype._checkFinalizedStatuses = function(subscriber) {
                var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
                if (hasError) {
                    subscriber.error(thrownError);
                } else if (isStopped) {
                    subscriber.complete();
                }
            };
            Subject3.prototype.asObservable = function() {
                var observable = new Observable_1.Observable();
                observable.source = this;
                return observable;
            };
            Subject3.create = function(destination, source) {
                return new AnonymousSubject(destination, source);
            };
            return Subject3;
        }(Observable_1.Observable);
        exports2.Subject = Subject2;
        var AnonymousSubject = function(_super) {
            __extends(AnonymousSubject2, _super);
            function AnonymousSubject2(destination, source) {
                var _this = _super.call(this) || this;
                _this.destination = destination;
                _this.source = source;
                return _this;
            }
            AnonymousSubject2.prototype.next = function(value) {
                var _a, _b;
                (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
            };
            AnonymousSubject2.prototype.error = function(err) {
                var _a, _b;
                (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
            };
            AnonymousSubject2.prototype.complete = function() {
                var _a, _b;
                (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
            };
            AnonymousSubject2.prototype._subscribe = function(subscriber) {
                var _a, _b;
                return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : Subscription_1.EMPTY_SUBSCRIPTION;
            };
            return AnonymousSubject2;
        }(Subject2);
        exports2.AnonymousSubject = AnonymousSubject;
    }
});
// node_modules/rxjs/dist/cjs/internal/BehaviorSubject.js
var require_BehaviorSubject = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/BehaviorSubject.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.BehaviorSubject = void 0;
        var Subject_1 = require_Subject();
        var BehaviorSubject = function(_super) {
            __extends(BehaviorSubject2, _super);
            function BehaviorSubject2(_value) {
                var _this = _super.call(this) || this;
                _this._value = _value;
                return _this;
            }
            Object.defineProperty(BehaviorSubject2.prototype, "value", {
                get: function get() {
                    return this.getValue();
                },
                enumerable: false,
                configurable: true
            });
            BehaviorSubject2.prototype._subscribe = function(subscriber) {
                var subscription = _super.prototype._subscribe.call(this, subscriber);
                !subscription.closed && subscriber.next(this._value);
                return subscription;
            };
            BehaviorSubject2.prototype.getValue = function() {
                var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
                if (hasError) {
                    throw thrownError;
                }
                this._throwIfClosed();
                return _value;
            };
            BehaviorSubject2.prototype.next = function(value) {
                _super.prototype.next.call(this, this._value = value);
            };
            return BehaviorSubject2;
        }(Subject_1.Subject);
        exports2.BehaviorSubject = BehaviorSubject;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/dateTimestampProvider.js
var require_dateTimestampProvider = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/dateTimestampProvider.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.dateTimestampProvider = void 0;
        exports2.dateTimestampProvider = {
            now: function now() {
                return (exports2.dateTimestampProvider.delegate || Date).now();
            },
            delegate: void 0
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/ReplaySubject.js
var require_ReplaySubject = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/ReplaySubject.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.ReplaySubject = void 0;
        var Subject_1 = require_Subject();
        var dateTimestampProvider_1 = require_dateTimestampProvider();
        var ReplaySubject = function(_super) {
            __extends(ReplaySubject2, _super);
            function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
                if (_bufferSize === void 0) {
                    _bufferSize = Infinity;
                }
                if (_windowTime === void 0) {
                    _windowTime = Infinity;
                }
                if (_timestampProvider === void 0) {
                    _timestampProvider = dateTimestampProvider_1.dateTimestampProvider;
                }
                var _this = _super.call(this) || this;
                _this._bufferSize = _bufferSize;
                _this._windowTime = _windowTime;
                _this._timestampProvider = _timestampProvider;
                _this._buffer = [];
                _this._infiniteTimeWindow = true;
                _this._infiniteTimeWindow = _windowTime === Infinity;
                _this._bufferSize = Math.max(1, _bufferSize);
                _this._windowTime = Math.max(1, _windowTime);
                return _this;
            }
            ReplaySubject2.prototype.next = function(value) {
                var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
                if (!isStopped) {
                    _buffer.push(value);
                    !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
                }
                this._trimBuffer();
                _super.prototype.next.call(this, value);
            };
            ReplaySubject2.prototype._subscribe = function(subscriber) {
                this._throwIfClosed();
                this._trimBuffer();
                var subscription = this._innerSubscribe(subscriber);
                var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
                var copy = _buffer.slice();
                for(var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2){
                    subscriber.next(copy[i]);
                }
                this._checkFinalizedStatuses(subscriber);
                return subscription;
            };
            ReplaySubject2.prototype._trimBuffer = function() {
                var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
                var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
                _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
                if (!_infiniteTimeWindow) {
                    var now = _timestampProvider.now();
                    var last = 0;
                    for(var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2){
                        last = i;
                    }
                    last && _buffer.splice(0, last + 1);
                }
            };
            return ReplaySubject2;
        }(Subject_1.Subject);
        exports2.ReplaySubject = ReplaySubject;
    }
});
// node_modules/rxjs/dist/cjs/internal/AsyncSubject.js
var require_AsyncSubject = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/AsyncSubject.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AsyncSubject = void 0;
        var Subject_1 = require_Subject();
        var AsyncSubject = function(_super) {
            __extends(AsyncSubject2, _super);
            function AsyncSubject2() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._value = null;
                _this._hasValue = false;
                _this._isComplete = false;
                return _this;
            }
            AsyncSubject2.prototype._checkFinalizedStatuses = function(subscriber) {
                var _a = this, hasError = _a.hasError, _hasValue = _a._hasValue, _value = _a._value, thrownError = _a.thrownError, isStopped = _a.isStopped, _isComplete = _a._isComplete;
                if (hasError) {
                    subscriber.error(thrownError);
                } else if (isStopped || _isComplete) {
                    _hasValue && subscriber.next(_value);
                    subscriber.complete();
                }
            };
            AsyncSubject2.prototype.next = function(value) {
                if (!this.isStopped) {
                    this._value = value;
                    this._hasValue = true;
                }
            };
            AsyncSubject2.prototype.complete = function() {
                var _a = this, _hasValue = _a._hasValue, _value = _a._value, _isComplete = _a._isComplete;
                if (!_isComplete) {
                    this._isComplete = true;
                    _hasValue && _super.prototype.next.call(this, _value);
                    _super.prototype.complete.call(this);
                }
            };
            return AsyncSubject2;
        }(Subject_1.Subject);
        exports2.AsyncSubject = AsyncSubject;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/Action.js
var require_Action = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/Action.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.Action = void 0;
        var Subscription_1 = require_Subscription();
        var Action = function(_super) {
            __extends(Action2, _super);
            function Action2(scheduler, work) {
                return _super.call(this) || this;
            }
            Action2.prototype.schedule = function(state, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                return this;
            };
            return Action2;
        }(Subscription_1.Subscription);
        exports2.Action = Action;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/intervalProvider.js
var require_intervalProvider = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/intervalProvider.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.intervalProvider = void 0;
        exports2.intervalProvider = {
            setInterval: function setInterval1(handler, timeout) {
                var args = [];
                for(var _i = 2; _i < arguments.length; _i++){
                    args[_i - 2] = arguments[_i];
                }
                var delegate = exports2.intervalProvider.delegate;
                if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
                    return delegate.setInterval.apply(delegate, __spreadArray([
                        handler,
                        timeout
                    ], __read(args)));
                }
                return setInterval.apply(void 0, __spreadArray([
                    handler,
                    timeout
                ], __read(args)));
            },
            clearInterval: function clearInterval1(handle) {
                var delegate = exports2.intervalProvider.delegate;
                return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
            },
            delegate: void 0
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/AsyncAction.js
var require_AsyncAction = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/AsyncAction.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AsyncAction = void 0;
        var Action_1 = require_Action();
        var intervalProvider_1 = require_intervalProvider();
        var arrRemove_1 = require_arrRemove();
        var AsyncAction = function(_super) {
            __extends(AsyncAction2, _super);
            function AsyncAction2(scheduler, work) {
                var _this = _super.call(this, scheduler, work) || this;
                _this.scheduler = scheduler;
                _this.work = work;
                _this.pending = false;
                return _this;
            }
            AsyncAction2.prototype.schedule = function(state, delay) {
                var _a;
                if (delay === void 0) {
                    delay = 0;
                }
                if (this.closed) {
                    return this;
                }
                this.state = state;
                var id = this.id;
                var scheduler = this.scheduler;
                if (id != null) {
                    this.id = this.recycleAsyncId(scheduler, id, delay);
                }
                this.pending = true;
                this.delay = delay;
                this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay);
                return this;
            };
            AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                return intervalProvider_1.intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
            };
            AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay != null && this.delay === delay && this.pending === false) {
                    return id;
                }
                if (id != null) {
                    intervalProvider_1.intervalProvider.clearInterval(id);
                }
                return void 0;
            };
            AsyncAction2.prototype.execute = function(state, delay) {
                if (this.closed) {
                    return new Error("executing a cancelled action");
                }
                this.pending = false;
                var error = this._execute(state, delay);
                if (error) {
                    return error;
                } else if (this.pending === false && this.id != null) {
                    this.id = this.recycleAsyncId(this.scheduler, this.id, null);
                }
            };
            AsyncAction2.prototype._execute = function(state, _delay) {
                var errored = false;
                var errorValue;
                try {
                    this.work(state);
                } catch (e) {
                    errored = true;
                    errorValue = e ? e : new Error("Scheduled action threw falsy error");
                }
                if (errored) {
                    this.unsubscribe();
                    return errorValue;
                }
            };
            AsyncAction2.prototype.unsubscribe = function() {
                if (!this.closed) {
                    var _a = this, id = _a.id, scheduler = _a.scheduler;
                    var actions = scheduler.actions;
                    this.work = this.state = this.scheduler = null;
                    this.pending = false;
                    arrRemove_1.arrRemove(actions, this);
                    if (id != null) {
                        this.id = this.recycleAsyncId(scheduler, id, null);
                    }
                    this.delay = null;
                    _super.prototype.unsubscribe.call(this);
                }
            };
            return AsyncAction2;
        }(Action_1.Action);
        exports2.AsyncAction = AsyncAction;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/Immediate.js
var require_Immediate = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/Immediate.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.TestTools = exports2.Immediate = void 0;
        var nextHandle = 1;
        var resolved;
        var activeHandles = {};
        function findAndClearHandle(handle) {
            if (handle in activeHandles) {
                delete activeHandles[handle];
                return true;
            }
            return false;
        }
        exports2.Immediate = {
            setImmediate: function setImmediate(cb) {
                var handle = nextHandle++;
                activeHandles[handle] = true;
                if (!resolved) {
                    resolved = Promise.resolve();
                }
                resolved.then(function() {
                    return findAndClearHandle(handle) && cb();
                });
                return handle;
            },
            clearImmediate: function clearImmediate(handle) {
                findAndClearHandle(handle);
            }
        };
        exports2.TestTools = {
            pending: function pending() {
                return Object.keys(activeHandles).length;
            }
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/immediateProvider.js
var require_immediateProvider = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/immediateProvider.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.immediateProvider = void 0;
        var Immediate_1 = require_Immediate();
        var setImmediate = Immediate_1.Immediate.setImmediate;
        var clearImmediate = Immediate_1.Immediate.clearImmediate;
        exports2.immediateProvider = {
            setImmediate: function setImmediate1() {
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                var delegate = exports2.immediateProvider.delegate;
                return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray([], __read(args)));
            },
            clearImmediate: function clearImmediate1(handle) {
                var delegate = exports2.immediateProvider.delegate;
                return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
            },
            delegate: void 0
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/AsapAction.js
var require_AsapAction = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/AsapAction.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AsapAction = void 0;
        var AsyncAction_1 = require_AsyncAction();
        var immediateProvider_1 = require_immediateProvider();
        var AsapAction = function(_super) {
            __extends(AsapAction2, _super);
            function AsapAction2(scheduler, work) {
                var _this = _super.call(this, scheduler, work) || this;
                _this.scheduler = scheduler;
                _this.work = work;
                return _this;
            }
            AsapAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay !== null && delay > 0) {
                    return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
                }
                scheduler.actions.push(this);
                return scheduler._scheduled || (scheduler._scheduled = immediateProvider_1.immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
            };
            AsapAction2.prototype.recycleAsyncId = function(scheduler, id, delay) {
                var _a;
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay != null ? delay > 0 : this.delay > 0) {
                    return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
                }
                var actions = scheduler.actions;
                if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
                    immediateProvider_1.immediateProvider.clearImmediate(id);
                    if (scheduler._scheduled === id) {
                        scheduler._scheduled = void 0;
                    }
                }
                return void 0;
            };
            return AsapAction2;
        }(AsyncAction_1.AsyncAction);
        exports2.AsapAction = AsapAction;
    }
});
// node_modules/rxjs/dist/cjs/internal/Scheduler.js
var require_Scheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/Scheduler.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.Scheduler = void 0;
        var dateTimestampProvider_1 = require_dateTimestampProvider();
        var Scheduler = function() {
            function Scheduler2(schedulerActionCtor, now) {
                if (now === void 0) {
                    now = Scheduler2.now;
                }
                this.schedulerActionCtor = schedulerActionCtor;
                this.now = now;
            }
            Scheduler2.prototype.schedule = function(work, delay, state) {
                if (delay === void 0) {
                    delay = 0;
                }
                return new this.schedulerActionCtor(this, work).schedule(state, delay);
            };
            Scheduler2.now = dateTimestampProvider_1.dateTimestampProvider.now;
            return Scheduler2;
        }();
        exports2.Scheduler = Scheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/AsyncScheduler.js
var require_AsyncScheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/AsyncScheduler.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AsyncScheduler = void 0;
        var Scheduler_1 = require_Scheduler();
        var AsyncScheduler = function(_super) {
            __extends(AsyncScheduler2, _super);
            function AsyncScheduler2(SchedulerAction, now) {
                if (now === void 0) {
                    now = Scheduler_1.Scheduler.now;
                }
                var _this = _super.call(this, SchedulerAction, now) || this;
                _this.actions = [];
                _this._active = false;
                return _this;
            }
            AsyncScheduler2.prototype.flush = function(action) {
                var actions = this.actions;
                if (this._active) {
                    actions.push(action);
                    return;
                }
                var error;
                this._active = true;
                do {
                    if (error = action.execute(action.state, action.delay)) {
                        break;
                    }
                }while (action = actions.shift());
                this._active = false;
                if (error) {
                    while(action = actions.shift()){
                        action.unsubscribe();
                    }
                    throw error;
                }
            };
            return AsyncScheduler2;
        }(Scheduler_1.Scheduler);
        exports2.AsyncScheduler = AsyncScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/AsapScheduler.js
var require_AsapScheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/AsapScheduler.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AsapScheduler = void 0;
        var AsyncScheduler_1 = require_AsyncScheduler();
        var AsapScheduler = function(_super) {
            __extends(AsapScheduler2, _super);
            function AsapScheduler2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AsapScheduler2.prototype.flush = function(action) {
                this._active = true;
                var flushId = this._scheduled;
                this._scheduled = void 0;
                var actions = this.actions;
                var error;
                action = action || actions.shift();
                do {
                    if (error = action.execute(action.state, action.delay)) {
                        break;
                    }
                }while ((action = actions[0]) && action.id === flushId && actions.shift());
                this._active = false;
                if (error) {
                    while((action = actions[0]) && action.id === flushId && actions.shift()){
                        action.unsubscribe();
                    }
                    throw error;
                }
            };
            return AsapScheduler2;
        }(AsyncScheduler_1.AsyncScheduler);
        exports2.AsapScheduler = AsapScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/asap.js
var require_asap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/asap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.asap = exports2.asapScheduler = void 0;
        var AsapAction_1 = require_AsapAction();
        var AsapScheduler_1 = require_AsapScheduler();
        exports2.asapScheduler = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
        exports2.asap = exports2.asapScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/async.js
var require_async = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/async.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.async = exports2.asyncScheduler = void 0;
        var AsyncAction_1 = require_AsyncAction();
        var AsyncScheduler_1 = require_AsyncScheduler();
        exports2.asyncScheduler = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
        exports2.async = exports2.asyncScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/QueueAction.js
var require_QueueAction = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/QueueAction.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.QueueAction = void 0;
        var AsyncAction_1 = require_AsyncAction();
        var QueueAction = function(_super) {
            __extends(QueueAction2, _super);
            function QueueAction2(scheduler, work) {
                var _this = _super.call(this, scheduler, work) || this;
                _this.scheduler = scheduler;
                _this.work = work;
                return _this;
            }
            QueueAction2.prototype.schedule = function(state, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay > 0) {
                    return _super.prototype.schedule.call(this, state, delay);
                }
                this.delay = delay;
                this.state = state;
                this.scheduler.flush(this);
                return this;
            };
            QueueAction2.prototype.execute = function(state, delay) {
                return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
            };
            QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay != null && delay > 0 || delay == null && this.delay > 0) {
                    return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
                }
                scheduler.flush(this);
                return 0;
            };
            return QueueAction2;
        }(AsyncAction_1.AsyncAction);
        exports2.QueueAction = QueueAction;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/QueueScheduler.js
var require_QueueScheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/QueueScheduler.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.QueueScheduler = void 0;
        var AsyncScheduler_1 = require_AsyncScheduler();
        var QueueScheduler = function(_super) {
            __extends(QueueScheduler2, _super);
            function QueueScheduler2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return QueueScheduler2;
        }(AsyncScheduler_1.AsyncScheduler);
        exports2.QueueScheduler = QueueScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/queue.js
var require_queue = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/queue.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.queue = exports2.queueScheduler = void 0;
        var QueueAction_1 = require_QueueAction();
        var QueueScheduler_1 = require_QueueScheduler();
        exports2.queueScheduler = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
        exports2.queue = exports2.queueScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/AnimationFrameAction.js
var require_AnimationFrameAction = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/AnimationFrameAction.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AnimationFrameAction = void 0;
        var AsyncAction_1 = require_AsyncAction();
        var animationFrameProvider_1 = require_animationFrameProvider();
        var AnimationFrameAction = function(_super) {
            __extends(AnimationFrameAction2, _super);
            function AnimationFrameAction2(scheduler, work) {
                var _this = _super.call(this, scheduler, work) || this;
                _this.scheduler = scheduler;
                _this.work = work;
                return _this;
            }
            AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay !== null && delay > 0) {
                    return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
                }
                scheduler.actions.push(this);
                return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(function() {
                    return scheduler.flush(void 0);
                }));
            };
            AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay) {
                var _a;
                if (delay === void 0) {
                    delay = 0;
                }
                if (delay != null ? delay > 0 : this.delay > 0) {
                    return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
                }
                var actions = scheduler.actions;
                if (id != null && id === scheduler._scheduled && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
                    animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(id);
                    scheduler._scheduled = void 0;
                }
                return void 0;
            };
            return AnimationFrameAction2;
        }(AsyncAction_1.AsyncAction);
        exports2.AnimationFrameAction = AnimationFrameAction;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/AnimationFrameScheduler.js
var require_AnimationFrameScheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/AnimationFrameScheduler.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.AnimationFrameScheduler = void 0;
        var AsyncScheduler_1 = require_AsyncScheduler();
        var AnimationFrameScheduler = function(_super) {
            __extends(AnimationFrameScheduler2, _super);
            function AnimationFrameScheduler2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AnimationFrameScheduler2.prototype.flush = function(action) {
                this._active = true;
                var flushId;
                if (action) {
                    flushId = action.id;
                } else {
                    flushId = this._scheduled;
                    this._scheduled = void 0;
                }
                var actions = this.actions;
                var error;
                action = action || actions.shift();
                do {
                    if (error = action.execute(action.state, action.delay)) {
                        break;
                    }
                }while ((action = actions[0]) && action.id === flushId && actions.shift());
                this._active = false;
                if (error) {
                    while((action = actions[0]) && action.id === flushId && actions.shift()){
                        action.unsubscribe();
                    }
                    throw error;
                }
            };
            return AnimationFrameScheduler2;
        }(AsyncScheduler_1.AsyncScheduler);
        exports2.AnimationFrameScheduler = AnimationFrameScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/animationFrame.js
var require_animationFrame = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/animationFrame.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.animationFrame = exports2.animationFrameScheduler = void 0;
        var AnimationFrameAction_1 = require_AnimationFrameAction();
        var AnimationFrameScheduler_1 = require_AnimationFrameScheduler();
        exports2.animationFrameScheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
        exports2.animationFrame = exports2.animationFrameScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduler/VirtualTimeScheduler.js
var require_VirtualTimeScheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduler/VirtualTimeScheduler.js": function(exports2) {
        "use strict";
        var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
            var extendStatics = function extendStatics1(d, b) {
                extendStatics = Object.setPrototypeOf || _instanceof({
                    __proto__: []
                }, Array) && function(d2, b2) {
                    d2.__proto__ = b2;
                } || function(d2, b2) {
                    for(var p in b2)if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
                };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);
                function __() {
                    this.constructor = d;
                }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        }();
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.VirtualAction = exports2.VirtualTimeScheduler = void 0;
        var AsyncAction_1 = require_AsyncAction();
        var Subscription_1 = require_Subscription();
        var AsyncScheduler_1 = require_AsyncScheduler();
        var VirtualTimeScheduler = function(_super) {
            __extends(VirtualTimeScheduler2, _super);
            function VirtualTimeScheduler2(schedulerActionCtor, maxFrames) {
                if (schedulerActionCtor === void 0) {
                    schedulerActionCtor = VirtualAction;
                }
                if (maxFrames === void 0) {
                    maxFrames = Infinity;
                }
                var _this = _super.call(this, schedulerActionCtor, function() {
                    return _this.frame;
                }) || this;
                _this.maxFrames = maxFrames;
                _this.frame = 0;
                _this.index = -1;
                return _this;
            }
            VirtualTimeScheduler2.prototype.flush = function() {
                var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
                var error;
                var action;
                while((action = actions[0]) && action.delay <= maxFrames){
                    actions.shift();
                    this.frame = action.delay;
                    if (error = action.execute(action.state, action.delay)) {
                        break;
                    }
                }
                if (error) {
                    while(action = actions.shift()){
                        action.unsubscribe();
                    }
                    throw error;
                }
            };
            VirtualTimeScheduler2.frameTimeFactor = 10;
            return VirtualTimeScheduler2;
        }(AsyncScheduler_1.AsyncScheduler);
        exports2.VirtualTimeScheduler = VirtualTimeScheduler;
        var VirtualAction = function(_super) {
            __extends(VirtualAction2, _super);
            function VirtualAction2(scheduler, work, index) {
                if (index === void 0) {
                    index = scheduler.index += 1;
                }
                var _this = _super.call(this, scheduler, work) || this;
                _this.scheduler = scheduler;
                _this.work = work;
                _this.index = index;
                _this.active = true;
                _this.index = scheduler.index = index;
                return _this;
            }
            VirtualAction2.prototype.schedule = function(state, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                if (Number.isFinite(delay)) {
                    if (!this.id) {
                        return _super.prototype.schedule.call(this, state, delay);
                    }
                    this.active = false;
                    var action = new VirtualAction2(this.scheduler, this.work);
                    this.add(action);
                    return action.schedule(state, delay);
                } else {
                    return Subscription_1.Subscription.EMPTY;
                }
            };
            VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                this.delay = scheduler.frame + delay;
                var actions = scheduler.actions;
                actions.push(this);
                actions.sort(VirtualAction2.sortActions);
                return 1;
            };
            VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay) {
                if (delay === void 0) {
                    delay = 0;
                }
                return void 0;
            };
            VirtualAction2.prototype._execute = function(state, delay) {
                if (this.active === true) {
                    return _super.prototype._execute.call(this, state, delay);
                }
            };
            VirtualAction2.sortActions = function(a, b) {
                if (a.delay === b.delay) {
                    if (a.index === b.index) {
                        return 0;
                    } else if (a.index > b.index) {
                        return 1;
                    } else {
                        return -1;
                    }
                } else if (a.delay > b.delay) {
                    return 1;
                } else {
                    return -1;
                }
            };
            return VirtualAction2;
        }(AsyncAction_1.AsyncAction);
        exports2.VirtualAction = VirtualAction;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/empty.js
var require_empty = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/empty.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.empty = exports2.EMPTY = void 0;
        var Observable_1 = require_Observable();
        exports2.EMPTY = new Observable_1.Observable(function(subscriber) {
            return subscriber.complete();
        });
        function empty(scheduler) {
            return scheduler ? emptyScheduled(scheduler) : exports2.EMPTY;
        }
        exports2.empty = empty;
        function emptyScheduled(scheduler) {
            return new Observable_1.Observable(function(subscriber) {
                return scheduler.schedule(function() {
                    return subscriber.complete();
                });
            });
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isScheduler.js
var require_isScheduler = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isScheduler.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isScheduler = void 0;
        var isFunction_1 = require_isFunction();
        function isScheduler(value) {
            return value && isFunction_1.isFunction(value.schedule);
        }
        exports2.isScheduler = isScheduler;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/args.js
var require_args = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/args.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.popNumber = exports2.popScheduler = exports2.popResultSelector = void 0;
        var isFunction_1 = require_isFunction();
        var isScheduler_1 = require_isScheduler();
        function last(arr) {
            return arr[arr.length - 1];
        }
        function popResultSelector(args) {
            return isFunction_1.isFunction(last(args)) ? args.pop() : void 0;
        }
        exports2.popResultSelector = popResultSelector;
        function popScheduler(args) {
            return isScheduler_1.isScheduler(last(args)) ? args.pop() : void 0;
        }
        exports2.popScheduler = popScheduler;
        function popNumber(args, defaultValue) {
            return typeof last(args) === "number" ? args.pop() : defaultValue;
        }
        exports2.popNumber = popNumber;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isArrayLike.js
var require_isArrayLike = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isArrayLike.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isArrayLike = void 0;
        exports2.isArrayLike = function(x) {
            return x && typeof x.length === "number" && typeof x !== "function";
        };
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isPromise.js
var require_isPromise = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isPromise.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isPromise = void 0;
        var isFunction_1 = require_isFunction();
        function isPromise(value) {
            return isFunction_1.isFunction(value === null || value === void 0 ? void 0 : value.then);
        }
        exports2.isPromise = isPromise;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isInteropObservable.js
var require_isInteropObservable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isInteropObservable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isInteropObservable = void 0;
        var observable_1 = require_observable();
        var isFunction_1 = require_isFunction();
        function isInteropObservable(input) {
            return isFunction_1.isFunction(input[observable_1.observable]);
        }
        exports2.isInteropObservable = isInteropObservable;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isAsyncIterable.js
var require_isAsyncIterable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isAsyncIterable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isAsyncIterable = void 0;
        var isFunction_1 = require_isFunction();
        function isAsyncIterable(obj) {
            return Symbol.asyncIterator && isFunction_1.isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
        }
        exports2.isAsyncIterable = isAsyncIterable;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/throwUnobservableError.js
var require_throwUnobservableError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/throwUnobservableError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.createInvalidObservableTypeError = void 0;
        function createInvalidObservableTypeError(input) {
            return new TypeError("You provided " + (input !== null && (typeof input === "undefined" ? "undefined" : _type_of(input)) === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
        }
        exports2.createInvalidObservableTypeError = createInvalidObservableTypeError;
    }
});
// node_modules/rxjs/dist/cjs/internal/symbol/iterator.js
var require_iterator = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/symbol/iterator.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.iterator = exports2.getSymbolIterator = void 0;
        function getSymbolIterator() {
            if (typeof Symbol !== "function" || !Symbol.iterator) {
                return "@@iterator";
            }
            return Symbol.iterator;
        }
        exports2.getSymbolIterator = getSymbolIterator;
        exports2.iterator = getSymbolIterator();
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isIterable.js
var require_isIterable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isIterable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isIterable = void 0;
        var iterator_1 = require_iterator();
        var isFunction_1 = require_isFunction();
        function isIterable(input) {
            return isFunction_1.isFunction(input === null || input === void 0 ? void 0 : input[iterator_1.iterator]);
        }
        exports2.isIterable = isIterable;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isReadableStreamLike.js
var require_isReadableStreamLike = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isReadableStreamLike.js": function(exports2) {
        "use strict";
        var __generator = exports2 && exports2.__generator || function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function sent() {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            }, f, y, t, g;
            return g = {
                next: verb(0),
                "throw": verb(1),
                "return": verb(2)
            }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return step([
                        n,
                        v
                    ]);
                };
            }
            function step(op) {
                if (f) throw new TypeError("Generator is already executing.");
                while(_)try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                    if (y = 0, t) op = [
                        op[0] & 2,
                        t.value
                    ];
                    switch(op[0]){
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return {
                                value: op[1],
                                done: false
                            };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [
                                0
                            ];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [
                        6,
                        e
                    ];
                    y = 0;
                } finally{
                    f = t = 0;
                }
                if (op[0] & 5) throw op[1];
                return {
                    value: op[0] ? op[1] : void 0,
                    done: true
                };
            }
        };
        var __await = exports2 && exports2.__await || function(v) {
            return _instanceof(this, __await) ? (this.v = v, this) : new __await(v);
        };
        var __asyncGenerator = exports2 && exports2.__asyncGenerator || function(thisArg, _arguments, generator) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var g = generator.apply(thisArg, _arguments || []), i, q = [];
            return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                return this;
            }, i;
            function verb(n) {
                if (g[n]) i[n] = function(v) {
                    return new Promise(function(a, b) {
                        q.push([
                            n,
                            v,
                            a,
                            b
                        ]) > 1 || resume(n, v);
                    });
                };
            }
            function resume(n, v) {
                try {
                    step(g[n](v));
                } catch (e) {
                    settle(q[0][3], e);
                }
            }
            function step(r) {
                _instanceof(r.value, __await) ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
            }
            function fulfill(value) {
                resume("next", value);
            }
            function reject(value) {
                resume("throw", value);
            }
            function settle(f, v) {
                if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
            }
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isReadableStreamLike = exports2.readableStreamLikeToAsyncGenerator = void 0;
        var isFunction_1 = require_isFunction();
        function readableStreamLikeToAsyncGenerator(readableStream) {
            return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
                var reader, _a, value, done;
                return __generator(this, function(_b) {
                    switch(_b.label){
                        case 0:
                            reader = readableStream.getReader();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([
                                1,
                                ,
                                9,
                                10
                            ]);
                            _b.label = 2;
                        case 2:
                            if (false) return [
                                3,
                                8
                            ];
                            return [
                                4,
                                __await(reader.read())
                            ];
                        case 3:
                            _a = _b.sent(), value = _a.value, done = _a.done;
                            if (!done) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                __await(void 0)
                            ];
                        case 4:
                            return [
                                2,
                                _b.sent()
                            ];
                        case 5:
                            return [
                                4,
                                __await(value)
                            ];
                        case 6:
                            return [
                                4,
                                _b.sent()
                            ];
                        case 7:
                            _b.sent();
                            return [
                                3,
                                2
                            ];
                        case 8:
                            return [
                                3,
                                10
                            ];
                        case 9:
                            reader.releaseLock();
                            return [
                                7
                            ];
                        case 10:
                            return [
                                2
                            ];
                    }
                });
            });
        }
        exports2.readableStreamLikeToAsyncGenerator = readableStreamLikeToAsyncGenerator;
        function isReadableStreamLike(obj) {
            return isFunction_1.isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
        }
        exports2.isReadableStreamLike = isReadableStreamLike;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/innerFrom.js
var require_innerFrom = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/innerFrom.js": function(exports2) {
        "use strict";
        var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
            function adopt(value) {
                return _instanceof(value, P) ? value : new P(function(resolve) {
                    resolve(value);
                });
            }
            return new (P || (P = Promise))(function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator["throw"](value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
        };
        var __generator = exports2 && exports2.__generator || function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function sent() {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            }, f, y, t, g;
            return g = {
                next: verb(0),
                "throw": verb(1),
                "return": verb(2)
            }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return step([
                        n,
                        v
                    ]);
                };
            }
            function step(op) {
                if (f) throw new TypeError("Generator is already executing.");
                while(_)try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                    if (y = 0, t) op = [
                        op[0] & 2,
                        t.value
                    ];
                    switch(op[0]){
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return {
                                value: op[1],
                                done: false
                            };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [
                                0
                            ];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [
                        6,
                        e
                    ];
                    y = 0;
                } finally{
                    f = t = 0;
                }
                if (op[0] & 5) throw op[1];
                return {
                    value: op[0] ? op[1] : void 0,
                    done: true
                };
            }
        };
        var __asyncValues = exports2 && exports2.__asyncValues || function(o) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var m = o[Symbol.asyncIterator], i;
            return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
                return this;
            }, i);
            function verb(n) {
                i[n] = o[n] && function(v) {
                    return new Promise(function(resolve, reject) {
                        v = o[n](v), settle(resolve, reject, v.done, v.value);
                    });
                };
            }
            function settle(resolve, reject, d, v) {
                Promise.resolve(v).then(function(v2) {
                    resolve({
                        value: v2,
                        done: d
                    });
                }, reject);
            }
        };
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.fromReadableStreamLike = exports2.fromAsyncIterable = exports2.fromIterable = exports2.fromPromise = exports2.fromArrayLike = exports2.fromInteropObservable = exports2.innerFrom = void 0;
        var isArrayLike_1 = require_isArrayLike();
        var isPromise_1 = require_isPromise();
        var Observable_1 = require_Observable();
        var isInteropObservable_1 = require_isInteropObservable();
        var isAsyncIterable_1 = require_isAsyncIterable();
        var throwUnobservableError_1 = require_throwUnobservableError();
        var isIterable_1 = require_isIterable();
        var isReadableStreamLike_1 = require_isReadableStreamLike();
        var isFunction_1 = require_isFunction();
        var reportUnhandledError_1 = require_reportUnhandledError();
        var observable_1 = require_observable();
        function innerFrom(input) {
            if (_instanceof(input, Observable_1.Observable)) {
                return input;
            }
            if (input != null) {
                if (isInteropObservable_1.isInteropObservable(input)) {
                    return fromInteropObservable(input);
                }
                if (isArrayLike_1.isArrayLike(input)) {
                    return fromArrayLike(input);
                }
                if (isPromise_1.isPromise(input)) {
                    return fromPromise(input);
                }
                if (isAsyncIterable_1.isAsyncIterable(input)) {
                    return fromAsyncIterable(input);
                }
                if (isIterable_1.isIterable(input)) {
                    return fromIterable(input);
                }
                if (isReadableStreamLike_1.isReadableStreamLike(input)) {
                    return fromReadableStreamLike(input);
                }
            }
            throw throwUnobservableError_1.createInvalidObservableTypeError(input);
        }
        exports2.innerFrom = innerFrom;
        function fromInteropObservable(obj) {
            return new Observable_1.Observable(function(subscriber) {
                var obs = obj[observable_1.observable]();
                if (isFunction_1.isFunction(obs.subscribe)) {
                    return obs.subscribe(subscriber);
                }
                throw new TypeError("Provided object does not correctly implement Symbol.observable");
            });
        }
        exports2.fromInteropObservable = fromInteropObservable;
        function fromArrayLike(array) {
            return new Observable_1.Observable(function(subscriber) {
                for(var i = 0; i < array.length && !subscriber.closed; i++){
                    subscriber.next(array[i]);
                }
                subscriber.complete();
            });
        }
        exports2.fromArrayLike = fromArrayLike;
        function fromPromise(promise) {
            return new Observable_1.Observable(function(subscriber) {
                promise.then(function(value) {
                    if (!subscriber.closed) {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                }, function(err) {
                    return subscriber.error(err);
                }).then(null, reportUnhandledError_1.reportUnhandledError);
            });
        }
        exports2.fromPromise = fromPromise;
        function fromIterable(iterable) {
            return new Observable_1.Observable(function(subscriber) {
                var e_1, _a;
                try {
                    for(var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()){
                        var value = iterable_1_1.value;
                        subscriber.next(value);
                        if (subscriber.closed) {
                            return;
                        }
                    }
                } catch (e_1_1) {
                    e_1 = {
                        error: e_1_1
                    };
                } finally{
                    try {
                        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                    } finally{
                        if (e_1) throw e_1.error;
                    }
                }
                subscriber.complete();
            });
        }
        exports2.fromIterable = fromIterable;
        function fromAsyncIterable(asyncIterable) {
            return new Observable_1.Observable(function(subscriber) {
                process(asyncIterable, subscriber).catch(function(err) {
                    return subscriber.error(err);
                });
            });
        }
        exports2.fromAsyncIterable = fromAsyncIterable;
        function fromReadableStreamLike(readableStream) {
            return fromAsyncIterable(isReadableStreamLike_1.readableStreamLikeToAsyncGenerator(readableStream));
        }
        exports2.fromReadableStreamLike = fromReadableStreamLike;
        function process(asyncIterable, subscriber) {
            var asyncIterable_1, asyncIterable_1_1;
            var e_2, _a;
            return __awaiter(this, void 0, void 0, function() {
                var value, e_2_1;
                return __generator(this, function(_b) {
                    switch(_b.label){
                        case 0:
                            _b.trys.push([
                                0,
                                5,
                                6,
                                11
                            ]);
                            asyncIterable_1 = __asyncValues(asyncIterable);
                            _b.label = 1;
                        case 1:
                            return [
                                4,
                                asyncIterable_1.next()
                            ];
                        case 2:
                            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [
                                3,
                                4
                            ];
                            value = asyncIterable_1_1.value;
                            subscriber.next(value);
                            if (subscriber.closed) {
                                return [
                                    2
                                ];
                            }
                            _b.label = 3;
                        case 3:
                            return [
                                3,
                                1
                            ];
                        case 4:
                            return [
                                3,
                                11
                            ];
                        case 5:
                            e_2_1 = _b.sent();
                            e_2 = {
                                error: e_2_1
                            };
                            return [
                                3,
                                11
                            ];
                        case 6:
                            _b.trys.push([
                                6,
                                ,
                                9,
                                10
                            ]);
                            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [
                                3,
                                8
                            ];
                            return [
                                4,
                                _a.call(asyncIterable_1)
                            ];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8:
                            return [
                                3,
                                10
                            ];
                        case 9:
                            if (e_2) throw e_2.error;
                            return [
                                7
                            ];
                        case 10:
                            return [
                                7
                            ];
                        case 11:
                            subscriber.complete();
                            return [
                                2
                            ];
                    }
                });
            });
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/util/executeSchedule.js
var require_executeSchedule = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/executeSchedule.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.executeSchedule = void 0;
        function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
            if (delay === void 0) {
                delay = 0;
            }
            if (repeat === void 0) {
                repeat = false;
            }
            var scheduleSubscription = scheduler.schedule(function() {
                work();
                if (repeat) {
                    parentSubscription.add(this.schedule(null, delay));
                } else {
                    this.unsubscribe();
                }
            }, delay);
            parentSubscription.add(scheduleSubscription);
            if (!repeat) {
                return scheduleSubscription;
            }
        }
        exports2.executeSchedule = executeSchedule;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/observeOn.js
var require_observeOn = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/observeOn.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.observeOn = void 0;
        var executeSchedule_1 = require_executeSchedule();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function observeOn(scheduler, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return lift_1.operate(function(source, subscriber) {
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                        return subscriber.next(value);
                    }, delay);
                }, function() {
                    return executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                        return subscriber.complete();
                    }, delay);
                }, function(err) {
                    return executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                        return subscriber.error(err);
                    }, delay);
                }));
            });
        }
        exports2.observeOn = observeOn;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/subscribeOn.js
var require_subscribeOn = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/subscribeOn.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.subscribeOn = void 0;
        var lift_1 = require_lift();
        function subscribeOn(scheduler, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return lift_1.operate(function(source, subscriber) {
                subscriber.add(scheduler.schedule(function() {
                    return source.subscribe(subscriber);
                }, delay));
            });
        }
        exports2.subscribeOn = subscribeOn;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/scheduleObservable.js
var require_scheduleObservable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/scheduleObservable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scheduleObservable = void 0;
        var innerFrom_1 = require_innerFrom();
        var observeOn_1 = require_observeOn();
        var subscribeOn_1 = require_subscribeOn();
        function scheduleObservable(input, scheduler) {
            return innerFrom_1.innerFrom(input).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
        }
        exports2.scheduleObservable = scheduleObservable;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/schedulePromise.js
var require_schedulePromise = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/schedulePromise.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.schedulePromise = void 0;
        var innerFrom_1 = require_innerFrom();
        var observeOn_1 = require_observeOn();
        var subscribeOn_1 = require_subscribeOn();
        function schedulePromise(input, scheduler) {
            return innerFrom_1.innerFrom(input).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
        }
        exports2.schedulePromise = schedulePromise;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/scheduleArray.js
var require_scheduleArray = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/scheduleArray.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scheduleArray = void 0;
        var Observable_1 = require_Observable();
        function scheduleArray(input, scheduler) {
            return new Observable_1.Observable(function(subscriber) {
                var i = 0;
                return scheduler.schedule(function() {
                    if (i === input.length) {
                        subscriber.complete();
                    } else {
                        subscriber.next(input[i++]);
                        if (!subscriber.closed) {
                            this.schedule();
                        }
                    }
                });
            });
        }
        exports2.scheduleArray = scheduleArray;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/scheduleIterable.js
var require_scheduleIterable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/scheduleIterable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scheduleIterable = void 0;
        var Observable_1 = require_Observable();
        var iterator_1 = require_iterator();
        var isFunction_1 = require_isFunction();
        var executeSchedule_1 = require_executeSchedule();
        function scheduleIterable(input, scheduler) {
            return new Observable_1.Observable(function(subscriber) {
                var iterator;
                executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                    iterator = input[iterator_1.iterator]();
                    executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                        var _a;
                        var value;
                        var done;
                        try {
                            _a = iterator.next(), value = _a.value, done = _a.done;
                        } catch (err) {
                            subscriber.error(err);
                            return;
                        }
                        if (done) {
                            subscriber.complete();
                        } else {
                            subscriber.next(value);
                        }
                    }, 0, true);
                });
                return function() {
                    return isFunction_1.isFunction(iterator === null || iterator === void 0 ? void 0 : iterator.return) && iterator.return();
                };
            });
        }
        exports2.scheduleIterable = scheduleIterable;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/scheduleAsyncIterable.js
var require_scheduleAsyncIterable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/scheduleAsyncIterable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scheduleAsyncIterable = void 0;
        var Observable_1 = require_Observable();
        var executeSchedule_1 = require_executeSchedule();
        function scheduleAsyncIterable(input, scheduler) {
            if (!input) {
                throw new Error("Iterable cannot be null");
            }
            return new Observable_1.Observable(function(subscriber) {
                executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                    var iterator = input[Symbol.asyncIterator]();
                    executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                        iterator.next().then(function(result) {
                            if (result.done) {
                                subscriber.complete();
                            } else {
                                subscriber.next(result.value);
                            }
                        });
                    }, 0, true);
                });
            });
        }
        exports2.scheduleAsyncIterable = scheduleAsyncIterable;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/scheduleReadableStreamLike.js
var require_scheduleReadableStreamLike = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/scheduleReadableStreamLike.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scheduleReadableStreamLike = void 0;
        var scheduleAsyncIterable_1 = require_scheduleAsyncIterable();
        var isReadableStreamLike_1 = require_isReadableStreamLike();
        function scheduleReadableStreamLike(input, scheduler) {
            return scheduleAsyncIterable_1.scheduleAsyncIterable(isReadableStreamLike_1.readableStreamLikeToAsyncGenerator(input), scheduler);
        }
        exports2.scheduleReadableStreamLike = scheduleReadableStreamLike;
    }
});
// node_modules/rxjs/dist/cjs/internal/scheduled/scheduled.js
var require_scheduled = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/scheduled/scheduled.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scheduled = void 0;
        var scheduleObservable_1 = require_scheduleObservable();
        var schedulePromise_1 = require_schedulePromise();
        var scheduleArray_1 = require_scheduleArray();
        var scheduleIterable_1 = require_scheduleIterable();
        var scheduleAsyncIterable_1 = require_scheduleAsyncIterable();
        var isInteropObservable_1 = require_isInteropObservable();
        var isPromise_1 = require_isPromise();
        var isArrayLike_1 = require_isArrayLike();
        var isIterable_1 = require_isIterable();
        var isAsyncIterable_1 = require_isAsyncIterable();
        var throwUnobservableError_1 = require_throwUnobservableError();
        var isReadableStreamLike_1 = require_isReadableStreamLike();
        var scheduleReadableStreamLike_1 = require_scheduleReadableStreamLike();
        function scheduled(input, scheduler) {
            if (input != null) {
                if (isInteropObservable_1.isInteropObservable(input)) {
                    return scheduleObservable_1.scheduleObservable(input, scheduler);
                }
                if (isArrayLike_1.isArrayLike(input)) {
                    return scheduleArray_1.scheduleArray(input, scheduler);
                }
                if (isPromise_1.isPromise(input)) {
                    return schedulePromise_1.schedulePromise(input, scheduler);
                }
                if (isAsyncIterable_1.isAsyncIterable(input)) {
                    return scheduleAsyncIterable_1.scheduleAsyncIterable(input, scheduler);
                }
                if (isIterable_1.isIterable(input)) {
                    return scheduleIterable_1.scheduleIterable(input, scheduler);
                }
                if (isReadableStreamLike_1.isReadableStreamLike(input)) {
                    return scheduleReadableStreamLike_1.scheduleReadableStreamLike(input, scheduler);
                }
            }
            throw throwUnobservableError_1.createInvalidObservableTypeError(input);
        }
        exports2.scheduled = scheduled;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/from.js
var require_from = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/from.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.from = void 0;
        var scheduled_1 = require_scheduled();
        var innerFrom_1 = require_innerFrom();
        function from(input, scheduler) {
            return scheduler ? scheduled_1.scheduled(input, scheduler) : innerFrom_1.innerFrom(input);
        }
        exports2.from = from;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/of.js
var require_of = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/of.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.of = void 0;
        var args_1 = require_args();
        var from_1 = require_from();
        function of() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var scheduler = args_1.popScheduler(args);
            return from_1.from(args, scheduler);
        }
        exports2.of = of;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/throwError.js
var require_throwError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/throwError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.throwError = void 0;
        var Observable_1 = require_Observable();
        var isFunction_1 = require_isFunction();
        function throwError(errorOrErrorFactory, scheduler) {
            var errorFactory = isFunction_1.isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function errorFactory() {
                return errorOrErrorFactory;
            };
            var init = function init(subscriber) {
                return subscriber.error(errorFactory());
            };
            return new Observable_1.Observable(scheduler ? function(subscriber) {
                return scheduler.schedule(init, 0, subscriber);
            } : init);
        }
        exports2.throwError = throwError;
    }
});
// node_modules/rxjs/dist/cjs/internal/Notification.js
var require_Notification = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/Notification.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.observeNotification = exports2.Notification = exports2.NotificationKind = void 0;
        var empty_1 = require_empty();
        var of_1 = require_of();
        var throwError_1 = require_throwError();
        var isFunction_1 = require_isFunction();
        var NotificationKind;
        (function(NotificationKind2) {
            NotificationKind2["NEXT"] = "N";
            NotificationKind2["ERROR"] = "E";
            NotificationKind2["COMPLETE"] = "C";
        })(NotificationKind = exports2.NotificationKind || (exports2.NotificationKind = {}));
        var Notification = function() {
            function Notification2(kind, value, error) {
                this.kind = kind;
                this.value = value;
                this.error = error;
                this.hasValue = kind === "N";
            }
            Notification2.prototype.observe = function(observer) {
                return observeNotification(this, observer);
            };
            Notification2.prototype.do = function(nextHandler, errorHandler, completeHandler) {
                var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
                return kind === "N" ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === "E" ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
            };
            Notification2.prototype.accept = function(nextOrObserver, error, complete) {
                var _a;
                return isFunction_1.isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next) ? this.observe(nextOrObserver) : this.do(nextOrObserver, error, complete);
            };
            Notification2.prototype.toObservable = function() {
                var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
                var result = kind === "N" ? of_1.of(value) : kind === "E" ? throwError_1.throwError(function() {
                    return error;
                }) : kind === "C" ? empty_1.EMPTY : 0;
                if (!result) {
                    throw new TypeError("Unexpected notification kind " + kind);
                }
                return result;
            };
            Notification2.createNext = function(value) {
                return new Notification2("N", value);
            };
            Notification2.createError = function(err) {
                return new Notification2("E", void 0, err);
            };
            Notification2.createComplete = function() {
                return Notification2.completeNotification;
            };
            Notification2.completeNotification = new Notification2("C");
            return Notification2;
        }();
        exports2.Notification = Notification;
        function observeNotification(notification, observer) {
            var _a, _b, _c;
            var _d = notification, kind = _d.kind, value = _d.value, error = _d.error;
            if (typeof kind !== "string") {
                throw new TypeError('Invalid notification, missing "kind"');
            }
            kind === "N" ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === "E" ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
        }
        exports2.observeNotification = observeNotification;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isObservable.js
var require_isObservable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isObservable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isObservable = void 0;
        var Observable_1 = require_Observable();
        var isFunction_1 = require_isFunction();
        function isObservable(obj) {
            return !!obj && (_instanceof(obj, Observable_1.Observable) || isFunction_1.isFunction(obj.lift) && isFunction_1.isFunction(obj.subscribe));
        }
        exports2.isObservable = isObservable;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/EmptyError.js
var require_EmptyError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/EmptyError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.EmptyError = void 0;
        var createErrorClass_1 = require_createErrorClass();
        exports2.EmptyError = createErrorClass_1.createErrorClass(function(_super) {
            return function EmptyErrorImpl() {
                _super(this);
                this.name = "EmptyError";
                this.message = "no elements in sequence";
            };
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/lastValueFrom.js
var require_lastValueFrom = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/lastValueFrom.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.lastValueFrom = void 0;
        var EmptyError_1 = require_EmptyError();
        function lastValueFrom(source, config) {
            var hasConfig = (typeof config === "undefined" ? "undefined" : _type_of(config)) === "object";
            return new Promise(function(resolve, reject) {
                var _hasValue = false;
                var _value;
                source.subscribe({
                    next: function next(value) {
                        _value = value;
                        _hasValue = true;
                    },
                    error: reject,
                    complete: function complete() {
                        if (_hasValue) {
                            resolve(_value);
                        } else if (hasConfig) {
                            resolve(config.defaultValue);
                        } else {
                            reject(new EmptyError_1.EmptyError());
                        }
                    }
                });
            });
        }
        exports2.lastValueFrom = lastValueFrom;
    }
});
// node_modules/rxjs/dist/cjs/internal/firstValueFrom.js
var require_firstValueFrom = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/firstValueFrom.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.firstValueFrom = void 0;
        var EmptyError_1 = require_EmptyError();
        var Subscriber_1 = require_Subscriber();
        function firstValueFrom(source, config) {
            var hasConfig = (typeof config === "undefined" ? "undefined" : _type_of(config)) === "object";
            return new Promise(function(resolve, reject) {
                var subscriber = new Subscriber_1.SafeSubscriber({
                    next: function next(value) {
                        resolve(value);
                        subscriber.unsubscribe();
                    },
                    error: reject,
                    complete: function complete() {
                        if (hasConfig) {
                            resolve(config.defaultValue);
                        } else {
                            reject(new EmptyError_1.EmptyError());
                        }
                    }
                });
                source.subscribe(subscriber);
            });
        }
        exports2.firstValueFrom = firstValueFrom;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/ArgumentOutOfRangeError.js
var require_ArgumentOutOfRangeError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/ArgumentOutOfRangeError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.ArgumentOutOfRangeError = void 0;
        var createErrorClass_1 = require_createErrorClass();
        exports2.ArgumentOutOfRangeError = createErrorClass_1.createErrorClass(function(_super) {
            return function ArgumentOutOfRangeErrorImpl() {
                _super(this);
                this.name = "ArgumentOutOfRangeError";
                this.message = "argument out of range";
            };
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/util/NotFoundError.js
var require_NotFoundError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/NotFoundError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.NotFoundError = void 0;
        var createErrorClass_1 = require_createErrorClass();
        exports2.NotFoundError = createErrorClass_1.createErrorClass(function(_super) {
            return function NotFoundErrorImpl(message) {
                _super(this);
                this.name = "NotFoundError";
                this.message = message;
            };
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/util/SequenceError.js
var require_SequenceError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/SequenceError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.SequenceError = void 0;
        var createErrorClass_1 = require_createErrorClass();
        exports2.SequenceError = createErrorClass_1.createErrorClass(function(_super) {
            return function SequenceErrorImpl(message) {
                _super(this);
                this.name = "SequenceError";
                this.message = message;
            };
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/util/isDate.js
var require_isDate = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/isDate.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isValidDate = void 0;
        function isValidDate(value) {
            return _instanceof(value, Date) && !isNaN(value);
        }
        exports2.isValidDate = isValidDate;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/timeout.js
var require_timeout = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/timeout.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.timeout = exports2.TimeoutError = void 0;
        var async_1 = require_async();
        var isDate_1 = require_isDate();
        var lift_1 = require_lift();
        var innerFrom_1 = require_innerFrom();
        var createErrorClass_1 = require_createErrorClass();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var executeSchedule_1 = require_executeSchedule();
        exports2.TimeoutError = createErrorClass_1.createErrorClass(function(_super) {
            return function TimeoutErrorImpl(info) {
                if (info === void 0) {
                    info = null;
                }
                _super(this);
                this.message = "Timeout has occurred";
                this.name = "TimeoutError";
                this.info = info;
            };
        });
        function timeout(config, schedulerArg) {
            var _a = isDate_1.isValidDate(config) ? {
                first: config
            } : typeof config === "number" ? {
                each: config
            } : config, first = _a.first, each = _a.each, _b = _a.with, _with = _b === void 0 ? timeoutErrorFactory : _b, _c = _a.scheduler, scheduler = _c === void 0 ? schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : async_1.asyncScheduler : _c, _d = _a.meta, meta = _d === void 0 ? null : _d;
            if (first == null && each == null) {
                throw new TypeError("No timeout provided.");
            }
            return lift_1.operate(function(source, subscriber) {
                var originalSourceSubscription;
                var timerSubscription;
                var lastValue = null;
                var seen = 0;
                var startTimer = function startTimer(delay) {
                    timerSubscription = executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
                        try {
                            originalSourceSubscription.unsubscribe();
                            innerFrom_1.innerFrom(_with({
                                meta: meta,
                                lastValue: lastValue,
                                seen: seen
                            })).subscribe(subscriber);
                        } catch (err) {
                            subscriber.error(err);
                        }
                    }, delay);
                };
                originalSourceSubscription = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
                    seen++;
                    subscriber.next(lastValue = value);
                    each > 0 && startTimer(each);
                }, void 0, void 0, function() {
                    if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
                        timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
                    }
                    lastValue = null;
                }));
                !seen && startTimer(first != null ? typeof first === "number" ? first : +first - scheduler.now() : each);
            });
        }
        exports2.timeout = timeout;
        function timeoutErrorFactory(info) {
            throw new exports2.TimeoutError(info);
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/map.js
var require_map = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/map.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.map = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function map(project, thisArg) {
            return lift_1.operate(function(source, subscriber) {
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    subscriber.next(project.call(thisArg, value, index++));
                }));
            });
        }
        exports2.map = map;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/mapOneOrManyArgs.js
var require_mapOneOrManyArgs = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/mapOneOrManyArgs.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mapOneOrManyArgs = void 0;
        var map_1 = require_map();
        var isArray = Array.isArray;
        function callOrApply(fn, args) {
            return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
        }
        function mapOneOrManyArgs(fn) {
            return map_1.map(function(args) {
                return callOrApply(fn, args);
            });
        }
        exports2.mapOneOrManyArgs = mapOneOrManyArgs;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/bindCallbackInternals.js
var require_bindCallbackInternals = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/bindCallbackInternals.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bindCallbackInternals = void 0;
        var isScheduler_1 = require_isScheduler();
        var Observable_1 = require_Observable();
        var subscribeOn_1 = require_subscribeOn();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        var observeOn_1 = require_observeOn();
        var AsyncSubject_1 = require_AsyncSubject();
        function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
            if (resultSelector) {
                if (isScheduler_1.isScheduler(resultSelector)) {
                    scheduler = resultSelector;
                } else {
                    return function() {
                        var args = [];
                        for(var _i = 0; _i < arguments.length; _i++){
                            args[_i] = arguments[_i];
                        }
                        return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler).apply(this, args).pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector));
                    };
                }
            }
            if (scheduler) {
                return function() {
                    var args = [];
                    for(var _i = 0; _i < arguments.length; _i++){
                        args[_i] = arguments[_i];
                    }
                    return bindCallbackInternals(isNodeStyle, callbackFunc).apply(this, args).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
                };
            }
            return function() {
                var _this = this;
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                var subject = new AsyncSubject_1.AsyncSubject();
                var uninitialized = true;
                return new Observable_1.Observable(function(subscriber) {
                    var subs = subject.subscribe(subscriber);
                    if (uninitialized) {
                        uninitialized = false;
                        var isAsync_1 = false;
                        var isComplete_1 = false;
                        callbackFunc.apply(_this, __spreadArray(__spreadArray([], __read(args)), [
                            function() {
                                var results = [];
                                for(var _i2 = 0; _i2 < arguments.length; _i2++){
                                    results[_i2] = arguments[_i2];
                                }
                                if (isNodeStyle) {
                                    var err = results.shift();
                                    if (err != null) {
                                        subject.error(err);
                                        return;
                                    }
                                }
                                subject.next(1 < results.length ? results : results[0]);
                                isComplete_1 = true;
                                if (isAsync_1) {
                                    subject.complete();
                                }
                            }
                        ]));
                        if (isComplete_1) {
                            subject.complete();
                        }
                        isAsync_1 = true;
                    }
                    return subs;
                });
            };
        }
        exports2.bindCallbackInternals = bindCallbackInternals;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/bindCallback.js
var require_bindCallback = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/bindCallback.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bindCallback = void 0;
        var bindCallbackInternals_1 = require_bindCallbackInternals();
        function bindCallback(callbackFunc, resultSelector, scheduler) {
            return bindCallbackInternals_1.bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
        }
        exports2.bindCallback = bindCallback;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/bindNodeCallback.js
var require_bindNodeCallback = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/bindNodeCallback.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bindNodeCallback = void 0;
        var bindCallbackInternals_1 = require_bindCallbackInternals();
        function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
            return bindCallbackInternals_1.bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
        }
        exports2.bindNodeCallback = bindNodeCallback;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/argsArgArrayOrObject.js
var require_argsArgArrayOrObject = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/argsArgArrayOrObject.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.argsArgArrayOrObject = void 0;
        var isArray = Array.isArray;
        var getPrototypeOf = Object.getPrototypeOf;
        var objectProto = Object.prototype;
        var getKeys = Object.keys;
        function argsArgArrayOrObject(args) {
            if (args.length === 1) {
                var first_1 = args[0];
                if (isArray(first_1)) {
                    return {
                        args: first_1,
                        keys: null
                    };
                }
                if (isPOJO(first_1)) {
                    var keys = getKeys(first_1);
                    return {
                        args: keys.map(function(key) {
                            return first_1[key];
                        }),
                        keys: keys
                    };
                }
            }
            return {
                args: args,
                keys: null
            };
        }
        exports2.argsArgArrayOrObject = argsArgArrayOrObject;
        function isPOJO(obj) {
            return obj && (typeof obj === "undefined" ? "undefined" : _type_of(obj)) === "object" && getPrototypeOf(obj) === objectProto;
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/util/createObject.js
var require_createObject = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/createObject.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.createObject = void 0;
        function createObject(keys, values) {
            return keys.reduce(function(result, key, i) {
                return result[key] = values[i], result;
            }, {});
        }
        exports2.createObject = createObject;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/combineLatest.js
var require_combineLatest = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/combineLatest.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.combineLatestInit = exports2.combineLatest = void 0;
        var Observable_1 = require_Observable();
        var argsArgArrayOrObject_1 = require_argsArgArrayOrObject();
        var from_1 = require_from();
        var identity_1 = require_identity();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        var args_1 = require_args();
        var createObject_1 = require_createObject();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var executeSchedule_1 = require_executeSchedule();
        function combineLatest() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var scheduler = args_1.popScheduler(args);
            var resultSelector = args_1.popResultSelector(args);
            var _a = argsArgArrayOrObject_1.argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
            if (observables.length === 0) {
                return from_1.from([], scheduler);
            }
            var result = new Observable_1.Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
                return createObject_1.createObject(keys, values);
            } : identity_1.identity));
            return resultSelector ? result.pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : result;
        }
        exports2.combineLatest = combineLatest;
        function combineLatestInit(observables, scheduler, valueTransform) {
            if (valueTransform === void 0) {
                valueTransform = identity_1.identity;
            }
            return function(subscriber) {
                maybeSchedule(scheduler, function() {
                    var length = observables.length;
                    var values = new Array(length);
                    var active = length;
                    var remainingFirstValues = length;
                    var _loop_1 = function _loop_1(i2) {
                        maybeSchedule(scheduler, function() {
                            var source = from_1.from(observables[i2], scheduler);
                            var hasFirstValue = false;
                            source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                                values[i2] = value;
                                if (!hasFirstValue) {
                                    hasFirstValue = true;
                                    remainingFirstValues--;
                                }
                                if (!remainingFirstValues) {
                                    subscriber.next(valueTransform(values.slice()));
                                }
                            }, function() {
                                if (!--active) {
                                    subscriber.complete();
                                }
                            }));
                        }, subscriber);
                    };
                    for(var i = 0; i < length; i++){
                        _loop_1(i);
                    }
                }, subscriber);
            };
        }
        exports2.combineLatestInit = combineLatestInit;
        function maybeSchedule(scheduler, execute, subscription) {
            if (scheduler) {
                executeSchedule_1.executeSchedule(subscription, scheduler, execute);
            } else {
                execute();
            }
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mergeInternals.js
var require_mergeInternals = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mergeInternals.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mergeInternals = void 0;
        var innerFrom_1 = require_innerFrom();
        var executeSchedule_1 = require_executeSchedule();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
            var buffer = [];
            var active = 0;
            var index = 0;
            var isComplete = false;
            var checkComplete = function checkComplete() {
                if (isComplete && !buffer.length && !active) {
                    subscriber.complete();
                }
            };
            var outerNext = function outerNext(value) {
                return active < concurrent ? doInnerSub(value) : buffer.push(value);
            };
            var doInnerSub = function doInnerSub1(value) {
                expand && subscriber.next(value);
                active++;
                var innerComplete = false;
                innerFrom_1.innerFrom(project(value, index++)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(innerValue) {
                    onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
                    if (expand) {
                        outerNext(innerValue);
                    } else {
                        subscriber.next(innerValue);
                    }
                }, function() {
                    innerComplete = true;
                }, void 0, function() {
                    if (innerComplete) {
                        try {
                            active--;
                            var _loop_1 = function _loop_1() {
                                var bufferedValue = buffer.shift();
                                if (innerSubScheduler) {
                                    executeSchedule_1.executeSchedule(subscriber, innerSubScheduler, function() {
                                        return doInnerSub(bufferedValue);
                                    });
                                } else {
                                    doInnerSub(bufferedValue);
                                }
                            };
                            while(buffer.length && active < concurrent){
                                _loop_1();
                            }
                            checkComplete();
                        } catch (err) {
                            subscriber.error(err);
                        }
                    }
                }));
            };
            source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, outerNext, function() {
                isComplete = true;
                checkComplete();
            }));
            return function() {
                additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
            };
        }
        exports2.mergeInternals = mergeInternals;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mergeMap.js
var require_mergeMap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mergeMap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mergeMap = void 0;
        var map_1 = require_map();
        var innerFrom_1 = require_innerFrom();
        var lift_1 = require_lift();
        var mergeInternals_1 = require_mergeInternals();
        var isFunction_1 = require_isFunction();
        function mergeMap(project, resultSelector, concurrent) {
            if (concurrent === void 0) {
                concurrent = Infinity;
            }
            if (isFunction_1.isFunction(resultSelector)) {
                return mergeMap(function(a, i) {
                    return map_1.map(function(b, ii) {
                        return resultSelector(a, b, i, ii);
                    })(innerFrom_1.innerFrom(project(a, i)));
                }, concurrent);
            } else if (typeof resultSelector === "number") {
                concurrent = resultSelector;
            }
            return lift_1.operate(function(source, subscriber) {
                return mergeInternals_1.mergeInternals(source, subscriber, project, concurrent);
            });
        }
        exports2.mergeMap = mergeMap;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mergeAll.js
var require_mergeAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mergeAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mergeAll = void 0;
        var mergeMap_1 = require_mergeMap();
        var identity_1 = require_identity();
        function mergeAll(concurrent) {
            if (concurrent === void 0) {
                concurrent = Infinity;
            }
            return mergeMap_1.mergeMap(identity_1.identity, concurrent);
        }
        exports2.mergeAll = mergeAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/concatAll.js
var require_concatAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/concatAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.concatAll = void 0;
        var mergeAll_1 = require_mergeAll();
        function concatAll() {
            return mergeAll_1.mergeAll(1);
        }
        exports2.concatAll = concatAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/concat.js
var require_concat = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/concat.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.concat = void 0;
        var concatAll_1 = require_concatAll();
        var args_1 = require_args();
        var from_1 = require_from();
        function concat() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            return concatAll_1.concatAll()(from_1.from(args, args_1.popScheduler(args)));
        }
        exports2.concat = concat;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/defer.js
var require_defer = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/defer.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.defer = void 0;
        var Observable_1 = require_Observable();
        var innerFrom_1 = require_innerFrom();
        function defer(observableFactory) {
            return new Observable_1.Observable(function(subscriber) {
                innerFrom_1.innerFrom(observableFactory()).subscribe(subscriber);
            });
        }
        exports2.defer = defer;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/connectable.js
var require_connectable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/connectable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.connectable = void 0;
        var Subject_1 = require_Subject();
        var Observable_1 = require_Observable();
        var defer_1 = require_defer();
        var DEFAULT_CONFIG = {
            connector: function connector() {
                return new Subject_1.Subject();
            },
            resetOnDisconnect: true
        };
        function connectable(source, config) {
            if (config === void 0) {
                config = DEFAULT_CONFIG;
            }
            var connection = null;
            var connector = config.connector, _a = config.resetOnDisconnect, resetOnDisconnect = _a === void 0 ? true : _a;
            var subject = connector();
            var result = new Observable_1.Observable(function(subscriber) {
                return subject.subscribe(subscriber);
            });
            result.connect = function() {
                if (!connection || connection.closed) {
                    connection = defer_1.defer(function() {
                        return source;
                    }).subscribe(subject);
                    if (resetOnDisconnect) {
                        connection.add(function() {
                            return subject = connector();
                        });
                    }
                }
                return connection;
            };
            return result;
        }
        exports2.connectable = connectable;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/forkJoin.js
var require_forkJoin = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/forkJoin.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.forkJoin = void 0;
        var Observable_1 = require_Observable();
        var argsArgArrayOrObject_1 = require_argsArgArrayOrObject();
        var innerFrom_1 = require_innerFrom();
        var args_1 = require_args();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        var createObject_1 = require_createObject();
        function forkJoin() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var resultSelector = args_1.popResultSelector(args);
            var _a = argsArgArrayOrObject_1.argsArgArrayOrObject(args), sources = _a.args, keys = _a.keys;
            var result = new Observable_1.Observable(function(subscriber) {
                var length = sources.length;
                if (!length) {
                    subscriber.complete();
                    return;
                }
                var values = new Array(length);
                var remainingCompletions = length;
                var remainingEmissions = length;
                var _loop_1 = function _loop_1(sourceIndex2) {
                    var hasValue = false;
                    innerFrom_1.innerFrom(sources[sourceIndex2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                        if (!hasValue) {
                            hasValue = true;
                            remainingEmissions--;
                        }
                        values[sourceIndex2] = value;
                    }, function() {
                        return remainingCompletions--;
                    }, void 0, function() {
                        if (!remainingCompletions || !hasValue) {
                            if (!remainingEmissions) {
                                subscriber.next(keys ? createObject_1.createObject(keys, values) : values);
                            }
                            subscriber.complete();
                        }
                    }));
                };
                for(var sourceIndex = 0; sourceIndex < length; sourceIndex++){
                    _loop_1(sourceIndex);
                }
            });
            return resultSelector ? result.pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : result;
        }
        exports2.forkJoin = forkJoin;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/fromEvent.js
var require_fromEvent = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/fromEvent.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.fromEvent = void 0;
        var innerFrom_1 = require_innerFrom();
        var Observable_1 = require_Observable();
        var mergeMap_1 = require_mergeMap();
        var isArrayLike_1 = require_isArrayLike();
        var isFunction_1 = require_isFunction();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        var nodeEventEmitterMethods = [
            "addListener",
            "removeListener"
        ];
        var eventTargetMethods = [
            "addEventListener",
            "removeEventListener"
        ];
        var jqueryMethods = [
            "on",
            "off"
        ];
        function fromEvent(target, eventName, options, resultSelector) {
            if (isFunction_1.isFunction(options)) {
                resultSelector = options;
                options = void 0;
            }
            if (resultSelector) {
                return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector));
            }
            var _a = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
                return function(handler) {
                    return target[methodName](eventName, handler, options);
                };
            }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
            if (!add) {
                if (isArrayLike_1.isArrayLike(target)) {
                    return mergeMap_1.mergeMap(function(subTarget) {
                        return fromEvent(subTarget, eventName, options);
                    })(innerFrom_1.innerFrom(target));
                }
            }
            if (!add) {
                throw new TypeError("Invalid event target");
            }
            return new Observable_1.Observable(function(subscriber) {
                var handler = function handler() {
                    var args = [];
                    for(var _i = 0; _i < arguments.length; _i++){
                        args[_i] = arguments[_i];
                    }
                    return subscriber.next(1 < args.length ? args : args[0]);
                };
                add(handler);
                return function() {
                    return remove(handler);
                };
            });
        }
        exports2.fromEvent = fromEvent;
        function toCommonHandlerRegistry(target, eventName) {
            return function(methodName) {
                return function(handler) {
                    return target[methodName](eventName, handler);
                };
            };
        }
        function isNodeStyleEventEmitter(target) {
            return isFunction_1.isFunction(target.addListener) && isFunction_1.isFunction(target.removeListener);
        }
        function isJQueryStyleEventEmitter(target) {
            return isFunction_1.isFunction(target.on) && isFunction_1.isFunction(target.off);
        }
        function isEventTarget(target) {
            return isFunction_1.isFunction(target.addEventListener) && isFunction_1.isFunction(target.removeEventListener);
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/fromEventPattern.js
var require_fromEventPattern = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/fromEventPattern.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.fromEventPattern = void 0;
        var Observable_1 = require_Observable();
        var isFunction_1 = require_isFunction();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        function fromEventPattern(addHandler, removeHandler, resultSelector) {
            if (resultSelector) {
                return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector));
            }
            return new Observable_1.Observable(function(subscriber) {
                var handler = function handler() {
                    var e = [];
                    for(var _i = 0; _i < arguments.length; _i++){
                        e[_i] = arguments[_i];
                    }
                    return subscriber.next(e.length === 1 ? e[0] : e);
                };
                var retValue = addHandler(handler);
                return isFunction_1.isFunction(removeHandler) ? function() {
                    return removeHandler(handler, retValue);
                } : void 0;
            });
        }
        exports2.fromEventPattern = fromEventPattern;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/generate.js
var require_generate = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/generate.js": function(exports2) {
        "use strict";
        var __generator = exports2 && exports2.__generator || function(thisArg, body) {
            var _ = {
                label: 0,
                sent: function sent() {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            }, f, y, t, g;
            return g = {
                next: verb(0),
                "throw": verb(1),
                "return": verb(2)
            }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
                return this;
            }), g;
            function verb(n) {
                return function(v) {
                    return step([
                        n,
                        v
                    ]);
                };
            }
            function step(op) {
                if (f) throw new TypeError("Generator is already executing.");
                while(_)try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                    if (y = 0, t) op = [
                        op[0] & 2,
                        t.value
                    ];
                    switch(op[0]){
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return {
                                value: op[1],
                                done: false
                            };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [
                                0
                            ];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [
                        6,
                        e
                    ];
                    y = 0;
                } finally{
                    f = t = 0;
                }
                if (op[0] & 5) throw op[1];
                return {
                    value: op[0] ? op[1] : void 0,
                    done: true
                };
            }
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.generate = void 0;
        var identity_1 = require_identity();
        var isScheduler_1 = require_isScheduler();
        var defer_1 = require_defer();
        var scheduleIterable_1 = require_scheduleIterable();
        function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
            var _a, _b;
            var resultSelector;
            var initialState;
            if (arguments.length === 1) {
                _a = initialStateOrOptions, initialState = _a.initialState, condition = _a.condition, iterate = _a.iterate, _b = _a.resultSelector, resultSelector = _b === void 0 ? identity_1.identity : _b, scheduler = _a.scheduler;
            } else {
                initialState = initialStateOrOptions;
                if (!resultSelectorOrScheduler || isScheduler_1.isScheduler(resultSelectorOrScheduler)) {
                    resultSelector = identity_1.identity;
                    scheduler = resultSelectorOrScheduler;
                } else {
                    resultSelector = resultSelectorOrScheduler;
                }
            }
            function gen() {
                var state;
                return __generator(this, function(_a2) {
                    switch(_a2.label){
                        case 0:
                            state = initialState;
                            _a2.label = 1;
                        case 1:
                            if (!(!condition || condition(state))) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                resultSelector(state)
                            ];
                        case 2:
                            _a2.sent();
                            _a2.label = 3;
                        case 3:
                            state = iterate(state);
                            return [
                                3,
                                1
                            ];
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            }
            return defer_1.defer(scheduler ? function() {
                return scheduleIterable_1.scheduleIterable(gen(), scheduler);
            } : gen);
        }
        exports2.generate = generate;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/iif.js
var require_iif = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/iif.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.iif = void 0;
        var defer_1 = require_defer();
        function iif(condition, trueResult, falseResult) {
            return defer_1.defer(function() {
                return condition() ? trueResult : falseResult;
            });
        }
        exports2.iif = iif;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/timer.js
var require_timer = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/timer.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.timer = void 0;
        var Observable_1 = require_Observable();
        var async_1 = require_async();
        var isScheduler_1 = require_isScheduler();
        var isDate_1 = require_isDate();
        function timer(dueTime, intervalOrScheduler, scheduler) {
            if (dueTime === void 0) {
                dueTime = 0;
            }
            if (scheduler === void 0) {
                scheduler = async_1.async;
            }
            var intervalDuration = -1;
            if (intervalOrScheduler != null) {
                if (isScheduler_1.isScheduler(intervalOrScheduler)) {
                    scheduler = intervalOrScheduler;
                } else {
                    intervalDuration = intervalOrScheduler;
                }
            }
            return new Observable_1.Observable(function(subscriber) {
                var due = isDate_1.isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
                if (due < 0) {
                    due = 0;
                }
                var n = 0;
                return scheduler.schedule(function() {
                    if (!subscriber.closed) {
                        subscriber.next(n++);
                        if (0 <= intervalDuration) {
                            this.schedule(void 0, intervalDuration);
                        } else {
                            subscriber.complete();
                        }
                    }
                }, due);
            });
        }
        exports2.timer = timer;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/interval.js
var require_interval = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/interval.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.interval = void 0;
        var async_1 = require_async();
        var timer_1 = require_timer();
        function interval(period, scheduler) {
            if (period === void 0) {
                period = 0;
            }
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            if (period < 0) {
                period = 0;
            }
            return timer_1.timer(period, period, scheduler);
        }
        exports2.interval = interval;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/merge.js
var require_merge = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/merge.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.merge = void 0;
        var mergeAll_1 = require_mergeAll();
        var innerFrom_1 = require_innerFrom();
        var empty_1 = require_empty();
        var args_1 = require_args();
        var from_1 = require_from();
        function merge() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var scheduler = args_1.popScheduler(args);
            var concurrent = args_1.popNumber(args, Infinity);
            var sources = args;
            return !sources.length ? empty_1.EMPTY : sources.length === 1 ? innerFrom_1.innerFrom(sources[0]) : mergeAll_1.mergeAll(concurrent)(from_1.from(sources, scheduler));
        }
        exports2.merge = merge;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/never.js
var require_never = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/never.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.never = exports2.NEVER = void 0;
        var Observable_1 = require_Observable();
        var noop_1 = require_noop();
        exports2.NEVER = new Observable_1.Observable(noop_1.noop);
        function never() {
            return exports2.NEVER;
        }
        exports2.never = never;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/argsOrArgArray.js
var require_argsOrArgArray = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/argsOrArgArray.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.argsOrArgArray = void 0;
        var isArray = Array.isArray;
        function argsOrArgArray(args) {
            return args.length === 1 && isArray(args[0]) ? args[0] : args;
        }
        exports2.argsOrArgArray = argsOrArgArray;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/onErrorResumeNext.js
var require_onErrorResumeNext = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/onErrorResumeNext.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.onErrorResumeNext = void 0;
        var Observable_1 = require_Observable();
        var argsOrArgArray_1 = require_argsOrArgArray();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var noop_1 = require_noop();
        var innerFrom_1 = require_innerFrom();
        function onErrorResumeNext() {
            var sources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                sources[_i] = arguments[_i];
            }
            var nextSources = argsOrArgArray_1.argsOrArgArray(sources);
            return new Observable_1.Observable(function(subscriber) {
                var sourceIndex = 0;
                var subscribeNext = function subscribeNext1() {
                    if (sourceIndex < nextSources.length) {
                        var nextSource = void 0;
                        try {
                            nextSource = innerFrom_1.innerFrom(nextSources[sourceIndex++]);
                        } catch (err) {
                            subscribeNext();
                            return;
                        }
                        var innerSubscriber = new OperatorSubscriber_1.OperatorSubscriber(subscriber, void 0, noop_1.noop, noop_1.noop);
                        nextSource.subscribe(innerSubscriber);
                        innerSubscriber.add(subscribeNext);
                    } else {
                        subscriber.complete();
                    }
                };
                subscribeNext();
            });
        }
        exports2.onErrorResumeNext = onErrorResumeNext;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/pairs.js
var require_pairs = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/pairs.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.pairs = void 0;
        var from_1 = require_from();
        function pairs(obj, scheduler) {
            return from_1.from(Object.entries(obj), scheduler);
        }
        exports2.pairs = pairs;
    }
});
// node_modules/rxjs/dist/cjs/internal/util/not.js
var require_not = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/util/not.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.not = void 0;
        function not(pred, thisArg) {
            return function(value, index) {
                return !pred.call(thisArg, value, index);
            };
        }
        exports2.not = not;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/filter.js
var require_filter = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/filter.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.filter = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function filter(predicate, thisArg) {
            return lift_1.operate(function(source, subscriber) {
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return predicate.call(thisArg, value, index++) && subscriber.next(value);
                }));
            });
        }
        exports2.filter = filter;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/partition.js
var require_partition = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/partition.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.partition = void 0;
        var not_1 = require_not();
        var filter_1 = require_filter();
        var innerFrom_1 = require_innerFrom();
        function partition(source, predicate, thisArg) {
            return [
                filter_1.filter(predicate, thisArg)(innerFrom_1.innerFrom(source)),
                filter_1.filter(not_1.not(predicate, thisArg))(innerFrom_1.innerFrom(source))
            ];
        }
        exports2.partition = partition;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/race.js
var require_race = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/race.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.raceInit = exports2.race = void 0;
        var Observable_1 = require_Observable();
        var innerFrom_1 = require_innerFrom();
        var argsOrArgArray_1 = require_argsOrArgArray();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function race() {
            var sources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                sources[_i] = arguments[_i];
            }
            sources = argsOrArgArray_1.argsOrArgArray(sources);
            return sources.length === 1 ? innerFrom_1.innerFrom(sources[0]) : new Observable_1.Observable(raceInit(sources));
        }
        exports2.race = race;
        function raceInit(sources) {
            return function(subscriber) {
                var subscriptions = [];
                var _loop_1 = function _loop_1(i2) {
                    subscriptions.push(innerFrom_1.innerFrom(sources[i2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                        if (subscriptions) {
                            for(var s = 0; s < subscriptions.length; s++){
                                s !== i2 && subscriptions[s].unsubscribe();
                            }
                            subscriptions = null;
                        }
                        subscriber.next(value);
                    })));
                };
                for(var i = 0; subscriptions && !subscriber.closed && i < sources.length; i++){
                    _loop_1(i);
                }
            };
        }
        exports2.raceInit = raceInit;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/range.js
var require_range = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/range.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.range = void 0;
        var Observable_1 = require_Observable();
        var empty_1 = require_empty();
        function range(start, count, scheduler) {
            if (count == null) {
                count = start;
                start = 0;
            }
            if (count <= 0) {
                return empty_1.EMPTY;
            }
            var end = count + start;
            return new Observable_1.Observable(scheduler ? function(subscriber) {
                var n = start;
                return scheduler.schedule(function() {
                    if (n < end) {
                        subscriber.next(n++);
                        this.schedule();
                    } else {
                        subscriber.complete();
                    }
                });
            } : function(subscriber) {
                var n = start;
                while(n < end && !subscriber.closed){
                    subscriber.next(n++);
                }
                subscriber.complete();
            });
        }
        exports2.range = range;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/using.js
var require_using = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/using.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.using = void 0;
        var Observable_1 = require_Observable();
        var innerFrom_1 = require_innerFrom();
        var empty_1 = require_empty();
        function using(resourceFactory, observableFactory) {
            return new Observable_1.Observable(function(subscriber) {
                var resource = resourceFactory();
                var result = observableFactory(resource);
                var source = result ? innerFrom_1.innerFrom(result) : empty_1.EMPTY;
                source.subscribe(subscriber);
                return function() {
                    if (resource) {
                        resource.unsubscribe();
                    }
                };
            });
        }
        exports2.using = using;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/zip.js
var require_zip = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/zip.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.zip = void 0;
        var Observable_1 = require_Observable();
        var innerFrom_1 = require_innerFrom();
        var argsOrArgArray_1 = require_argsOrArgArray();
        var empty_1 = require_empty();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var args_1 = require_args();
        function zip() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var resultSelector = args_1.popResultSelector(args);
            var sources = argsOrArgArray_1.argsOrArgArray(args);
            return sources.length ? new Observable_1.Observable(function(subscriber) {
                var buffers = sources.map(function() {
                    return [];
                });
                var completed = sources.map(function() {
                    return false;
                });
                subscriber.add(function() {
                    buffers = completed = null;
                });
                var _loop_1 = function _loop_1(sourceIndex2) {
                    innerFrom_1.innerFrom(sources[sourceIndex2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                        buffers[sourceIndex2].push(value);
                        if (buffers.every(function(buffer) {
                            return buffer.length;
                        })) {
                            var result = buffers.map(function(buffer) {
                                return buffer.shift();
                            });
                            subscriber.next(resultSelector ? resultSelector.apply(void 0, __spreadArray([], __read(result))) : result);
                            if (buffers.some(function(buffer, i) {
                                return !buffer.length && completed[i];
                            })) {
                                subscriber.complete();
                            }
                        }
                    }, function() {
                        completed[sourceIndex2] = true;
                        !buffers[sourceIndex2].length && subscriber.complete();
                    }));
                };
                for(var sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++){
                    _loop_1(sourceIndex);
                }
                return function() {
                    buffers = completed = null;
                };
            }) : empty_1.EMPTY;
        }
        exports2.zip = zip;
    }
});
// node_modules/rxjs/dist/cjs/internal/types.js
var require_types = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/types.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/audit.js
var require_audit = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/audit.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.audit = void 0;
        var lift_1 = require_lift();
        var innerFrom_1 = require_innerFrom();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function audit(durationSelector) {
            return lift_1.operate(function(source, subscriber) {
                var hasValue = false;
                var lastValue = null;
                var durationSubscriber = null;
                var isComplete = false;
                var endDuration = function endDuration() {
                    durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                    durationSubscriber = null;
                    if (hasValue) {
                        hasValue = false;
                        var value = lastValue;
                        lastValue = null;
                        subscriber.next(value);
                    }
                    isComplete && subscriber.complete();
                };
                var cleanupDuration = function cleanupDuration() {
                    durationSubscriber = null;
                    isComplete && subscriber.complete();
                };
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    hasValue = true;
                    lastValue = value;
                    if (!durationSubscriber) {
                        innerFrom_1.innerFrom(durationSelector(value)).subscribe(durationSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, endDuration, cleanupDuration));
                    }
                }, function() {
                    isComplete = true;
                    (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
                }));
            });
        }
        exports2.audit = audit;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/auditTime.js
var require_auditTime = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/auditTime.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.auditTime = void 0;
        var async_1 = require_async();
        var audit_1 = require_audit();
        var timer_1 = require_timer();
        function auditTime(duration, scheduler) {
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            return audit_1.audit(function() {
                return timer_1.timer(duration, scheduler);
            });
        }
        exports2.auditTime = auditTime;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/buffer.js
var require_buffer = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/buffer.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.buffer = void 0;
        var lift_1 = require_lift();
        var noop_1 = require_noop();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        function buffer(closingNotifier) {
            return lift_1.operate(function(source, subscriber) {
                var currentBuffer = [];
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return currentBuffer.push(value);
                }, function() {
                    subscriber.next(currentBuffer);
                    subscriber.complete();
                }));
                innerFrom_1.innerFrom(closingNotifier).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    var b = currentBuffer;
                    currentBuffer = [];
                    subscriber.next(b);
                }, noop_1.noop));
                return function() {
                    currentBuffer = null;
                };
            });
        }
        exports2.buffer = buffer;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/bufferCount.js
var require_bufferCount = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/bufferCount.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bufferCount = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var arrRemove_1 = require_arrRemove();
        function bufferCount(bufferSize, startBufferEvery) {
            if (startBufferEvery === void 0) {
                startBufferEvery = null;
            }
            startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
            return lift_1.operate(function(source, subscriber) {
                var buffers = [];
                var count = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var e_1, _a, e_2, _b;
                    var toEmit = null;
                    if (count++ % startBufferEvery === 0) {
                        buffers.push([]);
                    }
                    try {
                        for(var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()){
                            var buffer = buffers_1_1.value;
                            buffer.push(value);
                            if (bufferSize <= buffer.length) {
                                toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
                                toEmit.push(buffer);
                            }
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                    if (toEmit) {
                        try {
                            for(var toEmit_1 = __values(toEmit), toEmit_1_1 = toEmit_1.next(); !toEmit_1_1.done; toEmit_1_1 = toEmit_1.next()){
                                var buffer = toEmit_1_1.value;
                                arrRemove_1.arrRemove(buffers, buffer);
                                subscriber.next(buffer);
                            }
                        } catch (e_2_1) {
                            e_2 = {
                                error: e_2_1
                            };
                        } finally{
                            try {
                                if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return)) _b.call(toEmit_1);
                            } finally{
                                if (e_2) throw e_2.error;
                            }
                        }
                    }
                }, function() {
                    var e_3, _a;
                    try {
                        for(var buffers_2 = __values(buffers), buffers_2_1 = buffers_2.next(); !buffers_2_1.done; buffers_2_1 = buffers_2.next()){
                            var buffer = buffers_2_1.value;
                            subscriber.next(buffer);
                        }
                    } catch (e_3_1) {
                        e_3 = {
                            error: e_3_1
                        };
                    } finally{
                        try {
                            if (buffers_2_1 && !buffers_2_1.done && (_a = buffers_2.return)) _a.call(buffers_2);
                        } finally{
                            if (e_3) throw e_3.error;
                        }
                    }
                    subscriber.complete();
                }, void 0, function() {
                    buffers = null;
                }));
            });
        }
        exports2.bufferCount = bufferCount;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/bufferTime.js
var require_bufferTime = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/bufferTime.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bufferTime = void 0;
        var Subscription_1 = require_Subscription();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var arrRemove_1 = require_arrRemove();
        var async_1 = require_async();
        var args_1 = require_args();
        var executeSchedule_1 = require_executeSchedule();
        function bufferTime(bufferTimeSpan) {
            var _a, _b;
            var otherArgs = [];
            for(var _i = 1; _i < arguments.length; _i++){
                otherArgs[_i - 1] = arguments[_i];
            }
            var scheduler = (_a = args_1.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1.asyncScheduler;
            var bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
            var maxBufferSize = otherArgs[1] || Infinity;
            return lift_1.operate(function(source, subscriber) {
                var bufferRecords = [];
                var restartOnEmit = false;
                var emit = function emit(record) {
                    var buffer = record.buffer, subs = record.subs;
                    subs.unsubscribe();
                    arrRemove_1.arrRemove(bufferRecords, record);
                    subscriber.next(buffer);
                    restartOnEmit && startBuffer();
                };
                var startBuffer = function startBuffer() {
                    if (bufferRecords) {
                        var subs = new Subscription_1.Subscription();
                        subscriber.add(subs);
                        var buffer = [];
                        var record_1 = {
                            buffer: buffer,
                            subs: subs
                        };
                        bufferRecords.push(record_1);
                        executeSchedule_1.executeSchedule(subs, scheduler, function() {
                            return emit(record_1);
                        }, bufferTimeSpan);
                    }
                };
                if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
                    executeSchedule_1.executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
                } else {
                    restartOnEmit = true;
                }
                startBuffer();
                var bufferTimeSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var e_1, _a2;
                    var recordsCopy = bufferRecords.slice();
                    try {
                        for(var recordsCopy_1 = __values(recordsCopy), recordsCopy_1_1 = recordsCopy_1.next(); !recordsCopy_1_1.done; recordsCopy_1_1 = recordsCopy_1.next()){
                            var record = recordsCopy_1_1.value;
                            var buffer = record.buffer;
                            buffer.push(value);
                            maxBufferSize <= buffer.length && emit(record);
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (recordsCopy_1_1 && !recordsCopy_1_1.done && (_a2 = recordsCopy_1.return)) _a2.call(recordsCopy_1);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                }, function() {
                    while(bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length){
                        subscriber.next(bufferRecords.shift().buffer);
                    }
                    bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
                    subscriber.complete();
                    subscriber.unsubscribe();
                }, void 0, function() {
                    return bufferRecords = null;
                });
                source.subscribe(bufferTimeSubscriber);
            });
        }
        exports2.bufferTime = bufferTime;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/bufferToggle.js
var require_bufferToggle = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/bufferToggle.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bufferToggle = void 0;
        var Subscription_1 = require_Subscription();
        var lift_1 = require_lift();
        var innerFrom_1 = require_innerFrom();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var noop_1 = require_noop();
        var arrRemove_1 = require_arrRemove();
        function bufferToggle(openings, closingSelector) {
            return lift_1.operate(function(source, subscriber) {
                var buffers = [];
                innerFrom_1.innerFrom(openings).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(openValue) {
                    var buffer = [];
                    buffers.push(buffer);
                    var closingSubscription = new Subscription_1.Subscription();
                    var emitBuffer = function emitBuffer() {
                        arrRemove_1.arrRemove(buffers, buffer);
                        subscriber.next(buffer);
                        closingSubscription.unsubscribe();
                    };
                    closingSubscription.add(innerFrom_1.innerFrom(closingSelector(openValue)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, emitBuffer, noop_1.noop)));
                }, noop_1.noop));
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var e_1, _a;
                    try {
                        for(var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()){
                            var buffer = buffers_1_1.value;
                            buffer.push(value);
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                }, function() {
                    while(buffers.length > 0){
                        subscriber.next(buffers.shift());
                    }
                    subscriber.complete();
                }));
            });
        }
        exports2.bufferToggle = bufferToggle;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/bufferWhen.js
var require_bufferWhen = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/bufferWhen.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.bufferWhen = void 0;
        var lift_1 = require_lift();
        var noop_1 = require_noop();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        function bufferWhen(closingSelector) {
            return lift_1.operate(function(source, subscriber) {
                var buffer = null;
                var closingSubscriber = null;
                var openBuffer = function openBuffer1() {
                    closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                    var b = buffer;
                    buffer = [];
                    b && subscriber.next(b);
                    innerFrom_1.innerFrom(closingSelector()).subscribe(closingSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, openBuffer, noop_1.noop));
                };
                openBuffer();
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return buffer === null || buffer === void 0 ? void 0 : buffer.push(value);
                }, function() {
                    buffer && subscriber.next(buffer);
                    subscriber.complete();
                }, void 0, function() {
                    return buffer = closingSubscriber = null;
                }));
            });
        }
        exports2.bufferWhen = bufferWhen;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/catchError.js
var require_catchError = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/catchError.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.catchError = void 0;
        var innerFrom_1 = require_innerFrom();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var lift_1 = require_lift();
        function catchError(selector) {
            return lift_1.operate(function(source, subscriber) {
                var innerSub = null;
                var syncUnsub = false;
                var handledResult;
                innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
                    handledResult = innerFrom_1.innerFrom(selector(err, catchError(selector)(source)));
                    if (innerSub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        handledResult.subscribe(subscriber);
                    } else {
                        syncUnsub = true;
                    }
                }));
                if (syncUnsub) {
                    innerSub.unsubscribe();
                    innerSub = null;
                    handledResult.subscribe(subscriber);
                }
            });
        }
        exports2.catchError = catchError;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/scanInternals.js
var require_scanInternals = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/scanInternals.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scanInternals = void 0;
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
            return function(source, subscriber) {
                var hasState = hasSeed;
                var state = seed;
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var i = index++;
                    state = hasState ? accumulator(state, value, i) : (hasState = true, value);
                    emitOnNext && subscriber.next(state);
                }, emitBeforeComplete && function() {
                    hasState && subscriber.next(state);
                    subscriber.complete();
                }));
            };
        }
        exports2.scanInternals = scanInternals;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/reduce.js
var require_reduce = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/reduce.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.reduce = void 0;
        var scanInternals_1 = require_scanInternals();
        var lift_1 = require_lift();
        function reduce(accumulator, seed) {
            return lift_1.operate(scanInternals_1.scanInternals(accumulator, seed, arguments.length >= 2, false, true));
        }
        exports2.reduce = reduce;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/toArray.js
var require_toArray = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/toArray.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.toArray = void 0;
        var reduce_1 = require_reduce();
        var lift_1 = require_lift();
        var arrReducer = function arrReducer(arr, value) {
            return arr.push(value), arr;
        };
        function toArray() {
            return lift_1.operate(function(source, subscriber) {
                reduce_1.reduce(arrReducer, [])(source).subscribe(subscriber);
            });
        }
        exports2.toArray = toArray;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/joinAllInternals.js
var require_joinAllInternals = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/joinAllInternals.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.joinAllInternals = void 0;
        var identity_1 = require_identity();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        var pipe_1 = require_pipe();
        var mergeMap_1 = require_mergeMap();
        var toArray_1 = require_toArray();
        function joinAllInternals(joinFn, project) {
            return pipe_1.pipe(toArray_1.toArray(), mergeMap_1.mergeMap(function(sources) {
                return joinFn(sources);
            }), project ? mapOneOrManyArgs_1.mapOneOrManyArgs(project) : identity_1.identity);
        }
        exports2.joinAllInternals = joinAllInternals;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/combineLatestAll.js
var require_combineLatestAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/combineLatestAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.combineLatestAll = void 0;
        var combineLatest_1 = require_combineLatest();
        var joinAllInternals_1 = require_joinAllInternals();
        function combineLatestAll(project) {
            return joinAllInternals_1.joinAllInternals(combineLatest_1.combineLatest, project);
        }
        exports2.combineLatestAll = combineLatestAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/combineAll.js
var require_combineAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/combineAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.combineAll = void 0;
        var combineLatestAll_1 = require_combineLatestAll();
        exports2.combineAll = combineLatestAll_1.combineLatestAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/combineLatest.js
var require_combineLatest2 = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/combineLatest.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.combineLatest = void 0;
        var combineLatest_1 = require_combineLatest();
        var lift_1 = require_lift();
        var argsOrArgArray_1 = require_argsOrArgArray();
        var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
        var pipe_1 = require_pipe();
        var args_1 = require_args();
        function combineLatest() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var resultSelector = args_1.popResultSelector(args);
            return resultSelector ? pipe_1.pipe(combineLatest.apply(void 0, __spreadArray([], __read(args))), mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : lift_1.operate(function(source, subscriber) {
                combineLatest_1.combineLatestInit(__spreadArray([
                    source
                ], __read(argsOrArgArray_1.argsOrArgArray(args))))(subscriber);
            });
        }
        exports2.combineLatest = combineLatest;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/combineLatestWith.js
var require_combineLatestWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/combineLatestWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.combineLatestWith = void 0;
        var combineLatest_1 = require_combineLatest2();
        function combineLatestWith() {
            var otherSources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                otherSources[_i] = arguments[_i];
            }
            return combineLatest_1.combineLatest.apply(void 0, __spreadArray([], __read(otherSources)));
        }
        exports2.combineLatestWith = combineLatestWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/concatMap.js
var require_concatMap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/concatMap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.concatMap = void 0;
        var mergeMap_1 = require_mergeMap();
        var isFunction_1 = require_isFunction();
        function concatMap(project, resultSelector) {
            return isFunction_1.isFunction(resultSelector) ? mergeMap_1.mergeMap(project, resultSelector, 1) : mergeMap_1.mergeMap(project, 1);
        }
        exports2.concatMap = concatMap;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/concatMapTo.js
var require_concatMapTo = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/concatMapTo.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.concatMapTo = void 0;
        var concatMap_1 = require_concatMap();
        var isFunction_1 = require_isFunction();
        function concatMapTo(innerObservable, resultSelector) {
            return isFunction_1.isFunction(resultSelector) ? concatMap_1.concatMap(function() {
                return innerObservable;
            }, resultSelector) : concatMap_1.concatMap(function() {
                return innerObservable;
            });
        }
        exports2.concatMapTo = concatMapTo;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/concat.js
var require_concat2 = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/concat.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.concat = void 0;
        var lift_1 = require_lift();
        var concatAll_1 = require_concatAll();
        var args_1 = require_args();
        var from_1 = require_from();
        function concat() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var scheduler = args_1.popScheduler(args);
            return lift_1.operate(function(source, subscriber) {
                concatAll_1.concatAll()(from_1.from(__spreadArray([
                    source
                ], __read(args)), scheduler)).subscribe(subscriber);
            });
        }
        exports2.concat = concat;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/concatWith.js
var require_concatWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/concatWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.concatWith = void 0;
        var concat_1 = require_concat2();
        function concatWith() {
            var otherSources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                otherSources[_i] = arguments[_i];
            }
            return concat_1.concat.apply(void 0, __spreadArray([], __read(otherSources)));
        }
        exports2.concatWith = concatWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/observable/fromSubscribable.js
var require_fromSubscribable = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/observable/fromSubscribable.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.fromSubscribable = void 0;
        var Observable_1 = require_Observable();
        function fromSubscribable(subscribable) {
            return new Observable_1.Observable(function(subscriber) {
                return subscribable.subscribe(subscriber);
            });
        }
        exports2.fromSubscribable = fromSubscribable;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/connect.js
var require_connect = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/connect.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.connect = void 0;
        var Subject_1 = require_Subject();
        var innerFrom_1 = require_innerFrom();
        var lift_1 = require_lift();
        var fromSubscribable_1 = require_fromSubscribable();
        var DEFAULT_CONFIG = {
            connector: function connector() {
                return new Subject_1.Subject();
            }
        };
        function connect(selector, config) {
            if (config === void 0) {
                config = DEFAULT_CONFIG;
            }
            var connector = config.connector;
            return lift_1.operate(function(source, subscriber) {
                var subject = connector();
                innerFrom_1.innerFrom(selector(fromSubscribable_1.fromSubscribable(subject))).subscribe(subscriber);
                subscriber.add(source.subscribe(subject));
            });
        }
        exports2.connect = connect;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/count.js
var require_count = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/count.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.count = void 0;
        var reduce_1 = require_reduce();
        function count(predicate) {
            return reduce_1.reduce(function(total, value, i) {
                return !predicate || predicate(value, i) ? total + 1 : total;
            }, 0);
        }
        exports2.count = count;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/debounce.js
var require_debounce = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/debounce.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.debounce = void 0;
        var lift_1 = require_lift();
        var noop_1 = require_noop();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        function debounce(durationSelector) {
            return lift_1.operate(function(source, subscriber) {
                var hasValue = false;
                var lastValue = null;
                var durationSubscriber = null;
                var emit = function emit() {
                    durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                    durationSubscriber = null;
                    if (hasValue) {
                        hasValue = false;
                        var value = lastValue;
                        lastValue = null;
                        subscriber.next(value);
                    }
                };
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                    hasValue = true;
                    lastValue = value;
                    durationSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, emit, noop_1.noop);
                    innerFrom_1.innerFrom(durationSelector(value)).subscribe(durationSubscriber);
                }, function() {
                    emit();
                    subscriber.complete();
                }, void 0, function() {
                    lastValue = durationSubscriber = null;
                }));
            });
        }
        exports2.debounce = debounce;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/debounceTime.js
var require_debounceTime = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/debounceTime.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.debounceTime = void 0;
        var async_1 = require_async();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function debounceTime(dueTime, scheduler) {
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            return lift_1.operate(function(source, subscriber) {
                var activeTask = null;
                var lastValue = null;
                var lastTime = null;
                var emit = function emit() {
                    if (activeTask) {
                        activeTask.unsubscribe();
                        activeTask = null;
                        var value = lastValue;
                        lastValue = null;
                        subscriber.next(value);
                    }
                };
                function emitWhenIdle() {
                    var targetTime = lastTime + dueTime;
                    var now = scheduler.now();
                    if (now < targetTime) {
                        activeTask = this.schedule(void 0, targetTime - now);
                        subscriber.add(activeTask);
                        return;
                    }
                    emit();
                }
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    lastValue = value;
                    lastTime = scheduler.now();
                    if (!activeTask) {
                        activeTask = scheduler.schedule(emitWhenIdle, dueTime);
                        subscriber.add(activeTask);
                    }
                }, function() {
                    emit();
                    subscriber.complete();
                }, void 0, function() {
                    lastValue = activeTask = null;
                }));
            });
        }
        exports2.debounceTime = debounceTime;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/defaultIfEmpty.js
var require_defaultIfEmpty = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/defaultIfEmpty.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.defaultIfEmpty = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function defaultIfEmpty(defaultValue) {
            return lift_1.operate(function(source, subscriber) {
                var hasValue = false;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    hasValue = true;
                    subscriber.next(value);
                }, function() {
                    if (!hasValue) {
                        subscriber.next(defaultValue);
                    }
                    subscriber.complete();
                }));
            });
        }
        exports2.defaultIfEmpty = defaultIfEmpty;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/take.js
var require_take = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/take.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.take = void 0;
        var empty_1 = require_empty();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function take(count) {
            return count <= 0 ? function() {
                return empty_1.EMPTY;
            } : lift_1.operate(function(source, subscriber) {
                var seen = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    if (++seen <= count) {
                        subscriber.next(value);
                        if (count <= seen) {
                            subscriber.complete();
                        }
                    }
                }));
            });
        }
        exports2.take = take;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/ignoreElements.js
var require_ignoreElements = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/ignoreElements.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.ignoreElements = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var noop_1 = require_noop();
        function ignoreElements() {
            return lift_1.operate(function(source, subscriber) {
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, noop_1.noop));
            });
        }
        exports2.ignoreElements = ignoreElements;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mapTo.js
var require_mapTo = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mapTo.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mapTo = void 0;
        var map_1 = require_map();
        function mapTo(value) {
            return map_1.map(function() {
                return value;
            });
        }
        exports2.mapTo = mapTo;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/delayWhen.js
var require_delayWhen = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/delayWhen.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.delayWhen = void 0;
        var concat_1 = require_concat();
        var take_1 = require_take();
        var ignoreElements_1 = require_ignoreElements();
        var mapTo_1 = require_mapTo();
        var mergeMap_1 = require_mergeMap();
        var innerFrom_1 = require_innerFrom();
        function delayWhen(delayDurationSelector, subscriptionDelay) {
            if (subscriptionDelay) {
                return function(source) {
                    return concat_1.concat(subscriptionDelay.pipe(take_1.take(1), ignoreElements_1.ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
                };
            }
            return mergeMap_1.mergeMap(function(value, index) {
                return innerFrom_1.innerFrom(delayDurationSelector(value, index)).pipe(take_1.take(1), mapTo_1.mapTo(value));
            });
        }
        exports2.delayWhen = delayWhen;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/delay.js
var require_delay = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/delay.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.delay = void 0;
        var async_1 = require_async();
        var delayWhen_1 = require_delayWhen();
        var timer_1 = require_timer();
        function delay(due, scheduler) {
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            var duration = timer_1.timer(due, scheduler);
            return delayWhen_1.delayWhen(function() {
                return duration;
            });
        }
        exports2.delay = delay;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/dematerialize.js
var require_dematerialize = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/dematerialize.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.dematerialize = void 0;
        var Notification_1 = require_Notification();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function dematerialize() {
            return lift_1.operate(function(source, subscriber) {
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(notification) {
                    return Notification_1.observeNotification(notification, subscriber);
                }));
            });
        }
        exports2.dematerialize = dematerialize;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/distinct.js
var require_distinct = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/distinct.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.distinct = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var noop_1 = require_noop();
        var innerFrom_1 = require_innerFrom();
        function distinct(keySelector, flushes) {
            return lift_1.operate(function(source, subscriber) {
                var distinctKeys = /* @__PURE__ */ new Set();
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var key = keySelector ? keySelector(value) : value;
                    if (!distinctKeys.has(key)) {
                        distinctKeys.add(key);
                        subscriber.next(value);
                    }
                }));
                flushes && innerFrom_1.innerFrom(flushes).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    return distinctKeys.clear();
                }, noop_1.noop));
            });
        }
        exports2.distinct = distinct;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/distinctUntilChanged.js
var require_distinctUntilChanged = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/distinctUntilChanged.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.distinctUntilChanged = void 0;
        var identity_1 = require_identity();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function distinctUntilChanged(comparator, keySelector) {
            if (keySelector === void 0) {
                keySelector = identity_1.identity;
            }
            comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
            return lift_1.operate(function(source, subscriber) {
                var previousKey;
                var first = true;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var currentKey = keySelector(value);
                    if (first || !comparator(previousKey, currentKey)) {
                        first = false;
                        previousKey = currentKey;
                        subscriber.next(value);
                    }
                }));
            });
        }
        exports2.distinctUntilChanged = distinctUntilChanged;
        function defaultCompare(a, b) {
            return a === b;
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/distinctUntilKeyChanged.js
var require_distinctUntilKeyChanged = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/distinctUntilKeyChanged.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.distinctUntilKeyChanged = void 0;
        var distinctUntilChanged_1 = require_distinctUntilChanged();
        function distinctUntilKeyChanged(key, compare) {
            return distinctUntilChanged_1.distinctUntilChanged(function(x, y) {
                return compare ? compare(x[key], y[key]) : x[key] === y[key];
            });
        }
        exports2.distinctUntilKeyChanged = distinctUntilKeyChanged;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/throwIfEmpty.js
var require_throwIfEmpty = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/throwIfEmpty.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.throwIfEmpty = void 0;
        var EmptyError_1 = require_EmptyError();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function throwIfEmpty(errorFactory) {
            if (errorFactory === void 0) {
                errorFactory = defaultErrorFactory;
            }
            return lift_1.operate(function(source, subscriber) {
                var hasValue = false;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    hasValue = true;
                    subscriber.next(value);
                }, function() {
                    return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
                }));
            });
        }
        exports2.throwIfEmpty = throwIfEmpty;
        function defaultErrorFactory() {
            return new EmptyError_1.EmptyError();
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/elementAt.js
var require_elementAt = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/elementAt.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.elementAt = void 0;
        var ArgumentOutOfRangeError_1 = require_ArgumentOutOfRangeError();
        var filter_1 = require_filter();
        var throwIfEmpty_1 = require_throwIfEmpty();
        var defaultIfEmpty_1 = require_defaultIfEmpty();
        var take_1 = require_take();
        function elementAt(index, defaultValue) {
            if (index < 0) {
                throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
            }
            var hasDefaultValue = arguments.length >= 2;
            return function(source) {
                return source.pipe(filter_1.filter(function(v, i) {
                    return i === index;
                }), take_1.take(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
                    return new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
                }));
            };
        }
        exports2.elementAt = elementAt;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/endWith.js
var require_endWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/endWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.endWith = void 0;
        var concat_1 = require_concat();
        var of_1 = require_of();
        function endWith() {
            var values = [];
            for(var _i = 0; _i < arguments.length; _i++){
                values[_i] = arguments[_i];
            }
            return function(source) {
                return concat_1.concat(source, of_1.of.apply(void 0, __spreadArray([], __read(values))));
            };
        }
        exports2.endWith = endWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/every.js
var require_every = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/every.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.every = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function every(predicate, thisArg) {
            return lift_1.operate(function(source, subscriber) {
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    if (!predicate.call(thisArg, value, index++, source)) {
                        subscriber.next(false);
                        subscriber.complete();
                    }
                }, function() {
                    subscriber.next(true);
                    subscriber.complete();
                }));
            });
        }
        exports2.every = every;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/exhaustMap.js
var require_exhaustMap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/exhaustMap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.exhaustMap = void 0;
        var map_1 = require_map();
        var innerFrom_1 = require_innerFrom();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function exhaustMap(project, resultSelector) {
            if (resultSelector) {
                return function(source) {
                    return source.pipe(exhaustMap(function(a, i) {
                        return innerFrom_1.innerFrom(project(a, i)).pipe(map_1.map(function(b, ii) {
                            return resultSelector(a, b, i, ii);
                        }));
                    }));
                };
            }
            return lift_1.operate(function(source, subscriber) {
                var index = 0;
                var innerSub = null;
                var isComplete = false;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(outerValue) {
                    if (!innerSub) {
                        innerSub = OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, function() {
                            innerSub = null;
                            isComplete && subscriber.complete();
                        });
                        innerFrom_1.innerFrom(project(outerValue, index++)).subscribe(innerSub);
                    }
                }, function() {
                    isComplete = true;
                    !innerSub && subscriber.complete();
                }));
            });
        }
        exports2.exhaustMap = exhaustMap;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/exhaustAll.js
var require_exhaustAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/exhaustAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.exhaustAll = void 0;
        var exhaustMap_1 = require_exhaustMap();
        var identity_1 = require_identity();
        function exhaustAll() {
            return exhaustMap_1.exhaustMap(identity_1.identity);
        }
        exports2.exhaustAll = exhaustAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/exhaust.js
var require_exhaust = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/exhaust.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.exhaust = void 0;
        var exhaustAll_1 = require_exhaustAll();
        exports2.exhaust = exhaustAll_1.exhaustAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/expand.js
var require_expand = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/expand.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.expand = void 0;
        var lift_1 = require_lift();
        var mergeInternals_1 = require_mergeInternals();
        function expand(project, concurrent, scheduler) {
            if (concurrent === void 0) {
                concurrent = Infinity;
            }
            concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
            return lift_1.operate(function(source, subscriber) {
                return mergeInternals_1.mergeInternals(source, subscriber, project, concurrent, void 0, true, scheduler);
            });
        }
        exports2.expand = expand;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/finalize.js
var require_finalize = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/finalize.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.finalize = void 0;
        var lift_1 = require_lift();
        function finalize(callback) {
            return lift_1.operate(function(source, subscriber) {
                try {
                    source.subscribe(subscriber);
                } finally{
                    subscriber.add(callback);
                }
            });
        }
        exports2.finalize = finalize;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/find.js
var require_find = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/find.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.createFind = exports2.find = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function find(predicate, thisArg) {
            return lift_1.operate(createFind(predicate, thisArg, "value"));
        }
        exports2.find = find;
        function createFind(predicate, thisArg, emit) {
            var findIndex = emit === "index";
            return function(source, subscriber) {
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var i = index++;
                    if (predicate.call(thisArg, value, i, source)) {
                        subscriber.next(findIndex ? i : value);
                        subscriber.complete();
                    }
                }, function() {
                    subscriber.next(findIndex ? -1 : void 0);
                    subscriber.complete();
                }));
            };
        }
        exports2.createFind = createFind;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/findIndex.js
var require_findIndex = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/findIndex.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.findIndex = void 0;
        var lift_1 = require_lift();
        var find_1 = require_find();
        function findIndex(predicate, thisArg) {
            return lift_1.operate(find_1.createFind(predicate, thisArg, "index"));
        }
        exports2.findIndex = findIndex;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/first.js
var require_first = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/first.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.first = void 0;
        var EmptyError_1 = require_EmptyError();
        var filter_1 = require_filter();
        var take_1 = require_take();
        var defaultIfEmpty_1 = require_defaultIfEmpty();
        var throwIfEmpty_1 = require_throwIfEmpty();
        var identity_1 = require_identity();
        function first(predicate, defaultValue) {
            var hasDefaultValue = arguments.length >= 2;
            return function(source) {
                return source.pipe(predicate ? filter_1.filter(function(v, i) {
                    return predicate(v, i, source);
                }) : identity_1.identity, take_1.take(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
                    return new EmptyError_1.EmptyError();
                }));
            };
        }
        exports2.first = first;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/groupBy.js
var require_groupBy = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/groupBy.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.groupBy = void 0;
        var Observable_1 = require_Observable();
        var innerFrom_1 = require_innerFrom();
        var Subject_1 = require_Subject();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function groupBy(keySelector, elementOrOptions, duration, connector) {
            return lift_1.operate(function(source, subscriber) {
                var element;
                if (!elementOrOptions || typeof elementOrOptions === "function") {
                    element = elementOrOptions;
                } else {
                    duration = elementOrOptions.duration, element = elementOrOptions.element, connector = elementOrOptions.connector;
                }
                var groups = /* @__PURE__ */ new Map();
                var notify = function notify(cb) {
                    groups.forEach(cb);
                    cb(subscriber);
                };
                var handleError = function handleError(err) {
                    return notify(function(consumer) {
                        return consumer.error(err);
                    });
                };
                var activeGroups = 0;
                var teardownAttempted = false;
                var groupBySourceSubscriber = new OperatorSubscriber_1.OperatorSubscriber(subscriber, function(value) {
                    try {
                        var key_1 = keySelector(value);
                        var group_1 = groups.get(key_1);
                        if (!group_1) {
                            groups.set(key_1, group_1 = connector ? connector() : new Subject_1.Subject());
                            var grouped = createGroupedObservable(key_1, group_1);
                            subscriber.next(grouped);
                            if (duration) {
                                var durationSubscriber_1 = OperatorSubscriber_1.createOperatorSubscriber(group_1, function() {
                                    group_1.complete();
                                    durationSubscriber_1 === null || durationSubscriber_1 === void 0 ? void 0 : durationSubscriber_1.unsubscribe();
                                }, void 0, void 0, function() {
                                    return groups.delete(key_1);
                                });
                                groupBySourceSubscriber.add(innerFrom_1.innerFrom(duration(grouped)).subscribe(durationSubscriber_1));
                            }
                        }
                        group_1.next(element ? element(value) : value);
                    } catch (err) {
                        handleError(err);
                    }
                }, function() {
                    return notify(function(consumer) {
                        return consumer.complete();
                    });
                }, handleError, function() {
                    return groups.clear();
                }, function() {
                    teardownAttempted = true;
                    return activeGroups === 0;
                });
                source.subscribe(groupBySourceSubscriber);
                function createGroupedObservable(key, groupSubject) {
                    var result = new Observable_1.Observable(function(groupSubscriber) {
                        activeGroups++;
                        var innerSub = groupSubject.subscribe(groupSubscriber);
                        return function() {
                            innerSub.unsubscribe();
                            --activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
                        };
                    });
                    result.key = key;
                    return result;
                }
            });
        }
        exports2.groupBy = groupBy;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/isEmpty.js
var require_isEmpty = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/isEmpty.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.isEmpty = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function isEmpty() {
            return lift_1.operate(function(source, subscriber) {
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    subscriber.next(false);
                    subscriber.complete();
                }, function() {
                    subscriber.next(true);
                    subscriber.complete();
                }));
            });
        }
        exports2.isEmpty = isEmpty;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/takeLast.js
var require_takeLast = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/takeLast.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.takeLast = void 0;
        var empty_1 = require_empty();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function takeLast(count) {
            return count <= 0 ? function() {
                return empty_1.EMPTY;
            } : lift_1.operate(function(source, subscriber) {
                var buffer = [];
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    buffer.push(value);
                    count < buffer.length && buffer.shift();
                }, function() {
                    var e_1, _a;
                    try {
                        for(var buffer_1 = __values(buffer), buffer_1_1 = buffer_1.next(); !buffer_1_1.done; buffer_1_1 = buffer_1.next()){
                            var value = buffer_1_1.value;
                            subscriber.next(value);
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (buffer_1_1 && !buffer_1_1.done && (_a = buffer_1.return)) _a.call(buffer_1);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                    subscriber.complete();
                }, void 0, function() {
                    buffer = null;
                }));
            });
        }
        exports2.takeLast = takeLast;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/last.js
var require_last = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/last.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.last = void 0;
        var EmptyError_1 = require_EmptyError();
        var filter_1 = require_filter();
        var takeLast_1 = require_takeLast();
        var throwIfEmpty_1 = require_throwIfEmpty();
        var defaultIfEmpty_1 = require_defaultIfEmpty();
        var identity_1 = require_identity();
        function last(predicate, defaultValue) {
            var hasDefaultValue = arguments.length >= 2;
            return function(source) {
                return source.pipe(predicate ? filter_1.filter(function(v, i) {
                    return predicate(v, i, source);
                }) : identity_1.identity, takeLast_1.takeLast(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
                    return new EmptyError_1.EmptyError();
                }));
            };
        }
        exports2.last = last;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/materialize.js
var require_materialize = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/materialize.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.materialize = void 0;
        var Notification_1 = require_Notification();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function materialize() {
            return lift_1.operate(function(source, subscriber) {
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    subscriber.next(Notification_1.Notification.createNext(value));
                }, function() {
                    subscriber.next(Notification_1.Notification.createComplete());
                    subscriber.complete();
                }, function(err) {
                    subscriber.next(Notification_1.Notification.createError(err));
                    subscriber.complete();
                }));
            });
        }
        exports2.materialize = materialize;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/max.js
var require_max = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/max.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.max = void 0;
        var reduce_1 = require_reduce();
        var isFunction_1 = require_isFunction();
        function max(comparer) {
            return reduce_1.reduce(isFunction_1.isFunction(comparer) ? function(x, y) {
                return comparer(x, y) > 0 ? x : y;
            } : function(x, y) {
                return x > y ? x : y;
            });
        }
        exports2.max = max;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/flatMap.js
var require_flatMap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/flatMap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.flatMap = void 0;
        var mergeMap_1 = require_mergeMap();
        exports2.flatMap = mergeMap_1.mergeMap;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mergeMapTo.js
var require_mergeMapTo = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mergeMapTo.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mergeMapTo = void 0;
        var mergeMap_1 = require_mergeMap();
        var isFunction_1 = require_isFunction();
        function mergeMapTo(innerObservable, resultSelector, concurrent) {
            if (concurrent === void 0) {
                concurrent = Infinity;
            }
            if (isFunction_1.isFunction(resultSelector)) {
                return mergeMap_1.mergeMap(function() {
                    return innerObservable;
                }, resultSelector, concurrent);
            }
            if (typeof resultSelector === "number") {
                concurrent = resultSelector;
            }
            return mergeMap_1.mergeMap(function() {
                return innerObservable;
            }, concurrent);
        }
        exports2.mergeMapTo = mergeMapTo;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mergeScan.js
var require_mergeScan = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mergeScan.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mergeScan = void 0;
        var lift_1 = require_lift();
        var mergeInternals_1 = require_mergeInternals();
        function mergeScan(accumulator, seed, concurrent) {
            if (concurrent === void 0) {
                concurrent = Infinity;
            }
            return lift_1.operate(function(source, subscriber) {
                var state = seed;
                return mergeInternals_1.mergeInternals(source, subscriber, function(value, index) {
                    return accumulator(state, value, index);
                }, concurrent, function(value) {
                    state = value;
                }, false, void 0, function() {
                    return state = null;
                });
            });
        }
        exports2.mergeScan = mergeScan;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/merge.js
var require_merge2 = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/merge.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.merge = void 0;
        var lift_1 = require_lift();
        var mergeAll_1 = require_mergeAll();
        var args_1 = require_args();
        var from_1 = require_from();
        function merge() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            var scheduler = args_1.popScheduler(args);
            var concurrent = args_1.popNumber(args, Infinity);
            return lift_1.operate(function(source, subscriber) {
                mergeAll_1.mergeAll(concurrent)(from_1.from(__spreadArray([
                    source
                ], __read(args)), scheduler)).subscribe(subscriber);
            });
        }
        exports2.merge = merge;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/mergeWith.js
var require_mergeWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/mergeWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.mergeWith = void 0;
        var merge_1 = require_merge2();
        function mergeWith() {
            var otherSources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                otherSources[_i] = arguments[_i];
            }
            return merge_1.merge.apply(void 0, __spreadArray([], __read(otherSources)));
        }
        exports2.mergeWith = mergeWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/min.js
var require_min = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/min.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.min = void 0;
        var reduce_1 = require_reduce();
        var isFunction_1 = require_isFunction();
        function min(comparer) {
            return reduce_1.reduce(isFunction_1.isFunction(comparer) ? function(x, y) {
                return comparer(x, y) < 0 ? x : y;
            } : function(x, y) {
                return x < y ? x : y;
            });
        }
        exports2.min = min;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/multicast.js
var require_multicast = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/multicast.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.multicast = void 0;
        var ConnectableObservable_1 = require_ConnectableObservable();
        var isFunction_1 = require_isFunction();
        var connect_1 = require_connect();
        function multicast(subjectOrSubjectFactory, selector) {
            var subjectFactory = isFunction_1.isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : function subjectFactory() {
                return subjectOrSubjectFactory;
            };
            if (isFunction_1.isFunction(selector)) {
                return connect_1.connect(selector, {
                    connector: subjectFactory
                });
            }
            return function(source) {
                return new ConnectableObservable_1.ConnectableObservable(source, subjectFactory);
            };
        }
        exports2.multicast = multicast;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/onErrorResumeNextWith.js
var require_onErrorResumeNextWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/onErrorResumeNextWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.onErrorResumeNext = exports2.onErrorResumeNextWith = void 0;
        var argsOrArgArray_1 = require_argsOrArgArray();
        var onErrorResumeNext_1 = require_onErrorResumeNext();
        function onErrorResumeNextWith() {
            var sources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                sources[_i] = arguments[_i];
            }
            var nextSources = argsOrArgArray_1.argsOrArgArray(sources);
            return function(source) {
                return onErrorResumeNext_1.onErrorResumeNext.apply(void 0, __spreadArray([
                    source
                ], __read(nextSources)));
            };
        }
        exports2.onErrorResumeNextWith = onErrorResumeNextWith;
        exports2.onErrorResumeNext = onErrorResumeNextWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/pairwise.js
var require_pairwise = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/pairwise.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.pairwise = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function pairwise() {
            return lift_1.operate(function(source, subscriber) {
                var prev;
                var hasPrev = false;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var p = prev;
                    prev = value;
                    hasPrev && subscriber.next([
                        p,
                        value
                    ]);
                    hasPrev = true;
                }));
            });
        }
        exports2.pairwise = pairwise;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/pluck.js
var require_pluck = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/pluck.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.pluck = void 0;
        var map_1 = require_map();
        function pluck() {
            var properties = [];
            for(var _i = 0; _i < arguments.length; _i++){
                properties[_i] = arguments[_i];
            }
            var length = properties.length;
            if (length === 0) {
                throw new Error("list of properties cannot be empty.");
            }
            return map_1.map(function(x) {
                var currentProp = x;
                for(var i = 0; i < length; i++){
                    var p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
                    if (typeof p !== "undefined") {
                        currentProp = p;
                    } else {
                        return void 0;
                    }
                }
                return currentProp;
            });
        }
        exports2.pluck = pluck;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/publish.js
var require_publish = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/publish.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.publish = void 0;
        var Subject_1 = require_Subject();
        var multicast_1 = require_multicast();
        var connect_1 = require_connect();
        function publish(selector) {
            return selector ? function(source) {
                return connect_1.connect(selector)(source);
            } : function(source) {
                return multicast_1.multicast(new Subject_1.Subject())(source);
            };
        }
        exports2.publish = publish;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/publishBehavior.js
var require_publishBehavior = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/publishBehavior.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.publishBehavior = void 0;
        var BehaviorSubject_1 = require_BehaviorSubject();
        var ConnectableObservable_1 = require_ConnectableObservable();
        function publishBehavior(initialValue) {
            return function(source) {
                var subject = new BehaviorSubject_1.BehaviorSubject(initialValue);
                return new ConnectableObservable_1.ConnectableObservable(source, function() {
                    return subject;
                });
            };
        }
        exports2.publishBehavior = publishBehavior;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/publishLast.js
var require_publishLast = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/publishLast.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.publishLast = void 0;
        var AsyncSubject_1 = require_AsyncSubject();
        var ConnectableObservable_1 = require_ConnectableObservable();
        function publishLast() {
            return function(source) {
                var subject = new AsyncSubject_1.AsyncSubject();
                return new ConnectableObservable_1.ConnectableObservable(source, function() {
                    return subject;
                });
            };
        }
        exports2.publishLast = publishLast;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/publishReplay.js
var require_publishReplay = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/publishReplay.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.publishReplay = void 0;
        var ReplaySubject_1 = require_ReplaySubject();
        var multicast_1 = require_multicast();
        var isFunction_1 = require_isFunction();
        function publishReplay(bufferSize, windowTime, selectorOrScheduler, timestampProvider) {
            if (selectorOrScheduler && !isFunction_1.isFunction(selectorOrScheduler)) {
                timestampProvider = selectorOrScheduler;
            }
            var selector = isFunction_1.isFunction(selectorOrScheduler) ? selectorOrScheduler : void 0;
            return function(source) {
                return multicast_1.multicast(new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, timestampProvider), selector)(source);
            };
        }
        exports2.publishReplay = publishReplay;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/raceWith.js
var require_raceWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/raceWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.raceWith = void 0;
        var race_1 = require_race();
        var lift_1 = require_lift();
        var identity_1 = require_identity();
        function raceWith() {
            var otherSources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                otherSources[_i] = arguments[_i];
            }
            return !otherSources.length ? identity_1.identity : lift_1.operate(function(source, subscriber) {
                race_1.raceInit(__spreadArray([
                    source
                ], __read(otherSources)))(subscriber);
            });
        }
        exports2.raceWith = raceWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/repeat.js
var require_repeat = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/repeat.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.repeat = void 0;
        var empty_1 = require_empty();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        var timer_1 = require_timer();
        function repeat(countOrConfig) {
            var _a;
            var count = Infinity;
            var delay;
            if (countOrConfig != null) {
                if ((typeof countOrConfig === "undefined" ? "undefined" : _type_of(countOrConfig)) === "object") {
                    _a = countOrConfig.count, count = _a === void 0 ? Infinity : _a, delay = countOrConfig.delay;
                } else {
                    count = countOrConfig;
                }
            }
            return count <= 0 ? function() {
                return empty_1.EMPTY;
            } : lift_1.operate(function(source, subscriber) {
                var soFar = 0;
                var sourceSub;
                var resubscribe = function resubscribe() {
                    sourceSub === null || sourceSub === void 0 ? void 0 : sourceSub.unsubscribe();
                    sourceSub = null;
                    if (delay != null) {
                        var notifier = typeof delay === "number" ? timer_1.timer(delay) : innerFrom_1.innerFrom(delay(soFar));
                        var notifierSubscriber_1 = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                            notifierSubscriber_1.unsubscribe();
                            subscribeToSource();
                        });
                        notifier.subscribe(notifierSubscriber_1);
                    } else {
                        subscribeToSource();
                    }
                };
                var subscribeToSource = function subscribeToSource() {
                    var syncUnsub = false;
                    sourceSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, function() {
                        if (++soFar < count) {
                            if (sourceSub) {
                                resubscribe();
                            } else {
                                syncUnsub = true;
                            }
                        } else {
                            subscriber.complete();
                        }
                    }));
                    if (syncUnsub) {
                        resubscribe();
                    }
                };
                subscribeToSource();
            });
        }
        exports2.repeat = repeat;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/repeatWhen.js
var require_repeatWhen = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/repeatWhen.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.repeatWhen = void 0;
        var innerFrom_1 = require_innerFrom();
        var Subject_1 = require_Subject();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function repeatWhen(notifier) {
            return lift_1.operate(function(source, subscriber) {
                var innerSub;
                var syncResub = false;
                var completions$;
                var isNotifierComplete = false;
                var isMainComplete = false;
                var checkComplete = function checkComplete() {
                    return isMainComplete && isNotifierComplete && (subscriber.complete(), true);
                };
                var getCompletionSubject = function getCompletionSubject() {
                    if (!completions$) {
                        completions$ = new Subject_1.Subject();
                        innerFrom_1.innerFrom(notifier(completions$)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                            if (innerSub) {
                                subscribeForRepeatWhen();
                            } else {
                                syncResub = true;
                            }
                        }, function() {
                            isNotifierComplete = true;
                            checkComplete();
                        }));
                    }
                    return completions$;
                };
                var subscribeForRepeatWhen = function subscribeForRepeatWhen1() {
                    isMainComplete = false;
                    innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, function() {
                        isMainComplete = true;
                        !checkComplete() && getCompletionSubject().next();
                    }));
                    if (syncResub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        syncResub = false;
                        subscribeForRepeatWhen();
                    }
                };
                subscribeForRepeatWhen();
            });
        }
        exports2.repeatWhen = repeatWhen;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/retry.js
var require_retry = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/retry.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.retry = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var identity_1 = require_identity();
        var timer_1 = require_timer();
        var innerFrom_1 = require_innerFrom();
        function retry(configOrCount) {
            if (configOrCount === void 0) {
                configOrCount = Infinity;
            }
            var config;
            if (configOrCount && (typeof configOrCount === "undefined" ? "undefined" : _type_of(configOrCount)) === "object") {
                config = configOrCount;
            } else {
                config = {
                    count: configOrCount
                };
            }
            var _a = config.count, count = _a === void 0 ? Infinity : _a, delay = config.delay, _b = config.resetOnSuccess, resetOnSuccess = _b === void 0 ? false : _b;
            return count <= 0 ? identity_1.identity : lift_1.operate(function(source, subscriber) {
                var soFar = 0;
                var innerSub;
                var subscribeForRetry = function subscribeForRetry1() {
                    var syncUnsub = false;
                    innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                        if (resetOnSuccess) {
                            soFar = 0;
                        }
                        subscriber.next(value);
                    }, void 0, function(err) {
                        if (soFar++ < count) {
                            var resub_1 = function resub_1() {
                                if (innerSub) {
                                    innerSub.unsubscribe();
                                    innerSub = null;
                                    subscribeForRetry();
                                } else {
                                    syncUnsub = true;
                                }
                            };
                            if (delay != null) {
                                var notifier = typeof delay === "number" ? timer_1.timer(delay) : innerFrom_1.innerFrom(delay(err, soFar));
                                var notifierSubscriber_1 = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                                    notifierSubscriber_1.unsubscribe();
                                    resub_1();
                                }, function() {
                                    subscriber.complete();
                                });
                                notifier.subscribe(notifierSubscriber_1);
                            } else {
                                resub_1();
                            }
                        } else {
                            subscriber.error(err);
                        }
                    }));
                    if (syncUnsub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        subscribeForRetry();
                    }
                };
                subscribeForRetry();
            });
        }
        exports2.retry = retry;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/retryWhen.js
var require_retryWhen = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/retryWhen.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.retryWhen = void 0;
        var innerFrom_1 = require_innerFrom();
        var Subject_1 = require_Subject();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function retryWhen(notifier) {
            return lift_1.operate(function(source, subscriber) {
                var innerSub;
                var syncResub = false;
                var errors$;
                var subscribeForRetryWhen = function subscribeForRetryWhen1() {
                    innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
                        if (!errors$) {
                            errors$ = new Subject_1.Subject();
                            innerFrom_1.innerFrom(notifier(errors$)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                                return innerSub ? subscribeForRetryWhen() : syncResub = true;
                            }));
                        }
                        if (errors$) {
                            errors$.next(err);
                        }
                    }));
                    if (syncResub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        syncResub = false;
                        subscribeForRetryWhen();
                    }
                };
                subscribeForRetryWhen();
            });
        }
        exports2.retryWhen = retryWhen;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/sample.js
var require_sample = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/sample.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.sample = void 0;
        var innerFrom_1 = require_innerFrom();
        var lift_1 = require_lift();
        var noop_1 = require_noop();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function sample(notifier) {
            return lift_1.operate(function(source, subscriber) {
                var hasValue = false;
                var lastValue = null;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    hasValue = true;
                    lastValue = value;
                }));
                innerFrom_1.innerFrom(notifier).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    if (hasValue) {
                        hasValue = false;
                        var value = lastValue;
                        lastValue = null;
                        subscriber.next(value);
                    }
                }, noop_1.noop));
            });
        }
        exports2.sample = sample;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/sampleTime.js
var require_sampleTime = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/sampleTime.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.sampleTime = void 0;
        var async_1 = require_async();
        var sample_1 = require_sample();
        var interval_1 = require_interval();
        function sampleTime(period, scheduler) {
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            return sample_1.sample(interval_1.interval(period, scheduler));
        }
        exports2.sampleTime = sampleTime;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/scan.js
var require_scan = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/scan.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.scan = void 0;
        var lift_1 = require_lift();
        var scanInternals_1 = require_scanInternals();
        function scan(accumulator, seed) {
            return lift_1.operate(scanInternals_1.scanInternals(accumulator, seed, arguments.length >= 2, true));
        }
        exports2.scan = scan;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/sequenceEqual.js
var require_sequenceEqual = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/sequenceEqual.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.sequenceEqual = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        function sequenceEqual(compareTo, comparator) {
            if (comparator === void 0) {
                comparator = function comparator(a, b) {
                    return a === b;
                };
            }
            return lift_1.operate(function(source, subscriber) {
                var aState = createState();
                var bState = createState();
                var emit = function emit(isEqual) {
                    subscriber.next(isEqual);
                    subscriber.complete();
                };
                var createSubscriber = function createSubscriber(selfState, otherState) {
                    var sequenceEqualSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(a) {
                        var buffer = otherState.buffer, complete = otherState.complete;
                        if (buffer.length === 0) {
                            complete ? emit(false) : selfState.buffer.push(a);
                        } else {
                            !comparator(a, buffer.shift()) && emit(false);
                        }
                    }, function() {
                        selfState.complete = true;
                        var complete = otherState.complete, buffer = otherState.buffer;
                        complete && emit(buffer.length === 0);
                        sequenceEqualSubscriber === null || sequenceEqualSubscriber === void 0 ? void 0 : sequenceEqualSubscriber.unsubscribe();
                    });
                    return sequenceEqualSubscriber;
                };
                source.subscribe(createSubscriber(aState, bState));
                innerFrom_1.innerFrom(compareTo).subscribe(createSubscriber(bState, aState));
            });
        }
        exports2.sequenceEqual = sequenceEqual;
        function createState() {
            return {
                buffer: [],
                complete: false
            };
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/share.js
var require_share = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/share.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.share = void 0;
        var innerFrom_1 = require_innerFrom();
        var Subject_1 = require_Subject();
        var Subscriber_1 = require_Subscriber();
        var lift_1 = require_lift();
        function share(options) {
            if (options === void 0) {
                options = {};
            }
            var _a = options.connector, connector = _a === void 0 ? function connector() {
                return new Subject_1.Subject();
            } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
            return function(wrapperSource) {
                var connection;
                var resetConnection;
                var subject;
                var refCount = 0;
                var hasCompleted = false;
                var hasErrored = false;
                var cancelReset = function cancelReset() {
                    resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
                    resetConnection = void 0;
                };
                var reset = function reset() {
                    cancelReset();
                    connection = subject = void 0;
                    hasCompleted = hasErrored = false;
                };
                var resetAndUnsubscribe = function resetAndUnsubscribe() {
                    var conn = connection;
                    reset();
                    conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
                };
                return lift_1.operate(function(source, subscriber) {
                    refCount++;
                    if (!hasErrored && !hasCompleted) {
                        cancelReset();
                    }
                    var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
                    subscriber.add(function() {
                        refCount--;
                        if (refCount === 0 && !hasErrored && !hasCompleted) {
                            resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                        }
                    });
                    dest.subscribe(subscriber);
                    if (!connection && refCount > 0) {
                        connection = new Subscriber_1.SafeSubscriber({
                            next: function next(value) {
                                return dest.next(value);
                            },
                            error: function error(err) {
                                hasErrored = true;
                                cancelReset();
                                resetConnection = handleReset(reset, resetOnError, err);
                                dest.error(err);
                            },
                            complete: function complete() {
                                hasCompleted = true;
                                cancelReset();
                                resetConnection = handleReset(reset, resetOnComplete);
                                dest.complete();
                            }
                        });
                        innerFrom_1.innerFrom(source).subscribe(connection);
                    }
                })(wrapperSource);
            };
        }
        exports2.share = share;
        function handleReset(reset, on) {
            var args = [];
            for(var _i = 2; _i < arguments.length; _i++){
                args[_i - 2] = arguments[_i];
            }
            if (on === true) {
                reset();
                return;
            }
            if (on === false) {
                return;
            }
            var onSubscriber = new Subscriber_1.SafeSubscriber({
                next: function next() {
                    onSubscriber.unsubscribe();
                    reset();
                }
            });
            return innerFrom_1.innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
        }
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/shareReplay.js
var require_shareReplay = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/shareReplay.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.shareReplay = void 0;
        var ReplaySubject_1 = require_ReplaySubject();
        var share_1 = require_share();
        function shareReplay(configOrBufferSize, windowTime, scheduler) {
            var _a, _b, _c;
            var bufferSize;
            var refCount = false;
            if (configOrBufferSize && (typeof configOrBufferSize === "undefined" ? "undefined" : _type_of(configOrBufferSize)) === "object") {
                _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
            } else {
                bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
            }
            return share_1.share({
                connector: function connector() {
                    return new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
                },
                resetOnError: true,
                resetOnComplete: false,
                resetOnRefCountZero: refCount
            });
        }
        exports2.shareReplay = shareReplay;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/single.js
var require_single = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/single.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.single = void 0;
        var EmptyError_1 = require_EmptyError();
        var SequenceError_1 = require_SequenceError();
        var NotFoundError_1 = require_NotFoundError();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function single(predicate) {
            return lift_1.operate(function(source, subscriber) {
                var hasValue = false;
                var singleValue;
                var seenValue = false;
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    seenValue = true;
                    if (!predicate || predicate(value, index++, source)) {
                        hasValue && subscriber.error(new SequenceError_1.SequenceError("Too many matching values"));
                        hasValue = true;
                        singleValue = value;
                    }
                }, function() {
                    if (hasValue) {
                        subscriber.next(singleValue);
                        subscriber.complete();
                    } else {
                        subscriber.error(seenValue ? new NotFoundError_1.NotFoundError("No matching values") : new EmptyError_1.EmptyError());
                    }
                }));
            });
        }
        exports2.single = single;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/skip.js
var require_skip = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/skip.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.skip = void 0;
        var filter_1 = require_filter();
        function skip(count) {
            return filter_1.filter(function(_, index) {
                return count <= index;
            });
        }
        exports2.skip = skip;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/skipLast.js
var require_skipLast = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/skipLast.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.skipLast = void 0;
        var identity_1 = require_identity();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function skipLast(skipCount) {
            return skipCount <= 0 ? identity_1.identity : lift_1.operate(function(source, subscriber) {
                var ring = new Array(skipCount);
                var seen = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var valueIndex = seen++;
                    if (valueIndex < skipCount) {
                        ring[valueIndex] = value;
                    } else {
                        var index = valueIndex % skipCount;
                        var oldValue = ring[index];
                        ring[index] = value;
                        subscriber.next(oldValue);
                    }
                }));
                return function() {
                    ring = null;
                };
            });
        }
        exports2.skipLast = skipLast;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/skipUntil.js
var require_skipUntil = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/skipUntil.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.skipUntil = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        var noop_1 = require_noop();
        function skipUntil(notifier) {
            return lift_1.operate(function(source, subscriber) {
                var taking = false;
                var skipSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
                    taking = true;
                }, noop_1.noop);
                innerFrom_1.innerFrom(notifier).subscribe(skipSubscriber);
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return taking && subscriber.next(value);
                }));
            });
        }
        exports2.skipUntil = skipUntil;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/skipWhile.js
var require_skipWhile = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/skipWhile.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.skipWhile = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function skipWhile(predicate) {
            return lift_1.operate(function(source, subscriber) {
                var taking = false;
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return (taking || (taking = !predicate(value, index++))) && subscriber.next(value);
                }));
            });
        }
        exports2.skipWhile = skipWhile;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/startWith.js
var require_startWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/startWith.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.startWith = void 0;
        var concat_1 = require_concat();
        var args_1 = require_args();
        var lift_1 = require_lift();
        function startWith() {
            var values = [];
            for(var _i = 0; _i < arguments.length; _i++){
                values[_i] = arguments[_i];
            }
            var scheduler = args_1.popScheduler(values);
            return lift_1.operate(function(source, subscriber) {
                (scheduler ? concat_1.concat(values, source, scheduler) : concat_1.concat(values, source)).subscribe(subscriber);
            });
        }
        exports2.startWith = startWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/switchMap.js
var require_switchMap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/switchMap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.switchMap = void 0;
        var innerFrom_1 = require_innerFrom();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function switchMap(project, resultSelector) {
            return lift_1.operate(function(source, subscriber) {
                var innerSubscriber = null;
                var index = 0;
                var isComplete = false;
                var checkComplete = function checkComplete() {
                    return isComplete && !innerSubscriber && subscriber.complete();
                };
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
                    var innerIndex = 0;
                    var outerIndex = index++;
                    innerFrom_1.innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(innerValue) {
                        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
                    }, function() {
                        innerSubscriber = null;
                        checkComplete();
                    }));
                }, function() {
                    isComplete = true;
                    checkComplete();
                }));
            });
        }
        exports2.switchMap = switchMap;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/switchAll.js
var require_switchAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/switchAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.switchAll = void 0;
        var switchMap_1 = require_switchMap();
        var identity_1 = require_identity();
        function switchAll() {
            return switchMap_1.switchMap(identity_1.identity);
        }
        exports2.switchAll = switchAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/switchMapTo.js
var require_switchMapTo = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/switchMapTo.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.switchMapTo = void 0;
        var switchMap_1 = require_switchMap();
        var isFunction_1 = require_isFunction();
        function switchMapTo(innerObservable, resultSelector) {
            return isFunction_1.isFunction(resultSelector) ? switchMap_1.switchMap(function() {
                return innerObservable;
            }, resultSelector) : switchMap_1.switchMap(function() {
                return innerObservable;
            });
        }
        exports2.switchMapTo = switchMapTo;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/switchScan.js
var require_switchScan = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/switchScan.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.switchScan = void 0;
        var switchMap_1 = require_switchMap();
        var lift_1 = require_lift();
        function switchScan(accumulator, seed) {
            return lift_1.operate(function(source, subscriber) {
                var state = seed;
                switchMap_1.switchMap(function(value, index) {
                    return accumulator(state, value, index);
                }, function(_, innerValue) {
                    return state = innerValue, innerValue;
                })(source).subscribe(subscriber);
                return function() {
                    state = null;
                };
            });
        }
        exports2.switchScan = switchScan;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/takeUntil.js
var require_takeUntil = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/takeUntil.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.takeUntil = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        var noop_1 = require_noop();
        function takeUntil(notifier) {
            return lift_1.operate(function(source, subscriber) {
                innerFrom_1.innerFrom(notifier).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    return subscriber.complete();
                }, noop_1.noop));
                !subscriber.closed && source.subscribe(subscriber);
            });
        }
        exports2.takeUntil = takeUntil;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/takeWhile.js
var require_takeWhile = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/takeWhile.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.takeWhile = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function takeWhile(predicate, inclusive) {
            if (inclusive === void 0) {
                inclusive = false;
            }
            return lift_1.operate(function(source, subscriber) {
                var index = 0;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var result = predicate(value, index++);
                    (result || inclusive) && subscriber.next(value);
                    !result && subscriber.complete();
                }));
            });
        }
        exports2.takeWhile = takeWhile;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/tap.js
var require_tap = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/tap.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.tap = void 0;
        var isFunction_1 = require_isFunction();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var identity_1 = require_identity();
        function tap(observerOrNext, error, complete) {
            var tapObserver = isFunction_1.isFunction(observerOrNext) || error || complete ? {
                next: observerOrNext,
                error: error,
                complete: complete
            } : observerOrNext;
            return tapObserver ? lift_1.operate(function(source, subscriber) {
                var _a;
                (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                var isUnsub = true;
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var _a2;
                    (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
                    subscriber.next(value);
                }, function() {
                    var _a2;
                    isUnsub = false;
                    (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
                    subscriber.complete();
                }, function(err) {
                    var _a2;
                    isUnsub = false;
                    (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
                    subscriber.error(err);
                }, function() {
                    var _a2, _b;
                    if (isUnsub) {
                        (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
                    }
                    (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
                }));
            }) : identity_1.identity;
        }
        exports2.tap = tap;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/throttle.js
var require_throttle = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/throttle.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.throttle = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        function throttle(durationSelector, config) {
            return lift_1.operate(function(source, subscriber) {
                var _a = config !== null && config !== void 0 ? config : {}, _b = _a.leading, leading = _b === void 0 ? true : _b, _c = _a.trailing, trailing = _c === void 0 ? false : _c;
                var hasValue = false;
                var sendValue = null;
                var throttled = null;
                var isComplete = false;
                var endThrottling = function endThrottling() {
                    throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
                    throttled = null;
                    if (trailing) {
                        send();
                        isComplete && subscriber.complete();
                    }
                };
                var cleanupThrottling = function cleanupThrottling() {
                    throttled = null;
                    isComplete && subscriber.complete();
                };
                var startThrottle = function startThrottle(value) {
                    return throttled = innerFrom_1.innerFrom(durationSelector(value)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling));
                };
                var send = function send() {
                    if (hasValue) {
                        hasValue = false;
                        var value = sendValue;
                        sendValue = null;
                        subscriber.next(value);
                        !isComplete && startThrottle(value);
                    }
                };
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    hasValue = true;
                    sendValue = value;
                    !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
                }, function() {
                    isComplete = true;
                    !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
                }));
            });
        }
        exports2.throttle = throttle;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/throttleTime.js
var require_throttleTime = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/throttleTime.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.throttleTime = void 0;
        var async_1 = require_async();
        var throttle_1 = require_throttle();
        var timer_1 = require_timer();
        function throttleTime(duration, scheduler, config) {
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            var duration$ = timer_1.timer(duration, scheduler);
            return throttle_1.throttle(function() {
                return duration$;
            }, config);
        }
        exports2.throttleTime = throttleTime;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/timeInterval.js
var require_timeInterval = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/timeInterval.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.TimeInterval = exports2.timeInterval = void 0;
        var async_1 = require_async();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function timeInterval(scheduler) {
            if (scheduler === void 0) {
                scheduler = async_1.asyncScheduler;
            }
            return lift_1.operate(function(source, subscriber) {
                var last = scheduler.now();
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var now = scheduler.now();
                    var interval = now - last;
                    last = now;
                    subscriber.next(new TimeInterval(value, interval));
                }));
            });
        }
        exports2.timeInterval = timeInterval;
        var TimeInterval = /* @__PURE__ */ function() {
            function TimeInterval2(value, interval) {
                this.value = value;
                this.interval = interval;
            }
            return TimeInterval2;
        }();
        exports2.TimeInterval = TimeInterval;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/timeoutWith.js
var require_timeoutWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/timeoutWith.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.timeoutWith = void 0;
        var async_1 = require_async();
        var isDate_1 = require_isDate();
        var timeout_1 = require_timeout();
        function timeoutWith(due, withObservable, scheduler) {
            var first;
            var each;
            var _with;
            scheduler = scheduler !== null && scheduler !== void 0 ? scheduler : async_1.async;
            if (isDate_1.isValidDate(due)) {
                first = due;
            } else if (typeof due === "number") {
                each = due;
            }
            if (withObservable) {
                _with = function _with() {
                    return withObservable;
                };
            } else {
                throw new TypeError("No observable provided to switch to");
            }
            if (first == null && each == null) {
                throw new TypeError("No timeout provided.");
            }
            return timeout_1.timeout({
                first: first,
                each: each,
                scheduler: scheduler,
                with: _with
            });
        }
        exports2.timeoutWith = timeoutWith;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/timestamp.js
var require_timestamp = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/timestamp.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.timestamp = void 0;
        var dateTimestampProvider_1 = require_dateTimestampProvider();
        var map_1 = require_map();
        function timestamp(timestampProvider) {
            if (timestampProvider === void 0) {
                timestampProvider = dateTimestampProvider_1.dateTimestampProvider;
            }
            return map_1.map(function(value) {
                return {
                    value: value,
                    timestamp: timestampProvider.now()
                };
            });
        }
        exports2.timestamp = timestamp;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/window.js
var require_window = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/window.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.window = void 0;
        var Subject_1 = require_Subject();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var noop_1 = require_noop();
        var innerFrom_1 = require_innerFrom();
        function window(windowBoundaries) {
            return lift_1.operate(function(source, subscriber) {
                var windowSubject = new Subject_1.Subject();
                subscriber.next(windowSubject.asObservable());
                var errorHandler = function errorHandler(err) {
                    windowSubject.error(err);
                    subscriber.error(err);
                };
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value);
                }, function() {
                    windowSubject.complete();
                    subscriber.complete();
                }, errorHandler));
                innerFrom_1.innerFrom(windowBoundaries).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                    windowSubject.complete();
                    subscriber.next(windowSubject = new Subject_1.Subject());
                }, noop_1.noop, errorHandler));
                return function() {
                    windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.unsubscribe();
                    windowSubject = null;
                };
            });
        }
        exports2.window = window;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/windowCount.js
var require_windowCount = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/windowCount.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.windowCount = void 0;
        var Subject_1 = require_Subject();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        function windowCount(windowSize, startWindowEvery) {
            if (startWindowEvery === void 0) {
                startWindowEvery = 0;
            }
            var startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
            return lift_1.operate(function(source, subscriber) {
                var windows = [
                    new Subject_1.Subject()
                ];
                var starts = [];
                var count = 0;
                subscriber.next(windows[0].asObservable());
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var e_1, _a;
                    try {
                        for(var windows_1 = __values(windows), windows_1_1 = windows_1.next(); !windows_1_1.done; windows_1_1 = windows_1.next()){
                            var window_1 = windows_1_1.value;
                            window_1.next(value);
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (windows_1_1 && !windows_1_1.done && (_a = windows_1.return)) _a.call(windows_1);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                    var c = count - windowSize + 1;
                    if (c >= 0 && c % startEvery === 0) {
                        windows.shift().complete();
                    }
                    if (++count % startEvery === 0) {
                        var window_2 = new Subject_1.Subject();
                        windows.push(window_2);
                        subscriber.next(window_2.asObservable());
                    }
                }, function() {
                    while(windows.length > 0){
                        windows.shift().complete();
                    }
                    subscriber.complete();
                }, function(err) {
                    while(windows.length > 0){
                        windows.shift().error(err);
                    }
                    subscriber.error(err);
                }, function() {
                    starts = null;
                    windows = null;
                }));
            });
        }
        exports2.windowCount = windowCount;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/windowTime.js
var require_windowTime = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/windowTime.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.windowTime = void 0;
        var Subject_1 = require_Subject();
        var async_1 = require_async();
        var Subscription_1 = require_Subscription();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var arrRemove_1 = require_arrRemove();
        var args_1 = require_args();
        var executeSchedule_1 = require_executeSchedule();
        function windowTime(windowTimeSpan) {
            var _a, _b;
            var otherArgs = [];
            for(var _i = 1; _i < arguments.length; _i++){
                otherArgs[_i - 1] = arguments[_i];
            }
            var scheduler = (_a = args_1.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1.asyncScheduler;
            var windowCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
            var maxWindowSize = otherArgs[1] || Infinity;
            return lift_1.operate(function(source, subscriber) {
                var windowRecords = [];
                var restartOnClose = false;
                var closeWindow = function closeWindow(record) {
                    var window = record.window, subs = record.subs;
                    window.complete();
                    subs.unsubscribe();
                    arrRemove_1.arrRemove(windowRecords, record);
                    restartOnClose && startWindow();
                };
                var startWindow = function startWindow() {
                    if (windowRecords) {
                        var subs = new Subscription_1.Subscription();
                        subscriber.add(subs);
                        var window_1 = new Subject_1.Subject();
                        var record_1 = {
                            window: window_1,
                            subs: subs,
                            seen: 0
                        };
                        windowRecords.push(record_1);
                        subscriber.next(window_1.asObservable());
                        executeSchedule_1.executeSchedule(subs, scheduler, function() {
                            return closeWindow(record_1);
                        }, windowTimeSpan);
                    }
                };
                if (windowCreationInterval !== null && windowCreationInterval >= 0) {
                    executeSchedule_1.executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
                } else {
                    restartOnClose = true;
                }
                startWindow();
                var loop = function loop(cb) {
                    return windowRecords.slice().forEach(cb);
                };
                var terminate = function terminate(cb) {
                    loop(function(_a2) {
                        var window = _a2.window;
                        return cb(window);
                    });
                    cb(subscriber);
                    subscriber.unsubscribe();
                };
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    loop(function(record) {
                        record.window.next(value);
                        maxWindowSize <= ++record.seen && closeWindow(record);
                    });
                }, function() {
                    return terminate(function(consumer) {
                        return consumer.complete();
                    });
                }, function(err) {
                    return terminate(function(consumer) {
                        return consumer.error(err);
                    });
                }));
                return function() {
                    windowRecords = null;
                };
            });
        }
        exports2.windowTime = windowTime;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/windowToggle.js
var require_windowToggle = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/windowToggle.js": function(exports2) {
        "use strict";
        var __values = exports2 && exports2.__values || function(o) {
            var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
            if (m) return m.call(o);
            if (o && typeof o.length === "number") return {
                next: function next() {
                    if (o && i >= o.length) o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
            throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.windowToggle = void 0;
        var Subject_1 = require_Subject();
        var Subscription_1 = require_Subscription();
        var lift_1 = require_lift();
        var innerFrom_1 = require_innerFrom();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var noop_1 = require_noop();
        var arrRemove_1 = require_arrRemove();
        function windowToggle(openings, closingSelector) {
            return lift_1.operate(function(source, subscriber) {
                var windows = [];
                var handleError = function handleError(err) {
                    while(0 < windows.length){
                        windows.shift().error(err);
                    }
                    subscriber.error(err);
                };
                innerFrom_1.innerFrom(openings).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(openValue) {
                    var window = new Subject_1.Subject();
                    windows.push(window);
                    var closingSubscription = new Subscription_1.Subscription();
                    var closeWindow = function closeWindow() {
                        arrRemove_1.arrRemove(windows, window);
                        window.complete();
                        closingSubscription.unsubscribe();
                    };
                    var closingNotifier;
                    try {
                        closingNotifier = innerFrom_1.innerFrom(closingSelector(openValue));
                    } catch (err) {
                        handleError(err);
                        return;
                    }
                    subscriber.next(window.asObservable());
                    closingSubscription.add(closingNotifier.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, closeWindow, noop_1.noop, handleError)));
                }, noop_1.noop));
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    var e_1, _a;
                    var windowsCopy = windows.slice();
                    try {
                        for(var windowsCopy_1 = __values(windowsCopy), windowsCopy_1_1 = windowsCopy_1.next(); !windowsCopy_1_1.done; windowsCopy_1_1 = windowsCopy_1.next()){
                            var window_1 = windowsCopy_1_1.value;
                            window_1.next(value);
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally{
                        try {
                            if (windowsCopy_1_1 && !windowsCopy_1_1.done && (_a = windowsCopy_1.return)) _a.call(windowsCopy_1);
                        } finally{
                            if (e_1) throw e_1.error;
                        }
                    }
                }, function() {
                    while(0 < windows.length){
                        windows.shift().complete();
                    }
                    subscriber.complete();
                }, handleError, function() {
                    while(0 < windows.length){
                        windows.shift().unsubscribe();
                    }
                }));
            });
        }
        exports2.windowToggle = windowToggle;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/windowWhen.js
var require_windowWhen = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/windowWhen.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.windowWhen = void 0;
        var Subject_1 = require_Subject();
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        function windowWhen(closingSelector) {
            return lift_1.operate(function(source, subscriber) {
                var window;
                var closingSubscriber;
                var handleError = function handleError(err) {
                    window.error(err);
                    subscriber.error(err);
                };
                var openWindow = function openWindow1() {
                    closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                    window === null || window === void 0 ? void 0 : window.complete();
                    window = new Subject_1.Subject();
                    subscriber.next(window.asObservable());
                    var closingNotifier;
                    try {
                        closingNotifier = innerFrom_1.innerFrom(closingSelector());
                    } catch (err) {
                        handleError(err);
                        return;
                    }
                    closingNotifier.subscribe(closingSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, openWindow, openWindow, handleError));
                };
                openWindow();
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    return window.next(value);
                }, function() {
                    window.complete();
                    subscriber.complete();
                }, handleError, function() {
                    closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                    window = null;
                }));
            });
        }
        exports2.windowWhen = windowWhen;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/withLatestFrom.js
var require_withLatestFrom = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/withLatestFrom.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.withLatestFrom = void 0;
        var lift_1 = require_lift();
        var OperatorSubscriber_1 = require_OperatorSubscriber();
        var innerFrom_1 = require_innerFrom();
        var identity_1 = require_identity();
        var noop_1 = require_noop();
        var args_1 = require_args();
        function withLatestFrom() {
            var inputs = [];
            for(var _i = 0; _i < arguments.length; _i++){
                inputs[_i] = arguments[_i];
            }
            var project = args_1.popResultSelector(inputs);
            return lift_1.operate(function(source, subscriber) {
                var len = inputs.length;
                var otherValues = new Array(len);
                var hasValue = inputs.map(function() {
                    return false;
                });
                var ready = false;
                var _loop_1 = function _loop_1(i2) {
                    innerFrom_1.innerFrom(inputs[i2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                        otherValues[i2] = value;
                        if (!ready && !hasValue[i2]) {
                            hasValue[i2] = true;
                            (ready = hasValue.every(identity_1.identity)) && (hasValue = null);
                        }
                    }, noop_1.noop));
                };
                for(var i = 0; i < len; i++){
                    _loop_1(i);
                }
                source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
                    if (ready) {
                        var values = __spreadArray([
                            value
                        ], __read(otherValues));
                        subscriber.next(project ? project.apply(void 0, __spreadArray([], __read(values))) : values);
                    }
                }));
            });
        }
        exports2.withLatestFrom = withLatestFrom;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/zipAll.js
var require_zipAll = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/zipAll.js": function(exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.zipAll = void 0;
        var zip_1 = require_zip();
        var joinAllInternals_1 = require_joinAllInternals();
        function zipAll(project) {
            return joinAllInternals_1.joinAllInternals(zip_1.zip, project);
        }
        exports2.zipAll = zipAll;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/zip.js
var require_zip2 = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/zip.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.zip = void 0;
        var zip_1 = require_zip();
        var lift_1 = require_lift();
        function zip() {
            var sources = [];
            for(var _i = 0; _i < arguments.length; _i++){
                sources[_i] = arguments[_i];
            }
            return lift_1.operate(function(source, subscriber) {
                zip_1.zip.apply(void 0, __spreadArray([
                    source
                ], __read(sources))).subscribe(subscriber);
            });
        }
        exports2.zip = zip;
    }
});
// node_modules/rxjs/dist/cjs/internal/operators/zipWith.js
var require_zipWith = __commonJS({
    "node_modules/rxjs/dist/cjs/internal/operators/zipWith.js": function(exports2) {
        "use strict";
        var __read = exports2 && exports2.__read || function(o, n) {
            var m = typeof Symbol === "function" && o[Symbol.iterator];
            if (!m) return o;
            var i = m.call(o), r, ar = [], e;
            try {
                while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally{
                try {
                    if (r && !r.done && (m = i["return"])) m.call(i);
                } finally{
                    if (e) throw e.error;
                }
            }
            return ar;
        };
        var __spreadArray = exports2 && exports2.__spreadArray || function(to, from) {
            for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
            return to;
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.zipWith = void 0;
        var zip_1 = require_zip2();
        function zipWith() {
            var otherInputs = [];
            for(var _i = 0; _i < arguments.length; _i++){
                otherInputs[_i] = arguments[_i];
            }
            return zip_1.zip.apply(void 0, __spreadArray([], __read(otherInputs)));
        }
        exports2.zipWith = zipWith;
    }
});
// node_modules/rxjs/dist/cjs/index.js
var require_cjs = __commonJS({
    "node_modules/rxjs/dist/cjs/index.js": function(exports2) {
        "use strict";
        var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
                enumerable: true,
                get: function get() {
                    return m[k];
                }
            });
        } : function(o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
        });
        var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
            for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
        };
        Object.defineProperty(exports2, "__esModule", {
            value: true
        });
        exports2.interval = exports2.iif = exports2.generate = exports2.fromEventPattern = exports2.fromEvent = exports2.from = exports2.forkJoin = exports2.empty = exports2.defer = exports2.connectable = exports2.concat = exports2.combineLatest = exports2.bindNodeCallback = exports2.bindCallback = exports2.UnsubscriptionError = exports2.TimeoutError = exports2.SequenceError = exports2.ObjectUnsubscribedError = exports2.NotFoundError = exports2.EmptyError = exports2.ArgumentOutOfRangeError = exports2.firstValueFrom = exports2.lastValueFrom = exports2.isObservable = exports2.identity = exports2.noop = exports2.pipe = exports2.NotificationKind = exports2.Notification = exports2.Subscriber = exports2.Subscription = exports2.Scheduler = exports2.VirtualAction = exports2.VirtualTimeScheduler = exports2.animationFrameScheduler = exports2.animationFrame = exports2.queueScheduler = exports2.queue = exports2.asyncScheduler = exports2.async = exports2.asapScheduler = exports2.asap = exports2.AsyncSubject = exports2.ReplaySubject = exports2.BehaviorSubject = exports2.Subject = exports2.animationFrames = exports2.observable = exports2.ConnectableObservable = exports2.Observable = void 0;
        exports2.filter = exports2.expand = exports2.exhaustMap = exports2.exhaustAll = exports2.exhaust = exports2.every = exports2.endWith = exports2.elementAt = exports2.distinctUntilKeyChanged = exports2.distinctUntilChanged = exports2.distinct = exports2.dematerialize = exports2.delayWhen = exports2.delay = exports2.defaultIfEmpty = exports2.debounceTime = exports2.debounce = exports2.count = exports2.connect = exports2.concatWith = exports2.concatMapTo = exports2.concatMap = exports2.concatAll = exports2.combineLatestWith = exports2.combineLatestAll = exports2.combineAll = exports2.catchError = exports2.bufferWhen = exports2.bufferToggle = exports2.bufferTime = exports2.bufferCount = exports2.buffer = exports2.auditTime = exports2.audit = exports2.config = exports2.NEVER = exports2.EMPTY = exports2.scheduled = exports2.zip = exports2.using = exports2.timer = exports2.throwError = exports2.range = exports2.race = exports2.partition = exports2.pairs = exports2.onErrorResumeNext = exports2.of = exports2.never = exports2.merge = void 0;
        exports2.switchMap = exports2.switchAll = exports2.subscribeOn = exports2.startWith = exports2.skipWhile = exports2.skipUntil = exports2.skipLast = exports2.skip = exports2.single = exports2.shareReplay = exports2.share = exports2.sequenceEqual = exports2.scan = exports2.sampleTime = exports2.sample = exports2.refCount = exports2.retryWhen = exports2.retry = exports2.repeatWhen = exports2.repeat = exports2.reduce = exports2.raceWith = exports2.publishReplay = exports2.publishLast = exports2.publishBehavior = exports2.publish = exports2.pluck = exports2.pairwise = exports2.onErrorResumeNextWith = exports2.observeOn = exports2.multicast = exports2.min = exports2.mergeWith = exports2.mergeScan = exports2.mergeMapTo = exports2.mergeMap = exports2.flatMap = exports2.mergeAll = exports2.max = exports2.materialize = exports2.mapTo = exports2.map = exports2.last = exports2.isEmpty = exports2.ignoreElements = exports2.groupBy = exports2.first = exports2.findIndex = exports2.find = exports2.finalize = void 0;
        exports2.zipWith = exports2.zipAll = exports2.withLatestFrom = exports2.windowWhen = exports2.windowToggle = exports2.windowTime = exports2.windowCount = exports2.window = exports2.toArray = exports2.timestamp = exports2.timeoutWith = exports2.timeout = exports2.timeInterval = exports2.throwIfEmpty = exports2.throttleTime = exports2.throttle = exports2.tap = exports2.takeWhile = exports2.takeUntil = exports2.takeLast = exports2.take = exports2.switchScan = exports2.switchMapTo = void 0;
        var Observable_1 = require_Observable();
        Object.defineProperty(exports2, "Observable", {
            enumerable: true,
            get: function get() {
                return Observable_1.Observable;
            }
        });
        var ConnectableObservable_1 = require_ConnectableObservable();
        Object.defineProperty(exports2, "ConnectableObservable", {
            enumerable: true,
            get: function get() {
                return ConnectableObservable_1.ConnectableObservable;
            }
        });
        var observable_1 = require_observable();
        Object.defineProperty(exports2, "observable", {
            enumerable: true,
            get: function get() {
                return observable_1.observable;
            }
        });
        var animationFrames_1 = require_animationFrames();
        Object.defineProperty(exports2, "animationFrames", {
            enumerable: true,
            get: function get() {
                return animationFrames_1.animationFrames;
            }
        });
        var Subject_1 = require_Subject();
        Object.defineProperty(exports2, "Subject", {
            enumerable: true,
            get: function get() {
                return Subject_1.Subject;
            }
        });
        var BehaviorSubject_1 = require_BehaviorSubject();
        Object.defineProperty(exports2, "BehaviorSubject", {
            enumerable: true,
            get: function get() {
                return BehaviorSubject_1.BehaviorSubject;
            }
        });
        var ReplaySubject_1 = require_ReplaySubject();
        Object.defineProperty(exports2, "ReplaySubject", {
            enumerable: true,
            get: function get() {
                return ReplaySubject_1.ReplaySubject;
            }
        });
        var AsyncSubject_1 = require_AsyncSubject();
        Object.defineProperty(exports2, "AsyncSubject", {
            enumerable: true,
            get: function get() {
                return AsyncSubject_1.AsyncSubject;
            }
        });
        var asap_1 = require_asap();
        Object.defineProperty(exports2, "asap", {
            enumerable: true,
            get: function get() {
                return asap_1.asap;
            }
        });
        Object.defineProperty(exports2, "asapScheduler", {
            enumerable: true,
            get: function get() {
                return asap_1.asapScheduler;
            }
        });
        var async_1 = require_async();
        Object.defineProperty(exports2, "async", {
            enumerable: true,
            get: function get() {
                return async_1.async;
            }
        });
        Object.defineProperty(exports2, "asyncScheduler", {
            enumerable: true,
            get: function get() {
                return async_1.asyncScheduler;
            }
        });
        var queue_1 = require_queue();
        Object.defineProperty(exports2, "queue", {
            enumerable: true,
            get: function get() {
                return queue_1.queue;
            }
        });
        Object.defineProperty(exports2, "queueScheduler", {
            enumerable: true,
            get: function get() {
                return queue_1.queueScheduler;
            }
        });
        var animationFrame_1 = require_animationFrame();
        Object.defineProperty(exports2, "animationFrame", {
            enumerable: true,
            get: function get() {
                return animationFrame_1.animationFrame;
            }
        });
        Object.defineProperty(exports2, "animationFrameScheduler", {
            enumerable: true,
            get: function get() {
                return animationFrame_1.animationFrameScheduler;
            }
        });
        var VirtualTimeScheduler_1 = require_VirtualTimeScheduler();
        Object.defineProperty(exports2, "VirtualTimeScheduler", {
            enumerable: true,
            get: function get() {
                return VirtualTimeScheduler_1.VirtualTimeScheduler;
            }
        });
        Object.defineProperty(exports2, "VirtualAction", {
            enumerable: true,
            get: function get() {
                return VirtualTimeScheduler_1.VirtualAction;
            }
        });
        var Scheduler_1 = require_Scheduler();
        Object.defineProperty(exports2, "Scheduler", {
            enumerable: true,
            get: function get() {
                return Scheduler_1.Scheduler;
            }
        });
        var Subscription_1 = require_Subscription();
        Object.defineProperty(exports2, "Subscription", {
            enumerable: true,
            get: function get() {
                return Subscription_1.Subscription;
            }
        });
        var Subscriber_1 = require_Subscriber();
        Object.defineProperty(exports2, "Subscriber", {
            enumerable: true,
            get: function get() {
                return Subscriber_1.Subscriber;
            }
        });
        var Notification_1 = require_Notification();
        Object.defineProperty(exports2, "Notification", {
            enumerable: true,
            get: function get() {
                return Notification_1.Notification;
            }
        });
        Object.defineProperty(exports2, "NotificationKind", {
            enumerable: true,
            get: function get() {
                return Notification_1.NotificationKind;
            }
        });
        var pipe_1 = require_pipe();
        Object.defineProperty(exports2, "pipe", {
            enumerable: true,
            get: function get() {
                return pipe_1.pipe;
            }
        });
        var noop_1 = require_noop();
        Object.defineProperty(exports2, "noop", {
            enumerable: true,
            get: function get() {
                return noop_1.noop;
            }
        });
        var identity_1 = require_identity();
        Object.defineProperty(exports2, "identity", {
            enumerable: true,
            get: function get() {
                return identity_1.identity;
            }
        });
        var isObservable_1 = require_isObservable();
        Object.defineProperty(exports2, "isObservable", {
            enumerable: true,
            get: function get() {
                return isObservable_1.isObservable;
            }
        });
        var lastValueFrom_1 = require_lastValueFrom();
        Object.defineProperty(exports2, "lastValueFrom", {
            enumerable: true,
            get: function get() {
                return lastValueFrom_1.lastValueFrom;
            }
        });
        var firstValueFrom_1 = require_firstValueFrom();
        Object.defineProperty(exports2, "firstValueFrom", {
            enumerable: true,
            get: function get() {
                return firstValueFrom_1.firstValueFrom;
            }
        });
        var ArgumentOutOfRangeError_1 = require_ArgumentOutOfRangeError();
        Object.defineProperty(exports2, "ArgumentOutOfRangeError", {
            enumerable: true,
            get: function get() {
                return ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
            }
        });
        var EmptyError_1 = require_EmptyError();
        Object.defineProperty(exports2, "EmptyError", {
            enumerable: true,
            get: function get() {
                return EmptyError_1.EmptyError;
            }
        });
        var NotFoundError_1 = require_NotFoundError();
        Object.defineProperty(exports2, "NotFoundError", {
            enumerable: true,
            get: function get() {
                return NotFoundError_1.NotFoundError;
            }
        });
        var ObjectUnsubscribedError_1 = require_ObjectUnsubscribedError();
        Object.defineProperty(exports2, "ObjectUnsubscribedError", {
            enumerable: true,
            get: function get() {
                return ObjectUnsubscribedError_1.ObjectUnsubscribedError;
            }
        });
        var SequenceError_1 = require_SequenceError();
        Object.defineProperty(exports2, "SequenceError", {
            enumerable: true,
            get: function get() {
                return SequenceError_1.SequenceError;
            }
        });
        var timeout_1 = require_timeout();
        Object.defineProperty(exports2, "TimeoutError", {
            enumerable: true,
            get: function get() {
                return timeout_1.TimeoutError;
            }
        });
        var UnsubscriptionError_1 = require_UnsubscriptionError();
        Object.defineProperty(exports2, "UnsubscriptionError", {
            enumerable: true,
            get: function get() {
                return UnsubscriptionError_1.UnsubscriptionError;
            }
        });
        var bindCallback_1 = require_bindCallback();
        Object.defineProperty(exports2, "bindCallback", {
            enumerable: true,
            get: function get() {
                return bindCallback_1.bindCallback;
            }
        });
        var bindNodeCallback_1 = require_bindNodeCallback();
        Object.defineProperty(exports2, "bindNodeCallback", {
            enumerable: true,
            get: function get() {
                return bindNodeCallback_1.bindNodeCallback;
            }
        });
        var combineLatest_1 = require_combineLatest();
        Object.defineProperty(exports2, "combineLatest", {
            enumerable: true,
            get: function get() {
                return combineLatest_1.combineLatest;
            }
        });
        var concat_1 = require_concat();
        Object.defineProperty(exports2, "concat", {
            enumerable: true,
            get: function get() {
                return concat_1.concat;
            }
        });
        var connectable_1 = require_connectable();
        Object.defineProperty(exports2, "connectable", {
            enumerable: true,
            get: function get() {
                return connectable_1.connectable;
            }
        });
        var defer_1 = require_defer();
        Object.defineProperty(exports2, "defer", {
            enumerable: true,
            get: function get() {
                return defer_1.defer;
            }
        });
        var empty_1 = require_empty();
        Object.defineProperty(exports2, "empty", {
            enumerable: true,
            get: function get() {
                return empty_1.empty;
            }
        });
        var forkJoin_1 = require_forkJoin();
        Object.defineProperty(exports2, "forkJoin", {
            enumerable: true,
            get: function get() {
                return forkJoin_1.forkJoin;
            }
        });
        var from_1 = require_from();
        Object.defineProperty(exports2, "from", {
            enumerable: true,
            get: function get() {
                return from_1.from;
            }
        });
        var fromEvent_1 = require_fromEvent();
        Object.defineProperty(exports2, "fromEvent", {
            enumerable: true,
            get: function get() {
                return fromEvent_1.fromEvent;
            }
        });
        var fromEventPattern_1 = require_fromEventPattern();
        Object.defineProperty(exports2, "fromEventPattern", {
            enumerable: true,
            get: function get() {
                return fromEventPattern_1.fromEventPattern;
            }
        });
        var generate_1 = require_generate();
        Object.defineProperty(exports2, "generate", {
            enumerable: true,
            get: function get() {
                return generate_1.generate;
            }
        });
        var iif_1 = require_iif();
        Object.defineProperty(exports2, "iif", {
            enumerable: true,
            get: function get() {
                return iif_1.iif;
            }
        });
        var interval_1 = require_interval();
        Object.defineProperty(exports2, "interval", {
            enumerable: true,
            get: function get() {
                return interval_1.interval;
            }
        });
        var merge_1 = require_merge();
        Object.defineProperty(exports2, "merge", {
            enumerable: true,
            get: function get() {
                return merge_1.merge;
            }
        });
        var never_1 = require_never();
        Object.defineProperty(exports2, "never", {
            enumerable: true,
            get: function get() {
                return never_1.never;
            }
        });
        var of_1 = require_of();
        Object.defineProperty(exports2, "of", {
            enumerable: true,
            get: function get() {
                return of_1.of;
            }
        });
        var onErrorResumeNext_1 = require_onErrorResumeNext();
        Object.defineProperty(exports2, "onErrorResumeNext", {
            enumerable: true,
            get: function get() {
                return onErrorResumeNext_1.onErrorResumeNext;
            }
        });
        var pairs_1 = require_pairs();
        Object.defineProperty(exports2, "pairs", {
            enumerable: true,
            get: function get() {
                return pairs_1.pairs;
            }
        });
        var partition_1 = require_partition();
        Object.defineProperty(exports2, "partition", {
            enumerable: true,
            get: function get() {
                return partition_1.partition;
            }
        });
        var race_1 = require_race();
        Object.defineProperty(exports2, "race", {
            enumerable: true,
            get: function get() {
                return race_1.race;
            }
        });
        var range_1 = require_range();
        Object.defineProperty(exports2, "range", {
            enumerable: true,
            get: function get() {
                return range_1.range;
            }
        });
        var throwError_1 = require_throwError();
        Object.defineProperty(exports2, "throwError", {
            enumerable: true,
            get: function get() {
                return throwError_1.throwError;
            }
        });
        var timer_1 = require_timer();
        Object.defineProperty(exports2, "timer", {
            enumerable: true,
            get: function get() {
                return timer_1.timer;
            }
        });
        var using_1 = require_using();
        Object.defineProperty(exports2, "using", {
            enumerable: true,
            get: function get() {
                return using_1.using;
            }
        });
        var zip_1 = require_zip();
        Object.defineProperty(exports2, "zip", {
            enumerable: true,
            get: function get() {
                return zip_1.zip;
            }
        });
        var scheduled_1 = require_scheduled();
        Object.defineProperty(exports2, "scheduled", {
            enumerable: true,
            get: function get() {
                return scheduled_1.scheduled;
            }
        });
        var empty_2 = require_empty();
        Object.defineProperty(exports2, "EMPTY", {
            enumerable: true,
            get: function get() {
                return empty_2.EMPTY;
            }
        });
        var never_2 = require_never();
        Object.defineProperty(exports2, "NEVER", {
            enumerable: true,
            get: function get() {
                return never_2.NEVER;
            }
        });
        __exportStar(require_types(), exports2);
        var config_1 = require_config();
        Object.defineProperty(exports2, "config", {
            enumerable: true,
            get: function get() {
                return config_1.config;
            }
        });
        var audit_1 = require_audit();
        Object.defineProperty(exports2, "audit", {
            enumerable: true,
            get: function get() {
                return audit_1.audit;
            }
        });
        var auditTime_1 = require_auditTime();
        Object.defineProperty(exports2, "auditTime", {
            enumerable: true,
            get: function get() {
                return auditTime_1.auditTime;
            }
        });
        var buffer_1 = require_buffer();
        Object.defineProperty(exports2, "buffer", {
            enumerable: true,
            get: function get() {
                return buffer_1.buffer;
            }
        });
        var bufferCount_1 = require_bufferCount();
        Object.defineProperty(exports2, "bufferCount", {
            enumerable: true,
            get: function get() {
                return bufferCount_1.bufferCount;
            }
        });
        var bufferTime_1 = require_bufferTime();
        Object.defineProperty(exports2, "bufferTime", {
            enumerable: true,
            get: function get() {
                return bufferTime_1.bufferTime;
            }
        });
        var bufferToggle_1 = require_bufferToggle();
        Object.defineProperty(exports2, "bufferToggle", {
            enumerable: true,
            get: function get() {
                return bufferToggle_1.bufferToggle;
            }
        });
        var bufferWhen_1 = require_bufferWhen();
        Object.defineProperty(exports2, "bufferWhen", {
            enumerable: true,
            get: function get() {
                return bufferWhen_1.bufferWhen;
            }
        });
        var catchError_1 = require_catchError();
        Object.defineProperty(exports2, "catchError", {
            enumerable: true,
            get: function get() {
                return catchError_1.catchError;
            }
        });
        var combineAll_1 = require_combineAll();
        Object.defineProperty(exports2, "combineAll", {
            enumerable: true,
            get: function get() {
                return combineAll_1.combineAll;
            }
        });
        var combineLatestAll_1 = require_combineLatestAll();
        Object.defineProperty(exports2, "combineLatestAll", {
            enumerable: true,
            get: function get() {
                return combineLatestAll_1.combineLatestAll;
            }
        });
        var combineLatestWith_1 = require_combineLatestWith();
        Object.defineProperty(exports2, "combineLatestWith", {
            enumerable: true,
            get: function get() {
                return combineLatestWith_1.combineLatestWith;
            }
        });
        var concatAll_1 = require_concatAll();
        Object.defineProperty(exports2, "concatAll", {
            enumerable: true,
            get: function get() {
                return concatAll_1.concatAll;
            }
        });
        var concatMap_1 = require_concatMap();
        Object.defineProperty(exports2, "concatMap", {
            enumerable: true,
            get: function get() {
                return concatMap_1.concatMap;
            }
        });
        var concatMapTo_1 = require_concatMapTo();
        Object.defineProperty(exports2, "concatMapTo", {
            enumerable: true,
            get: function get() {
                return concatMapTo_1.concatMapTo;
            }
        });
        var concatWith_1 = require_concatWith();
        Object.defineProperty(exports2, "concatWith", {
            enumerable: true,
            get: function get() {
                return concatWith_1.concatWith;
            }
        });
        var connect_1 = require_connect();
        Object.defineProperty(exports2, "connect", {
            enumerable: true,
            get: function get() {
                return connect_1.connect;
            }
        });
        var count_1 = require_count();
        Object.defineProperty(exports2, "count", {
            enumerable: true,
            get: function get() {
                return count_1.count;
            }
        });
        var debounce_1 = require_debounce();
        Object.defineProperty(exports2, "debounce", {
            enumerable: true,
            get: function get() {
                return debounce_1.debounce;
            }
        });
        var debounceTime_1 = require_debounceTime();
        Object.defineProperty(exports2, "debounceTime", {
            enumerable: true,
            get: function get() {
                return debounceTime_1.debounceTime;
            }
        });
        var defaultIfEmpty_1 = require_defaultIfEmpty();
        Object.defineProperty(exports2, "defaultIfEmpty", {
            enumerable: true,
            get: function get() {
                return defaultIfEmpty_1.defaultIfEmpty;
            }
        });
        var delay_1 = require_delay();
        Object.defineProperty(exports2, "delay", {
            enumerable: true,
            get: function get() {
                return delay_1.delay;
            }
        });
        var delayWhen_1 = require_delayWhen();
        Object.defineProperty(exports2, "delayWhen", {
            enumerable: true,
            get: function get() {
                return delayWhen_1.delayWhen;
            }
        });
        var dematerialize_1 = require_dematerialize();
        Object.defineProperty(exports2, "dematerialize", {
            enumerable: true,
            get: function get() {
                return dematerialize_1.dematerialize;
            }
        });
        var distinct_1 = require_distinct();
        Object.defineProperty(exports2, "distinct", {
            enumerable: true,
            get: function get() {
                return distinct_1.distinct;
            }
        });
        var distinctUntilChanged_1 = require_distinctUntilChanged();
        Object.defineProperty(exports2, "distinctUntilChanged", {
            enumerable: true,
            get: function get() {
                return distinctUntilChanged_1.distinctUntilChanged;
            }
        });
        var distinctUntilKeyChanged_1 = require_distinctUntilKeyChanged();
        Object.defineProperty(exports2, "distinctUntilKeyChanged", {
            enumerable: true,
            get: function get() {
                return distinctUntilKeyChanged_1.distinctUntilKeyChanged;
            }
        });
        var elementAt_1 = require_elementAt();
        Object.defineProperty(exports2, "elementAt", {
            enumerable: true,
            get: function get() {
                return elementAt_1.elementAt;
            }
        });
        var endWith_1 = require_endWith();
        Object.defineProperty(exports2, "endWith", {
            enumerable: true,
            get: function get() {
                return endWith_1.endWith;
            }
        });
        var every_1 = require_every();
        Object.defineProperty(exports2, "every", {
            enumerable: true,
            get: function get() {
                return every_1.every;
            }
        });
        var exhaust_1 = require_exhaust();
        Object.defineProperty(exports2, "exhaust", {
            enumerable: true,
            get: function get() {
                return exhaust_1.exhaust;
            }
        });
        var exhaustAll_1 = require_exhaustAll();
        Object.defineProperty(exports2, "exhaustAll", {
            enumerable: true,
            get: function get() {
                return exhaustAll_1.exhaustAll;
            }
        });
        var exhaustMap_1 = require_exhaustMap();
        Object.defineProperty(exports2, "exhaustMap", {
            enumerable: true,
            get: function get() {
                return exhaustMap_1.exhaustMap;
            }
        });
        var expand_1 = require_expand();
        Object.defineProperty(exports2, "expand", {
            enumerable: true,
            get: function get() {
                return expand_1.expand;
            }
        });
        var filter_1 = require_filter();
        Object.defineProperty(exports2, "filter", {
            enumerable: true,
            get: function get() {
                return filter_1.filter;
            }
        });
        var finalize_1 = require_finalize();
        Object.defineProperty(exports2, "finalize", {
            enumerable: true,
            get: function get() {
                return finalize_1.finalize;
            }
        });
        var find_1 = require_find();
        Object.defineProperty(exports2, "find", {
            enumerable: true,
            get: function get() {
                return find_1.find;
            }
        });
        var findIndex_1 = require_findIndex();
        Object.defineProperty(exports2, "findIndex", {
            enumerable: true,
            get: function get() {
                return findIndex_1.findIndex;
            }
        });
        var first_1 = require_first();
        Object.defineProperty(exports2, "first", {
            enumerable: true,
            get: function get() {
                return first_1.first;
            }
        });
        var groupBy_1 = require_groupBy();
        Object.defineProperty(exports2, "groupBy", {
            enumerable: true,
            get: function get() {
                return groupBy_1.groupBy;
            }
        });
        var ignoreElements_1 = require_ignoreElements();
        Object.defineProperty(exports2, "ignoreElements", {
            enumerable: true,
            get: function get() {
                return ignoreElements_1.ignoreElements;
            }
        });
        var isEmpty_1 = require_isEmpty();
        Object.defineProperty(exports2, "isEmpty", {
            enumerable: true,
            get: function get() {
                return isEmpty_1.isEmpty;
            }
        });
        var last_1 = require_last();
        Object.defineProperty(exports2, "last", {
            enumerable: true,
            get: function get() {
                return last_1.last;
            }
        });
        var map_1 = require_map();
        Object.defineProperty(exports2, "map", {
            enumerable: true,
            get: function get() {
                return map_1.map;
            }
        });
        var mapTo_1 = require_mapTo();
        Object.defineProperty(exports2, "mapTo", {
            enumerable: true,
            get: function get() {
                return mapTo_1.mapTo;
            }
        });
        var materialize_1 = require_materialize();
        Object.defineProperty(exports2, "materialize", {
            enumerable: true,
            get: function get() {
                return materialize_1.materialize;
            }
        });
        var max_1 = require_max();
        Object.defineProperty(exports2, "max", {
            enumerable: true,
            get: function get() {
                return max_1.max;
            }
        });
        var mergeAll_1 = require_mergeAll();
        Object.defineProperty(exports2, "mergeAll", {
            enumerable: true,
            get: function get() {
                return mergeAll_1.mergeAll;
            }
        });
        var flatMap_1 = require_flatMap();
        Object.defineProperty(exports2, "flatMap", {
            enumerable: true,
            get: function get() {
                return flatMap_1.flatMap;
            }
        });
        var mergeMap_1 = require_mergeMap();
        Object.defineProperty(exports2, "mergeMap", {
            enumerable: true,
            get: function get() {
                return mergeMap_1.mergeMap;
            }
        });
        var mergeMapTo_1 = require_mergeMapTo();
        Object.defineProperty(exports2, "mergeMapTo", {
            enumerable: true,
            get: function get() {
                return mergeMapTo_1.mergeMapTo;
            }
        });
        var mergeScan_1 = require_mergeScan();
        Object.defineProperty(exports2, "mergeScan", {
            enumerable: true,
            get: function get() {
                return mergeScan_1.mergeScan;
            }
        });
        var mergeWith_1 = require_mergeWith();
        Object.defineProperty(exports2, "mergeWith", {
            enumerable: true,
            get: function get() {
                return mergeWith_1.mergeWith;
            }
        });
        var min_1 = require_min();
        Object.defineProperty(exports2, "min", {
            enumerable: true,
            get: function get() {
                return min_1.min;
            }
        });
        var multicast_1 = require_multicast();
        Object.defineProperty(exports2, "multicast", {
            enumerable: true,
            get: function get() {
                return multicast_1.multicast;
            }
        });
        var observeOn_1 = require_observeOn();
        Object.defineProperty(exports2, "observeOn", {
            enumerable: true,
            get: function get() {
                return observeOn_1.observeOn;
            }
        });
        var onErrorResumeNextWith_1 = require_onErrorResumeNextWith();
        Object.defineProperty(exports2, "onErrorResumeNextWith", {
            enumerable: true,
            get: function get() {
                return onErrorResumeNextWith_1.onErrorResumeNextWith;
            }
        });
        var pairwise_1 = require_pairwise();
        Object.defineProperty(exports2, "pairwise", {
            enumerable: true,
            get: function get() {
                return pairwise_1.pairwise;
            }
        });
        var pluck_1 = require_pluck();
        Object.defineProperty(exports2, "pluck", {
            enumerable: true,
            get: function get() {
                return pluck_1.pluck;
            }
        });
        var publish_1 = require_publish();
        Object.defineProperty(exports2, "publish", {
            enumerable: true,
            get: function get() {
                return publish_1.publish;
            }
        });
        var publishBehavior_1 = require_publishBehavior();
        Object.defineProperty(exports2, "publishBehavior", {
            enumerable: true,
            get: function get() {
                return publishBehavior_1.publishBehavior;
            }
        });
        var publishLast_1 = require_publishLast();
        Object.defineProperty(exports2, "publishLast", {
            enumerable: true,
            get: function get() {
                return publishLast_1.publishLast;
            }
        });
        var publishReplay_1 = require_publishReplay();
        Object.defineProperty(exports2, "publishReplay", {
            enumerable: true,
            get: function get() {
                return publishReplay_1.publishReplay;
            }
        });
        var raceWith_1 = require_raceWith();
        Object.defineProperty(exports2, "raceWith", {
            enumerable: true,
            get: function get() {
                return raceWith_1.raceWith;
            }
        });
        var reduce_1 = require_reduce();
        Object.defineProperty(exports2, "reduce", {
            enumerable: true,
            get: function get() {
                return reduce_1.reduce;
            }
        });
        var repeat_1 = require_repeat();
        Object.defineProperty(exports2, "repeat", {
            enumerable: true,
            get: function get() {
                return repeat_1.repeat;
            }
        });
        var repeatWhen_1 = require_repeatWhen();
        Object.defineProperty(exports2, "repeatWhen", {
            enumerable: true,
            get: function get() {
                return repeatWhen_1.repeatWhen;
            }
        });
        var retry_1 = require_retry();
        Object.defineProperty(exports2, "retry", {
            enumerable: true,
            get: function get() {
                return retry_1.retry;
            }
        });
        var retryWhen_1 = require_retryWhen();
        Object.defineProperty(exports2, "retryWhen", {
            enumerable: true,
            get: function get() {
                return retryWhen_1.retryWhen;
            }
        });
        var refCount_1 = require_refCount();
        Object.defineProperty(exports2, "refCount", {
            enumerable: true,
            get: function get() {
                return refCount_1.refCount;
            }
        });
        var sample_1 = require_sample();
        Object.defineProperty(exports2, "sample", {
            enumerable: true,
            get: function get() {
                return sample_1.sample;
            }
        });
        var sampleTime_1 = require_sampleTime();
        Object.defineProperty(exports2, "sampleTime", {
            enumerable: true,
            get: function get() {
                return sampleTime_1.sampleTime;
            }
        });
        var scan_1 = require_scan();
        Object.defineProperty(exports2, "scan", {
            enumerable: true,
            get: function get() {
                return scan_1.scan;
            }
        });
        var sequenceEqual_1 = require_sequenceEqual();
        Object.defineProperty(exports2, "sequenceEqual", {
            enumerable: true,
            get: function get() {
                return sequenceEqual_1.sequenceEqual;
            }
        });
        var share_1 = require_share();
        Object.defineProperty(exports2, "share", {
            enumerable: true,
            get: function get() {
                return share_1.share;
            }
        });
        var shareReplay_1 = require_shareReplay();
        Object.defineProperty(exports2, "shareReplay", {
            enumerable: true,
            get: function get() {
                return shareReplay_1.shareReplay;
            }
        });
        var single_1 = require_single();
        Object.defineProperty(exports2, "single", {
            enumerable: true,
            get: function get() {
                return single_1.single;
            }
        });
        var skip_1 = require_skip();
        Object.defineProperty(exports2, "skip", {
            enumerable: true,
            get: function get() {
                return skip_1.skip;
            }
        });
        var skipLast_1 = require_skipLast();
        Object.defineProperty(exports2, "skipLast", {
            enumerable: true,
            get: function get() {
                return skipLast_1.skipLast;
            }
        });
        var skipUntil_1 = require_skipUntil();
        Object.defineProperty(exports2, "skipUntil", {
            enumerable: true,
            get: function get() {
                return skipUntil_1.skipUntil;
            }
        });
        var skipWhile_1 = require_skipWhile();
        Object.defineProperty(exports2, "skipWhile", {
            enumerable: true,
            get: function get() {
                return skipWhile_1.skipWhile;
            }
        });
        var startWith_1 = require_startWith();
        Object.defineProperty(exports2, "startWith", {
            enumerable: true,
            get: function get() {
                return startWith_1.startWith;
            }
        });
        var subscribeOn_1 = require_subscribeOn();
        Object.defineProperty(exports2, "subscribeOn", {
            enumerable: true,
            get: function get() {
                return subscribeOn_1.subscribeOn;
            }
        });
        var switchAll_1 = require_switchAll();
        Object.defineProperty(exports2, "switchAll", {
            enumerable: true,
            get: function get() {
                return switchAll_1.switchAll;
            }
        });
        var switchMap_1 = require_switchMap();
        Object.defineProperty(exports2, "switchMap", {
            enumerable: true,
            get: function get() {
                return switchMap_1.switchMap;
            }
        });
        var switchMapTo_1 = require_switchMapTo();
        Object.defineProperty(exports2, "switchMapTo", {
            enumerable: true,
            get: function get() {
                return switchMapTo_1.switchMapTo;
            }
        });
        var switchScan_1 = require_switchScan();
        Object.defineProperty(exports2, "switchScan", {
            enumerable: true,
            get: function get() {
                return switchScan_1.switchScan;
            }
        });
        var take_1 = require_take();
        Object.defineProperty(exports2, "take", {
            enumerable: true,
            get: function get() {
                return take_1.take;
            }
        });
        var takeLast_1 = require_takeLast();
        Object.defineProperty(exports2, "takeLast", {
            enumerable: true,
            get: function get() {
                return takeLast_1.takeLast;
            }
        });
        var takeUntil_1 = require_takeUntil();
        Object.defineProperty(exports2, "takeUntil", {
            enumerable: true,
            get: function get() {
                return takeUntil_1.takeUntil;
            }
        });
        var takeWhile_1 = require_takeWhile();
        Object.defineProperty(exports2, "takeWhile", {
            enumerable: true,
            get: function get() {
                return takeWhile_1.takeWhile;
            }
        });
        var tap_1 = require_tap();
        Object.defineProperty(exports2, "tap", {
            enumerable: true,
            get: function get() {
                return tap_1.tap;
            }
        });
        var throttle_1 = require_throttle();
        Object.defineProperty(exports2, "throttle", {
            enumerable: true,
            get: function get() {
                return throttle_1.throttle;
            }
        });
        var throttleTime_1 = require_throttleTime();
        Object.defineProperty(exports2, "throttleTime", {
            enumerable: true,
            get: function get() {
                return throttleTime_1.throttleTime;
            }
        });
        var throwIfEmpty_1 = require_throwIfEmpty();
        Object.defineProperty(exports2, "throwIfEmpty", {
            enumerable: true,
            get: function get() {
                return throwIfEmpty_1.throwIfEmpty;
            }
        });
        var timeInterval_1 = require_timeInterval();
        Object.defineProperty(exports2, "timeInterval", {
            enumerable: true,
            get: function get() {
                return timeInterval_1.timeInterval;
            }
        });
        var timeout_2 = require_timeout();
        Object.defineProperty(exports2, "timeout", {
            enumerable: true,
            get: function get() {
                return timeout_2.timeout;
            }
        });
        var timeoutWith_1 = require_timeoutWith();
        Object.defineProperty(exports2, "timeoutWith", {
            enumerable: true,
            get: function get() {
                return timeoutWith_1.timeoutWith;
            }
        });
        var timestamp_1 = require_timestamp();
        Object.defineProperty(exports2, "timestamp", {
            enumerable: true,
            get: function get() {
                return timestamp_1.timestamp;
            }
        });
        var toArray_1 = require_toArray();
        Object.defineProperty(exports2, "toArray", {
            enumerable: true,
            get: function get() {
                return toArray_1.toArray;
            }
        });
        var window_1 = require_window();
        Object.defineProperty(exports2, "window", {
            enumerable: true,
            get: function get() {
                return window_1.window;
            }
        });
        var windowCount_1 = require_windowCount();
        Object.defineProperty(exports2, "windowCount", {
            enumerable: true,
            get: function get() {
                return windowCount_1.windowCount;
            }
        });
        var windowTime_1 = require_windowTime();
        Object.defineProperty(exports2, "windowTime", {
            enumerable: true,
            get: function get() {
                return windowTime_1.windowTime;
            }
        });
        var windowToggle_1 = require_windowToggle();
        Object.defineProperty(exports2, "windowToggle", {
            enumerable: true,
            get: function get() {
                return windowToggle_1.windowToggle;
            }
        });
        var windowWhen_1 = require_windowWhen();
        Object.defineProperty(exports2, "windowWhen", {
            enumerable: true,
            get: function get() {
                return windowWhen_1.windowWhen;
            }
        });
        var withLatestFrom_1 = require_withLatestFrom();
        Object.defineProperty(exports2, "withLatestFrom", {
            enumerable: true,
            get: function get() {
                return withLatestFrom_1.withLatestFrom;
            }
        });
        var zipAll_1 = require_zipAll();
        Object.defineProperty(exports2, "zipAll", {
            enumerable: true,
            get: function get() {
                return zipAll_1.zipAll;
            }
        });
        var zipWith_1 = require_zipWith();
        Object.defineProperty(exports2, "zipWith", {
            enumerable: true,
            get: function get() {
                return zipWith_1.zipWith;
            }
        });
    }
});
// src/entries/vines/vines-push.ts
var vines_push_exports = {};
__export(vines_push_exports, {
    default: function() {
        return vines_push_default;
    }
});
module.exports = __toCommonJS(vines_push_exports);
var import_rxjs = __toESM(require_cjs());
var last_event_id = 0;
var pull_stream$ = new import_rxjs.Subject();
function vines_push_default(e) {
    $app.runInTransaction(function(tx) {
        var change_rows = e.requestInfo().body.change_rows;
        var conflicts = [];
        var event = {
            id: last_event_id++,
            documents: [],
            checkpoint: null
        };
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = change_rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var change_row = _step.value;
                var vines_collection = tx.findCollectionByNameOrId("vines");
                var real_master_state = null;
                var new_record = false;
                try {
                    var _e_auth, _change_row_newDocumentState;
                    real_master_state = tx.findFirstRecordByFilter(vines_collection, "user = {:user} && id = {:id}", {
                        user: (_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id,
                        id: (_change_row_newDocumentState = change_row.newDocumentState) === null || _change_row_newDocumentState === void 0 ? void 0 : _change_row_newDocumentState.id
                    });
                } catch (err) {
                    if (err.toString() == "GoError: sql: no rows in result set") {
                        real_master_state = new Record(vines_collection, {
                            id: $security.randomStringByRegex("[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"),
                            created_at: /* @__PURE__ */ new Date().toISOString(),
                            updated_at: /* @__PURE__ */ new Date().toISOString()
                        });
                        new_record = true;
                    }
                }
                if (!new_record) {
                    if (real_master_state && !change_row.assumedMasterState || real_master_state && change_row.assumedMasterState && /*
         * For simplicity we detect conflicts on the server by only compare the updateAt value.
         * In reality you might want to do a more complex check or do a deep-equal comparison.
         */ new Date(real_master_state.get("updated_at")).toISOString() !== change_row.assumedMasterState.updated_at) {
                        conflicts.push(real_master_state);
                    } else {
                        var _change_row_newDocumentState1;
                        try {
                            var _e_auth1, _change_row_newDocumentState2;
                            real_master_state.load(_object_spread_props(_object_spread({}, change_row.newDocumentState), {
                                user: (_e_auth1 = e.auth) === null || _e_auth1 === void 0 ? void 0 : _e_auth1.id,
                                parent: (_change_row_newDocumentState2 = change_row.newDocumentState) === null || _change_row_newDocumentState2 === void 0 ? void 0 : _change_row_newDocumentState2.parent_id
                            }));
                            tx.save(real_master_state);
                        } catch (err) {
                            console.log(err.toString());
                            throw err;
                        }
                        event.documents.push(change_row.newDocumentState);
                        event.checkpoint = {
                            id: (_change_row_newDocumentState1 = change_row.newDocumentState) === null || _change_row_newDocumentState1 === void 0 ? void 0 : _change_row_newDocumentState1.id,
                            updated_at: change_row.newDocumentState.updated_at
                        };
                    }
                } else {
                    var _change_row_newDocumentState3;
                    try {
                        var _e_auth2, _change_row_newDocumentState4;
                        real_master_state.load(_object_spread_props(_object_spread({}, change_row.newDocumentState), {
                            user: (_e_auth2 = e.auth) === null || _e_auth2 === void 0 ? void 0 : _e_auth2.id,
                            parent: (_change_row_newDocumentState4 = change_row.newDocumentState) === null || _change_row_newDocumentState4 === void 0 ? void 0 : _change_row_newDocumentState4.parent_id
                        }));
                        tx.save(real_master_state);
                    } catch (err) {
                        if (err.toString() == "GoError: parent: Failed to find all relation records with the provided ids.") {}
                        throw err;
                    }
                    event.documents.push(change_row.newDocumentState);
                    event.checkpoint = {
                        id: (_change_row_newDocumentState3 = change_row.newDocumentState) === null || _change_row_newDocumentState3 === void 0 ? void 0 : _change_row_newDocumentState3.id,
                        updated_at: change_row.newDocumentState.updated_at
                    };
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        if (event.documents.length > 0) {
            var _e_auth3;
            var message = new SubscriptionMessage({
                name: ((_e_auth3 = e.auth) === null || _e_auth3 === void 0 ? void 0 : _e_auth3.id) + "_vines",
                data: JSON.stringify({
                    event: event
                })
            });
            var clients = $app.subscriptionsBroker().clients();
            for(var clientId in clients){
                var _e_auth4;
                if (clients[clientId].hasSubscription(((_e_auth4 = e.auth) === null || _e_auth4 === void 0 ? void 0 : _e_auth4.id) + "_vines")) {
                    clients[clientId].send(message);
                }
            }
        }
        e.response.header().set("Content-Type", "application/json");
        return e.json(200, conflicts);
    });
}
