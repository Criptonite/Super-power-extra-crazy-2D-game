"use strict"

var Event = require("../utils/event").Event;
var Vector = require("../utils/mathUtil").Vector;
var Dynent = require("./dynent").Dynent;
var WEAPON = require("../game/global").constants.WEAPON;
var ITEM = require("../game/global").constants.ITEM;

function Bullet(type, pos, angle, owner) {
    this.type = type;
    this.owner = owner;
    this.dynent = new Dynent(pos, [1, 1], angle);
    var norm_dir = new Vector(-Math.sin(angle), -Math.cos(angle));
    this.norm_dir = norm_dir;
    this.nap = null;
    this.dest = null;
    this.id = 0;
    this.dead = Date.now() + WEAPON.wea_tabl[type].lifetime;
    this.last_update = Date.now();
    this.dist_for_rocket = 256;
    this.ai_check = false;

    //here implementation of bullet physics foreach weapon

}

Bullet.prototype.update = function (time) {
    var delta = time - this.last_update;
    if (delta > 20) {
        return this.update(this.last_update + 20) && this.update(time);
    }
    else
        if (delta < 20)
            return true;
    this.last_update = time;
    if (time > this.dead)
        return false;
    //updating foreach type of weapon
}

exports.Bullet = Bullet;