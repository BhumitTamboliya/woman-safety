const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'volunteer', 'admin'],
      default: 'user',
    },
    profilePhoto: {
      type: String,
      default: null,
    },

    // ── Extra fields from registration ──────────────────
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Female', 'Male', 'Other', null],
      default: null,
    },
    defaultEmergencyMsg: {
      type: String,
      default: 'Help! I am in danger. Please reach out.',
      maxlength: 300,
    },

    // ── Address ──────────────────────────────────────────
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      full: String, // full address string from registration
    },

    // ── Medical ──────────────────────────────────────────
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
      default: null,
    },
    medicalInfo: {
      type: String,
      maxlength: 500,
    },

    // ── Status ───────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Location ─────────────────────────────────────────
    lastLocation: {
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

    // ── Auth tokens ──────────────────────────────────────
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // ── Stats ─────────────────────────────────────────────
    alertCount: {
      type: Number,
      default: 0,
    },
    lastAlertAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for geospatial queries
UserSchema.index({ lastLocation: '2dsphere' });

// Virtual for emergency contacts
UserSchema.virtual('emergencyContacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'user',
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);