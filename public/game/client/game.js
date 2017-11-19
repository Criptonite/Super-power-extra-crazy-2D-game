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
		transport = new Transport(socket, self);
		transport.getLevelParam(function(seed, size_class)
		{
			var level = room ? room.getGame().level : new Level(size_class, seed);
			levelRender = new LevelRender(level, size_class);

			transport.addUser(nick, function()
			{
				transport.sendUserInputs();
			});
		});
		if (debugRender) debugRender.transport = transport;
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

		if (nick) {
			var color = "#y";
			var bot = id === mybot.id ? mybot : allbots[id];
			if (bot) {
				if (bot.seria >= 5) color = "#r";
				else if (bot.seria <= -5) color = "#G";
			}

			/*function getPlace() {
				for (var i = 0; i < table.length; i++)
					if (table[i].nick.slice(1) === nick)
						return i;
				return -1;
			}

			const place = getPlace();*/
			if (place >= 0 && place < 3) color = "#C" + (place + 1) + color;

			return color + nick;
		}
		return "";
    };

    this.getBotById = function(id) {
		for (var i = 0; i < framebots.length; i++)
			if (framebots[i].id === id)
				return framebots[i];
		return null;
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
		serverTime = frame.time;
		if (!myBot || myBot.id !== frame.myBot.id)
		{
			myBot = new BotClient(frame.time, frame.myBot, true);
		}
		myBot.addFrame(frame.time, frame.myBot, true);

		frameBots.splice(0, frameBots.length);
		frameBots.push(myBot);
		for (var i = 0; i < frame.listBots.length; i++)
		{
			var bot = frame.listBots[i];
			var id = bot.id;
			if (!allBots[id]) allBots[id] = new BotClient(frame.time, bot, false);
			else allBots[id].addFrame(frame.time, bot, false);

			frameBots.push(allBots[id]);
		}
		frameItems = frame.listItems;
		frameEvents = frame.listEvents;
		if (frame.table.length > 0) table = frame.table;

		var unknown_nicks = [];
		for (var i = 0; i < frameBots.length; i++)
		{
			var id = frameBots[i].id;
			if (!nicks[id]) unknown_nicks.push(id);
		}
		transport.getUserNicks(unknown_nicks);
		Event.emit("frame");
    };

    this.ready = function() {
		return levelRender && levelRender.ready() && myBot;
    };

    this.getCamera = function() {
		return myBot;
    };

    this.render = function() {
        function renderItems(){
			gl.enable(gl.BLEND);

			frameItems.forEach(function(item)
			{
				Item.render(myBot.dynent, item);
			});

			gl.disable(gl.BLEND);
        }

        function renderBots() {
			gl.enable(gl.BLEND);
			if (options.highQuality)
			{
				gl.blendFunc(gl.DST_COLOR, gl.ZERO);

				frameBots.forEach(function(bot) { bot.renderShadow(myBot.dynent); });

				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			}

			frameBots.forEach(function(bot) { bot.render(myBot.dynent); });

			gl.disable(gl.BLEND);

			frameBots.forEach(function(bot) { bot.renderStats(myBot.dynent); });
        }

        function updateBots() {
			frameBots.forEach(function(bot)
			{
				bot.update();
			});
        }

		function handleEvents()
		{
			frameEvents.forEach((event) =>
			{
				switch (event.type)
				{
					case EVENT.BOT_RESPAWN: return Event.emit("botRespawn", event.pos);
					case EVENT.ACHE: return Event.emit("botAche", event.pos, event.dir, event.botid);
					case EVENT.BOT_DEAD: return Event.emit("botDead", event.pos, event.dir, event.botid);
                    case EVENT.TAKE_WEAPON: return Event.emit("takeWeapon", event.pos);
					//TAKE
					case EVENT.BULLET_DEAD: return BulletClient.remove(event.bulletId);
					case EVENT.BULLET_RESPAWN: return BulletClient.create(event);
					case EVENT.LINE_SHOOT: return BulletLine.create(serverTime, event);
				}
			});
			frameEvents.splice(0, frameEvents.length);
		}

		stats.count_dynent_rendering = 0;

		updateBots();

		handleEvents();

		levelRender.render(myBot.dynent);

		Particle.render(myBot.dynent, 0);

		renderItems();

		renderBots();

		BulletClient.render(myBot.dynent);

		Particle.render(myBot.dynent, 1);
		Particle.render(myBot.dynent, 2);

		levelRender.renderSmallMap(myBot.dynent);

		//HUD.render(mybot, table);

		text.render([0.8, -0.9], 2, "#gFPS#{0.87}= #w" + stats.fps, 1);
		text.render([0.8, -0.95], 2, "#gPing#{0.87}= #w" + transport.getPing(), 1);
		Console.render();

		if (local !== undefined && local === "true")
		{
			debugRender.render(myBot);
		}

    };
}