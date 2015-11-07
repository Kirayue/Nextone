var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs  = require('fs');
var json = require ('jsonfile');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

function op(data){
	var key = new Array();
	key[0] = "username";
	key[1] = "pw";
	key[2] = "email";
	var jsonText = JSON.stringify(data, key);
	fs.appendFile('rdata.json', (jsonText + '\n'));
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/chat',function(req,res){
     res.sendFile(path.join(__dirname+'/public/template/Chatroom.html'));
});
// accept POST request on the homepage
app.post('/Send', function (req, res) {
  console.log(req.body);
  console.log(req.body.text);
  if(req.body.text!=''){
  fs.appendFile('public/data/message.txt',req.body.text+'<br>\n',function(err){
        if(err) throw err;
	console.log('Succeed!');
  });
  }
});

app.get('/regist',function(req,res){
       res.sendFile(path.join(__dirname + '/public/template/Regist.html'));    
});
app.post('/Signup',function(req,res){
    
    fs.readFile('rdata.json',function(err,data){
	       if(err) throw err;
	       var i,j=0;
	       var objs = data.toString().split('\n');
	       var obj ={};
	       console.log(objs.length);
	       for(i=0;i<objs.length-1;i++){
	       obj = JSON.parse(objs[i]);
	         if(obj.username == req.body.username){
	             console.log('repeat');
		     break;
	         }
	         if(i==objs.length-2){
		    op(req.body);
		 }
		 console.log(i);
	       
      }  
	});
});
// will match requests to /about
app.get('/about_us', function (req, res) {
       res.sendFile(path.join(__dirname+'/public/template/about_us.html'));  
});

app.get('/venture',function(req,res){
      res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));
});
app.post('/chat/message',function(req,res){
       var message = '';
       var i;
       fs.readFile('public/data/message.txt',function(err,data){
            if (err) throw err;	
	    message = data.toString();
	    res.send(message);
	    
       }); 
});

var server = app.listen(8110, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Start!');
  console.log('Example app listening at http://%s:%s', host, port);
});
