// Middleware för att verifiera JWT-token

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; // Hämta token
    const token = authHeader && authHeader.split(' ')[1]; // plocka ut själva tokenet, ta bort bearer och mellanslag

    if (!token) {
        return res.status(401).json({ message: "You need to send token" });
    }

    // Verifiera om giltig genom att skicka in token och hemlig nyckel i funktionen
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid JWT-token" });
        }

        req.user = user; // skicka med användare i requesten
        next(); // fortsätt med ursprungsprocessen
    });
}

module.exports = authenticateToken;