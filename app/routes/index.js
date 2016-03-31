'use strict';

var path = process.cwd();
var handlebars  = require('handlebars');
var fs = require('fs');
var request = require('request');

module.exports = function (app) {

function callAPI(res){
		var url = 'https://www.quandl.com/api/v3/datasets/WIKI/GOOG.json?api_key=ZsQyRq1Tvfyosp-zkr1w';
		request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
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
	for (var i=0; i<data.dataset.data.length; i++){
    			console.log("The close was " + data.dataset.data[i][4]);
    		}
	
	loadPage(res, JSON.stringify(data));
}

function loadPage(res, marketresponse){
		var data = {
					stocks: marketresponse
					
				}
				
				
		
	

				
			    fs.readFile('public/index.html', 'utf-8', function(error, source){
                	var template = handlebars.compile(source);
                	var html = template(data);
            		 res.send(html);
           
                }); 
			
	
}


app.route('/')
		.get(function (req, res) {
			
			callAPI(res);
			
			
		});

};
