"use strict";

function GameClient(param) {
    var nick = decodeURI(param.nick);
    var local = param.local;
    var addr = param.addr;
    var self = this;

    var debugRender;
    var socket;
    var room;

    var allBots = [];
    var nicks = [];
    var myBot;

    var serverTime = 0;
    var frameBots = [];
    var frameItems = [];
    var frameEvents = [];
    var table = [];

    if (local !== undefined && local === "true")
    {
        room = new Room(42, 2, "local");
        debugRender = new DebugRender(room.getGame());
        socket = new FakeSocketClient(addr, 1);
    }
    else
    {
        socket = new WebSocket("ws://" + addr);
    }

    socket.binaryType = "arraybuffer";

    var levelRender;
    var transport;

    socket.open = function() {

    };

    socket.close = function(e) {
        socket = null;
        transport.socket = null;
        transport = null;
        Console.error("Oops. Connection to the server was lost. :(");
    };

    socket.error = function(e)
    {
        Console.assert(false, "Oops. Network error number" + e.message);
    };

    this.getNickById = function(id) {
        var nick = nicks[id];

    };

    this.getBotById = function(id) {
        //frameBots
    };

    this.getLevelRender = function() {
        return levelRender;
    };

    this.getNicks = function() {
        return nicks;
    };

    this.setUserNicks = function(ids)
    {
        for (var id in ids)
        {
            nicks[id] = ids[id];
        }
    };

    this.addFrame = function(frame) {

    };

    this.ready = function() {

    };

    this.getCamera = function() {

    };

    this.render = function() {
        function renderItems(){

        }

        function renderBots() {

        }

        function updateBots() {

        }

        //Performance

    };
}