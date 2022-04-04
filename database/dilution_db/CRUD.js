//  define all the CRUD function to get the dilution info needed for the ticker.js route
const db = require("./dilution_db_connection")
// what should i return on success: id or true if no id


// const updateCompany
// const deleteCompany
const readCompanyIdBySymbol = async function(db, symbol) {
    let id;
    try {
        id = await db.one("SELECT id as id from companies WHERE symbol = $1", [symbol])
    } catch(e) {console.log(`func: readCompanyIdBySymbol with e: ${e}`)}
    if (id) {
        id = id["id"]
        return id
    }
    return null
}

const readAllCompaniesIdSymbol = async function (db) {
    let result;
    try {
       result = await db.any("SELECT id, symbol FROM companies")
    } catch(e) {console.log(`func: getAllCompaniesIdSymbol with e: ${e}`)}
    
    finally{
        console.log(`getAllCompaniesIdSymbol result: ${result}`)
        let obj = {}
        console.log(typeof(array))
        for (let company in result){
            obj[result[company]["symbol"]] = result[company]["id"]
        }
        return obj}
}

const readCompany = async function (db, id) {
    let result;
    try{
        result = await db.one("SELECT c.id, c.cik, c.sic, c.symbol, c.name_ as name, c.description_ as description, s.sector, s.industry FROM companies as c  JOIN sics as s ON c.sic = s.sic WHERE id = $1", [id])
    } catch(e) {console.log(`func: readCompany with e: ${e}`)}
    return result
}



const readOutstandingShares = async function(db, id) {
    let values;
    try {   
       values = await db.any("SELECT instant, amount FROM outstanding_shares WHERE company_id = $1", [id]) 
    } catch (e) {console.log(e); return null}
    console.log(`OutstandingShares in readOutstandingShares call: ${values}`)
    // transform values to conform to list of object if necessary
    return values
}

const readNetCashAndEquivalents = async function(db, id) {
    let values;
    try {
       values = await db.any("SELECT instant, amount FROM net_cash_and_equivalents WHERE company_id = $1", [id]) 
    } catch (e) {console.log(e); return null}
    console.log(`netCashAndEquivalents in readNetCashAndEquivalents call: ${values}`)
    // transform values to conform to list of object if necessary
    return values
}

const readNetCashAndEquivalentsExcludingRestrictedNoncurrent = async function(db, id) {
    let values;
    try {
       values = await db.any("SELECT instant, amount FROM net_cash_and_equivalents_excluding_restriced_noncurrent WHERE company_id = $1", [id]) 
    } catch (e) {console.log(e); return null}
    console.log(`netCashAndEquivalentsExcludingRestrictedNoncurrent in readNetCashAndEquivalentsExcludingRestrictedNoncurrent call: ${values}`)
    // transform values to conform to list of object if necessary
    return values
}

const readFilingLinks = async function(db, id){
    let values;
    let obj = {}
    try{
        values = await db.any("SELECT fl.company_id as id, fl.filing_html as filing_link, fl.form_type, fl.filing_date, fl.description_ as description, fl.file_number, ft.category FROM filing_links as fl JOIN form_types as ft ON fl.form_type = ft.form_type WHERE company_id = $1",
        [id])
    } catch(e) {console.log(e); return null}
    for (let idx in values){
        let entry = values[idx]
        category = entry["category"]
        if (!obj[category]){
            obj[category] = [];
        }
        obj[category].push([
            entry["form_type"],
            entry["filing_link"],
            entry["description"],
            entry["filing_date"]
        ])}
    // console.log(obj)

    return obj
}

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

const createOutstandingShares = async function(db, id, instant, amount) {
    try{
        // parse str into date ?
        await db.none("INSERT INTO outstanding_shares(company_id, instant, amount) VALUES($1, $2, $3)",
        [id, instant, amount])
    } catch (e) {console.log(e); return null}
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

const createNetCashAndEquivalentsExcludingRestricedNoncurrent = async function(db, id, instant, amount) {
    try{
        // parse str into date ?
        await db.none("INSERT INTO net_cash_and_equivalents_excluding_restricted_noncurrent(company_id, instant, amount) VALUES($1, $2, $3)",
        [id, instant, amount])
    } catch (e) {console.log(e); return null}
    return true;
}
 
const updateOutstandingShares = async function(db, id, instant, new_amount) {
    try {
        //  not sure about syntax here
        await db.none("UPDATE outstanding_shares SET amount = $1 WHERE id = $2 AND instant = $3",
        [id, new_amount, instant])
    } catch(e) {console.log(e); return null}
    return true;
}


module.exports = {
    createSIC,
    createCompany,
    createNetCashAndEquivalents,
    createNetCashAndEquivalentsExcludingRestricedNoncurrent,
    createOutstandingShares,
    readOutstandingShares,
    readNetCashAndEquivalents,
    readNetCashAndEquivalentsExcludingRestrictedNoncurrent,
    readFilingLinks,
    readCompany,
    readCompanyIdBySymbol,
    readAllCompaniesIdSymbol,
    updateOutstandingShares
}