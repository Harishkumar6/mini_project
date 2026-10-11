const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    stage: {
      type: String,
      default: 'Placement Preparation Core',
    },
    targetWeakAreas: [
      {
        topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        categoryTitle: String,
        topicTitle: String,
        reason: String,
        priority: {
          type: String,
          enum: ['HIGH', 'MEDIUM', 'LOW'],
          default: 'HIGH',
        },
        currentScore: Number,
      },
    ],
    recommendedTopics: [
      {
        topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        categoryTitle: String,
        topicTitle: String,
        reason: String,
        priority: {
          type: String,
          enum: ['HIGH', 'MEDIUM', 'LOW'],
          default: 'MEDIUM',
        },
        status: {
          type: String,
          enum: ['Pending', 'In Progress', 'Completed'],
          default: 'Pending',
        },
        recommendedAction: String,
      },
    ],
    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', RoadmapSchema);
