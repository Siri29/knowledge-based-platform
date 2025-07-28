const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
  shareDocument,
  searchDocuments,
  getPublicDocument
} = require('../controllers/documentController');

const router = express.Router();

router.get('/', auth, getAllDocuments);
router.get('/search', auth, searchDocuments);
router.get('/public/:id', getPublicDocument);
router.get('/:id', auth, getDocument);
router.post('/', auth, createDocument);
router.put('/:id', auth, updateDocument);
router.post('/:id/share', auth, shareDocument);

module.exports = router;