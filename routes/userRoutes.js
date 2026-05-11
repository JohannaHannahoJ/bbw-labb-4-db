// Routes för att skapa användare och logga in

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const client = require("../db");
const jwt = require("jsonwebtoken");

// routes
// Lägg till användare
router.post("/register", async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ message: "Fyll i användarnamn och lösenord" });
        }

        // Kontrollera att användarnamnet är minst 4 tecken
        if (username.length < 4) {
            return res.status(400).json({
                message: "Användarnamnet måste vara minst 4 tecken."
            });
        }

        // Kontrollera att lösenordet är minst 8 tecken
        if (password.length < 8) {
            return res.status(400).json({ message: "Lösenordet måste vara minst 8 tecken." })
        }

        // kolla om user finns
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        );

        // om användare med samma namn finns, kryptiskt felmeddelande
        if (result.rows.length > 0) {
            return res.status(409).json({ message: "Registreringen misslyckades" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // skapa user
        await client.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashedPassword]
        );

        res.status(201).json({ message: "Användare skapad" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

// Logga in användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // validera input
        if (!username || !password) {
            return res.status(400).json({ message: "Fyll i användarnamn och lösenord" });
        }

        // hämta user
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        );

        // om användare inte finns
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
        }

        // spara matchande användaren från db
        const user = result.rows[0];

        // jämför inmatat lösenord med hashat lösenord från db
        const passwordMatch = await bcrypt.compare(password, user.password);

        // om password inte stämmer, felmeddelande och hoppa ur funktionen
        if (!passwordMatch) {
            return res.status(401).json({ message: "Fel användarnamn eller lösenord" });
        }

        // skapa payload
        const payload = { id: user.id };

        // skapa en JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // korrekt login meddelande
        res.status(200).json({ message: "Lyckad inloggning!", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
});

module.exports = router;