const express = require("express");
const router = express.Router();
const path = require("path")


router.get("/privacy_policy", function(req, res, next){
    res.sendFile(path.resolve("./public/legalese/privacy_policy.htm"));
})

router.get("/toc", function(req, res, next) {
    res.sendFile(path.resolve("./public/legalese/terms_and_conditions.htm"));
})


module.exports = router;