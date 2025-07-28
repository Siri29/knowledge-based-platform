const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer'
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);