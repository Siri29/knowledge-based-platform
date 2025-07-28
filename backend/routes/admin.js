const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserStats,
  getRecentActivities,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', auth, authorize('admin'), getAllUsers);
router.get('/stats', auth, authorize('admin'), getUserStats);
router.get('/activities', auth, authorize('admin'), getRecentActivities);
router.put('/users/:userId/role', auth, authorize('admin'), updateUserRole);
router.delete('/users/:userId', auth, authorize('admin'), deleteUser);

module.exports = router;