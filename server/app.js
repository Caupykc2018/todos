const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new Koa();

const connectionDB = require("./config/connectionDB");

const routers = require("./routers");

const KoaBody = require('koa-body');

async function boot() {
    connectionDB();

    app.use(KoaBody());

    app.use(bodyParser());

    app.use(routers.routes());
    app.use((ctx) => {
        ctx.status = 201
        ctx.body = ctx;
    })

    return app;
}

module.exports = function startup(port) {
    const app = boot();

    app.listen(port);
}
