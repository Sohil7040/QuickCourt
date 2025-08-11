const express = require('express');
const { Facility, Booking, Review } = require('../models');
const { auth, authorize } = require('./auth');
const router = express.Router();

// @desc    Get all facilities with filters
// @route   GET /api/facilities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      sport,
      city,
      date,
      startTime,
      endTime,
      minPrice,
      maxPrice,
      isIndoor,
      amenities,
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true, isVerified: true };

    // Sport filter
    if (sport) {
      query.sports = { $in: [sport] };
    }

    // Location filter
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    // Price filter
    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = parseFloat(maxPrice);
    }

    // Indoor/Outdoor filter
    if (isIndoor !== undefined) {
      query['courts.isIndoor'] = isIndoor === 'true';
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    // Geospatial query for nearby facilities
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const facilities = await Facility.find(query)
      .populate('owner', 'name email phone')
      .sort(sortObj)
      .limit(limit * 1)
      .skip(skip)
      .select('-__v');

    // Get total count for pagination
    const total = await Facility.countDocuments(query);

    // If date and time provided, filter available facilities
    let availableFacilities = facilities;
    if (date && startTime && endTime) {
      availableFacilities = [];
      
      for (const facility of facilities) {
        const hasAvailableCourt = await checkCourtAvailability(
          facility._id,
          date,
          startTime,
          endTime
        );
        
        if (hasAvailableCourt) {
          availableFacilities.push(facility);
        }
      }
    }

    res.json({
      success: true,
      data: {
        facilities: availableFacilities,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single facility
// @route   GET /api/facilities/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'bookings',
        match: { 
          bookingDate: { $gte: new Date() },
          status: { $in: ['confirmed', 'in_progress'] }
        },
        select: 'bookingDate timeSlot court status'
      });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Get reviews for this facility
    const reviews = await Review.find({ facility: facility._id, isVisible: true })
      .populate('user', 'name profile.avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        facility,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new facility
// @route   POST /api/facilities
// @access  Private (Venue Owner)
router.post('/', auth, authorize('venue_owner', 'admin'), async (req, res) => {
  try {
    const facilityData = {
      ...req.body,
      owner: req.user.id
    };

    // Validate required fields
    const requiredFields = ['name', 'sports', 'location', 'courts', 'pricing'];
    for (const field of requiredFields) {
      if (!facilityData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate courts
    if (!Array.isArray(facilityData.courts) || facilityData.courts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one court is required'
      });
    }

    const facility = await Facility.create(facilityData);

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: {
        facility
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private (Venue Owner/Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Check ownership or admin role
    if (facility.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not authorized to update this facility'
      });
    }

    facility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: {
        facility
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private (Venue Owner/Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Check ownership or admin role
    if (facility.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not authorized to delete this facility'
      });
    }

    // Check for future bookings
    const futureBookings = await Booking.countDocuments({
      facility: facility._id,
      bookingDate: { $gte: new Date() },
      status: { $in: ['confirmed', 'in_progress'] }
    });

    if (futureBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete facility with future bookings. Please cancel all future bookings first.'
      });
    }

    // Soft delete - mark as inactive
    facility.isActive = false;
    await facility.save();

    res.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get facility availability
// @route   GET /api/facilities/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date, courtId } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = new Date(date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    // Check if facility is open on this day
    const operatingHours = facility.operatingHours[dayName];
    if (operatingHours.closed) {
      return res.json({
        success: true,
        data: {
          isOpen: false,
          message: 'Facility is closed on this day',
          availability: []
        }
      });
    }

    // Generate time slots based on operating hours
    const timeSlots = generateTimeSlots(operatingHours.open, operatingHours.close, 60); // 1-hour slots

    // Get existing bookings for the date
    const bookings = await Booking.find({
      facility: facility._id,
      bookingDate: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z')
      },
      status: { $in: ['confirmed', 'in_progress'] }
    });

    // Filter courts if courtId provided
    const courts = courtId 
      ? facility.courts.filter(court => court._id.toString() === courtId)
      : facility.courts.filter(court => court.isActive);

    // Calculate availability for each court and time slot
    const availability = [];

    for (const court of courts) {
      const courtBookings = bookings.filter(
        booking => booking.court.courtId === court._id.toString()
      );

      for (const slot of timeSlots) {
        const isBooked = courtBookings.some(booking => {
          const bookingStart = booking.timeSlot.startTime;
          const bookingEnd = booking.timeSlot.endTime;
          return (slot.startTime >= bookingStart && slot.startTime < bookingEnd) ||
                 (slot.endTime > bookingStart && slot.endTime <= bookingEnd) ||
                 (slot.startTime <= bookingStart && slot.endTime >= bookingEnd);
        });

        availability.push({
          courtId: court._id,
          courtName: court.name,
          sport: court.sport,
          timeSlot: slot,
          isAvailable: !isBooked,
          price: calculateSlotPrice(facility.pricing, slot.startTime, dayOfWeek)
        });
      }
    }

    res.json({
      success: true,
      data: {
        isOpen: true,
        operatingHours,
        availability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get my facilities (for venue owners)
// @route   GET /api/facilities/my/facilities
// @access  Private (Venue Owner)
router.get('/my/facilities', auth, authorize('venue_owner', 'admin'), async (req, res) => {
  try {
    const facilities = await Facility.find({ 
      owner: req.user.id,
      isActive: true 
    })
    .populate('bookings')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        facilities,
        count: facilities.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Helper function to check court availability
async function checkCourtAvailability(facilityId, date, startTime, endTime) {
  const bookings = await Booking.find({
    facility: facilityId,
    bookingDate: {
      $gte: new Date(date + 'T00:00:00.000Z'),
      $lt: new Date(date + 'T23:59:59.999Z')
    },
    status: { $in: ['confirmed', 'in_progress'] },
    $or: [
      {
        'timeSlot.startTime': { $lt: endTime },
        'timeSlot.endTime': { $gt: startTime }
      }
    ]
  });

  const facility = await Facility.findById(facilityId);
  const activeCourts = facility.courts.filter(court => court.isActive);
  
  return bookings.length < activeCourts.length;
}

// Helper function to generate time slots
function generateTimeSlots(openTime, closeTime, intervalMinutes) {
  const slots = [];
  const start = new Date(`2000-01-01T${openTime}:00`);
  const end = new Date(`2000-01-01T${closeTime}:00`);
  
  let current = new Date(start);
  
  while (current < end) {
    const slotEnd = new Date(current.getTime() + intervalMinutes * 60000);
    if (slotEnd <= end) {
      slots.push({
        startTime: current.toTimeString().substring(0, 5),
        endTime: slotEnd.toTimeString().substring(0, 5),
        duration: intervalMinutes
      });
    }
    current = slotEnd;
  }
  
  return slots;
}

// Helper function to calculate slot price
function calculateSlotPrice(pricing, timeSlot, dayOfWeek) {
  let price = pricing.basePrice;
  
  // Apply weekend multiplier (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    price *= pricing.weekendMultiplier || 1;
  }
  
  // Apply peak hour pricing
  if (pricing.peakHours && pricing.peakHours.length > 0) {
    const isPeakHour = pricing.peakHours.some(peak => {
      return timeSlot >= peak.startTime && timeSlot < peak.endTime;
    });
    
    if (isPeakHour) {
      const peakMultiplier = pricing.peakHours.find(peak => 
        timeSlot >= peak.startTime && timeSlot < peak.endTime
      )?.multiplier || 1.5;
      price *= peakMultiplier;
    }
  }
  
  return Math.round(price * 100) / 100; // Round to 2 decimal places
}

module.exports = router;
