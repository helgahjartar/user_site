var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/reg');
var profile = require('./routes/profile');


var app = express();

var errorHandler = require('./middleware/errorHandler');
var notFoundHandler = require('./middleware/notFoundHandler');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var cookie = { domain: '',
               httpOnly: false,
               secure: false };

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'this is a secret!',
  name: 'session',
  cookie: cookie
}));

app.use('/', routes);
app.use('/login', login);
app.use('/reg', register);
app.use('/profile', profile);


app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.use(notFoundHandler);
app.use(errorHandler);


module.exports = app;
