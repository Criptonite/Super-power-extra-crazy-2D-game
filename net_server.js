let log = require("./libs/log");
let Server = require("./libs/net").Server;
let config = require("config");

let gameServerPort = config.get("masret-server:port-for-game-server");
let gameServer = new Server(gameServerPort);
gameServer.onconnection = (addr) => {
    log.info("Connected", addr);
};
gameServer.onclose = (addr) => {
    lon.info("Disconect", addr);
};

gameServer.listen();

function getAddrMostEmpty(addr, callback) {
    gameServer.command(addr, "addr-for-most-empty-room", (res) => {
        if (res === "error") {
            log.error("Bad responce", addr);
            return callback("");
        }
        return callback(res);
    });
}

module.exports.getAddr = (callback) => {
    gameServer.broadcast("how-many-epty-slots", (res) => {
        if (res === "error") {
            log.error("Bad responce", addr);
            return callback("");
        }

        let max_empty = 0;
        let max_addr = "";

        for (let addr in res) {
            let result = res[addr];
            if (result === "error") {
                log.error("Bad responce", addr);
                continue;
            }
            let slots = parseInt(result);
            if (slots > max_empty) {
                max_empty = slots;
                max_addr = addr;
            }
        }

        if (max_addr !== "") {
            getAddrMostEmpty(max_addr, callback);
        } else {
            gameServer.broadcast("can-create-new-room", (res) => {
                if (res === "error") {
                    log.error("Bad responce", addr);
                    return callback("");
                }

                for (let addr in res) {
                    let result = res[addr];
                    if (result === "error") {
                        log.error("Bad responce", addr);
                    } else if (result === "yes") {
                        return gameServer.command(addr, "create-new-room", (res) => {
                            if (res === "error") {
                                log.error("Bad responce", addr);
                                return callback("");
                            }
                            getAddrMostEmpty(addr, callback);
                        });
                    }
                }
                return callback("");
            });
        }

    });
};

