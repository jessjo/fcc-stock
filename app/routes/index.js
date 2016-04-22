'use strict';

var path = process.cwd();
var handlebars  = require('handlebars');
var fs = require('fs');
var request = require('request');
var Stocks = require('../models/stocks.js');

module.exports = function (app, db) {

function callAPI(res){
		var stockTicker = "GOOG";
		var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockTicker + '.json?api_key=ZsQyRq1Tvfyosp-zkr1w';
		request(url, function (error, response, body) {
  		if (!error && response.statusCode != 'undefined' && response.statusCode == 200) {
    		var marketresponse = JSON.parse(body);
    		//console.log("Got a response: ", marketresponse.dataset.data);
    		var stockPriceArr =[];
    		parseAPI(res, marketresponse);
  		} else {
			 console.log("Got an error: ", error, ", status code: ", response.statusCode);
			 //skip parse API and return error page?
  		}
		});
	
}

function parseAPI (res,data){
	//this is where I parse things to upload
	var closePrices = [];
	for (var i=0; i<data.dataset.data.length; i++){
    			closePrices[i] = data.dataset.data[i][4];
    		}
	console.log ("start date was "+ data.dataset.data[data.dataset.data.length-1][0]);
	loadPage(res, JSON.stringify(data));
}

function loadPage(res, marketresponse){
	
	// 
 	activeStocks(function(stockList){
			var data = {
				//	stocks: marketresponse
				stocks: stockList
					
				}
				
				
			    fs.readFile('public/index.html', 'utf-8', function(error, source){
                	var template = handlebars.compile(source);
                	var html = template(data);
            		 res.send(html);
           
                }); 
		});
		
		// TODO a call back to make sure stock list is defined. 
		
			
	
}

function activeStocks(printPage){
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
			
			callAPI(res);
			
			
		});

};



