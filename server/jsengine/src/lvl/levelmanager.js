var LevelManager = function(renderer, entityManager, textUtils) {
	this.renderer = renderer;
	this.eman = entityManager;
	this.textUtils = textUtils;
	this.levels = [];
	this.home = new Level(this, this.textUtils, 100);
	this.activeLevel = this.home;
	this.levels.push(this.home);

	this.update = function(delta) {
		var ents = this.eman.ents;
		var levelContents = this.activeLevel.activeRoom.contents;

		for (i = 0; i < ents.length; i++) {
            for (j = 0; j < levelContents.length; j++) {
                if (this.checkCollision(levelContents[j], ents[i])) {
                    levelContents[j].collidedWithEnt(ents[i]);
                    ents[i].collidedWithLvl(levelContents[j]);
                }
            }
        }

		this.activeLevel.update(delta);
	};

	this.render = function() {
		var vertData = this.activeLevel.getVerts();
		var verts = vertData['verts'];
		var dataper = vertData['dataper'];
		this.renderer.renderLvl(verts, dataper);
	};

	this.checkCollision = function(lvlE, e) {
		return (lvlE.pos.x < (e.pos.x + e.width) && (lvlE.pos.x + lvlE.width) > e.pos.x && lvlE.pos.y < (e.pos.y + e.height) && (lvlE.pos.y + lvlE.height) > e.pos.y);
	};

	this.getNewWorlds = function() {
		while (this.levels.length < 6) {
			var type = Math.floor(Math.random() * (7 - 1)) + 1;
			////console.log("Level Type: " + type);
			var newWorld = new Level(this, this.textUtils, type);
			////console.log("Level Name: " + newWorld.name);
			this.levels.push(newWorld);
		};
	};

	this.flushWorlds = function() {
		for (var i = 1; i < this.levels.length; i++) {
			if (this.levels[i] != this.activeLevel) {
				this.levels.splice(i, 1);
			}
		}
		this.levels.splice(1, 5);
	};
};