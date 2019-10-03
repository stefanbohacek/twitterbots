const dataSync = require( __dirname + '/data-sync.js' ),
      app = require( __dirname + '/app.js' );

dataSync.sync( function( err, data ){
  var listener = app.listen(process.env.PORT, function() {
    console.log(`app is running on port ${listener.address().port}...`);
  });  
} );
