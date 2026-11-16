const express = require('express');
const router = express.Router();
const syncController = require('../controllers/SyncController');

const SYNC_TOKEN = process.env.GG_SYNC_TOKEN || 'gg-sync-internal-token-2026';

// Token authentication middleware
const syncTokenAuth = (req, res, next) => {
    const token = req.headers['x-gg-sync-token'];
    if (!token || token !== SYNC_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid X-GG-Sync-Token' });
    }
    next();
};

router.use(syncTokenAuth);

router.get('/users/:userId/collections/:key', (req, res) => syncController.getCollection(req, res));
router.post('/users/:userId/collections/:key', (req, res) => syncController.updateCollection(req, res));
router.post('/sync', (req, res) => syncController.syncQueue(req, res));

module.exports = router;
