const express = require('express');
const Venue = require('../models/Venue');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all venues
router.get('/', async (req, res) => {
  try {
    const { sportType, minPrice, maxPrice, location, search } = req.query;
    let query = { status: 'approved' };

    if (sportType) query.sports = { $in: [sportType] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }

    const venues = await Venue.find(query)
      .populate('owner', 'name email')
      .populate('courts');

    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get venues by owner (moved before :id route)
router.get('/owner/my-venues', auth, async (req, res) => {
  try {
    const venues = await Venue.find({ owner: req.user.id });
    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('courts');
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create venue (owner only)
router.post('/', auth, authorize('owner'), async (req, res) => {
  try {
    const venueData = {
      ...req.body,
      owner: req.user.id
    };

    const venue = await Venue.create(venueData);
    
    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update venue (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this venue' });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedVenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete venue (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this venue' });
    }

    await Venue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
