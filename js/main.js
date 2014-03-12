var scene;
var camera;
var renderer;
var stats;

if( !init() )	animate();

function init(){
	/* three setup */
	scene = new THREE.Scene;
	width = window.innerWidth;
	height = window.innerHeight;
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0xaaccff, 1 ); //
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	// add Stats.js - https://github.com/mrdoob/stats.js
	stats = new Stats();
	stats.domElement.style.position	= 'absolute';
	stats.domElement.style.bottom	= '0px';
	stats.domElement.style.left	= '0px';
	document.body.appendChild( stats.domElement );

	/* camera Setup need to be part of build class*/
	camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 2000);
	camera.position.y = -2; 
	camera.position.z = 2; 
	camera.lookAt(new THREE.Vector3(0,0,0.9));
	scene.add(camera);
	
	/* define a cube or player? */
	cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
	cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xDDDDDD });
	cubes = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cubes.position.z = 0.5;
	cubes.position.x = 0;
	scene.add(cubes);
	
	/* level setup */
	level = new THREE.PlaneGeometry( 5, 5 );
	material = new THREE.MeshBasicMaterial( {color: 0xfffff0, side: THREE.DoubleSide} );
	plane = new THREE.Mesh( level, material );
	scene.add( plane );

	/* skybox setup */
	skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
	skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);

	/* light setup */
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
	stats.update();
}


// render loop
function render() {
	
	renderer.render(scene, camera);
}
