const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  submitPracticeAnswer,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getQuestions)
  .post(protect, authorize('admin'), createQuestion);

router.post('/practice/submit', protect, submitPracticeAnswer);

router
  .route('/:id')
  .get(getQuestionById)
  .put(protect, authorize('admin'), updateQuestion)
  .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;
