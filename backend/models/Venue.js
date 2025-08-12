const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  photos: [{
    type: String
  }],
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  sports: [{
    type: String,
    enum: ['basketball', 'tennis', 'football', 'badminton', 'volleyball', 'cricket', 'other']
  }],
  amenities: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for id field (matches _id)
venueSchema.virtual('id').get(function() {
  return this._id?.toString() || '';
});

// Virtual for ownerId field (matches owner)
venueSchema.virtual('ownerId').get(function() {
  return this.owner?.toString() || '';
});

// Ensure virtual fields are serialized
venueSchema.set('toJSON', { virtuals: true });
venueSchema.set('toObject', { virtuals: true });

venueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Venue', venueSchema);
