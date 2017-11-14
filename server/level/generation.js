"use strict";

var Algorithm;

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


    this.getSize = function()
    {
        return my_size;
    }

    this.getRawLevel = function()
    {
        return raw_level;
    }
}

exports.LevelGeneration = LevelGeneration;