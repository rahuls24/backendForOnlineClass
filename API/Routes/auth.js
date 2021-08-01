const express = require('express');
const router = express.Router();
const User = require('../../Models/users');
const jwt = require('jsonwebtoken');
const commonFunctions = require('../../shared/commonFunctions');

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signup'
    @ Route Access => Public
	@ Description => Responsible for handle register a user

*/
router.post('/signup', (req, res) => {
	if (!commonFunctions().isValidEmail(req.body.email)) {
		return res.json({
			isSuccess: false,
			errorMsg: 'Please enter a valid email',
		});
	}
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				return res.json({
					isSuccess: false,
					errorMsg: 'User is already register to user DB',
				});
			}
			if (req.body.password.length < 6) {
				return res.json({
					isSuccess: false,
					errorMsg: 'Password must be greater than 5 character',
				});
			}
			new User({
				name: req.body.name,
				email: req.body.email,
				password: commonFunctions().generateHash(req.body.password),
				role: req.body.role,
			})
				.save()
				.then((newUser) => {
					return res.json({
						isSuccess: true,
						user: newUser,
					});
				})
				.catch((err) =>
					console.log(
						'Error in saving new user into DB  Route = /api/auth/signup Method POST',
						err,
					),
				);
		})
		.catch((err) =>
			console.log(
				'Error occurred while finding the User before register in DB. Route = /api/auth/signup Method POST',
				err,
			),
		);
});

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signin'
    @ Route Access => Public
	@ Description => Responsible for handle login of a register user

*/
router.post('/signin', (req, res) => {
	if (!commonFunctions().isValidEmail(req.body.email)) {
		return res.json({
			isSuccess: false,
			errorMsg: 'Please enter a valid email',
		});
	}
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!commonFunctions().verifyHash(req.body.password, user.password)) {
				return res.json({
					isSuccess: false,
					errorMsg: 'Wrong Password',
				});
			}
			const payload = {
				id: user.id,
				email: user.email,
			};
			jwt.sign(
				{
					exp: Math.floor(Date.now() / 1000) + 60 * 60,
					data: payload,
				},
				process.env.passportJwtKey,
				(err, token) => {
					if (err) {
						console.log(
							'Error occurred while sign in with jwt function. Route = /api/auth/signin Method POST',
							err,
						);
					}
					res.json({ isSuccess: true, token: token });
				},
			);
		})
		.catch((err) =>
			console.log(
				'Error occurred while finding the User in DB. Route = /api/auth/signin Method POST',
				err,
			),
		);
});

module.exports = router;
