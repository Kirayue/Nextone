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
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});
>>>>>>> 847fce8f61676974e31571e76a2e89a68ccb6943

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
// will match requests to /about
app.get('/about_us', function (req, res) {
       res.sendFile(path.join(__dirname+'/public/template/unfinished.html'));  
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

var server = app.listen(8103, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Start!');
  console.log('Example app listening at http://%s:%s', host, port);
});

});
