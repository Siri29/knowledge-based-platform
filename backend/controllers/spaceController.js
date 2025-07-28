const Space = require('../models/Space');
const Page = require('../models/Page');

const createSpace = async (req, res) => {
  try {
    const { name, description, key, isPublic } = req.body;
    
    const existingSpace = await Space.findOne({ key: key.toUpperCase() });
    if (existingSpace) {
      return res.status(400).json({ message: 'Space key already exists' });
    }

    const space = await Space.create({
      name,
      description,
      key: key.toUpperCase(),
      owner: req.user._id,
      isPublic,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    await space.populate('owner', 'name email');
    res.status(201).json(space);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
        { isPublic: true }
      ]
    }).populate('owner', 'name email').sort({ updatedAt: -1 });

    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.json(space);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    if (space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSpace = await Space.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'name email');

    res.json(updatedSpace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    if (space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Page.deleteMany({ space: req.params.id });
    await Space.findByIdAndDelete(req.params.id);

    res.json({ message: 'Space deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSpace, getSpaces, getSpace, updateSpace, deleteSpace };