import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent! Check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fp-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 30%, #e8d5f5 70%, #d4b8f0 100%); padding: 24px; }
        .fp-card { background: #fff; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .fp-icon { font-size: 48px; text-align: center; margin-bottom: 16px; }
        .fp-title { font-size: 26px; font-weight: 700; color: #1a1a2e; text-align: center; margin-bottom: 8px; }
        .fp-subtitle { font-size: 14px; color: #999; text-align: center; margin-bottom: 28px; }
        .fp-input { width: 100%; padding: 14px 16px; border: 1.5px solid #ebebeb; border-radius: 12px; font-size: 14px; font-family: 'Poppins', sans-serif; color: #333; background: #fafafa; outline: none; transition: all 0.2s; margin-bottom: 16px; }
        .fp-input:focus { border-color: #e91e8c; box-shadow: 0 0 0 3px rgba(233,30,140,0.08); }
        .fp-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #e91e8c, #c2185b); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(233,30,140,0.35); margin-bottom: 16px; }
        .fp-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .fp-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .fp-back { text-align: center; font-size: 13px; color: #999; }
        .fp-back a { color: #e91e8c; font-weight: 600; text-decoration: none; }
        .success-box { background: #f1f8e9; border: 2px solid #4caf50; border-radius: 14px; padding: 24px; text-align: center; }
        .success-icon { font-size: 48px; margin-bottom: 12px; }
        .success-title { font-size: 20px; font-weight: 700; color: #2e7d32; margin-bottom: 8px; }
        .success-msg { font-size: 14px; color: #555; line-height: 1.6; }
      `}</style>

      <div className="fp-page">
        <div className="fp-card">
          {!sent ? (
            <>
              <div className="fp-icon">🔑</div>
              <h1 className="fp-title">Forgot Password?</h1>
              <p className="fp-subtitle">Enter your email and we'll send you a reset link</p>

              <form onSubmit={handleSubmit}>
                <input
                  className="fp-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? 'Sending...' : '📧 Send Reset Link'}
                </button>
              </form>

              <div className="fp-back">
                Remember password? <Link to="/login">Sign in</Link>
              </div>
            </>
          ) : (
            <div className="success-box">
              <div className="success-icon">📧</div>
              <div className="success-title">Email Sent!</div>
              <p className="success-msg">
                We sent a password reset link to <strong>{email}</strong>.<br /><br />
                Check your inbox and click the link to reset your password.<br />
                Link expires in <strong>10 minutes</strong>.
              </p>
              <br />
              <div className="fp-back">
                <Link to="/login">← Back to Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;