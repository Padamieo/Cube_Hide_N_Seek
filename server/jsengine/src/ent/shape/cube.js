var Cube = function(cx, cy, diameter, eman) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);
	Entity.prototype.constructor.call(this, cx - (diameter / 2), cy - (diameter / 2), diameter, diameter, texOrigin, texEdge, eman);
	this.center = new Vec2(cx, cy);
	this.diameter = diameter;

	this.getVerts = function() {
		return new Float32Array([

//0.0, 1.0, 0.0, 1, 1, 1, 0, 0,
//-1.0, 0.0, 0.0, 1, 1, 1, 0, 0,
//0.0, 0.0, 1.0, 1, 1, 1, 0, 0,
//
//0.0, 1.0, 0.0, 1, 1, 1, 0, 0,
//0.0, 0.0, 1.0, 1, 1, 1, 0, 0,
//1.0, 0.0, 0.0, 1, 1, 1, 0, 0,
//
//0.0, 1.0, 0.0, 1, 1, 1, 0, 0,
//1.0, 0.0, 0.0, 1, 1, 1, 0, 0,
//0.0, 0.0, -1.0, 1, 1, 1, 0, 0,
//
//0.0, 1.0, 0.0,1, 1, 1, 0, 0,
//0.0, 0.0, -1.0,1, 1, 1, 0, 0,
//-1.0, 0.0, 0.01, 1, 1, 0, 0,







							-0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
                             0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                             0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                             0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                            -0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                            -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
//
                            -0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
                             0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                             0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                             0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                            -0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                            -0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 0.0,

                            -0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                            -0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                            -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                            -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                            -0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
                            -0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,

                             0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                             0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                             0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                             0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                             0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
                             0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,

                            -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                             0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                             0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                             0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                            -0.5, -0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
                            -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,

                            -0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
                             0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
                             0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                             0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
                            -0.5,  0.5,  0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
                            -0.5,  0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0
							]);
	}
}