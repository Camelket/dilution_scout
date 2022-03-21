const express = require("express");
const router = express.Router();

const landingPanel = {"src": "\backgrounds\cardboard-tetris.jpg",
                      "title_text": "Welcome to DilutionScout!",
                      "description": "Free and transparant dilution tracking."}
const contentPanel = [{"id_text": "cp1",
                        "title": "TITLE",
                        "text": "TEXT",
                        "id_image": "cp1img",
                        "image_src": "\backgrounds\abstract-light-circle.jpg"}]

router.get("/landing", function(req, res, next) {
    res.render("landing", {"content_panels": contentPanel, "landing_panel": landingPanel})
})

module.exports = router