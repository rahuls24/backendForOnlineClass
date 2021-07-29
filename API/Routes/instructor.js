const express = require('express');
const route = express.Router();
const Instructor = require('../../Models/instructor');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @type => POST
// @route => "/api/auth/instructor/signup"
// @desc => router for signup for User
// @access => public

route.post('/signup', (req, res) => {
	Instructor.findOne({ email: req.body.email })
		.then((instructor) => {
			if (instructor) {
				return res.json({
					Error: `${req.body.email} already found, Please login with this email`,
				});
			} else {
				if (req.body.password < 6) {
					return res.json({ Error: 'Must have greater then 6 ' });
				}
				const newInstructor = new Instructor({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					role: req.body.role,
				});
				// encrypt the password
				bcrypt.genSalt(saltRounds, (err, salt) => {
					bcrypt.hash(newInstructor.password, salt, (err, hash) => {
						// Store hash in your password DB.
						newInstructor.password = hash;
						newInstructor
							.save()
							.then((instructor) => {
								return res.json({
									Greating: `Welcome ${instructor.name}`,
									instructorData: instructor,
								});
							})
							.catch((err) =>
								console.log('error in saving the instructor in db', err),
							);
					});
				});
			}
		})
		.catch((err) =>
			console.log(
				'Error found in finding user in route /api/auth/instructor/signup',
				err,
			),
		);
});

module.exports = route;
