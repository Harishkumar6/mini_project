const express = require('express');
const router = express.Router();
const { getAchievements, createAchievement } = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router
  .route('/')
  .get(optionalAuth, getAchievements)
  .post(protect, authorize('admin'), createAchievement);

module.exports = router;
