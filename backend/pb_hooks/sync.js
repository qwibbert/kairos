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
        } catch (err1) {
            _didIteratorError = true;
            _iteratorError = err1;
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
// src/entries/sync.ts
var sync_exports = {};
__export(sync_exports, {
    default: function() {
        return sync_default;
    }
});
module.exports = __toCommonJS(sync_exports);
// src/entries/utils.ts
function reduceChanges(changes) {
    return changes.reduce(function(set, nextChange) {
        var id = nextChange.table + ":" + nextChange.key;
        var prevChange = set[id];
        if (!prevChange) {
            set[id] = nextChange;
        } else {
            set[id] = function() {
                switch(prevChange.type){
                    case "CREATE":
                        switch(nextChange.type){
                            case "CREATE":
                                return nextChange;
                            // Another CREATE replaces previous CREATE.
                            case "UPDATE":
                                return combineCreateAndUpdate(prevChange, nextChange);
                            // Apply nextChange.mods into prevChange.obj
                            case "DELETE":
                                return nextChange;
                        }
                        break;
                    case "UPDATE":
                        switch(nextChange.type){
                            case "CREATE":
                                return nextChange;
                            // Another CREATE replaces previous update.
                            case "UPDATE":
                                return combineUpdateAndUpdate(prevChange, nextChange);
                            // Add the additional modifications to existing modification set.
                            case "DELETE":
                                return nextChange;
                        }
                        break;
                    case "DELETE":
                        switch(nextChange.type){
                            case "CREATE":
                                return nextChange;
                            // A resurection occurred. Only create change is of interest.
                            case "UPDATE":
                                return prevChange;
                            // Nothing to do. We cannot update an object that doesnt exist. Leave the delete change there.
                            case "DELETE":
                                return prevChange;
                        }
                        break;
                }
            }();
        }
        return set;
    }, {});
}
function resolveConflicts(clientChanges, serverChangeSet) {
    var resolved = [];
    clientChanges.forEach(function(clientChange) {
        var id = clientChange.table + ":" + clientChange.key;
        var serverChange = serverChangeSet[id];
        if (!serverChange) {
            resolved.push(clientChange);
        } else if (serverChange.type == UPDATE) {
            switch(clientChange.type){
                case 1:
                    applyModifications(clientChange.obj, serverChange.mods);
                    resolved.push(clientChange);
                    break;
                case 2:
                    Object.keys(serverChange.mods).forEach(function(keyPath) {
                        delete clientChange.mods[keyPath];
                        Object.keys(clientChange.mods).forEach(function(clientKeyPath) {
                            if (clientKeyPath.indexOf(keyPath + ".") == 0) {
                                delete clientChange.mods[clientKeyPath];
                            }
                        });
                    });
                    if (Object.keys(clientChange.mods).length > 0) {
                        resolved.push(clientChange);
                    }
                    break;
                case 3:
                    resolved.push(clientChange);
                    break;
            }
        }
    });
    return resolved;
}
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function applyModifications(obj, modifications) {
    Object.keys(modifications).forEach(function(keyPath) {
        setByKeyPath(obj, keyPath, modifications[keyPath]);
    });
    return obj;
}
function combineCreateAndUpdate(prevChange, nextChange) {
    var clonedChange = deepClone(prevChange);
    applyModifications(clonedChange.obj, nextChange.mods);
    return clonedChange;
}
function combineUpdateAndUpdate(prevChange, nextChange) {
    var clonedChange = deepClone(prevChange);
    Object.keys(nextChange.mods).forEach(function(keyPath) {
        var hadParentPath = false;
        Object.keys(prevChange.mods).filter(function(parentPath) {
            return keyPath.indexOf(parentPath + ".") === 0;
        }).forEach(function(parentPath) {
            setByKeyPath(clonedChange.mods[parentPath], keyPath.substr(parentPath.length + 1), nextChange.mods[keyPath]);
            hadParentPath = true;
        });
        if (!hadParentPath) {
            clonedChange.mods[keyPath] = nextChange.mods[keyPath];
        }
        Object.keys(prevChange.mods).filter(function(subPath) {
            return subPath.indexOf(keyPath + ".") === 0;
        }).forEach(function(subPath) {
            delete clonedChange.mods[subPath];
        });
    });
    return clonedChange;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || typeof keyPath !== "string") return;
    var period = keyPath.indexOf(".");
    if (period !== -1) {
        var currentKeyPath = keyPath.substr(0, period);
        var remainingKeyPath = keyPath.substr(period + 1);
        if (remainingKeyPath === "") obj[currentKeyPath] = value;
        else {
            var innerObj = obj[currentKeyPath];
            if (!innerObj) innerObj = obj[currentKeyPath] = {};
            setByKeyPath(innerObj, remainingKeyPath, value);
        }
    } else {
        obj[keyPath] = value;
    }
}
// src/entries/sync.ts
function sendAnyChanges(client, synced_rev, user_id, client_id) {
    var changes = [];
    try {
        changes = $app.findRecordsByFilter($app.findCollectionByNameOrId("sync_changes"), "revision > {:synced_rev} && source != {:client_id} && source.user = {:user_id}", "", 0, 0, {
            synced_rev: synced_rev,
            client_id: client_id,
            user_id: user_id
        });
    } catch (e) {
        throw {
            type: "error",
            error_type: "OTHER",
            message: "Something went wrong during sync_changes fetching: " + toString(e),
            fatal: false
        };
    }
    var preprocessed_changes = preprocess_server_changes(changes);
    var reduced_set = reduceChanges(preprocessed_changes);
    var reduced_array = Object.keys(reduced_set).map(function(key) {
        return reduced_set[key];
    });
    var current_revision = 0;
    var collection = void 0;
    var revision = void 0;
    try {
        collection = $app.findCollectionByNameOrId("sync_revisions");
        revision = $app.findRecordsByFilter(collection, "user = '".concat(user_id, "'"), "", 0, 0);
    } catch (e) {
        throw {
            type: "error",
            error_type: "OTHER",
            message: "Something went wrong during revision fetching: " + toString(e),
            fatal: false
        };
    }
    if (revision.length == 0) {
        var revision_record = new Record(collection);
        revision_record.set("user", user_id);
        revision_record.set("revision", 0);
        $app.save(revision_record);
    } else {
        current_revision = revision[0].get("revision");
    }
    var message = new SubscriptionMessage({
        name: client_id,
        data: JSON.stringify({
            type: "changes",
            changes: reduced_array,
            current_revision: current_revision,
            partial: false
        })
    });
    client.send(message);
    return current_revision;
}
var sync_default = function(e) {
    var client_id = null;
    var body = e.requestInfo().body;
    var synced_revision = 0;
    var clients = $app.subscriptionsBroker().clients();
    var client = void 0;
    try {
        for(var clientId in clients){
            if (clients[clientId].hasSubscription(body.client_id)) {
                client = clients[clientId];
            }
        }
    } catch (err2) {
        return e.json(500, {
            type: "error",
            error_type: "OTHER",
            message: "Something went wrong during client subscription checking: " + toString(e),
            fatal: false
        });
    }
    if (body.type == "CLIENT_ID") {
        if (body.client_id) {
            try {
                var _e_auth;
                var record = $app.findRecordById($app.findCollectionByNameOrId("sync_clients"), body.client_id);
                if (record.get("user") != ((_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id)) {
                    throw void 0;
                }
                return e.json(200, {
                    type: "client_id",
                    client_id: body.client_id
                });
            } catch (e1) {
                return e.json(401, {
                    type: "error",
                    error_type: "INVALID_CLIENT_ID",
                    message: "Invalid client_id.",
                    fatal: false
                });
            }
        } else {
            try {
                var _e_auth1;
                client_id = $security.randomStringByRegex("[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}");
                var collection = $app.findCollectionByNameOrId("sync_clients");
                var record1 = new Record(collection);
                record1.set("id", client_id);
                record1.set("user", (_e_auth1 = e.auth) === null || _e_auth1 === void 0 ? void 0 : _e_auth1.id);
                $app.save(record1);
                return e.json(200, {
                    type: "client_id",
                    client_id: client_id
                });
            } catch (err2) {
                return e.json(401, {
                    type: "error",
                    error_type: "CLIENT_ID_GEN",
                    message: "Failed to generate a new client id.",
                    fatal: false
                });
            }
        }
    } else if (body.type == "SUBSCRIBE") {
        synced_revision = body.synced_revision || 0;
        try {
            var _e_auth2;
            synced_revision = sendAnyChanges(client, synced_revision, (_e_auth2 = e.auth) === null || _e_auth2 === void 0 ? void 0 : _e_auth2.id, body.client_id);
            client.set("subscribed", true);
            client.set("revision", synced_revision);
        } catch (err2) {
            return e.json(500, err2);
        }
        return e.json(200, {
            type: "subscribe"
        });
    } else if (body.type == "CHANGES") {
        if (!client) {
            return e.json(400, {
                type: "error",
                error_type: "CLIENT_NOT_SUBSCRIBED",
                message: "Client is not subscribed to channel. Messages can't come through.",
                fatal: false
            });
        }
        var request_id = body.request_id;
        try {
            if (!_instanceof(body.changes, Array)) {
                return e.json(400, {
                    type: "error",
                    error_type: "INVALID_PROPS",
                    message: "Property 'changes' must be provided and must be an array",
                    fatal: false
                });
            }
            var changes = preprocess_client_changes(body.changes);
            if (body.partial) {
                var collection1 = $app.findCollectionByNameOrId("sync_uncommitted");
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = changes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var change = _step.value;
                        var change_record = new Record(collection1);
                        change_record.set("sync_client", body.client_id);
                        change_record.set("collection", change.table == "history" ? "history_entries" : change.table == "settings" ? "settings" : change.table == "vines" ? "vines" : "");
                        change_record.set("key", change.key);
                        if (change.type == "CREATE" /* Create */ ) {
                            change_record.set("type", "CREATE");
                            change_record.set("obj", change.obj);
                        } else if (change.type == "UPDATE" /* Update */ ) {
                            change_record.set("type", "UPDATE");
                            change_record.set("mods", change.mods);
                        } else if (change.type == "DELETE" /* Delete */ ) {
                            change_record.set("type", "DELETE");
                        }
                        $app.save(change_record);
                    }
                } catch (err1) {
                    _didIteratorError = true;
                    _iteratorError = err1;
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
            } else {
                var uncommitted_changes = [];
                try {
                    uncommitted_changes = $app.findRecordsByFilter($app.findCollectionByNameOrId("sync_uncommitted"), "sync_client = {:client_id}", "", 0, 0, {
                        client_id: body.client_id
                    });
                } catch (err2) {
                    return e.json(500, {
                        type: "error",
                        error_type: "OTHER",
                        message: "Failed to check uncommited changes: " + toString(err2),
                        fatal: false
                    });
                }
                if (uncommitted_changes.length != 0) {
                    changes = uncommitted_changes.concat(changes);
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(var _iterator1 = uncommitted_changes[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            var change1 = _step1.value;
                            try {
                                $app.delete(change1.id);
                            } catch (err2) {
                                return e.json(500, {
                                    type: "error",
                                    error_type: "OTHER",
                                    message: "Failed to delete uncommited change: " + toString(err2),
                                    fatal: false
                                });
                            }
                        }
                    } catch (err1) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err1;
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
                }
                var base_revision = body.base_revision || 0;
                var server_changes = [];
                try {
                    server_changes = $app.findRecordsByFilter($app.findCollectionByNameOrId("sync_changes"), "revision > ".concat(base_revision), "", 0, 0);
                } catch (err2) {
                    return e.json(500, {
                        type: "error",
                        error_type: "OTHER",
                        message: "Failed to retrieve server change: " + toString(err2),
                        fatal: false
                    });
                }
                var reduced_server_change_set = reduceChanges(server_changes);
                var resolved = resolveConflicts(changes, reduced_server_change_set);
                resolved.forEach(function(change) {
                    var collection = void 0;
                    var change_collection = void 0;
                    var revision_collection = void 0;
                    try {
                        collection = $app.findCollectionByNameOrId(change.table == "history" ? "history_entries" : change.table);
                        change_collection = $app.findCollectionByNameOrId("sync_changes");
                        revision_collection = $app.findCollectionByNameOrId("sync_revisions");
                    } catch (err2) {
                        return e.json(500, {
                            type: "error",
                            error_type: "OTHER",
                            message: "Failed to retrieve collection for uploading resolved changes: " + toString(err2),
                            fatal: false
                        });
                    }
                    switch(change.type){
                        case 1:
                        case "CREATE":
                            {
                                $app.runInTransaction(function(txApp) {
                                    try {
                                        var _e_auth, _e_auth1;
                                        var record = new Record(collection);
                                        if (change.table == "history") {
                                            if (change.obj.vine_course) {
                                                try {
                                                    $app.findRecordById($app.findCollectionByNameOrId("courses"), change.obj.vine_course);
                                                } catch (err2) {
                                                    return e.json(400, {
                                                        type: "error",
                                                        error_type: "OTHER",
                                                        message: "Course does not exist for history entry: " + change.obj.id + ", " + toString(err2),
                                                        fatal: false
                                                    });
                                                }
                                            }
                                            if (change.obj.vine) {
                                                try {
                                                    console.log("test2", change.obj.vine);
                                                    $app.findRecordById($app.findCollectionByNameOrId("vines"), change.obj.vine);
                                                } catch (err2) {
                                                    return e.json(400, {
                                                        type: "error",
                                                        error_type: "OTHER",
                                                        message: "Vine does not exist for history entry: " + change.obj.id + ", " + toString(err2),
                                                        fatal: false
                                                    });
                                                }
                                            }
                                        } else if (change.table == "vines") {
                                            if (change.obj.course) {
                                                try {
                                                    $app.findRecordById($app.findCollectionByNameOrId("courses"), change.obj.course);
                                                } catch (err2) {
                                                    return e.json(400, {
                                                        type: "error",
                                                        error_type: "OTHER",
                                                        message: "Course does not exist for vine: " + change.obj.id + ", " + toString(err2),
                                                        fatal: false
                                                    });
                                                }
                                            }
                                        }
                                        for(var key in change.obj){
                                            var split = key.split(".");
                                            if (split.length == 2) {
                                                if (JSON.stringify(record.get(split[0])) != "null") {
                                                    record.set(split[0], _object_spread_props(_object_spread({}, JSON.parse(record.get(split[0]))), _define_property({}, split[1], change.obj[key])));
                                                } else {
                                                    record.set(split[0], _define_property({}, split[1], change.obj[key]));
                                                }
                                            } else if (split.length != 0) {
                                                record.set(key, change.obj[key]);
                                            } else {
                                                return e.json(500, {
                                                    type: "error",
                                                    error_type: "CREATE",
                                                    message: "Failed to set record for: " + change.id + ". JSON key split length has unexpected value of " + split.length,
                                                    fatal: true
                                                });
                                            }
                                        }
                                        record.load(change.obj);
                                        if (change.table == "settings" && change.obj.id == 1) {
                                            record.set("id", $security.randomStringByRegex("[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"));
                                        } else {
                                            record.set("id", change.obj.id);
                                        }
                                        record.set("user", (_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id);
                                        txApp.save(record);
                                        var revision_record = txApp.findRecordsByFilter(revision_collection, "user = '".concat((_e_auth1 = e.auth) === null || _e_auth1 === void 0 ? void 0 : _e_auth1.id, "'"), "", 0, 0);
                                        if (revision_record.length > 0) {
                                            var _revision_record_;
                                            revision_record[0].set("revision", ((_revision_record_ = revision_record[0]) === null || _revision_record_ === void 0 ? void 0 : _revision_record_.get("revision")) + 1);
                                            txApp.save(revision_record[0]);
                                        } else {
                                            return e.json(500, {
                                                type: "error",
                                                error_type: "CREATE",
                                                message: "Failed to set the revision record for: " + change.id + toString(err),
                                                fatal: true
                                            });
                                        }
                                        var change_record = new Record(change_collection);
                                        change_record.set("revision", revision_record[0].get("revision"));
                                        change_record.set("source", body.client_id);
                                        change_record.set("type", "CREATE");
                                        change_record.set("collection", change.table == "history" ? "history_entries" : change.table);
                                        change_record.set("key", change.key);
                                        change_record.set("obj", change.obj);
                                        txApp.save(change_record);
                                    } catch (err2) {
                                        console.log("create err", JSON.stringify(err2));
                                        console.warn("Skipping create");
                                    }
                                });
                                break;
                            }
                        case 2:
                        case "UPDATE":
                            {
                                $app.runInTransaction(function(txApp) {
                                    try {
                                        var record = void 0;
                                        console.log("1");
                                        if (change.table == "history") {
                                            console.log("2");
                                            if (change.mods.vine_course) {
                                                try {
                                                    $app.findRecordById($app.findCollectionByNameOrId("courses"), change.mods.vine_course);
                                                } catch (err2) {
                                                    return e.json(400, {
                                                        type: "error",
                                                        error_type: "OTHER",
                                                        message: "Course does not exist for history entry: " + change.mods.id + ", " + toString(err2),
                                                        fatal: false
                                                    });
                                                }
                                            }
                                            console.log("3");
                                            if (change.mods.vine) {
                                                try {
                                                    $app.findRecordById($app.findCollectionByNameOrId("vines"), change.mods.vine_course);
                                                } catch (err2) {
                                                    return e.json(400, {
                                                        type: "error",
                                                        error_type: "OTHER",
                                                        message: "Vine does not exist for history entry: " + change.mods.id + ", " + toString(err2),
                                                        fatal: false
                                                    });
                                                }
                                            }
                                        } else if (change.table == "vines") {
                                            if (change.mods.course) {
                                                try {
                                                    $app.findRecordById($app.findCollectionByNameOrId("courses"), change.mods.course);
                                                } catch (err2) {
                                                    return e.json(400, {
                                                        type: "error",
                                                        error_type: "OTHER",
                                                        message: "Course does not exist for vine: " + change.mods.id + ", " + toString(err2),
                                                        fatal: false
                                                    });
                                                }
                                            }
                                        }
                                        if (change.table == "settings") {
                                            try {
                                                var _e_auth, _e_auth1;
                                                record = txApp.findFirstRecordByFilter(collection, "user = '".concat((_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id, "'"));
                                                record.set("user", (_e_auth1 = e.auth) === null || _e_auth1 === void 0 ? void 0 : _e_auth1.id);
                                            } catch (err2) {
                                                var _e_auth2;
                                                record = new Record(txApp.findCollectionByNameOrId("settings"));
                                                record.set("user", (_e_auth2 = e.auth) === null || _e_auth2 === void 0 ? void 0 : _e_auth2.id);
                                            }
                                        } else {
                                            try {
                                                record = txApp.findRecordById(collection, change.key);
                                            } catch (e1) {
                                                return e.json(200, {});
                                            }
                                        }
                                        if (record) {
                                            for(var mod in change.mods){
                                                var split = mod.split(".");
                                                if (split.length == 2) {
                                                    if (record.get(split[0]) != "null") {
                                                        record.set(split[0], _object_spread_props(_object_spread({}, JSON.parse(record.get(split[0]))), _define_property({}, split[1], change.mods[mod])));
                                                    } else {
                                                        record.set(split[0], _define_property({}, split[1], change.mods[mod]));
                                                    }
                                                } else if (split.length != 0) {
                                                    record.set(mod, change.mods[mod]);
                                                } else {
                                                    return e.json(500, {
                                                        type: "error",
                                                        error_type: "UPDATE",
                                                        message: "Failed to set record for: " + change.key + ". JSON key split length has unexpected value of " + split.length,
                                                        fatal: true
                                                    });
                                                }
                                            }
                                            try {
                                                txApp.save(record);
                                            } catch (err2) {
                                                return e.json(500, {
                                                    type: "error",
                                                    error_type: "UPDATE",
                                                    message: "Failed to update record for: " + change.key + toString(err2),
                                                    fatal: true
                                                });
                                            }
                                        }
                                        var revision_record = void 0;
                                        try {
                                            var _e_auth3;
                                            revision_record = txApp.findRecordsByFilter(revision_collection, "user = '".concat((_e_auth3 = e.auth) === null || _e_auth3 === void 0 ? void 0 : _e_auth3.id, "'"), "", 0, 0);
                                            if (revision_record.length > 0) {
                                                var _revision_record_;
                                                revision_record[0].set("revision", ((_revision_record_ = revision_record[0]) === null || _revision_record_ === void 0 ? void 0 : _revision_record_.get("revision")) + 1);
                                                txApp.save(revision_record[0]);
                                            } else {
                                                throw "";
                                            }
                                        } catch (err2) {
                                            return e.json(500, {
                                                type: "error",
                                                error_type: "UPDATE",
                                                message: "Failed to set the revision record for: " + change.id + toString(err2),
                                                fatal: true
                                            });
                                        }
                                        var change_record = new Record(change_collection);
                                        change_record.set("revision", revision_record[0].get("revision"));
                                        change_record.set("source", body.client_id);
                                        change_record.set("type", "UPDATE");
                                        change_record.set("collection", change.table == "history" ? "history_entries" : change.table);
                                        change_record.set("key", change.key);
                                        change_record.set("mods", change.mods);
                                        try {
                                            txApp.save(change_record);
                                        } catch (err2) {
                                            return e.json(500, {
                                                type: "error",
                                                error_type: "UPDATE",
                                                message: "Failed to set the change record for: " + change.key + toString(err2),
                                                fatal: true
                                            });
                                        }
                                    } catch (err2) {
                                        return e.json(500, {
                                            type: "error",
                                            error_type: "UPDATE",
                                            message: "Error occurred while updating record: " + change.key + toString(err2),
                                            fatal: true
                                        });
                                    }
                                });
                                break;
                            }
                        case 3:
                        case "DELETE":
                            {
                                $app.runInTransaction(function(txApp) {
                                    try {
                                        var record = txApp.findRecordById(collection, change.id);
                                        txApp.delete(record);
                                    } catch (e) {}
                                    var revision_record = void 0;
                                    try {
                                        var _e_auth;
                                        revision_record = txApp.findRecordsByFilter(revision_collection, "user = '".concat((_e_auth = e.auth) === null || _e_auth === void 0 ? void 0 : _e_auth.id, "'"), "", 0, 0);
                                    } catch (err2) {
                                        return e.json(500, {
                                            type: "error",
                                            error_type: "DELETE",
                                            message: "Failed to set the change record for: " + change.id + toString(err2),
                                            fatal: false
                                        });
                                    }
                                    if (revision_record.length > 0) {
                                        try {
                                            var _revision_record_;
                                            revision_record[0].set("revision", ((_revision_record_ = revision_record[0]) === null || _revision_record_ === void 0 ? void 0 : _revision_record_.get("revision")) + 1);
                                            txApp.save(revision_record[0]);
                                        } catch (err2) {
                                            return e.json(500, {
                                                type: "error",
                                                error_type: "DELETE",
                                                message: "Failed to set the revision record for: " + change.id + toString(err2),
                                                fatal: false
                                            });
                                        }
                                    } else {
                                        throw "";
                                    }
                                    try {
                                        var change_record = new Record(change_collection);
                                        change_record.set("revision", revision_record[0].get("revision"));
                                        change_record.set("source", body.client_id);
                                        change_record.set("type", "DELETE");
                                        change_record.set("collection", change.collection);
                                        change_record.set("key", change.key);
                                        txApp.save(change_record);
                                    } catch (err2) {
                                        return e.json(500, {
                                            type: "error",
                                            error_type: "DELETE",
                                            message: "Failed to set change record for: " + change.id + toString(err2),
                                            fatal: false
                                        });
                                    }
                                });
                                break;
                            }
                    }
                });
            }
            var message = new SubscriptionMessage({
                name: body.client_id,
                data: JSON.stringify({
                    type: "ack",
                    request_id: request_id
                })
            });
            client.send(message);
        } catch (err2) {
            var message1 = new SubscriptionMessage({
                name: body.client_id,
                data: JSON.stringify({
                    type: "error",
                    error_type: "OTHER",
                    request_id: request_id,
                    fatal: false,
                    message: "2" + err2.toString()
                })
            });
            client.send(message1);
            return e.json(200, {
                type: "error",
                error_type: "OTHER",
                request_id: request_id,
                fatal: false,
                message: "3" + err2.toString()
            });
        }
    }
    return e.json(200, {
        type: "success"
    });
};
function preprocess_client_changes(changes) {
    var processed_changes = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = changes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var change = _step.value;
            if (change.table == "history") {
                if (change.type == 1) {
                    console.log("yes, ", JSON.stringify(change));
                    for(var key in change.obj){
                        if (key == "vine_id") {
                            change.obj["vine"] = change.obj["vine_id"];
                            delete change.obj.vine_id;
                        } else if (key == "type") {
                            if (change.obj["type"] == "COURSE") {
                                change.obj["vine_course"] = change.obj["course_id"];
                                delete change.obj.course_id;
                            }
                        }
                    }
                } else if (change.type == 2) {
                    for(var key1 in change.mods){
                        if (key1 == "vine_id") {
                            change.mods["vine"] = change.mods["vine_id"];
                            delete change.mods.vine_id;
                        } else if (key1 == "type") {
                            if (change.mods["type"] == "COURSE") {
                                change.mods["vine_course"] = change.mods["course_id"];
                                delete change.mods.course_id;
                            }
                        }
                    }
                }
            }
            if (change.table == "vines") {
                if (change.type == "CREATE") {
                    for(var key2 in change.obj){
                        if (key2 == "course_id") {
                            change.obj["course"] = change.obj[key2];
                            delete change.obj.course_id;
                        }
                    }
                } else if (change.type == "UPDATE") {
                    for(var key3 in change.mods){
                        if (key3 == "course_id") {
                            change.mods["course"] = change.mods[key3];
                            delete change.mods.course_id;
                        }
                    }
                }
            }
            if (change.table == "settings") {
                if (change.type == "CREATE" /* Create */ ) {
                    delete change.obj.id;
                } else if (change.type == "UPDATE" /* Update */ ) {
                    delete change.mods.id;
                }
            }
            processed_changes.push(change);
        }
    } catch (err1) {
        _didIteratorError = true;
        _iteratorError = err1;
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
    return processed_changes;
}
function preprocess_server_changes(changes) {
    var processed_changes = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = changes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var change = _step.value;
            var cloned_change = JSON.parse(JSON.stringify(change));
            cloned_change.table = cloned_change.collection == "history_entries" ? "history" : cloned_change.collection;
            if (cloned_change.collection == "settings") {
                if (cloned_change.type == "CREATE" /* Create */ ) {
                    delete cloned_change.obj.id;
                } else if (cloned_change.type == "UPDATE" /* Update */ ) {
                    delete cloned_change.mods.id;
                }
            }
            processed_changes.push(cloned_change);
        }
    } catch (err1) {
        _didIteratorError = true;
        _iteratorError = err1;
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
    return processed_changes;
}
