var Interaction = function(x, y, width, height, eman) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(0, 0);
	this.life = 1;

	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman)

	this.update = function() {
		this.life--;
		if (this.life <= 0) {
			this.destroy();
		}
	}

	this.getVerts = function() {
		return new Float32Array([
			0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0
								]);
	}
}