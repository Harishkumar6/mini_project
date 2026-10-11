const mongoose = require('mongoose');

const AssessmentResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },
    incorrectCount: {
      type: Number,
      required: true,
    },
    unansweredCount: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    topicBreakdown: [
      {
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        topicTitle: String,
        total: Number,
        correct: Number,
        percentage: Number,
      },
    ],
    userAnswers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOption: Number, // null/undefined if unanswered
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssessmentResult', AssessmentResultSchema);
