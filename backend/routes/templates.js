const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { 
  createTemplate, 
  getTemplates, 
  getTemplate, 
  updateTemplate, 
  deleteTemplate, 
  useTemplate 
} = require('../controllers/templateController');

const router = express.Router();

router.post('/', auth, authorize('admin', 'editor'), createTemplate);
router.get('/', auth, getTemplates);
router.get('/:id', auth, getTemplate);
router.put('/:id', auth, authorize('admin', 'editor'), updateTemplate);
router.delete('/:id', auth, deleteTemplate);
router.post('/:id/use', auth, useTemplate);

module.exports = router;