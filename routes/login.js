// to implement: tie existing user account to google account if trying to login?
//

require("dotenv").config()
const bcrypt = require("bcrypt")
const { evaluateLoginAttemptPassword } = require("../controllers/memcachedUtil.js") 
const express = require("express");
const router = express.Router();
const user_db = require("../database/users_db/database_connection.js");
const {getUserInfo, findOrCreateGoogleUser, authenticatePasswordUser, createPasswordUser} = require("../database/users_db/databaseUtil.js");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local")

const googleAuthentication = new GoogleStrategy({
	clientID: process.env["GOOGLE_CLIENT_ID"],
	clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
	callbackURL: '/oauth2/redirect/google',
	scope: ["email", "profile"]},
	function(accessToken, refreshToken, profile, cb) {
		return cb(null, profile)
	}
	)

const localAuthentication = new LocalStrategy({usernameField: "userEmail", passwordField: "userPassword"},
	async function (username, password, cb) {
		console.log(`running authentication with local strategy; args: ${username}, ${password}, ${cb}`);
		let user;
		try {
			user = await authenticatePasswordUser(user_db, username, password)
			if (!user) {
				return cb(null, false, {message: "no user found with specified email"});
			}
			if (user) {
				return cb(null, user)
			}
		} catch(e) {
			console.log(`strategy encountered error while authenticating ${username}. error: ${e}`)
			return cb(null, false, {message: "no user found or error encountered with specified email"});
			}
	})

passport.use(localAuthentication)

passport.use(googleAuthentication)

passport.serializeUser(function(user, done) {
	console.log(`user.id in serializeUser: ${user.id}`);
	done(null, user.id.toString())
});

passport.deserializeUser(async function(userId, done) {
	console.log(`userId in deserializeUser: ${userId}`);
	let user;
	try {
		user = await getUserInfo(user_db, userId);
	}catch(e){console.log(e);
			  done(e, user)}
	console.log(`user in deserializeUser: ${user}`)
	done(null, user)
	});

router.get("/login", function(req, res, next){
	res.render("login", {title: "Login"});
});



router.get("/login/federated/google", passport.authenticate("google"));


router.get("/oauth2/redirect/google", passport.authenticate("google", {
	assignProperty: "federatedUser",
	failureRedirect: "/login"
	}),
	async (req, res, next) => {
		const user = await findOrCreateGoogleUser(user_db, req, res, next);
	}
);



router.post("/login/authenticatePasswordUser", async function(req, res, next) {
	console.log(req.body)
	let reqIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress 
	let loginAttempt, allowed, timeframe, tries;
	try {
		//evaluateLoginAttemptPassword needs to add ip to blocklist if it exceeds attempts in specified time window
		loginAttempt = await evaluateLoginAttemptPassword(reqIP);
		[allowed, timeframe, tries] = loginAttempt;
		console.log("evaluated ip for tries remaining")
		

	} catch(err) {
		console.log(err)}
/*	console.log(allowed, timeframe, tries)
*/	if (allowed == true) {
		passport.authenticate("local", {failureRedirect: "/login", failureMessage: true})(req, res, next)
		}
	if (allowed == false) {
		// for  case of hourly and case of recent exceeding max
		res.render("/tooManyLoginAttempts", {loginFailure: `too many login attempts in ${timeframe} timeframe, tries: ${tries}`}) // add interpolation
		}
	/*  1) checks IP in blocked list and checks IP for tries left
		1.2) send failure if not allowed else continue [x]
		2.0) encrypt password [x]
		2.05) write local strategy for passport, check passport doc for example [x]
		2.10) tries to login via passport-local strategy [x]
	*/
	},
	function(req, res, next) {
		res.redirect("/")
	})

router.get("/logout", function(req, res, next) {
	req.logout();
	res.redirect("/")
})


module.exports = router;