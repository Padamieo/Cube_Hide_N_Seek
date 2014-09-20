var Enemy = function(x, y, width, height, eman, room, type) {
	this.health = 2;
    this.damage = 1;
    var texOrigin = new Vec2(1 * ENT_TEX_SIZE, 0);
    var texEdge = new Vec2(2 * ENT_TEX_SIZE, 1);
    this.room = room;
    this.type = type;
    Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);

    this.stoppedVer = false;
    this.stoppedHor = false;

    this.bulletLife = 200;
    this.type = type;
    switch (type) {
        case 1:
            moveLeft = true;
            this.stoppedHor = false;
            this.maxDXMag = 0.1;
            break;
        case 2:
            moveDown = true;
            this.stoppedVer = false;
            this.maxDYMag = 0.1;
            break;
    };

    this.collidedWith = function(e) {
		if (e instanceof Bullet && e.belongsToPlayer) {
            this.health -= e.damage;
            if (this.health <= 0) {
                this.room.entDead(this);
                this.destroy();
            }
        }
    };

    this.collidedWithLvl = function(lvlElement) {
		if (lvlElement instanceof Explosion) {
			this.health -= 5;
			if (this.health <= 0) {
				this.room.entDead(this);
				this.destroy();
			}
		}
		if (lvlElement instanceof Obstruction || lvlElement instanceof Explosive || lvlElement instanceof Pit) {
			this.switchDir();
		}
    };

    this.update = function() {
        this.ai();
        //have to duplicate entity.update (only the parts relevant to this type)
        if (this.pos.x < -1) {
            this.pos.x = Math.round(this.pos.x);
                this.moveLeft = false;
                this.moveRight = false;
                this.stoppedHor = false;
            this.vel.x = 0;
        }
        else if (this.pos.x + this.width > 1) {
            this.pos.x = Math.round(this.pos.x) - this.width;
                this.moveLeft = false;
                this.moveRight = false;
                this.stoppedHor = false;
            this.vel.x = 0;
        }

        if (this.pos.y < -1) {
            this.pos.y = Math.round(this.pos.y);
                this.moveUp = false;
                this.moveDown = false;
                this.stoppedVer = false;
            this.vel.y = 0;
        }
        else if (this.pos.y + this.height > 1) {
            this.pos.y = Math.round(this.pos.y) - this.height;
                this.moveUp = false;
                this.moveDown = false;
                this.stoppedVer = false;
            this.vel.y = 0;
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

    this.ai = function() {
        //TODO MOVEMENT DOESN'T WORK
        switch (this.type) {
            case 1:
                //Moves horizontally, shoots vertically
                if ((Math.floor(Math.random() * (100 - 1)) + 1) < 10) {
                    this.shoot(moveLeft ? 0 : 2);
                }
                break;
            case 2:
                //Moves vertically, shoots horizontally
                if ((Math.floor(Math.random() * (100 - 1)) + 1) < 10) {
                    this.shoot(moveDown ? 1 : 3);
                }
                break;
            case 3:
                //Moves towards player, shoots randomly

                break;
        }
    };

    this.switchDir = function() {
		if (this.moveLeft) {
			this.moveLeft = false;
			this.moveRight = true;
		}
		else if (this.moveRight) {
			this.moveRight = false;
			this.moveLeft = true;
		}
		if (this.moveDown) {
			this.moveDown = false;
			this.moveUp = true;
		}
		if (this.moveUp) {
			this.moveUp = false;
			this.moveDown = true;
		}
    };
};