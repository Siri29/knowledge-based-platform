const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { 
  createPage, 
  getPages, 
  getPage, 
  updatePage, 
  deletePage, 
  searchPages, 
  getPageVersions,
  getSearchSuggestions
} = require('../controllers/pageController');

const router = express.Router();

router.post('/', auth, authorize('admin', 'editor'), createPage);
router.get('/', auth, getPages);
router.get('/search', auth, searchPages);
router.get('/suggestions', auth, getSearchSuggestions);
router.get('/:id', auth, getPage);
router.get('/:id/versions', auth, getPageVersions);
router.put('/:id', auth, authorize('admin', 'editor'), updatePage);
router.delete('/:id', auth, authorize('admin', 'editor'), deletePage);

module.exports = router;