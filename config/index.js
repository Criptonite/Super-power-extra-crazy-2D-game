"use strict";

let nconf = require("nconf");
let path = require('path');

nconf.argv().file({ file: path.join(__dirname, "config.json") });

module.exports = nconf;