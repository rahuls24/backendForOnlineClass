const express = require('express');
const route = express.Router();
const User = require('../../Models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jsonwt = require('jsonwebtoken');
const key = require('../../Models/urldb').jwtKey;
const passport = require('passport');

// @type => POST
// @route => "/api/auth/signup"
// @desc => router for signup for User
// @access => public

route.post('/signup', (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				return res.json({
					Error: `${req.body.email} already found, Please login with this email`,
				});
			} else {
				if (req.body.password < 6) {
					return res.json({ Error: 'Must have greater then 6 ' });
				}
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					role: req.body.role,
				});
				// encrypt the password
				bcrypt.genSalt(saltRounds, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						// Store hash in your password DB.
						newUser.password = hash;
						newUser
							.save()
							.then((user) => {
								return res.json({
									Greating: `Welcome ${user.name}`,
									userData: user,
								});
							})
							.catch((err) =>
								console.log('error in saving the user in db', err),
							);
					});
				});
			}
		})
		.catch((err) =>
			console.log(
				'Error found in finding user in route /api/auth/user/signup',
				err,
			),
		);
});

// @type => POST
// @route => "/api/auth/signin"
// @desc => router for signin for User
// @access => public

route.post('/signin', (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.json({ Error: 'User not found' });
			}
			bcrypt.compare(req.body.password, user.password, (err, result) => {
				// result == true
				if (!result) {
					return res.json({ Error: 'Password is not matched' });
				}
				const payload = {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				};
				jsonwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
					res.json({ isLogin: true, token: token });
				});
			});
		})
		.catch((err) => console.log('Error in signin finding'));
});

route.get(
	'/protected',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		console.log(req);
		res.json({ msg: true, user: req.user });
	},
);

route.post(
	'/local',
	passport.authenticate('local', {
		failureRedirect: '/fail',
	}),
	(req, res) => {
		console.log(req.session);
		res.json({ user: req.user });
	},
);

route.get('/login', (req, res) => {
	const form =
		'<h1>Login Page</h1><form method="POST" action="/api/auth/login">\
    Enter Username:<br><input type="text" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';
	res.send(form);
});

route.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: 'http://localhost:8000/api/auth/fail',
		successRedirect: 'http://localhost:8000/api/auth/success',
	}),
	(req, res) => {},
);

route.get('/fail', (req, res) => {
	res.send('<h1>Logged fail </h1>');
});
route.get('/success', (req, res) => {
	res.send('<h1>Logged IN </h1>');
});
route.get('/protected-route', (req, res, next) => {
	console.log(req.session);
	if (req.isAuthenticated()) {
		res.send('<h1>You are authenticated</h1>');
	} else {
		res.send('<h1>You are not authenticated</h1>');
	}
});

module.exports = route;
