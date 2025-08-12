const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  courtNumber: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    required: true,
    enum: ['basketball', 'tennis', 'football', 'badminton', 'volleyball', 'cricket', 'other']
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String
  }],
  images: [{
    type: String
  }],
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Court', courtSchema);
