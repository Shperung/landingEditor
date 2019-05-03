
const http = require('http');
const fs = require("fs");
const crypto = require('crypto');

const getRegExp = require("./modules/getRegExp.js")
const port = 3012;
const server = http.createServer();
const userName = 'admin';
const userPassword = '123';

let token = {}

server.on('request', function(req, res) {
  console.log('req.url', req.url);

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
      if (reqData && text && id && dataToken && token.unigue && token.unigue === dataToken) {
        if (token.date && token.date > Date.now()) {
          fs.readFile("index.html", "utf8", function(error,data){
            change = data.replace(getRegExp(id), text);
            fs.writeFile("index.html", change, function(error){ 
              res.writeHead(200, {"Content-Type": "application/json"});
              console.log('writeFile - ok');
            });        
          });
          res.end();
        } else {
          console.log('writeFile - ne ok');
          res.writeHead(400, {
            "Content-Type": "application/json",
            'Set-Cookie': 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;',
          });
          res.end();
        }
      }
      
      if (reqData && reqData.userName && reqData.userPassword) {
        if (reqData.userName === userName && reqData.userPassword === userPassword) {
          console.log('200');
          res.writeHead(200, {"Content-Type": "application/json"});
          token = {
            unigue: crypto.randomBytes(16).toString('hex'),
            date: Date.now() + 86400000,
          }
          const json = JSON.stringify({ 
            token: token.unigue, 
          });
          res.end(json);
        } else {
          console.log('400');
          res.writeHead(400, {
            "Content-Type": "application/json",
          });
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