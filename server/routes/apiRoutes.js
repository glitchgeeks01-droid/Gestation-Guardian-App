
const express = require('express');
const router = express.Router();
const syncController = require('../controllers/SyncController');

router.get('/users/:userId/collections/:key', (req, res) => syncController.getCollection(req, res));
router.post('/users/:userId/collections/:key', (req, res) => syncController.updateCollection(req, res));
router.post('/sync', (req, res) => syncController.syncQueue(req, res));

module.exports = router;
