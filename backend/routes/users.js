const express = require('express');
const { auth, authorize } = require('./auth');
const { User } = require('../models');
const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password -__v'),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get a user by id (self or admin)
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a user (self can update limited fields; admin can update role/status)
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.id === req.params.id;
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updates = {};
    const allowedSelfUpdates = ['name', 'profile', 'location', 'preferences'];
    const allowedAdminOnly = ['role', 'isActive', 'membership'];

    Object.keys(req.body).forEach((key) => {
      if (allowedSelfUpdates.includes(key)) updates[key] = req.body[key];
      if (isAdmin && allowedAdminOnly.includes(key)) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      select: '-password -__v',
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully', data: { user } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Deactivate a user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = false;
    await user.save();
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

