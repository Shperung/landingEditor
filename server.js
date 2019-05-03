
const http = require('http');
const fs = require("fs");
const crypto = require('crypto');

const getRegExp = require("./modules/getRegExp.js")
const port = 3012;
const server = http.createServer();
const defaultUserName = 'admin';
const defaultUserPassword = '123';

let serverToken = {}

server.on('request', function(req, res) {
  if(req.method == 'POST') {
    let body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
      const reqData = JSON.parse(body);

      const editedOuterHTML = reqData.editedOuterHTML;
      const editedBlockId = reqData.id;
      const clientTokenUnique = reqData.token;
      // если пришол измененный HTML + id + токен клиента равен текущему токену Node
      if (reqData && editedOuterHTML && editedBlockId && clientTokenUnique && serverToken.unigue && serverToken.unigue === clientTokenUnique) {
        // если время жызни токена больще текущей даты
        if (serverToken.date && serverToken.date > Date.now()) {
          fs.readFile("index.html", "utf8", function(error,data){
            change = data.replace(getRegExp(editedBlockId), editedOuterHTML);
            fs.writeFile("index.html", change, function(error){ 
              res.writeHead(200, {"Content-Type": "application/json"});
            });        
          });
          res.end();
        } else {
          // если время жызни токена закончилось - розлогинюем пользователя удаляя его куку токена
          res.writeHead(400, {
            "Content-Type": "application/json",
            'Set-Cookie': 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;',
          });
          res.end();
        }
      }
      
      const clientUserName = reqData.userName;
      const clientUserPassword = reqData.userPassword;
      if (reqData && clientUserName && clientUserPassword) {
        // если от клиента пришли правильные логин и пароль 
        if (clientUserName === defaultUserName && clientUserPassword === defaultUserPassword) {
          // делаем токен с времям жызни 1 день
          serverToken = {
            unigue: crypto.randomBytes(16).toString('hex'),
            date: Date.now() + 86400000,
          }
          // передаем токен клиенту
          const json = JSON.stringify({ 
            token: serverToken.unigue, 
          });
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(json);
        } else {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });
          res.end();
        }
      }
    });
  } else {
    // если нет POST запросов читаем index.html и отображаем
    fs.readFile('index.html',function (err, data){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
      res.write(data);
      res.end();      
    });
  }
});

server.listen(port);

server.on('listening', () => console.log(`API starded in http://localhost:${port}/ ...//`));