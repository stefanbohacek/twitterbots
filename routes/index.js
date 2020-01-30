const express = require( 'express' ),
  fs = require( 'fs' ),
  router = express.Router(),
  moment = require( 'moment' ),
  helpers = require(__dirname + '/../helpers/general.js'),      
  data = JSON.parse( fs.readFileSync( `${ process.cwd() }/data/data.json`, 'utf8' ) );

// console.log( data );

let twitterData = data.data.sort( function( a, b ){
  if ( a.followers_count > b.followers_count ) return -1;
  if ( a.followers_count < b.followers_count ) return 1;
  return 0;
} );

// const verifiedBots = twitterData.filter( function( bot ){
//   return bot.verified;
// } );

// console.log( verifiedBots.map( function( bot ){ return bot.screen_name } ) );

twitterData = twitterData.map( function( bot ) {
  const lastTweetDate = bot.last_tweet_date || Date.now();

  const duration = moment.duration(
    moment(lastTweetDate).diff(moment(bot.created_at))
  );

  const tweetsPerDay = helpers.numberWithCommas( Math.round( bot.statuses_count / duration.asDays() ) );
  let tweetFrequency;

  if ( tweetsPerDay < 1 ){
    tweetFrequency = `less than one tweet per day`
  } else if ( tweetsPerDay < 2 ){
    tweetFrequency = `about 1 tweet per day`
  } else {
    tweetFrequency = `about ${ tweetsPerDay } tweets per day`
  }

  return {
    name: bot.name,
    screen_name: `@${ bot.screen_name }`,
    verified: bot.verified,
    url: `https://twitter.com/${ bot.screen_name }`,
    profile_background_image_url_https: bot.profile_background_image_url_https,
    profile_image_url_https: bot.profile_image_url_https,
    description: bot.description,
    followers_count: helpers.numberWithCommas( bot.followers_count ),
    statuses_count: helpers.numberWithCommas( bot.statuses_count ),
    lastTweetDate: lastTweetDate,
    tweetsPerDay: tweetsPerDay,
    tweetFrequency: tweetFrequency
  }
} );



router.get( '/', function( req, res ) {
  res.render( '../views/home.handlebars', {
    project_title: process.env.PROJECT_TITLE || 'New Project',
    project_description:
      process.env.PROJECT_DESCRIPTION || 'A simple project hosted on Glitch',
    project_name: process.env.PROJECT_DOMAIN,
    data: twitterData,
    dataTopTen: twitterData.slice( 0, 10 )
  } );
} );

module.exports = router;
