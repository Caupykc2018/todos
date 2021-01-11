require("@babel/core").transform("code", {
    presets: ["@babel/present-env"]
});

require("./app").startup(3001);