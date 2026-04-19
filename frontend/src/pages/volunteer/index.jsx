import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlertContext } from '../../context/AlertContext';
import { alertAPI, volunteerAPI } from '../../services/api';
import useGeolocation from '../../hooks/useGeolocation';
import { toast } from 'react-toastify';

import AlertsList from './AlertsList';
import VolunteerProfile from './VolunteerProfile';
import IncomingAlert from './IncomingAlert';
import VolunteerMap from './VolunteerMap';

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const { incomingAlert, setIncomingAlert } = useAlertContext();
  const { location } = useGeolocation();

  const [tab, setTab] = useState('alerts');
  const [nearbyAlerts, setNearbyAlerts] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [availability, setAvailability] = useState('offline');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  // Auto update location when it changes
  useEffect(() => {
    if (location) {
      updateMyLocation();
      if (availability === 'available') fetchNearbyAlerts();
    }
  }, [location, availability]);

  const fetchProfile = async () => {
    try {
      const { data } = await volunteerAPI.getMyProfile();
      setMyProfile(data.data);
      setAvailability(data.data.availability);
    } catch {}
  };

  const fetchNearbyAlerts = async () => {
    if (!location) return;
    try {
      const { data } = await alertAPI.getNearbyAlerts({
        longitude: location.longitude,
        latitude: location.latitude,
        radius: myProfile?.serviceRadius || 5000,
      });
      setNearbyAlerts(data.data || []);
    } catch {}
  };

  const updateMyLocation = async () => {
    if (!location) return;
    try {
      await volunteerAPI.updateLocation({
        longitude: location.longitude,
        latitude: location.latitude,
      });
    } catch {}
  };

  const toggleAvailability = async () => {
    const next = availability === 'available' ? 'offline' : 'available';
    try {
      await volunteerAPI.updateProfile({ availability: next });
      setAvailability(next);
      toast.success(`Status: ${next}`);
      if (next === 'available') fetchNearbyAlerts();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const acceptAlert = async (alertId) => {
    setLoading(true);
    try {
      await alertAPI.acceptAlert(alertId);
      toast.success("Alert accepted! Navigate to the user's location.");
      setIncomingAlert(null);
      fetchNearbyAlerts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept alert');
    } finally { setLoading(false); }
  };

  const resolveAlert = async (alertId) => {
    const description = window.prompt('Describe the incident outcome:');
    try {
      await alertAPI.resolveAlert(alertId, { description, outcome: 'Resolved' });
      toast.success('Alert resolved!');
      fetchNearbyAlerts();
    } catch { toast.error('Failed to resolve alert'); }
  };

  const navItems = [
    ['alerts', '🚨', 'Nearby Alerts'],
    ['map', '🗺️', 'Live Map'],
    ['profile', '👤', 'My Profile'],
  ];

  return (
    <div className="dashboard">
      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? '✕' : '☰'}
      </button>
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">🛡️ SafeGuard</div>
        <nav className="sidebar-nav">
          {navItems.map(([key, icon, label]) => (
            <button key={key}
              className={`nav-item ${tab === key ? 'active' : ''}`}
              onClick={() => { setTab(key); setMobileMenuOpen(false); }}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div className="availability-toggle">
          <span>Status:</span>
          <button
            className={`toggle-btn ${availability === 'available' ? 'on' : 'off'}`}
            onClick={toggleAvailability}
          >
            {availability === 'available' ? '● AVAILABLE' : '○ OFFLINE'}
          </button>
        </div>

        {nearbyAlerts.length > 0 && (
          <div style={{
            background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.3)',
            borderRadius: 10, padding: '8px 12px', margin: '8px 0',
            color: '#ff2d55', fontSize: 12, fontWeight: 700, textAlign: 'center',
          }}>
            🚨 {nearbyAlerts.length} Alert{nearbyAlerts.length > 1 ? 's' : ''} Nearby!
          </div>
        )}

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">Volunteer</div>
          </div>
          <button className="btn-logout" onClick={logout}>↩</button>
        </div>
      </aside>

      <main className="main-content">
        <IncomingAlert
          incomingAlert={incomingAlert}
          onAccept={acceptAlert}
          onDecline={() => setIncomingAlert(null)}
          loading={loading}
        />

        {tab === 'alerts' && (
          <AlertsList
            nearbyAlerts={nearbyAlerts}
            availability={availability}
            onAccept={acceptAlert}
            onResolve={resolveAlert}
            onRefresh={fetchNearbyAlerts}
            loading={loading}
            user={user}
          />
        )}
        {tab === 'map' && <VolunteerMap location={location} nearbyAlerts={nearbyAlerts} />}
        {tab === 'profile' && <VolunteerProfile user={user} myProfile={myProfile} />}
      </main>
    </div>
  );
};

export default VolunteerDashboard;