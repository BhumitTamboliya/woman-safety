const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    idProofType: {
      type: String,
      enum: ['aadhar', 'pan', 'passport', 'driving_license'],
    },
    idProofNumber: String,
    idProofDocument: String, // URL to uploaded doc
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    serviceRadius: {
      type: Number,
      default: 5000, // 5km in meters
    },
    specializations: [
      {
        type: String,
        enum: ['first_aid', 'counseling', 'transport', 'legal', 'medical', 'security'],
      },
    ],
    totalResponses: { type: Number, default: 0 },
    successfulResponses: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    bio: { type: String, maxlength: 300 },
    organization: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

VolunteerSchema.index({ currentLocation: '2dsphere' });
VolunteerSchema.index({ availability: 1, verificationStatus: 1 });

module.exports = mongoose.model('Volunteer', VolunteerSchema);
