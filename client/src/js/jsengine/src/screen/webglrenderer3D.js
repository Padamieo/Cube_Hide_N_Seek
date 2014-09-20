var vboE, vboL, vboT;
var canvas;
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
					  'varying vec3 Col;' +
					  'varying vec2 TexCoord;' +
					  'uniform sampler2D tex;' +
                      'void main() {\n' +
                      '    gl_FragColor = vec4(Col, 1.0) * texture2D(tex, TexCoord);\n' +
                      '}\n',
     VERTEX_SHADER = 'attribute vec3 pos;' +
                     'attribute vec3 col;' +
     				 'attribute vec2 texCoord;' +
     				 'varying vec3 Col;' +
                     'varying vec2 TexCoord;' +
                     'uniform mat4 model;' +
                     'uniform mat4 view;' +
                     'uniform mat4 proj;' +
                     'void main() {\n' +
                     '	 Col = col;' +
                     '   TexCoord = texCoord;' +
                     '   gl_Position = proj * view * model * vec4(pos, 1.0);' +
                     '}\n';

var Renderer3D = function(textUtils) {
	this.textUtils = textUtils;
	this.initGL();
};

Renderer3D.prototype.initGL = function() {
	canvas = document.getElementById('gameCanvas');
	canvas.width = 640;
	canvas.height = 480;

	try {
	    gl = canvas.getContext("webgl");
	    gl.viewportWidth = canvas.width;
	    gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
	    ////alert("Could not initialise WebGL, sorry :-(");
	}
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

	this.initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
	//alert("shaders complete");
	this.initTextures();

	vboE = gl.createBuffer();
	vboL = gl.createBuffer();
	vboT = gl.createBuffer();
};

Renderer3D.prototype.initShaders = function(gl, vshader, fshader) {
	shaderProgram = this.createProgram(gl, vshader, fshader);
	//alert("program: " + shaderProgram);
	//alert("vshader: " + vshader);
	//alert("fshader: " + fshader);
  	if (!shaderProgram) {
    	console.log('Failed to create program');
    	return false;
  	}

  	gl.useProgram(shaderProgram);
  	gl.program = shaderProgram;

  	return true;
};

Renderer3D.prototype.initTextures = function() {
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

Renderer3D.prototype.createProgram = function(gl, vshader, fshader) {
	var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader);
	var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader);

	//alert("vertex: " + vertexShader + " / fragment: " + fragmentShader);
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

Renderer3D.prototype.loadShader = function(gl, type, source) {
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

Renderer3D.prototype.render = function(verts, dataper) {
	//TODO 3D rendering
	var size = dataper * 4;
	var posElems = 3;
	var colElems = 3;
	var texCoordElems = 2;

	var perspective = new Mat4();
	perspective.setIdentity();
	perspective = perspective.getPerspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
	//perspective.mat[3][3] = 1;
	perspective.multiply(new Mat4([
									[1, 0, 0, 0], 
									[0, 1, 0, 0], 
									[0, 0, 1, -5], 
									[0, 0, 0, 1]
									]));


	var model = new Mat4().setIdentity();
	var view = new Mat4(1,0,0,-0.5, 0,1,0,0.5, 0,0,1,1, 0,0,0,1);
 
	gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'model'), false, model.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'proj'), false, perspective.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, 'view'), false, view.flatten());

    var posAttrib = gl.getAttribLocation(shaderProgram, 'pos');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, posElems, gl.FLOAT, false, size, 0);

    var colAttrib = gl.getAttribLocation(shaderProgram, 'col');
    gl.enableVertexAttribArray(colAttrib);
    gl.vertexAttribPointer(colAttrib, colElems, gl.FLOAT, false, size, posElems * 4);

    var texCoordAttrib = gl.getAttribLocation(shaderProgram, 'texCoord');
    gl.enableVertexAttribArray(texCoordAttrib);
    gl.vertexAttribPointer(texCoordAttrib, texCoordElems, gl.FLOAT, false, size, (posElems + colElems) * 4);

    gl.drawArrays(gl.TRIANGLES, 0, verts.length / 8);
};

Renderer3D.prototype.renderEnts = function(verts, dataper) {
	if (!entSpritesReady) return;
	gl.useProgram(shaderProgram);
	gl.bindBuffer(gl.ARRAY_BUFFER, vboE);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, entSpriteMapTex);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, 'tex'), 0);

    this.render(verts, dataper);
};

Renderer3D.prototype.renderLvl = function(verts, dataper) {
	if (!lvlSpritesReady) return;
	gl.useProgram(shaderProgram);
	gl.bindBuffer(gl.ARRAY_BUFFER, vboL);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, lvlSpriteMapTex);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, 'tex'), 1);

	this.render(verts, dataper);
};

Renderer3D.prototype.renderText = function(verts, dataper) {
	if (!fontSpritesReady) return;
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vboT);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, fontMapTex);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, 'tex'), 2);

    this.render(verts, dataper);
};
//
//function perspective(fov, aspectRatio, zNear, zFar) {
//	var persp = new Mat4(0, 0, 0);
//
//	var zm = zFar - zNear;
//	var zp = zFar + zNear;
//
//
//
//	return persp;
//}
//
//private Matrix4f perspective(float fov, float aspectRatio, float zNear, float zFar) {
//		float zm = zFar - zNear;
//		float zp = zFar + zNear;
//
//		Matrix4f persp = new Matrix4f();
//
//		persp.m00 = (1 / (float)Math.tan(Math.toRadians(fov / 2))) / aspectRatio;
//		persp.m11 = 1 / (float)Math.tan(Math.toRadians(fov / 2));
//		persp.m22 = -zp / zm;
//		persp.m23 = -1;
//		persp.m32 = -((2 * zNear * zFar) / zm);
//
//		return persp;
//	}