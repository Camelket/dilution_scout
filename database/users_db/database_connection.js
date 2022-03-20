const dbConfig = require("./db_config.js");
const pgp = require("pg-promise")({});
const bcrypt = require("bcrypt")

const sqlFile = require("./queryFileHelper.js");
const {checkUserExists} = require("./databaseUtil.js")

const db = pgp(dbConfig)

const initTablesFile = sqlFile("./init_tables.sql")
const populateFile = sqlFile("./populateTables.sql")
const allContentFile = sqlFile("./returnAllTablesContent.sql")

async function testSimpleQuery() { const rv = await db.any("SELECT * FROM users WHERE id = $1", [1]);
								   console.log(rv)};


const logObject = function(obj) {
	console.log(obj)
	let k = 0;
	let v = 0;
	for ([k, v] in obj) {console.log(`${k}: ${v}`)}
	console.log("logObject done")
}



async function testDb() {
	await db.any(initTablesFile, [])
	await db.any(populateFile, {u_name: "jack", u_email: "jack@test.com", user_id: "1", password: bcrypt.hash("123", 10)})
}


async function testUserExists(db) {
	let objUsers = await checkUserExists(db, "jack@test.com");
	console.log(`logObject: ${objUsers}`);
}



testDb()
let rv = testUserExists(db)


module.exports = db;