const express = require('express');
const router = express.Router();
const {
  getCodingProblems,
  getCodingProblemById,
  submitCodingSolution,
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
} = require('../controllers/codingController');
const { protect, authorize } = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router
  .route('/')
  .get(optionalAuth, getCodingProblems)
  .post(protect, authorize('admin'), createCodingProblem);

router.post('/submit', protect, submitCodingSolution);

router
  .route('/:id')
  .get(optionalAuth, getCodingProblemById)
  .put(protect, authorize('admin'), updateCodingProblem)
  .delete(protect, authorize('admin'), deleteCodingProblem);

module.exports = router;
