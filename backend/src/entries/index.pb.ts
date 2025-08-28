
onBootstrap((e) => {
    e.next();
    require(`${__hooks}/boot-message.js`).default();

})

routerAdd("GET", "/api/settings/pull", (e) => {
    require(`${__hooks}/settings/pull.js`).default(e);
}, $apis.requireAuth())

routerAdd("POST", "/api/settings/push", (e) => {
    require(`${__hooks}/settings/push.js`).default(e);
}, $apis.requireAuth());

routerAdd("GET", "/api/vines/pull", (e) => {
    require(`${__hooks}/vines/pull.js`).default(e);
}, $apis.requireAuth())

routerAdd("POST", "/api/vines/push", (e) => {
    require(`${__hooks}/vines/push.js`).default(e);
}, $apis.requireAuth());

routerAdd("POST", "/api/sessions/push", (e) => {
    require(`${__hooks}/sessions/push.js`).default(e);
}, $apis.requireAuth());

routerAdd("GET", "/api/sessions/pull", (e) => {
    require(`${__hooks}/sessions/pull.js`).default(e);
}, $apis.requireAuth())

onRecordAfterCreateSuccess((e) => {
    // e.app
    // e.record

    e.next()
}, "sessions", "settings", "vines");
