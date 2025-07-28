const Document = require('../models/Document');
const User = require('../models/User');

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { author: req.user._id },
        { isPublic: true },
        { 'sharedWith.user': req.user._id }
      ]
    })
    .populate('author', 'name email')
    .populate('lastModifiedBy', 'name')
    .populate('sharedWith.user', 'name email')
    .sort({ updatedAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('author', 'name email')
      .populate('lastModifiedBy', 'name')
      .populate('sharedWith.user', 'name email')
      .populate('versions.author', 'name');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check access permissions
    const hasAccess = document.isPublic || 
                     document.author._id.toString() === req.user._id.toString() ||
                     document.sharedWith.some(share => share.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    
    // Extract mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentionMatches = content.match(mentionRegex) || [];
    const mentionedUsernames = mentionMatches.map(match => match.substring(1));
    
    const mentionedUsers = await User.find({ 
      name: { $in: mentionedUsernames } 
    });

    const document = new Document({
      title,
      content,
      author: req.user._id,
      lastModifiedBy: req.user._id,
      isPublic,
      mentions: mentionedUsers.map(user => user._id),
      versions: [{
        content,
        author: req.user._id,
        versionNumber: 1,
        changes: 'Initial version'
      }]
    });

    // Auto-share with mentioned users
    document.sharedWith = mentionedUsers.map(user => ({
      user: user._id,
      permission: 'view'
    }));

    await document.save();
    await document.populate('author', 'name email');
    
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check edit permissions
    const canEdit = document.author.toString() === req.user._id.toString() ||
                   document.sharedWith.some(share => 
                     share.user.toString() === req.user._id.toString() && 
                     share.permission === 'edit'
                   );

    if (!canEdit) {
      return res.status(403).json({ message: 'Edit permission denied' });
    }

    // Extract new mentions
    const mentionRegex = /@(\w+)/g;
    const mentionMatches = content.match(mentionRegex) || [];
    const mentionedUsernames = mentionMatches.map(match => match.substring(1));
    
    const mentionedUsers = await User.find({ 
      name: { $in: mentionedUsernames } 
    });

    // Create new version
    const newVersion = {
      content: document.content,
      author: document.lastModifiedBy,
      versionNumber: document.currentVersion,
      changes: `Updated by ${req.user.name}`
    };

    document.versions.push(newVersion);
    document.title = title;
    document.content = content;
    document.isPublic = isPublic;
    document.lastModifiedBy = req.user._id;
    document.currentVersion += 1;
    document.mentions = mentionedUsers.map(user => user._id);

    // Auto-share with newly mentioned users
    const newShares = mentionedUsers
      .filter(user => !document.sharedWith.some(share => 
        share.user.toString() === user._id.toString()
      ))
      .map(user => ({ user: user._id, permission: 'view' }));

    document.sharedWith.push(...newShares);

    await document.save();
    await document.populate('author', 'name email');
    await document.populate('lastModifiedBy', 'name');
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const shareDocument = async (req, res) => {
  try {
    const { userEmail, permission } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only author can manage sharing' });
    }

    const userToShare = await User.findOne({ email: userEmail });
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove existing share if any
    document.sharedWith = document.sharedWith.filter(
      share => share.user.toString() !== userToShare._id.toString()
    );

    // Add new share
    document.sharedWith.push({
      user: userToShare._id,
      permission
    });

    await document.save();
    await document.populate('sharedWith.user', 'name email');
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchDocuments = async (req, res) => {
  try {
    const { q } = req.query;
    
    const documents = await Document.find({
      $and: [
        {
          $or: [
            { author: req.user._id },
            { isPublic: true },
            { 'sharedWith.user': req.user._id }
          ]
        },
        {
          $text: { $search: q }
        }
      ]
    })
    .populate('author', 'name email')
    .populate('lastModifiedBy', 'name')
    .sort({ score: { $meta: 'textScore' } });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('author', 'name email')
      .populate('lastModifiedBy', 'name');

    if (!document || !document.isPublic) {
      return res.status(404).json({ message: 'Document not found or not public' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
  shareDocument,
  searchDocuments,
  getPublicDocument
};