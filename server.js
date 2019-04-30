

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const port = 3012;
const fs = require("fs");

app.use('/src', express.static(__dirname + '/src'));
app.use(bodyParser.json());


app.get('/', function(req, res) {
	fs.readFile("index.html", "utf8", function(error,data){
	  res.send(data);
	});
});


app.post('/', function(req, res) {
	fs.readFile("index.html", "utf8", function(error,data){
		change = data.replace(/<(\w+)\s[^>]*id=\"editable1\"[^>]*>[\s\S]*\1>/gim, req.body.text);

		fs.writeFile("index.html", change, function(error){ 
			console.log('ok');
		});
		
	});
});


app.listen(port, () => {
	console.log(`API starded in http://localhost:${port}/ ..............___`);
});