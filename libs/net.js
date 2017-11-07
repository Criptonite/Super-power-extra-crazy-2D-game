let config = require("config");
let log = require("libs/log")(module);
let net = require("net");

function Server() {

}

function Client(host, port) {
    let self = this;
    let client = net.Socket();

    client.on("close", function () {
        log.debug("CONNECTION CLOSED");
    });

    client.on("data", function (command) {
        let  com = command.toString("utf-8");
        self.oncommand(com, function (res) {
            client.write(com, " and ", res);
        });
    });

    this.connect = function () {
        log.debug("CONNECTING TO", port, ":", host);
        client.connect(port, host, function () {
            log.debug("CONNECTION COMPLETE");
            client.write("SuperGame");
        });
    };

    this.oncommand = function () {
        log.error("Some command");
        callback("error");
    };

    this.disconnect = function () {
        log.debug("DISCONNECT....");
        client.destroy();
    };
}

module.exports.Server = Server;
module.exports.Client = Client;
