"use strict";

var Algorithm = require ("../utils/algorithms").Algorithm;
var Console = require("libs/log")(module);
var Vector = require("../utils/mathUtil").Vector;

function LevelGeneration(size_class, board_size)
{
    Console.assert(size_class === 0 || size_class === 1 || size_class === 2);
    const my_size = 64 << size_class;

    var now = Date.now();
    var raw_level = new Algorithm(my_size);
    // generate full map
    raw_level.perlin(5 << size_class, 0.3).normalize(0, 1).for_each(function(val)
    {
        return Math.abs(val - 0.5) * 2;
    }).normalize(-0.5, 2).clamp(0, 1).for_each(function(val)
    {
        return val < 0.2 ? 0 : 1;
    });

    var border = new Algorithm(my_size);
    //generate border
    border.for_each(function(val, x, y)
    {
        return x < board_size ||
        y < board_size ||
        x > border.getSize() - board_size ||
        y > border.getSize() - board_size ? 1 : 0;
    });

    // final raw map
    raw_level.for_buf(border, function(a, b)
    {
        return Math.max(a, b);
    });

    //Post-processing
    var blured = raw_level.getGaussian(3);
    raw_level.for_buf(blured, function(a, b)
    {
        if (a > 0.5 && b < 0.5) return 0;
        if (a < 0.5 && b > 0.5) return 1;
        return a;
    }).filter(0).fill_isolated_area();

    //create level
    var level = new Buffer(my_size * 2);
    level.draw(raw_level);
    var blured_level = level.getGaussian(4);

    //obstruction map
    var obstruction_map = new Buffer(raw_level.getSize());
    obstruction_map.for_buf(raw_level, function(a, b)
    {
        return b;
    }).for_buf(river.raw_river, function(a, b)
    {
        return Math.max(a, b);
    });

    this.getSize = function()
    {
        return my_size;
    }

    this.getRawLevel = function()
    {
        return raw_level;
    }

    this.getObstructionMap = function()
    {
        return obstruction_map;
    }
}

exports.LevelGeneration = LevelGeneration;