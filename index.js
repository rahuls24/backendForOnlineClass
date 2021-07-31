const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbUrl = require('./Models/urldb').dbUrl;
const port = process.env.PORT || 8000;
const auth = require('./API/Routes/auth');
const passport = require('passport');

const session = require('express-session');
const MongoStore = require('connect-mongo');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Running 1');
});

//DB conncention
var test24 = mongoose
	.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((user) => console.log('Connected'))
	.catch((err) => console.log('Error ', err));
// const sessionStore = new MongoStore({
// 	mongooseConnection: test24,
// 	collection: 'sessions',
// });
app.use(
	session({
		//secret: process.env.SECRET,
		secret: 'some secret',
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: dbUrl }),
		cookie: {
			maxAge: 1000 * 30,
		},
	}),
);
// initialize the passport middleware
app.use(passport.initialize());
app.use(passport.session());

// config for JWt Strategies
require('./strategies/jsonwtStrategies')(passport);
require('./strategies/localStategy')(passport);

// Route
app.use('/api/auth', auth);

app.listen(port, (err) => {
	if (err) {
		console.log('There is a problem in app.listen function in index.js file');
	} else {
		console.log(`Server is running on port ${port}`);
	}
});
