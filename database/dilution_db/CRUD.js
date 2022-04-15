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
       result = await db.any("SELECT id, symbol, name_ as name FROM companies")
    } catch(e) {console.log(`func: getAllCompaniesIdSymbol with e: ${e}`)}
    
    finally{
        console.log(`getAllCompaniesIdSymbol result: ${result}`)
        let obj = {}
        console.log(typeof(array))
        for (let company in result){
            obj[result[company]["symbol"]] = {"id" : result[company]["id"], "name": result[company]["name"]}
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
       values = await db.any("SELECT instant, amount FROM outstanding_shares WHERE company_id = $1 ORDER BY instant ASC", [id]) 
    } catch (e) {console.log(e); return null}
    console.log(`OutstandingShares in readOutstandingShares call: ${values}`)
    // transform values to conform to list of object if necessary
    return values
}

const readNetCashAndEquivalents = async function(db, id) {
    let values;
    try {
       values = await db.any("SELECT instant, amount FROM net_cash_and_equivalents WHERE company_id = $1 ORDER BY instant ASC", [id]) 
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
        values = await db.any("SELECT fl.company_id as id, fl.filing_html as filing_link, fl.form_type, fl.filing_date, fl.description_ as description, fl.file_number, ft.category FROM filing_links as fl JOIN form_types as ft ON fl.form_type = ft.form_type WHERE company_id = $1 ORDER BY fl.filing_date DESC",
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

const readBurnRateSummary = async function(db, id){
    let values;
    let obj;
    try{
        values = await db.any("SELECT burn_rate, burn_rate_date, net_cash, net_cash_date, days_of_cash, days_of_cash_date FROM cash_burn_summary WHERE company_id = $1",
        [id])
    } catch(e) {console.log(e); return null}
    obj = values[0]
    return obj
    }



module.exports = { 
    readOutstandingShares,
    readNetCashAndEquivalents,
    readNetCashAndEquivalentsExcludingRestrictedNoncurrent,
    readFilingLinks,
    readCompany,
    readCompanyIdBySymbol,
    readAllCompaniesIdSymbol,
    readBurnRateSummary
}