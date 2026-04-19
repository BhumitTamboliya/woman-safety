const Volunteer = require('../models/Volunteer');

// @desc    Get volunteer profile
// @route   GET /api/volunteers/me
// @access  Private (volunteer)
exports.getMyProfile = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user.id }).populate('user', 'name email phone');
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    res.status(200).json({ success: true, data: volunteer });
  } catch (err) {
    next(err);
  }
};

// @desc    Update volunteer profile / availability
// @route   PUT /api/volunteers/me
// @access  Private (volunteer)
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['availability', 'serviceRadius', 'specializations', 'bio', 'organization', 'currentLocation'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const volunteer = await Volunteer.findOneAndUpdate({ user: req.user.id }, updates, {
      new: true, runValidators: true,
    });

    res.status(200).json({ success: true, data: volunteer });
  } catch (err) {
    next(err);
  }
};

// @desc    Update volunteer location
// @route   PUT /api/volunteers/location
// @access  Private (volunteer)
exports.updateLocation = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    await Volunteer.findOneAndUpdate(
      { user: req.user.id },
      { currentLocation: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] } }
    );
    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get nearby volunteers (public for users to see)
// @route   GET /api/volunteers/nearby
// @access  Private
exports.getNearbyVolunteers = async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 5000 } = req.query;
    if (!longitude || !latitude)
      return res.status(400).json({ success: false, message: 'Coordinates required' });

    const volunteers = await Volunteer.find({
      verificationStatus: 'verified',
      availability: 'available',
      isActive: true,
      currentLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(radius),
        },
      },
    })
      .populate('user', 'name phone')
      .select('user rating totalResponses specializations availability serviceRadius')
      .limit(10);

    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (err) {
    next(err);
  }
};
