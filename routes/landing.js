const express = require("express");
const router = express.Router();

const landingPanel = {"src": "C:\Users\Olivi\OneDrive\Github_Projects\dilution_scout\resources\backgrounds\cardboard-tetris.jpg",
                      "title_text": "Welcome to DilutionScout!",
                      "description": "Free and transparant dilution tracking."}
const contentPanel = [{"id_text": "cp1", "title": "TITLE", "text": "TEXT", "id_image": "cp1img", "image_src": "C:\Users\Olivi\OneDrive\Github_Projects\dilution_scout\resources\backgrounds\abstract-light-circle.jpg"}]

router.use("/landing", function(req, res, next) {
    res.render("landing")
})