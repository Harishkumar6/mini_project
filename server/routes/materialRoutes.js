const express = require('express');
const router = express.Router();
const { getMaterialByTopic, upsertMaterial } = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');

router.get('/topic/:topicId', getMaterialByTopic);
router.post('/', protect, authorize('admin'), upsertMaterial);

module.exports = router;
