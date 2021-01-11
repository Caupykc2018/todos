const Router = require("koa-router");
const router = new Router({prefix: "/api"});

const authRouter = require("../routers/auth");

router.use(authRouter.routes());
router.use((ctx) => {
    ctx.body = "OK";
})

module.exports = router;