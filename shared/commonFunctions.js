const bcrypt = require('bcrypt');
var validator = require('email-validator');

function commonFunctions() {
	const generateHash = (myPlaintextPassword) => {
		const salt = bcrypt.genSaltSync(Number(process.env.saltRounds));
		return bcrypt.hashSync(myPlaintextPassword, salt);
	};
	const verifyHash = (myPlaintextPassword, hash) => {
		return bcrypt.compareSync(myPlaintextPassword, hash);
	};
	const isValidEmail = (email) => {
		return validator.validate(email);
	};
	return {
		generateHash: generateHash,
		verifyHash: verifyHash,
		isValidEmail: isValidEmail,
	};
}

module.exports = commonFunctions;
