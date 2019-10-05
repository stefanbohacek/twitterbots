const express = require( 'express' ),
      dataSync = require( __dirname + '/../data-sync.js' ),
      router = express.Router();

router.get( '/', function(req, res) {
  // Ignore if SYNC_INTERVAL_PASSWORD is not set up.
  if ( process.env.SYNC_INTERVAL_PASSWORD && req.query.password === process.env.SYNC_INTERVAL_PASSWORD ){
    dataSync.reload( function( err, data ){
      res.json( {
        err: err,
        data: data
      } );
    } );
  }
  else {
    res.redirect( '/' );
  }
});

module.exports = router;
