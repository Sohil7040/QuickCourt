const mongoose = require('mongoose');
const facilitySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true,
    maxlength: [100, 'Facility name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  sports: [{
    type: String,
    required: true,
    enum: ['tennis', 'badminton', 'basketball', 'football', 'cricket', 'volleyball', 'squash', 'table_tennis']
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please enter valid 6-digit pincode']
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  courts: [{
    courtNumber: {
      type: String,
      required: true
    },
    name: String,
    sport: {
      type: String,
      required: true
    },
    isIndoor: {
      type: Boolean,
      default: false
    },
    capacity: {
      type: Number,
      default: 4
    },
    amenities: [String],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    peakHours: [{
      startTime: String,
      endTime: String,
      multiplier: {
        type: Number,
        default: 1.5
      }
    }],
    weekendMultiplier: {
      type: Number,
      default: 1.2
    },
    seasonalPricing: [{
      name: String,
      startDate: Date,
      endDate: Date,
      multiplier: Number
    }]
  },
  amenities: [String],
  images: [String],
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  rules: [String],
  cancellationPolicy: {
    freeUntil: {
      type: Number, // hours before booking
      default: 2
    },
    refundPercentage: {
      type: Number,
      default: 80,
      min: 0,
      max: 100
    }
  },
  features: {
    hasParking: { type: Boolean, default: false },
    hasShower: { type: Boolean, default: false },
    hasEquipmentRental: { type: Boolean, default: false },
    hasLockers: { type: Boolean, default: false },
    hasWifi: { type: Boolean, default: false },
    hasRefreshments: { type: Boolean, default: false }
  },
  accessControl: {
    type: {
      type: String,
      enum: ['manual', 'digital', 'keyless'],
      default: 'manual'
    },
    instructions: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
facilitySchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for facility bookings
facilitySchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'facility'
});

const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;
