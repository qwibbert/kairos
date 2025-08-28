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
// src/entries/vines/pull.ts
var pull_exports = {};
__export(pull_exports, {
    default: function() {
        return pull_default;
    }
});
module.exports = __toCommonJS(pull_exports);
// package.json
var package_default = {
    name: "kairos-backend",
    version: "0.0.1",
    main: "index.js",
    license: "MIT",
    scripts: {
        build: "tsup './src/entries/**' -d ./pb_hooks",
        dev: "chokidar './src/entries/**' -c 'bun run build' --initial"
    },
    dependencies: {
        "@swc/core": "^1.13.3",
        "chokidar-cli": "^3.0.0",
        rxdb: "^16.17.2",
        tsup: "^8.5.0",
        typescript: "^5.9.2"
    }
};
// src/entries/constants.ts
var __KAIROS_VERSION__ = package_default.version;
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
var history_sync_error_map = /* @__PURE__ */ new Map([
    [
        "VERSION" /* VERSION */ ,
        "Client is outdated or didn't send a version header."
    ],
    [
        "OTHER" /* OTHER */ ,
        "An unexpected error occurred"
    ]
]);
var ServerError = /*#__PURE__*/ function(ErrorBase) {
    _inherits(ServerError, ErrorBase);
    function ServerError() {
        _class_call_check(this, ServerError);
        return _call_super(this, ServerError, arguments);
    }
    return ServerError;
}(ErrorBase);
var ServerErrorFactory = /*#__PURE__*/ function() {
    function ServerErrorFactory() {
        _class_call_check(this, ServerErrorFactory);
    }
    _create_class(ServerErrorFactory, null, [
        {
            key: "version",
            value: function version(operation, entity_id, additional_data) {
                return new ServerError({
                    name: "VERSION" /* VERSION */ ,
                    message: "".concat(history_sync_error_map.get("VERSION" /* VERSION */ )),
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
                return new ServerError({
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
    return ServerErrorFactory;
}();
// src/entries/vines/pull.ts
function pull_default(e) {
    var _e_request, _e_auth, _documents_, _documents_1;
    var body = e.requestInfo().query;
    var id = body.id;
    var updated_at = new Date(parseInt(body.updated_at, 10)).toISOString().replace("T", " ");
    var version = (_e_request = e.request) === null || _e_request === void 0 ? void 0 : _e_request.header.get("Version");
    if (!version || version != __KAIROS_VERSION__) {
        return e.json(426, ServerErrorFactory.version("vines.pull", id, {
            request_version: version,
            server_version: __KAIROS_VERSION__
        }));
    }
    var documents = $app.findRecordsByFilter("vines", "user = {:user} && (updated_at > {:updated_at} || (updated_at = {:updated_at} && id != {:id}))", "+updated_at, +id", parseInt(body.batch_size, 10), 0, {
        user: (_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id,
        updated_at: updated_at,
        id: id
    });
    documents = documents.map(function(r) {
        var copy = r === null || r === void 0 ? void 0 : r.fieldsData();
        if (copy) {
            delete copy.user;
            copy.parent_id = copy.parent;
            delete copy.parent;
            copy.course_id = copy.course;
            delete copy.course;
        }
        ;
        return copy;
    });
    var new_checkpoint = documents.length === 0 ? {
        id: id,
        updated_at: updated_at
    } : {
        id: (_documents_ = documents[documents.length - 1]) === null || _documents_ === void 0 ? void 0 : _documents_.id,
        updated_at: (_documents_1 = documents[documents.length - 1]) === null || _documents_1 === void 0 ? void 0 : _documents_1.updated_at
    };
    e.response.header().set("Content-Type", "application/json");
    e.json(200, {
        documents: documents,
        checkpoint: new_checkpoint
    });
}
