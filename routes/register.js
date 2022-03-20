const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

const db = require("../database/users_db/database_connection.js");

router.get("/register")