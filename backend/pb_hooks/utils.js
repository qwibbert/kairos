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
// src/entries/utils.ts
var utils_exports = {};
__export(utils_exports, {
    applyModifications: function() {
        return applyModifications;
    },
    combineCreateAndUpdate: function() {
        return combineCreateAndUpdate;
    },
    combineUpdateAndUpdate: function() {
        return combineUpdateAndUpdate;
    },
    deepClone: function() {
        return deepClone;
    },
    reduceChanges: function() {
        return reduceChanges;
    },
    resolveConflicts: function() {
        return resolveConflicts;
    },
    setByKeyPath: function() {
        return setByKeyPath;
    }
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    applyModifications: applyModifications,
    combineCreateAndUpdate: combineCreateAndUpdate,
    combineUpdateAndUpdate: combineUpdateAndUpdate,
    deepClone: deepClone,
    reduceChanges: reduceChanges,
    resolveConflicts: resolveConflicts,
    setByKeyPath: setByKeyPath
});
