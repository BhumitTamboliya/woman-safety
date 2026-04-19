import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, fetchMe } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    medicalInfo: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        bloodGroup: user.bloodGroup || '',
        medicalInfo: user.medicalInfo || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        },
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.updateProfile(form);
      await fetchMe();
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="tab-content">
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
        <button
          className={editing ? 'btn-secondary btn-sm' : 'btn-primary btn-sm'}
          onClick={() => setEditing(!editing)}
        >
          {editing ? '✕ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {/* Profile Header Card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 24, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #ff2d55, #8b0000)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 700, color: '#fff',
          boxShadow: '0 0 20px rgba(255,45,85,0.4)',
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(0,214,143,0.15)', color: '#00d68f',
              border: '1px solid rgba(0,214,143,0.3)',
              borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700,
            }}>
              ● Active User
            </span>
            {user?.bloodGroup && (
              <span style={{
                background: 'rgba(255,45,85,0.15)', color: '#ff2d55',
                border: '1px solid rgba(255,45,85,0.3)',
                borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700,
              }}>
                🩸 {user.bloodGroup}
              </span>
            )}
            {user?.isVerified && (
              <span style={{
                background: 'rgba(26,115,232,0.15)', color: '#1a73e8',
                border: '1px solid rgba(26,115,232,0.3)',
                borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700,
              }}>
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Alert Count */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", color: '#ff2d55' }}>
            {user?.alertCount || 0}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Total Alerts</div>
        </div>
      </div>

      {/* Profile Form / View */}
      {editing ? (
        <form onSubmit={handleUpdate}>

          {/* Personal Info */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 20, marginBottom: 16,
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>
              Personal Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/, '').slice(0, 10) })} placeholder="10-digit phone" />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Medical Info (optional)</label>
                <input value={form.medicalInfo} onChange={e => setForm({ ...form, medicalInfo: e.target.value })} placeholder="Any medical conditions..." />
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 20, marginBottom: 20,
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>
              Address
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Street</label>
                <input value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} placeholder="Street address" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} placeholder="City" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={form.address.state} onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })} placeholder="State" />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input value={form.address.pincode} onChange={e => setForm({ ...form, address: { ...form.address, pincode: e.target.value.replace(/\D/, '').slice(0, 6) } })} placeholder="6-digit pincode" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </form>
      ) : (
        // View Mode
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Personal Info View */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Full Name', value: user?.name, icon: '👤' },
                { label: 'Email', value: user?.email, icon: '✉️' },
                { label: 'Phone', value: user?.phone, icon: '📞' },
                { label: 'Blood Group', value: user?.bloodGroup || 'Not set', icon: '🩸' },
                { label: 'Medical Info', value: user?.medicalInfo || 'None', icon: '⚕️' },
                { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', icon: '📅' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: 1 }}>
                    {item.icon} {item.label.toUpperCase()}
                  </div>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Address View */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>
              Address
            </h3>
            {user?.address?.city ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Street', value: user?.address?.street || 'Not set' },
                  { label: 'City', value: user?.address?.city || 'Not set' },
                  { label: 'State', value: user?.address?.state || 'Not set' },
                  { label: 'Pincode', value: user?.address?.pincode || 'Not set' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: 1 }}>
                      📍 {item.label.toUpperCase()}
                    </div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                No address added. Click Edit Profile to add your address.
              </div>
            )}
          </div>

          {/* Safety Info */}
          <div style={{
            background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)',
            borderRadius: 16, padding: 20,
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>
              Safety Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", color: '#ff2d55' }}>
                  {user?.alertCount || 0}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Total Alerts</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", color: '#00d68f' }}>
                  {user?.isVerified ? '✓' : '✗'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Verified</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", color: '#ff9900' }}>
                  {user?.lastAlertAt ? new Date(user.lastAlertAt).toLocaleDateString() : 'Never'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Last Alert</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;