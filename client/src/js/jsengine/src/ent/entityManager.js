var EntityManager = function(renderer) {
//	this.player = new Player(-0.75, -0.05, 0.1, 0.1, this);
	this.ents = [];
//	this.ents.push(this.player);
	this.renderer = renderer;
	this.removeList = [];
	this.addList = [];
	this.verts = [];

	this.reset = function() {
		this.ents = [this.player];
		this.removeList = [];
		this.addList = [];
		this.verts = [];
	};

	this.checkCollision = function(e1, e2) {
		return (e1.pos.x < (e2.pos.x + e2.width) && (e1.pos.x + e1.width) > e2.pos.x && e1.pos.y < (e2.pos.y + e2.height) && (e1.pos.y + e1.height) > e2.pos.y);
	};

	this.addEnt = function(e) {
		this.addList.push(e);
	};
	this.removeEnt = function(e) {
		this.removeList.push(e);
	};
	this.addEntList = function(e) {
		for (var i = 0; i < e.length; i++) {
			this.addList.push(e[i]);
		}
	};
	this.removeEntList = function(e) {
		for (var i = 0; i < e.length; i++) {
			this.removeList.push(e[i]);
		}
	};

	this.addEnts = function() {
		for (var i = 0; i < this.addList.length; i++) {
            this.ents.push(this.addList[i]);
        }
        this.addList = [];
	};

	this.cleanEnts = function() {
		for (var i = 0; i < this.removeList.length; i++) {
            this.ents.splice(this.ents.indexOf(this.removeList[i]), 1);
        }
        this.removeList = [];

        if (this.ents.length == 0 && this.player.health > 0) {
            this.addEnt(this.player);
        }
	};

	this.render = function() {
		var renderer = this.renderer;
		this.verts = new Float32Array(this.ents.length * (36 * 8)); //48 for 2D (6 * 8)
        var off = 0;
        for (var i = 0; i < this.ents.length; i++) {
            var newVerts = this.ents[i].getVerts();
            this.verts.set(newVerts, off);
            off += (36 * 8); //48 for 2D (6 * 8)
        }
        this.renderer.renderEnts(this.verts, 8);
	};

	this.update = function(delta) {
		for (var i = 0; i < this.ents.length; i++) {
            this.ents[i].update();
            this.ents[i].move(delta);
        }
        for (i = 0; i < this.ents.length; i++) {
            for (j = i + 1; j < this.ents.length; j++) {
                if (this.checkCollision(this.ents[i], this.ents[j])) {
                    this.ents[i].collidedWith(this.ents[j]);
                    this.ents[j].collidedWith(this.ents[i]);
                }
            }
        }
        if (this.addList.length > 0) {
            this.addEnts();
        }
        if (this.removeList.length > 0) {
            this.cleanEnts();
        }
	};
};