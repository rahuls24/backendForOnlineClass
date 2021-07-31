const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbUrl = require('./Models/urldb').dbUrl;
const port = process.env.PORT || 8000;
const auth = require('./API/Routes/auth');
const passport = require('passport');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Running 1');
});

//DB conncention
mongoose
	.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((user) => console.log('Connected'))
	.catch((err) => console.log('Error ', err));

// initialize the passport middleware
app.use(passport.initialize());

// config for JWt Strategies

// Route
app.use('/api/auth', auth);

app.listen(port, (err) => {
	if (err) {
		console.log('There is a problem in app.listen function in index.js file');
	} else {
		console.log(`Server is running on port ${port}`);
	}
});
