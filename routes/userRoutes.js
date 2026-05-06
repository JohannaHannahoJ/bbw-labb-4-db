// Routes för att skapa användare och logga in

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const client = require("../db");

// routes
// Lägg till användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input" });
        }

        // kolla om user finns
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        );

        // om användare med samma namn finns, kryptiskt felmeddelande
        if (result.rows.length > 0) {
            return res.status(409).json({ error: "Registration failed" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // skapa user
        await client.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashedPassword]
        );

        res.status(201).json({ message: "User created" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Logga in användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        // hämta user
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        );

        // om användare inte finns
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Incorrect username/password" });
        }

        // spara matchande användaren från db
        const user = result.rows[0];

        // jämför inmatat lösenord med hashat lösenord från db
        const passwordMatch = await bcrypt.compare(password, user.password);

        // om password inte stämmer, felmeddelande och hoppa ur funktionen
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect username/password" });
        }

        // korrekt login
        res.status(200).json({ message: "Correct login!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;