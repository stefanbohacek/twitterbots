const fs = require( 'fs' ),
      helpers = require( __dirname + '/helpers/general.js' ),      
      Twit = require( 'twit' ),    
      dataFilePath = __dirname + '/data/data.json',
      botListFilePath = __dirname + '/data/bots.json';

let dataSync = {
  reload: function( cb ){
    console.log( 'reloading data...' );
    let twit = new Twit( {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      app_only_auth: true
    } );

    let botList = fs.readFileSync( botListFilePath );

    try{
      botList = JSON.parse( botList );
    } catch ( err ){ console.log( err ) }
    
    if ( botList && botList.length ){
      // console.log( 'botList', botList );
      
      twit.get( 'users/lookup', {
        screen_name: botList.join(',')
      }, function( err, data, response ) {
        if ( err ){
          console.log( err );
        } else {
          let updatedBotData = [];
          data.forEach( function( bot ){
              updatedBotData.push( {
                  id_str: bot.id_str,
                  name: bot.name,
                  screen_name: bot.screen_name,
                  description: bot.description,
                  followers_count: bot.followers_count,
                  friends_count: bot.friends_count,
                  created_at: bot.created_at,
                  favourites_count: bot.favourites_count,
                  verified: bot.verified,
                  statuses_count: bot.statuses_count,
                  profile_background_image_url_https: bot.profile_background_image_url_https,
                  profile_image_url_https: bot.profile_image_url_https
              } );
          } );

          // console.log( updatedBotData );

          fs.writeFile( dataFilePath, JSON.stringify( {
            last_update: Date.now(),
            data: updatedBotData.sort( helpers.sortByFollowersCount )
          } ), function ( err ) {
           if ( err ){
             console.log( err )
           }
          } );  

          if ( cb ){
            cb( null, updatedBotData );
          }
        }
      } );        
    }  
  },
  sync: function( cb ){
    let botData = fs.readFileSync( dataFilePath ),
        dataSync = this;

    try{
      botData = JSON.parse( botData );
    } catch ( err ){ console.log( err ) }

    if ( botData ){
      // console.log( botData );
      botData.data = botData.data.sort( helpers.sortByFollowersCount );
      var todayDate = new Date(),
          lastCheckDate = new Date( botData.last_update ),
          expirationDate = new Date( lastCheckDate.getTime() + 1440 * 60 * 1000 );
      
      console.log( {
          'lastCheckDate': lastCheckDate,
          'expirationDate': expirationDate,
          'todayDate': todayDate,
          'todayDate > expirationDate': todayDate > expirationDate,
          // 'botData': botData
      } );
      
      if ( !botData || !botData.data || !botData.data.length || todayDate > expirationDate ){
        /* Update data */
        dataSync.reload( function( err, data ){
          cb( null, data );
        });
      } else {
        if ( cb ){
          cb( null, botData );
        }
      }
    }
  }  
}

module.exports = dataSync;
