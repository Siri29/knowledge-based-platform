const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { 
  createSpace, 
  getSpaces, 
  getSpace, 
  updateSpace, 
  deleteSpace 
} = require('../controllers/spaceController');

const router = express.Router();

router.post('/', auth, authorize('admin', 'editor'), createSpace);
router.get('/', auth, getSpaces);
router.get('/:id', auth, getSpace);
router.put('/:id', auth, authorize('admin', 'editor'), updateSpace);
router.delete('/:id', auth, authorize('admin'), deleteSpace);

module.exports = router;