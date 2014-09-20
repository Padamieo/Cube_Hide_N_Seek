var vboE, vboL, vboT;
var gl;
var shaderProgram;
var entSpriteMapTex;
var entSpriteMap;
var lvlSpriteMapTex;
var lvlSpriteMap;
var fontMapTex;
var fontMap;
var entSpritesReady = false;
var lvlSpritesReady = false;
var fontSpritesReady = false;
var FRAGMENT_SHADER = 'precision mediump float;' +
					  'varying vec2 TexCoord;' +
					  'uniform sampler2D tex;' +
                      'void main() {\n' +
                      '    gl_FragColor = texture2D(tex, TexCoord);\n' +
                      '}\n',

     VERTEX_SHADER = 'attribute vec2 pos;' +
     				'attribute vec2 texCoord;' +
                     'attribute float angle;' +
                     'attribute float scale;' +
                     'attribute vec2 centre;' +
                     'varying vec2 TexCoord;' +
                     'void main() {\n' +
                     '	 TexCoord = texCoord;' +
                     '	 mat4 rot = mat4(cos(angle) * scale, -sin(angle), 0.0, 0.0, sin(angle), cos(angle) * scale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);' +
                     '	 mat4 tr = mat4(1.0, 0.0, 0.0, centre.x, 0.0, 1.0, 0.0, centre.y, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);' +
                     '   mat4 tr1 = mat4(1.0, 0.0, 0.0, -centre.x, 0.0, 1.0, 0.0, -centre.y, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);' +
                     '   gl_Position = vec4(pos, 1.0, 1.0) * tr1 * rot * tr;\n' +
                     '}\n';

var Renderer = function(textUtils) {
	this.textUtils = textUtils;
	this.initGL();
};

Renderer.prototype.initGL = function() {
	var canvas = document.getElementById('gameCanvas');
	canvas.width = 640;
	canvas.height = 480;

	try {
	    gl = canvas.getContext("webgl");
	    gl.viewportWidth = canvas.width;
	    gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
	    //alert("Could not initialise WebGL, sorry :-(");
	}

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	this.initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
	this.initTextures();

	vboE = gl.createBuffer();
	vboL = gl.createBuffer();
	vboT = gl.createBuffer();
};

Renderer.prototype.initShaders = function(gl, vshader, fshader) {
	shaderProgram = this.createProgram(gl, vshader, fshader);
  	if (!shaderProgram) {
    	////console.log('Failed to create program');
    	return false;
  	}

  	gl.useProgram(shaderProgram);
  	gl.program = shaderProgram;

  	return true;
};

Renderer.prototype.initTextures = function() {
	entSpriteMapTex = gl.createTexture();
  	entSpriteMap = new Image();
  	lvlSpriteMapTex = gl.createTexture();
  	lvlSpriteMap = new Image();
  	fontMapTex = gl.createTexture();
  	fontMap = new Image();
  	
  	entSpriteMap.onload = function() {handleTextureLoaded(1, entSpriteMap, entSpriteMapTex);}
  	entSpriteMap.src = "image/entTextures.png";

  	lvlSpriteMap.onload = function() {handleTextureLoaded(2, lvlSpriteMap, lvlSpriteMapTex);}
  	lvlSpriteMap.src = "image/lvlTextures.png";

  	fontMap.onload = function() {handleTextureLoaded(3, fontMap, fontMapTex);}
  	fontMap.src = "image/font.png";
};

function handleTextureLoaded(texNo, image, texture) {
	gl.activeTexture(texNo == 1 ? gl.TEXTURE0 : texNo == 2 ? gl.TEXTURE1 : gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	switch (texNo) {
		case 1:
			entSpritesReady = true;
			break;
		case 2:
			lvlSpritesReady = true;
			break;
		case 3:
			fontSpritesReady = true;
			break;
	};
}

Renderer.prototype.createProgram = function(gl, vshader, fshader) {
	var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader);
	var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
	if (!vertexShader || !fragmentShader) {
		return null;
	}
	var program = gl.createProgram();
	if (!program) {
		return null;
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		var error = gl.getProgramInfoLog(program);
		//alert('Failed to link program: ' + error);
		gl.deleteProgram(program);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		return null;
	}
	return program;
};

Renderer.prototype.loadShader = function(gl, type, source) {
	var shader = gl.createShader(type);
	if (shader == null) {
		//alert('unable to create shader');
		return null;
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!compiled) {
		var error = gl.getShaderInfoLog(shader);
		//alert('Failed to compile shader: ' + error);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
};

Renderer.prototype.render = function(verts, dataper) {
	var size = dataper * 4;
	var posElems = 2;
	var texCoordElems = 2;
	var angleElems = 1;
	var scaleElems = 1;
	var centerElems = 2;

    var posAttrib = gl.getAttribLocation(shaderProgram, 'pos');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, posElems, gl.FLOAT, false, size, 0);

    var texCoordAttrib = gl.getAttribLocation(shaderProgram, 'texCoord');
    gl.enableVertexAttribArray(texCoordAttrib);
    gl.vertexAttribPointer(texCoordAttrib, texCoordElems, gl.FLOAT, false, size, posElems * 4);

    var angleAttrib = gl.getAttribLocation(shaderProgram, 'angle');
    gl.enableVertexAttribArray(angleAttrib);
    gl.vertexAttribPointer(angleAttrib, angleElems, gl.FLOAT, false, size, (posElems + texCoordElems) * 4);

    var scaleAttrib = gl.getAttribLocation(shaderProgram, 'scale');
    gl.enableVertexAttribArray(scaleAttrib);
    gl.vertexAttribPointer(scaleAttrib, scaleElems, gl.FLOAT, false, size, (posElems + texCoordElems + angleElems) * 4);

    var centreAttrib = gl.getAttribLocation(shaderProgram, 'centre');
    gl.enableVertexAttribArray(centreAttrib);
    gl.vertexAttribPointer(centreAttrib, centerElems, gl.FLOAT, false, size, (posElems + texCoordElems + angleElems + scaleElems) * 4);

    gl.drawArrays(gl.TRIANGLES, 0, verts.length / dataper);
};

Renderer.prototype.renderEnts = function(verts, dataper) {
	if (!entSpritesReady) return;
	gl.useProgram(shaderProgram);
	gl.bindBuffer(gl.ARRAY_BUFFER, vboE);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, entSpriteMapTex);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, 'tex'), 0);

    this.render(verts, dataper);
};

Renderer.prototype.renderLvl = function(verts, dataper) {
	if (!lvlSpritesReady) return;
	gl.useProgram(shaderProgram);
	gl.bindBuffer(gl.ARRAY_BUFFER, vboL);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, lvlSpriteMapTex);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, 'tex'), 1);

	this.render(verts, dataper);
};

Renderer.prototype.renderText = function(verts, dataper) {
	if (!fontSpritesReady) return;
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vboT);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, fontMapTex);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, 'tex'), 2);

    this.render(verts, dataper);
};