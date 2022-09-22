//  define all the CRUD function to get the dilution info needed for the ticker.js route
const db = require("./dilution_db_connection")
// what should i return on success: id or true if no id


// const updateCompany
// const deleteCompany
const readCompanyIdBySymbol = async function(db, symbol) {
    let id;
    try {
        id = await db.one("SELECT id from companies WHERE symbol = $1", [symbol])
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
        result = await db.one("SELECT c.id, c.cik, c.sic, c.symbol, c.name_ as name, c.description_ as description, s.sector, s.industry FROM companies as c  JOIN sics as s ON c.sic = s.sic WHERE c.id = $1", [id])
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

const readFilingLinkByAccessionNumber = async function(db, accn){
    let values;
    let obj;
    // console.log("trying to get filingLink for accn: ", accn)
    try{
        values = await db.any(`
            SELECT 
                fl.company_id AS id, 
                fl.filing_html AS filing_link, 
                fl.form_type, 
                fl.filing_date, 
                fl.description_ AS description, 
                fl.file_number, 
                ft.category 
            FROM filing_links AS fl 
            JOIN form_types as ft 
                ON fl.form_type = ft.form_type 
            WHERE fl.accn = $1 ORDER BY fl.filing_date DESC`,
        [accn])
    } catch(e) {console.log("failed to get filingLink; ",e); return null}
    obj = values[0]
    // console.log(obj)
    return obj
}

const readAssociatedEffectFiling = async function(db, fileNumber, formType){
    let values;
    let result;
    try{
        values = await db.any(`
            SELECT 
                er.accn,
                fl.filing_html
            FROM effect_registrations AS er
            JOIN filing_links AS fl
                ON fl.accn = er.accn
            WHERE
                er.file_number = $1
                AND
                er.form_type = $2
            `,
        [fileNumber, formType])
    } catch(e) {console.log("failed to get effect_registration for fileNumber: ", fileNumber, e); return null}
    result = values[0]
    // console.log(result)
    return result    
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

const readSecuritiesOutstanding = async function(db, id){
    let finalOutstanding;
    try{
        finalOutstanding = await db.any(
            `SELECT s.id as security_id, s.company_id, s.security_name, s.security_type, s.underlying_security_id, s.security_attributes,
             so.amount, so.instant
             FROM securities AS s
             JOIN securities_outstanding AS so ON security_id = (
                SELECT security_id FROM securities_outstanding AS so WHERE so.security_id = s.id ORDER BY so.instant DESC LIMIT 1
             )
             WHERE company_id = $1
             `,
        [id])
    } catch(e) {console.log (e); return null}
    console.log("finalOutstanding: ", finalOutstanding)
    return finalOutstanding

}


const readShelfs = async function(db, id){
    //- returns {"shelfs": [{"shelf": obj, "offerings: [{"offering": obj, "registered": obj, "completed": obj}]"}]}
    let values;
    let shelfs = []
    try{
        values = await db.any("SELECT id AS shelf_id, company_id, accn, file_number, form_type, capacity, total_amount_raised, effect_date, last_update, expiry, filing_date, is_active FROM shelf_registrations WHERE company_id = $1",
        [id])
        // console.log("values from shelf query: ", values)
    } catch(e) {console.log(e); console.log("returning null"); return null}
    for (let key in values) {
        let shelf = values[key]
        let shelf_id = shelf["shelf_id"]
        let offerings = [];
        console.log("shelf: ", shelf)
        try {
            let result = db.any(
                `SELECT accn, filing_date, offering_type, offering_status_id, final_offering_amount, os.name_, commencment_date, end_date
                 FROM shelf_offerings
                 JOIN offering_status AS os ON offering_status_id = os.id 
                 WHERE shelf_registrations_id = $1`,
            [shelf_id])
            for (let offering_key in result) {
                let offering = result[offering_key]
                let offering_id = offering["offering_id"]
                let registered;
                let completed;
                let offering_joined = []
                try {
                    registered = db.any(
                        `SELECT security_id, amount_security, amount_dollar
                         FROM securities_shelf_offerings_registered
                         JOIN securities AS s1 ON security_id == s1.id
                         JOIN securities AS s2 ON securities_shelf_offerings_registered.source_security_id = s2.id 
                         WHERE securities_shelf_offerings_registered.shelf_offerings_id = $1
                        `, [offering_id])
                    console.log("registered: ", registered)
                } catch(e) {console.log("readShelf registered: ", e)}
                try {
                    completed = db.any(
                        `SELECT security_id, amount_security, amount_dollar
                         FROM securities_shelf_offerings_completed
                         JOIN securities ON security_id == securities.id
                         JOIN securities ON securities_shelf_offerings_completed.source_security_id = securities.id
                         WHERE securities_shelf_offerings_completed.shelf_offerings_id = $1
                        `, [offering_id])
                } catch(e) {console.log("readShelf completed: ", e)}

                offering_joined.push(
                    {
                        "offering": offering,
                        "registered": registered,
                        "completed": completed
                    }
                )
                offerings.push(
                    offering_joined
                )
            }

        } catch(e) {console.log("failed to get offerings related to the shelf: e:", e);}
        shelfs.push(
            {
                "shelf": shelf,
                "offerings": offerings
            }
            )
        shelfs.sort(function(a, b) {
            let value1 = a["shelf"]["filing_date"]
            let value2 = b["shelf"]["filing_date"]
            return (value1 > value2) ? -1 : (value1 < value2) ? 1 : 0
        })
    }
    console.log("° of shelfs: ", shelfs.length)
    console.log("shelfs: ", shelfs)
    return shelfs

    }




module.exports = { 
    readOutstandingShares,
    readNetCashAndEquivalents,
    readNetCashAndEquivalentsExcludingRestrictedNoncurrent,
    readFilingLinks,
    readFilingLinkByAccessionNumber,
    readCompany,
    readCompanyIdBySymbol,
    readAllCompaniesIdSymbol,
    readBurnRateSummary,

    readShelfs,
    readSecuritiesOutstanding,
    readAssociatedEffectFiling
}