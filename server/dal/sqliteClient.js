
const sqlite3 = require('sqlite3').verbose();
const config = require('../config/db');

const db = new sqlite3.Database(config.dbPath, (err) => {
    if (err) console.error('Error opening database', err);
    else {
        db.run(`
            CREATE TABLE IF NOT EXISTS UserCollections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                collectionKey TEXT NOT NULL,
                data TEXT NOT NULL,
                lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(userId, collectionKey)
            )
        `);
    }
});

module.exports = db;
