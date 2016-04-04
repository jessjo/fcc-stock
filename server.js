'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var ws = require("nodejs-websocket")


var app = express();
require('dotenv').load();
var http = require('http');
var server = http.createServer(function(request, response) {});

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
var wsServer = new WebSocketServer({
    httpServer: server
});

var count = 0;
var clients = {};

wsServer.on('request', function(r){
    // Code here to run on connection
    
    var connection = r.accept('echo-protocol', r.origin);
    
    // Specific id for this client & increment count
    var id = count++;
    
    // Store the connection method so we can loop through & contact all clients
    clients[id] = connection;
});

mongoose.connect(process.env.MONGO_URI);

app.use(session({
	secret: 'secretpassphrasedonttell',
	resave: false,
	saveUninitialized: true
}));



routes(app);



var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});