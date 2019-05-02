
const http = require('http');
const fs = require("fs");

const getRegExp = require("./modules/getRegExp.js")
const port = 3012;
const server = http.createServer();
const userName = 'admin';
const userPassword = '123';


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
      if (reqData && text && id) {
        fs.readFile("index.html", "utf8", function(error,data){
          change = data.replace(getRegExp(id), text);
          fs.writeFile("index.html", change, function(error){ 
            console.log('writeFile - ok');
          });        
        });
      }

      console.log('isEditablePath', isEditablePath);
      console.log('reqData.userName', reqData.userName);
      console.log('reqData.userPassword', reqData.userPassword);
      console.log('reqData.userName === userName', reqData.userName === userName);
      console.log('reqData.userPassword === userPassword', reqData.userPassword === userPassword);
      

      if (reqData && reqData.userName && reqData.userPassword && reqData.userName === userName && reqData.userPassword === userPassword) {
        console.log('200');
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Set-Cookie':'editable=available; expires='+new Date(new Date().getTime()+86400000).toUTCString()
        }); 
      } else {
        console.log('400');
        res.writeHead(400, {
          'Content-Type': 'text/html',
        });
      }
      res.end();
      console.log("post - editable"); 
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






// server.on('request', function(req, res) {
//   console.log('req.url', req.url);

//   if(req.url === '/editable') {
//     console.log('IS editable');
    
//     fs.readFile('index.html',function (err, data){
//       if(req.method == 'POST') {
//         let jsonString = '';
//         req.on('data', function (data) {
//             jsonString += data;
//         });
//         req.on('end', function () {
//           const reqData = JSON.parse(jsonString);
//           console.log('reqData login', reqData);
//           console.log('reqData.userName', reqData.userName);
//           console.log('reqData.userName', reqData.userPassword);
//           if (reqData && reqData.userName && reqData.userPassword) {
//             if (reqData.userName === userName && reqData.userPassword === userPassword) {
//               console.log('200');
//               res.writeHead(200, {
//                 'Content-Type': 'text/html',
//                 'Set-Cookie': 'editable=available',
//               });            
//             } else {
//               console.log('403');
//               res.writeHead(403, {
//                 'Content-Type': 'text/html',
//               });
//             }
//           }
//         });
//       }      
//       res.write(data);
//       res.end();
//       console.log("get - index.html/editable");        
//     });
//   } 


//   if (req.url !== '/editable') {
//     console.log('IS index');
//     if(req.method == 'POST') {
//       let jsonString = '';
//       req.on('data', function (data) {
//           jsonString += data;
//       });
//       req.on('end', function () {
//         const reqData = JSON.parse(jsonString);
//         console.log('reqData -write text', reqData);
//         const text = reqData.text;
//         const id = reqData.id;
//         if (reqData && text && id) {
//           fs.readFile("index.html", "utf8", function(error,data){
//             change = data.replace(getRegExp(id), text);
//             fs.writeFile("index.html", change, function(error){ 
//               console.log('writeFile - ok');
//             });        
//           });
//         }
//       });
//     } else {
//       res.writeHead(200, {
//         'Content-Type': 'text/html'
//       });
//     }
//   }
  
// });

server.listen(port);

server.on('listening', () => console.log(`API starded in http://localhost:${port}/ ...//`));

// http.createServer(function(req, res){
// 	if(req.method == 'POST') {
//       let jsonString = '';
//       req.on('data', function (data) {
//           jsonString += data;
//       });
//       req.on('end', function () {
//         const reqData = JSON.parse(jsonString);
//         console.log('reqData', reqData);
//         const text = reqData.text;
//         const id = reqData.id;
//         if (reqData && text && id) {
//           fs.readFile("index.html", "utf8", function(error,data){
//             change = data.replace(getRegExp(id), text);
//             fs.writeFile("index.html", change, function(error){ 
//               console.log('writeFile - ok');
//             });        
//           });
//         }
//       });
//     } else {
//       fs.readFile('index.html',function (err, data){
//         res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
//         res.write(data);
//         res.end();
//         console.log("get - index.html");        
//       });
//     }
// }).listen(port, () => {
// 	console.log(`API starded in http://localhost:${port}/ ...`);
// });
