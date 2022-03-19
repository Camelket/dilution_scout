const express = require("express")
const router = express.Router()

router.get("/sessionInfo", function(req, res, next) {
	console.log(req.session)
	console.log(req.user)
})

module.exports = router