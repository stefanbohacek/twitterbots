const express = require('express'),
      fs = require('fs'),
      router = express.Router(),
      dataSync = require( __dirname + '/../data-sync.js' );

dataSync.sync( function( err, data ){
  router.get('/', function (req, res) { 
    res.render('../views/home.handlebars', {
      project_title: process.env.PROJECT_TITLE || 'New Project',
      project_description: process.env.PROJECT_DESCRIPTION || 'A simple project hosted on Glitch',
      project_name: process.env.PROJECT_DOMAIN,
      data: data,
      dataStr: JSON.stringify( data )
    });
  });
} );




module.exports = router;
