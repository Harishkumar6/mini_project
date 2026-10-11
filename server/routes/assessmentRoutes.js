const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  getResultById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router
  .route('/')
  .get(optionalAuth, getAssessments)
  .post(protect, authorize('admin'), createAssessment);

router.post('/submit', protect, submitAssessment);
router.get('/result/:id', protect, getResultById);

router
  .route('/:id')
  .get(protect, getAssessmentById)
  .put(protect, authorize('admin'), updateAssessment)
  .delete(protect, authorize('admin'), deleteAssessment);

module.exports = router;
