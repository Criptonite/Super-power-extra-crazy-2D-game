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
    this.ai_check = false;

    //here implementation of bullet physics foreach weapon
    if (type <= WEAPON.STRONG) {
        var dest = new Vector(pos);
        var old_tile = 0;
        for (var len = 1; len < 11; len++) {
            dest.add(norm_dir);
            var tile = owner.game.level.getCollide(dest);
            if (tile > 128) {
                var koef = (tile - 128) / (tile - old_tile);
                var err = Vector.mul(norm_dir, koef);
                dest.sub(err);
                break;
            }
            old_tile = tile;
        }

        //here collide with bot, ray [pos, dest]
        var dist = Vector.sub(dest, pos);
        var min_dist_for_shaft = 256;
        var bot_for_shaft = null;
        for (var i = 0; i < owner.game.bots.length; i++) {
            var bot = owner.game.bots[i];
            if (bot === owner)
                continue;
            if (!bot.alive)
                continue;

            var R = Vector.sub(bot.dynent.pos, pos);
            var rr = R.dot(R);
            var dot_r_dist = R.dot(dist);
            var dd = dist.dot(dist);

            if (type == WEAPON.SHAFT) {
                var rast = Math.sqrt(rr);
                var length = Math.sqrt(dd);
                if (rast < length && rast < min_dist_for_shaft && dot_r_dist > 0) {
                    var norm = Vector.binormalize(dist).normalize();
                    var rnorm = Vector.normalize(R);
                    var r = Math.abs(norm.dot(rnorm));
                    if (r < 0.33) {
                        min_dist_for_shaft = rast;
                        bot_for_shaft = bot;
                    }
                }
            }
            else {
                var rad = bot.dynent.size.x * 0.5;
                var D = 4 * dot_r_dist * dot_r_dist - 4 * dd * rr + 4 * dd * rad;
                if (D < 0)
                    continue;

                var sD = Math.sqrt(D);
                var t = (2 * dot_r_dist - sD) / (2 * dd);
                if (t < 0 && ((2 * dot_r_dist + sD) / (2 * dd)) > 0)
                    t = 0.01;
                if (t < 0 || t > 1)
                    continue;

                if (type === WEAPON.RAIL) {
                    bot.pain(WEAPON.wea_tabl[type].damage, owner, {pos: dest, type: type});
                    continue;
                }

                var nap = Vector.mul(dist, t);
                dest = Vector.add(pos, nap);
                var power = owner.power === ITEM.QUAD ? WEAPON.ROCKET + 1 : 0;
                bot.pain(WEAPON.wea_tabl[type + power].damage, owner, {pos: dest, type: type});
                break;
            }
        }

        if (bot_for_shaft !== null) {
            var nap = new Vector(bot_for_shaft.dynent.pos);
            nap.sub(pos);
            var radius = Vector.normalize(nap).mul(bot_for_shaft.dynent.size.x * 0.5);
            nap.sub(radius);
            this.dynent.angle = nap.angle() - Math.PI / 2;
            dest = Vector.add(pos, nap);
            this.nap = nap;

            var power = owner.power === ITEM.QUAD ? WEAPON.ROCKET + 1 : 0;
            bot_for_shaft.pain(WEAPON.wea_tabl[type + power].damage * WEAPON.FRAME_DELTA_TIME, owner,
                {
                    pos: dest,
                    type: WEAPON.SHAFT,
                });
        }
        else {
            this.nap = Vector.sub(dest, pos);
        }

        var len = Vector.sub(dest, pos).length();
        this.dynent.pos.add(dest).mul(0.5);
        this.dynent.size.set(0.5, len);
        this.dest = dest;

        Event.emit("lineshoot", this);
    }
    else {
        this.dynent.vel = Vector.mul(norm_dir, WEAPON.wea_tabl[type].vel);
    }

}

Bullet.prototype.update = function (time) {
    var delta = time - this.last_update;
    if (delta > 20) {
        return this.update(this.last_update + 20) && this.update(time);
    }
    else if (delta < 20)
        return true;
    this.last_update = time;
    if (time > this.dead)
        return false;
    //updating foreach type of weapon
}

exports.Bullet = Bullet;