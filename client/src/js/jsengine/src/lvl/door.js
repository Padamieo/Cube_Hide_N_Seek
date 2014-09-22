var Door = function(x, y, width, height, room, name) {
	this.pos = new Vec2(x, y);
	this.center = new Vec2(0, 0);
	this.width = width;
	this.height = height;
	this.room = room;
	this.texOrigin = new Vec2(1 * LVL_TEX_SIZE, 0);
	this.texEdge = new Vec2(2 * LVL_TEX_SIZE, 1);
	this.rotation = 0;
	this.leadsTo = -1;
	this.name = name;

	this.collidedWithEnt = function(e) {
		return;
	};

	this.update = function(e) {
		return;
	};

	this.getVerts = function() {
		this.center.x = (this.pos.x + (this.pos.x + this.width)) / 2;
        this.center.y = (this.pos.y + (this.pos.y + this.height)) / 2;
        this.scale = 1;
		return new Float32Array([
			this.pos.x, this.pos.y, this.texOrigin.x, this.texOrigin.y, this.rotation, this.scale, this.center.x, this.center.y,
	        this.pos.x + this.width, this.pos.y, this.texEdge.x, this.texOrigin.x, this.rotation, this.scale, this.center.x, this.center.y,
	        this.pos.x + this.width, this.pos.y + this.height, this.texEdge.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,

	        this.pos.x + this.width, this.pos.y + this.height, this.texEdge.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,
	        this.pos.x, this.pos.y + this.height, this.texOrigin.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,
	        this.pos.x, this.pos.y, this.texOrigin.x, this.texOrigin.y, this.rotation, this.scale, this.center.x, this.center.y
                                ]);
	};

	this.setDestination = function(somevalue) {
		this.leadsTo = someValue;
	}
};