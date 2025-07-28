const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const { content, pageId, parentId } = req.body;
    
    const comment = await Comment.create({
      content,
      page: pageId,
      author: req.user._id,
      parent: parentId || null
    });

    await comment.populate('author', 'name email');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const comments = await Comment.find({ page: pageId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content, isEdited: true },
      { new: true }
    ).populate('author', 'name email');

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getComments, updateComment, deleteComment };