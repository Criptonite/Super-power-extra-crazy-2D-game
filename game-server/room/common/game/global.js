var config = require("config/index");

exports.constants =
    {
        WEAPON:
            {
                //weapon types
                SIMPLE: 0,
                MEDIUM: 1,
                STRONG: 2,

                FRAME_DELTA_TIME : parseInt(config.get("game-server:update-time")),
                wea_tabl :
                    [
                        //weapon properties
                        {vel: 0,     period: 100,  lifetime: 200, radius: 0,   damage: 300,  patrons: 1,    name: "lightgun", },
                        {vel: 0,     period: 250,  lifetime: 200, radius: 0.3,   damage: 600,  patrons: 100,    name: "gun", },
                        {vel: 0,     period: 500,  lifetime: 200, radius: 0.6,   damage: 900,  patrons: 10,    name: "heavygun", }
                    ],
            },
        ITEM:
            {
                //item generating parameters
                HEALTH: 5,
                SHIELD: 6,
                name :
                    [
                        //item names
                        "LightGun", "Gun", "HeavyGun", "Health", "Shield"
                    ],
            },
        EVENT:
            {
               //evetn types
                BOT_SPAWN: 0,
                ITEM_SPAWN: 1,
                DAMAGE: 2,
                BOT_DEAD: 3,
                TAKE_WEAPON: 4,
                TAKE_ITEM: 5,

            },
    };
