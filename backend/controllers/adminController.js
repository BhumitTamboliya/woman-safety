const User = require('../models/User');
const Alert = require('../models/Alert');
const Volunteer = require('../models/Volunteer');
const SafeZone = require('../models/SafeZone');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalVolunteers,
      totalAlerts,
      activeAlerts,
      todayAlerts,
      monthAlerts,
      resolvedAlerts,
      avgResponseTime,
    ] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      Volunteer.countDocuments({ verificationStatus: 'verified', isActive: true }),
      Alert.countDocuments(),
      Alert.countDocuments({ status: 'active' }),
      Alert.countDocuments({ createdAt: { $gte: todayStart } }),
      Alert.countDocuments({ createdAt: { $gte: monthStart } }),
      Alert.countDocuments({ status: 'resolved' }),
      Alert.aggregate([
        { $match: { responseTime: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$responseTime' } } },
      ]),
    ]);

    const successRate =
      totalAlerts > 0 ? ((resolvedAlerts / totalAlerts) * 100).toFixed(1) : 0;

    const avgTime =
      avgResponseTime.length > 0
        ? `${Math.floor(avgResponseTime[0].avg / 60)}m ${Math.round(avgResponseTime[0].avg % 60)}s`
        : 'N/A';

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers },
        volunteers: { total: totalVolunteers },
        alerts: {
          total: totalAlerts,
          active: activeAlerts,
          today: todayAlerts,
          thisMonth: monthAlerts,
          resolved: resolvedAlerts,
          successRate: `${successRate}%`,
          avgResponseTime: avgTime,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({ success: true, count: users.length, total, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or suspend a volunteer
// @route   PUT /api/admin/volunteers/:id/verify
// @access  Private (admin)
exports.verifyVolunteer = async (req, res, next) => {
  try {
    const { status } = req.body; // 'verified' | 'rejected' | 'suspended'
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });

    volunteer.verificationStatus = status;
    volunteer.verifiedBy = req.user.id;
    volunteer.verifiedAt = new Date();
    await volunteer.save();

    res.status(200).json({ success: true, message: `Volunteer ${status}`, data: volunteer });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private (admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all volunteers (pending verification)
// @route   GET /api/admin/volunteers
// @access  Private (admin)
exports.getAllVolunteers = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const volunteers = await Volunteer.find({ verificationStatus: status })
      .populate('user', 'name email phone createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Volunteer.countDocuments({ verificationStatus: status });
    res.status(200).json({ success: true, count: volunteers.length, total, data: volunteers });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate incident report
// @route   GET /api/admin/reports
// @access  Private (admin)
exports.getReports = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const matchQuery = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const [byStatus, byType, byDay] = await Promise.all([
      Alert.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Alert.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Alert.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
    ]);

    res.status(200).json({ success: true, data: { byStatus, byType, byDay } });
  } catch (err) {
    next(err);
  }
};
