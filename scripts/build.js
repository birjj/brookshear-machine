#!/usr/bin/env node

const { build, cliopts } = require("estrella");

process.env.NODE_ENV = cliopts.watch ? "development" : "production";

build({
    entry: "../src/index.jsx",
    outfile: "../dist/app.js",
    bundle: true,
    sourcemap: true,
});

cliopts.watch &&
    require("serve-http").createServer({
        port: 8080,
        pubdir: require("path").join(__dirname, "..", "dist"),
    });
