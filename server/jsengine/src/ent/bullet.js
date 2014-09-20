var Bullet = function(x, y, width, height, dx, dy, life, damage, belongsToPlayer, eman, type) {
	this.life = life;
    this.damage = damage;
    this.type = type;
    this.belongsToPlayer = belongsToPlayer;
    var texOrigin = new Vec2(2 * ENT_TEX_SIZE, 0);
    var texEdge = new Vec2(3 * ENT_TEX_SIZE, 1);
	Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);
	this.vel.x = dx;
	this.vel.y = dy;

	this.collidedWith = function(e) {
        if (this.belongsToPlayer) {
            if (e instanceof Enemy) this.destroy();
        }
        else {
            if (e instanceof Player) this.destroy();
        }

        if (e instanceof Bullet) return;
	};

	this.collidedWithLvl = function(lvlElement) {
		 if (!(lvlElement instanceof Pit)) {
            this.destroy();
        }
	};

	this.update = function() {
		this.life--;
        if (this.life <= 0) {
            if (this.vel.x > 0) {
                this.vel.x -= 0.001;
            }
            else if (this.vel.x < 0) {
                this.vel.x += 0.001;
            }

            if (this.vel.x > -0.0001 || this.vel.x < 0.0001) {
                this.destroy();
            }
        }

        if (this.pos.x < -1) {
            this.destroy();
        }
        if (this.pos.x + this.width > 1) {
            this.destroy();
        }
        if (this.pos.y < -1) {
            this.destroy();
        }
        if (this.pos.y + this.height > 1) {
            this.destroy();
        }

        if (this.type == "sin") {
            //TODO sin shots
        }
        if (this.type == "poison") {
            //TODO poison effect
        }
        if (this.type == "piercing") {
            //TODO piercing effect
        }
	};
};