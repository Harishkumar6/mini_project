const express = require('express');
const router = express.Router();
const { getUserAnalytics, getLandingStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserAnalytics);
router.get('/landing-stats', getLandingStats);

module.exports = router;
