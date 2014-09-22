var Player = function(x, y, width, height, eman) {
	this.health = 10;
	this.maxHealth = 15;
	this.money = 0;
	this.damage = 1;
	this.ammo = 100;
	this.bombs = 2;
	this.inventory = new Inventory();
	this.inventory.init();

	this.interactCoolDown = false;
	this.interactTimer = 0;
	var texOrigin = new Vec2(0, 0);
	var texEdge = new Vec2(1 * ENT_TEX_SIZE, 1);
	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

	this.collidedWith = function(e) {
		//TODO collision reaction
        if (e instanceof Bullet && !e.belongsToPlayer) {
            this.health -= e.damage;
            if (this.health <= 0) {
                this.destroy();
            }
        }

        if (e instanceof PermanentHealthUpgrade) {
            e.effect(this);
        }
	};

	this.collidedWithLvl = function(lvlElement) {
		if (lvlElement instanceof Obstruction || lvlElement instanceof Pit || lvlElement instanceof Explosive) {
			if (this.ignoreLvlCollision) return;
			if (this.moveUp) {
				this.pos.y = lvlElement.pos.y + lvlElement.height + 0.005;
				this.moveUp = false;
                this.moveDown = false;
                this.stoppedVer = false;
                this.vel.y = 0;
			}
			else if (this.moveDown) {
				this.pos.y = lvlElement.pos.y - this.height - 0.005;
                this.moveUp = false;
                this.moveDown = false;
                this.stoppedVer = false;
                this.vel.y = 0;
			}
			else if (this.moveLeft) {
				this.pos.x = lvlElement.pos.x + lvlElement.width + 0.005;
                this.moveLeft = false;
                this.moveRight = false;
                this.stoppedHor = false;
                this.vel.x = 0;
			}
			else if (this.moveRight) {
				this.pos.x = lvlElement.pos.x - this.width - 0.005;
				this.moveLeft = false;
                this.moveRight = false;
                this.stoppedHor = false;
                this.vel.x = 0;
			}
		}
		if (lvlElement instanceof Explosion) {
			this.health -= 5;
			if (this.health <= 0) {
				this.destroy();
			}
		}

		if (lvlElement instanceof Door) {
			//console.log("DOOR ACTION");
			this.pos.x = 0;
			this.pos.y = 0;
			this.moveLeft = false;
			this.moveRight = false;
			this.moveUp = false;
			this.moveDown = false;
			this.stoppedHor = false;
			this.stoppedVer = false;
			this.vel.x = 0;
			this.vel.y = 0;

			switch (lvlElement.name) {
				case "top":
					this.pos.x = 0;
					this.pos.y = -0.55;
					break;
				case "bottom":
					this.pos.x = 0;
					this.pos.y = 0.55;
					break;
				case "left":
					this.pos.x = 0.55;
					this.pos.y = 0;
					break;
				case "right":
					this.pos.x = -0.55;
					this.pos.y = 0;
					break;
			};

			lvlElement.room.level.switchToRoom(lvlElement.leadsTo);
		}
	};

	this.update = function() {
		//have to duplicate some code. Should've gone with Prototype insertions
		if (this.pos.x < -1) {
	        this.pos.x = -0.998;
	            this.moveLeft = false;
	            this.moveRight = false;
	            this.stoppedHor = false;
	        this.vel.x = 0;
	    }
	    else if (this.pos.x + this.width > 1) {
	        this.pos.x = 0.998 - this.width;
	            this.moveLeft = false;
	            this.moveRight = false;
	            this.stoppedHor = false;
	        this.vel.x = 0;
	    }

	    if (this.pos.y < -1) {
	        this.pos.y = -0.998;
	            this.moveUp = false;
	            this.moveDown = false;
	            this.stoppedVer = false;
	        this.vel.y = 0;
	    }
	    else if (this.pos.y + this.height > 1) {
	        this.pos.y = 0.998 - this.height;
	            this.moveUp = false;
	            this.moveDown = false;
	            this.stoppedVer = false;
	        this.vel.y = 0;
	    }

	    if (this.jumping) {
	        this.jumpTimer++;
	        if (this.jumpTimer > this.jumpLimit) {
	            this.jumpTimer = 0;
	            this.jumping = false;
	        }
	    }

	    if (this.hasGravity) {
	        if (this.pos.y > this.origin.y) {
	            this.origin = new Vec2(-0.5, -1)
	            this.vel.y -= 0.0025;
	        }
	    }

	    if (this.moveLeft) {
	        if (this.vel.x > -this.maxDXMag) {
	            this.vel.x -= (this.maxDXMag / 100);
	        }
	        else {
	            this.vel.x = -this.maxDXMag;
	        }
	    }
	    else if (this.moveRight) {
	        if (this.vel.x < this.maxDXMag) {
	            this.vel.x += (this.maxDXMag / 100);
	        }
	        else {
	            this.vel.x = this.maxDXMag;
	        }
	    }
	    else if (this.stoppedHor) {
	        if (this.vel.x > 0) {
	            //moving right
	            this.vel.x -= (this.maxDXMag / 100);

	            if (this.vel.x < (this.maxDXMag / 100)) {
	                this.vel.x = 0;
	                this.stoppedHor = false;
	            }
	        }
	        else if (this.vel.x < 0) {
	            //moving left
	            this.vel.x += (this.maxDXMag / 100);

	            if (this.vel.x > (-this.maxDXMag / 100)) {
	                this.vel.x = 0;
	                this.stoppedHor = false;
	            }
	        }
	    }

	    if (this.moveUp) {
	        if (this.vel.y > -this.maxDYMag) {
	            this.vel.y -= (this.maxDYMag / 100);
	        }
	        else {
	            this.vel.y = -this.maxDYMag;
	        }
	    }
	    else if (this.moveDown) {
	        if (this.vel.y < this.maxDYMag) {
	            this.vel.y += (this.maxDYMag / 100);
	        }
	        else {
	            this.vel.y = this.maxDYMag;
	        }
	    }
	    else if (this.stoppedVer) {
	        if (this.vel.y > 0) {
	            //moving Down
	            this.vel.y -= (this.maxDYMag / 100);

	            if (this.vel.y < (this.maxDYMag / 100)) {
	                this.vel.y = 0;
	                this.stoppedVer = false;
	            }
	        }
	        else if (this.vel.y < 0) {
	            //moving Up
	            this.vel.y += (this.maxDYMag / 100);

	            if (this.vel.y > (-this.maxDYMag / 100)) {
	                this.vel.y = 0;
	                this.stoppedVer = false;
	            }
	        }
	    }

	    if (this.interactCoolDown) {
	        this.interactTimer++;
	        if (this.interactTimer >= 30) {
	            this.interactCoolDown = false;
	            this.interactTimer = 0;
	        }
	    }
	}

	this.interact = function() {
		if (!this.interactCoolDown) {
			this.eman.addEnt(new Interaction(this.pos.x - (this.width * 2), this.pos.y - (this.height * 2), this.width * 5, this.height * 5, this.eman))
			this.interactCoolDown = true;
		}
	};

	this.giveBomb = function() {
		this.bombs++;
	};

	this.giveMoney = function(amount) {
		this.money += amount;
	};

	this.giveAmmo = function(amount) {
		this.ammo += amount;
	};

	this.giveHealth = function(amount) {
		this.health += amount;
	};

	this.attemptPurchase = function(cost) {
		return this.money >= cost;
	};

	this.getItem = function(i) {
		this.inventory.addItem(i);

		if (i.type == "passive") {
			i.effect(this);
		}

		this.eman.renderer.textUtils.addString("Get " + i.name + " !", 0.075, new Vec2(-0.95, -0.85), true);
		if (i.type == "active") this.eman.renderer.textUtils.addString("Space to use", 0.0425, new Vec2(-0.95, -0.95), true);
	};

	this.ability = function() {
		this.inventory.activateItem(this);
	}
};