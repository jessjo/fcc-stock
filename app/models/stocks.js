'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
		stockName: String,
		stockData: String
});

module.exports = mongoose.model('Stock', Stock);
