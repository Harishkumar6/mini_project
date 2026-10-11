const mongoose = require('mongoose');

const CodingAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'javascript',
    },
    status: {
      type: String,
      enum: ['Passed', 'Failed', 'Attempted'],
      default: 'Attempted',
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingAttempt', CodingAttemptSchema);
