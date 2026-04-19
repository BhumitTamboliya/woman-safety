const mongoose = require('mongoose');

const SafeZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['police_station', 'hospital', 'fire_station', 'ngo', 'shelter', 'public_safe_zone'],
      required: true,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: String,
    },
    phone: String,
    isActive: { type: Boolean, default: true },
    operatingHours: { type: String, default: '24/7' },
    description: String,
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

SafeZoneSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SafeZone', SafeZoneSchema);
