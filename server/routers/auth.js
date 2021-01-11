const Router = require("koa-router");
const router = new Router({prefix: "/"});

const {login, register} = require("../controllers/auth");

router.post("/login", login);
router.post("/register", register);

module.exports = router;