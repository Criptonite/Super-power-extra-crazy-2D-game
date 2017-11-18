"use strict";

function BotClient(server_time, serverBot, isCamera) {
	this.id = serverBot.id;
	this.controlable = serverBot.controlable;
	var skinId = this.id % Bot.skinnames.length;
	this.skin = Bot.skinnames[skinId];
	this.old_frame_dynent = null;
	this.new_frame_dynent = new Dynent([serverBot.x, serverBot.y], [1, 1], serverBot.angle);
	this.old_frame_time = 0;
	this.new_frame_time = server_time;
	this.dynent = new Dynent([serverBot.x, serverBot.y], [1, 1], serverBot.angle);
	this.weapon = new WeaponClient(serverBot.weapon, serverBot.shoot);

	this.begin_of_walk = 0;
	this.leg_angle = 0;
	this.key_up = false;
	this.key_right = false;
	this.key_down = false;
	this.key_left = false;

	this.addFrame(server_time, serverBot, isCamera);
}

BotClient.prototype.addFrame = function(server_time, serverBot, isCamera) {
	assert(this.id === serverBot.id);
	this.old_frame_dynent = this.new_frame_dynent;
	this.new_frame_dynent = new Dynent([serverBot.x, serverBot.y], [1, 1], serverBot.angle);
	this.old_frame_time = this.new_frame_time;
	this.new_frame_time = server_time;
	this.my_time = Date.now();

	this.alive = serverBot.alive;
	this.power = serverBot.power;
	this.protection = serverBot.protection;
	this.weapon.setType(serverBot.weapon);
	if (serverBot.shoot) this.weapon.shoot();
	this.seria = serverBot.seria;

	this.life = serverBot.life;
	this.patrons = serverBot.patrons;

	if (isCamera) {

	}

	var myVector = Vector.sub(this.new_frame_dynent.pos, this.old_frame_dynent.pos);
	this.speed = myVector.length() / (this.new_frame_time - this.old_frame_time);
	this.direction = myVector.normalize().rotate(this.new_frame_dynent.angle);
	this.direction.y *= -1;

	this.direction.mul(100);
	this.direction.x = this.direction.x | 0;
	this.direction.y = this.direction.y | 0;
};

BotClient.prototype.update = function() {
	var new_time = this.new_frame_time;
	var old_time = this.old_frame_time;
	var update_server_time = parseInt(config.get("game-server:update-time"));
	var current_time = new_time + (Date.now() - this.my_time) - update_server_time;
	var koef = new_time === old_time ? 0 : (current_time - old_time) / (new_time - old_time);
	if (koef < 0) koef = 0;

	this.dynent.interpolate(this.old_frame_dynent, this.new_frame_dynent, koef);

	if (this.controlable)
	{
		this.dynent.angle = getMouseAngle();
	}

	//animation
	function update_leg(self)
	{
		if (self.speed < Bot.SPEED * 0.5)
		{
			self.begin_of_walk = 0;
		}
		else if (self.begin_of_walk === 0)
		{
			self.begin_of_walk = Date.now();
		}
	}

	update_leg(this);
};

BotClient.prototype.renderShadow = function(camera) {
	if (!this.alive)
		return;

	var pos = Vector.sub(this.dynent.pos, sun_direction);
	Dynent.render(camera, Bot.skins[this.skin].sh_body,
		Bot.shader_shadow, pos, [1.2, 1.2], this.dynent.angle);
	this.weapon.renderShadow(camera, this);
};

