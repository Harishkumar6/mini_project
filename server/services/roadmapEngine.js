const Roadmap = require('../models/Roadmap');
const AssessmentResult = require('../models/AssessmentResult');
const PracticeAttempt = require('../models/PracticeAttempt');
const Progress = require('../models/Progress');
const Topic = require('../models/Topic');
const Category = require('../models/Category');

/**
 * Generate or Update Personalized Learning Roadmap for a user based on real metrics
 * @param {ObjectId} userId 
 */
exports.generatePersonalizedRoadmap = async (userId) => {
  try {
    // 1. Fetch user progress
    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = await Progress.create({ user: userId });
    }

    // 2. Fetch all categories and topics
    const categories = await Category.find().sort({ order: 1 });
    const allTopics = await Topic.find().populate('category').sort({ order: 1 });

    // 3. Fetch assessment results
    const assessmentResults = await AssessmentResult.find({ user: userId }).sort({ createdAt: -1 });

    // 4. Fetch practice attempts
    const practiceAttempts = await PracticeAttempt.find({ user: userId });

    // Calculate topic performance map
    // { topicId: { total: N, correct: N, percentage: N } }
    const topicStats = {};

    assessmentResults.forEach((res) => {
      if (res.topicBreakdown && res.topicBreakdown.length > 0) {
        res.topicBreakdown.forEach((tb) => {
          if (!tb.topicId) return;
          const tid = tb.topicId.toString();
          if (!topicStats[tid]) {
            topicStats[tid] = { total: 0, correct: 0, attempts: 0 };
          }
          topicStats[tid].total += tb.total;
          topicStats[tid].correct += tb.correct;
          topicStats[tid].attempts += 1;
        });
      }
    });

    // Also factor in practice attempts
    practiceAttempts.forEach((pa) => {
      const tid = pa.topic ? pa.topic.toString() : null;
      if (tid) {
        if (!topicStats[tid]) {
          topicStats[tid] = { total: 0, correct: 0, attempts: 0 };
        }
        topicStats[tid].total += 1;
        if (pa.isCorrect) topicStats[tid].correct += 1;
      }
    });

    const targetWeakAreas = [];
    const recommendedTopics = [];
    const completedTopicIds = progress.completedTopics.map((id) => id.toString());

    // Evaluate each topic
    for (const topic of allTopics) {
      const tid = topic._id.toString();
      const stats = topicStats[tid];
      const categoryName = topic.category ? topic.category.name : 'General';
      const isCompleted = completedTopicIds.includes(tid);

      if (stats && stats.total > 0) {
        const scorePct = Math.round((stats.correct / stats.total) * 100);

        if (scorePct < 50) {
          // Low score => High Priority Weak Area
          targetWeakAreas.push({
            topic: topic._id,
            categoryTitle: categoryName,
            topicTitle: topic.title,
            reason: `Your recent performance in ${topic.title} is ${scorePct}%, which is below the 50% target.`,
            priority: 'HIGH',
            currentScore: scorePct,
          });

          recommendedTopics.push({
            topic: topic._id,
            categoryTitle: categoryName,
            topicTitle: topic.title,
            reason: `Focus on fundamental concepts and solved examples in ${topic.title} to improve your mastery.`,
            priority: 'HIGH',
            status: isCompleted ? 'Completed' : 'Pending',
            recommendedAction: 'Practice Questions & Revise Material',
          });
        } else if (scorePct < 75) {
          // Medium score => Medium Priority Recommendation
          recommendedTopics.push({
            topic: topic._id,
            categoryTitle: categoryName,
            topicTitle: topic.title,
            reason: `Your score is ${scorePct}%. Solving 5-10 additional practice questions will cement your confidence.`,
            priority: 'MEDIUM',
            status: isCompleted ? 'Completed' : 'In Progress',
            recommendedAction: 'Solve Practice Set',
          });
        }
      } else if (!isCompleted) {
        // Topic not attempted or completed yet
        recommendedTopics.push({
          topic: topic._id,
          categoryTitle: categoryName,
          topicTitle: topic.title,
          reason: `Core placement topic in ${categoryName}. Complete reading materials and preliminary practice.`,
          priority: recommendedTopics.length === 0 ? 'HIGH' : 'LOW',
          status: 'Pending',
          recommendedAction: 'Start Learning Material',
        });
      }
    }

    // Determine current Stage
    let stage = 'Placement Fundamentals';
    const totalTopicsCount = allTopics.length;
    const completedCount = completedTopicIds.length;
    const completionPercentage = totalTopicsCount > 0 ? (completedCount / totalTopicsCount) * 100 : 0;

    if (completionPercentage > 75) {
      stage = 'Advanced Placement Preparation & Mock Assessments';
    } else if (completionPercentage > 35) {
      stage = 'Intermediate Problem Solving & Assessment Mastery';
    }

    // Update or create Roadmap doc
    let roadmap = await Roadmap.findOne({ user: userId });

    if (!roadmap) {
      roadmap = new Roadmap({ user: userId });
    }

    roadmap.stage = stage;
    roadmap.targetWeakAreas = targetWeakAreas.slice(0, 5); // top 5 weak areas
    roadmap.recommendedTopics = recommendedTopics.slice(0, 6); // top 6 recommended topics
    roadmap.lastCalculatedAt = new Date();

    await roadmap.save();

    return roadmap;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw error;
  }
};
