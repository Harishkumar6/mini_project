const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    completedTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    completedMaterials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    totalQuestionsAttempted: {
      type: Number,
      default: 0,
    },
    totalQuestionsCorrect: {
      type: Number,
      default: 0,
    },
    totalCodingSolved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', ProgressSchema);
