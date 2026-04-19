const Alert = require('../models/Alert');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// ─── Email Transporter ───────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// ─── Send SOS Email to Emergency Contacts ───────────────────────
const sendSOSEmail = async (contact, user, location, alertId) => {
  try {
    const transporter = createTransporter();

    const mapsLink = `https://www.google.com/maps?q=${location.coordinates[1]},${location.coordinates[0]}`;
    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ff2d55, #8b0000); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 2px; }
          .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
          .alert-badge { background: #ff2d55; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin: 20px auto; }
          .body { padding: 30px; }
          .info-box { background: #fff5f7; border: 2px solid #ff2d55; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; margin-bottom: 12px; }
          .info-label { font-weight: bold; color: #666; width: 140px; flex-shrink: 0; }
          .info-value { color: #333; }
          .map-btn { display: block; background: linear-gradient(135deg, #ff2d55, #c0002a); color: white; text-decoration: none; padding: 15px 30px; border-radius: 10px; text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0; }
          .emergency-numbers { background: #f8f8f8; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .emergency-numbers h3 { margin: 0 0 12px; color: #333; }
          .num-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 13px; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 EMERGENCY SOS ALERT</h1>
            <p>SafeGuard — Women Safety Platform</p>
          </div>
          
          <div class="body">
            <div style="text-align:center">
              <div class="alert-badge">⚠️ URGENT — IMMEDIATE ACTION REQUIRED</div>
            </div>

            <p style="font-size:16px; color:#333;">
              Dear <strong>${contact.name}</strong>,
            </p>
            <p style="color:#555; line-height:1.6;">
              <strong style="color:#ff2d55;">${user.name}</strong> has triggered an emergency SOS alert 
              and may need your immediate assistance. Please try to contact them right away.
            </p>

            <div class="info-box">
              <div class="info-row">
                <span class="info-label">👤 Person:</span>
                <span class="info-value"><strong>${user.name}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">📞 Phone:</span>
                <span class="info-value"><strong>${user.phone}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">📍 Location:</span>
                <span class="info-value">${location.address || 'Location coordinates shared below'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">🕐 Time:</span>
                <span class="info-value">${time} (IST)</span>
              </div>
              ${user.bloodGroup ? `
              <div class="info-row">
                <span class="info-label">🩸 Blood Group:</span>
                <span class="info-value">${user.bloodGroup}</span>
              </div>` : ''}
              ${user.medicalInfo ? `
              <div class="info-row">
                <span class="info-label">⚕️ Medical Info:</span>
                <span class="info-value">${user.medicalInfo}</span>
              </div>` : ''}
            </div>

            <a href="${mapsLink}" class="map-btn" target="_blank">
              📍 View Live Location on Google Maps
            </a>

            <div class="warning">
              ⚠️ <strong>Important:</strong> Nearby volunteers and emergency services have also been notified. 
              Please try to reach ${user.name} immediately or contact local authorities if needed.
            </div>

            <div class="emergency-numbers">
              <h3>🆘 Emergency Numbers</h3>
              <div class="num-row"><span>Police</span><strong>100</strong></div>
              <div class="num-row"><span>Ambulance</span><strong>108</strong></div>
              <div class="num-row"><span>Women Helpline</span><strong>1091</strong></div>
              <div class="num-row"><span>Emergency</span><strong>112</strong></div>
            </div>
          </div>

          <div class="footer">
            <p>This alert was sent by <strong>SafeGuard — Women Safety Platform</strong></p>
            <p>Alert ID: ${alertId} | Do not reply to this email</p>
            <p style="color:#ff2d55;">Stay safe. Act fast. Save lives.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME} 🛡️" <${process.env.FROM_EMAIL}>`,
      to: contact.email,
      subject: `🚨 URGENT: ${user.name} needs help! Emergency SOS Alert`,
      html: htmlContent,
    });

    console.log(`✅ SOS Email sent to ${contact.name} (${contact.email})`);
    return true;
  } catch (err) {
    console.error(`❌ Email failed to ${contact.email}:`, err.message);
    return false;
  }
};

// ─── Helper: find nearby volunteers ─────────────────────────────
const findNearbyVolunteers = async (coordinates, radiusMeters = 5000) => {
  return await Volunteer.find({
    verificationStatus: 'verified',
    availability: 'available',
    isActive: true,
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: radiusMeters,
      },
    },
  })
    .populate('user', 'name phone email')
    .limit(10);
};

// @desc    Trigger SOS alert
// @route   POST /api/alerts/sos
// @access  Private (user)
exports.triggerSOS = async (req, res, next) => {
  try {
    const { longitude, latitude, address, message } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Location coordinates are required' });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];

    // Create alert
    const alert = await Alert.create({
      user: req.user.id,
      type: 'sos',
      status: 'active',
      location: { type: 'Point', coordinates, address },
      locationHistory: [{ coordinates, timestamp: new Date() }],
      message,
      priority: 'critical',
    });

    // Update user's alert count and last location
    await User.findByIdAndUpdate(req.user.id, {
      alertCount: req.user.alertCount + 1,
      lastAlertAt: new Date(),
      lastLocation: { type: 'Point', coordinates },
    });

    // Find nearby volunteers
    const nearbyVolunteers = await findNearbyVolunteers(coordinates);
    const volunteerIds = nearbyVolunteers.map((v) => v.user._id);

    // Update alert with notified volunteers
    alert.notifiedVolunteers = volunteerIds;
    await alert.save();

    // Get emergency contacts with email
    const contacts = await Contact.find({ user: req.user.id });

    // Get full user details for email
    const fullUser = await User.findById(req.user.id).select('name phone bloodGroup medicalInfo');

    // ── Send emails to emergency contacts ──────────────────────
    const contactsWithEmail = contacts.filter(c => c.email);
    const emailPromises = contactsWithEmail.map(contact =>
      sendSOSEmail(contact, fullUser, { coordinates, address }, alert._id)
    );

    // Send emails in background (don't wait)
    Promise.allSettled(emailPromises).then(results => {
      const sent = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
      console.log(`📧 Emails sent: ${sent}/${contactsWithEmail.length}`);
    });

    // Emit Socket.io events
    const io = req.app.get('io');

    // Notify each nearby volunteer
    nearbyVolunteers.forEach((volunteer) => {
      io.to(volunteer.user._id.toString()).emit('newAlert', {
        alertId: alert._id,
        user: { name: req.user.name, phone: req.user.phone },
        location: { coordinates, address },
        message,
        priority: 'critical',
        timestamp: alert.createdAt,
      });
    });

    // Broadcast to volunteer room
    io.to('volunteers_all').emit('newAlert', {
      alertId: alert._id,
      location: { coordinates, address },
      priority: 'critical',
    });

    // Notify admin
    io.to('admins').emit('newEmergency', {
      alertId: alert._id,
      userId: req.user.id,
      userName: req.user.name,
      location: { coordinates, address },
      timestamp: alert.createdAt,
    });

    res.status(201).json({
      success: true,
      message: 'SOS alert triggered successfully',
      data: {
        alertId: alert._id,
        status: alert.status,
        nearbyVolunteers: nearbyVolunteers.length,
        contactsNotified: contacts.length,
        emailsSent: contactsWithEmail.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update live location during emergency
// @route   PUT /api/alerts/:id/location
// @access  Private (user)
exports.updateLocation = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    if (alert.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (alert.status === 'resolved' || alert.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Alert is no longer active' });

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    alert.location.coordinates = coordinates;
    alert.locationHistory.push({ coordinates, timestamp: new Date() });
    await alert.save();

    const io = req.app.get('io');
    io.to(`alert_${alert._id}`).emit('userLocationUpdate', {
      alertId: alert._id, coordinates, timestamp: new Date(),
    });

    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all alerts (with filters)
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'user') query.user = req.user.id;
    if (req.user.role === 'volunteer') query.status = { $in: ['active', 'responding'] };

    const { status, limit = 20, page = 1 } = req.query;
    if (status) query.status = status;

    const alerts = await Alert.find(query)
      .populate('user', 'name phone')
      .populate('assignedResponder', 'name phone role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.status(200).json({
      success: true, count: alerts.length, total,
      pagination: { page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
      data: alerts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Private
exports.getAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('user', 'name phone email bloodGroup medicalInfo')
      .populate('assignedResponder', 'name phone role');
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.status(200).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
};

// @desc    Volunteer accepts alert
// @route   PUT /api/alerts/:id/accept
// @access  Private (volunteer)
exports.acceptAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    if (alert.status !== 'active')
      return res.status(400).json({ success: false, message: 'Alert is no longer available' });

    const respondedAt = new Date();
    const responseTime = Math.round((respondedAt - alert.createdAt) / 1000);

    alert.status = 'responding';
    alert.assignedResponder = req.user.id;
    alert.responderType = req.user.role === 'volunteer' ? 'volunteer' : 'support_team';
    alert.respondedAt = respondedAt;
    alert.responseTime = responseTime;
    await alert.save();

    await Volunteer.findOneAndUpdate({ user: req.user.id }, { availability: 'busy' });

    const io = req.app.get('io');
    io.to(alert.user.toString()).emit('responderAssigned', {
      alertId: alert._id,
      responder: { name: req.user.name, phone: req.user.phone },
      responseTime,
    });

    res.status(200).json({ success: true, message: 'Alert accepted', data: alert });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private (volunteer/admin)
exports.resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });

    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    alert.incidentReport = {
      description: req.body.description || '',
      outcome: req.body.outcome || 'Resolved',
      closedBy: req.user.id,
    };
    await alert.save();

    if (alert.assignedResponder) {
      await Volunteer.findOneAndUpdate({ user: alert.assignedResponder }, { availability: 'available' });
    }
    await Volunteer.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { totalResponses: 1, successfulResponses: 1 } }
    );

    const io = req.app.get('io');
    io.to(alert.user.toString()).emit('alertResolved', { alertId: alert._id });

    res.status(200).json({ success: true, message: 'Alert resolved', data: alert });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel alert (by user)
// @route   PUT /api/alerts/:id/cancel
// @access  Private (user)
exports.cancelAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    if (alert.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    alert.status = 'cancelled';
    alert.resolvedAt = new Date();
    await alert.save();

    const io = req.app.get('io');
    io.to('volunteers_all').emit('alertCancelled', { alertId: alert._id });

    res.status(200).json({ success: true, message: 'Alert cancelled' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get nearby alerts (for volunteers)
// @route   GET /api/alerts/nearby
// @access  Private (volunteer)
exports.getNearbyAlerts = async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 5000 } = req.query;
    if (!longitude || !latitude)
      return res.status(400).json({ success: false, message: 'Coordinates required' });

    const alerts = await Alert.find({
      status: 'active',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(radius),
        },
      },
    })
      .populate('user', 'name phone bloodGroup medicalInfo')
      .sort({ priority: -1, createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    next(err);
  }
};