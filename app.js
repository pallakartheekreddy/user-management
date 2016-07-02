// set variables for environment
var express = require('express');
var userService = require('./service/UserService');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//TODO: Need to move Db connections into model folder
//var connection = require('../model/db');

//Db Connection block start
var mongodb = require('mongodb');
// Connection URL 
var url = 'mongodb://localhost:27017/usermanagement';
var MongoClient = mongodb.MongoClient;
var db;
MongoClient.connect(url, function(err, dbObj) {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		db = dbObj;
	}	
});

// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
	function(username, password, cb) {    
		db.collection('users').findOne({ "username": username }, function(err, user) {
			if (err) { 
				return cb(err); 
			}
			if (!user) { 
				return cb(null, false); 
			}
			if (user.password != password) { 
				return cb(null, false); 
			}
			return cb(null, user);
		});
	}
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    console.log('id '+id);
    db.collection('users').findOne({"id": id}, function(err, user) {
        cb(null, user);
    });
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
	console.log('res '+res);
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};

var app = express();

app.use(express.static('public'));
app.use('/', userService);

var cookieParser = require('cookie-parser')
app.use(cookieParser()); 

var methodOverride = require('method-override')
app.use(methodOverride());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))

var session = require('express-session')
app.use(session({ secret: 'securedsession' }));

app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport

app.get('/', function(req, res) {
	res.render('index');
});

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});

module.exports = app;

// Set server port
app.listen(3000);
console.log('server is running');
