const express = require('express');
const app = express();
const keys = require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const auth = require('./API/Routes/auth');
const passport = require('passport');

//Check if keys are loaded from .env file
if (keys.error) {
	console.log('There is an error in loading the keys from .env file');
	throw keys.error;
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Running 1');
});

//DB connection
mongoose
	.connect(process.env.dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((user) => console.log('Connected'))
	.catch((err) => console.log('Error ', err));

// initialize the passport middleware
app.use(passport.initialize());
// config for JWt Strategies
require('./strategies/jwtStrategy')(passport);

// Route
app.use('/api/auth', auth);

app.listen(port, (err) => {
	if (err) {
		console.log('There is a problem in app.listen function in index.js file');
	} else {
		console.log(`Server is running on port ${port}`);
	}
});
