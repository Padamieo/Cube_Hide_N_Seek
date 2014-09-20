var renderer;
var entityManager;
var lvlManager;
var angleInRadians = 0;
var keys = {};
var delta = 0;
var lastLoopTime = 0;
var state = 1;

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

function begin() {
    renderer = new Renderer();
    entityManager = new EntityManager(renderer);
    translationMatrix = new Mat3(0, 0);
    rotationMatrix = new Mat3(0, 0);
    scaleMatrix = new Mat3(0, 0);
    lvlManager = new LevelManager(renderer, entityManager);
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
    }
}

function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

//    lvlManager.render();
    entityManager.render();
}

function game() {
//  lvlManager.update(delta);
    entityManager.update(delta);
    draw();
}