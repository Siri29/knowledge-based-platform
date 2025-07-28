const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  changes: String,
  versionNumber: { type: Number, required: true }
}, { timestamps: true });

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view', 'edit'], default: 'view' }
  }],
  versions: [documentVersionSchema],
  currentVersion: { type: Number, default: 1 },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

documentSchema.index({ title: 'text', content: 'text' });
documentSchema.index({ author: 1, createdAt: -1 });
documentSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Document', documentSchema);