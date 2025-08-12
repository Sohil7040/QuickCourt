const express = require('express');
const Venue = require('../models/Venue');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper function to safely convert to string
const safeToString = (value) => {
  return value?.toString() || '';
};

// Helper function to handle null/undefined values
const safeValue = (value, defaultValue = '') => {
  return value || defaultValue;
};

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
      query.sports = { $in: [sportType] };
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
      .populate('courts')
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
    console.error('Error fetching venues:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch venues',
      error: error.message 
    });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findOne({ _id: req.params.id }); // Using custom 'id'

    if (!venue) {
      return res.status(404).json({ 
        success: false,
        message: 'Venue not found' 
      });
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch venue',
      error: error.message 
    });
  }
});


// Get venue availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ 
        success: false,
        message: 'Venue not found' 
      });
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
    console.error('Error fetching venue availability:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch venue availability',
      error: error.message 
    });
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
    console.error('Error creating venue:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create venue',
      error: error.message 
    });
  }
});

// Update venue (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ 
        success: false,
        message: 'Venue not found' 
      });
    }

    // Safe check for owner comparison
    const venueOwnerId = venue.owner?.toString();
    const requestingUserId = req.user?.id?.toString();
    
    if (!venueOwnerId || !requestingUserId) {
      return res.status(403).json({ 
        success: false,
        message: 'Unable to verify ownership' 
      });
    }

    if (venueOwnerId !== requestingUserId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this venue' 
      });
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
    console.error('Error updating venue:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update venue',
      error: error.message 
    });
  }
});

// Delete venue (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ 
        success: false,
        message: 'Venue not found' 
      });
    }

    // Safe check for owner comparison
    const venueOwnerId = venue.owner?.toString();
    const requestingUserId = req.user?.id?.toString();
    
    if (!venueOwnerId || !requestingUserId) {
      return res.status(403).json({ 
        success: false,
        message: 'Unable to verify ownership' 
      });
    }

    if (venueOwnerId !== requestingUserId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this venue' 
      });
    }

    await Venue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete venue',
      error: error.message 
    });
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
    console.error('Error fetching owner venues:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch venues',
      error: error.message 
    });
  }
});

// Check user booking status for specific venue
router.get('/:id/user-booking-status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const Booking = require('../models/Booking');
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
    console.error('Error checking booking status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to check booking status',
      error: error.message 
    });
  }
});

module.exports = router;
