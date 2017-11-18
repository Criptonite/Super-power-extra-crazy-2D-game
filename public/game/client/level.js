"use strict";

function LevelRender() {
	let vert = Shader.vertexShader(false, true, "position");
	let vertSimple = Shader.vertexShader(true, false);

	let fragmentNormal = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D texture;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"vec4 col = texture2D(tex, textureCoordination.xy);" +
		"gl_FragColor = col;" +
		"}";

	let fragmentOnLevel = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D levelMap;" +
		"uniform sampler2D textureGround_1;" +
		"uniform sampler2D textureGround_2;" +
		"uniform sampler2D textureWall;" +
		"uniform sampler2D textureVisible;" +
		"uniform sampler2D textureDecal;" +
		"uniform vec4 gage;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"vec4 level = texture2D(levelMap, textureCoordination.xy);" +
		"vec4 visible = texture2D(textureVisible, textureCoordination.zw);" +
		"vec4 decal = texture2D(textureDecal, textureCoordination.zw);" +
		"vec4 ground_1 = texture2D(textureGround_1, textureCoordination.xy * gage.xy);" +
		"vec4 ground_2 = texture2D(textureGround_2, textureCoordination.xy * gage.xy);" +
		"vec4 wall = texture2D(textureWall, textureCoordination.xy * gage.xy);" +
		"" +
		"float shadow = clamp((1.0 - visible.g) * 6.0 - 3.0, 0.5, 1.0);" +
		"" +
		"float ground_mask = clamp((ground_2.a - level.b + 0.2) * 2.5, 0.0, 1.0);" +
		"vec4 ground = mix(ground_2, ground_1, ground_mask);" +
		"ground = mix(ground, decal, decal.a);" +
		"" +
		"ground = mix(ground) * shadow;" +
		"wall.rgb *= 2.0 * (1.0 - level.g) * shadow;" +
		"vec2 level_mask = clamp((level.rg * 2.0 - 1.0) * 30.0, 0.0, 1.0);" +
		"float visible_mask = 1.0 - visible.r;" +
		"gl_FragColor = vec4(visible_mask * mix(ground.rgb, wall.rgb, level_mask.g), 1.0);" +
		"}";

	let fragmentOnLevelSmall = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"void main() {" +
		"" +
		"}";

	let fragmentTide= "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D noise;" +
		"uniform vec4 gageTime;" +
		"" +
		"void main() {" +
		"" +
		"}";

	let fragmentSmallMap = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"void main() {" +
		"" +
		"}";

	let verticalVisible = "" +
		"attribute vec4 position;" +
		"uniform mat4 matTexture;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"" +
		"}";

	let fragmentVisible = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"void main() {" +
		"" +
		"}";

	let verticalPosition = Shader.vertexShader(true, false, "gl_Position");

	let fragmentPosition = ""+
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"void main() {" +
		"" +
		"}";

	let shaderPosition = new Shader(verticalPosition, fragmentPosition, ["matPosition", "texture", "textureVisible", "textureDecal",]);

	let shaderLevel = new Shader(vert, fragmentOnLevel,
		[
			"matTexture", "levelMap", "textureGround_1",
			"textureGround_2", "textureWall", "textureVisible", "textureDecal", "gage",
		]);
	let shaderOnLevelSmall = new Shader(vert, fragmentOnLevelSmall,
		[
			"matTexture", "levelMap", "textureGround_1", "textureWall", "textureVisible", "gage",
		]);
	let shaderTide = new Shader(vert, fragmentTide,
		[
			"matTexture", "noise", "gageTime",
		]);
	let shaderNormal = new Shader(vertSimple, fragmentNormal,
		[
			"matPosition", "texture",
		]);
	let shaderSmallMap = new Shader(vertSimple, fragmentSmallMap, ["matPosition", "levelMap", "position",]);
	let shaderVisible = new Shader(verticalVisible, fragmentVisible, ["matTexture", "levelMap",]);

	var textureNoise = new Texture("");
	var textureGround1 = new Texture("");
	var textureGround2 = null;
	var textureWall = new Texture("");
	var textureNodePosition = new Texture("");

	Buffer.loadImage("", function(R, G, B)
	{
		var ground_mask = new Buffer(R.getSize());
		ground_mask.perlin(32, 0.5).normalize(0, 1);
		textureGround2 = Buffer.create_texture(R, G, B, ground_mask);
	});

	function ready()
	{
		return textureGround2 !== null &&
			textureNoise.ready() &&
			textureGround1.ready() &&
			textureGround2.ready() &&
			textureWall.ready() &&
			textureNodePosition.ready();
	}



}
