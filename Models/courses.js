const mongoose = require('mongoose');
const { Schema } = mongoose;

const Course = new Schema({
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		default: 'Unknown',
	},
	addedBy: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
	},
	enrolledBy: {
		type: Number,
		default: 0,
	},
});
