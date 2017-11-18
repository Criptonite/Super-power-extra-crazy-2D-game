"use strict";

var canvas;
var gl;
var text;
var gameClient;
var sun_direction = new Vector(-0.25, -0.5);

var input =	{
		mouse_angle: 0,
		mouse_down:  false,
		mouse_wheel: 0,
		keys: new Array(256),
};

var VK_A = function() {
	return input.keys['A'.charCodeAt(0)] || input.keys[0x25];
};
var VK_W = function() {
	return input.keys['W'.charCodeAt(0)] || input.keys[0x26];
};
var VK_S = function() {
	return input.keys['S'.charCodeAt(0)] || input.keys[0x28];
};
var VK_D = function() {
	return input.keys['D'.charCodeAt(0)] || input.keys[0x27];
};

var options = {
		sens : 0.1,
		highQuality: true,
	};

var stats =	{
		count_fps: 0,
		count_dynent_rendering: 0,
		count_decal: 0,
		count_net_package: 0,
		memory_all_package: 0,
		fps: 0,
	};

function getMouseAngle() {
	var angle = (input.mouse_angle * options.sens) % 360;
	return normalizeAngle(-angle / 360.0 * (2 * Math.PI));
}

function getWidth() {
	return (document.documentElement.clientWidth
		|| document.body.clientWidth
		|| window.innerWidth) - 50;
}

function getHeight() {
	var height = 50;
	return (document.documentElement.clientHeight
		|| document.body.clientHeight
		|| window.innerHeight) - height - 50;
}

function glInit() {
	canvas = document.getElementById("canvas");
	canvas.width = getWidth();
	canvas.height = getHeight();

	var webglAttributes =
		{
			alpha                   : false,
			antialias               : false,
			depth                   : false,
			premultipliedAlpha      : true,
			preserveDrawingBuffer   : true,
			stencil                 : false,
		};
	gl = canvas.getContext("webgl", webglAttributes) ||
		canvas.getContext("experimental-webgl", webglAttributes);
	if (!gl)
	{
		document.getElementById('viewport-frame').style.display = 'none';
		document.getElementById('webgl-error').style.display = 'block';
		return false;
	}

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	var vertices =
		[
			-1.0, -1.0,
			1.0,  -1.0,
			-1.0,  1.0,
			1.0,   1.0,
		];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enableVertexAttribArray(0);
	return true;
}

function initEvents() {

}

var gen_frame_count = 0;
var gen_seconds = Date.now();

function calc_fps()
{
	var now = Date.now();
	gen_frame_count++;
	if (now > g_seconds)
	{
		gen_seconds = now + 1000;
		stats.fps = gen_frame_count;
		gen_frame_count = 0;
	}
}

function textReady() {
	return text && text.ready();
}

function contentReady() {
	return textReady() &&
		Item.ready() &&
		Weapon.ready() &&
		HUD.ready() &&
		Bot.ready() &&
		Particle.ready();
}

function gameReady() {
	return contentReady() &&
		gameClient && gameClient.ready();
}

function renderLoading() {
	if (textReady())
	{
		text.render([0, 0], 2, "#rLoading...", 2, {center: true});
	}
	if (gameReady()) render();
	else requestAnimationFrame(renderLoading, null);
}

function render() {
	gameClient.render();

	calc_fps();
	stats.count_fps++;
	requestAnimationFrame(render, null);
}

function main()
{

}
