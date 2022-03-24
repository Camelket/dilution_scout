const express = require("express");
const router = express.Router();
const user_db = require("../database/users_db/database_connection.js");
const {createPasswordUser} = require("../database/users_db/databaseUtil.js");


router.get("/register", function(req, res, next) {
	res.render("registration", {})
})

router.post("/register", async function(req, res, next) {
	// req.body  --> db function to create user
	// set user in session object and redirect home or userSettings page
	// invoke function to send email for verification
	let {userEmail, userPassword, ...rest} = req.body
	console.log(`/register route; userEmail: ${userEmail}, userPassword: ${userPassword}, rest: ${rest}`)
	let userId
	try {
		userId = await createPasswordUser(user_db, userEmail, userPassword)
	} catch(e) {
		console.log(`failed to createPasswordUser in /register post route, e: ${e}`)
		next(e)
	}
	res.redirect("/login")
})

module.exports = router;