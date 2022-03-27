const dbConfig = require("./db_config.js");
const pgp = require("pg-promise")({});

const sqlFile = require("./queryFileHelper.js");

const db = pgp(dbConfig)
const initTablesFile = sqlFile("./init_tables.sql")

const clearTables = async function() {
    await db.any("DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END $$;")
}

async function testDb() {
    // await clearTables()

    try{
    	// setTimeout(db.any(initTablesFile, []), 1000)
        await db.any(initTablesFile, [])

    } catch(e) {console.log(e)}
    console.log("init tables done : dilution_db")
}

testDb()
module.exports = db;