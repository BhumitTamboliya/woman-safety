const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    relation: {
      type: String,
      enum: ['family', 'friend', 'colleague', 'neighbor', 'other'],
      default: 'other',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Max 5 contacts per user
ContactSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({ user: this.user });
    if (count >= 5) {
      const error = new Error('Maximum 5 emergency contacts allowed');
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Contact', ContactSchema);
