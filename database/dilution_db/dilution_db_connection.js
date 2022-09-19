const dbConfig = require("./db_config.js");
const pgp = require("pg-promise")({});
const db = pgp(dbConfig)

module.exports = db;