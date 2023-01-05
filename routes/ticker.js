const express = require("express");
const router = express.Router();
const utils = require("../public/scripts/utils.js");
const dilution_db = require("../database/dilution_db/dilution_db_connection");
const {
  readCompany,
  readOutstandingSecurities,
  readOutstandingShares,
  readNetCashAndEquivalents,
  readFilingLinks,
  readCompanyIdBySymbol,
  readAllCompaniesIdSymbol,
  readBurnRateSummary,

  readSecuritiesOutstanding,
  readShelfs,
  readFilingLinkByAccessionNumber,
  readRelatedFilingLinks,
  readFilingParseStatus,
  readAssociatedEffectFiling
} = require("../database/dilution_db/CRUD.js");
const MemoryCache = require("../utility/memoryCache.js");

// make calls to db to get the info
// and feed info into render call
// OR
// render basic template then have async functions
// in the template fetch data which takes to long to fetch
// OR
// a combination of the above

// create util file later
function groupBy(data, property) {
  return data.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

let getSecurityOutstandingTabContent = async function(db, id) {
  let securitiesOutstanding = await readOutstandingSecurities(db, id)
  return formatSecurityOutstandingForSecurityOutstandingChart(securitiesOutstanding)
}

const formatSecurityOutstandingForSecurityOutstandingChart = function(data) {
  let newArray = [];
  let groupedData = groupBy(data, "security_id");
  for (const kv of Object.entries(groupedData)){
    securityData = kv[1]
    key = kv[0]
    if (securityData) {
      newArray.push(securityData)
    }
  }
  return newArray
}

let getShelfTabContent = async function(db, id) {
  let shelfs = await readShelfs(db, id)
  for (let shelf_key in shelfs){
    let shelf = shelfs[shelf_key]["shelf"]
    let accn = shelf["accn"]
    await getFilingLink(accn, shelf);
    await getEffectFiling(shelf);
    shelf["related_filings"] = await getRelatedFilings(shelf["file_number"])
    // move the formatting to the client side ?
    formatFilingDate(shelf);
    formatEffectDate(shelf);
    formatIsActive(shelf);
    formatCapacity(shelf);
    // prep offerings here
    console.log(shelf)
    shelfs[shelf_key]["shelf"] = shelf
  }
  return shelfs
  
  function formatIsActive(shelf) {
    if (shelf["is_active"] == undefined) {
      shelf["is_active"] = "Unknown if this Filing is active."
    }
  }

  function formatFilingDate(shelf) {
    shelf["filing_date"] = utils.formatStringToOnlyDate(shelf["filing_date"]);
  }
  
  function formatEffectDate(shelf) {
    if (shelf["effect_date"] != undefined) {
      shelf["effect_date"] = utils.formatStringToOnlyDate(shelf["effect_date"]);
    } else {
      shelf["effect_date"] = "No Effect Date Yet"
    }
  }

  function formatCapacity(shelf) {
    shelf["capacity"] = utils.formatNumber(shelf["capacity"]);
  }
  
  async function getFilingLink(accn, shelf) {
    let filingLink;
    filingLink = await readFilingLinkByAccessionNumber(db, accn);
    shelf["filingLink"] = filingLink;
  }

  async function getEffectFiling(shelf) {
    if (shelf["effect_date"] != undefined) {
      let effectFiling;
      effectFiling = await readAssociatedEffectFiling(db, shelf["file_number"], shelf["form_type"]);
      if (effectFiling) {
        shelf["effectFiling"] = effectFiling;
      }
    } else {
      shelf["effectFiling"] = undefined;
    }
  }

  async function getRelatedFilings(fileNumber) {
    let result = [];
    if (fileNumber) {
      related = await readRelatedFilingLinks(db, fileNumber)
      for (let key in related){
        let entry = related[key]
        let parseStatus = await readFilingParseStatus(db, entry["accn"])
        formatRelatedFilingsDates(parseStatus, entry);
        result.push({
          "filing": entry,
          "parse_status": parseStatus})
        }
      }
      result.sort((a,b) => {
        let valueA = a["filing"]["filing_date"]
        let valueB = b["filing"]["filing_date"]
        return (valueA > valueB) ? -1 : (valueA < valueB) ? 1 : 0
      })
    return result

    function formatRelatedFilingsDates(parseStatus, entry) {
      entry["filing_date"] = utils.formatStringToOnlyDate(entry["filing_date"]);
      if (parseStatus != [] && parseStatus != undefined) {
        parseStatus["date_parsed"] = utils.formatStringToOnlyDate(parseStatus["date_parsed"]);
      }
    }
  }


}


let getAllCompaniesIdSymbolForCache = async function() {
  return await readAllCompaniesIdSymbol(dilution_db)
}

let testCache = new MemoryCache(getAllCompaniesIdSymbolForCache, 2)

router.get("/search/ticker", async function (req, res, next) {
  cachedTickers = await testCache.getData()
  const { tickerSearchInput } = req.query;
  // console.log(`testCache: ${testCache}`)

  if (tickerSearchInput == "") {
    // add redirect to previous page
    res.redirect("/");
  }
  if (tickerSearchInput.toUpperCase() in cachedTickers) {
    url = "/ticker/" + cachedTickers[tickerSearchInput.toUpperCase()]["id"];
    res.redirect(url);
  } else {
    let url = "/tickerNotFound/" + tickerSearchInput;
    res.redirect(url)
    // add ticker not found styling and text box to bar or redirect to not tracked page
    return;
  }
});

router.get("/tickerNotFound/:input", async function(req, res, next) {
  cachedTickers = await testCache.getData()
  let input = req.params.input
  res.render("tickerNotFound", {cache: cachedTickers, user_input: input})
});


router.get("/indexedTickers", async function(req, res, next) {
  cachedTickers = await testCache.getData()
  res.render("indexedTickers", {cache: cachedTickers})
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
    console.log("messed up with getting id from req.params");
    console.log(e);
  }
  // fetch basic company data for "theader" here
  //
  // --

  // format basic company data to be ready for display

  // package basic company data into an object
  let outstanding, cash, filingLinks, cashBurnInfo;
  let shelfs, securitiesOutstanding
  try {
    cash = await readNetCashAndEquivalents(dilution_db, id);
    for (let key in cash){
        formattedDate = utils.formatStringToOnlyDate(cash[key]["instant"])
        cash[key]["instant"] = formattedDate
      }
    // format the date to a more human readable form
  } catch (e) {
    console.log("messed up getting the cash position from db");
    console.log(e);
  }
  try {
    outstanding = await readOutstandingSecurities(dilution_db, id);
    // format the date to a more human readable form
    for (let idx in outstanding){
      outstanding[idx]["instant"] = utils.formatStringToOnlyDate(outstanding[idx]["instant"])
    }
  } catch (e) {
    console.log("messed up getting OShares:");
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
    console.log("messed up getting filingLinks:")
    console.log(e)
  }
  
  try{
    cashBurnInfo = await readBurnRateSummary(dilution_db, id)
    cashBurnInfo["cash_missing"] = utils.formatNumber((cashBurnInfo["days_of_cash"])*cashBurnInfo["burn_rate"])
    cashBurnInfo["burn_rate"] = utils.formatNumber(cashBurnInfo["burn_rate"].toFixed(0))
    cashBurnInfo["burn_rate_date"] = utils.formatStringToOnlyDate(cashBurnInfo["burn_rate_date"])
    cashBurnInfo["net_cash_date"] = utils.formatStringToOnlyDate(cashBurnInfo["net_cash_date"])
    cashBurnInfo["net_cash"] = utils.formatNumber(cashBurnInfo["net_cash"])
    
    // console.log(cashBurnInfo)
  } catch (e) {
    console.log("messed up getting cashBurnSummary:");
    console.log(e);
  }

  try{
    // how would i put this into a defered script and be able to render items of the object in pug?
    shelfs = await getShelfTabContent(dilution_db, id)
  } catch(e) {console.log("messed up getting shelfs:"); console.log(e)}
  
  try{
    securitiesOutstanding = await getSecurityOutstandingTabContent(dilution_db, id)
  } catch(e) {console.log("messed up getting securitiesOutstanding:"); console.log(e)}
  doc = res.render("ticker", {
    company_info: company,
    outstandingShares: outstanding,
    cashPosition: cash,
    cashBurnInfo: cashBurnInfo,
    filings: filingLinks,
    securitiesOutstanding: securitiesOutstanding,
    shelfsTabContent: shelfs,
  });
  //   let p = document.createElement("p")
  //   p.append("THIS IS ADDED TO THE DOC")
  //   document.getElementById("dilution").append(p)
});

module.exports = router;
