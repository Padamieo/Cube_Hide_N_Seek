// var app = require('express')();
// var server = app.listen(8889);
// var http = require('http').Server(app);
// //var io = require('socket.io')(http);
// var io = require('socket.io').listen(server);
// var http = require('http');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var world = require('./js/server_world');
var os = require('os');

function getAddress(idx) {
  var addresses = [],
  interfaces = os.networkInterfaces(),
  name, ifaces, iface;

  for (name in interfaces) {
    if(interfaces.hasOwnProperty(name)){
      ifaces = interfaces[name];
      if(!/(loopback|vmware|internal)/gi.test(name)){
        for (var i = 0; i < ifaces.length; i++) {
          iface = ifaces[i];
          if (iface.family === 'IPv4' &&  !iface.internal && iface.address !== '127.0.0.1') {
            addresses.push(iface.address);
          }
        }
      }
    }
  }
  // if an index is passed only return it.
  if(idx >= 0)
    return addresses[idx];
  return addresses;
}

//this is a mess what happens when we have many ip's in an array
var ip_array = getAddress();
console.log( ip_array );
var ip = ip_array[0];
console.log( ip );

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/js/client_world.js', function(req, res){
  res.sendFile(__dirname + '/js/client_world.js');
});

io.on('connection', function(socket){
  console.log('a user connected');

  var id = socket.id;
  world.addPlayer(id);

  var player = world.playerForId(id);
  socket.emit('createPlayer', player);

  socket.broadcast.emit('addOtherPlayer', player);

  socket.on('requestOldPlayers', function(){
    for (var i = 0; i < world.players.length; i++){
      if (world.players[i].playerId != id)
        socket.emit('addOtherPlayer', world.players[i]);
    }
  });

  socket.on('updatePosition', function(data){
    var newData = world.updatePlayerData(data);
    socket.broadcast.emit('updatePosition', newData);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('removeOtherPlayer', player);
    world.removePlayer( player );
  });

});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8889;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || ip;

app.listen(port, ip_address, function(){
  console.log( "Listening on " + ip_address + ", server_port " + port );
});


// app.listen(port, function(){
//    console.log('listening on *: 3000');
// });
