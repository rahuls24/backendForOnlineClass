const express = require('express');
const route = express.Router();
const User = require('../../Models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

module.exports = route;
