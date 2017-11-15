"use strict";

function Particle(type, position, myVector) {

}

Particle.prototype.update = function() {

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



