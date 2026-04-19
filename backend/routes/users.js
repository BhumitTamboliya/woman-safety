// routes/users.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateLocation, getAlertHistory } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/location', updateLocation);
router.get('/alert-history', getAlertHistory);
module.exports = router;
