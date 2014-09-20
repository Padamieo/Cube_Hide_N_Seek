var renderer;
var entityManager;
var lvlManager;
var textUtils;
var angleInRadians = 0;
var keys = {};
var delta = 0;
var lastLoopTime = 0;
var state = 1;
var pauseCoolDown = false;
var pauseCoolTime = 0;
var ENT_TEX_SIZE = 1 / 17;
var LVL_TEX_SIZE = 1 / 8;

$(function() {
    begin();
	window.requestAnimationFrame(run);
 });

$(window).keydown(function(e) {
    keys[e.which] = true;
});
$(window).keyup(function(e) {
    keys[e.which] = false;
});
$(window).click(function(e) {
	interactWithWorld(e.clientX, e.clientY);
});

function begin() {
	textUtils = new TextUtils();
	textUtils.setUpFont();
    renderer = new Renderer(textUtils);
    entityManager = new EntityManager(renderer);
    translationMatrix = new Mat3(0, 0);
    rotationMatrix = new Mat3(0, 0);
    scaleMatrix = new Mat3(0, 0);
    lvlManager = new LevelManager(renderer, entityManager, textUtils);
	entityManager.player.pos.x = -entityManager.player.width / 2;
    entityManager.player.pos.y = -entityManager.player.height / 2;
    entityManager.player.hasGravity = false;
}

function run(t) {
    window.requestAnimationFrame(run);
    delta = Date.now() - lastLoopTime;
    lastLoopTime = Date.now();
    lastLoopTime = Date.now();

    switch (state) {
        case 0:
            //Menu
            break;
        case 1:
            game();
            break;
        case 2:
            paused();
            break;
        case 3:
            chooseWorld();
            break;
        case 4:
            manageInventory();
            break;
    }
}

