"use strict";
// src/entries/index.pb.ts
onBootstrap(function(e) {
    e.next();
    require("".concat(__hooks, "/boot-message.js")).default();
});
routerAdd("GET", "/api/settings/pull", function(e) {
    require("".concat(__hooks, "/settings/pull.js")).default(e);
}, $apis.requireAuth());
routerAdd("POST", "/api/settings/push", function(e) {
    require("".concat(__hooks, "/settings/push.js")).default(e);
}, $apis.requireAuth());
routerAdd("GET", "/api/vines/pull", function(e) {
    require("".concat(__hooks, "/vines/pull.js")).default(e);
}, $apis.requireAuth());
routerAdd("POST", "/api/vines/push", function(e) {
    require("".concat(__hooks, "/vines/push.js")).default(e);
}, $apis.requireAuth());
routerAdd("POST", "/api/sessions/push", function(e) {
    require("".concat(__hooks, "/sessions/push.js")).default(e);
}, $apis.requireAuth());
routerAdd("GET", "/api/sessions/pull", function(e) {
    require("".concat(__hooks, "/sessions/pull.js")).default(e);
}, $apis.requireAuth());
onRecordAfterCreateSuccess(function(e) {
    e.next();
}, "sessions", "settings", "vines");
