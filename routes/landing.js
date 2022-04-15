const express = require("express");
const router = express.Router();

const landingPanel = {
  src: "",
  title_text: "Welcome to DilutionScout!",
  description: "(WIP) Attempting Free and transparant dilution tracking.",
};
const contentPanel = {
  
  "features": {
    "Outstanding Shares": `Tracks outstanding common shares based on
                           10-K and 10-Q filings.`,
    "Cash Position": `net cash and equivalents based on 10-K and 10-Q filings,
                      excluding noncurrent equivalents.`,
    "Filing Links": `Chronological and categorised recent Filings with direct links to the main document`,
    "Cash Burn": `Cash burn (operating) and days to no cash based on 10-K and 10-Q filings 
                  and the Cash Position`,
    "User Accounts": `Working password and email or Google login (only test users).
                      No user features yet, so I hid the login.
                      Can still be accessed under: www.dilutionscout.com/login and www.dilutionscout.com/register`
  }}


router.get("/landing", function (req, res, next) {
  res.render("landing", {
    content_panel: contentPanel,
    landing_panel: landingPanel,
  });
});


module.exports = router;
