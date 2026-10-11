const Roadmap = require('../models/Roadmap');
const { generatePersonalizedRoadmap } = require('../services/roadmapEngine');

exports.getUserRoadmap = async (req, res, next) => {
  try {
    let roadmap = await Roadmap.findOne({ user: req.user.id })
      .populate('targetWeakAreas.topic')
      .populate('recommendedTopics.topic');

    if (!roadmap) {
      roadmap = await generatePersonalizedRoadmap(req.user.id);
      roadmap = await Roadmap.findById(roadmap._id)
        .populate('targetWeakAreas.topic')
        .populate('recommendedTopics.topic');
    }

    res.status(200).json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};

exports.recalculateRoadmap = async (req, res, next) => {
  try {
    const roadmap = await generatePersonalizedRoadmap(req.user.id);
    const populated = await Roadmap.findById(roadmap._id)
      .populate('targetWeakAreas.topic')
      .populate('recommendedTopics.topic');

    res.status(200).json({
      success: true,
      data: populated,
      message: 'Roadmap recalculated based on latest performance metrics',
    });
  } catch (error) {
    next(error);
  }
};
