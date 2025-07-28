const Template = require('../models/Template');

const createTemplate = async (req, res) => {
  try {
    const { name, description, content, category, tags, isPublic } = req.body;
    
    const template = await Template.create({
      name,
      description,
      content,
      category,
      tags: tags || [],
      isPublic,
      author: req.user._id
    });

    await template.populate('author', 'name email');
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTemplates = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {
      $or: [
        { isPublic: true },
        { author: req.user._id }
      ]
    };
    
    if (category) filter.category = category;

    const templates = await Template.find(filter)
      .populate('author', 'name email')
      .sort({ usageCount: -1, createdAt: -1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('author', 'name email');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (template.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'name email');

    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (template.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const useTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await Template.findByIdAndUpdate(req.params.id, { $inc: { usageCount: 1 } });
    res.json({ content: template.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createTemplate, 
  getTemplates, 
  getTemplate, 
  updateTemplate, 
  deleteTemplate, 
  useTemplate 
};