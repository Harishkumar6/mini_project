const AssessmentResult = require('../models/AssessmentResult');
const PracticeAttempt = require('../models/PracticeAttempt');
const Progress = require('../models/Progress');
const Topic = require('../models/Topic');
const Category = require('../models/Category');
const Question = require('../models/Question');
const CodingProblem = require('../models/CodingProblem');
const User = require('../models/User');

// @desc    Get detailed student analytics
// @route   GET /api/analytics
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Overall progress & count
    const progress = await Progress.findOne({ user: userId });
    const totalTopicsCount = await Topic.countDocuments();
    const completedTopicsCount = progress ? (progress.completedTopics || []).length : 0;
    const overallProgressPct = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

    // 2. Assessment history & line chart data
    const assessmentResults = await AssessmentResult.find({ user: userId })
      .populate('assessment', 'title category difficulty')
      .sort({ createdAt: 1 });

    const assessmentTrend = assessmentResults.map((r) => ({
      title: r.assessment ? r.assessment.title : 'Assessment',
      percentage: r.percentage,
      score: r.score,
      date: r.createdAt.toLocaleDateString(),
    }));

    // 3. Category scores (Bar chart data)
    const categories = await Category.find();
    const categoryScores = [];

    for (const cat of categories) {
      // Find all practice attempts in this category
      const attempts = await PracticeAttempt.find({ user: userId, category: cat._id });
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((a) => a.isCorrect).length;

      // Find assessment scores in this category
      let assessmentPctSum = 0;
      let assessmentCount = 0;

      assessmentResults.forEach((ar) => {
        if (ar.assessment && ar.assessment.category && ar.assessment.category.toString() === cat._id.toString()) {
          assessmentPctSum += ar.percentage;
          assessmentCount += 1;
        }
      });

      const practiceScore = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
      const avgAssessmentScore = assessmentCount > 0 ? Math.round(assessmentPctSum / assessmentCount) : 0;
      const combinedScore = assessmentCount > 0 && totalAttempts > 0
        ? Math.round((practiceScore + avgAssessmentScore) / 2)
        : (avgAssessmentScore || practiceScore || 0);

      categoryScores.push({
        categoryName: cat.name,
        score: combinedScore,
        practiceAccuracy: practiceScore,
        assessmentAverage: avgAssessmentScore,
      });
    }

    // 4. Topic performance strengths vs weaknesses
    const topicStatsMap = {};
    assessmentResults.forEach((res) => {
      if (res.topicBreakdown) {
        res.topicBreakdown.forEach((tb) => {
          const tname = tb.topicTitle || 'General Topic';
          if (!topicStatsMap[tname]) topicStatsMap[tname] = { total: 0, correct: 0 };
          topicStatsMap[tname].total += tb.total;
          topicStatsMap[tname].correct += tb.correct;
        });
      }
    });

    const strengths = [];
    const weaknesses = [];

    Object.keys(topicStatsMap).forEach((tname) => {
      const ts = topicStatsMap[tname];
      const pct = ts.total > 0 ? Math.round((ts.correct / ts.total) * 100) : 0;
      if (pct >= 70) {
        strengths.push({ topic: tname, score: pct });
      } else {
        weaknesses.push({ topic: tname, score: pct });
      }
    });

    // 5. Practice Accuracy
    const totalPracticeAttempts = progress ? progress.totalQuestionsAttempted : 0;
    const totalPracticeCorrect = progress ? progress.totalQuestionsCorrect : 0;
    const practiceAccuracy = totalPracticeAttempts > 0 ? Math.round((totalPracticeCorrect / totalPracticeAttempts) * 100) : 0;

    // 6. Coding progress
    const totalCodingCount = await CodingProblem.countDocuments();
    const codingSolvedCount = progress ? (progress.totalCodingSolved || []).length : 0;
    const codingProgressPct = totalCodingCount > 0 ? Math.round((codingSolvedCount / totalCodingCount) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        overallProgressPct,
        completedTopicsCount,
        totalTopicsCount,
        practiceAccuracy,
        totalPracticeAttempts,
        codingSolvedCount,
        totalCodingCount,
        codingProgressPct,
        learningStreak: req.user.streak || 1,
        xp: req.user.xp || 100,
        assessmentTrend,
        categoryScores,
        strengths,
        weaknesses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic landing page statistics
// @route   GET /api/analytics/landing-stats
// @access  Public
exports.getLandingStats = async (req, res, next) => {
  try {
    const practiceQuestions = await Question.countDocuments();
    const codingProblems = await CodingProblem.countDocuments();
    const learningTopics = await Topic.countDocuments();
    const students = await User.countDocuments({ role: 'student' });

    res.status(200).json({
      success: true,
      data: {
        practiceQuestions: practiceQuestions || 150,
        codingProblems: codingProblems || 40,
        learningTopics: learningTopics || 25,
        students: students || 120,
      },
    });
  } catch (error) {
    next(error);
  }
};
