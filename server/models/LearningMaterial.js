const mongoose = require('mongoose');

const LearningMaterialSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      unique: true,
    },
    overview: {
      type: String,
      required: true,
    },
    keyConcepts: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    formulas: [
      {
        title: String,
        formula: String,
        explanation: String,
      },
    ],
    solvedExamples: [
      {
        question: { type: String, required: true },
        solution: { type: String, required: true },
        explanation: { type: String, required: true },
      },
    ],
    summary: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningMaterial', LearningMaterialSchema);
