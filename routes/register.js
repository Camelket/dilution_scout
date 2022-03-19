const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

const db = require("../database/database_connection.js");

router.get("/register")