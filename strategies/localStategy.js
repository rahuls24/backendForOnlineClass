const LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
const mongoose = require('mongoose');
const User = require('../Models/users');
const myKey = require('../Models/urldb').jwtKey;
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
			},
			function (username, password, done) {
				User.findOne({ email: username }, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, { message: 'Incorrect username.' });
					}
					bcrypt.compare(password, user.password, (err, result) => {
						console.log(password, user.password, result);
						// result == true
						if (!result) {
							console.log('fail');
							return done(null, false, { message: 'Incorrect password.' });
						} else {
							passport.serializeUser(function (user, done) {
								return done(null, user);
							});
							passport.deserializeUser(function (id, cb) {
								User.findById(id, function (err, user) {
									if (err) {
										return cb(err);
									}
									cb(null, user);
								});
							});
							return done(null, user);
						}
					});
				});
			},
		),
	);
};
