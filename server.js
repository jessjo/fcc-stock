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
var Stocks = require('./app/models/stocks.js');

mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

//socket.io
var messages = [];
var sockets = [];

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
     Stocks.findOne({ 'stockName': msg }, function (err, stock) {
            if (err) throw err;
            if(stock){
                  console.log("this already exists");
            } else {
                 console.log("this needs to be added");
                    var newDoc = new Stocks({ 'stockName': msg
                   });
                  newDoc.save(function (err, doc) {
                    if (err) { throw err; }
                    console.log("saved!");
                  });
            }

    });
  });
});






routes(app);

});



http.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  console.log("Chat server listening at 8080");
});

