'use strict';

var path = process.cwd();
var handlebars  = require('handlebars');
var fs = require('fs');
var request = require('request');
var Stocks = require('../models/stocks.js');

module.exports = function (app, db) {


function loadPage(res){
	
	// 
 	activeStocks(function(stockList){
			var data = {
				stocks: stockList
					
				}
				
				
			    fs.readFile('public/index.html', 'utf-8', function(error, source){
                	var template = handlebars.compile(source);
                	var html = template(data);
            		 res.send(html);
           
                }); 
		});

			
	
}

function activeStocks(printPage){
	
	//goes through recent stocks and adds them to list below
	Stocks.find().sort().limit(10).exec(function(err, Stocks){
		if (err) throw err;
		if (Stocks){
			var stockList="<ul id='stocklist'>";
          	for (var i=0;i<Stocks.length;i++){
          		if(Stocks[i].stockName != undefined){
            	
            			stockList += '<li id='+'"'+Stocks[i].stockName+ '"' +'>'+ Stocks[i].stockName +'  <button onclick="removeStock(' +"'"+Stocks[i].stockName+ "'"+');">Remove</button> </li>';
            	
          		}
          	}
           stockList+= "</ul>"
           printPage(stockList);
		}
	});
}


app.route('/')
		.get(function (req, res) {
			
			loadPage(res);
			
			
		});

};



