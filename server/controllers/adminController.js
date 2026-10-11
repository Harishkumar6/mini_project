const User = require('../models/User');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Progress = require('../models/Progress');
const CodingProblem = require('../models/CodingProblem');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTopics = await Topic.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalCodingProblems = await CodingProblem.countDocuments();
    const totalAssessments = await Assessment.countDocuments();

    // Active learners in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeLearners = await User.countDocuments({
      role: 'student',
      lastActiveDate: { $gte: sevenDaysAgo },
    });

    // Average assessment performance
    const results = await AssessmentResult.find();
    let totalScorePct = 0;
    results.forEach((r) => {
      totalScorePct += r.percentage;
    });
    const avgAssessmentPerformance = results.length > 0 ? Math.round(totalScorePct / results.length) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTopics,
        totalQuestions,
        totalCodingProblems,
        totalAssessments,
        activeLearners,
        avgAssessmentPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Students List with search & filter
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getStudents = async (req, res, next) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    let query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) {
      query.department = department;
    }

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Attach student summary progress
    const studentData = await Promise.all(
      students.map(async (st) => {
        const progress = await Progress.findOne({ user: st._id });
        const results = await AssessmentResult.find({ user: st._id });
        let avgScore = 0;
        if (results.length > 0) {
          const sum = results.reduce((acc, r) => acc + r.percentage, 0);
          avgScore = Math.round(sum / results.length);
        }

        return {
          ...st.toObject(),
          completedTopicsCount: progress ? (progress.completedTopics || []).length : 0,
          assessmentsTaken: results.length,
          avgScore,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentData.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: studentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle student active/deactive status
// @route   PUT /api/admin/students/:id/toggle-status
// @access  Private/Admin
exports.toggleStudentStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Student status updated to ${user.isActive ? 'Active' : 'Inactive'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
