
const http = require('http');
const fs = require("fs");
const port = 3012;

http.createServer(function(req, res){
	if(req.method == 'POST') {
      let jsonString = '';
      req.on('data', function (data) {
          jsonString += data;
      });
      req.on('end', function () {
        const reqData = JSON.parse(jsonString);
        console.log('reqData', reqData);
        const text = reqData.text;
        const id = reqData.id;
        if (reqData && text && id) {
          fs.readFile("index.html", "utf8", function(error,data){
            change = data.replace(/<(\w+)\s[^>]*id=\"editable1\"[^>]*>[\s\S]*\1>/gim, text);
            fs.writeFile("index.html", change, function(error){ 
              console.log('writeFile - ok');
            });        
          });
        }
      });
    } else {
      fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
        console.log("get - index.html");        
      });
    }
}).listen(port, () => {
	console.log(`API starded in http://localhost:${port}/ ...`);
});
