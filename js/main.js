
/* three setup */
var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor( 0xaaccff, 1 ); //
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene;

var cubes;

/* Camera Setup */
var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
camera.position.y = 1; //160;
camera.position.z = 4.22; // do not set later when free move
//camera.lookAt(new THREE.Vector3(0,0,0));

camera.updateMatrix(); // make sure camera's local matrix is updated
camera.updateMatrixWorld(); // make sure camera's world matrix is updated
camera.matrixWorldInverse.getInverse( camera.matrixWorld );

scene.add(camera);

/* define a cube */
var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);

	/* build add cubes */
	var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xDDDDDD });
	//cubeMaterial.color.setRGB (1, 1, 1);
	cubes = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cubes.position.z = 0;
	cubes.position.x = 0;
	scene.add(cubes);
	
	var level = new THREE.PlaneGeometry( 5, 5 );
	var material = new THREE.MeshBasicMaterial( {color: 0xfffff0, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( level, material );
	scene.add( plane )

/* skybox setup */
var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

scene.add(skybox);

/* Light setup */
var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
scene.add(pointLight);

/* animation loop */
function render() {

	requestAnimationFrame(render);
	
	renderer.render(scene, camera);
}
render();
