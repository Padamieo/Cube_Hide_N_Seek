var Obstacle = function(x, y, width, height, texOrigin, texEdge, room) {
//obstruction
//explosive
//pit
	this.pos = new Vec2(x, y);
	this.width = width;
	this.height = height;
	this.center = new Vec2(0, 0);
	this.texOrigin = texOrigin;
	this.texEdge = texEdge;
	this.room = room;
	this.rotation = 0;
	this.scale = 1;

	this.getVerts = function() {
		this.center.x = (this.pos.x + (this.pos.x + this.width)) / 2;
        this.center.y = (this.pos.y + (this.pos.y + this.height)) / 2;
		return new Float32Array([
			this.pos.x, this.pos.y, this.texOrigin.x, this.texOrigin.y, this.rotation, this.scale, this.center.x, this.center.y,
            this.pos.x + this.width, this.pos.y, this.texEdge.x, this.texOrigin.x, this.rotation, this.scale, this.center.x, this.center.y,
            this.pos.x + this.width, this.pos.y + this.height, this.texEdge.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,

            this.pos.x + this.width, this.pos.y + this.height, this.texEdge.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,
            this.pos.x, this.pos.y + this.height, this.texOrigin.x, this.texEdge.y, this.rotation, this.scale, this.center.x, this.center.y,
            this.pos.x, this.pos.y, this.texOrigin.x, this.texOrigin.y, this.rotation, this.scale, this.center.x, this.center.y
								]);
	};

	this.update = function(delta) {
		return;
	};

	this.destroy = function() {
		this.room.removeElement(this);
	}

	this.collidedWithEnt = function(e) {
		return;
	};
};

var Obstruction = function(x, y, width, height, room) {
	var texOrigin = new Vec2(5 * LVL_TEX_SIZE, 0);
	var texEdge = new Vec2(6 * LVL_TEX_SIZE, 1);

	Obstacle.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, room);
};

var Pit = function(x, y, width, height, room) {
	var texOrigin = new Vec2(2 * LVL_TEX_SIZE, 0);
	var texEdge = new Vec2(3 * LVL_TEX_SIZE, 1);

	Obstacle.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, room);
};

var Explosive = function(x, y, width, height, room) {
	var texOrigin = new Vec2(3 * LVL_TEX_SIZE, 0);
	var texEdge = new Vec2(4 * LVL_TEX_SIZE, 1);
	this.health = Math.floor(Math.random() * (6 - 2)) + 2;

	Obstacle.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, room);

	this.collidedWithEnt = function(e) {
		if (e instanceof Bullet) {
			this.health -= e.damage;
		}

		if (e instanceof Explosion) {
			this.health -= 5;
		}

		if (this.health <= 0) {
			this.explode();
		}
	};

	this.explode = function() {
		this.room.addElement(new Explosion(this.pos.x - (this.width * 2), this.pos.y - (this.height * 2), this.width * 4, this.height * 4, this.room));
		this.destroy();
	};
};

var Explosion = function(x, y, width, height, room) {
	var texOrigin = new Vec2(4 * LVL_TEX_SIZE, 0);
	var texEdge = new Vec2(5 * LVL_TEX_SIZE, 1);
	this.life = 1;

	Obstacle.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, room);

	this.update = function() {
		this.life--;

		if (this.life <= 0) {
			this.destroy();
		}
	};
};

var Portal = function(x, y, room) {
	var width = 0.35;
	var height = 0.35;
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1 * LVL_TEX_SIZE, 1);

	Obstacle.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, room);

	this.collidedWithEnt = function(e) {
		if (e instanceof Interaction) {
			this.activate();
		}
	};

	this.activate = function() {
		PORTAL_ACTIVATE(this.room.name);
	};
};

var ManagementStation = function(x, y, room) {
	var width = 0.25;
	var height = 0.25;
	var texOrigin = new Vec2(6 * LVL_TEX_SIZE, 0);
	var texEdge = new Vec2(7 * LVL_TEX_SIZE, 1);

	Obstacle.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, room);

	this.collidedWithEnt = function(e) {
		if (e instanceof Interaction) {
			this.activate();
		}
	};

	this.activate = function() {
		MANAGEMENT_ACTIVATE();
	};
};