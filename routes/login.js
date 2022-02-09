const express = require("express");
const router = express.Router();
const controller = require("../controllers/loginController");

router.get("/", function(req, res, next){
	controller();
	res.render("login", {title: "Login"});
});

module.exports = router;