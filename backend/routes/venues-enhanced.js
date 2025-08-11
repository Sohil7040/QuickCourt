const express = require('express');
const Venue = require('../models/Venue');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all venues with enhanced filtering
router.get('/', async (req, res) => {
  try {
    const { 
      sportType, 
      minPrice, 
      maxPrice, 
      location, 
      search, 
      rating,
      page = 1,
      limit = 12
    } = req.query;
    
    let query = { status: 'approved' };
    
    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sport type filter
    if (sportType && sportType !== 'all') {
      query.sportType = sportType;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }
    
    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }
    
    // Location filter (nearby venues)
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 10000 // 10km radius
        }
      };
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    const venues = await Venue.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Venue.countDocuments(query);
    
    res.json({
      success: true,
      data: venues,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email phone');
    
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

// Get venue availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    
    // Get existing bookings for this date
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({
      venue: req.params.id,
      bookingDate: new Date(date),
      status: { $in: ['confirmed', 'pending'] }
    });
    
    res.json({
      success: true,
      data: {
        venue,
        bookings,
        availability: venue.availability
      }
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

// Get venues by owner
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

// Check user booking status for specific venue
router.get('/:id/user-booking-status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const bookings = await Booking.find({
      venue: id,
      user: userId,
      status: { $in: ['confirmed', 'pending'] },
      bookingDate: { $gte: new Date() }
    }).sort({ bookingDate: 1 });
    
    res.json({
      success: true,
      data: {
        hasBookings: bookings.length > 0,
        bookings: bookings,
        upcomingBookings: bookings.filter(b => new Date(b.bookingDate) >= new Date())
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
