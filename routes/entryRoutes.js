// Routes för att skapa, läsa, uppdatera och radera inlägg

const express = require("express");
const router = express.Router();
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");

// skyddade routes
// hämta användarens dagboksinlägg
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;// användar-id från autentiserad token

        const result = await client.query(
            "SELECT * FROM entries WHERE user_id = $1 ORDER BY created_at DESC", [userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Lägg till nytt dagboksinlägg
router.post("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        await client.query(
            "INSERT INTO entries (content, user_id) VALUES ($1, $2)", [content, userId]
        );

        res.status(201).json({ message: "Entry created" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;