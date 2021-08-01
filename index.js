const express = require('express');
const app = express();
const keys = require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const auth = require('./API/Routes/auth');
const passport = require('passport');

//Requirement for session based login
const session = require('express-session');
const MongoStore = require('connect-mongo');
var flash = require('connect-flash');

//Check if keys are loaded from .env file
if (keys.error) {
	console.log('There is an error in loading the keys from .env file');
	throw keys.error;
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Home server
app.get('/', (req, res) => {
	res.send('<h1> Server is running properly</h1>');
});

//DB connection
mongoose
	.connect(process.env.dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((user) => console.log('Connected'))
	.catch((err) => console.log('Error ', err));

// setting the store of session based login
app.use(
	session({
		secret: process.env.passportLocal,
		store: MongoStore.create({
			mongoUrl: process.env.dbUrl,
			ttl: 14 * 24 * 60 * 60, // = 14 days. Default
			autoRemove: 'native', // Default
		}),
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 30,
		},
	}),
);
// initialize the passport middleware
app.use(passport.initialize());
app.use(passport.session());

// To handle wrong details entered from user
app.use(flash());
// config for JWt Strategies
require('./strategies/localStrategy')(passport);

// Route
app.use('/api/auth', auth);

app.listen(port, (err) => {
	if (err) {
		console.log('There is a problem in app.listen function in index.js file');
	} else {
		console.log(`Server is running on port ${port}`);
	}
});
