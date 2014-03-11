var stats, scene, renderer;
var camera, cameraControl;


if( !init() )	animate();

function init(){
	/* three setup */
	var width = window.innerWidth;
	var height = window.innerHeight;
	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0xaaccff, 1 ); //
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	
	var scene = new THREE.Scene;
	
	// put a camera in the scene
	var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
	
	camera.position.set(0, 0, 20);
	//camera.position.y = 100; //160;
	//camera.position.z = 500; // do not set later when free move
	
	camera.lookAt(new THREE.Vector3(0,0,0)); //this needs to lock onto the cube no coordinates
	
	scene.add(camera);
	
	/* skybox setup */
	var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

	scene.add(skybox);
	
	// here you add your objects
	// - you will most likely replace this part by your own
	var player new THREE.CubeGeometry( 1, 1, 1 );
	var material	= new THREE.MeshNormalMaterial();
	var mesh	= new THREE.Mesh( player, material );
	scene.add( mesh );
	
	var level = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshBasicMaterial( {color: 0xfffff0, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( level, material );
	scene.add( plane );
}


function animate(){
	
	requestAnimationFrame( animate );
	
	render();
	
	// update stats
	stats.update();
}

/* animation loop */
function render() {

	requestAnimationFrame(render);
	
	
	renderer.render(scene, camera);
}

