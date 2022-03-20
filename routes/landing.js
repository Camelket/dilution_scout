const express = require("express");
const router = express.Router();

router.use("/landing", function(req, res, next) {
    res.render("landing")
})