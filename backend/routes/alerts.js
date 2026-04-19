const express = require('express');
const router = express.Router();
const {
  triggerSOS, updateLocation, getAlerts, getAlert,
  acceptAlert, resolveAlert, cancelAlert, getNearbyAlerts,
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/sos', triggerSOS);
router.get('/nearby', authorize('volunteer', 'admin'), getNearbyAlerts);
router.get('/', getAlerts);
router.get('/:id', getAlert);
router.put('/:id/location', updateLocation);
router.put('/:id/accept', authorize('volunteer', 'admin'), acceptAlert);
router.put('/:id/resolve', authorize('volunteer', 'admin'), resolveAlert);
router.put('/:id/cancel', cancelAlert);

module.exports = router;
