let log = require("../../libs/log");
let config = require("config");
let Room = require("./common/room").Room;
let RoomInstance = require("./game-room");

let seed = config.get("seed");
let size_class = config.get("size_class");
let port_for_game = config.get("port");
if (seed === "" || size_class === "" || port_for_game === "")
{
    log.error("Please set seed, size_class and port: ./game-server/room/index.js --seed=42 --size_class=2 --port=8888");
    process.exit();
}

var room = new RoomInstance(parseInt(seed), parseInt(size_class), port_for_game, Room);