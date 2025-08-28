"use strict";
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
// src/entries/constants.ts
var constants_exports = {};
__export(constants_exports, {
    __KAIROS_VERSION__: function() {
        return __KAIROS_VERSION__;
    }
});
module.exports = __toCommonJS(constants_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    __KAIROS_VERSION__: __KAIROS_VERSION__
});
