"use strict";

var Algorithm = require("../utils/algorithms").Algorithm;
var Console = require("libs/log")(module);
var Vector = require("../utils/mathUtil").Vector;

function Waypoint(pos, dist)
{
    //waypoint for ai traectory
    this.pos = pos;
    this.dist = dist;
    this.next = [];
    this.deleting_edges = [];
}

Waypoint.prototype.del_next = function(next)
{
    for (var i = 0; i < this.next.length; i++)
    {
        if (this.next[i] === next)
        {
            this.next.splice(i, 1);
            break;
        }
    }
}

Waypoint.prototype.normalize = function()
{
    for (var i = 0; i < this.next.length - 1; i++)
    {
        for (var j = i + 1; j < this.next.length;)
        {
            if (this.next[i] === this.next[j])
                this.next.splice(j, 1);
            else
                j++;
        }
    }
}

function AI(level)
{
    var time = Date.now();

    var obstruction_map = level.getLevelGeneration().getObstructionMap();
    var raw_level = level.getLevelGener().getRawLevel();

    var distance_field = new Algorithm(obstruction_map.getSize() * 2);
    var level = new Algorithm(obstruction_map.getSize() * 2);
    level.draw(obstruction_map);
    distance_field.copy(level);

    const MAX_VALUE = 256;
    distance_field.normalize(0, MAX_VALUE).for_each(function(val, x, y)
    {
        //normalizing distances between waypoints
        if (x === 0 || x === distance_field.getSize() - 1 ||
            y === 0 || y === distance_field.getSize() - 1)
            return MAX_VALUE;
        else return val;
    });

    function distance_step_forward()
    {

    }
    function distance_step_backward()
    {

    }

    distance_step_forward();
    distance_step_backward();

    var gradient_x = new Algorithm(level.getSize());
    var gradient_y = new Algorithm(level.getSize());

    function calc_gradient()
    {
       //gradient calculating
    }

    calc_gradient();

    gradient_x.normalize(-1, 1);
    gradient_y.normalize(-1, 1);

    const POROG = 0.4;      //

    var waypoints = [];

    function find_waypoints()
    {
        //finding and sorting waypoints for AI
    }

    function calc_hash(size_ceil)
    {

    }

    function hash_forEach(hash, waypoint, size_ceil, callback)
    {
        //hash calculating for waypoints
    }
    function delete_waypoints()
    {
        //removing waypoints by del_next
    }
    function filter_nearest()
    {
        //removing waypoints which are too close
    }

    const MAX_DIST = 10 * 2;
    function visible(a, b, buffer, max_val, max_dist)
    {
        var norm = Vector.sub(b, a);
        var len = norm.length();
        if (len > max_dist)
            return false;

        //tracing there
        norm.normalize();
        for (var step = 1; step < len; step++)
        {
            var vec = Vector.mul(norm, step);
            var pos = Vector.add(a, vec);
            var x = (pos.x + 0.5) | 0;
            var y = (pos.y + 0.5) | 0;
            if (buffer.getData(x, y) > max_val)
                return false;
        }
        return true;
    }
    function build_graph()
    {
        //building graph on created waypoints with hash
    }
    function filter_triangle_pattern()
    {

    function filter_pipirks()
    {

    }
    function div_coord()
    {
        //getting step in twice smaller
    }

    find_waypoints();
    Console.debug("Count waypoints = ", waypoints.length);
    filter_nearest();
    Console.debug("Count waypoints after filter nearest = ", waypoints.length);
    build_graph();
    filter_triangle_pattern();
    filter_pipirks();
    Console.debug("Count waypoints after filter pipirks = ", waypoints.length);
    div_coord();

    const WAYPOINT_VISIBLE_DIST = MAX_DIST / 2;
    AI.OBJECT_VISIBLE_DIST = WAYPOINT_VISIBLE_DIST * Math.sqrt(2);
    var hash_max_dist = calc_hash(WAYPOINT_VISIBLE_DIST);

    this.isVisible = function(my_pos, pos, val = 2.5, max_dist = WAYPOINT_VISIBLE_DIST)
    {
        var a = Vector.mul(my_pos, 2);
        var b = Vector.mul(pos, 2);
        return visible(a, b, distance_field, MAX_VALUE - val, max_dist * 2);
    }
    this.botVisible = function(my_pos, bot_pos)
    {
        return visible(my_pos, bot_pos, raw_level, 0.5, AI.OBJECT_VISIBLE_DIST);
    }
    this.getVisibleWaypoint = function(dynent)
    {
        var ret = [];
        var self = this;
        hash_forEach(hash_max_dist, dynent, WAYPOINT_VISIBLE_DIST, function(next)
        {
            if (self.isVisible(dynent.pos, next.pos, 0.5))
            {
                ret.push(next);
            }
        });
        return ret;
    }
    this.getGradient = function(my_pos)
    {
        var x = my_pos.x * 2 | 0;
        var y = my_pos.y * 2 | 0;

        var grad_x = gradient_x.getData(x, y);
        var grad_y = gradient_y.getData(x, y);
        var vec = new Vector(grad_x, grad_y);
        return vec.normalize();
    }

    Console.info("AI = ", Date.now() - time);
}

exports.AI = AI;