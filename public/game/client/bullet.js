"use strict";

function BulletClient(type, position, angle, power, id)
{
    this.type = type;
    this.power = power;
    this.id = id;

    var normalVector = new Vector(-Math.sin(angle), -Math.cos(angle));

    //this.dead
    this.last_update = Date.now();
}

BulletClient.prototype.update = function() {

};

BulletClient.prototype.render = function(camera) {

};

function BulletLine(type, position, angle, power, size_y, dest) {

}

BulletLine.prototype.update = function()
{

};

BulletLine.prototype.render = function(camera) {

};

function BulletRoll(position, angle, power, size_y, dest, normalVector, nap, ownerid, time) {

}

BulletRoll.prototype.addBullet = function(bullet) {

};

BulletRoll.prototype.update = function() {

};

BulletRoll.prototype.render = function(camera) {

};

BulletClient.bullets = [];
BulletLine.bullets = [];
BulletRoll.bullets = [];

BulletClient.remove = function(bullet_id) {
    for (var i = 0; i < BulletClient.bullets.length; i++)
        if (BulletClient.bullets[i].id === bullet_id)
        {
            Event.emit("bulletDead", BulletClient.bullets[i]);
            return BulletClient.bullets.splice(i, 1);
        }
};

BulletClient.create = function(bullet) {

};

Event.on("frame", () => {
    BulletRoll.bullets.forEach((bullet) =>
    {
        bullet.del = true;
    });
});

BulletRoll.create = function(serverTime, bullet) {

};

BulletLine.create = function(serverTime, bullet){

};

function renderBullets(camera, bullets){

}

BulletClient.render = function(camera)
{
    gl.enable(gl.BLEND);
    renderBullets(camera, BulletClient.bullets, true);
    renderBullets(camera, BulletLine.bullets, false);
    renderBullets(camera, BulletRoll.bullets, false);
    gl.disable(gl.BLEND);
};