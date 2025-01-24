require('dotenv').config();
const { Pool } = require('pg');

// Credits pre db sa nachadzajuce v env file z bezpecnostnych dovodov
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Vytvorenie tabuľky offers
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS offers (
        id VARCHAR(32) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        offers TEXT NOT NULL,
        wants TEXT NOT NULL,
        location VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`; // Ak toto citate rozhodol som sa este pridat email & phone, snad to nevadi :)

pool.query(createTableQuery)
    .then(() => console.log('Table offers created successfully!'))
    .catch(err => console.error('Error while creating offers table!', err));

module.exports = {
    query: (text, params) => pool.query(text, params),
};
