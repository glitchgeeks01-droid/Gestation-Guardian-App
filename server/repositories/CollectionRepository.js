
const db = require('../dal/sqliteClient');

class CollectionRepository {
    async getCollection(userId, key) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT data FROM UserCollections WHERE userId = ? AND collectionKey = ?`,
                [userId, key],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.data : null);
                }
            );
        });
    }

    async upsertCollection(userId, key, dataStr) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO UserCollections (userId, collectionKey, data, lastUpdated)
                 VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(userId, collectionKey) DO UPDATE SET
                 data = excluded.data,
                 lastUpdated = CURRENT_TIMESTAMP`,
                [userId, key, dataStr],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }
}
module.exports = new CollectionRepository();
