var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs  = require('fs');
var json = require ('jsonfile');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect('mongodb://team10:handsomeming@localhost/team10');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
var count = 0,label = 0;
var Schema = mongoose.Schema;
var UserSchema = new Schema(
	{
	 name: String,
	 password: String,
	 email: String
	 },{
	 	collection: 'tests'
	});
var UserDetails = mongoose.model('tests', UserSchema);
app.use(express.static('public/'));
//for chatroom
var Message = mongoose.model('Message',{
     label:Number,
     name:String,
     text:String,
     time:Number
});




app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.post('/Signup', passport.authenticate('regist', {
	successRedirect: '/RegistSuccess',
	failureRedirect: '/RegistFailure'
}));
app.get('/RegistFailure', function(req, res, next){
	res.send('Name or Email repeat,please check again.');
});
app.get('/RegistSuccess', function(req, res, next){
	res.send('Welcome Join Us');
});

app.post('/login', passport.authenticate('login', {
	successRedirect: '/loginSuccess',
	failureRedirect: '/loginFailure'
}));
app.get('/loginFailure', function(req, res, next){
	res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next){
	res.send('Successfully authenticated');
});

passport.serializeUser(function(user, done){
	done(null, user);
});
passport.deserializeUser(function(user, done){
	done(null, user);
});

passport.use('login', new LocalStrategy(function(username, password, done){
	process.nextTick(function(){
		UserDetails.findOne({
		'name': username,
		}, function(err, user){
			if(err){
				return done(err);
			}
			if(!user){
				return done(null, false);
			}
			if(user.password != password){
				return done(null, false);
			}

			return done(null, user);
		});
	});
}));

passport.use('regist', new LocalStrategy({
	passReqToCallback: true},
	function(req, username, password, done){
	process.nextTick(function(){
		UserDetails.findOne({
		'name': username,
		}, function(err, user){
			if(err){
				return done(err);
			}
			if(user){
				return done(null, false);
				console.log('user exist');
			}
			else{
				console.log(req.body);
				var NewUser = new UserDetails(
					{
					 name: username ,
					 password: password,
					 email: req.body.email
					 }
				);
				NewUser.save(function(err){
					if(err){
						console.log('Error in saving user:' + err);
						throw err;
					}
					console.log('User Registration succesful');
					return done(null, NewUser);
				});
			}
		});
	});
}));

app.get('/chat',function(req,res){
     res.sendFile(path.join(__dirname+'/public/template/Chatroom.html'));
      
     
        label = Math.floor(count/2);
    
     count=count+1;
     console.log(count+'--------'+label);
      
});
app.post('/chat/label',function(req,res){ 
      res.send({label:label});
});
// accept POST request on the homepage
app.post('/Send', function (req, res) {
  
  
  console.log(req.body);
  if(req.body.text!=''){
   var content = new Message({label:req.body.number,name:req.body.usrname,text:req.body.text,time:req.body.time});
   content.save(function(err){
      if(err) {
         console.log('fuck');
      }
      console.log('yeah');
   });
  }
});

app.get('/regist',function(req,res){
       res.sendFile(path.join(__dirname + '/public/template/Regist.html'));    
});
// will match requests to /about
app.get('/about_us', function (req, res) {
       res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));  
});

app.get('/venture',function(req,res){
      res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));
});
app.post('/chat/message',function(req,res){ 
	Message.find({label:req.body.number,time:{$gte:req.body.time-1000}},function(err,datas){
	    res.send(datas);
	   /* for(var index in datas){
	       var data = datas[index];
	       console.log(data.text);
	    }*/
	    
	});   
});

var server = app.listen(8107, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Start!');
  console.log('Example app listening at http://%s:%s', host, port);
});
