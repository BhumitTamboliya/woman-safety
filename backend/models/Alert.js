const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['sos', 'follow_me', 'fake_call', 'check_in'],
      default: 'sos',
    },
    status: {
      type: String,
      enum: ['active', 'responding', 'resolved', 'cancelled', 'expired'],
      default: 'active',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: String,
    },
    locationHistory: [
      {
        coordinates: [Number],
        timestamp: { type: Date, default: Date.now },
      },
    ],
    assignedResponder: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null,
    },
    responderType: {
      type: String,
      enum: ['volunteer', 'support_team', 'authority', null],
      default: null,
    },
    respondedAt: Date,
    resolvedAt: Date,
    responseTime: Number, // in seconds
    message: {
      type: String,
      maxlength: 500,
    },
    notifiedContacts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Contact',
      },
    ],
    notifiedVolunteers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    incidentReport: {
      description: String,
      outcome: String,
      closedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AlertSchema.index({ location: '2dsphere' });
AlertSchema.index({ status: 1, createdAt: -1 });
AlertSchema.index({ user: 1, createdAt: -1 });

// Auto-expire active alerts after 2 hours
AlertSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200, partialFilterExpression: { status: 'active' } });

module.exports = mongoose.model('Alert', AlertSchema);
