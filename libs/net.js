let config = require("config");
let log = require("libs/log")(module);
let net = require("net");

function Server(port) {
    let self = this;
    let clients = [];
    let broadcast_c = [];


    this.clientsAmount = () => {
        let amount = 0;
        clients.forEach(cl => {
            if (cl.verified) {
                amount++;
            }
        });
        return amount;
    };

    this.onconnection = (addr) => {
        log.error("Need to implement");
    };

    this.onclose = (addr) => {
        log.error("Need to implement");

    };

    this.command = (cmd, addr, callback) => {
        if (clients[addr]) {
            clients[addr].callbacks[cmd] = callback;
            clients[addr].socket.write(cmd);
        } else {
            return log.error("Wrong address: " + addr);
        }
    };

    this.broadcast = (cmd, callback) => {
        let callbacks = {
            callback: callback,
            left: 0,
            result: {}
        };

        for (let prop in clients) {
            let client = clients[prop];
            if (client && clien.verified) {
                callbacks.left++;
                client.socket.write(cmd);
            }
        }

        if (callbacks.left > 0) {
            broadcast_c[cmd] = callbacks;
            callbacks.timer = setTimeout(() => {
                if (broadcast_c[cmd]) {
                    broadcast_c[cmd].callback("error");
                    broadcast_c[cmd].callback(null);
                }
            }, config.get("master-server:timeout-broadcast"));
        } else {
            callback("");
        }
    };

    this.listen = () => {
        log.debug("Listen on port: " + port);
        net.createServer((sock) => {

            let addr = sock.remoteAddress + " " + sock.remotePort;
            log.debug("Connection address: " + addr);
            clients[addr] = {
                socket: sock,
                callbacks: [],
                verified: false
            };

            sock.on("data", (data) => {
                if (data.toString("utf-8") === "supergame") {
                    log.debug("Client", addr, "verified");
                    clients[addr].verified = true;
                    self.onconnection(addr);
                }
                else if (clients[addr].verified === true) {
                    var res = data.toString("utf-8").split('&');
                    log.assert(res.length === 2);
                    const cmd = res[0];
                    const result = res[1];

                    if (broadcast_c[cmd]) {
                        const broad = broadcast_c[cmd];
                        broad.result[addr] = result;
                        broad.left--;
                        if (broad.left === 0 && broad.callback) {
                            broadcast_c[cmd] = null;
                            clearTimeout(broad.timer);
                            broad.callback(broad.result);
                        }
                    }
                    else {
                        log.assert(clients[address].callbacks[cmd], "Don't find callback " + cmd);
                        clients[address].callbacks[cmd](result);
                        clients[address].callbacks[cmd] = null;
                    }
                }
                else {
                    log.debug("Not verified client sended", data.toString("utf-8"));
                }
            });


            sock.on("close", (data) => {
                let verified = clients[addr].verified;
                if (verified) {
                    for (let cmd in clients[addr].callbacks) {
                        let callback = clients[addr].callbacks[cmd];
                        if (callback) {
                            log.debug("Callback for command: " + cmd);
                            clients[addr].callbacks[cmd]("error");
                        }
                    }
                }
                clients[addr] = null;
                log.debug("Closed by address: " + addr);
                if (verified) self.onclose(addr);
            });

            sock.on("error", () => {
                log.error("Error from address: " + addr);
            });
        }).listen(port, "localhost");
    };

}

function Client(host, port) {
    let self = this;
    let client = net.Socket();

    client.on("close", function () {
        log.debug("CONNECTION CLOSED");
    });

    client.on("data", function (command) {
        let com = command.toString("utf-8");
        self.oncommand(com, function (res) {
            client.write(com, "&", res);
        });
    });

    this.connect = function () {
        log.debug("CONNECTING TO", port, ":", host);
        client.connect(port, host, function () {
            log.debug("CONNECTION COMPLETE");
            client.write("SuperGame");
        });
    };

    this.oncommand = function (cmd, callback) {
        log.error("Need to implement");
        callback("error");
    };

    this.disconnect = function () {
        log.debug("DISCONNECT....");
        client.destroy();
    };
}

module.exports.Server = Server;
module.exports.Client = Client;
