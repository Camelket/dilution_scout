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
        "company_name": "Random ltd"
    },
    "sics":{
        "sic": "8040",
        "sector": "fakeSector",
        "industry": "fakeIndustry"
    },
    "outstanding_shares": [
        {"instant": "2020-07-01", "amount":"8000000"},
        {"instant": "2020-11-01", "amount":"9900000"}
        
    ],
    "net_cash_and_equivalents": [
        {"instant": "2020-07-01", "amount":"80000009"},
        {"instant": "2020-11-01", "amount":"990000088"}  
    ],
    "net_cash_and_equivalents_excluding_financing": [
        {"instant": "2020-07-01", "amount":"80000009"},
        {"instant": "2020-11-01", "amount":"990000088"}  
    ]

}

const populate = async function() {
    await createSIC(db, data["sics"]["sic"],data["sics"]["sector"], data["sics"]["industry"])
}

const testContent = async function() {
    let sics = await db.any("SELECT * FROM sics")
    console.log(sics)
}
populate()
testContent()


