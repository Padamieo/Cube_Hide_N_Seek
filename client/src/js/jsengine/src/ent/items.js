var Inventory = function() {
	this.possibleActiveItems = []
	this.possiblePassiveItems = [];
	this.storedActiveItems = [];
	this.storedPassiveItems = [];
	this.activeItem = null;

	this.init = function() {
		this.possibleActiveItems.push("Damage All");
		this.possibleActiveItems.push("Flight");

		this.possiblePassiveItems.push("Health Up");
		this.possiblePassiveItems.push("Range Up");
		this.possiblePassiveItems.push("Speed Up");
		this.possiblePassiveItems.push("Fire Rate Up");
		this.possiblePassiveItems.push("Damage Up");
		this.possiblePassiveItems.push("Sin Shots");
		this.possiblePassiveItems.push("Poison Shots");
		this.possiblePassiveItems.push("Piercing Shots");
	};

	this.addItem = function(i) {
		if (i.type == "passive") {
			this.storedPassiveItems.push(i);
			this.possiblePassiveItems.splice(this.possiblePassiveItems.indexOf(i.name), 1);
		}
		else if (i.type == "active") {
			this.storedActiveItems.push(i);
			this.possibleActiveItems.splice(this.possibleActiveItems.indexOf(i.name), 1);
		}
	};

	this.activateItem = function(e) {
		if (this.activeItem != null) {
			this.activeItem.effect(e);
		}
	};

	this.setActive = function(i) {
		this.activeItem = this.storedActiveItems[i];
	}
};

var Item = function(x, y, texOrigin, texEdge, eman, room, name, type, cost) {
	var width = 0.2;
	var height = 0.2;
	this.name = name;
	this.cost = cost ? cost : 0;
	this.room = room;
	this.name = name;
	this.type = type;

	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

	this.effect = function(e) {
		return;
	}

	this.collidedWithEnt = function(e) {
		if (e instanceof Player) {
			if (this.cost > 0) {
                if (e.attemptPurchase(this.cost) == 1) {
                    e.getItem(this);
                    this.room.removeElement(this);
                }
            }
            else {
                e.getItem(this);
                this.room.removeElement(this);
            }
		}
	};
};

var PermanentHealthUpgrade = function(x, y, amount, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);
	this.amount = amount;

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "healthup", "once", cost);

	this.effect = function(e) {
		e.maxHealth += this.amount;
	};
};

var HealthUp = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Health Up", "passive", cost);

	this.effect = function(e) {
		e.health += (e.health / 2);
		e.damage -= (e.damage * 0.1);
	};
};

var SpeedUp = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Speed Up", "passive", cost);

	this.effect = function(e) {
		e.maxDX += (e.maxDX * 0.1);
		e.maxDY += (e.maxDY * 0.1);

		e.bulletLife -= (e.bulletLife * 0.2);
	};
};

var RangeUp = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Range Up", "passive", cost);

	this.effect = function(e) {
		e.bulletLife += (e.bulletLife * 0.2);

		e.maxDX -= (e.maxDX * 0.1);
		e.maxDY -= (e.maxDY * 0.1);
	};
}

var FireUp = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Fire Rate Up", "passive", cost);

	this.effect = function(e) {
		e.shootInterval -= (e.shootInterval * 0.2);

		e.maxDX -= (e.maxDX * 0.1);
        e.maxDY -= (e.maxDY * 0.1);
	};
};

var DamageUp = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Damage Up", "passive", cost);

	this.effect = function(e) {
		e.damage += (e.damage * 0.2);
		e.bulletLife -= (e.bulletLife * 0.2);
	};
};

var SinShots = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Sin Shots", "passive", cost);

	this.effect = function(e) {
		e.bulletType = "sin";
	};
};

var PoisonShots = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Poison Shots", "passive", cost);

	this.effect = function(e) {
		e.bulletType = "poison";
	};
};

var PiercingShots = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Piercing Shots", "passive", cost);

	this.effect = function(e) {
		e.bulletType = "piercing";
	};
};

var DamageAll = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Damage All", "active", cost);

	this.effect = function(e) {
		for (var i = 0; i < e.eman.ents.length; i++) {
			e.eman.ents[i].health -= 10;
		}
	};
};

var Flight = function(x, y, eman, room, cost) {
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1, 1);

	Item.prototype.constructor.call(this, x, y, texOrigin, texEdge, eman, room, "Flight", "active", cost);

	this.effect = function(e) {
		e.ignoreLvlCollision = true;
	};
};