'use strict';

var path = process.cwd();
var handlebars  = require('handlebars');
var fs = require('fs');
var request = require('request');


module.exports = function (app) {

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
	
	// where we use websockets to reload?
	
		var data = {
				//	stocks: marketresponse
				stocks: "hi"
					
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
		
app.get('/scripts.js',function(req,res){
	console.log ("here");
    res.sendFile(path + '/public/scripts.js');
});

};



