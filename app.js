// set variables for environment
var express = require('express');
var userService = require('./service/UserService');

var app = express();

app.use(express.static('public'));
app.use('/', userService);

app.get('/', function(req, res) {
	res.render('index');
});

module.exports = app;

// Set server port
app.listen(3000);
console.log('server is running');