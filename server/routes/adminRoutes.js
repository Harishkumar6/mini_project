const express = require('express');
const router = express.Router();
const { getAdminStats, getStudents, toggleStudentStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/students', getStudents);
router.put('/students/:id/toggle-status', toggleStudentStatus);

module.exports = router;
