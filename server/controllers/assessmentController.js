const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const { checkAchievements } = require('../services/achievementEngine');
const { generatePersonalizedRoadmap } = require('../services/roadmapEngine');

exports.getAssessments = async (req, res, next) => {
  try {
    const { categoryId, difficulty } = req.query;
    let query = { isPublished: true };

    if (categoryId) query.category = categoryId;
    if (difficulty) query.difficulty = difficulty;

    const assessments = await Assessment.find(query)
      .populate('category', 'name')
      .populate('questions', 'difficulty');

    // Attach student previous result summary
    let resultsMap = {};
    if (req.user) {
      const results = await AssessmentResult.find({ user: req.user.id });
      results.forEach((r) => {
        resultsMap[r.assessment.toString()] = r;
      });
    }

    const data = assessments.map((a) => {
      const prevResult = resultsMap[a._id.toString()];
      return {
        ...a.toObject(),
        questionCount: a.questions ? a.questions.length : 0,
        lastResult: prevResult
          ? {
              score: prevResult.score,
              percentage: prevResult.percentage,
              passed: prevResult.passed,
              takenAt: prevResult.createdAt,
            }
          : null,
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('category', 'name')
      .populate({
        path: 'questions',
        select: '-correctOptionIndex -explanation', // Hide correct options during exam
        populate: { path: 'topic', select: 'title' },
      });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};

exports.submitAssessment = async (req, res, next) => {
  try {
    const { assessmentId, answers, timeTakenSeconds } = req.body;
    // answers format: [{ questionId, selectedOption }]

    const assessment = await Assessment.findById(assessmentId).populate({
      path: 'questions',
      populate: { path: 'topic', select: 'title' },
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const userAnswersMap = {};
    (answers || []).forEach((ans) => {
      userAnswersMap[ans.questionId] = ans.selectedOption;
    });

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const topicStats = {}; // { topicId: { title, total, correct } }
    const userAnswersResult = [];

    assessment.questions.forEach((q) => {
      const selected = userAnswersMap[q._id.toString()];
      const topicId = q.topic ? q.topic._id.toString() : 'general';
      const topicTitle = q.topic ? q.topic.title : 'General';

      if (!topicStats[topicId]) {
        topicStats[topicId] = { topicId: q.topic ? q.topic._id : null, topicTitle, total: 0, correct: 0 };
      }
      topicStats[topicId].total += 1;

      if (selected === undefined || selected === null) {
        unansweredCount += 1;
        userAnswersResult.push({
          questionId: q._id,
          selectedOption: null,
          isCorrect: false,
        });
      } else if (Number(selected) === q.correctOptionIndex) {
        correctCount += 1;
        topicStats[topicId].correct += 1;
        userAnswersResult.push({
          questionId: q._id,
          selectedOption: Number(selected),
          isCorrect: true,
        });
      } else {
        incorrectCount += 1;
        userAnswersResult.push({
          questionId: q._id,
          selectedOption: Number(selected),
          isCorrect: false,
        });
      }
    });

    const totalQuestions = assessment.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = Math.round((percentage / 100) * assessment.totalMarks);
    const passed = percentage >= assessment.passingPercentage;

    const topicBreakdown = Object.values(topicStats).map((ts) => ({
      topicId: ts.topicId,
      topicTitle: ts.topicTitle,
      total: ts.total,
      correct: ts.correct,
      percentage: ts.total > 0 ? Math.round((ts.correct / ts.total) * 100) : 0,
    }));

    // Save Assessment Result
    const resultDoc = await AssessmentResult.create({
      user: req.user.id,
      assessment: assessment._id,
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      percentage,
      passed,
      timeTakenSeconds: timeTakenSeconds || 0,
      topicBreakdown,
      userAnswers: userAnswersResult,
    });

    // Check Achievements
    const totalAssessmentsCount = await AssessmentResult.countDocuments({ user: req.user.id });
    let unlockedAchievements = await checkAchievements(
      req.user.id,
      'ASSESSMENT_COMPLETE',
      totalAssessmentsCount
    );

    if (percentage === 100) {
      const perfectScoreAchievements = await checkAchievements(req.user.id, 'PERFECT_SCORE', 1);
      unlockedAchievements = [...unlockedAchievements, ...perfectScoreAchievements];
    }

    // Recalculate dynamic roadmap immediately!
    const updatedRoadmap = await generatePersonalizedRoadmap(req.user.id);

    res.status(200).json({
      success: true,
      data: resultDoc,
      roadmap: updatedRoadmap,
      unlockedAchievements,
      message: passed
        ? 'Assessment completed successfully! Great job!'
        : 'Assessment completed. Review your weak areas in the personalized roadmap.',
    });
  } catch (error) {
    next(error);
  }
};

exports.getResultById = async (req, res, next) => {
  try {
    const result = await AssessmentResult.findById(req.params.id)
      .populate({
        path: 'assessment',
        select: 'title category difficulty totalMarks passingPercentage',
      })
      .populate({
        path: 'userAnswers.questionId',
        select: 'questionText options correctOptionIndex explanation topic category',
      });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Assessment result not found' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.createAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json({ success: true, data: assessment, message: 'Assessment created' });
  } catch (error) {
    next(error);
  }
};

exports.updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.status(200).json({ success: true, data: assessment, message: 'Assessment updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });
    res.status(200).json({ success: true, data: {}, message: 'Assessment deleted' });
  } catch (error) {
    next(error);
  }
};
