"use strict";

var Console = require("libs/log")(module);
var Event = require("../utils/event").Event;
var Vector = require("../utils/mathUtil").Vector;
var normalizeAngle = require("../utils/mathUtil").normalizeAngle;
var cameraCulling = require("../objects/dynent").cameraCulling;
var ITEM = require("./global").constants.ITEM;
var WEAPON = require("./global").constants.WEAPON;
var itemForEach = require("../objects/item").itemForEach;

function Forbidden(max_count)
{
    //
    this.max_count = max_count;
    this.waypoints = [];
}

Forbidden.prototype.push = function(way)
{
    this.waypoints.push(way);
    if (this.waypoints.length > this.max_count)
        this.waypoints.splice(0, 1);
}

Forbidden.prototype.clear = function()
{
    this.waypoints.splice(0, this.waypoints.length);
}

Forbidden.prototype.check = function(way)
{
    for (var i = 0; i < this.waypoints.length; i++)
        if (this.waypoints[i] === way)
            return true;
    return false;
}

function Aibot(owner)
{
    this.owner = owner;
    this.reaction_time = 200 + (Math.random() * 300 | 0);
    this.angle_speed = 1 + Math.random();
    this.max_angle_speed = 1 + Math.random();
    this.accuracy = Math.random() * Math.random();
    if (owner.nick === "lyaguha")
    {
        this.reaction_time = 200;
        this.angle_speed = 2;
        this.max_angle_speed = 2;
        this.accuracy = 1;
    }
}

Aibot.prototype.update = function(dt)
{
    //aibot logic on level ai
    var game = this.owner.game;
    var level = game.level;
    var AI = level.getAI();

    function stay(self)
    {
        //imitates player doing noting
        self.owner.key_up = false;
        self.owner.key_left = false;
        self.owner.key_down = false;
        self.owner.key_right = false;
    }
    function moveTo(self, pos)
    {
       //moving
    }
    function angleTo(self, pos, koef)
    {
        //bot rotating
    }
    function findItem(self)
    {
        //finding item in radius
    }
    function botVisible(self, dynent)
    {
        //bot visibility
    }
    function findBot(self)
    {

    }
    function findShootedBot(self)
    {

    }
    function findBullet(self)
    {

    }
    function findObject(self)
    {

    }
    function checkNext(self)
    {

    }
    function getMostFronted(self, ways)
    {
        var pos = self.owner.dynent.pos;
        var dir = new Vector(-Math.sin(self.owner.dynent.angle), -Math.cos(self.owner.dynent.angle));
        var max_dot = -2;
        var way_with_max_dot = null;
        ways.forEach(function(way)
        {
            var to = Vector.sub(way.pos, pos).normalize();
            var dot = to.dot(dir);
            if (dot > max_dot)
            {
                max_dot = dot;
                way_with_max_dot = way;
            }
        });
        return way_with_max_dot;
    }
    function resetMaster(self, way)
    {

    }
    function resetState(self)
    {

    }
    function chooseNext(self, fronted_next, protect)
    {

        }
    }
    function safeMove(self)
    {
        //getting safety direction
    }
    function moveToPoint(self, point)
    {

    }
    function chooseWeapon(self, prior_rocket = 5)
    {
        //choocing weapon
    }
    function calcDirection(a, b, v, len)
    {

    }

    var ai_update = false;
    if (Date.now() > this.reaction)
    {
        ai_update = true;
        this.reaction = Date.now() + this.reaction_time;
    }

    switch (this.state)
    {
        //casing bot statements
    }

    switch (this.state_move)
    {
        //casing bot moving
    }

    this.owner.shoot = false;
    switch (this.state_head) {

    }
};
