var Triangle = function(x, y, width, height, eman) {
    var texOrigin = new Vec2(0, 0);
    var texEdge = new Vec2(1, 1);
    Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

    this.getVerts = function() {
        this.center.x = (this.pos.x + (this.pos.x + this.width)) / 2;
        this.center.y = (this.pos.y + (this.pos.y + this.height)) / 2;
        this.scale = 1;
		return new Float32Array([
	        this.center.x, this.pos.y + this.height, this.texOrigin.x, this.texOrigin.y, this.rotation, this.scale, this.center.x, this.center.y,
	        this.pos.x, this.pos.y, this.texEdge.x, this.texOrigin.x, this.rotation, this.scale, this.center.x, this.center.y,
	        this.pos.x + this.width, this.pos.y, this.texEdge.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,
        ]);
    }
}