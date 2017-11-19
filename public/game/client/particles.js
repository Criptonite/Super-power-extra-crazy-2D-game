"use strict";

function Particle(type, position, myVector) {
	this.dynent = new Dynent(position, [1, 1], Math.random() * Math.PI * 2);
	this.type = type;
	this.time = Date.now();
	this.lifetime = 400;
	this.last_update = Date.now();

	if (type & Particle.EXPLODE)
	{
		this.lifetime = 500;
		var size = type === Particle.EXPLODE_ROCKET ? 4 : 1;
		if (type === Particle.EXPLODE_PLASMA_QUAD) size = 1.5;
		this.dynent.size.set(size, size);
	}
	else if (type == Particle.RESPAWN)
	{
		this.dynent.size.set(1.5, 1.5);
		this.lifetime = 500;
	}
	else if (type & (Particle.BLOOD | Particle.SPARK))
	{
		this.dynent.angle = dir.angle() - Math.PI / 2;
		var nap = Vector.mul(dir, 0.5);
		this.dynent.pos.add(nap);
		this.dynent.size.set(2, 2);
		this.lifetime = 300;
		if (Math.random() < 0.5) this.dynent.size.x *= -1;
	}
	else if (type & Particle.SPLASH)
	{
			this.dynent.size.set(4, 4);
			this.lifetime = 500;
	}
	else if (type & Particle.GIB)
	{
		var norm = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1).mul(0.006);
		this.dynent.vel = Vector.add(norm, myVector);
		this.lifetime = 10000;
		this.omega = (Math.random() * 2 - 1) * 0.03;
		this.id = (Math.random() * 8) | 0;
	}
}

Particle.prototype.update = function() {
	var dt = Date.now() - this.last_update;
	this.last_update = Date.now();

	var delta = Date.now() - this.time;
	if (delta > this.lifetime)
	{
		if (this.type & Particle.BLOOD)
		{
			var color = this.type === Particle.BLOOD_RED ? [0.5, 0, 0, 1] : [0, 0.5, 0, 1];
			Decal.render_decal(this.dynent, Particle.spark_textures[Particle.COUNT_KADR - 1], color);
		}
		return false;
	}
	if (this.type & Particle.GIB)
	{
		this.dynent.update(dt);
		this.dynent.angle += this.omega * dt;

		this.dynent.vel.mul(0.98);
		this.omega *= 0.98;

		//collide map
		var level = gameClient.getLevelRender().getLevel();
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
				this.omega *= -1;
			}
		}
		//collide lava
		var my_pos = this.dynent.pos;
		if (level.collideLava(my_pos))
		{
			var bridge = level.getCollideBridges(my_pos);
			if (bridge === null)
			{
				Particle.create(Particle.SPLASH_LAVA_SMALL, this.dynent.pos, null, 1);
				return false;
			}
		}

		if (this.old_gib_pos === undefined) this.old_gib_pos = new Vector(this.dynent.pos);
		var length = Vector.sub(my_pos, this.old_gib_pos).length2();
		if (length > 0.4 * 0.4)
		{
			var alpha = 1 - delta / this.lifetime;
			if (alpha < 0) alpha = 0;
			var rnd = this.rnd * 0.2;
			var color = this.type === Particle.GIB_RED ?
				[0.5 + rnd, 0, 0, alpha * 0.5 + rnd] :
				[0, 0.5 + rnd, 0, alpha * 0.5 + rnd];
			Decal.render_decal(this.dynent, Particle.tex_blood, color);
			this.old_gib_pos.copy(this.dynent.pos);
		}
	}
	return true;
};

Particle.prototype.render = function(camera) {

};

Event.on("botRespawn", function(pos) {

});

Event.on("botAche", function(pos, myVector, id) {

});

Event.on("botDead", function(pos, myVector, id) {

});

Event.on("bulletBlock", function(bullet, dest, norm_myVector) {

});

Event.on("bulletEnd", function(bullet) {

});

Particle.ready = function() {

};

Particle.load = function() {
    Particle.COUNT_KADR = 32;

    function createFlash() {
        
    }
    function createSplash() {

    }
    Particle.flashTextures = createFlash();
    Particle.splashTextures = createSplash();

    //performance

    var vert = Shader.vertexShader(true, false, "gl_Position");

    var verticalExplode = "" +
        "attribute vec4 position;" +
        "" +
        "void main() {" +
        "" +
        "}";

    var fragmentExplode = "" +
        "#ifdef GL_ES" +
        "precision highp float;" +
        "#endif" +
        "" +
        "uniform sampler2D texture;" +
        "uniform sampler2D textureVisible;" +
        "" +
        "void main() {" +
        "" +
        "}";

    var fragmentSmoke = "" +
        "#ifdef GL_ES" +
        "precision highp float;" +
        "#endif" +
        "" +
        "uniform sampler2D texture;" +
        "uniform sampler2D textureVisible;" +
        "" +
        "void main() {" +
        "" +
        "}";

    var fragmentBlood = "" +
        "#ifdef GL_ES" +
        "precision highp float;" +
        "#endif" +
        "" +
        "uniform sampler2D texture;" +
        "uniform sampler2D textureVisible;" +
        "" +
        "void main() {" +
        "" +
        "}";

    var fragmentColor = "" +
        "#ifdef GL_ES" +
        "precision highp float;" +
        "#endif" +
        "" +
        "uniform sampler2D texture;" +
        "uniform sampler2D textureVisible;" +
        "" +
        "void main() {" +
        "" +
        "}";

    Particle.shaderExplode = new Shader(verticalExplode, fragmentExplode,
        [
            "matPosition", "dtc", "texture", "textureVisible",
        ]);
    Particle.shaderSmoke = new Shader(vert, fragmentSmoke,
        [
            "matPosition", "dtc", "texture", "color"
        ]);
    Particle.shaderRespawn = new Shader(verticalExplode, Weapon.fragmentNoShadowColor,
        [
            "matPosition", "dtc", "texture", "textureVisible" , "color"
        ]);
    Particle.shaderBlood = new Shader(vert, fragmentBlood,
        [
            "matPosition", "texture", "textureVisible", "color", "koef"
        ]);
    Particle.shaderGib = new Shader(verticalExplode, fragmentColor,
        [
            "matPosition", "dtc", "texture", "textureVisible", "color",
        ]);
};

Particle.create = function(type, pos, myVector, count) {

};

Particle.render = function(camera, layer) {

};



