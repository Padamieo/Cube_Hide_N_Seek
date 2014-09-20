var Bomb = function(x, y, width, height, eman, room, live, cost) {
	this.live = live;
	this.room = room;
	this.cost = cost ? cost : 0;
	this.life = 60;
	this.room = room;
	var texOrigin = new Vec2(3 * ENT_TEX_SIZE, 0);
	var texEdge = new Vec2(4 * ENT_TEX_SIZE, 1);

	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

	this.update = function() {
		if (live) {
			this.life--;
			if (this.life <= 0) {
				this.explode();
			}
		}
	};

	this.explode = function() {
		this.room.addElement(new Explosion(this.pos.x - (this.width / 4), this.pos.y - (this.width / 4), this.width * 1.5, this.height * 1.5, this.room));
		this.destroy();
	};

	this.collidedWithEnt = function(e) {
		if (!live && e instanceof Player) {
			if (this.cost > 0) {
				if (e.attemptPurchase(this.cost) == 1) {
					e.giveBomb();
					this.room.removeElement(this);
				}
			}
			else {
				e.giveBomb();
				this.room.removeElement(this);
			}
		}
	};

	this.collidedWithLvl = function(lvlElement) {return;}
};

var Coin = function(x, y, eman, room, amount) {
	this.amount = amount;
	this.room = room;
	this.cost = 0;
	var width = 0.05;
	var height = 0.05;
	var texOrigin = new Vec2(5 * ENT_TEX_SIZE, 0);
	var texEdge = new Vec2(6 * ENT_TEX_SIZE, 1);

	Entity.prototype.constructor.call(this, x, y , width, height, texOrigin, texEdge, eman);

	this.collidedWithEnt = function(e) {
		if (e instanceof Player) {
			e.giveMoney(this.amount);
			this.room.removeElement(this);
		}
	};

	this.collidedWithLvl = function(lvlElement) {return;}
};

var Ammo = function(x, y, eman, room, amount, cost) {
	this.amount = amount;
	this.room = room;
	this.cost = cost ? cost : 0;
	var width = 0.1;
	var height = 0.1;
	var texOrigin = new Vec2(4 * ENT_TEX_SIZE, 0);
	var texEdge = new Vec2(5 * ENT_TEX_SIZE, 1);

	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

	this.collidedWithEnt = function(e) {
		if (e instanceof Player) {
			if (this.cost > 0) {
				if (e.attemptPurchase(this.cost) == 1) {
					e.giveAmmo(this.amount);
					this.room.removeElement(this);
				}
			}
			else {
				e.giveAmmo(this.amount);
				this.room.removeElement(this);
			}
		}
	};

	this.collidedWithLvl = function(lvlElement) {return;}
};

var Health = function(x, y, eman, room, amount, cost) {
	this.amount = amount;
	this.room = room;
	this.cost = cost ? cost : 0;
	var width = 0.1;
	var height = 0.1;
	var texOrigin = new Vec2(6 * ENT_TEX_SIZE, 0);
	var texEdge = new Vec2(7 * ENT_TEX_SIZE, 1);

	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

	this.collidedWithEnt = function(e) {
		if (e instanceof Player) {
			if (this.cost > 0) {
				if (e.attemptPurchase(this.cost) == 1) {
					e.giveHealth(this.amount);
					this.room.removeElement(this);
				}
			}
			else {
             	e.giveHealth(this.amount);
                this.room.removeElement(this);
            }
		}
	}
	this.collidedWithLvl = function(lvlElement) {return;}
};