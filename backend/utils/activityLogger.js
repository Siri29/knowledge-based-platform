const Activity = require('../models/Activity');

const logActivity = async (userId, action, target, targetId, targetTitle, spaceId = null, metadata = {}) => {
  try {
    await Activity.create({
      user: userId,
      action,
      target,
      targetId,
      targetTitle,
      space: spaceId,
      metadata
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = { logActivity };