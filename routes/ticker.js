const express = require("express");
const router = express.Router();
const utils = require("../public/scripts/utils.js");
const dilution_db = require("../database/dilution_db/dilution_db_connection");
const {
  readCompany,
  readOutstandingShares,
  readNetCashAndEquivalents,
  readFilingLinks,
  readCompanyIdBySymbol,
  readAllCompaniesIdSymbol,
  readBurnRateSummary
} = require("../database/dilution_db/CRUD.js");
// make calls to db to get the info
// and feed info into render call
// OR
// render basic template then have async functions
// in the template fetch data which takes to long to fetch
// OR
// a combination of the above
let testCache = null


router.get("/search/ticker", async function (req, res, next) {
  if (testCache == null){
    testCache = await readAllCompaniesIdSymbol(dilution_db)
  }
  const { tickerSearchInput } = req.query;
  // console.log(`testCache: ${testCache}`)

  if (tickerSearchInput == "") {
    // add redirect to previous page
    res.redirect("/");
  }
  if (tickerSearchInput.toUpperCase() in testCache) {
    url = "/ticker/" + testCache[tickerSearchInput.toUpperCase()]["id"];
    res.redirect(url);
  } else {
    let url = "/tickerNotFound/" + tickerSearchInput;
    res.redirect(url)
    // add ticker not found styling and text box to bar or redirect to not tracked page
    return;
  }
});

router.get("/tickerNotFound/:input", async function(req, res, next) {
  if (testCache == null){
    testCache = await readAllCompaniesIdSymbol(dilution_db)
  }
  let input = req.params.input
  res.render("tickerNotFound", {cache: testCache, user_input: input})
});


router.get("/indexedTickers", async function(req, res, next) {
  if (testCache == null){
    testCache = await readAllCompaniesIdSymbol(dilution_db)
  }
  res.render("indexedTickers", {cache: testCache})
})

router.get("/ticker/:id", async function (req, res, next) {
  let id;
  let company;
  try {
    id = req.params.id;
    // console.log(id, testCache); 
    company = await readCompany(dilution_db, id)
    // console.log(company)
  } catch (e) {
    console.log("fucked up with getting id from req.params");
    console.log(e);
  }
  // fetch basic company data for "theader" here
  //
  // --

  // format basic company data to be ready for display

  // package basic company data into an object
  let outstanding, cash, filingLinks, cashBurnInfo;
  try {
    cash = await readNetCashAndEquivalents(dilution_db, id);
    // format the date to a more human readable form
  } catch (e) {
    console.log("fucked up getting the cash position from db");
    console.log(e);
  }
  try {
    outstanding = await readOutstandingShares(dilution_db, id);
    // format the date to a more human readable form
    for (let idx in outstanding){
      outstanding[idx]["instant"] = utils.formatStringToOnlyDate(outstanding[idx]["instant"])
    }
  } catch (e) {
    console.log("fucked up getting OShares:");
    console.log(e);
  }
  try{
    filingLinks = await readFilingLinks(dilution_db, id)
    // format the date to a more human readable form
    for (let key in filingLinks){
      for (let entry in filingLinks[key]){
        formattedDate = utils.formatStringToOnlyDate(filingLinks[key][entry][3])
        filingLinks[key][entry][3] = formattedDate
      }}
    
  } catch(e) {
    console.log("fucked up getting filingLinks:")
    console.log(e)
  }
  
  try{
    cashBurnInfo = await readBurnRateSummary(dilution_db, id)
    cashBurnInfo["cash_missing"] = utils.formatNumber((cashBurnInfo["days_of_cash"])*cashBurnInfo["burn_rate"])
    cashBurnInfo["burn_rate"] = cashBurnInfo["burn_rate"].toFixed(0)
    cashBurnInfo["burn_rate_date"] = utils.formatStringToOnlyDate(cashBurnInfo["burn_rate_date"])
    cashBurnInfo["net_cash_date"] = utils.formatStringToOnlyDate(cashBurnInfo["net_cash_date"])
    cashBurnInfo["net_cash"] = utils.formatNumber(cashBurnInfo["net_cash"])
    
    console.log(cashBurnInfo)
  } catch (e) {
    console.log("fucked up getting cashBurnSummary:");
    console.log(e);
  }
 

  doc = res.render("ticker", {
    company_info: company,
    outstandingShares: outstanding,
    cashPosition: cash,
    cashBurnInfo: cashBurnInfo,
    filings: filingLinks
  });
  //   let p = document.createElement("p")
  //   p.append("THIS IS ADDED TO THE DOC")
  //   document.getElementById("dilution").append(p)
});

module.exports = router;
