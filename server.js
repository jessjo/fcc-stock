'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var ws = require("nodejs-websocket")
var http = require('http');
var server = http.createServer(function(request, response) {});

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use(session({
	secret: 'secretpassphrasedonttell',
	resave: false,
	saveUninitialized: true
}));


server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});


routes(app);



var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});