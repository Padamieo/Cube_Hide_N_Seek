var scene;
var camera;
var renderer;

if( !init() )	animate();

function init(){
/* three setup */
width = window.innerWidth;
height = window.innerHeight;

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor( 0xaaccff, 1 ); //
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

scene = new THREE.Scene;



/* Camera Setup */
camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
camera.position.y = 1; //160;
camera.position.z = 4.22; // do not set later when free move
//camera.lookAt(new THREE.Vector3(0,0,0));

camera.updateMatrix(); // make sure camera's local matrix is updated
camera.updateMatrixWorld(); // make sure camera's world matrix is updated
camera.matrixWorldInverse.getInverse( camera.matrixWorld );

scene.add(camera);

/* define a cube */
cubeGeometry = new THREE.CubeGeometry(1, 1, 1);

	/* build add cubes */
	cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xDDDDDD });
	cubes = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cubes.position.z = 0;
	cubes.position.x = 0;
	scene.add(cubes);
	
	level = new THREE.PlaneGeometry( 5, 5 );
	material = new THREE.MeshBasicMaterial( {color: 0xfffff0, side: THREE.DoubleSide} );
	plane = new THREE.Mesh( level, material );
	scene.add( plane )

/* skybox setup */
skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

scene.add(skybox);

/* Light setup */
pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
scene.add(pointLight);
}

// animation loop
function animate() {

	// loop on request animation loop
	// - it has to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame( animate );

	// do the render
	render();

	// update stats
	//stats.update();
}


/* animation loop */
function render() {

	//requestAnimationFrame(render);
	
	renderer.render(scene, camera);
}
