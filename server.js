'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var socketio = require('socket.io');
var fs = require("fs");
var https = require ("https");
var app = express();
var http = require('http');
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

var server = http.createServer(app);
var io = socketio.listen(server);

app.use(session({
	secret: 'secretpassphrasedonttell',
	resave: false,
	saveUninitialized: true
}));







routes(app);



server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

