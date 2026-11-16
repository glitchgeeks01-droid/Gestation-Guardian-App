const collectionRepo = require('../repositories/CollectionRepository');

const MAX_BATCH_SIZE = 200;

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
        if (!Array.isArray(operations)) {
            throw new Error('Operations must be an array');
        }

        if (operations.length > MAX_BATCH_SIZE) {
            throw new Error(`Batch size exceeds maximum limit of ${MAX_BATCH_SIZE} operations`);
        }

        if (operations.length === 0) {
            return [];
        }

        const results = new Array(operations.length);
        const validOps = [];
        const validIndices = [];

        for (let i = 0; i < operations.length; i++) {
            const op = operations[i];
            const key = op ? (op.key || op.collectionKey) : undefined;

            if (!op || typeof op !== 'object') {
                results[i] = {
                    key: undefined,
                    status: 'error',
                    error: 'Operation must be an object'
                };
                continue;
            }

            if (!op.userId) {
                results[i] = {
                    key,
                    status: 'error',
                    error: 'Missing required field: userId'
                };
                continue;
            }

            if (!key) {
                results[i] = {
                    key,
                    status: 'error',
                    error: 'Missing required field: key'
                };
                continue;
            }

            if (op.data === undefined) {
                results[i] = {
                    key,
                    status: 'error',
                    error: 'Missing required field: data'
                };
                continue;
            }

            validOps.push({
                userId: op.userId,
                key,
                data: op.data
            });
            validIndices.push(i);
        }

        if (validOps.length > 0) {
            try {
                await collectionRepo.upsertBatch(validOps);
                for (let j = 0; j < validOps.length; j++) {
                    const idx = validIndices[j];
                    results[idx] = {
                        key: validOps[j].key,
                        status: 'success'
                    };
                }
            } catch (err) {
                console.error('Sync queue batch processing failed', err);
                for (let j = 0; j < validOps.length; j++) {
                    const idx = validIndices[j];
                    results[idx] = {
                        key: validOps[j].key,
                        status: 'error',
                        error: err.message
                    };
                }
            }
        }

        return results;
    }
}

SyncService.MAX_BATCH_SIZE = MAX_BATCH_SIZE;

module.exports = new SyncService();
