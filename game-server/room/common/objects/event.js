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
Event.on("botspawn", function(bot)
{
    bot.game.events.push(new GameEvent(EVENT.BOT_SPAWN, bot.dynent.pos, null));
});
Event.on("damage", function (bot, bullet) {
    if(bullet){
     var dir = Vector.sub(bullet.pos, bot.pos);
     var pos = bullet.pos;
     bot.game.events.push(new GameEvent(EVENT.DAMAGE, pos, dir, bot.id))
    }
})
Event.on("botdead", function(bot, bullet, killer)
{
    bot.game.events.push(new GameEvent(EVENT.BOT_DEAD, bot.dynent.pos, null));
});
Event.on("itemspawn", function(bot)
{
    bot.game.events.push(new GameEvent(EVENT.BOT_SPAWN, bot.dynent.pos, null));
});
Event.on("itemspawn", function(bot)
{
    bot.game.events.push(new GameEvent(EVENT.BOT_SPAWN, bot.dynent.pos, null));
});
Event.on("takeweapon", function (bot, type, patrons)
{
    bot.game.events.push(new GameEvent(EVENT.TAKE_WEAPON, bot.dynent.pos, null));
});

exports.GameEvent = GameEvent;