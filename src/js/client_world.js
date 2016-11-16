var container, scene, camera, renderer, raycaster, objects = [], directionalLight;
var keyState = {};
var sphere;

var player, playerId, moveSpeed, turnSpeed;

var playerData;

var otherPlayers = [], otherPlayersId = [];

var three = THREE.Bootstrap();

var loadWorld = function(){

      var random_cube = create_cube();
      three.scene.add( random_cube );

      //add an ambient light
      var ambient = new THREE.AmbientLight( 0x050505 );
      three.scene.add( ambient );

      //add a directional light
      directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
      directionalLight.position.set( 2, 1.2, 10 ).normalize();
      three.scene.add( directionalLight );

      //Events------------------------------------------
      document.addEventListener('click', onMouseClick, false );
      document.addEventListener('mousedown', onMouseDown, false);
      document.addEventListener('mouseup', onMouseUp, false);
      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseout', onMouseOut, false);
      document.addEventListener('keydown', onKeyDown, false );
      document.addEventListener('keyup', onKeyUp, false );
      window.addEventListener( 'resize', onWindowResize, false );

      three.camera.position.set(1, 1, 0.5);

      three.on('update', function () {
        if ( player ){
          updateCameraPosition();
          checkKeyStates();
          three.camera.lookAt( player.position );
        }

      });

      three.init();

    function onMouseClick(){
      intersects = calculateIntersects( event );

      if ( intersects.length > 0 ){
        //If object is intersected by mouse pointer, do something
        // if (intersects[0].object == sphere){
        //     alert("This is a sphere!");
        // }
      }
    }

    function onMouseDown(){
    }

    function onMouseUp(){
    }

    function onMouseMove(){
      console.log("mouse moved");
    }

    function onMouseOut(){
    }

    function onKeyDown( event ){
      //event = event || window.event;
      keyState[event.keyCode || event.which] = true;
    }

    function onKeyUp( event ){
      //event = event || window.event;
      keyState[event.keyCode || event.which] = false;
    }

    function onWindowResize() {
      three.camera.aspect = window.innerWidth / window.innerHeight;
      three.camera.updateProjectionMatrix();
      three.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function calculateIntersects( event ){
      //Determine objects intersected by raycaster
      event.preventDefault();
      var vector = new THREE.Vector3();
      vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
      vector.unproject( camera );
      raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
      var intersects = raycaster.intersectObjects( objects );
      return intersects;
    }

};

function create_cube(data){

  if(data != undefined){
    var sizeX = data.sizeX;
    var sizeY = data.sizeY;
    var sizeZ = data.sizez;
  }else{
    var sizeX = 1;
    var sizeY = 1;
    var sizeZ = 1;
  }

  //this needs to be array to hold all cube_geometry or we end up with one cube with material
  cube_geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
  cube_material = new THREE.MeshLambertMaterial({color: 0x7f1d1d});

  return new THREE.Mesh(cube_geometry, cube_material);
}

function place_and_rotate(object){
  object.position.x = Math.random()*5;
  object.position.y = Math.random()*5;
  object.position.z = Math.random()*5;
  //object.rotation.set(Math.random()*5, Math.random()*5, Math.random()*5);
}

var createPlayer = function(data){

    playerData = data;

    // no idea why this does not work
    // player = create_cube(data);
    // console.log(player);

    player = new THREE.Mesh(new THREE.CubeGeometry(data.sizeX, data.sizeX, data.sizeX), new THREE.MeshLambertMaterial({color: 0x7777ff, transparent:true, opacity:0.8, side: THREE.DoubleSide}));

    player.rotation.set(0,0,0);
    player.position.x = data.x;
    player.position.y = data.y;
    player.position.z = data.z;

    playerId = data.playerId;
    moveSpeed = data.speed;
    turnSpeed = data.turnSpeed;
    updateCameraPosition();
    objects.push( player );
    three.scene.add( player );
    three.camera.lookAt( player.position );
};

var updateCameraPosition = function(){
  three.camera.position.x = player.position.x + 2* Math.sin( player.rotation.y );
  three.camera.position.y = player.position.y + 2;
  three.camera.position.z = player.position.z + 2.5 * Math.cos( player.rotation.y );
};

var updatePlayerPosition = function(data){

  var somePlayer = playerForId(data.playerId);

  somePlayer.position.x = data.x;
  somePlayer.position.y = data.y;
  somePlayer.position.z = data.z;

  somePlayer.rotation.x = data.r_x;
  somePlayer.rotation.y = data.r_y;
  somePlayer.rotation.z = data.r_z;

};

var updatePlayerData = function(){

  playerData.x = player.position.x;
  playerData.y = player.position.y;
  playerData.z = player.position.z;

  playerData.r_x = player.rotation.x;
  playerData.r_y = player.rotation.y;
  playerData.r_z = player.rotation.z;

};

var checkKeyStates = function(){

    if (keyState[38] || keyState[87]) {
        // up arrow or 'w' - move forward
        //player.position.x -= moveSpeed * Math.sin(player.rotation.y);
        //player.position.z -= moveSpeed * Math.cos(player.rotation.y);
        player.rotation.x += turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[40] || keyState[83]) {
        // down arrow or 's' - move backward
        //player.position.x += moveSpeed * Math.sin(player.rotation.y);
        //player.position.z += moveSpeed * Math.cos(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[37] || keyState[65]) {
        // left arrow or 'a' - rotate left
        player.rotation.y += turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[39] || keyState[68]) {
        // right arrow or 'd' - rotate right
        player.rotation.y -= turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[81]) {
        // 'q' - strafe left
        player.position.x -= moveSpeed * Math.cos(player.rotation.y);
        player.position.z += moveSpeed * Math.sin(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[69]) {
        // 'e' - strage right
        player.position.x += moveSpeed * Math.cos(player.rotation.y);
        player.position.z -= moveSpeed * Math.sin(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }

};

var addOtherPlayer = function(data){

  //otherPlayer = create_cube(data);

  cube_geometry3 = new THREE.BoxGeometry(data.sizeX, data.sizeX, data.sizeX);
  cube_material3 = new THREE.MeshLambertMaterial({color: 0x7777ff});
  otherPlayer = new THREE.Mesh(cube_geometry3, cube_material3);

  otherPlayersId.push( data.playerId );
  otherPlayers.push( otherPlayer );
  objects.push( otherPlayer );
  three.scene.add( otherPlayer );

};

var removeOtherPlayer = function(data){
  three.scene.remove( playerForId(data.playerId) );
};

var playerForId = function(id){
  var index;
  for (var i = 0; i < otherPlayersId.length; i++){
    if (otherPlayersId[i] == id){
      index = i;
      break;
    }
  }
  return otherPlayers[index];
};
