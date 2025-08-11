const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  facility: {
    type: mongoose.Schema.ObjectId,
    ref: 'Facility',
    required: true
  },
  court: {
    courtId: {
      type: String,
      required: true
    },
    name: String,
    sport: String
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    duration: {
      type: Number, // in minutes
      required: true
    }
  },
  bookingType: {
    type: String,
    enum: ['single', 'recurring', 'group', 'tournament'],
    default: 'single'
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    endDate: Date,
    daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
    totalBookings: Number
  },
  groupDetails: {
    size: {
      type: Number,
      min: 1,
      max: 20
    },
    members: [{
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      name: String,
      email: String,
      phone: String,
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
      }
    }]
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    taxes: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'],
      default: 'pending'
    },
    method: String,
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundedAt: Date
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'no_show', 'in_progress'],
    default: 'confirmed'
  },
  checkIn: {
    time: Date,
    method: {
      type: String,
      enum: ['manual', 'qr_code', 'digital_key']
    }
  },
  checkOut: {
    time: Date,
    method: String
  },
  notes: {
    user: String,
    facility: String,
    admin: String
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['user', 'facility', 'admin']
    },
    cancelledAt: Date,
    reason: String,
    refundEligible: Boolean
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ facility: 1, bookingDate: 1 });
bookingSchema.index({ 'court.courtId': 1, bookingDate: 1, 'timeSlot.startTime': 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
