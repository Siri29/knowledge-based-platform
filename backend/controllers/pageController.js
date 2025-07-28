const Page = require('../models/Page');
const PageVersion = require('../models/PageVersion');
const Space = require('../models/Space');

const createPage = async (req, res) => {
  try {
    const { title, content, spaceId, parentId, tags } = req.body;
    
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const page = await Page.create({
      title,
      content,
      slug,
      space: spaceId,
      author: req.user._id,
      parent: parentId || null,
      tags: tags || [],
      lastModifiedBy: req.user._id,
      status: 'published'
    });

    await PageVersion.create({
      page: page._id,
      title,
      content,
      version: 1,
      author: req.user._id,
      changeNote: 'Initial version'
    });

    await page.populate(['author', 'lastModifiedBy', 'space'], 'name email');
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPages = async (req, res) => {
  try {
    const { spaceId, parentId } = req.query;
    const filter = {};
    
    if (spaceId) filter.space = spaceId;
    if (parentId) filter.parent = parentId;
    if (parentId === 'null') filter.parent = null;

    const pages = await Page.find(filter)
      .populate('author', 'name email')
      .populate('space', 'name key')
      .sort({ updatedAt: -1 });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
      .populate('author', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('space', 'name key');

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    await Page.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const lastVersion = await PageVersion.findOne({ page: req.params.id }).sort({ version: -1 });
    const newVersion = lastVersion ? lastVersion.version + 1 : 1;

    await PageVersion.create({
      page: req.params.id,
      title: req.body.title || page.title,
      content: req.body.content || page.content,
      version: newVersion,
      author: req.user._id,
      changeNote: req.body.changeNote || 'Updated page'
    });

    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user._id },
      { new: true }
    ).populate(['author', 'lastModifiedBy', 'space'], 'name email');

    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    await Page.deleteMany({ parent: req.params.id });
    await PageVersion.deleteMany({ page: req.params.id });
    await Page.findByIdAndDelete(req.params.id);

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchPages = async (req, res) => {
  try {
    const { q, spaceId } = req.query;
    const filter = { $text: { $search: q } };
    
    if (spaceId) filter.space = spaceId;

    const pages = await Page.find(filter, { score: { $meta: 'textScore' } })
      .populate('author', 'name email')
      .populate('space', 'name key')
      .sort({ score: { $meta: 'textScore' } });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPageVersions = async (req, res) => {
  try {
    const versions = await PageVersion.find({ page: req.params.id })
      .populate('author', 'name email')
      .sort({ version: -1 });

    res.json(versions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const suggestions = await Page.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
    .select('title tags')
    .limit(5)
    .lean();

    const titleSuggestions = suggestions.map(page => page.title);
    const tagSuggestions = suggestions.flatMap(page => page.tags)
      .filter(tag => tag.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3);

    const uniqueSuggestions = [...new Set([...titleSuggestions, ...tagSuggestions])];
    res.json(uniqueSuggestions.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createPage, 
  getPages, 
  getPage, 
  updatePage, 
  deletePage, 
  searchPages, 
  getPageVersions,
  getSearchSuggestions
};