function draw() {
    gl.clearColor(0.129, 0.0, 0.498, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    lvlManager.render();
    entityManager.render();
    textUtils.render(renderer);
}

function PORTAL_ACTIVATE(name) {
	if (name == "home") {
		//embark
		console.log("GOING OUT");
		lvlManager.flushWorlds();
		lvlManager.getNewWorlds();

		state = 3;
	}
	else {
		//go home
		console.log("GOING HOME");

		lvlManager.flushWorlds();
		lvlManager.activeLevel = lvlManager.levels[0];
	}
};

function MANAGEMENT_ACTIVATE() {
	state = 4;
};

function game() {
	if (keys[68]) {
        //D
        entityManager.player.moveHor(1);
    }
    else if (keys[65]) {
        //A
        entityManager.player.moveHor(-1);
    }
    else {
        entityManager.player.moveHor(0);
    }
    if (keys[87]) {
        //W
        entityManager.player.moveVer(-1);
    }
    else if (keys[83]) {
        //S
        entityManager.player.moveVer(1);
    }
    else {
        entityManager.player.moveVer(0);
    }

    if (keys[76]) {
        //Right arrow
        entityManager.player.shoot(1);
    }
    else if (keys[74]) {
        //Left arrow
        entityManager.player.shoot(3);
    }
    else if (keys[73]) {
        //Up arrow
        entityManager.player.shoot(0);
    }
    else if (keys[75]) {
        //Down arrow
        entityManager.player.shoot(2);
    }

    if (keys[16]) {
        entityManager.player.bomb();
    }

    if (keys[69]) {
        entityManager.player.interact();
    }

    if (keys[80]) {
        if (!pauseCoolDown) {
            state = 2;
            pauseCoolDown = true;
        }
    }

    if (keys[32]) {
        entityManager.player.ability();
    }

    if (pauseCoolDown) {
        pauseCoolTime++;
        if (pauseCoolTime > 30) {
            pauseCoolTime = 0;
            pauseCoolDown = false;
        }
    }

	lvlManager.update(delta);
	textUtils.addString("Health = " + entityManager.player.health, 0.05, new Vec2(0.35, 0.85), false);
	textUtils.addString("Money = " + entityManager.player.money, 0.05, new Vec2(0.35, 0.75), false);
	textUtils.addString("Ammo = " + entityManager.player.ammo, 0.05, new Vec2(0.35, 0.65), false);
	textUtils.addString("Bombs = " + entityManager.player.bombs, 0.05, new Vec2(0.35, 0.55), false);
    entityManager.update(delta);
    draw();
};

function paused() {
	if (keys[80]) {
        if (!pauseCoolDown) {
            state = 1;
            pauseCoolDown = true;
            pauseCoolTime = 0;
        }
    }

    if (pauseCoolDown) {
        pauseCoolTime++;
        if (pauseCoolTime > 30) {
            pauseCoolTime = 0;
            pauseCoolDown = false;
        }
    }

	textUtils.addString("PAUSED", 0.1, new Vec2(-0.35, 0.65), false);
	draw();
};

function chooseWorld () {
	textUtils.addString("CHOOSE YOUR WORLD", 0.05, new Vec2(-0.9, 0.75), false);

	for (var i = 1; i < lvlManager.levels.length; i++) {
        textUtils.addString("[ " + i + " ] " + lvlManager.levels[i].name, 0.05, new Vec2(-0.9, 0.55 - (i * 0.1)), false);
    }
    textUtils.addString("[ Enter ]  Exit", 0.05, new Vec2(-0.9, -0.15), false);

	if (keys[13]) {
		lvlManager.flushWorlds();
		state = 1;
	}

	if (keys[49]) {
		lvlManager.activeLevel = lvlManager.levels[1];
		lvlManager.flushWorlds();
		state = 1;
	}
	if (keys[50]) {
        lvlManager.activeLevel = lvlManager.levels[2];
        lvlManager.flushWorlds();
        state = 1;
    }
    if (keys[51]) {
        lvlManager.activeLevel = lvlManager.levels[3];
        lvlManager.flushWorlds();
        state = 1;
    }
    if (keys[52]) {
        lvlManager.activeLevel = lvlManager.levels[4];
        lvlManager.flushWorlds();
        state = 1;
    }
    if (keys[53]) {
        lvlManager.activeLevel = lvlManager.levels[5];
        lvlManager.flushWorlds();
        state = 1;
    }

	draw();
};

function manageInventory () {
	var y = 0.75;
	textUtils.addString("MANAGE INVENTORY", 0.05, new Vec2(-0.9, y), false);
	y -= 0.2;

	var storedPassives = entityManager.player.inventory.storedPassiveItems;
	var storedActives = entityManager.player.inventory.storedActiveItems;

	textUtils.addString("Active Items [ press number to equip ]", 0.05, new Vec2(-0.9, y), false);
	y -= 0.1;

	for (var i = 0; i < storedActives.length; i++) {
		textUtils.addString("  [ " + i + " ] " + storedActives[i].name, 0.05, new Vec2(-0.9, y), false);
        y -= 0.1;
	}
	if (storedActives.length == 0) {
		textUtils.addString("  None [ yet ]", 0.05, new Vec2(-0.9, y), false);
		y -= 0.1;
	}


	textUtils.addString("Passive Items [ already applied ]", 0.05, new Vec2(-0.9, y), false);

	y -= 0.1;

	for (var i = 0; i < storedPassives.length; i++) {
		textUtils.addString("  " + storedPassives[i].name, 0.05, new Vec2(-0.9, y), false);
		y -= 0.1;
	}
	if (storedPassives.length == 0) {
	    textUtils.addString("  None [ yet ]", 0.05, new Vec2(-0.9, y), false);
	    y -= 0.1;
	}

	 textUtils.addString("[ Enter ]  Exit", 0.05, new Vec2(-0.9, y - 0.1), false);


	if (keys[13]) {
		state = 1;
	}

	if (keys[49]) {
	    entityManager.player.inventory.setActive(0);
	}
	if (keys[50]) {
	   entityManager.player.inventory.setActive(1);
	    state = 1;
	}

	draw();
};

function interactWithWorld(x, y) {
	console.log("X: " + 2 / x + " Y: " + 2 / y);
	entityManager.addEnt(new Interaction(2 / x, 2 / y, 0.2, 0.2, entityManager));
}