// routes/bookings.js
const express = require('express');
const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      facilityId,
      courtId,
      bookingDate,
      timeSlot,
      bookingType = 'single',
      groupDetails,
      recurringDetails
    } = req.body;

    // Validation
    if (!facilityId || !courtId || !bookingDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Facility, court, date and time slot are required'
      });
    }

    // Get facility details
    const facility = await Facility.findById(facilityId);
    if (!facility || !facility.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found or inactive'
      });
    }

    // Find the specific court
    const court = facility.courts.find(c => c._id.toString() === courtId);
    if (!court || !court.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Court not found or inactive'
      });
    }

    // Check if the booking date is in the future
    const bookingDateTime = new Date(bookingDate);
    const now = new Date();
    if (bookingDateTime <= now) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Check facility operating hours
    const dayOfWeek = bookingDateTime.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    const operatingHours = facility.operatingHours[dayName];

    if (operatingHours.closed) {
      return res.status(400).json({
        success: false,
        message: 'Facility is closed on the selected day'
      });
    }

    // Check if time slot is within operating hours
    if (timeSlot.startTime < operatingHours.open || timeSlot.endTime > operatingHours.close) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is outside operating hours'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      facility: facilityId,
      'court.courtId': courtId,
      bookingDate: {
        $gte: new Date(bookingDate + 'T00:00:00.000Z'),
        $lt: new Date(bookingDate + 'T23:59:59.999Z')
      },
      status: { $in: ['confirmed', 'in_progress'] },
      $or: [
        {
          'timeSlot.startTime': { $lt: timeSlot.endTime },
          'timeSlot.endTime': { $gt: timeSlot.startTime }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Calculate pricing
    const slotPrice = calculateSlotPrice(facility.pricing, timeSlot.startTime, dayOfWeek);
    const duration = calculateDuration(timeSlot.startTime, timeSlot.endTime);
    const baseAmount = slotPrice * (duration / 60); // Price per hour
    const taxes = baseAmount * 0.18; // 18% GST
    const totalAmount = baseAmount + taxes;

    // Create booking data
    const bookingData = {
      user: req.user.id,
      facility: facilityId,
      court: {
        courtId: courtId,
        name: court.name,
        sport: court.sport
      },
      bookingDate,
      timeSlot: {
        ...timeSlot,
        duration
      },
      bookingType,
      pricing: {
        baseAmount: Math.round(baseAmount * 100) / 100,
        taxes: Math.round(taxes * 100) / 100,
        discounts: 0,
        totalAmount: Math.round(totalAmount * 100) / 100,
        currency: 'INR'
      },
      status: 'confirmed',
      payment: {
        status: 'pending'
      }
    };

    // Add group details if group booking
    if (bookingType === 'group' && groupDetails) {
      bookingData.groupDetails = groupDetails;
    }

    // Add recurring details if recurring booking
    if (bookingType === 'recurring' && recurringDetails) {
      bookingData.recurringDetails = recurringDetails;
    }

    const booking = await Booking.create(bookingData);
    
    // Populate booking details
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'facility', select: 'name location owner' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const {
      status,
      upcoming = false,
      page = 1,
      limit = 10
    } = req.query;

    let query = { user: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter upcoming bookings
    if (upcoming === 'true') {
      query.bookingDate = { $gte: new Date() };
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('facility', 'name location images amenities')
      .sort({ bookingDate: upcoming === 'true' ? 1 : -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('facility', 'name location images amenities owner operatingHours');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    const isOwner = booking.user._id.toString() === req.user.id;
    const isFacilityOwner = booking.facility.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isFacilityOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only modify your own bookings'
      });
    }

    // Check if booking can be modified (not in the past, not completed)
    const now = new Date();
    const bookingDate = new Date(booking.bookingDate);
    
    if (bookingDate <= now || booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be modified'
      });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['notes'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { [`notes.user`]: updates.notes } },
      { new: true, runValidators: true }
    ).populate('facility', 'name location');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('facility');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is facility owner
    const isOwner = booking.user.toString() === req.user.id;
    const isFacilityOwner = booking.facility.owner.toString() === req.user.id;
    
    if (!isOwner && !isFacilityOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Calculate refund eligibility
    const now = new Date();
    const bookingDateTime = new Date(booking.bookingDate + 'T' + booking.timeSlot.startTime);
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
    
    const cancellationPolicy = booking.facility.cancellationPolicy;
    const refundEligible = hoursUntilBooking >= cancellationPolicy.freeUntil;
    
    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: isOwner ? 'user' : (isFacilityOwner ? 'facility' : 'admin'),
      cancelledAt: new Date(),
      reason: req.body.reason || 'Cancelled by user',
      refundEligible
    };

    if (refundEligible && booking.payment.status === 'paid') {
      const refundPercentage = cancellationPolicy.refundPercentage || 80;
      const refundAmount = (booking.pricing.totalAmount * refundPercentage) / 100;
      
      booking.payment.status = 'refunded';
      booking.payment.refundAmount = Math.round(refundAmount * 100) / 100;
      booking.payment.refundedAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        refundInfo: refundEligible ? {
          eligible: true,
          amount: booking.payment.refundAmount,
          percentage: cancellationPolicy.refundPercentage
        } : {
          eligible: false,
          reason: `Cancellation must be made at least ${cancellationPolicy.freeUntil} hours before booking time`
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

// @desc    Check-in to booking
// @route   POST /api/bookings/:id/checkin
// @access  Private
router.post('/:id/checkin', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking is confirmed and today
    const today = new Date().toISOString().split('T')[0];
    const bookingDate = booking.bookingDate.toISOString().split('T')[0];
    
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed bookings can be checked in'
      });
    }

    if (bookingDate !== today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in is only allowed on the booking date'
      });
    }

    // Check if already checked in
    if (booking.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in'
      });
    }

    // Update check-in
    booking.checkIn = {
      time: new Date(),
      method: req.body.method || 'manual'
    };
    booking.status = 'in_progress';

    await booking.save();

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Check-out from booking
// @route   POST /api/bookings/:id/checkout
// @access  Private
router.post('/:id/checkout', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if checked in
    if (!booking.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Must check in before checking out'
      });
    }

    // Check if already checked out
    if (booking.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out'
      });
    }

    // Update check-out
    booking.checkOut = {
      time: new Date(),
      method: req.body.method || 'manual'
    };
    booking.status = 'completed';

    await booking.save();

    res.json({
      success: true,
      message: 'Checked out successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get facility bookings (for venue owners)
// @route   GET /api/bookings/facility/:facilityId
// @access  Private (Venue Owner)
router.get('/facility/:facilityId', auth, authorize('venue_owner', 'admin'), async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { date, status, page = 1, limit = 20 } = req.query;

    // Check if user owns the facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    if (facility.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let query = { facility: facilityId };

    // Filter by date
    if (date) {
      query.bookingDate = {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z')
      };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ bookingDate: -1, 'timeSlot.startTime': 1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Booking.countDocuments(query);

    // Calculate revenue statistics
    const revenueStats = await Booking.aggregate([
      {
        $match: {
          facility: facility._id,
          'payment.status': 'paid',
          ...(date && {
            bookingDate: {
              $gte: new Date(date + 'T00:00:00.000Z'),
              $lt: new Date(date + 'T23:59:59.999Z')
            }
          })
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 },
          averageBookingValue: { $avg: '$pricing.totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: revenueStats[0] || {
          totalRevenue: 0,
          totalBookings: 0,
          averageBookingValue: 0
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

// @desc    Reschedule booking
// @route   PUT /api/bookings/:id/reschedule
// @access  Private
router.put('/:id/reschedule', auth, async (req, res) => {
  try {
    const { newDate, newTimeSlot } = req.body;

    if (!newDate || !newTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'New date and time slot are required'
      });
    }

    const booking = await Booking.findById(req.params.id).populate('facility');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be rescheduled
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed bookings can be rescheduled'
      });
    }

    // Check for conflicts on new date/time
    const conflictingBooking = await Booking.findOne({
      _id: { $ne: booking._id },
      facility: booking.facility._id,
      'court.courtId': booking.court.courtId,
      bookingDate: {
        $gte: new Date(newDate + 'T00:00:00.000Z'),
        $lt: new Date(newDate + 'T23:59:59.999Z')
      },
      status: { $in: ['confirmed', 'in_progress'] },
      $or: [
        {
          'timeSlot.startTime': { $lt: newTimeSlot.endTime },
          'timeSlot.endTime': { $gt: newTimeSlot.startTime }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'New time slot is already booked'
      });
    }

    // Update booking
    const oldDate = booking.bookingDate;
    const oldTimeSlot = booking.timeSlot;

    booking.bookingDate = newDate;
    booking.timeSlot = {
      ...newTimeSlot,
      duration: calculateDuration(newTimeSlot.startTime, newTimeSlot.endTime)
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: {
        booking,
        changes: {
          from: {
            date: oldDate,
            timeSlot: oldTimeSlot
          },
          to: {
            date: newDate,
            timeSlot: newTimeSlot
          }
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

// Helper function to calculate duration in minutes
function calculateDuration(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  return (end - start) / (1000 * 60);
}

// Helper function to calculate slot price (reused from facilities)
function calculateSlotPrice(pricing, timeSlot, dayOfWeek) {
  let price = pricing.basePrice;
  
  // Apply weekend multiplier
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
  
  return Math.round(price * 100) / 100;
}

module.exports = router;