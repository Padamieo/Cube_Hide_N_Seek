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

var i = 0;

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
    renderer = new Renderer3D(textUtils);
    entityManager = new EntityManager(renderer);
    translationMatrix = new Mat3(0, 0);
    rotationMatrix = new Mat3(0, 0);
    scaleMatrix = new Mat3(0, 0);
//    lvlManager = new LevelManager(renderer, entityManager, textUtils);

	entityManager.addEnt(new Cube(-0.5, -0.5, 1, 1, entityManager));
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
    }
}

function draw() {
    gl.clearColor(0, 0.0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//    lvlManager.render();
    entityManager.render();
    textUtils.render(renderer);
}

function game() {
    if (keys[80]) {
        if (!pauseCoolDown) {
            state = 2;
            pauseCoolDown = true;
        }
    }

    if (pauseCoolDown) {
        pauseCoolTime++;
        if (pauseCoolTime > 30) {
            pauseCoolTime = 0;
            pauseCoolDown = false;
        }
    }

//	lvlManager.update(delta);
    entityManager.update(delta);
    draw();
	if (i >= 60) {
	}
	else {
		i++;
	}
	
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
	draw();
};