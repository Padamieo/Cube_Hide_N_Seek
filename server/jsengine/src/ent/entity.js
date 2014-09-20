var Entity = function(x, y, width, height, texOrigin, texEdge, eman) {
	this.eman = eman;
	this.pos = new Vec2(x, y);
	this.origin = new Vec2(x, y);
	this.texOrigin = texOrigin;
	this.texEdge = texEdge;
	this.vel = new Vec2(0, 0);
	this.center = new Vec2((x + (x + width)) / 2, (y + (y + height)) / 2)
	this.maxDXMag = 0.05;
	this.maxDYMag = 0.05;
	this.width = width;
	this.height = height;
	this.rotation = 0;
    this.scale = 1;
    this.shootInterval = 250;
    this.lastShootTime = 0;
    this.projectileLife = 75;
    this.bombInterval = 2000;
    this.lastBombTime = 0;
	this.moveLeft = false;
	this.moveRight = false;
	this.moveUp = false;
	this.moveDown = false;
	this.stoppedHor = false;
	this.stoppedVer = true;
	this.jumping = false;
	this.jumpTimer = 0;
	this.jumpLimit = 0;
	this.hasGravity = false;
	this.bulletType = "norm";
	this.ignoreLvlCollision = false;

	this.update = function() {
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
	};

	this.move = function(delta) {
		this.pos.x += (this.vel.x * delta) / 10;
        this.pos.y += (this.vel.y * delta) / 10;
	};

	this.jump = function(jumpLimit) {
		if (!this.jumping) {
            this.jumping = true;
            this.jumpLimit = jumpLimit;
            this.vel.y = 0.03;
        }
	};

	this.rotate = function(angle) {
		this.rotation += angle;
	};

	this.scale = function(scale) {
		this.scale = scale;
	};

	this.destroy = function() {
		this.eman.removeEnt(this);
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

	this.moveHor = function(dir) {
		switch (dir) {
            case 0:
                this.stoppedHor = true;
                this.moveLeft = false;
                this.moveRight = false;
                break;
            case -1:
                this.moveLeft = true;
                this.moveRight = false;
                this.stoppedHor = false;
                break;
            case 1:
                this.moveRight = true;
                this.moveLeft = false;
                this.stoppedHor = false;
                break;
        }
	};

	this.moveVer = function(dir) {
		switch (dir) {
            case 0:
                this.stoppedVer = true;
                this.moveUp = false;
                this.moveDown = false;
                break;
            case -1:
                this.moveDown = true;
                this.moveUp = false;
                this.stoppedVer = false;
                break;
            case 1:
                this.moveUp = true;
                this.moveDown = false;
                this.stoppedVer = false;
                break;
        }
	};

	this.shoot = function(dir, isPlayer) {
    	if (Date.now() - this.lastShootTime < this.shootInterval) {
    		return;
    	}
    	this.lastShootTime = Date.now();
    	if (this.ammo) {
    	    if (this.ammo <= 0) {
    	        this.ammo = 0;
    	        return;
    	    }
    	    this.ammo--;
    	}

    	var isPlayer = this instanceof Player;

    	switch (dir) {
    		case 0:
    			this.eman.addEnt(new Bullet(this.center.x - (this.width / 4), this.pos.y + this.height, this.width / 2, this.height / 2, this.vel.x / 2, 0.015, this.bulletLife, this.damage, isPlayer, this.eman, this.bulletType));
    			break;
    		case 1:
    			this.eman.addEnt(new Bullet(this.pos.x + this.width, this.center.y - (this.height / 4), this.width / 2, this.height / 2, 0.015, this.vel.y / 2, this.bulletLife, this.damage, isPlayer, this.eman, this.bulletType));
    			break;
    		case 2:
    			this.eman.addEnt(new Bullet(this.center.x - (this.width / 4), this.pos.y - this.height / 2, this.width / 2, this.height / 2, this.vel.x / 2, -0.015, this.bulletLife, this.damage, isPlayer, this.eman, this.bulletType));
    			break;
    		case 3:
    			this.eman.addEnt(new Bullet(this.pos.x - this.width / 2, this.center.y - (this.height / 4), this.width / 2, this.height / 2, -0.015, this.vel.y / 2, this.bulletLife, this.damage, isPlayer, this.eman, this.bulletType));
    			break;
    	}
    };

    this.bomb = function() {
        if (Date.now() - this.lastBombTime < this.bombInterval) {
            return;
        }
        this.lastBombTime = Date.now();
        if (this.bombs) {
            if (this.bombs <= 0) {
                this.bombs = 0;
                return;
            }
            this.bombs--;
        }
		this.eman.addEnt(new Bomb(this.pos.x - (this.width / 2), this.pos.y - (this.width / 4), this.width * 2, this.height * 2, this.eman, lvlManager.activeLevel.activeRoom, true));
    };

    this.collidedWith = function(e) {return;};
    this.collidedWithLvl = function(e) {return;};
};