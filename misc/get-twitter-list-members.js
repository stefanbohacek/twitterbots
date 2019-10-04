const fs = require( 'fs' ),
      path = require( 'path' ),
      Twit = require( 'twit' ),
      config = require( path.join( __dirname, 'config.js' ) );
      T = new Twit( config.twitter );

T.get( 'lists/members', {
  owner_screen_name: 'botally',
  slug: 'omnibots',
  count: 5000,
  skip_status: true
}, function( err, data, response ) {
  if ( err ){
    console.log( 'error:', err );
  }
  else if ( data && data.users ){
    let bots = [];
    data.users.forEach(  function ( user ){
      bots.push( {
        username: `@${user.screen_name}`,
        followers: user.followers_count
      } );
    } );

    bots = bots.sort( function( a, b ) {
      return b.followers - a.followers;
    } );

    console.log( bots );
    fs.writeFileSync( 'followers.json', JSON.stringify( bots, null, 4 ) );
  }
} );
