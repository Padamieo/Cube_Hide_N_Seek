var Level = function(levelManager, textUtils, type) {
	this.levelManager = levelManager;
	this.textUtils = textUtils;
	this.rooms = [];
	this.spawn = new Room(this, this.textUtils, 101);
	this.activeRoom = this.spawn;
	this.rooms.push(this.spawn);
	this.type = type;
	this.name = "world";
	this.maxRooms = 10;
	this.minRooms = 3;
	this.actualRooms = Math.floor(Math.random() * (this.maxRooms + 1 - this.minRooms)) + this.minRooms;

	this.generate = function() {
		switch (this.type) {
			case 100:
				//this is a hub/homeworld/whatever
				this.rooms[0] = new Room(this, this.textUtils, 100);
				this.activeRoom = this.rooms[0];
				break;
			case 1:
				//this is an enemy world; prefer combat rooms
				this.generateCombatLevel();
				this.setUpDoors();
				this.finaliseDoors();
				break;
			case 2:
				//this is a supply world; prefer empty rooms and populate with shit to pickup
				this.generateSupplyLevel();
				this.setUpDoors();
				this.finaliseDoors();
				break;
			case 3:
				//this is a deserted world; prefer empty rooms
				this.generateDesertedLevel();
				this.setUpDoors();
				this.finaliseDoors();
				break;
			case 4:
				//this is a market world; prefer shops
				this.generateMarketLevel();
				this.setUpDoors();
				this.finaliseDoors();
				break;
			case 5:
				//this is a friendly world; prefer sanctuaries
				this.generateFriendlyWorld();
				this.setUpDoors();
				this.finaliseDoors();
				break;
			case 6:
				//this is a generic world; normal generation
				this.generateGenericLevel();
				//////console.log("generic gen, doors...");
				this.setUpDoors();
				this.finaliseDoors();
				break;
		}

	};

	this.generateCombatLevel = function() {
		this.name = "combat";

		while (this.rooms.length < this.actualRooms) {
            var type = Math.floor(Math.random() * (6 - 1)) + 1;
            while (type != 2 && type != 1) {
                //only allow combat and empty
                type = Math.floor(Math.random() * (6 - 1)) + 1;
            }
            //////console.log("        Room Type: " + type);
            var newRoom = new Room(this, this.textUtils, type);
            //////console.log("        Room Name: " + newRoom.name);
            this.rooms.push(newRoom);
        }
	};

	this.generateSupplyLevel = function() {
		this.name = "supply";

		while (this.rooms.length < this.actualRooms) {
            var type = Math.floor(Math.random() * (6 - 1)) + 1;
            while (type == 2 || type == 1) {
                //do not allow combat or empty
                type = Math.floor(Math.random() * (6 - 1)) + 1;
            }
            //////console.log("        Room Type: " + type);
            var newRoom = new Room(this, this.textUtils, type);
            //////console.log("        Room Name: " + newRoom.name);
            this.rooms.push(newRoom);
        }
	};

	this.generateDesertedLevel = function() {
		this.name = "deserted";

		while (this.rooms.length < this.actualRooms) {
			var type = 1;
			//only allow empty rooms
            //////console.log("        Room Type: " + type);
            var newRoom = new Room(this, this.textUtils, type);
            //////console.log("        Room Name: " + newRoom.name);
            this.rooms.push(newRoom);
		}
	};

	this.generateMarketLevel = function() {
		this.name = "market";

		while (this.rooms.length < this.actualRooms) {
			var type = Math.floor(Math.random() * (6 - 1)) + 1;
			while (type != 1 && type != 4) {
				//only allow empty and shop
				type = Math.floor(Math.random() * (6 - 1)) + 1;
			}
			//////console.log("        Room Type: " + type);
			var newRoom = new Room(this, this.textUtils, type);
			//////console.log("        Room Name: " + newRoom.name);
			this.rooms.push(newRoom);
		}
	};

	this.generateFriendlyWorld = function() {
		this.name = "friendly";

		while (this.rooms.length < this.actualRooms) {
			var type = Math.floor(Math.random() * (6 - 1)) + 1;
			while (type == 2) {
				//do not allow combat rooms
				type = Math.floor(Math.random() * (6 - 1)) + 1;
			}
			//////console.log("        Room Type: " + type);
			var newRoom = new Room(this, this.textUtils, type);
			//////console.log("        Room Name: " + newRoom.name);
			this.rooms.push(newRoom);
		}
	};

	this.generateGenericLevel = function() {
		this.name = "generic";

		while (this.rooms.length < this.actualRooms) {
			var type = Math.floor(Math.random() * (6 - 1)) + 1;
			//////console.log("        Room Type: " + type);
			var newRoom = new Room(this, this.textUtils, type);
			//////console.log("        Room Name: " + newRoom.name);
			this.rooms.push(newRoom);
		}
	};

	this.setUpDoors = function() {
		for (var i = 0; i < this.rooms.length - 1; i++) {
			var doors = this.rooms[i].getDoors();
			var nextDoors = this.rooms[i+1].getDoors();
			var attempt = -1;

			while (attempt == -1) {
				attempt = this.setUpDoorLink(doors, nextDoors, i);
			}
		};
	};

	this.setUpDoorLink = function(doors, nextDoors, i) {
		var chance = Math.floor(Math.random() * (5 - 1)) + 1;
        //console.log("chance: " + chance);

        switch (chance) {
            case 1:
                //set up an "up connection" between this room and the next
                if (doors.top.leadsTo != -1) return -1;
                doors.top.leadsTo = i+1;
                nextDoors.bottom.leadsTo = i;
                return 1;
                break;
            case 2:
                //set up a "right connection"
                if (doors.right.leadsTo != -1) return -1;
                doors.right.leadsTo = i+1;
                nextDoors.left.leadsTo = i;
                return 1;
                break;
            case 3:
                //set up a "down connection"
                if (doors.bottom.leadsTo != -1) return -1;
                doors.bottom.leadsTo = i+1;
                nextDoors.top.leadsTo = i;
                return 1;
                break;
            case 4:
                //set up a "left connection"
                if (doors.left.leadsTo != -1) return -1;
                doors.left.leadsTo = i+1;
                nextDoors.right.leadsTo = i;
                return 1;
                break;
        }
	};

	this.finaliseDoors = function() {
		for (var i = 0; i < this.rooms.length; i++) {
			var doors = this.rooms[i].getDoors();
			if (doors.bottom.leadsTo == -1) {
				//console.log("remove bottom for room: " + i);
				this.rooms[i].removeDoor(doors.bottom);
				////console.log(this.rooms[i].getDoors());
			}
			if (doors.top.leadsTo == -1) {
				//console.log("remove top for room: " + i);
				this.rooms[i].removeDoor(doors.top);
				////console.log(this.rooms[i].getDoors());
			}
			if (doors.left.leadsTo == -1) {
				//console.log("remove left for room: " + i);
				this.rooms[i].removeDoor(doors.left);
				////console.log(this.rooms[i].getDoors());
			}
			if (doors.right.leadsTo == -1) {
				//console.log("remove right for room: " + i);
				this.rooms[i].removeDoor(doors.right);
				////console.log(this.rooms[i].getDoors());
			}
			////console.log("room number " + i + " [name=" + this.rooms[i].name + "] content:");
            ////console.log(this.rooms[i].contents);
		}
	};

	this.getVerts = function() {
		return this.activeRoom.getVerts();
	};

	this.update = function(delta) {
		this.activeRoom.update(delta);
	};

	this.switchToRoom = function(dest) {
		this.levelManager.eman.removeEntList(this.activeRoom.ents);
		this.activeRoom = this.rooms[dest];
		this.activeRoom.switchedTo();
	};

	this.generate();
};