//  define all the CRUD function to get the dilution info needed for the ticker.js route
const db = require("./dilution_db_connection")
// what should i return on success: id or true if no id
const createSIC = async function(db, sic, sector, industry) {
    try {
        await db.none("INSERT INTO sics(sic, sector, industry) VALUES($1, $2, $3)", [sic, sector, industry])
    } catch(e) {console.log(e); return null}
    return true
    } 


const createCompany = async function(db, cik, sic, symbol, name, description) {
    let id;
    try{
    id = await db.one("INSERT INTO companies(cik, sic, symbol, name_, description_) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [cik, sic, symbol, name, description]);
    } catch(e) {
        // handle sic doesnt exist 
        console.log(e); return null}
    return id
}

// const updateCompany
// const deleteCompany
const getCompanyIdBySymbol = async function(db, symbol) {
    let id;
    try {
        id = await db.one("SELECT id as id from companies WHERE symbol = $1", [symbol])
    } catch(e) {console.log(`func: getCompanyIdBySymbol with e: ${e}`)}
    if (id) {
        id = id["id"]
        return id
    }
    return null
}

const getAllCompaniesIdSymbol = async function (db) {
    let result;
    try {
       result = await db.many("SELECT id, symbol FROM companies") 
    } catch(e) {console.log(`func: getAllCompaniesIdSymbol with e: ${e}`)}
    console.log(`getAllCompaniesIdSymbol result: ${result}`)
    
    return result
}

const readCompany = async function (db, id) {
    let result;
    try{
        result = await db.one("SELECT c.id, c.cik, c.sic, c.symbol, c.name_ as name, c.description_ as description, s.sector, s.industry FROM companies as c  JOIN sics as s ON c.sic = s.sic WHERE id = $1", [id])
    } catch(e) {console.log(`func: readCompany with e: ${e}`)}
    return result
}

const createOutstandingShares = async function(db, id, instant, amount) {
    try{
        // parse str into date ?
        await db.none("INSERT INTO outstanding_shares(company_id, instant, amount) VALUES($1, $2, $3)",
        [id, instant, amount])
    } catch (e) {console.log(e); return null}
    return true;
}

const readOutstandingShares = async function(db, id) {
    let values;
    try {   
       values = await db.any("SELECT instant, amount FROM outstanding_shares WHERE company_id = $1", [id]) 
    } catch (e) {console.log(e); return null}
    console.log(values)
    // transform values to conform to list of object if necessary
    return values
}

const updateOutstandingShares = async function(db, id, instant, new_amount) {
    try {
        //  not sure about syntax here
        await db.none("UPDATE outstanding_shares SET amount = $1 WHERE id = $2 AND instant = $3",
        [id, new_amount, instant])
    } catch(e) {console.log(e); return null}
    return true;
}

const createNetCashAndEquivalents = async function(db, id, instant, amount) {
    try{
        // parse str into date ?
        await db.none("INSERT INTO net_cash_and_equivalents(company_id, instant, amount) VALUES($1, $2, $3)",
        [id, instant, amount])
    } catch (e) {console.log(e); return null}
    return true;
}
 
const readNetCashAndEquivalents = async function(db, id) {
    let values;
    try {
       values = await db.any("SELECT instant, amount FROM net_cash_and_equivalents WHERE company_id = $1", [id]) 
    } catch (e) {console.log(e); return null}
    // transform values to conform to list of object if necessary
    return values
}

const createNetCashAndEquivalentsExcludingRestricedNoncurrent = async function(db, id, instant, amount) {
    try{
        // parse str into date ?
        await db.none("INSERT INTO net_cash_and_equivalents_excluding_restricted_noncurrent(company_id, instant, amount) VALUES($1, $2, $3)",
        [id, instant, amount])
    } catch (e) {console.log(e); return null}
    return true;
}

module.exports = {
    readCompany,
    createSIC,
    createCompany,
    createNetCashAndEquivalents,
    createNetCashAndEquivalentsExcludingRestricedNoncurrent,
    createOutstandingShares,
    readOutstandingShares,
    readNetCashAndEquivalents,
    updateOutstandingShares,
    getCompanyIdBySymbol,
    getAllCompaniesIdSymbol
}