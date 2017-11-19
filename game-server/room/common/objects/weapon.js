"use strict";

var Event = require("../utils/event").Event;
var Vector = require("../utils/mathUtil").Vector;
var Bullet = require("./bullet").Bullet;
var ITEM = require("../game/global").constants.ITEM;
var WEAPON = require("../game/global").constants.WEAPON;

function Weapon(owner) {
    this.type = WEAPON.PISTOL;
    this.owner = owner;
    this.next_shoot = 0;
    this.patrons = [1, 0, 0, 0, 0, 0];
}

Weapon.prototype.set = function (type) {
    this.type = type;
};

//when generated weapon need takeweapon event
Event.on("takeweapon", function (bot, type, patrons) {
    if(type > bot.weapon.type){
        bot.weapon.set(type)
    }
})

Weapon.prototype.next = function () {
    for (var type = this.type + 1; type <= WEAPON.STRONG; type++) {
        if (this.patrons[type] > 0) {
            this.set(type);
            break;
        }
    }
};

Weapon.prototype.prev = function () {
    for (var type = this.type - 1; type >= WEAPON.SIMPLE; type--) {
        if (this.patrons[type] > 0) {
            this.set(type);
            break;
        }
    }
};

Weapon.prototype.shoot = function () {
    //generating bullet, shoot events
    if (Date.now() > this.next_shoot) {
        if (this.patrons[this.type] <= 0) {
            //this.prev();
            return;
        }

        var angle = this.owner.dynent.angle;
        if (this.type === WEAPON.PISTOL) {
            angle += (Math.random() * 2 - 1) * Math.PI / 100;
        }

        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        var position = Vector.add2(this.owner.dynent.pos, cosa * 0.25 - sina * 0.9, -cosa * 0.9 - sina * 0.25);

        //for collision
        var center = Vector.add(position, this.owner.dynent.pos).mul(0.5);
        if (this.owner.game.level.getCollide(center) > 128)
            return;

        Event.emit("shoot", this.owner, this.type);

        new Bullet(this.type, position, angle, this.owner);
        if (this.type !== WEAPON.SIMPLE)
            this.patrons[this.type]--;
        this.next_shoot = Date.now() + WEAPON.wea_tabl[this.type].period;
        this.owner.last_shoot_time = Date.now();
    }
};

//Static methods

Weapon.update = function (game) {
    //weapon updating
    for (var index = 0; index < game.bullets.length;) {
        var bullet = game.bullets[index];
        if (bullet.update(Date.now())) {
            index++;
        }
        else {
            Event.emit("bulletdead", bullet);
            game.bullets.splice(index, 1);
        }
    }
};

exports.Weapon = Weapon;