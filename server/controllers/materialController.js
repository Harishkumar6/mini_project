const LearningMaterial = require('../models/LearningMaterial');
const Topic = require('../models/Topic');

exports.getMaterialByTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const material = await LearningMaterial.findOne({ topic: topicId }).populate('topic');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'No learning material available for this topic yet.',
      });
    }

    res.status(200).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

exports.upsertMaterial = async (req, res, next) => {
  try {
    const { topic, overview, keyConcepts, formulas, solvedExamples, summary } = req.body;

    let material = await LearningMaterial.findOne({ topic });

    if (material) {
      material.overview = overview || material.overview;
      material.keyConcepts = keyConcepts || material.keyConcepts;
      material.formulas = formulas || material.formulas;
      material.solvedExamples = solvedExamples || material.solvedExamples;
      material.summary = summary || material.summary;
      await material.save();
    } else {
      material = await LearningMaterial.create({
        topic,
        overview,
        keyConcepts,
        formulas,
        solvedExamples,
        summary,
      });
    }

    res.status(200).json({
      success: true,
      data: material,
      message: 'Learning material saved successfully',
    });
  } catch (error) {
    next(error);
  }
};
