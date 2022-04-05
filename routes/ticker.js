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
  readAllCompaniesIdSymbol
} = require("../database/dilution_db/CRUD.js");
const {createOSChartconfig, createCPChartconfig} = require("../public/scripts/exampleChart.js");
// make calls to db to get the info
// and feed info into render call
// OR
// render basic template then have async functions
// in the template fetch data which takes to long to fetch
// OR
// a combination of the above
let fakecache = null

const fakeCompany = {
  ticker: "HYMC",
  name: "Hycroft Mining Holding",
  sector: "Materials",
  industry: "Metals and Mining",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  mktcap: utils.formatNumber(137300000),
  float: utils.formatNumber(3212000),
};

router.get("/search/ticker", async function (req, res, next) {
  if (fakecache == null){
    fakecache = await readAllCompaniesIdSymbol(dilution_db)
  }
  const { tickerSearchInput } = req.query;
  // console.log(`fakecache: ${fakecache}`)

  if (tickerSearchInput == "") {
    // add redirect to previous page
    res.redirect("/");
  }
  if (tickerSearchInput.toUpperCase() in fakecache) {
    url = "/ticker/" + fakecache[tickerSearchInput.toUpperCase()];
    res.redirect(url);
  } else {
    // add ticker not found styling and text box to bar or redirect to not tracked page
    return;
  }
});
router.get("/ticker/:id", async function (req, res, next) {
  let id;
  let company;
  try {
    id = req.params.id;
    // console.log(id, fakecache); 
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
  let outstanding, cash, filingLinks;
  try {
    cash = await readNetCashAndEquivalents(dilution_db, id);
    // format the date to a more human readable form
    for (let idx in cash){
      cash[idx]["instant"] = utils.formatStringToOnlyDate(cash[idx]["instant"])
    }
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
  let OSChartConfig, CashPosConfig
  OSChartConfig = createOSChartconfig(outstanding);
  CashPosConfig = createCPChartconfig(cash)

  doc = res.render("ticker", {
    company_info: company,
    OSChartConfig: OSChartConfig,
    CashPosConfig: CashPosConfig,
    filings: filingLinks
  });
  //   let p = document.createElement("p")
  //   p.append("THIS IS ADDED TO THE DOC")
  //   document.getElementById("dilution").append(p)
});

module.exports = router;
