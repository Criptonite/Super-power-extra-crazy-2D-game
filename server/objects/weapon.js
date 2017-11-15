"use strict";

var Event = require("../utils/event").Event;
var Vector = require("../utils/mathUtil").Vector;
var Bullet = require("./bullet").Bullet;
var ITEM = require("../game/global").constants.ITEM;
var WEAPON = require("../game/global").constants.WEAPON;

function Weapon(owner)
{
    this.type = WEAPON.PISTOL;
    this.owner = owner;
    this.next_shoot = 0;
    this.patrons = [1, 0, 0, 0, 0, 0];
}

Weapon.prototype.set = function(type)
{
    this.type = type;
};

//when generated weapon need takeweapon event

Weapon.prototype.next = function()
{
    for (var type = this.type + 1; type <= /*max weapon*/; type++)
    {
        if (this.patrons[type] > 0)
        {
            this.set(type);
            break;
        }
    }
};

Weapon.prototype.prev = function()
{
    for (var type = this.type - 1; type >= /*min weapon*/; type--)
    {
        if (this.patrons[type] > 0)
        {
            this.set(type);
            break;
        }
    }
};

Weapon.prototype.shoot = function()
{
    //generating bullet, shoot events
};

//Static methods

Weapon.update = function(game)
{
    //weapon updating
};

exports.Weapon = Weapon;