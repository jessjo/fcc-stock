'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var ws = require("nodejs-websocket")

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use(session({
	secret: 'secretpassphrasedonttell',
	resave: false,
	saveUninitialized: true
}));



// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)

routes(app);



var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});