#!user/bin/node
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var json = require('jsonfile');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://team10:handsomeming@localhost/team10');
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


app.listen(8108);
console.log('Server run');
