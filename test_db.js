const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testDb() {
    try {
        await client.connect();
        console.log("Ansluten till Render Postgres");

        // Skriv ut användartabell
        const users = await client.query("SELECT * FROM users");
        console.log("Users:");
        console.table(users.rows);

        // Skriv ut inläggstabell
        const entries = await client.query("SELECT * FROM entries");
        console.log("Entries:");
        console.table(entries.rows);

    } catch (error) {
        console.error(error);

    } finally {
        await client.end(); // Stäng db
    }
}

// Anropa funktionen
testDb();