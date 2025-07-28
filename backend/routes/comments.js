const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  createComment, 
  getComments, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');

const router = express.Router();

router.post('/', auth, createComment);
router.get('/page/:pageId', auth, getComments);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;