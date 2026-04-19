import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      toast.success(`Welcome back, ${data.user.name}! 💚`);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'volunteer') navigate('/volunteer');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Poppins', sans-serif;
          background: #fff;
        }

        /* ── LEFT SIDE ── */
        .login-left {
          flex: 1;
          background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 30%, #e8d5f5 70%, #d4b8f0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: ''; position: absolute;
          width: 400px; height: 400px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%; top: -100px; left: -100px;
        }
        .login-left::after {
          content: ''; position: absolute;
          width: 300px; height: 300px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%; bottom: -80px; right: -80px;
        }

        .login-brand {
          display: flex; align-items: center; gap: 10px;
          position: absolute; top: 30px; left: 30px; z-index: 2;
        }
        .login-brand-text { font-size: 15px; font-weight: 700; color: #c2185b; }

        .login-illustration { position: relative; z-index: 2; width: 100%; max-width: 360px; }

        .float-badge {
          position: absolute; background: white; border-radius: 50px;
          padding: 10px 18px; display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: #333;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1); z-index: 3;
          animation: floatUp 3s ease-in-out infinite;
        }
        .float-badge-1 { top: 22%; right: 6%; animation-delay: 0s; }
        .float-badge-2 { top: 36%; right: 6%; animation-delay: 0.5s; }

        .float-heart { position: absolute; font-size: 24px; animation: floatUp 4s ease-in-out infinite; z-index: 3; }
        .heart-1 { bottom: 25%; right: 10%; animation-delay: 0s; }
        .heart-2 { bottom: 38%; left: 8%; animation-delay: 1s; font-size: 16px; }
        .heart-3 { top: 22%; left: 6%; animation-delay: 2s; font-size: 18px; }
        .float-pin { position: absolute; bottom: 14%; left: 10%; font-size: 32px; animation: floatUp 3.5s ease-in-out infinite; z-index: 3; }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* ── RIGHT SIDE ── */
        .login-right {
          width: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 60px;
          background: #fff;
        }

        .login-form-box { width: 100%; }

        .login-title { font-size: 34px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
        .login-subtitle { font-size: 14px; color: #999; margin-bottom: 36px; }

        .input-group { position: relative; margin-bottom: 20px; }
        .input-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); font-size: 17px; color: #bbb;
        }
        .login-input {
          width: 100%; padding: 15px 16px 15px 48px;
          border: 1.5px solid #ebebeb; border-radius: 12px;
          font-size: 14px; font-family: 'Poppins', sans-serif;
          color: #333; background: #fafafa; outline: none; transition: all 0.2s;
        }
        .login-input:focus {
          border-color: #e91e8c; background: #fff;
          box-shadow: 0 0 0 3px rgba(233,30,140,0.08);
        }
        .input-eye {
          position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%); cursor: pointer;
          color: #bbb; font-size: 17px; background: none; border: none; padding: 0;
        }

        .login-options {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 28px; font-size: 13px;
        }
        .remember-label { display: flex; align-items: center; gap: 8px; color: #666; cursor: pointer; }
        .remember-label input { width: 16px; height: 16px; accent-color: #e91e8c; cursor: pointer; }
        .forgot-link { color: #e91e8c; font-weight: 600; text-decoration: none; }
        .forgot-link:hover { text-decoration: underline; }

        .login-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #e91e8c, #c2185b);
          color: white; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 600; font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(233,30,140,0.35);
          margin-bottom: 22px;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(233,30,140,0.45);
        }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .register-link { text-align: center; font-size: 13px; color: #999; margin-bottom: 28px; }
        .register-link a { color: #e91e8c; font-weight: 600; text-decoration: none; }
        .register-link a:hover { text-decoration: underline; }

        .demo-section {
          background: #fafafa; border: 1px solid #f0f0f0;
          border-radius: 14px; padding: 18px; text-align: center;
        }
        .demo-label {
          font-size: 11px; color: #bbb; font-weight: 600;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;
        }
        .demo-btns { display: flex; gap: 10px; justify-content: center; }
        .demo-btn {
          padding: 8px 16px; border-radius: 20px;
          border: 1.5px solid #ebebeb; background: #fff;
          font-size: 12px; font-weight: 600; color: #555;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .demo-btn:hover { border-color: #e91e8c; color: #e91e8c; background: #fce4ec; }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 30px 24px; }
        }
      `}</style>

      <div className="login-page">
        {/* ── LEFT SIDE ── */}
        <div className="login-left">
          <div className="login-brand">
            <span style={{ fontSize: 22 }}>📍</span>
            <span className="login-brand-text">Women Safety Emergency Platform</span>
            <span style={{ fontSize: 18 }}>🛡️</span>
          </div>

          <div className="float-badge float-badge-1">
            <span>❤️</span> Safe & Secure <span style={{ color: '#4caf50', fontWeight: 700 }}>✓</span>
          </div>
          <div className="float-badge float-badge-2">
            <span>🛡️</span> Verified Platform <span style={{ color: '#4caf50', fontWeight: 700 }}>✓</span>
          </div>

          <div className="float-heart heart-1">❤️</div>
          <div className="float-heart heart-2">💕</div>
          <div className="float-heart heart-3">💗</div>
          <div className="float-pin">📍</div>

          <div className="login-illustration">
            <svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="230" r="180" fill="rgba(255,255,255,0.3)" />
              <ellipse cx="200" cy="365" rx="72" ry="30" fill="#f8bbd9" opacity="0.5" />
              <path d="M150 285 Q200 325 250 285 L265 382 Q200 402 135 382 Z" fill="#e91e8c" opacity="0.85" />
              <rect x="163" y="218" width="74" height="78" rx="12" fill="#c2185b" />
              <path d="M163 238 Q125 262 112 295" stroke="#f3a0b5" strokeWidth="20" strokeLinecap="round" fill="none" />
              <path d="M237 238 Q275 262 288 295" stroke="#f3a0b5" strokeWidth="20" strokeLinecap="round" fill="none" />
              <circle cx="200" cy="172" r="58" fill="#f3a0b5" />
              <path d="M145 158 Q147 105 200 100 Q253 105 255 158 Q242 127 200 122 Q158 127 145 158 Z" fill="#3d1a33" />
              <path d="M145 158 Q130 202 136 234" stroke="#3d1a33" strokeWidth="22" strokeLinecap="round" fill="none" />
              <path d="M255 158 Q270 202 264 234" stroke="#3d1a33" strokeWidth="22" strokeLinecap="round" fill="none" />
              <circle cx="182" cy="176" r="7" fill="#fff" />
              <circle cx="218" cy="176" r="7" fill="#fff" />
              <circle cx="184" cy="178" r="3.5" fill="#222" />
              <circle cx="220" cy="178" r="3.5" fill="#222" />
              <path d="M187 200 Q200 214 213 200" stroke="#c2185b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="174" cy="192" r="9" fill="#ffb3c6" opacity="0.55" />
              <circle cx="226" cy="192" r="9" fill="#ffb3c6" opacity="0.55" />
              <rect x="104" y="280" width="26" height="42" rx="5" fill="#222" />
              <rect x="107" y="284" width="20" height="30" rx="3" fill="#42a5f5" />
              <circle cx="117" cy="317" r="2" fill="#fff" opacity="0.8" />
              <path d="M258 270 Q276 265 278 267 Q292 280 278 300 Q269 308 258 311 Q247 308 238 300 Q224 280 238 267 Z" fill="#e91e8c" opacity="0.9" />
              <text x="258" y="295" textAnchor="middle" fontSize="15" fill="white" fontFamily="Arial">🛡</text>
              <rect x="177" y="378" width="19" height="52" rx="9" fill="#f3a0b5" />
              <rect x="204" y="378" width="19" height="52" rx="9" fill="#f3a0b5" />
              <ellipse cx="186" cy="428" rx="17" ry="8" fill="#c2185b" />
              <ellipse cx="213" cy="428" rx="17" ry="8" fill="#c2185b" />
              <circle cx="75" cy="148" r="6" fill="#e91e8c" opacity="0.4" />
              <circle cx="325" cy="148" r="4" fill="#c2185b" opacity="0.3" />
              <circle cx="85" cy="325" r="5" fill="#e91e8c" opacity="0.3" />
              <circle cx="315" cy="335" r="7" fill="#f48fb1" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="login-right">
          <div className="login-form-box">
            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">Login to your account</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Email or Phone"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="input-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="login-options">
                <label className="remember-label">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="register-link">
              New user? <Link to="/register">Register here</Link>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;