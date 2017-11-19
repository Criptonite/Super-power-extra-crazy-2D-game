"use strict";

function LevelRender(myLevel, mySize) {
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
		"vec4 color = texture2D(texture, textureCoordination.xy);" +
		"fragmentColor = color;" +
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
		"fragmentColor = vec4(visible_mask * mix(ground.rgb, wall.rgb, level_mask.g), 1.0);" +
		"}";

	let fragmentOnLevelSmall = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D levelMap;" +
		"uniform sampler2D textureGround_1;" +
		"uniform sampler2D textureGround_2;" +
		"uniform sampler2D textureWall;" +
		"uniform sampler2D textureVisible;" +
		"uniform vec4 gage;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"vec4 level = texture2D(levelMap, textureCoordination.xy);" +
		"vec4 visible = texture2D(textureVisible, textureCoordination.zw);" +
		"vec4 ground = texture2D(textureGround_1, textureCoordination.xy * gage.xy);" +
		"vec4 wall = texture2D(textureWall, textureCoordination.xy * gage.xy);" +
		"" +
		"float shadow = clamp((1.0 - visible.g) * 6.0 - 3.0, 0.5, 1.0);" +
		"wall.rgb *= 2.0 * (1.0 - level.g) * shadow;" +
		"vec2 level_mask = clamp((level.rg * 2.0 - 1.0) * 30.0, 0.0, 1.0);" +
		"float visible_mask = 1.0 - visible.r;" +
		"ground = mix(ground, lava, level_mask.r) * shadow;" +
		"fragmentColor = vec4(visible_mask * mix(ground.rgb, wall.rgb, level_mask.g), 1.0);" +
		"" +
		"}";

	let fragmentTide= "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D noise;" +
		"uniform vec4 gageTime;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"vec2 scale = gageTime.xy;" +
		"vec2 time = gageTime.zw;" +
		"vec4 n = texture2D(noise, 1.5 * textureCoordination.xy * gage.xy);" +
		"vec4 d1 = texture2D(noise, (textureCoordination.xy * gage.xy + time.xy));" +
		"vec4 d2 = texture2D(noise, (textureCoordination.xy * gage.xy + time.yx) * 2.0);" +
		"vec4 d3 = texture2D(noise, (textureCoordination.xy * gage.xy + vec2(1.0-time.x, 1.0) * 4.0);" +
		"vec4 d4 = texture2D(noise, (textureCoordination.xy * gage.xy + vec2(1.0, 1.0-time.x) * 8.0);" +
		"vec2 d = (d1.rg + d2.gr + d3.rg + d4.gr) * 0.25;" +
		"" +
		"fragmentColor = vec4(d.rg, n.g, 0.0);" +
		"}";

	let fragmentSmallMap = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"varying vec4 textureCoordination;" +
		"uniform sampler2D levelMap;" +
		"uniform vec4 position;" +
		"" +
		"void main() {" +
		"" +
		"vec4 level = texture2D(levelMap, textureCoordination.xy);" +
		"float coef = clamp(0.05 / length((textureCoordination.xy * 2.0 - 1.0) - 2.0 * position.xy), 0.9, 1.0);" +
		"coef = (coef - 0.9) * 10.0;" +
		"level = clamp((level * 2.0 - 1.0) * 1.0, 0.0, 1.0);" +
		"float alpha = (level.g + level.r) * 0.5 + coef;" +
		"fragmentColor = vec4(level.g + level.r + coef, level.gg + vec2(coef), alpha);" +
		"}";

	let verticalVisible = "" +
		"attribute vec4 position;" +
		"uniform mat4 matTexture;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"Position = position" +
		"textureCoordination = mat_tex * position;" +
		"vec4 texCoord = matTexture * vec4(0.0, -0.75, 0.0, 1.0);" +
		"textureCoordination.zw = texCoord.xy;" +
		"}";

	let fragmentVisible = "" +
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"varying vec4 textureCoordination;" +
		"uniform sampler2D levelMap;" +
		"" +
		"void main() {" +
		"" +
		"vec2 d = (textureCoordination.zw - textureCoordination.xy) / 12.0;" +
		"float res = 0.0;" +
		"const float minValue = 0.6;" +
		"vec4 level = texture2D(levelMap, textureCoordination.xy);" +
		"res += clamp(level.g, min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 2.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 3.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 4.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 5.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 6.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 7.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 8.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 9.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 10.0).g,), min_val, 1.0);" +
		"res += clamp(texture2D(levelMap, textureCoordination.xy + d * 11.0).g,), min_val, 1.0);" +
		"fragmentColor = vec4((res - minValue * 12.0) * 2.5, level.a);" +
		"" +
		"}";

	let verticalPosition = Shader.vertexShader(true, false, "gl_Position");

	let fragmentPosition = ""+
		"#ifdef GL_ES" +
		"precision highp float;" +
		"#endif" +
		"" +
		"uniform sampler2D texture;" +
		"uniform sampler2D textureVisible;" +
		"uniform sampler2D textureDecal;" +
		"varying vec4 textureCoordination;" +
		"" +
		"void main() {" +
		"" +
		"vec4 color = texture2D(texture, textureCoordination.xy);" +
		"vec4 visible = texture2D(textureVisible, textureCoordination.zw);" +
		"vec4 decal = texture2D(textureDecal, textureCoordination.zw);" +
		"float shadow = clamp((1.0 - visible.g) * 6.0 - 3.0, 0.5, 1.0);" +
		"color.rgb = mix(color.rgb, decal.rgb, decal.a);" +
		"color.rgb *= (1.0 - visible.r) * shadow;" +
		"fragmentColor = color;" +
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

	var frameBufTide = new Framebuffer(512, 512);
	var frameBufVisible = new Framebuffer(64, 64);
	LevelRender.textureVisibleID = frameBufVisible.getTexture();
	LevelRender.shader_simple = shaderNormal;

	var level = myLevel.getLevelGener();
	var my_size = level.getSize();

	var mask = new Buffer(level.getTextureSize());
	mask.perlin(5 << mySize, 0.5).normalize(-5, 6).clamp(0, 1);

	var shadow = new Buffer(level.getTextureSize());
	shadow.shadow(level.getGroundMap(), sun_direction)

	var texture = Buffer.create_texture(level.getRiverMap(), level.getGroundMap(), mask, shadow, { wrap: gl.CLAMP_TO_EDGE });
	var decal = new Decal(mySize);

	var tex_velocity = Buffer.create_texture(level.getVelocityX(), level.getVelocityY(), level.getVelocityX(), level.getVelocityY(),
		{ wrap: gl.CLAMP_TO_EDGE });

	function calc_position(camera)
	{
		var pos = Vector.mul(camera.pos, 1 / my_size)
			.mul2(1, -1)
			.add2(-0.5, 0.5);
		return pos;
	}

	this.ready = ready;
	this.getDecal = function()
	{
		return decal;
	};
	this.getLevel = function()
	{
		return myLevel;
	};


	this.render = function(camera) {
		if (!ready())
			return;

		assert(camera);
		const coef = 12.0 / my_size;
		const aspect = canvas.width / canvas.height;
		const h_ratio = 16.0 / 9.0;
		var matTexture = mat4.create();
		var position = calc_position(camera);
		mat4.trans(matTexture, [0.5, 0.5]);
		mat4.trans(matTexture, position.toVec());
		mat4.rotate(matTexture, camera.angle);

		if (aspect < h_ratio) mat4.scal(matTexture, [0.5 * aspect * coef, 0.5 * coef]);
		else mat4.scal(matTexture, [0.5 * h_ratio * coef, 0.5 * coef * h_ratio / aspect]);

		var mat = mat4.create();
		mat4.trans(mat, [0, 0.75]);
		mat4.mul(matTexture, matTexture, mat)

		function renderTide() {
			frameBufTide.bind();
			shaderTide.use();
			shaderTide.texture(shaderTide.noise, textureNoise.getId(), 0);
			shaderTide.vector(shaderTide.gageTime,
				[5 * my_size / 64, 5 * my_size / 64, ((Date.now() / 64) % 1000) / 1000, 0]);
			shaderTide.matrix(shaderTide.matTexture, matTexture);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			frameBufTide.unbind();
		}

		function renderMap()
		{
			var shader = options.highQuality ? shaderLevel : shaderOnLevelSmall;
			shader.use();
			shader.matrix(shader.matTexture, matTexture);
			shader.texture(shader.levelMap, texture.getId(), 0);
			shader.texture(shader.textureGround_1, textureGround_1.getId(), 2);
			shader.texture(shader.textureTide, textureTide.getId(), 3);
			shader.texture(shader.textureVisible, frameBufVisible.getTexture(), 4);
			if (options.highQuality)
			{
				shader.texture(shader.textureGround_2, textureGround2.getId(), 5);
				shader.texture(shader.textureDecal, decal.getDecalTexture(), 6);
			}
			shader.vector(shader.scale, [10 * my_size / 64, 10 * my_size / 64, 0, 0]);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		function renderVisible()
		{
			frameBufVisible.bind();
			shaderVisible.use();
			shaderVisible.texture(shaderVisible.levelMap, texture.getId(), 0);
			shaderVisible.matrix(shaderVisible.matTexture, matTexture);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			frameBufVisible.unbind();
		}

		function renderItemPos()
		{
			myLevel.getItemPos().forEach(function(item_pos)
			{
				item_pos.render(camera, tex_item_pos, shaderPosition,
					{
						textures:
							[
								{
									location: shaderPosition.textureDecal,
									id: decal.getDecalTexture(),
								},
							],
					});
			});
		}

		renderVisible();
		if (options.highQuality)
		{
			decal.render(camera);
			renderTide();
		}
		renderMap();

		gl.enable(gl.BLEND);
		renderItemPos();
		gl.disable(gl.BLEND);

		this.renderSmallMap = function(camera)
		{
			var pos = calc_position(camera);
			gl.enable(gl.BLEND);
			var mat_pos = mat4.create();
			mat4.trans(mat_pos, [-0.8, -0.7, 0]);
			mat4.scal(mat_pos, [0.3 / (canvas.width / canvas.height), 0.3, 1]);
			shader_mininap.use();
			shader_mininap.texture(shaderSmallMap.levelMap, texture.getId(), 0);
			shader_mininap.matrix(shaderSmallMap.matPosition, mat_pos);
			shader_mininap.vector(shaderSmallMap.pos, [pos.x, pos.y, 0, 0]);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			gl.disable(gl.BLEND);
		};
	};

}
