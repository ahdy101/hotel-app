const express = require('express');
const { body, validationResult } = require('express-validator');
const { Content } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateContent = [
  body('page').isIn(['home', 'about', 'contact', 'gallery']).withMessage('Invalid page'),
  body('section').notEmpty().withMessage('Section is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('type').optional().isIn(['text', 'html', 'json']).withMessage('Invalid content type')
];

// Get all content (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contents = await Content.findAll({
      order: [['page', 'ASC'], ['order', 'ASC']]
    });

    res.json({ contents });
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content' 
    });
  }
});

// Get content by page (public)
router.get('/page/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const contents = await Content.findAll({
      where: { 
        page,
        isPublished: true 
      },
      order: [['order', 'ASC']]
    });

    res.json({ contents });
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content' 
    });
  }
});

// Create new content (admin only)
router.post('/', authenticateToken, requireAdmin, validateContent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { page, section, title, content, type, isPublished, order } = req.body;

    // Check if content already exists for this page and section
    const existingContent = await Content.findOne({ 
      where: { page, section } 
    });

    if (existingContent) {
      return res.status(400).json({ 
        error: 'Content already exists for this page and section' 
      });
    }

    const newContent = await Content.create({
      page,
      section,
      title,
      content,
      type: type || 'text',
      isPublished: isPublished !== undefined ? isPublished : true,
      order: order || 0
    });

    res.status(201).json({
      message: 'Content created successfully',
      content: newContent
    });
  } catch (error) {
    console.error('Content creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create content' 
    });
  }
});

// Update content (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateContent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { page, section, title, content, type, isPublished, order } = req.body;

    const contentItem = await Content.findByPk(id);
    if (!contentItem) {
      return res.status(404).json({ 
        error: 'Content not found' 
      });
    }

    // Check if section is being changed and if it conflicts with existing content
    if (section !== contentItem.section) {
      const existingContent = await Content.findOne({ 
        where: { page, section } 
      });

      if (existingContent) {
        return res.status(400).json({ 
          error: 'Content already exists for this page and section' 
        });
      }
    }

    await contentItem.update({
      page,
      section,
      title,
      content,
      type: type || 'text',
      isPublished: isPublished !== undefined ? isPublished : contentItem.isPublished,
      order: order !== undefined ? order : contentItem.order
    });

    res.json({
      message: 'Content updated successfully',
      content: contentItem
    });
  } catch (error) {
    console.error('Content update error:', error);
    res.status(500).json({ 
      error: 'Failed to update content' 
    });
  }
});

// Delete content (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const contentItem = await Content.findByPk(id);

    if (!contentItem) {
      return res.status(404).json({ 
        error: 'Content not found' 
      });
    }

    await contentItem.destroy();

    res.json({
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Content deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete content' 
    });
  }
});

// Toggle content publish status (admin only)
router.patch('/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const contentItem = await Content.findByPk(id);

    if (!contentItem) {
      return res.status(404).json({ 
        error: 'Content not found' 
      });
    }

    contentItem.isPublished = !contentItem.isPublished;
    await contentItem.save();

    res.json({
      message: `Content ${contentItem.isPublished ? 'published' : 'unpublished'} successfully`,
      content: contentItem
    });
  } catch (error) {
    console.error('Content toggle error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle content status' 
    });
  }
});

module.exports = router;

