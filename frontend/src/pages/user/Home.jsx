import { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { alertAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { LPU_CENTER, NEARBY_PLACES, statusColor } from './constants';
import { userIcon, policeIcon, hospitalIcon } from './mapIcons';
import MapCenterUpdater from './MapCenterUpdater';

const Home = ({ user, activeAlert, setActiveAlert, responderInfo, location, getLocation, contacts, volunteers, safeZones, alertHistory, onTabChange, onCancelSOS }) => {
  const [sosLoading, setSosLoading] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);

  const mapCenter = location ? [location.latitude, location.longitude] : LPU_CENTER;

  const handleSosStart = () => {
    let progress = 0;
    progressTimer.current = setInterval(() => {
      progress += 3.34;
      setHoldProgress(Math.min(progress, 100));
    }, 100);
    holdTimer.current = setTimeout(() => triggerSOS(), 3000);
  };

  const handleSosEnd = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    setHoldProgress(0);
  };

  const triggerSOS = async () => {
    clearInterval(progressTimer.current);
    setHoldProgress(100);
    setSosLoading(true);
    getLocation();
    try {
      const payload = {
        longitude: location?.longitude || LPU_CENTER[1],
        latitude: location?.latitude || LPU_CENTER[0],
        address: 'Current Location',
        message: 'Emergency SOS triggered',
      };
      const { data } = await alertAPI.triggerSOS(payload);
      setActiveAlert({ _id: data.data?.alertId || data.data?._id });
      toast.error(`🚨 SOS SENT! ${data.data?.nearbyVolunteers || 0} volunteers notified`, {
        autoClose: false, closeButton: true,
      });
    } catch {
      toast.error('Failed to send SOS. Please call 112.');
    } finally {
      setSosLoading(false);
      setHoldProgress(0);
    }
  };

  return (
    <div className="tab-content">
      <h2 className="page-title">My Safety Dashboard</h2>

      {/* SOS Button */}
      <div className="sos-section">
        <div className="sos-wrapper">
          {holdProgress > 0 && (
            <svg className="sos-progress" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ff2d55" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - holdProgress / 100)}`}
                strokeLinecap="round" transform="rotate(-90 100 100)" />
            </svg>
          )}
          <button
            className={`sos-btn ${activeAlert ? 'sos-active' : ''} ${sosLoading ? 'sos-loading' : ''}`}
            onMouseDown={!activeAlert ? handleSosStart : undefined}
            onMouseUp={!activeAlert ? handleSosEnd : undefined}
            onTouchStart={!activeAlert ? handleSosStart : undefined}
            onTouchEnd={!activeAlert ? handleSosEnd : undefined}
            disabled={sosLoading}
          >
            <span className="sos-icon">🆘</span>
            <span className="sos-label">{activeAlert ? 'ACTIVE' : 'SOS'}</span>
            {!activeAlert && <span className="sos-hint">HOLD 3s</span>}
          </button>
        </div>
        <p className="sos-description">
          {activeAlert ? 'Your location is being shared with responders' : 'Hold the SOS button for 3 seconds to trigger emergency alert'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{volunteers.length}</span>
          <span className="stat-label">Volunteers Nearby</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🚔</span>
          <span className="stat-value">{NEARBY_PLACES.police.length + NEARBY_PLACES.hospitals.length}</span>
          <span className="stat-label">Help Centers</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📞</span>
          <span className="stat-value">{contacts.length}</span>
          <span className="stat-label">Emergency Contacts</span>
        </div>
      </div>

      {/* Mini Map */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 className="section-title" style={{ margin: 0 }}>📍 Nearby Help</h3>
          <button className="btn-secondary btn-sm" onClick={() => onTabChange('map')}>View Full Map 🗺️</button>
        </div>
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: 250 }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <MapCenterUpdater center={mapCenter} />
            <Marker position={mapCenter} icon={userIcon}><Popup>📍 Your Location</Popup></Marker>
            <Circle center={mapCenter} radius={2000} pathOptions={{ color: '#ff2d55', fillColor: '#ff2d55', fillOpacity: 0.05, weight: 1 }} />
            {NEARBY_PLACES.police.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={policeIcon}>
                <Popup><strong>🚔 {p.name}</strong><br />📞 {p.phone}</Popup>
              </Marker>
            ))}
            {NEARBY_PLACES.hospitals.map(h => (
              <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
                <Popup><strong>🏥 {h.name}</strong><br />📞 {h.phone}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="section">
        <h3 className="section-title">Recent Alerts</h3>
        {alertHistory.length === 0 ? (
          <div className="empty-state">No alerts yet. Stay safe! 💚</div>
        ) : (
          <div className="alert-list">
            {alertHistory.map(a => (
              <div key={a._id} className="alert-item">
                <div>
                  <div className="alert-type">{a.type.toUpperCase()} Alert</div>
                  <div className="alert-location">{a.location?.address || 'Location not available'}</div>
                  <div className="alert-time">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <span className="status-badge" style={{ background: `${statusColor(a.status)}22`, color: statusColor(a.status) }}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;