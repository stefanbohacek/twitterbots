const path = require('path'),
      express = require('express'),
      exphbs  = require('express-handlebars'),
      Handlebars = require('handlebars'),
      {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
      bodyParser = require('body-parser'),
      sassMiddleware = require('node-sass-middleware'),
      babelify = require('express-babelify-middleware'),
      helpers = require(__dirname + '/helpers/general.js'),
      app = express();

app.use( sassMiddleware( {
  // debug: true,
  src: __dirname + '/src',
  dest: path.join( __dirname, 'public' ),
  outputStyle: 'compressed'
} ) );

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use( bodyParser.json() );

// app.use('/js/', babelify('src/scripts/', {
//   minify: true
// }));

// app.engine('handlebars', exphbs());
app.engine('handlebars', exphbs.engine({ extname: '.handlebars', defaultLayout: "main"}));
app.set('view engine', 'handlebars')

app.set('views', __dirname + '/views');
// app.set('view engine', 'hbs');
// app.set('view engine', 'handlebars');

app.use('/', require('./routes/index.js'))
app.use('/data', require('./routes/data.js'))
app.use('/sync', require('./routes/sync.js'))

app.get('/js/helpers.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/helpers/general.js'));
});

module.exports = app;
