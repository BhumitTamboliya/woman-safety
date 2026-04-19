import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const { resettoken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(resettoken, form.password);
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Reset failed. Link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .rp-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 30%, #e8d5f5 70%, #d4b8f0 100%); padding: 24px; }
        .rp-card { background: #fff; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .rp-icon { font-size: 48px; text-align: center; margin-bottom: 16px; }
        .rp-title { font-size: 26px; font-weight: 700; color: #1a1a2e; text-align: center; margin-bottom: 8px; }
        .rp-subtitle { font-size: 14px; color: #999; text-align: center; margin-bottom: 28px; }
        .ig { position: relative; margin-bottom: 16px; }
        .rp-input { width: 100%; padding: 14px 44px 14px 16px; border: 1.5px solid #ebebeb; border-radius: 12px; font-size: 14px; font-family: 'Poppins', sans-serif; color: #333; background: #fafafa; outline: none; transition: all 0.2s; }
        .rp-input:focus { border-color: #e91e8c; box-shadow: 0 0 0 3px rgba(233,30,140,0.08); }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; }
        .rp-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #e91e8c, #c2185b); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(233,30,140,0.35); margin-bottom: 16px; }
        .rp-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .rp-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .rp-back { text-align: center; font-size: 13px; color: #999; }
        .rp-back a { color: #e91e8c; font-weight: 600; text-decoration: none; }
        .success-box { background: #f1f8e9; border: 2px solid #4caf50; border-radius: 14px; padding: 24px; text-align: center; }
        .success-icon { font-size: 48px; margin-bottom: 12px; }
        .success-title { font-size: 20px; font-weight: 700; color: #2e7d32; margin-bottom: 8px; }
        .success-msg { font-size: 14px; color: #555; line-height: 1.6; }
      `}</style>

      <div className="rp-page">
        <div className="rp-card">
          {!done ? (
            <>
              <div className="rp-icon">🔐</div>
              <h1 className="rp-title">Reset Password</h1>
              <p className="rp-subtitle">Enter your new password below</p>

              <form onSubmit={handleSubmit}>
                <div className="ig">
                  <input
                    className="rp-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password (min 6 chars)"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="ig">
                  <input
                    className="rp-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="rp-btn" disabled={loading}>
                  {loading ? "Resetting..." : "🔑 Reset Password"}
                </button>
              </form>

              <div className="rp-back">
                <Link to="/login">← Back to Login</Link>
              </div>
            </>
          ) : (
            <div className="success-box">
              <div className="success-icon">✅</div>
              <div className="success-title">Password Reset!</div>
              <p className="success-msg">
                Your password has been changed successfully.
                <br />
                <br />
                Redirecting to login page in 3 seconds...
              </p>
              <br />
              <div className="rp-back">
                <Link to="/login">← Go to Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
