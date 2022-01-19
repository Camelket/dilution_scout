const express = require("express")
/*const pgp = require("pg_promise");*/
const path = require("path");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login")

const db_config = require("./database/db_config");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'controllers')));
app.use("/", indexRouter);
app.use("/login", loginRouter);



module.exports = app;