var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8108, function(){console.log('server run');}));
var path = require('path');
var bodyParser = require('body-parser');
var fs  = require('fs');
var json = require ('jsonfile');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect('mongodb://team10:handsomeming@localhost/team10');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
var count = 0,label = 0;
var Schema = mongoose.Schema;
//for regist
var UserSchema = new Schema(
	{
	 name: String,
	 password: String,
	 email: String,
	 frdinvite: String,
	 friends: String,
	 evaluation: String,
	 point: Number
});
var UserDetails = mongoose.model('testV1', UserSchema);
app.use(express.static('public/'));
//for chatroom
var Message = mongoose.model('Message',{
     owner:String,
     text:String,
     name:String
});
//for Cookie&Session
app.use(cookieParser());
app.use(session(
	{
	 secret: 'CLMHCLIIAHONNUEUGNNDG2015',
	 cookie: {maxAge: 31*24*60*60*1000},
	 resave: true,
	 saveUninitialized: true
	 }));
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});
//for read json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
//for regist by passport
app.use(passport.initialize());
app.use(passport.session());
app.post('/Signup', passport.authenticate('regist', {
	successRedirect: '/RegistSuccess',
	failureRedirect: '/RegistFailure'
}));
app.get('/RegistFailure', function(req, res, next){
	res.redirect('/regist');
});
app.get('/RegistSuccess', function(req, res, next){	
	res.sendFile(path.join(__dirname+'/public/template/User.html'));
	console.log('Register:' + req.user);
});
app.post('/login', passport.authenticate('login', {
	successRedirect: '/loginSuccess',
	failureRedirect: '/loginFailure'
}));
app.get('/loginFailure', function(req, res, next){
	res.redirect('/regist');
});
app.get('/loginSuccess', function(req, res, next){
	res.sendFile(path.join(__dirname+'/public/template/User.html'));
	console.log('User:'+JSON.stringify(req.user.name));
	console.log(req.session.passport);
});
app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/regist');
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
					 email: req.body.mail
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
var Userpage = io.of('/Userpage');
  Userpage.on('connection',function(socket){
      console.log('User fuck in again!');
      
      socket.on('Sendmessage',function(data){
          console.log('I receive it');
	  var savedmessage = new Message({owner:'AlexBen',text:data.message,name:data.name});
	  savedmessage.save(function(err){
	     if(err) {
	       console.log('Save failed');
	       return;
	     }
	     console.log('Save succeed');
             Message.find({owner:'AlexBen'},function(err,data){
	       Userpage.emit('get_messages',{messages:data});
	      });
	  });

      });
     Message.find({owner:'AlexBen'},function(err,data){ 
      Userpage.emit('get_messages',{messages:data});
      });
  });  
var chatroom = io.of('/chatroom');

chatroom.on('connection',function(socket){
     console.log('user fuck in');

  socket.on('disconnect',function(){
      console.log('exit');
  });
  socket.on("Sendmessage",function(data){
      chatroom.emit('Getmessage',{number:data.number,text:data.text});
  });
});
app.get('/chat',function(req,res){
	if(!req.user){
       	 res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));  
      	 }
	else{
     	 res.sendFile(path.join(__dirname+'/public/template/Chatroom.html'));
         label = Math.floor(count/2);
     	 count=count+1;
     	 console.log(count+'--------'+label);
	 }
});
app.post('/chat/label',function(req,res){ 
      res.send({label:label});
      console.log('User:'+JSON.stringify(req.user.name));
});
app.post('/chat/invite', function(req,res){
	console.log('inviter:' + req.user.name);
	UserDetails.findOneAndUpdate({name: req.user.name}, {frdinvite:" girl"},function(err){
	 if(err) throw err;
	 });

});
app.post('/chat/leave', function(req, res){
	res.redirect('/user');
	UserDetails.findOne({name: req.user.name}, function(err, user){
		console.log(user.frdinvite);
		if (!user.frdinvite){
			console.log('no invite');
		}
	});
});
	
app.get('/regist',function(req,res){
	if(!req.user){
       	 res.sendFile(path.join(__dirname + '/public/template/Regist.html'));    
	}
	else{
	 res.redirect('/user');
	}
});
app.get('/user', function(req, res){
	 res.sendFile(path.join(__dirname+'/public/template/User.html'));
});	
// will match requests to /about
app.get('/about_us', function (req, res) {
	if(!req.user){
       	 res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));  
	}
	else{
	 res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));
	 }
});

app.get('/venture',function(req,res){
      res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));
});

