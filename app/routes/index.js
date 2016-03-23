'use strict';

var path = process.cwd();
var handlebars  = require('handlebars');
var fs = require('fs');
var request = require('request');

module.exports = function (app) {

function callAPI(res){
		var url = 'http://dev.markitondemand.com/MODApis/Api/interactive?parameters=%7B%22Normalized%22:false,%22StartDate%22:%222013-07-15T00:00:00-00%22,%22EndOffsetDays%22:100,%22NumberOfDays%22:100,%22DataPeriod%22:%22Day%22,%22DataInterval%22:0,%22LabelPeriod%22:%22Day%22,%22LabelInterval%22:1,%22ExtraPoints%22:0,%22Elements%22:%5B%7B%22Symbol%22:%22GOOG%22,%22ElementType%22:%22price%22,%22Params%22:%5B%22ohlc%22%5D%7D%5D,%22RealTime%22:false%7D';
		request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    	var marketresponse = JSON.parse(body);
    		console.log("Got a response: ", marketresponse);
    		loadPage(res, JSON.stringify(marketresponse));
  		} else {
			 console.log("Got an error: ", error, ", status code: ", response.statusCode);
  		}
		});
	
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
