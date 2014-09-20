var Room = function(level, textUtils, type) {
	this.level = level;
	this.textUtils = textUtils;
	this.type = type;
	this.contents = [];
	this.addList = [];
	this.removeList = [];
	this.name = "room";
	this.tilesX = 10;
	this.tilesY = 10;
	this.maxEnemies = 5;
	this.ents = [];

	this.generate = function() {
		switch (this.type) {
			//stuff
			case 100:
				//this is the home base; input specific contents and layout
				this.name = "home";
				this.getHomeRoomContents();
				break;
			case 101:
				//this is a portal room (spawn room)
				this.name = "portal"
				this.getPortalRoomContents();
				this.generateDoors();
				break;
			case 1:
				//this is an empty room
				this.name = "empty";
				this.generateEmptyRoom();
				this.generateDoors();
				break;
			case 2:
				//this is a combat room
				this.name = "combat";
				this.generateCombatRoom();
				this.generateDoors();
				break;
			case 3:
				//this is an item room
				this.name = "item";
				this.generateItemRoom();
				this.generateDoors();
				break;
			case 4:
				//this is a shop
				this.name = "shop";
				this.generateShopRoom();
				this.generateDoors();
				break;
			case 5:
				//this is a sanctuary
				this.name = "sanctuary";
				this.generateSanctuaryRoom();
				this.generateDoors();
				break;
		};
	};

	this.generateDoors = function() {
		this.leftDoor = new Door(-1 + (0 * 0.2), -1 + (4 * 0.2), 0.2, 0.2, this, "left");
		this.rightDoor = new Door(-1 + (9 * 0.2), -1 + (4 * 0.2), 0.2, 0.2, this, "right");
		this.bottomDoor = new Door(-1 + (4 * 0.2), -1 + (0 * 0.2), 0.2, 0.2, this, "bottom");
		this.topDoor = new Door(-1 + (4 * 0.2), -1 + (9 * 0.2), 0.2, 0.2, this, "top");

		this.contents.push(this.leftDoor);
		this.contents.push(this.rightDoor);
		this.contents.push(this.bottomDoor);
		this.contents.push(this.topDoor);
	};

	this.getHomeRoomContents = function() {
		this.contents.push(new Portal(-0.175, 0.65, this));
		this.contents.push(new ManagementStation(-0.125, -0.75, this));
	};

	this.getPortalRoomContents = function() {
		this.contents.push(new Portal(-0.175, 0.65, this));
	};

	this.generateEmptyRoom = function() {
		for (var i = 0; i < this.tilesX; i++) {
		    for (var j = 0; j < this.tilesY; j++) {
		        var chance = Math.floor(Math.random() * (101 - 1)) + 1;

		        if ((i == 3 || i == 4 || i == 5) && (j == 0 || j == 1 || j == 8 || j == 9)) {
		            //disallow objects 1 space around the doors
		            continue;
		        }
		        if ((j == 3 || i == 4 || j == 5) && (i == 0 || i == 1 || i == 8 || i == 9)) {
		            //disallow objects 1 space around the doors
		            continue;
		        }
		        if ((i == 3 || i == 4 || i == 5) && (j == 3 || j == 4 || j == 5)) {
                    continue;
                }

		        if (chance > 80) {
		            if (chance < 85) {
		                this.contents.push(new Obstruction(-1 + (i * 0.2), -1 + (j * 0.2), 0.2, 0.2, this));
		            }
		            else if (chance < 95) {
		                this.contents.push(new Pit(-1 + (i * 0.2), -1 + (j * 0.2), 0.2, 0.2, this));
		            }
		            else if (chance < 100) {
		                this.contents.push(new Explosive(-1 + (i * 0.2), -1 + (j * 0.2), 0.2, 0.2, this));
		            }
		        }
		    }
		}

		var dropChance = (Math.floor(Math.random() * (100 - 1)) + 1) < 35;
		if (dropChance) {
			var dropCount = Math.floor(Math.random() * (5 - 1)) + 1;

			for (var i = 0; i < dropCount; i++) {
				var whichDrop = Math.floor(Math.random() * (5 - 1)) + 1;
				var x = -1 + Math.random() * 2;
				var y = -1 + Math.random() * 2
                switch (whichDrop) {
                    case 1:
                        this.contents.push(new Bomb(x, y, 0.1, 0.1, this.level.levelManager.eman, this, false, 0));
                        break;
                    case 2:
                        var amountAmmo = Math.floor(Math.random() * (20 - 5)) + 5;
                        this.contents.push(new Ammo(x, y, this.level.levelManager.eman, this, amountAmmo, 0));
                        break;
                    case 3:
                        var amountHealth = Math.floor(Math.random() * (5 - 1)) + 1;
                        this.contents.push(new Health(x, y, this.level.levelManager.eman, this, amountHealth, 0));
                        break;
                    case 4:
                        var amountCoin = Math.floor(Math.random() * (50 - 1)) + 1;
                        this.contents.push(new Coin(x, y, this.level.levelManager.eman, this, amountCoin, 0));
                };
			}
		}
	};

	this.generateCombatRoom = function() {
		for (var i = 0; i < this.tilesX; i++) {
            for (var j = 0; j < this.tilesY; j++) {
                var chance = Math.floor(Math.random() * (101 - 1)) + 1;

                if ((i == 0 || i == 3 || i == 4 || i == 5 || i == 9) && (j == 0 || j == 1 || j == 8 || j == 9)) {
                    //disallow objects 1 space around the doors
                    continue;
                }
                if ((j == 0 || j == 3 || i == 4 || j == 5 || j == 9) && (i == 0 || i == 1 || i == 8 || i == 9)) {
                    //disallow objects 1 space around the doors
                    continue;
                }
                if ((i == 3 || i == 4 || i == 5) && (j == 3 || j == 4 || j == 5)) {
                    continue;
                }

                if (chance > 90) {
                    if (chance < 95) {
                        this.contents.push(new Obstruction(-1 + (i * 0.2), -1 + (j * 0.2), 0.2, 0.2, this));
                    }
                    else if (chance < 97) {
                        this.contents.push(new Pit(-1 + (i * 0.2), -1 + (j * 0.2), 0.2, 0.2, this));
                    }
                    else if (chance < 100) {
                        this.contents.push(new Explosive(-1 + (i * 0.2), -1 + (j * 0.2), 0.2, 0.2, this));
                    }
                }
            }
        }

        var actualEnemies = Math.floor(Math.random() * (this.maxEnemies + 1 - 2)) + 2;
        for (var i = 0; i < actualEnemies; i++) {
            var x = -1 + Math.random() * 2;
            var y = -1 + Math.random() * 2;
            var w = this.level.levelManager.eman.player.width * 0.75;
            var h = this.level.levelManager.eman.player.height * 0.75;

            var enemyType = Math.floor(Math.random() * (3 - 1)) + 1;
            this.ents.push(new Enemy(x, y, w, h, this.level.levelManager.eman, this, enemyType));
        }

	};

	this.generateItemRoom = function() {
		var potentialPassives = this.level.levelManager.eman.player.inventory.possiblePassiveItems;
		var potentialActives = this.level.levelManager.eman.player.inventory.possibleActiveItems;
		var activeOrPassive = Math.floor(Math.random() * (11 - 1)) + 1;

		if (activeOrPassive > 9 && potentialActives.length > 0) {
			//select an active item
			var chance = Math.floor(Math.random() * (potentialActives.length - 0)) + 0;
			switch (potentialActives[chance]) {
				case "Flight":
					this.contents.push(new Flight(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Damage All":
					this.contents.push(new DamageAll(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
			}
		}
		else if (potentialPassives.length > 0) {
			//select a passive item
			var chance = Math.floor(Math.random() * (potentialPassives.length - 0)) + 0;
			switch (potentialPassives[chance]) {
				case "Health Up":
					this.contents.push(new HealthUp(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Range Up":
					this.contents.push(new RangeUp(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Speed Up":
					this.contents.push(new SpeedUp(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Fire Rate Up":
					this.contents.push(new FireUp(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Damage Up":
					this.contents.push(new DamageUp(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Sin Shots":
					this.contents.push(new SinShots(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Poison Shots":
					this.contents.push(new PoisonShots(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
				case "Piercing Shots":
					this.contents.push(new PiercingShots(-0.1, -0.1, this.level.levelManager.eman, this, 0));
					break;
			};
		}
	};

	this.generateShopRoom = function() {
		//three things to sell, 2 pickups 1 [passive] item
		var potentialPassives = this.level.levelManager.eman.player.inventory.possiblePassiveItems;
		var itemCost = Math.floor(Math.random() * (50 - 10)) + 10;
		if (potentialPassives.length > 0) {
            //select a passive item
            var chance = Math.floor(Math.random() * (potentialPassives.length - 0)) + 0;
            switch (potentialPassives[chance]) {
                case "Health Up":
                    this.contents.push(new HealthUp(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Range Up":
                    this.contents.push(new RangeUp(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Speed Up":
                    this.contents.push(new SpeedUp(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Fire Rate Up":
                    this.contents.push(new FireUp(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Damage Up":
                    this.contents.push(new DamageUp(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Sin Shots":
                    this.contents.push(new SinShots(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Poison Shots":
                    this.contents.push(new PoisonShots(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
                case "Piercing Shots":
                    this.contents.push(new PiercingShots(-0.1, -0.1, this.level.levelManager.eman, this, itemCost));
                    break;
            };
        }

        var pickupChance1 = Math.floor(Math.random() * (4 - 1)) + 1;
        var pickupChance2 = Math.floor(Math.random() * (4 - 1)) + 1;
        var amountAmmo = Math.floor(Math.random() * (50 - 10)) + 10;
        var amountHealth = Math.floor(Math.random() * (5 - 1)) + 1;

        var cost = Math.floor(Math.random() * (10 - 1)) + 1;

        switch (pickupChance1) {
            case 1:
                this.contents.push(new Bomb(-0.35, -0.1, 0.2, 0.2, this.level.levelManager.eman, this, false, cost));
                break;
            case 2:
                this.contents.push(new Ammo(-0.35, -0.1, this.level.levelManager.eman, this, amountAmmo, cost));
                break;
            case 3:
                this.contents.push(new Health(-0.35, -0.1, this.level.levelManager.eman, this, amountHealth, cost));
                break;
        };

        switch (pickupChance2) {
            case 1:
                this.contents.push(new Bomb(0.3, -0.1, 0.2, 0.2, this.level.levelManager.eman, this, false, cost));
                break;
            case 2:
                this.contents.push(new Ammo(0.3, -0.1, this.level.levelManager.eman, this, amountAmmo, cost));
                break;
            case 3:
                this.contents.push(new Health(0.3, -0.1, this.level.levelManager.eman, this, amountHealth, cost));
                break;
        };
	};

	this.generateSanctuaryRoom = function() {
		//Special - drop loads of health and maybe have health upgrade

		var healthNo = Math.floor(Math.random() * (15 - 5)) + 5;

		for (var i = 0; i < healthNo; i++) {
			var healthAmount = Math.floor(Math.random() * (5 - 2)) + 2;
			var x = -1 + Math.random() * 2;
			var y = -1 + Math.random() * 2;
			this.contents.push(new Health(x, y, this.level.levelManager.eman, this, healthAmount, 0));
		};

		var permaHealthChance = (Math.floor(Math.random() * (100 - 1)) + 1) < 10;
		var permaHealthAmount = Math.floor(Math.random() * (10 - 1)) + 1;

		 if (permaHealthChance) {
		    this.contents.push(new PermanentHealthUpgrade(-0.1, -0.1, permaHealthAmount, this.level.levelManager.eman));
		 }
	};

	this.getVerts = function() {
		var verts = [];
		var per = -1;
		for (var i = 0; i < this.contents.length; i++) {
							if (this.contents[i] instanceof Obstruction) {
								this.textUtils.addString("O", 0.1, new Vec2(this.contents[i].pos.x, this.contents[i].pos.y), false);
							}
							if (this.contents[i] instanceof Pit) {
								this.textUtils.addString("P", 0.1, new Vec2(this.contents[i].pos.x, this.contents[i].pos.y), false);
							}
							if (this.contents[i] instanceof Explosive) {
								this.textUtils.addString("E", 0.1, new Vec2(this.contents[i].pos.x, this.contents[i].pos.y), false);
							}

			if (this.name == "shop") {
				if (this.contents[i].cost && this.contents[i].cost > 0) {
					this.textUtils.addString("$" + this.contents[i].cost, 0.05, new Vec2(this.contents[i].pos.x - (this.contents[i].width / 4), this.contents[i].pos.y - 0.15), false);
				}
			}


			var contentVerts = this.contents[i].getVerts();
			per = (per == -1 ? contentVerts.length / 6 : per);
			for (var j = 0; j < contentVerts.length; j++) {
				verts.push(contentVerts[j]);
			}
		}
		var finalVerts = new Float32Array(verts.length);
		finalVerts.set(verts, 0);
		return {'verts': finalVerts, 'dataper': per};
	};

	this.getDoors = function() {
		return {top: this.topDoor, right: this.rightDoor, bottom: this.bottomDoor, left: this.leftDoor};
	};

	this.update = function(delta) {
		for (var i = 0; i < this.contents.length; i++) {
			this.contents[i].update(delta);
		}
		if (this.addList.length > 0) {
            this.addElements();
        }
        if (this.removeList.length > 0) {
            this.cleanElements();
        }
	};

	this.addElement = function(e) {
		this.addList.push(e);
	};

	this.removeElement = function(e) {
		this.removeList.push(e);
	};

	this.removeDoor = function(e) {
//		console.log("remove door:" + e.name + " at index: " + this.contents.indexOf(e));
		//remove the door directly, this is an emergency! STAT!
		this.contents.splice(this.contents.indexOf(e), 1);

		if (e.name == "left") {
			this.leftDoor = null;
		}
		if (e.name == "right") {
            this.rightDoor = null;
        }
        if (e.name == "bottom") {
            this.bottomDoor = null;
        }
        if (e.name == "top") {
            this.topDoor = null;
        }
	};

	this.addElements = function() {
		for (var i = 0; i < this.addList.length; i++) {
			this.contents.push(this.addList[i]);
		}
		this.addList = [];
	};

	this.cleanElements = function() {
		for (var i = 0; i < this.removeList.length; i++) {
			this.contents.splice(this.contents.indexOf(this.removeList[i]), 1);
		}
		this.removeList = [];
	};

	this.switchedTo = function() {
		this.level.levelManager.eman.player.ignoreLvlCollision = false;
		if (this.name == "combat") {
			this.level.levelManager.eman.addEntList(this.ents);
		}
	};

	this.entDead = function(e) {
		this.ents.splice(this.ents.indexOf(e), 1);

		var dropChance = (Math.floor(Math.random() * (100 - 1)) + 1) < 35;
		if (dropChance) {
			var whichDrop = Math.floor(Math.random() * (5 - 1)) + 1;
			switch (whichDrop) {
				case 1:
					this.contents.push(new Bomb(e.pos.x, e.pos.y, 0.1, 0.1, this.level.levelManager.eman, this, false, 0));
					break;
				case 2:
					var amountAmmo = Math.floor(Math.random() * (20 - 5)) + 5;
					this.contents.push(new Ammo(e.pos.x, e.pos.y, this.level.levelManager.eman, this, amountAmmo, 0));
					break;
				case 3:
					var amountHealth = Math.floor(Math.random() * (5 - 1)) + 1;
					this.contents.push(new Health(e.pos.x, e.pos.y, this.level.levelManager.eman, this, amountHealth, 0));
					break;
				case 4:
					var amountCoin = Math.floor(Math.random() * (50 - 1)) + 1;
					this.contents.push(new Coin(e.pos.x, e.pos.y, this.level.levelManager.eman, this, amountCoin, 0));
			};
		}
	};

	this.generate();
};