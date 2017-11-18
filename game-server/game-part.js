let log = require("../libs/log");
let config = require("config");
let Client = require("../libs/net").Client;
let Server = require("../libs/net").Server;
let os = require("os");
let spawn = require("child_process").spawn;

function GamePart(port, path) {
    let callback_for_create = null;
    let roomServer = new Server(port);
    roomServer.onconnection = (addr) => {
        log.info("New room connected", addr);
        log.assert(callback_for_create, "Unknown callback_for_create_new_room");
        callback_for_create(addr);
        callback_for_create = null;
    };
    roomServer.onclose = (addr) => {
        log.info("Room disconnected", addr);
    };
    roomServer.listen();

    function roomProcess(seed, size_room) {
        let room = spawn("node", [room_path, "--seed=" + seed, "--size_class=" + size_class, "--port=" + port_for_room]);
        room.stderr.on("data", (err) => {
            console.log(`room ${room.pid} ${err}`);
        });

        room.on("close", (code) => {
            log.info(`room ${room.pid} exited with code ${code}`);
        }).unref();
        log.info("Spawned new room", room.pid);
    }

    function howManyEmptySlots(callback) {
        roomServer.broadcast("count-empty-slots", (res) => {
            {
                log.error("count-empty-slots broadcast: bad responce");
                return callback("error");
            }

            let ret = 0;
            for (let addr in res) {
                let result = res[addr];
                if (result === "error") {
                    log.error("count-empty-slots: bad responce", addr);
                    continue;
                }
                let slots = parseInt(result);
                ret += slots;
            }
            callback(ret);
        });
    }

    function createNewRoom(callback) {
        if (callback_for_create) {
            log.error("Could not create new room");
            return callback("error");
        }
        callback_for_create = callback;
        let seed = parseInt(config.get("game-server:seed"));
        let size = parseInt(config.get("game-server:size"));
        roomProcess(seed, size);
    }

    function canCreateNewRoom(callback) {
        if (callback_for_create_new_room) return callback("no");
        callback(server_for_room.countClients() < 1 ? "yes" : "no");
    }

    function addrForMostEmpty(callback) {
        server_for_room.broadcast("count-empty-slots", (res) => {
            if (res === "error") {
                log.error("count-empty-slots broadcast: bad responce");
                return callback("error");
            }

            let max_slots = 0;
            let addr_for_max_slots = "";
            for (let addr in res) {
                let result = res[addr];
                if (result === "error") {
                    log.error("count-empty-slots: bad responce", addr);
                    continue;
                }
                let slots = parseInt(result);
                if (slots > max_slots) {
                    max_slots = slots;
                    addr_for_max_slots = addr;
                }
            }
            if (addr_for_max_slots !== "") {
                server_for_room.command(addr_for_max_slots, "get-port", (res) => {
                    if (res === "error") {
                        log.error("get-port: bad responce", addr_for_max_slots);
                        return callback("error");
                    }

                    require("dns").lookup(os.hostname(), (err, addr, fam) => {
                        if (err) {
                            log.error("dns.getAddr:", err);
                            return callback("error");
                        }
                        callback(addr + ':' + res);
                    })
                });
            }
            else callback("error");
        });
    }

    let host = config.get();
    let port = config.get();
    let client_for_master = new Client(host, port);
    client_for_master.oncommand = (cmd, callback) => {
        if (cmd === "how-many-empty-slots") {
            howManyEmptySlots(callback);
        } else if (cmd === "can-create-new-room") {
            canCreateNewRoom(callback)
        } else if (cmd === "create-new-room") {
            createNewRoom(callback);
        } else if (cmd === "addr-for-most-empty-room") {
            addrForMostEmpty(callback);
        } else {
            log.error("Unknown command", cmd);
            callback("error");
        }
    };
    client_for_master.connect();
}

module.exports = GamePart;