"use strict";

var Event = require("../utils/event").Event;
var Vector = require("../utils/mathUtil").Vector;
var Dynent = require("./dynent").Dynent;
var Aibot = require("../game/aibot").Aibot;
var Weapon = require("./weapon").Weapon;
var ITEM = require("../game/global").constants.ITEM;
var WEAPON = require("../game/global").constants.WEAPON;

function Bot(game, nick, id, isBot)
{
    this.game = game;
    this.nick = nick;
    this.id = id;

    //key controls
    this.key_up = false;
    this.key_left = false;
    this.key_down = false;
    this.key_right = false;
    this.shoot = false;

    this.alive = false;
    this.resp_time = 0;

    this.ai = null;

    if (isBot) this.ai = new Aibot(this);

    this.direction = new Vector(0, 0);
    //create event to bot add
}

Bot.SPEED = 0.008;
Bot.HEALTH = 3999;

//another bot events

Bot.prototype.respawn = function()
{
    //geberating bot and bot respawn event
};

Bot.prototype.update = function(time)
{
    //when bot IS ALIVE it needs to update
};

Bot.prototype.collide_bot = function(dt)
{
    //colling bots
};

/*
damage - count HP
opponent - bot, owner bullet
bullet.pos - position of this bullet
bullet.vel - velocity of this bullet
bullet.type - type weapon
param.lava
*/
Bot.prototype.pain = function(damage, opponent, bullet, param)
{
    //if no sheild bot damages and bot takedamage event
};

Bot.prototype.dead = function(opponent, bullet, param)
{
    //removing bot (maybe respawn) and bot dead event
};

exports.Bot = Bot;