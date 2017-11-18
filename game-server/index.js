let log = require("../libs/log");
let config = require("config");
let GamePart = require("./game-part");

let port = config.get("game-server:port-for-room");
if (!port_for_room)
{
    log.error("Please set port for room: npm run game -- --game-server:port-for-room=[port]");
    process.exit();
}
let game = new GamePart(port, "./game-server/room/index.js");