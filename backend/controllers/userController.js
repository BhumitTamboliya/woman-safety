const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('emergencyContacts');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'address', 'bloodGroup', 'medicalInfo', 'profilePhoto'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
exports.updateLocation = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      lastLocation: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });
    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get alert history for logged-in user
// @route   GET /api/users/alert-history
// @access  Private
exports.getAlertHistory = async (req, res, next) => {
  try {
    const Alert = require('../models/Alert');
    const alerts = await Alert.find({ user: req.user.id })
      .populate('assignedResponder', 'name role')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    next(err);
  }
};
