"use strict";

var Console = require("libs/log")(module);
var config = require("config");
var Level = require("../level/level").Level;
var Bot = require("../objects/bot").Bot;
var cameraCulling = require("../objects/dynent").cameraCulling;
var Vector = require("../utils/mathUtil").Vector;
var updateItem = require("../objects/item").updateItem;
var Weapon = require("../objects/weapon").Weapon;
var itemForEach = require("../objects/item").itemForEach;
var NickGenerator = require("../").NickGenerator;
var gameplay = require("./gameplay").gameplay;
var GameEvent = require("../objects/event.js").GameEvent;
var EVENT = require("./global.js").constants.EVENT;

function Game(levelSizeClass, gameSeed) {

    var self = this;
    this.bots = [];
    this.bullets = [];
    this.droped = [];
    this.clients = [];
    this.events = [];
    this.start_time = 0;
    var current_id = 0;
    var current_bullet_id = 0;
    var client_id_for_table = 0;
    this.seed = seed;
    this.size_class = size_class;
    this.level = new Level(levelSizeCLass, gameSeed);
    var nickGenerator = new NickGenerator(3);

    var max_players = this.level.getMaxBots();

    //Bot functional
    function createBot(botNick, isBot) {
        //player creation
        current_id++;
        if (current_id > 0xfff)
            current_id = 1;
        var bot = new Bot(self, botNick, current_id, isBot)
        return bot;
    }

    function addBot() {
        //bot adding
        var botNick = "";
        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++)
            botNick += charset.charAt(Math.floor(Math.random() * charset.length));
        self.bots.push(createBot(botNick, true));
        Console.debug("Adding new bot with nick: ", botNick);
    }

    function deleteBot(bot) {
        // bot removing
        Console.debug("Bot ", bot.nick, " replaced to Hell. Say goodbye!");
        for (var i = 0; i < self.bots.length; i++) {
            if (bot.id === self.bots[i].id) {
                self.bots.splice(i, 1);
            }
        }
        Console.error("No-no-no! I can't find bot ", bot.nick, ", bro.");
    }

    function handleBots() {
        //handling bots' count
        var freePlaces = max_players - self.bots.length

        if (freePlaces > 0) {
            //filling up game by bots
            for (var i = 0; i < freePlaces; i++) {
                addBot();
            }
            return;
        }
        else {
            var needRemove = -freePlaces;
            for (var i = 0; i < self.bots.length && count_for_remove > 0;)
                if (!self.bots[i].alive && self.bots[i].ai) {
                    removeBot(self.bots[i]);
                    count_for_remove--;
                }
                else i++;

        }
    }

    function updateBot() {
        //handling counts and raspawning bots
        handleCountBots();
        self.bots.forEach(function (bot) {
            if (!bot.alive && Date.now() > bot.resp_time) {
                bot.respawn();
            }
            bot.update(Date.now());
        });
    }

    function isListnable(bot, pos) {
        var len = Vector.sub(bot.dynent.pos, pos).length2();
        return len < 12 * 12 * 2;//distance to listnable object
    }

    function isVisible() {
        //bot is in frame
        return !cameraCulling(bot.dynent, dynent.pos, dynent.size);
    }

    //client service
    function sendFrame() {
        //sending frame to each client on server with 'need_table' parameter
        for (var i = 0; i < self.clients.length; i++) {
            var need_table = client_id_for_table === i;     //wat?!
            if (need_table)
                need_table = self.clients[i].tableTime < Date.now();
            sendFrameToClient(self.clients[i], need_table);
        }
        client_id_for_table++;
        if (client_id_for_table > self.clients.length - 1)
            client_id_for_table = 0;
    }

    function sendFrameToClient(client, need_table) {
        //listen all event from all visible bots and sends frame to client
        if (!client.spectator)
            return;
        //other bots
        var botList = []
        for (var i = 0; i < self.bots.length; i++) {
            if (self.bots[i] !== client.spectator && isVisible(client.spectator, self.bots[i].dynent))
                botList.push(self.bots[i]);
        }
        //items in game
        var itemsList = []
        itemForEach(self, function (item) {
            if (isVisible(client.spectator, item.dynent)) {
                itemsList.push(item);
            }
        })
        var eventList = []
        for (var i = 0; i < self.events; i++) {
            var event = self.events[i];
            if (event.type == EVENT.BOT_SPAWN ||
                event.type == EVENT.BOT_DEAD) {
            }
            //another event dispatchers
        }
        var table;
        if (need_table) {
            //creating rank tabe y gameplay statistic

        }
        client.sendFrame(Date.now() - self.start_time, client.spectator, botList, itemsList, eventList, table)
    }

    var timeWithoutClients = 0;

    function handleForDrop() {
        if (self.clients.length === 0) {
            const timeout = config.get("game-server:timeout-for-destroy-room");
            if (timeWithoutClients === 0) {
                timeWithoutClients = Date.now();
            }
            else if (Date.now() > timeWithoutClients + timeout)
                self.onclose()
        }
        else {
            timeWithoutClients = 0;
        }
    }

    var frame_time = 0;
    var timer_id;
    var update_time = parseInt(config.get("game-server:update-time"));

    function update() {
        var start = Date.now();

        //clearing bot gameplay statistics anf events
        self.bots.forEach(function (bot) {
            bot.stats.clear();
        });
        self.events.splice(0, self.events.length);


        Weapon.update(self);
        updateBot();
        updateItem(self);
        sendFrame();
        handleForDrop();

        var end = Date.now();
        frame_time = end - start;
        var next_frame = update_time - frame_time;
        if (next_frame < 0) next_frame = 0;
        timer_id = setTimeout(update, next_frame);
    }

    //game params
    this.start = function () {
        //creating start time and updating
        this.start_time = Date.now();
        update();
    }
    this.stop = function () {
        //
        if (timer_id) {
            clearTimeout(timer_id);
            timer_id = null;
        }
    }
    this.emptySlotCout = function () {
        var count_users = 0;
        for (var i = 0; i < this.clients.length; i++)
            if (this.clients[i].bot)
                count_users++;

        return Math.max(0, max_players - count_users);
    }
    this.getFrameTime = function () {
        return frame_time;
    }
    this.getBulletId = function () {
        current_bullet_id++;
        //if max bullets count create new loop
        if (current_bullet_id > 0xffff)
            current_bullet_id = 1;
        return current_bullet_id;
    }
    this.addUser = function (client, nickName) {
        //connecting user
        Console.debug("Add user", nick, ", Welcome, bro")
        var player = createBot(nick, false);
        client.bot = player;
        client.spectator = player;
        this.bots.push(player);
    }
    this.disconnectUser = function (client) {
        for (var i = 0; i < this.clients.length; i++)
        {
            if (this.clients[i] === client)
            {
                var nick = client.bot ? client.bot.nick : "";
                var stats = "";
                if (client.bot)
                {
                    stats = client.bot.stats.toString();
                    removeBot(client.bot);
                }
                Console.html("User disconnect <font color='red'>" + nick +
                    "</font>, avg ping = " + (client.client_ping / client.client_ping_count | 0) + " stats:" + stats);
                this.clients.splice(i, 1);
                Console.debug("Client disconnected:", nick);
                return;
            }
        }
        Console.error("Unknown client");
    };

    this.setUserInputs = function (client, inputs) {
        var player = client.bot;
        if (player.dynent){
            player.dynent.angle = inputs.dynent.angle;
        }
        player.key_up = inputs.up;
        player.key_left = inputs.left;
        player.key_down = inputs.down;
        player.key_right = inputs.right;
        player.shoot = inputs.mouse;

        if (player.weapon)
        {
            if (inputs.wheelup) player.weapon.next();
            else if (inputs.wheeldown) player.weapon.prev();
        }
    }
    this.changeCamPos = function (client, chngcmd) {
        //changing spectator camera between players
        var bot = client.spectator;
        var index = -1;
        for (var i = 0; i < this.bots.length; i++)
        {
            if (this.bots[i] === bot)
            {
                index = i;
                break;
            }
        }
        if (index === -1)
        {
            Console.error("Don't find bot");
            return;
        }
        if (cmd === 1) index--;
        else if (cmd === 2) index++;
        else
        {
            Console.error("Unknown command for change camera");
            return;
        }
        if (index < 0) index = 0;
        if (index > this.bots.length - 1) index = this.bots.length - 1;
        client.spectator = this.bots[index];
    }
    this.spectator = function (client, nickName) {
        //There are no uses of this method
        //findnig bot with nickName
    }
    this.onclose = function () {
        //i don't know
    }
}