const express = require("express")
/*const pgp = require("pg_promise");*/
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");

const app = express();


app.use(express.urlencoded({ extended: false }));

app.use(session({
	secret: process.env["EXPRESS_SESSION_SECRET"],
	secure: false,
	resave: false,
	saveUninitialized: false,
	// add suitable store: for production 
}))
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'controllers')));
app.use(morgan("combined"));



/*app.use(function(req, res, next) {
	if (!req.session.passport) {console.log("no passport in session found")}
	else {
		console.log(req.session)
	}
	next()
})*/
app.use((req, res, next) => {
	res.locals.session = req.session;
	res.locals.isAuthenticated = req.isAuthenticated()

	console.log(req.session) //debug only
	next()}); //  rest for pug global variables
app.use("/", indexRouter);
app.use("/", loginRouter);

//debug
app.use("/", require("./routes/sessionInfo"))

module.exports = app;