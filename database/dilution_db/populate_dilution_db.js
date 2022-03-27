const db = require("./dilution_db_connection")
const {createSIC,
    createCompany,
    createNetCashAndEquivalents,
    createNetCashAndEquivalentsNoFinancing,
    createOutstandingShares,
    readOutstandingShares,
    readNetCashAndEquivalents,
    updateOutstandingShares} = require("./CRUD.js")

const data = {
    "company":{
        "cik": "000032019",
        "sic": "8040",
        "symbol": "AXNS",
        "name": "Random ltd",
        "description": "lorem ipsum company does lorem ipsum in lorem with ipsum"
    },
    "sics":{
        "sic": "8040",
        "sector": "fakeSector",
        "industry": "fakeIndustry"
    },
    "outstanding_shares": [
        {"instant": "2020-01-01", "amount":"1000000"},
        {"instant": "2020-04-01", "amount":"2000000"},
        {"instant": "2020-07-01", "amount":"3000000"},
        {"instant": "2020-11-01", "amount":"4000000"},
        {"instant": "2021-01-01", "amount":"5000000"},
        {"instant": "2021-04-01", "amount":"6000000"},
        {"instant": "2021-07-01", "amount":"7000000"},
        {"instant": "2021-11-01", "amount":"9000000"}
        
    ],
    "net_cash_and_equivalents": [
        {"instant": "2020-01-01", "amount":"80000009"},
        {"instant": "2020-04-01", "amount":"90000000"},  
        {"instant": "2020-07-01", "amount":"100000000"},  
        {"instant": "2020-11-01", "amount":"110000000"},  
        {"instant": "2021-01-01", "amount":"120000000"},  
        {"instant": "2021-04-01", "amount":"130000000"}  
    ],
    "net_cash_and_equivalents_excluding_financing": [
        {"instant": "2020-07-01", "amount":"80000009"},
        {"instant": "2020-11-01", "amount":"990000088"}  
    ]

}

const populate = async function() {
    try {
        await createSIC(db, data["sics"]["sic"], data["sics"]["sector"], data["sics"]["industry"])
    }catch(e) {}
    try{
        await createCompany(db, data["company"]["cik"], data["company"]["sic"], data["company"]["symbol"], data["company"]["name"], data["company"]["description"]);
    }catch(e) {}
    let id;
    try{id = await db.one("SELECT id FROM companies WHERE symbol = $1", [data["company"]["symbol"]])}
    catch(e){console.log(`logging ${e}`)}
    for (let i=0; i < data["outstanding_shares"].length; i++){
        try{
            let p = data["outstanding_shares"][i]
            await createOutstandingShares(db, id["id"], p["instant"], p["amount"])}
        catch(e) {console.log(`${e} Couldnt create outstanding shares`)}
    }
    for (let i=0; i < data["net_cash_and_equivalents"].length; i++){
        try{
            let p = data["net_cash_and_equivalents"][i]
            await createNetCashAndEquivalents(db, id["id"], p["instant"], p["amount"])}
        catch(e) {console.log(`${e} Couldnt insert cash pos________________________________-`)}
}}

const testContent = async function() {
    let id = 1;
    let sics = await db.any("SELECT * FROM sics")
    console.log(sics)
    let companies = await db.any("SELECT * FROM companies")
    console.log(companies)
    let outstanding_shares = await db.any("SELECT companies.symbol, outstanding_shares.instant, outstanding_shares.amount FROM outstanding_shares JOIN companies ON companies.id = outstanding_shares.company_id WHERE company_id = $1", [id])
    console.log(outstanding_shares)
    let net_cash_and_equivalents = await db.any("SELECT * FROM net_cash_and_equivalents")
    console.log(net_cash_and_equivalents)
}
// let tables;
// setTimeout( async function (){
    
//     tables = await db.any("SELECT table_schema , table_name FROM information_schema.tables WHERE table_schema not in ('information_schema', 'pg_catalog') AND table_type = 'BASE TABLE' ORDER BY table_schema, table_name")
//     setTimeout(() => console.log(tables), 2000)
// }, 2000)

setTimeout(() => {populate()}, 500)

setTimeout(() => {testContent()}, 3000)

module.exports = db;
// setTimeout(() => {clearTables()}, 5000)