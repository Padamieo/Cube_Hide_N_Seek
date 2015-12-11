$( document ).ready(function() {

  var object = document.getElementById("start_server");

  object.addEventListener('click', activate_server, false);

  function activate_server(){

    var exec = require('child_process').exec;
    exec('node serve/app.js ', function(error, stdout, stderr) {
        if (error !== null) {
          throw error;
        }
        console.log('Server listening');
    });

  }

  var kill = function (pid, signal, callback) {
      signal   = signal || 'SIGKILL';
      callback = callback || function () {};
      var killTree = true;
      if(killTree) {
          psTree(pid, function (err, children) {
              [pid].concat(
                  children.map(function (p) {
                      return p.PID;
                  })
              ).forEach(function (tpid) {
                  try { process.kill(tpid, signal) }
                  catch (ex) { }
              });
              callback();
          });
      } else {
          try { process.kill(pid, signal) }
          catch (ex) { }
          callback();
      }
  };

  // ... somewhere in the code of Yez!
  var stop = document.getElementById("stop_server");

  stop.addEventListener('click', deactivate_server, false);

  function deactivate_server(){
    //var proc = require('child_process');
    //proc.kill('SIGINT');
    kill(child.pid);
  }

});
