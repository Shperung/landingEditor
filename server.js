

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const port = 3012;
const fs = require("fs");


app.use('/test', express.static(__dirname + '/test'));
app.use(bodyParser.json());


app.get('/', function(req, res) {
	fs.readFile("test.html", "utf8", function(error,data){
	  res.send(data);
	});
});




app.post('/', function(req, res) {
	console.log('B: ', req.body);
	console.log('B.text: ', req.body.test);
	console.log('B.id: ', req.body.id);
	fs.readFile("test.html", "utf8", function(error,data){
		change = data.replace(/<(\w+)\s[^>]*id=\"editable1\"[^>]*>[\s\S]*\1>/gim, req.body.text);
		console.log('data.change', change);

		fs.writeFile("test.html", change, function(error){ 
			console.log('ok');
		});
		
	});
});




app.listen(port, () => {
	console.log(`API starded in http://localhost:${port}/ ..............___`);
});