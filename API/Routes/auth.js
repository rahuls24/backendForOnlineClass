const express = require('express');
const router = express.Router();
const passport = require('passport');

/*
Route Type => POST
Route URL => "/api/auth/login"
isProtected => false
*/
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: 'http://localhost:8000/api/auth/dashboard',
		failureRedirect: 'http://localhost:8000/api/auth/login',
		failureFlash: true,
	}),
);

/*
Route Type => GET
Route URL => "/api/auth/login"
isProtected => false
*/
router.get('/login', (req, res) => {
	const form =
		'<h1>Login Page</h1><form method="POST" action="http://localhost:8000/api/auth/login">\
        Enter Username:<br><input type="text" name="email">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';
	res.send(form);
});

/*
Route Type => GET
Route URL => "/api/auth/dashboard"
isProtected => false
*/
router.get('/dashboard', (req, res) => {
	console.log(req.session.passport);
	if (req.isAuthenticated()) {
		res.send('<h1>You are authenticated</h1>');
	} else {
		res.send('<h1>You are not authenticated</h1>');
	}
});

module.exports = router;
