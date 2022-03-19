const bcrypt = require("bcrypt")

const saltRounds = 10


const encryptPassword = function (password, cb) {
	let hashedPassword = bcrypt.hash(password, saltRounds, cb(err, hash))
	return hashedPassword
}

module.exports = encryptPassword