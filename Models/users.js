const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	registerOn: {
		type: Date,
		default: Date.now,
	},
	courses: {
		type: [Schema.Types.ObjectId],
		ref: 'Courses',
	},
});

module.exports = Users = mongoose.model('User', User);
