"use strict";

var Console = require("libs/log")(module);
var Generate = require("./generation").LevelGeneration;
var AI = require("./ai").AI;
var Vector = require("../utils/mathUtil").Vector;
var Random = require("../utils/mathUtil").Random;
var Dynent = require("../objects/dynent").Dynent;

function Level(levelSizeClass) {

    this.getLevelGeneration = function() {
        return level;
    }
    this.getAI = function () {
        return ai;
    }
    this.getItemPos = function () {
        return itemPos;
    }

    this.getCollide = function (pos) {
        
    }
    
    this.getNorm = function (dest, pos) {
        
    }
    
    this.collideMap = function (pos, factor) {
        
    }
    
    this.getSafetyDirection = function (pos) {
        
    }
    
    this.getRandomPos = function(rand)
    {
        // generate random pos on map
        var random_generator = rand ? rand.next : Math.random;
        while (true)
        {
            var x = my_board_width + random_generator() * (level.getSize() - my_board_width - 1) | 0;
            var y = my_board_width + random_generator() * (level.getSize() - my_board_width - 1) | 0;
            var pos = new Vector(x, y);
            if (!this.collideMap(pos, 50))
                return pos;
        }
    };
    this.getMaxPlayers = function()
    {
        // calc count players.
    };

    function generItemPos(level)
    {
        // create bot if count<getMaxPlayers() in getRandomPos()
    }

    const my_size_class = size_class;    // 0 - 64, 1 - 128, 2 - 256
    const my_board_width = 5;

    var level = new Generate.LevelGeneration(my_size_class, my_board_width);
    var my_size = level.getSize();

    //AI
    var ai = new AI(this);
    var itemPos = generItemPos(this);

}

exports.Level = Level;