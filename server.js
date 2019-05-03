
const http = require('http');
const fs = require("fs");

const getRegExp = require("./modules/getRegExp.js")
const port = 3012;
const server = http.createServer();
const userName = 'admin';
const userPassword = '123';
const token = "fsdfasdvdskvmsdg65sd64g6s2vs1cv5sd6";


server.on('request', function(req, res) {
  console.log('req.url', req.url);
  const isEditablePath = req.url === '/editable';

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
      const dataToken = reqData.token;
      if (reqData && text && id && dataToken && token === dataToken) {
        fs.readFile("index.html", "utf8", function(error,data){
          change = data.replace(getRegExp(id), text);
          fs.writeFile("index.html", change, function(error){ 
            res.writeHead(200, {"Content-Type": "application/json"});
            console.log('writeFile - ok4');
          });        
        });
        res.end();
      }
      
      if (reqData && reqData.userName && reqData.userPassword) {
        if (reqData.userName === userName && reqData.userPassword === userPassword) {
          console.log('200');
          res.writeHead(200, {"Content-Type": "application/json"});
          const json = JSON.stringify({ 
            token: token, 
          });
          res.end(json);
        } else {
          console.log('400');
          res.writeHead(400, {"Content-Type": "application/json"});
          res.end();
        }
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
});

server.listen(port);

server.on('listening', () => console.log(`API starded in http://localhost:${port}/ ...//`));