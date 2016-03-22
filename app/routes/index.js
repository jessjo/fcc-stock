'use strict';

var path = process.cwd();
var handlebars  = require('handlebars');
var fs = require('fs');

module.exports = function (app) {





app.route('/')
		.get(function (req, res) {
			
				var data = {
					stocks: "stockity stocks"
					
				}
				
			    fs.readFile('public/index.html', 'utf-8', function(error, source){
                	var template = handlebars.compile(source);
                	var html = template(data);
            		 res.send(html);
           
                }); 
			
			
			
		});

};
