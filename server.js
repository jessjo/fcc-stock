'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var WebSocketServer = require('websocket').server;

var fs = require("fs");
var https = require ("https");

var app = express();
require('dotenv').load();
var http = require('http');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/**
var server = https.createServer(credentials, app);

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});
**/

var server = https.createServer(credentials, app);

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});
 
   var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({
        server: server
      });
 
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });
 
      ws.send('something');
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

