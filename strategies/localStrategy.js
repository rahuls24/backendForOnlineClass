const LocalStrategy = require('passport-local').Strategy;
const User = require('../Models/users');
const bcrypt = require('bcrypt');

// function for verifying the password
const verifyPassword = (plainPassword, hashPassword) => {
	bcrypt.compare(plainPassword, hashPassword, function (err, result) {
		// result == true
		if (err) {
			console.log(err);
			throw err;
		}
		return result;
	});
};

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
			},
			(username, password, done) => {
				User.findOne({ email: username }, (err, user) => {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false);
					}
					bcrypt.compare(password, user.password, (err, result) => {
						if (!result) {
							console.log('fail');
							return done(null, false, { message: 'Incorrect password.' });
						}

						return done(null, user);
					});
				});
			},
		),
	);
	passport.serializeUser(function (user, cb) {
		cb(null, user.id);
	});
	passport.deserializeUser(function (id, cb) {
		User.findById(id, function (err, user) {
			if (err) {
				return cb(err);
			}
			cb(null, user);
		});
	});
};
