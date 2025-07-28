const User = require('../models/User');
const Page = require('../models/Page');
const Space = require('../models/Space');
const Activity = require('../models/Activity');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPages = await Page.countDocuments();
    const totalSpaces = await Space.countDocuments();
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalPages,
      totalSpaces,
      usersByRole,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate('user', 'name email role')
      .populate('space', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await User.findByIdAndDelete(userId);
    await Page.deleteMany({ author: userId });
    await Activity.deleteMany({ user: userId });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  getRecentActivities,
  updateUserRole,
  deleteUser
};