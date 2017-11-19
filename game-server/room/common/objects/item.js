"use strict";

var Console = require("libs/log")(module);
var config = require("config/index");
var Event = require("../utils/event").Event;
var Vector = require("../utils/mathUtil").Vector;
var Dynent = require("./dynent").Dynent;
var ITEM = require("../game/global").constants.ITEM;
var WEAPON = require("../game/global").constants.WEAPON;

function Item(game, pos, type, val)
{
    this.type = type || (1 + Math.random() * ITEM.COUNT | 0);
    this.val = val;
    this.dynent = new Dynent(pos);
    this.alive = true;
    this.item_pos = null;
    this.game = game;
}

Item.prototype.update = function()
{
    //item events when colliding with player
    for (var i = 0; i < this.game.bots.length; i++)
    {
        var bot = this.game.bots[i];
        if (!bot.alive)
            continue;

        var dir = bot.dynent.collide(this.dynent, this.dynent.size.x);
        if (dir !== null)
        {
            if (this.type <= WEAPON.STRONG)
            {
                Event.emit("takeweapon", bot, this.type, this.val);
            }
            else if (this.type === ITEM.HEALTH)
            {
                Event.emit("takehealth", bot);
            }
            else if (this.type === ITEM.SHIELD)
            {
                Event.emit("takeshield", bot);
            }
            var time_resp = parseInt(config.get("game-server:item-respawn-time"));
            if (this.item_pos) this.item_pos.time = Date.now() + time_resp;
            this.alive = false;
            return false;
        }
    }
    return true;
};

Event.on("botdead", function(bot, opponent, bullet)
{
    if (bot.weapon.type === WEAPON.SIMPLE)
        return;

    var patrons = bot.weapon.patrons[bot.weapon.type];
    if (patrons > 0)
    {
        bot.game.droped.push(new Item(bot.game, bot.dynent.pos, bot.weapon.type, patrons));
    }
});
//static methods

function initItem(game)
{
    if (game.item_inited)
        return;

    //initing item
    var level_item_pos = game.level.getItemPos();
    for (var i = 0; i < level_item_pos.length; i++)
    {
        var item_pos = level_item_pos[i];
        item_pos.time = 0;
        item_pos.item = null;
        item_pos.update = function()
        {
            if (this.item === null) //weapon item taken
            {
                if (Date.now() > this.time)
                {
                    this.item = new Item(game, this.pos);
                    this.item.item_pos = this;
                    Event.emit("itemspawn", this.item);
                }
            }
        };
    }
    game.item_inited = true;
};

exports.itemForEach = function(game, callback)
{
    game.level.getItemPos().forEach(function(item_pos)
    {
        if (item_pos.item) callback(item_pos.item);
    });
    game.droped.forEach(function(droped)
    {
        callback(droped);
    });
};

exports.updateItem = function(game)
{
    //game item updating
    initItem(game);

    game.level.getItemPos().forEach(function(item_pos)
    {
        item_pos.update();
        if (item_pos.item)
        {
            if (!item_pos.item.update())
            {
                item_pos.item = null;
            }
        }
    });

    for (var index = 0; index < game.droped.length;)
    {
        var droped = game.droped[index];
        if (droped.update())
        {
            index++;
        }
        else
        {
            game.droped.splice(index, 1);
        }
    }
};