"use strict";

function WeaponClient(type, shoot) {
	this.type = WEAPON.PISTOL;
	this.shooting = false;
	this.dead = 0;

	this.setType(type);
	if (shoot) this.shoot();
}

WeaponClient.prototype.setType = function(type) {
	if (this.type !== type) {
		this.type = type;
		this.shooting = false;
	}
};

WeaponClient.prototype.shoot = function() {

};

WeaponClient.prototype.renderShadow = function(camera, owner) {

};

WeaponClient.prototype.render = function(camera, owner) {

};

Weapon.ready = function() {

};

Weapon.load = function () {
	function loadWeapon(name, id, fire) {

	}

	//

	var vert = Shader.vertexShader(true, false, "gl_Position");
	var verticalTexture = Shader.vertexShader(true, true, "gl_Position");

	var fragmentNoShadow = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D texture;" +
		"uniform sampler2D textureVisible;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"" +
		"}";

	var fragmentNoShadowColor = "" +
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
		"" +
		"}";

	var verticalRoll = "" +
		"" +
		"";

	var fragmentRoll = "" +
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
		"" +
		"}";

	Weapon.shaderNoShadow = new Shader(vert, fragmentNoShadow,
		[
			"matPosition", "texture", "textureVisible",
		]);
	Weapon.shaderNoShadowColor = new Shader(vert, fragmentNoShadowColor,
		[
			"matPosition", "texture", "textureVisible", "color",
		]);
	Weapon.shaderNoShadowColorTexture = new Shader(verticalTexture, fragmentNoShadowColor,
		[
			"matPosition", "texture", "textureVisible", "color",
		]);
	Weapon.shaderRoll = new Shader(verticalRoll, fragmentRoll,
		[
			"matPosition", "matTexture", "texture", "textureVisible", "color", "normalVector",
		]);


};