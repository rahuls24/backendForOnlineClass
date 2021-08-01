const bcrypt = require('bcrypt');
var validator = require('email-validator');
/**
 *	This function is responsible for returning common functions used across the application
 **/
function commonFunctions() {
	/**
	 * This function is responsible for creating hash of a plain text password
	 *	@params myPlaintextPassword {string} It is plain password for which hash will created
	 *  @returns {string}  A hash of a plain text
	 * 	@type {{myPlaintextPassword: string}=> string}
	 **/
	const generateHash = (myPlaintextPassword) => {
		const salt = bcrypt.genSaltSync(Number(process.env.saltRounds));
		return bcrypt.hashSync(myPlaintextPassword, salt);
	};

	/**
	 * This function is responsible for verifying the password
	 *	@params myPlaintextPassword {string} It is plain password entered by user
	 *  @params hash {string} It is hash value of plain password stored in DB
	 *  @returns {boolean}  True if password will matched
	 *  @type {{myPlaintextPassword: string,hash:string}=> boolean}
	 **/
	const verifyHash = (myPlaintextPassword, hash) => {
		return bcrypt.compareSync(myPlaintextPassword, hash);
	};

	/**
	 * This function is responsible for checking the email is valid or not
	 *	@params email {string} Email entered by User
	 *  @returns {boolean}  True if email has valid format
	 *  @type {{email: string}=> boolean}
	 **/
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
