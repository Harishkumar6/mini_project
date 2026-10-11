const express = require('express');
const router = express.Router();
const { getUserRoadmap, recalculateRoadmap } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserRoadmap);
router.post('/recalculate', protect, recalculateRoadmap);

module.exports = router;
