const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'Award',
    },
    category: {
      type: String,
      default: 'General',
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    conditionType: {
      type: String,
      enum: [
        'TOPIC_COMPLETE',
        'PRACTICE_COUNT',
        'ASSESSMENT_COMPLETE',
        'PERFECT_SCORE',
        'CODING_COMPLETE',
        'STREAK',
        'ROADMAP_MILESTONE',
      ],
      required: true,
    },
    threshold: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', AchievementSchema);
