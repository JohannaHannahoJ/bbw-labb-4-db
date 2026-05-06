// Routes för att skapa, läsa, uppdatera och radera inlägg

const express = require("express");
const router = express.Router();
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

// routes kommer

module.exports = router;