"use strict";

function BulletClient(type, position, angle, power, id)
{
    this.type = type;
    this.power = power;
    this.id = id;
	this.dynent = new Dynent(pos, [1, 1], angle);

    var normalVector = new Vector(-Math.sin(angle), -Math.cos(angle));
	this.dynent.vel = Vector.mul(norm_dir, WEAPON.wea_tabl[type].vel);

	this.dead = Date.now() + WEAPON.wea_tabl[type].lifetime;
    this.last_update = Date.now();
}

BulletClient.prototype.update = function() {
	var delta = Date.now() - this.last_update;
	this.last_update = Date.now();

	if (Date.now() > this.dead)
		return false;

	if (this.type >= WEAPON.PLASMA)
	{
		this.dynent.update(delta);

		//collide map
		var level = gameClient.getLevelRender().getLevel();
		if (this.type === WEAPON.ZENIT)
		{
			var norm = new Vector(0, 0);
			var tile = level.getNorm(norm, this.dynent.pos);
			if (tile > 128)
			{
				norm.normalize();
				var dot = norm.dot(this.dynent.vel);
				if (dot > 0)
				{
					var reflect = norm.mul(2 * dot);
					this.dynent.vel.sub(reflect);
					this.dynent.angle = this.dynent.vel.angle() - Math.PI / 2;
				}
			}
		}
		else
		{
			if (level.getCollide(this.dynent.pos) > 128)
				return false;
		}

		if (this.type === WEAPON.ROCKET)
		{
			Particle.create(Particle.SMOKE, this.dynent.pos, null, 1);
		}
	}
	return true;
};

BulletClient.prototype.render = function(camera) {

};

function BulletLine(type, position, angle, power, size_y, dest) {
	this.type = type;
	this.power = power
	this.dynent = new Dynent(pos, [0.5, size_y], angle);
	this.dest = dest;

	this.norm_dir = new Vector(-Math.sin(angle), -Math.cos(angle));

	this.dead = Date.now() + WEAPON.wea_tabl[type].lifetime;
}

BulletLine.prototype.update = function()
{
	return Date.now() < this.dead;
};

BulletLine.prototype.render = function(camera) {

};

function BulletRoll(position, angle, power, size_y, dest, normalVector, nap, ownerid, time) {

}

BulletRoll.prototype.addBullet = function(bullet) {
	this.del = false;
	this.power = bullet.power;
	this.sound = bullet.sound;
	this.my_time = Date.now();

	this.old_bul = this.new_bul;
	this.new_bul = bullet;
};

BulletRoll.prototype.update = function() {
	var new_time = this.new_bul.time;
	var old_time = this.old_bul.time;
	var update_server_time = parseInt(config.get("game-server:update-time"));
	var current_time = new_time + (Date.now() - this.my_time) - update_server_time;
	var koef = (current_time - old_time) / (new_time - old_time);
	if (koef < 0) koef = 0;

	if (this.new_bul !== this.old_bul && this.old_bul !== this)
	{
		this.dynent.interpolate(this.old_bul.dynent, this.new_bul.dynent, koef);
		this.dynent.size.interpolate(this.old_bul.dynent.size, this.new_bul.dynent.size, koef);
		this.dest.interpolate(this.old_bul.dest, this.new_bul.dest, koef);
		this.nap.interpolate(this.old_bul.nap, this.new_bul.nap, koef);
		this.norm_dir.interpolate(this.old_bul.norm_dir, this.new_bul.norm_dir, koef);
	}

	var bot = gameClient.getBotById(this.ownerid);
	if (bot)
	{
		var Y = 0.9;
		var angle = bot.dynent.angle;
		var sina = Math.sin(angle);
		var cosa = Math.cos(angle);
		var position = Vector.add2(bot.dynent.pos, cosa * 0.25 - sina * Y, -cosa * Y - sina * 0.25);

		this.dynent.pos.copy(position);
		this.norm_dir.set(-sina, -cosa);
		this.nap = Vector.sub(this.dest, position);
		this.dynent.angle = this.nap.angle() - Math.PI / 2;

		var len = this.nap.length();
		this.dynent.pos.add(this.dest).mul(0.5);
		this.dynent.size.set(0.5, len);
	}

	Event.emit("bulletLineCollide", this, this.dest, this.norm_dir);

	if (this.del)
	{
		Weapon.skins[this.type].sndShoot.snd.stop(this.sound);
	}
	return !this.del;
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
    //
    //

	if (bullet.sound)
	{
		var id = Weapon.skins[bullet.bulletType].snd_shoot.play(bullet.pos);
		if (bullet.power === ITEM.QUAD)
		{
			Weapon.skins[bullet.bulletType].snd_shoot.snd.rate(2, id);
		}
	}

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