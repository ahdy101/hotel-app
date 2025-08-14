const express = require('express');
const { body, validationResult } = require('express-validator');
const { Image, Room } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, deleteFile } = require('../middleware/upload');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Validation middleware
const validateImage = [
  body('category').optional().isIn(['room', 'hotel', 'gallery']).withMessage('Invalid category'),
  body('roomId').optional().isInt().withMessage('Room ID must be a valid integer'),
  body('altText').optional().trim().isLength({ max: 255 }).withMessage('Alt text must be less than 255 characters')
];

// Get all images (public)
router.get('/', async (req, res) => {
  try {
    const { category, roomId, featured, limit = 20, page = 1 } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (roomId) {
      whereClause.roomId = roomId;
    }
    
    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    const offset = (page - 1) * limit;
    
    const images = await Image.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name']
        }
      ],
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      images: images.rows,
      total: images.count,
      pages: Math.ceil(images.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Images fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch images' 
    });
  }
});

// Get single image (public)
router.get('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    
    const image = await Image.findByPk(imageId, {
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!image) {
      return res.status(404).json({ 
        error: 'Image not found' 
      });
    }

    res.json({ image });
  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch image' 
    });
  }
});

// Upload single image (admin only)
router.post('/upload', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided' 
      });
    }

    const { category = 'gallery', roomId, altText, isFeatured = false } = req.body;

    // Verify room exists if roomId is provided
    if (roomId) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(400).json({ 
          error: 'Room not found' 
        });
      }
    }

    // Create image record
    const image = await Image.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `uploads/${req.file.filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype,
      category,
      roomId: roomId || null,
      altText,
      isFeatured: isFeatured === 'true'
    });

    // Fetch the created image with room data
    const imageWithDetails = await Image.findByPk(image.id, {
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: imageWithDetails
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image' 
    });
  }
});

// Upload multiple images (admin only)
router.post('/upload-multiple', authenticateToken, requireAdmin, uploadMultiple, validateImage, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'No image files provided' 
      });
    }

    const { category = 'gallery', roomId, isFeatured = false } = req.body;

    // Verify room exists if roomId is provided
    if (roomId) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(400).json({ 
          error: 'Room not found' 
        });
      }
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const image = await Image.create({
        filename: file.filename,
        originalName: file.originalname,
        path: `uploads/${file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        size: file.size,
        mimeType: file.mimetype,
        category,
        roomId: roomId || null,
        isFeatured: isFeatured === 'true'
      });

      uploadedImages.push(image);
    }

    res.status(201).json({
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload images' 
    });
  }
});

// Update image (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateImage, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const imageId = req.params.id;
    const image = await Image.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ 
        error: 'Image not found' 
      });
    }

    const { category, roomId, altText, isFeatured } = req.body;

    // Verify room exists if roomId is provided
    if (roomId) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(400).json({ 
          error: 'Room not found' 
        });
      }
    }

    await image.update({
      category,
      roomId: roomId || null,
      altText,
      isFeatured
    });

    res.json({
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    console.error('Image update error:', error);
    res.status(500).json({ 
      error: 'Failed to update image' 
    });
  }
});

// Delete image (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ 
        error: 'Image not found' 
      });
    }

    // Delete file from filesystem
    const deleted = deleteFile(image.filename);
    
    // Delete from database
    await image.destroy();

    res.json({
      message: 'Image deleted successfully',
      fileDeleted: deleted
    });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image' 
    });
  }
});

// Toggle image featured status (admin only)
router.patch('/:id/featured', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ 
        error: 'Image not found' 
      });
    }

    image.isFeatured = !image.isFeatured;
    await image.save();

    res.json({
      message: `Image ${image.isFeatured ? 'marked as featured' : 'unmarked as featured'}`,
      image
    });
  } catch (error) {
    console.error('Image featured toggle error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle image featured status' 
    });
  }
});

// Get images by room (public)
router.get('/room/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { limit = 10 } = req.query;
    
    const images = await Image.findAll({
      where: { roomId },
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ images });
  } catch (error) {
    console.error('Room images fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch room images' 
    });
  }
});

// Get gallery images (public)
router.get('/gallery/list', async (req, res) => {
  try {
    const { limit = 12, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    const images = await Image.findAndCountAll({
      where: { category: 'gallery' },
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      images: images.rows,
      total: images.count,
      pages: Math.ceil(images.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Gallery images fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch gallery images' 
    });
  }
});

module.exports = router;


