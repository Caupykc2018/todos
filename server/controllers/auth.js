const { register, login } = require("../services/auth");

module.exports = {
    async login(ctx) {
        try {
            console.log(ctx.body);
            ctx.response.message = "OK"
            //ctx.response.status = 200;
            //ctx.response.message =  login();
        }
        catch(e) {
            if(e.status) {
                ctx.throw(e.status, e.message);
            }
        }
    },
    async register(ctx) {
        try {
            ctx.response.status = 200;
            ctx.response.message = register();
        }
        catch(e) {
            if(e.status) {
                ctx.throw(e.status, e.message);
            }
        }
    }
}