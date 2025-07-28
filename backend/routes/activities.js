const express = require('express');
const { auth } = require('../middleware/auth');
const Activity = require('../models/Activity');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { filter, timeRange } = req.query;
    let query = {};

    // Apply user filter
    if (filter === 'my') {
      query.user = req.user._id;
    }

    // Apply time range filter
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const activities = await Activity.find(query)
      .populate('user', 'name email')
      .populate('space', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;