var Mat4 = function() {
    if (arguments.length === 0) {
        this.mat = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

    } else if (arguments.length === 16) {
        this.mat = [
            [arguments[0], arguments[1], arguments[2], arguments[3]],
            [arguments[4], arguments[5], arguments[6], arguments[7]],
            [arguments[8], arguments[9], arguments[10], arguments[11]],
            [arguments[12], arguments[13], arguments[14], arguments[15]]
        ];
    } else {
        throw ("Mat4 Only Accepts Argument Lengths of <16> and <0>");
    }
    this.setIdentity = function () {
        this.mat = new Mat4().mat;
        this.mat[0][0] = 1;
        this.mat[1][1] = 1;
        this.mat[2][2] = 1;
        this.mat[3][3] = 1;
        return this;
    };
    this.getIdentity = function () {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    this.add = function (right) {
        var toReturn = new Mat4().mat;
        for (var i = 0; i < 4; i++) {
            for (var k = 0; k < 4; k++) {
                toReturn.mat[i][k] = this.mat[i][k] + right.mat[i][k];
            }
        }
        return toReturn;
    };
    this.sub = function (right) {
        var toReturn = new Mat4();
        for (var i = 0; i < 4; i++) {
            for (var k = 0; k < 4; k++) {
                toReturn.mat[i][k] = this.mat[i][k] - right.mat[i][k];
            }
        }
        return toReturn;
    };
    this.mul = function (right) {
        var toReturn = new Mat4();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var sum = 0;
                for (var k = 0; k < 4; k++) {
                    sum += this.mat[i][k] * right.mat[k][j];
                }
                toReturn.mat[i][j] = sum;
            }
        }
        return toReturn;
    };
    this.getPerspective = function (fov, aspect, zNear, zFar) {
        var yMax = zNear * Math.tan(fov * Math.PI / 360);
        var yMin = -yMax;
        var xMin = yMin * aspect;
        var xMax = yMax * aspect;
        return this.getFrustrum(xMin, xMax, yMin, yMax, zNear, zFar);
    };
    this.getFrustrum = function (left, right, bottom, top, zNear, zFar) {
        var X = 2 * zNear / (right - left);
        var Y = 2 * zNear / (top - bottom);
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(zFar + zNear) / (zFar - zNear);
        var D = -2 * zFar * zNear / (zFar - zNear);

        return new Mat4(X, 0, A, 0, 0, Y, B, 0, 0, 0, C, D, 0, 0, -1, 0);
    };
    this.flatten = function () {
        var toReturn = [];
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                toReturn.push(this.mat[i][j]);
            }
        }
        return toReturn;
    };
    this.tostr = function () {
        var toReturn = "";
        for (var i = 0; i < 4; i++) {
            toReturn += "<p>";
            for (var k = 0; k < 4; k++) {
                toReturn += this.mat[i][k].toFixed(3).toString() + " | ";
            }
            toReturn += "</p>";
        }
        return toReturn;
    };
}







var Mat3 = function(x, y, value) {
	this.val = value ? value :  [
								 1, 0, 0,
			 					 0, 1, 0,
			 					 x, y, 1
			  					];
};

Mat3.prototype.translate = function(x, y) {
	this.val[6] += x;
	this.val[7] += y;
};
var Vec2 = function(x, y) {
    this.x = x;
    this.y = y;
}

Mat3.prototype.makeRotation = function(angle) {
	var c = Math.cos(angle);
  	var s = Math.sin(angle);

  	this.val[0] = c;
  	this.val[1] = -s;
  	this.val[3] = s;
  	this.val[4] = c;
};

Mat3.prototype.scale = function(x, y) {
	this.val[0] += x;
	this.val[4] += y;
};

function matrixMultiply(m1, m2) {
	var a = m1.val, b = m2.val;
	var a00 = a[0*3+0];
	var a01 = a[0*3+1];
	var a02 = a[0*3+2];
	var a10 = a[1*3+0];
	var a11 = a[1*3+1];
	var a12 = a[1*3+2];
	var a20 = a[2*3+0];
	var a21 = a[2*3+1];
	var a22 = a[2*3+2];
	var b00 = b[0*3+0];
	var b01 = b[0*3+1];
	var b02 = b[0*3+2];
	var b10 = b[1*3+0];
	var b11 = b[1*3+1];
	var b12 = b[1*3+2];
	var b20 = b[2*3+0];
	var b21 = b[2*3+1];
	var b22 = b[2*3+2];

	var val = [a00 * b00 + a01 * b10 + a02 * b20,
	      	   a00 * b01 + a01 * b11 + a02 * b21,
	      	   a00 * b02 + a01 * b12 + a02 * b22,
	      	   a10 * b00 + a11 * b10 + a12 * b20,
	      	   a10 * b01 + a11 * b11 + a12 * b21,
	      	   a10 * b02 + a11 * b12 + a12 * b22,
	      	   a20 * b00 + a21 * b10 + a22 * b20,
	      	   a20 * b01 + a21 * b11 + a22 * b21,
	      	   a20 * b02 + a21 * b12 + a22 * b22];

	return new Mat3(0, 0, val);
}