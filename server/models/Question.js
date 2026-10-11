const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    options: {
      type: [String],
      validate: [
        (val) => val.length >= 2,
        'Question must have at least 2 options',
      ],
      required: true,
    },
    correctOptionIndex: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    isAssessmentOnly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', QuestionSchema);
