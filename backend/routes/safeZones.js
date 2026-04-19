const express = require('express');
const router = express.Router();
const SafeZone = require('../models/SafeZone');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);

// Get nearby safe zones
router.get('/nearby', async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 5000 } = req.query;
    const zones = await SafeZone.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(radius),
        },
      },
    }).limit(10);
    res.status(200).json({ success: true, count: zones.length, data: zones });
  } catch (err) { next(err); }
});

// Admin: create safe zone
router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    req.body.addedBy = req.user.id;
    const zone = await SafeZone.create(req.body);
    res.status(201).json({ success: true, data: zone });
  } catch (err) { next(err); }
});

// Admin: delete safe zone
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await SafeZone.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Safe zone deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
