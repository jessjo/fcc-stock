'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var ws = require("nodejs-websocket");
var fs = require("fs");
var https = require ("https");


var app = express();
require('dotenv').load();
var http = require('http');
var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var server = http.createServer(function(request, response) {});

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
var wsServer = new WebSocketServer({
    httpServer: server
});

var count = 0;
var clients = [];

wsServer.on('request', function(r){
    // Code here to run on connection
    
    var connection = r.accept('echo-protocol', r.origin);
    
    // Specific id for this client & increment count
    var id = count++;

    // Store the connection method so we can loop through & contact all clients
    clients[id] = connection;
    console.log((new Date()) + ' Connection accepted [' + id + ']');
    
    connection.on('message', function(message) {

        // The string message that was sent to us
        var msgString = message.utf8Data;

        // Loop through all clients
        for(var i in clients){
            // Send a message to the client with the message
            clients[i].sendUTF(msgString);
        }

    });

    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
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

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);