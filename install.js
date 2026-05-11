const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function install() {
    try {
        await client.connect();
        console.log("Ansluten till Render Postgres");

        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS entries (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;

        await client.query(sql);
        console.log("Tabeller skapade"); // om lyckade tabeller

    } catch (error) {
        console.error(error); // logga ev fel

    } finally {
        await client.end(); // stäng databasen
    }
}

// anropa funktionen
install();