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
// src/entries/settings/settings-pull.ts
var settings_pull_exports = {};
__export(settings_pull_exports, {
    default: function() {
        return settings_pull_default;
    }
});
module.exports = __toCommonJS(settings_pull_exports);
var import_rxdb = require("rxdb");
function settings_pull_default(e) {
    var _e_auth, _this, _this1;
    var body = e.requestInfo().body;
    var id = body.id;
    var updated_at = parseFloat(body.updated_at);
    var documents = arrayOf(new Record());
    $app.db().select("*").from("settings").where($dbx.exp("user = {:user}", {
        user: (_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id
    })).andWhere($dbx.or($dbx.exp("updated > {:updated_at}", {
        updated_at: updated_at
    }), $dbx.and($dbx.exp("updated = {:updated_at}", {
        updated_at: updated_at
    }), $dbx.exp("id = {:id}", {
        id: id
    })))).limit(parseInt(body.batch_size, 10)).orderBy("updated ASC", "id ASC").all(documents);
    var new_checkpoint = documents.length === 0 ? {
        id: id,
        updated_at: updated_at
    } : {
        id: (_this = (0, import_rxdb.lastOfArray)(documents)) === null || _this === void 0 ? void 0 : _this.get("id"),
        updated_at: (_this1 = (0, import_rxdb.lastOfArray)(documents)) === null || _this1 === void 0 ? void 0 : _this1.get("updated_at")
    };
    e.response.header().set("Content-Type", "application/json");
    e.json(200, {
        documents: documents,
        checkpoint: new_checkpoint
    });
}
