const express = require('express');
const { body, validationResult } = require('express-validator');
const { Room, Image, Review } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRoom = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Room name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('type').isIn(['single', 'double', 'suite', 'deluxe']).withMessage('Invalid room type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity').isInt({ min: 1, max: 10 }).withMessage('Capacity must be between 1 and 10'),
  body('size').optional().isInt({ min: 1 }).withMessage('Size must be a positive number'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
];

// Get all rooms (public)
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, available } = req.query;
    
    let whereClause = {};
    
    // Filter by type
    if (type) {
      whereClause.type = type;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.$gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.$lte = parseFloat(maxPrice);
    }
    
    // Filter by availability
    if (available === 'true') {
      whereClause.isAvailable = true;
    }

    const rooms = await Room.findAll({
      where: whereClause,
      include: [
        {
          model: Image,
          as: 'images',
          where: { isFeatured: true },
          required: false
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false
        }
      ],
      order: [['featured', 'DESC'], ['createdAt', 'DESC']]
    });

    // Calculate average ratings
    const roomsWithRatings = rooms.map(room => {
      const roomData = room.toJSON();
      if (roomData.reviews && roomData.reviews.length > 0) {
        const avgRating = roomData.reviews.reduce((sum, review) => sum + review.rating, 0) / roomData.reviews.length;
        roomData.averageRating = Math.round(avgRating * 10) / 10;
      } else {
        roomData.averageRating = 0;
      }
      return roomData;
    });

    res.json({ rooms: roomsWithRatings });
  } catch (error) {
    console.error('Rooms fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch rooms' 
    });
  }
});

// Get single room by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const roomId = req.params.id;
    
    const room = await Room.findByPk(roomId, {
      include: [
        {
          model: Image,
          as: 'images',
          order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']]
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found' 
      });
    }

    const roomData = room.toJSON();
    
    // Calculate average rating
    if (roomData.reviews && roomData.reviews.length > 0) {
      const avgRating = roomData.reviews.reduce((sum, review) => sum + review.rating, 0) / roomData.reviews.length;
      roomData.averageRating = Math.round(avgRating * 10) / 10;
    } else {
      roomData.averageRating = 0;
    }

    res.json({ room: roomData });
  } catch (error) {
    console.error('Room fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch room' 
    });
  }
});

// Create new room (admin only)
router.post('/', authenticateToken, requireAdmin, validateRoom, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const roomData = req.body;
    const room = await Room.create(roomData);

    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create room' 
    });
  }
});

// Update room (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateRoom, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const roomId = req.params.id;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found' 
      });
    }

    await room.update(req.body);

    res.json({
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    console.error('Room update error:', error);
    res.status(500).json({ 
      error: 'Failed to update room' 
    });
  }
});

// Delete room (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found' 
      });
    }

    await room.destroy();

    res.json({
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Room deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete room' 
    });
  }
});

// Toggle room availability (admin only)
router.patch('/:id/availability', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found' 
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({
      message: `Room ${room.isAvailable ? 'made available' : 'made unavailable'}`,
      room
    });
  } catch (error) {
    console.error('Room availability toggle error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle room availability' 
    });
  }
});

// Get room types (public)
router.get('/types/list', async (req, res) => {
  try {
    const types = await Room.findAll({
      attributes: ['type'],
      group: ['type'],
      raw: true
    });

    const typeList = types.map(item => item.type);
    
    res.json({ types: typeList });
  } catch (error) {
    console.error('Room types fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch room types' 
    });
  }
});

module.exports = router;


