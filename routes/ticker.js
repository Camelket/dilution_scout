const express = require("express");
const router = express.Router();
const utils = require("../public/scripts/utils.js")
// make calls to db to get the info
    // and feed info into render call
    // OR
    // render basic template then have async functions
    // in the template fetch data which takes to long to fetch
    // OR
    // a combination of the above
const fakecache = {"HYMC": 1, "MSFT": 2}

const fakeCompany = {
    "ticker": "HYMC",
    "name": "Hycroft Mining Holding",
    "sector": "Materials",
    "industry": "Metals and Mining",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "mktcap": utils.formatNumber(137300000),
    "float": utils.formatNumber(3212000)}


router.get("/search/ticker", async function (req, res, next) {
    const {tickerSearchInput} = req.query
    if (tickerSearchInput == "") {
        // add redirect to previous page
        res.redirect("/")
    }
    if (tickerSearchInput.toUpperCase() in fakecache) {
        url = "/ticker/" + fakecache[tickerSearchInput.toUpperCase()]
        res.redirect(url)
    }
    else{
        return
    }
})
router.get("/ticker/:id", function(req, res, next) {
    console.log("HERE I AM ")
    console.log(`${req.params}`)
    // fetch basic company data for "theader" here
    // 
    // --

    // format basic company data to be ready for display
    

    // package basic company data into an object

    res.render("ticker", {"company_info": fakeCompany})
})

module.exports = router