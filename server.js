'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var fs = require("fs");
var https = require ("https");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('dotenv').load();
var async = require('async');

mongoose.connect(process.env.MONGO_URI);




//socket.io
var messages = [];
var sockets = [];

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});




function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}




routes(app);



http.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  console.log("Chat server listening at 8080");
});

