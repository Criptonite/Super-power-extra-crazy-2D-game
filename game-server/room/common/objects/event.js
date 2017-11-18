"use strict";

var Event = require("../utils/event.js").Event;
var Vector = require("../utils/mathUtil").Vector;
var EVENT = require("../game/global.js").constants.EVENT;
var WEAPON = require("../game/global.js").constants.WEAPON;

function GameEvent(type, pos, dir, arg1, arg2)
{
    this.type = type;
    this.pos = new Vector(pos);
    this.dir = dir ? new Vector(dir) : null;
    this.arg1 = arg1;
    this.arg2 = arg2;
}

//event declaration like a template
Event.on("botrespawn", function(bot)
{
    bot.game.events.push(new GameEvent(/*event type*/, bot.dynent.pos, null));
});


exports.GameEvent = GameEvent;