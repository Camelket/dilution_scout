const express = require("express");
const router = express.Router();

const landingPanel = {
  src: "/backgrounds/cardboard-tetris.jpg",
  title_text: "Welcome to DilutionScout!",
  description: "(WIP) Attempting Free and transparant dilution tracking.",
};
const contentPanel = {
  
  "features": {
    "Outstanding Shares": `Tracks outstanding common shares based on
                           10-K and 10-Q filings.`,
    "Cash Position": `net cash and equivalents based on 10-K and 10-Q filings,
                      excluding noncurrent equivalents.`,
    "Filing Links": `Chronological and categorised Filings with direct links to the main document`,
    "Cash Burn": `Cash burn and days to no cash base on 10-K and 10-Q filings and the Cash Position`,
    "User Accounts": `Working password and email or Google login. No user features yet`
  }}


router.get("/landing", function (req, res, next) {
  res.render("landing", {
    content_panel: contentPanel,
    landing_panel: landingPanel,
  });
});


module.exports = router;
