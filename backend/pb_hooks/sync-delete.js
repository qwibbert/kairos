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
// src/entries/sync-delete.ts
var sync_delete_exports = {};
__export(sync_delete_exports, {
    default: function() {
        return sync_delete_default;
    }
});
module.exports = __toCommonJS(sync_delete_exports);
var sync_delete_default = function(e) {
    var _e_auth;
    var user = (_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id;
    var user_clients = $app.findRecordsByFilter($app.findCollectionByNameOrId("sync_clients"), "user = '".concat(user, "'"), "", 0, 0);
    var clients = $app.subscriptionsBroker().clients();
    try {
        var _loop = function(clientId) {
            if (user_clients.some(function(c) {
                return (c === null || c === void 0 ? void 0 : c.id) == clientId;
            })) {
                clients[clientId].discard();
            }
        };
        for(var clientId in clients)_loop(clientId);
    } catch (err) {
        return e.json(500, {
            type: "error",
            error_type: "OTHER",
            message: "Something went wrong during client discarding: " + toString(e),
            fatal: false
        });
    }
    $app.runInTransaction(function(txApp) {
        var history_entries_collection = txApp.findCollectionByNameOrId("history_entries");
        var history_entries = txApp.findRecordsByFilter(history_entries_collection, "user = '".concat(user, "'"), "", 0, 0);
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = history_entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var record = _step.value;
                if (record) {
                    $app.delete(record);
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
        var vines_collection = txApp.findCollectionByNameOrId("vines");
        var vines = txApp.findRecordsByFilter(vines_collection, "user = '".concat(user, "'"), "", 0, 0);
        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
        try {
            for(var _iterator1 = vines[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                var record1 = _step1.value;
                if (record1) {
                    $app.delete(record1);
                }
            }
        } catch (err) {
            _didIteratorError1 = true;
            _iteratorError1 = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                    _iterator1.return();
                }
            } finally{
                if (_didIteratorError1) {
                    throw _iteratorError1;
                }
            }
        }
        var sync_changes_collection = txApp.findCollectionByNameOrId("sync_changes");
        var sync_changes = txApp.findRecordsByFilter(sync_changes_collection, "user = '".concat(user, "'"), "", 0, 0);
        var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
        try {
            for(var _iterator2 = sync_changes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                var record2 = _step2.value;
                if (record2) {
                    $app.delete(record2);
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                }
            } finally{
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
        var sync_revisions_collection = txApp.findCollectionByNameOrId("sync_revisions");
        var sync_revision_record = txApp.findFirstRecordByFilter(sync_revisions_collection, "user =  '".concat(user, "'"));
        if (sync_revision_record) {
            sync_revision_record.set("revision", 0);
            $app.save(sync_revision_record);
        }
    });
};
