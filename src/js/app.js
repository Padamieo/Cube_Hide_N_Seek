var exec = require('child_process').exec;
exec('node multiplayer_template-master/app.js ', function(error, stdout, stderr) {
    if (error !== null) {
      throw error;
    }
    console.log('Server listening');
});
