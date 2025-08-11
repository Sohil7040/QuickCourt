const express = require('express');
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { venueId, bookingDate, startTime, endTime, totalHours, totalPrice, specialRequests } = req.body;

    // Check if venue exists and is approved
    const venue = await Venue.findById(venueId);
    if (!venue || venue.status !== 'approved') {
      return res.status(404).json({ message: 'Venue not found or not available' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      venue: venueId,
      bookingDate,
      startTime,
      endTime,
      totalHours,
      totalPrice,
      specialRequests
    });

    await booking.save();

    // Update venue total bookings
    venue.totalBookings += 1;
    await venue.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings for user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('venue');
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
