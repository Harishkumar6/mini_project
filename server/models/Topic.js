const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    estimatedMinutes: {
      type: Number,
      default: 20,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', TopicSchema);
