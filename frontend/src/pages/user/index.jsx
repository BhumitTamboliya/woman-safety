import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlertContext } from '../../context/AlertContext';
import { alertAPI, contactAPI, volunteerAPI, safeZoneAPI, userAPI } from '../../services/api';
import { sendLocationUpdate } from '../../services/socket';
import useGeolocation from '../../hooks/useGeolocation';

// Page Components
import Home from './Home';
import Map from './Map';
import Contacts from './Contacts';
import Volunteers from './Volunteers';
import SafeZones from './SafeZones';
import History from './History';
import Profile from './Profile';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { activeAlert, setActiveAlert, responderInfo } = useAlertContext();
  const { location, getLocation } = useGeolocation();

  const [contacts, setContacts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [tab, setTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchAlertHistory();
  }, []);

  // When location changes — update backend + fetch nearby data
  useEffect(() => {
    if (location) {
      fetchNearbyData();
      updateLocationOnBackend();
    }
  }, [location]);

  // Watch location during active alert
  useEffect(() => {
    let watchId;
    if (activeAlert) {
      watchId = navigator.geolocation?.watchPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          alertAPI.updateLocation(activeAlert._id, { longitude: coords.longitude, latitude: coords.latitude });
          sendLocationUpdate(activeAlert._id, coords);
        },
        null,
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [activeAlert]);

  const updateLocationOnBackend = async () => {
    if (!location) return;
    try {
      await userAPI.updateLocation({
        longitude: location.longitude,
        latitude: location.latitude,
      });
    } catch {}
  };

  const fetchContacts = async () => {
    try { const { data } = await contactAPI.getContacts(); setContacts(data.data); } catch {}
  };

  const fetchAlertHistory = async () => {
    try { const { data } = await alertAPI.getAlerts(); setAlertHistory(data.data?.slice(0, 5) || []); } catch {}
  };

  const fetchNearbyData = async () => {
    if (!location) return;
    const params = { longitude: location.longitude, latitude: location.latitude };
    try {
      const [volRes, zoneRes] = await Promise.all([
        volunteerAPI.getNearby(params),
        safeZoneAPI.getNearby(params),
      ]);
      setVolunteers(volRes.data.data || []);
      setSafeZones(zoneRes.data.data || []);
    } catch {}
  };

  const cancelSOS = async () => {
    if (!activeAlert?._id) return;
    try {
      await alertAPI.cancelAlert(activeAlert._id);
      setActiveAlert(null);
      fetchAlertHistory();
    } catch {}
  };

  const sharedProps = {
    user, location, getLocation,
    contacts, volunteers, safeZones, alertHistory,
    activeAlert, setActiveAlert, responderInfo,
    onTabChange: setTab,
    onRefresh: fetchContacts,
    onCancelSOS: cancelSOS,
  };

  const navItems = [
    ['home', '🏠', 'Home'],
    ['map', '🗺️', 'Live Map'],
    ['contacts', '📞', 'Contacts'],
    ['volunteers', '👥', 'Volunteers'],
    ['zones', '🛡️', 'Safe Zones'],
    ['history', '📋', 'History'],
    ['profile', '👤', 'Profile'],
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
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">User</div>
          </div>
          <button className="btn-logout" onClick={logout}>↩</button>
        </div>
      </aside>

      <main className="main-content">
        {activeAlert && (
          <div className="alert-banner">
            <div className="alert-banner-pulse" />
            <div>
              <strong>🚨 SOS ACTIVE</strong>
              {responderInfo && <span> — {responderInfo.responder?.name} is responding</span>}
            </div>
            <button className="btn-cancel-sos" onClick={cancelSOS}>Cancel Alert</button>
          </div>
        )}

        {tab === 'home' && <Home {...sharedProps} />}
        {tab === 'map' && <Map {...sharedProps} />}
        {tab === 'contacts' && <Contacts contacts={contacts} onRefresh={fetchContacts} />}
        {tab === 'volunteers' && <Volunteers volunteers={volunteers} />}
        {tab === 'zones' && <SafeZones safeZones={safeZones} />}
        {tab === 'history' && <History alertHistory={alertHistory} />}
        {tab === 'profile' && <Profile />}
      </main>
    </div>
  );
};

export default UserDashboard;