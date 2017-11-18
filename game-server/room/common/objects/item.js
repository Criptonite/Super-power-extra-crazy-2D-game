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
};

//static methods

function initItem(game)
{
    if (game.item_inited)
        return;

    //initing item

    game.item_inited = true;
};

exports.itemForEach = function(game/*, callback*/)
{
    //no realizetion
};

exports.updateItem = function(game)
{
    //game item updating
};