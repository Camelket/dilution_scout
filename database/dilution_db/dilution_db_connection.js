const dbConfig = require("./db_config.js");
const pgp = require("pg-promise")({});

const sqlFile = require("./queryFileHelper.js");

const db = pgp(dbConfig)
const initTablesFile = sqlFile("./init_tables.sql")

async function testDb() {
    try{
    	await db.any(initTablesFile, [])
    } catch(e) {console.log(e)}
    console.log("init tables done : dilution_db")
}

testDb()

module.exports = db;