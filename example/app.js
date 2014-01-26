var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    user = require('../lib');

var app = express();

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// cookies
app.use(express.cookieParser('cookie secret'));
app.use(express.cookieSession({
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
    key: 'passport cookie name'
}));

// mongoose
mongoose.connect('mongodb://localhost/node-user');
require('./model');

// users!
user(app, mongoose.model('users'));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.render('index');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
