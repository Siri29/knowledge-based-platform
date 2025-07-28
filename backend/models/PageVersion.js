const mongoose = require('mongoose');

const pageVersionSchema = new mongoose.Schema({
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changeNote: String
}, { timestamps: true });

module.exports = mongoose.model('PageVersion', pageVersionSchema);