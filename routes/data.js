/* Expose files saved in the data folder. */

const express = require( 'express' ),
      fs = require( 'fs' ),
      router = express.Router();

router.get( '/:data', function ( req, res)  {
  const fileName = req.params.data;
  let data = '[]';

  if ( fileName ){
    const filePath = `${ process.cwd() }/data/${ fileName }`;
    
    fs.access( filePath, fs.F_OK, function( err ) {
      if ( err ) {
        console.log( err );
        res.end(data);
      } else {
        fs.readFile( filePath, 'utf8', function read( err, data ) {
          if ( err ) {
              throw err;
          }
          // res.end( data )
          res.json( data );
        } );
      }
    } ); 
  }
} );

module.exports = router;
