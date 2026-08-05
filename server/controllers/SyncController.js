
const syncService = require('../services/SyncService');

class SyncController {
    async getCollection(req, res) {
        try {
            const data = await syncService.getCollection(req.params.userId, req.params.key);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateCollection(req, res) {
        try {
            await syncService.updateCollection(req.params.userId, req.params.key, req.body);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async syncQueue(req, res) {
        try {
            const results = await syncService.processSyncQueue(req.body);
            res.json({ success: true, results });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = new SyncController();
