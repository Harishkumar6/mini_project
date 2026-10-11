const Question = require('../models/Question');
const PracticeAttempt = require('../models/PracticeAttempt');
const Progress = require('../models/Progress');
const { checkAchievements } = require('../services/achievementEngine');
const { generatePersonalizedRoadmap } = require('../services/roadmapEngine');

exports.getQuestions = async (req, res, next) => {
  try {
    const { categoryId, topicId, difficulty } = req.query;
    let query = { isAssessmentOnly: false };

    if (categoryId) query.category = categoryId;
    if (topicId) query.topic = topicId;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .populate('category', 'name')
      .populate('topic', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('category', 'name')
      .populate('topic', 'title');

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.submitPracticeAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const isCorrect = question.correctOptionIndex === Number(selectedOption);

    // Record practice attempt
    await PracticeAttempt.create({
      user: req.user.id,
      question: question._id,
      topic: question.topic,
      category: question.category,
      selectedOption,
      isCorrect,
    });

    // Update progress
    let progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      progress = await Progress.create({ user: req.user.id });
    }

    progress.totalQuestionsAttempted += 1;
    if (isCorrect) {
      progress.totalQuestionsCorrect += 1;
    }
    await progress.save();

    // Check achievement trigger for practice attempt count
    const unlockedAchievements = await checkAchievements(
      req.user.id,
      'PRACTICE_COUNT',
      progress.totalQuestionsAttempted
    );

    // Trigger roadmap recalculation asynchronously or inline
    await generatePersonalizedRoadmap(req.user.id);

    res.status(200).json({
      success: true,
      isCorrect,
      correctOptionIndex: question.correctOptionIndex,
      explanation: question.explanation,
      unlockedAchievements,
    });
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question, message: 'Question created' });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.status(200).json({ success: true, data: question, message: 'Question updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.status(200).json({ success: true, data: {}, message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};
