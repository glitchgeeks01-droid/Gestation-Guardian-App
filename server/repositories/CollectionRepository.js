
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

    async upsertBatch(operations) {
        return new Promise((resolve, reject) => {
            if (!operations || operations.length === 0) {
                return resolve([]);
            }

            db.serialize(() => {
                db.run('BEGIN TRANSACTION;', (beginErr) => {
                    if (beginErr) return reject(beginErr);

                    let hasError = false;
                    let firstError = null;

                    const stmt = db.prepare(`
                        INSERT INTO UserCollections (userId, collectionKey, data, lastUpdated)
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                        ON CONFLICT(userId, collectionKey) DO UPDATE SET
                        data = excluded.data,
                        lastUpdated = CURRENT_TIMESTAMP
                    `, (prepErr) => {
                        if (prepErr) {
                            hasError = true;
                            firstError = prepErr;
                        }
                    });

                    try {
                        for (const op of operations) {
                            if (!op) {
                                hasError = true;
                                firstError = new Error('Invalid operation: operation is null or undefined');
                                break;
                            }
                            const userId = op.userId || null;
                            const key = op.key || op.collectionKey || null;
                            const dataStr = op.data !== undefined 
                                ? (typeof op.data === 'string' ? op.data : JSON.stringify(op.data)) 
                                : null;

                            stmt.run([userId, key, dataStr], (runErr) => {
                                if (runErr && !hasError) {
                                    hasError = true;
                                    firstError = runErr;
                                }
                            });
                        }
                    } catch (syncErr) {
                        hasError = true;
                        firstError = syncErr;
                    }

                    stmt.finalize((finalizeErr) => {
                        if (hasError || finalizeErr) {
                            const error = firstError || finalizeErr;
                            db.run('ROLLBACK;', () => reject(error));
                        } else {
                            db.run('COMMIT;', (commitErr) => {
                                if (commitErr) {
                                    db.run('ROLLBACK;', () => reject(commitErr));
                                } else {
                                    resolve(operations);
                                }
                            });
                        }
                    });
                });
            });
        });
    }
}

module.exports = new CollectionRepository();
