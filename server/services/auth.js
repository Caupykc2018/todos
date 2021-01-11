const { User } = require("../models");

module.exports = {
    async login({login, password}) {
        const user = await User.findOne({login: login, password: password});
        if(!user) {
            throw {status: 404, message: "Incorrect login or password"};
        }

        return {
            id: user._id,
            login: user.login
        };
    },
    async register({login, password}) {
        const user = await User.create({login: login, password: password});

        return {
            id: user._id,
            login: user.login
        };
    }
};