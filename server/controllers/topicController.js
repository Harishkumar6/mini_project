const Topic = require('../models/Topic');
const Progress = require('../models/Progress');
const LearningMaterial = require('../models/LearningMaterial');
const { checkAchievements } = require('../services/achievementEngine');
const { generatePersonalizedRoadmap } = require('../services/roadmapEngine');

exports.getTopics = async (req, res, next) => {
  try {
    const { categoryId, difficulty } = req.query;
    let query = {};
    if (categoryId) query.category = categoryId;
    if (difficulty) query.difficulty = difficulty;

    const topics = await Topic.find(query).populate('category').sort({ order: 1 });
    
    // Attach student completion status if user is authenticated
    let completedTopicIds = [];
    if (req.user) {
      const progress = await Progress.findOne({ user: req.user.id });
      if (progress && progress.completedTopics) {
        completedTopicIds = progress.completedTopics.map((id) => id.toString());
      }
    }

    const topicsWithStatus = topics.map((t) => ({
      ...t.toObject(),
      isCompleted: completedTopicIds.includes(t._id.toString()),
    }));

    res.status(200).json({ success: true, count: topicsWithStatus.length, data: topicsWithStatus });
  } catch (error) {
    next(error);
  }
};

exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('category');
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });

    const material = await LearningMaterial.findOne({ topic: topic._id });

    let isCompleted = false;
    if (req.user) {
      const progress = await Progress.findOne({ user: req.user.id });
      if (progress && progress.completedTopics) {
        isCompleted = progress.completedTopics.includes(topic._id);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...topic.toObject(),
        material: material || null,
        isCompleted,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createTopic = async (req, res, next) => {
  try {
    const { title, category, description, difficulty, estimatedMinutes, order } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const topic = await Topic.create({ title, slug, category, description, difficulty, estimatedMinutes, order });
    res.status(201).json({ success: true, data: topic, message: 'Topic created' });
  } catch (error) {
    next(error);
  }
};

exports.updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.status(200).json({ success: true, data: topic, message: 'Topic updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.status(200).json({ success: true, data: {}, message: 'Topic deleted' });
  } catch (error) {
    next(error);
  }
};

exports.markTopicCompleted = async (req, res, next) => {
  try {
    const topicId = req.params.id;
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = await Progress.create({ user: req.user.id });
    }

    if (!progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId);
      await progress.save();
    }

    // Check achievement trigger for completed topics count
    const unlockedAchievements = await checkAchievements(
      req.user.id,
      'TOPIC_COMPLETE',
      progress.completedTopics.length
    );

    // Update personalized roadmap
    await generatePersonalizedRoadmap(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Topic marked as completed!',
      completedTopicsCount: progress.completedTopics.length,
      unlockedAchievements,
    });
  } catch (error) {
    next(error);
  }
};
