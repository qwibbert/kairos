"use strict";
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function wrapNativeSuper(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/entries/history/errors.ts
var errors_exports = {};
__export(errors_exports, {
    HistorySyncError: function() {
        return HistorySyncError;
    },
    HistorySyncErrorFactory: function() {
        return HistorySyncErrorFactory;
    },
    HistorySyncErrorType: function() {
        return HistorySyncErrorType;
    },
    history_sync_error_map: function() {
        return history_sync_error_map;
    }
});
module.exports = __toCommonJS(errors_exports);
// src/entries/errors.ts
var ErrorBase = /*#__PURE__*/ function(Error1) {
    _inherits(ErrorBase, Error1);
    function ErrorBase(param) {
        var name = param.name, message = param.message, context = param.context;
        _class_call_check(this, ErrorBase);
        var _this;
        _this = _call_super(this, ErrorBase);
        _this.name = name;
        _this.message = message;
        _this.context = context;
        return _this;
    }
    return ErrorBase;
}(_wrap_native_super(Error));
// src/entries/history/errors.ts
var HistorySyncErrorType = /* @__PURE__ */ function(HistorySyncErrorType2) {
    HistorySyncErrorType2["PARENT_REL"] = "PARENT_REL";
    HistorySyncErrorType2["COURSE_REL"] = "COURSE_REL";
    HistorySyncErrorType2["OTHER"] = "OTHER";
    return HistorySyncErrorType2;
}(HistorySyncErrorType || {});
var history_sync_error_map = /* @__PURE__ */ new Map([
    [
        "PARENT_REL" /* PARENT_REL */ ,
        "The parent relation was not found in the upstream database."
    ],
    [
        "COURSE_REL" /* COURSE_REL */ ,
        "The course relation was not found in the upstream database."
    ],
    [
        "OTHER" /* OTHER */ ,
        "An unexpected error occurred"
    ]
]);
var HistorySyncError = /*#__PURE__*/ function(ErrorBase) {
    _inherits(HistorySyncError, ErrorBase);
    function HistorySyncError() {
        _class_call_check(this, HistorySyncError);
        return _call_super(this, HistorySyncError, arguments);
    }
    return HistorySyncError;
}(ErrorBase);
var HistorySyncErrorFactory = /*#__PURE__*/ function() {
    function HistorySyncErrorFactory() {
        _class_call_check(this, HistorySyncErrorFactory);
    }
    _create_class(HistorySyncErrorFactory, null, [
        {
            key: "parent_rel",
            value: function parent_rel(operation, entity_id, additional_data) {
                return new HistorySyncError({
                    name: "PARENT_REL" /* PARENT_REL */ ,
                    message: "".concat(history_sync_error_map.get("PARENT_REL" /* PARENT_REL */ )),
                    context: {
                        operation: operation,
                        entity_id: entity_id,
                        timestamp: /* @__PURE__ */ new Date(),
                        additional_data: additional_data
                    }
                });
            }
        },
        {
            key: "course_rel",
            value: function course_rel(operation, entity_id, additional_data) {
                return new HistorySyncError({
                    name: "COURSE_REL" /* COURSE_REL */ ,
                    message: "".concat(history_sync_error_map.get("COURSE_REL" /* COURSE_REL */ )),
                    context: {
                        operation: operation,
                        entity_id: entity_id,
                        timestamp: /* @__PURE__ */ new Date(),
                        additional_data: additional_data
                    }
                });
            }
        },
        {
            key: "other",
            value: function other(operation, entity_id, additional_data) {
                return new HistorySyncError({
                    name: "OTHER" /* OTHER */ ,
                    message: "".concat(history_sync_error_map.get("OTHER" /* OTHER */ )),
                    context: {
                        operation: operation,
                        entity_id: entity_id,
                        timestamp: /* @__PURE__ */ new Date(),
                        additional_data: additional_data
                    }
                });
            }
        }
    ]);
    return HistorySyncErrorFactory;
}();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    HistorySyncError: HistorySyncError,
    HistorySyncErrorFactory: HistorySyncErrorFactory,
    HistorySyncErrorType: HistorySyncErrorType,
    history_sync_error_map: history_sync_error_map
});
