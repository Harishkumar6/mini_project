const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  markTopicCompleted,
} = require('../controllers/topicController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth for getTopics/getTopicById to read user completion state
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router
  .route('/')
  .get(optionalAuth, getTopics)
  .post(protect, authorize('admin'), createTopic);

router
  .route('/:id')
  .get(optionalAuth, getTopicById)
  .put(protect, authorize('admin'), updateTopic)
  .delete(protect, authorize('admin'), deleteTopic);

router.post('/:id/complete', protect, markTopicCompleted);

module.exports = router;
