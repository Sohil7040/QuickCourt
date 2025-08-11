const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: 1,
      max: 5
    },
    cleanliness: { type: Number, min: 1, max: 5 },
    staff: { type: Number, min: 1, max: 5 },
    facilities: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  images: [String],
  isVisible: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  response: {
    text: String,
    respondedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews for same booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
