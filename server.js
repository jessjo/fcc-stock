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
var async = require('async');

mongoose.connect(process.env.MONGO_URI);

var server = http.createServer(app);
var io = socketio.listen(server);

app.use(session({
	secret: 'secretpassphrasedonttell',
	resave: false,
	saveUninitialized: true
}));


//socket.io
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;


        var data = {
          text: text
        }

        broadcast('message', data);
        messages.push(data);
      });
    });

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}





routes(app);



server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

