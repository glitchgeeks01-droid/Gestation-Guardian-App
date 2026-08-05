
const collectionRepo = require('../repositories/CollectionRepository');

class SyncService {
    async getCollection(userId, key) {
        const data = await collectionRepo.getCollection(userId, key);
        return data ? JSON.parse(data) : null;
    }

    async updateCollection(userId, key, dataObj) {
        const dataStr = JSON.stringify(dataObj);
        await collectionRepo.upsertCollection(userId, key, dataStr);
        return { success: true };
    }

    async processSyncQueue(operations) {
        const results = [];
        for (const op of operations) {
            try {
                if (op.userId && op.key && op.data) {
                    await this.updateCollection(op.userId, op.key, op.data);
                    results.push({ key: op.key, status: 'success' });
                }
            } catch (err) {
                console.error(`Sync failed for ${op.key}`, err);
                results.push({ key: op.key, status: 'error', error: err.message });
            }
        }
        return results;
    }
}
module.exports = new SyncService();
