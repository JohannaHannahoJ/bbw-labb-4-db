// Inställningar för att ansluta till databasen

const { Client } = require("pg");
require("dotenv").config();

// Inställningar för att ansluta till databasen
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect((err) => {
    if (err) {
        console.log("Connection error: " + err);
    } else {
        console.log("Connected to database.")
    }
});

module.exports = client;