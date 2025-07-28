const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted', 'viewed', 'commented'],
    required: true
  },
  target: {
    type: String,
    enum: ['page', 'space', 'comment', 'template'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetTitle: {
    type: String,
    required: true
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

activitySchema.index({ createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ space: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);