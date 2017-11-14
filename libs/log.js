let winston = require("winston");
let fs = require("fs");

function getLogger(module) {

    let path = module.filename.split("/").slice(-2).join("/");
    let ret = new winston.Logger({
        transports:
            [
                new winston.transports.Console({
                    colorize: true,
                    level: "debug",
                    label: path
                })
            ]
    });

    ret.assert = function (condition, message) {
        if (!condition) {
            message = message || "FAIL ASSERT";
            ret.error(message);
            if (typeof Error !== "undefined") {
                throw  new Error(message);
            }
            throw message;
        }
    };

    ret.html = function (str) {
        try {
            const log_path = "./public/log/index.html";
            const isExist = fs.existsSync(log_path);
            if (!isExist) {
                fs.mkdirSync("./public/log");
                const head = "\
                    <html>\
                    <head>\
                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>\
                    <title>SuperGame</title>\
                    <body>";
                fs.appendFileSync(log_path, head);
            }
            const message = "<div>" + str + " <font color='blue'>" + Date() + "</font></div>";
            fs.appendFileSync(log_path, message);
        }
        catch (err) {
            ret.error("write to html error:", err);
        }
    };


    return ret;
}

module.exports = getLogger;