BotClient.prototype.render = function(camera) {
	if (!this.alive)
		return;

	function renderLeg(self, val, dx) {

	}

	function renderNimbus(self) {

	}

	function renderProtection(self) {

	}

	function renderBody(self) {
		if (!cameraCulling(camera, self.dynent.pos, self.dynent.size)) {
			var speed = self.power === ITEM.SPEED ? Bot.SPEED * 1.5 : Bot.SPEED;
			const period = 500 * Bot.SPEED / speed;
			var time = Date.now();
			var step = (time - self.begin_of_walk) / period;
			if (self.begin_of_walk === 0) step = 0;
			var val = step - (step | 0);

			var angle = self.direction.angle() + Math.PI / 2;
			if (angle > Math.PI / 2) angle -= Math.PI;
			else if (angle < -Math.PI / 2) angle += Math.PI;
			self.leg_angle += (angle - self.leg_angle) * 0.2;

			//left leg
			renderLeg(self, val, 0);
			//right leg
			val += 0.5;
			if (val >= 1) val -= 1;
			renderLeg(self, val, 0.4);

			renderNimbus(self);
			self.dynent.render(camera, Bot.skins[self.skin].body, Bot.shader_bot);
			renderProtection(self);
		}
	}

	renderBody(this);
	this.weapon.render(camera, this);
};

BotClient.prototype.renderStats = function(camera) {

};

//unusual skins

Bot.ready = function() {
	for (var i = 0; i < Bot.skins.length; i++)
		if (!Bot.skins[i].ready())
			return false;
	return Bot.textureProtection.ready();
};

Bot.load = function() {
	function LoadSkin(name, x) {
		var path = "textures/skins/" + name + "/";
		var skin =
			{
				body: new Texture(path + "body.png", {wrap: gl.CLAMP_TO_EDGE}),
				leg: new Texture(path + "leg.png", {wrap: gl.CLAMP_TO_EDGE}),
				legback: new Texture(path + "legback.png", {wrap: gl.CLAMP_TO_EDGE}),
				sh_body: new Texture(path + "sh_body.png", {wrap: gl.CLAMP_TO_EDGE}),
				x: x,
			};
		skin.ready = function()
		{
			return this.body.ready() &&
				this.leg.ready() &&
				this.legback.ready() &&
				this.sh_body.ready();
		};
		Bot.skins[name] = skin;
		Bot.skinNames.push(name);
	}

	Bot.textureProtection = new Texture("textures/fx/botProtection.png", { wrap: gl.CLAMP_TO_EDGE }),
		Bot.skins = {};
	Bot.skinnames = [];

	LoadSkin("apier", -0.2);

	var vert = Shader.vertexShader(true, false, "gl_Position");

	var fragment = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D texture;" +
		"uniform sampler2D textureVisible;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"vec4 color = texture2D(texture, textureCoordination.xy);" +
		"vec4 visible = texture2D(textureVisible, textureCoordination.zw);" +
		"float shadow = clamp((1.0 - visible.g) * 6.0 - 3.0, 0.5, 1.0);" +
		"float contour = abs(col.a * 2.0 - 1.0);" +
		"col.rgb *= (1.0 - visible.r) * shadow * contour;" +
		"fragmentColor = color; }";
	var fragmentShadow = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D texture;" +
		"uniform sampler2D textureVisible;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"float alpha = texture2D(texture, textureCoordination.xy).a;" +
		"vec4 visible = texture2D(textureVisible, textureCoordination.zw);" +
		"float shadow = clamp((1.0 - visible.g) * 6.0 - 3.0, 0.5, 1.0);" +
		"shadow = (shadow - 0.5) * 2.0;" +
		"alpha *= 0.5 * shadow;" +
		"fragmentColor = vec4(1.0 - alpha); }";
	var fragmentNimbus = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D texture;" +
		"uniform sampler2D textureVisible;" +
		"varying vec4 textureCoordination;" +
		"uniform vec4 color;" +
		"" +
		"void main() {" +
		"vec4 col = texture2D(texture, textureCoordination.xy);" +
		"vec4 visible = texture2D(textureVisible, textureCoordination.zw);" +
		"color.a *= 1.0 - visible.r;" +
		"fragmentColor = color * col.a; }";

	Bot.shaderBot = new Shader(vert, fragment,
		[
			"mat_pos", "texture", "textureVisible",
		]);
	Bot.shaderShadow = new Shader(vert, fragmentShadow,
		[
			"mat_pos", "texture", "textureVisible",
		]);
	Bot.shaderNimbus = new Shader(vert, fragmentNimbus,
		[
			"mat_pos", "texture", "textureVisible", "color",
		]);

	//sounds
};

