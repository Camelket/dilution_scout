const express = require("express");
const router = express.Router();
// make calls to db to get the info
    // and feed info into render call
    // OR
    // render basic template then have async functions
    // in the template fetch data which takes to long to fetch
    // OR
    // a combination of the above
const fakecache = {"AAPL": 1, "MSFT": 2}


router.get("/search/ticker", async function (req, res, next) {
    const {tickerSearchInput} = req.query
    if (tickerSearchInput == "") {
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
    res.render("ticker")
})

module.exports = router