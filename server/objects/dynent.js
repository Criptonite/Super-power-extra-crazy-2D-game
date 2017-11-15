"use strict";

var Vector = require("../libs/vector").Vector;

//pos - Vector
//size - Vector
//vel - Vector
function Dynent(pos, size, angle)
{
    this.pos = new Vector(pos);
    this.size = size === undefined ? new Vector(1, 1) : new Vector(size);
    this.vel = new Vector(0, 0);
    this.angle = angle === undefined ? 0.0 : angle;
}

Dynent.prototype.update = function(dt)
{
    //update
}

//return Vector
Dynent.prototype.collide = function(dyn, size)
{
    //collide
}

//size - Vector
function cameraCulling(camera, pos, size, offset_x = 12, offset_top = 11, offset_bottom = -2)
{
    //camera vision
    var object_radius = size.length() * 0.5;
    var vec = Vector.sub(pos, camera.pos).rotate(camera.angle);

    return Math.abs(vec.x) - object_radius > offset_x || (vec.y - object_radius > offset_top || vec.y + object_radius < offset_bottom);
}

exports.Dynent = Dynent;
exports.cameraCulling = cameraCulling;