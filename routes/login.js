const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next){
	res.send("<main><button id='b1'> increment </button> <button id='b2'> decrement </button>  <p id='counter'>no inital value<p/></main> <script src=./loginController.js> console.log('loading loginController...') </script> ");
});

module.exports = router