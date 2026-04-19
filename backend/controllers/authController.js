const User = require("../models/User");
const Volunteer = require("../models/Volunteer");
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// ─── Email Helper ────────────────────────────────────────────────
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME} 🛡️" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email failed:`, err.message);
  }
};

// ─── JWT Helper ──────────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
};

// @desc Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, userData, volunteerData } =
      req.body;
    const assignedRole = role === "admin" ? "user" : role || "user";
    const userPayload = { name, email, phone, password, role: assignedRole };

    if (assignedRole === "user" && userData) {
      if (userData.age) userPayload.age = userData.age;
      if (userData.gender) userPayload.gender = userData.gender;
      if (userData.bloodGroup) userPayload.bloodGroup = userData.bloodGroup;
      if (userData.address) userPayload.address = { full: userData.address };
      if (userData.defaultEmergencyMsg)
        userPayload.defaultEmergencyMsg = userData.defaultEmergencyMsg;
    }

    const user = await User.create(userPayload);

    if (assignedRole === "user" && userData?.emergencyContacts?.length > 0) {
      const contactsToSave = userData.emergencyContacts
        .filter((c) => c.name && c.phone)
        .map((c, i) => ({
          user: user._id,
          name: c.name,
          phone: c.phone,
          relation: c.relation || "other",
          isPrimary: i === 0,
        }));
      if (contactsToSave.length > 0) await Contact.insertMany(contactsToSave);
    }

    if (assignedRole === "volunteer") {
      const vp = { user: user._id };
      if (volunteerData?.skills?.length > 0) {
        const sm = {
          "Medical Help": "medical",
          "Self Defense": "security",
          "General Support": "counseling",
          Counseling: "counseling",
          Transport: "transport",
        };
        vp.specializations = volunteerData.skills
          .map((s) => sm[s])
          .filter(Boolean);
      }
      if (volunteerData?.experience) vp.bio = volunteerData.experience;
      await Volunteer.create(vp);
    }

    // Welcome email
    sendEmail(
      user.email,
      "🛡️ Welcome to SafeGuard!",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#ff2d55,#8b0000);padding:30px;text-align:center;">
          <h1 style="color:white;margin:0;">Welcome to SafeGuard! 🛡️</h1>
        </div>
        <div style="padding:30px;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been created successfully!</p>
          <div style="background:#fff5f7;border:2px solid #ff2d55;border-radius:10px;padding:20px;margin:20px 0;">
            <p>📧 Email: ${email}</p>
            <p>📞 Phone: ${phone}</p>
            <p>👤 Role: ${assignedRole}</p>
          </div>
          <p>Stay safe and stay connected!</p>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#999;font-size:12px;">SafeGuard — Women Safety Platform</div>
      </div>
    `,
    );

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    if (!user.isActive)
      return res
        .status(401)
        .json({
          success: false,
          message: "Account deactivated. Contact support.",
        });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc Logout
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc Get me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("emergencyContacts");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!(await user.matchPassword(req.body.currentPassword)))
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc Forgot password — send reset email
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No user with that email" });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "🔑 SafeGuard — Password Reset Request",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#ff2d55,#8b0000);padding:30px;text-align:center;">
          <h1 style="color:white;margin:0;">Password Reset 🔑</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">SafeGuard — Women Safety Platform</p>
        </div>
        <div style="padding:30px;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below:</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${resetUrl}" style="background:linear-gradient(135deg,#ff2d55,#c0002a);color:white;text-decoration:none;padding:15px 40px;border-radius:10px;font-size:16px;font-weight:bold;display:inline-block;">
              🔑 Reset My Password
            </a>
          </div>
          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px;">
            <p style="margin:0;color:#856404;font-size:13px;">⚠️ This link expires in <strong>10 minutes</strong>. If you did not request this, ignore this email.</p>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#999;font-size:12px;">SafeGuard — Women Safety Platform</div>
      </div>
    `,
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset email sent! Check your inbox.",
      });
  } catch (err) {
    next(err);
  }
};

// @desc Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const crypto = require("crypto");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendEmail(
      user.email,
      "✅ Password Changed Successfully",
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#00d68f,#007a4d);padding:30px;text-align:center;">
          <h1 style="color:white;margin:0;">Password Changed! ✅</h1>
        </div>
        <div style="padding:30px;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your SafeGuard password has been changed successfully.</p>
          <p style="color:#e53935;">If you did not make this change, contact us immediately!</p>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#999;font-size:12px;">SafeGuard — Women Safety Platform</div>
      </div>
    `,
    );

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
