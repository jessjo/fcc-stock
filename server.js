'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var WebSocketServer = require('websocket').server;

var fs = require("fs");
var https = require ("https");
var app = express()();
var io = require('socket.io').listen(app);

var http = require('http').Server(app);
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use(session({
	secret: 'secretpassphrasedonttell',
	resave: false,
	saveUninitialized: true
}));


http.listen(1234, function(){
  console.log('http listening on *:1234');
});

io.sockets.on('connection', function (socket) {
    console.log('connection');
    socket.on('setPseudo', function (data) {
        socket.set('pseudo', data);
    });
    
    socket.on('message', function (message) {
    socket.get('pseudo', function (error, name) {
        var data = { 'message' : message, pseudo : name };
        socket.broadcast.emit('message', data);
        console.log("user " + name + " send this : " + message);
    })
});
});

/**

var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = https.createServer(credentials, app);

**/



routes(app);



var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

