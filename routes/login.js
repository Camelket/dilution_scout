require("dotenv").config()
const bcrypt = require("bcrypt")
const { evaluateLoginAttemptPassword } = require("../controllers/memcachedUtil.js") 
const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const db = require("../database/database_connection.js");
const {getUserInfo, findOrCreateGoogleUser, authenticatePasswordUser} = require("../database/databaseUtil.js");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local")

passport.use(new LocalStrategy(
	async function (userEmail, userPassword, cb) {
		console.log(`running authentication with local strategy; args: ${userEmail}, ${userPassword}, ${cb}`)
		let user;
		try {
			user = await authenticatePasswordUser(db, userEmail, userPassword)
			if (!user) {
				return cb(null, false, {message: "no user found with specified email"});
			}
			if (user) {
				return cb(null, user)
			}} catch(e) {
				console.log(`strategy encountered error while authenticating ${userEmail}. error: ${e}`)
				return cb(null, false, {message: "no user found or error encountered with specified email"});
	}}))

passport.use(new GoogleStrategy({
	clientID: process.env["GOOGLE_CLIENT_ID"],
	clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
	callbackURL: '/oauth2/redirect/google',
	scope: ["profile"]},
	function(accessToken, refreshToken, profile, cb) {
		return cb(null, profile)
	}
	))

passport.serializeUser(function(user_id, cb) {
	process.nextTick(function() {
		cb(null, user_id)
	});
});

passport.deserializeUser(function(user_id, cb) {
	process.nextTick(function() {
		return cb(null, user_id)
	})
})

router.get("/login", function(req, res, next){
	res.render("login", {title: "Login"});
});



router.get("/login/federated/google", passport.authenticate("google"));


router.get("/oauth2/redirect/google", passport.authenticate("google", {
	assignProperty: "federatedUser",
	failureRedirect: "/login"
	}),
	async (req, res, next) => {
		const user = await findOrCreateGoogleUser(db, req, res, next)}
);

router.get("/logout", function(req, res, next) {
	req.logout();
	res.redirect("/")
})

router.post("/login/authenticatePasswordUser", async function(req, res) {
	console.log(req.body)
	let reqIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress 
	let loginAttempt, allowed, timeframe, tries;
	try {
		//evaluateLoginAttemptPassword needs to add ip to blocklist if it exceeds attempts in specified time window
		loginAttempt = await evaluateLoginAttemptPassword(reqIP);
		[allowed, timeframe, tries] = loginAttempt;
		console.log("evaluated ip for tries remaining")
		

	} catch(err) {
		console.log("error encountered in first try/catch block")
		console.log(err)}
	console.log(allowed, timeframe, tries)
	if (allowed == true) {
		console.log("running local strategy next")
		// ????? why is the strategy not running at all ?????
		passport.authenticate("local", {failureRedirect: "/login", failureMessage: true})
		}
	if (allowed == false) {
		// for  case of hourly and case of recent exceeding max
		res.render("/tooManyLoginAttempts", {loginFailure: `too many login attempts in ${timeframe} timeframe, tries: ${tries}`}) // add interpolation
		}
	/*  1) checks IP in blocked list and checks IP for tries left
		1.2) send failure if not allowed else continue [x]
		2.0) encrypt password []
		2.05) write local strategy for passport, check passport doc for example
		2.10) tries to login via passport-local strategy []
	*/
	console.log("emulating post request: NOT IMPLEMENTED")
	},
	function(req, res, next) {
		res.send("successfull login")
	})

module.exports = router;