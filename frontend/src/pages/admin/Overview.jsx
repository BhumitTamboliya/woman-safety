import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const sosIcon = new L.DivIcon({
  html: `<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#ff2d55,#8b0000);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 20px rgba(255,45,85,0.8);">🆘</div>`,
  className: '', iconSize: [34, 34], iconAnchor: [17, 17],
});

const volunteerIcon = new L.DivIcon({
  html: `<div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#00d68f,#007a4d);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;">🤝</div>`,
  className: '', iconSize: [30, 30], iconAnchor: [15, 15],
});

const policeIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#1a73e8,#0d47a1);border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;">🚔</div>`,
  className: '', iconSize: [28, 28], iconAnchor: [14, 14],
});

const hospitalIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#ff6b35,#e53935);border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;">🏥</div>`,
  className: '', iconSize: [28, 28], iconAnchor: [14, 14],
});

const LPU_CENTER = [31.2547, 75.7052];

const SAFE_ZONES = [
  { id: 'p1', type: 'police', name: 'Phagwara Police Station', lat: 31.2240, lng: 75.7730, phone: '01824-260100' },
  { id: 'p2', type: 'police', name: 'LPU Campus Security', lat: 31.2547, lng: 75.7052, phone: '01824-517000' },
  { id: 'h1', type: 'hospital', name: 'Lovely Hospital (LPU)', lat: 31.2561, lng: 75.7067, phone: '01824-517000' },
  { id: 'h2', type: 'hospital', name: 'Civil Hospital Phagwara', lat: 31.2230, lng: 75.7710, phone: '01824-260200' },
];

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center, map]);
  return null;
}

const KPICard = ({ icon, label, value, sub, color = '#ff2d55' }) => (
  <div className="kpi-card">
    <div className="kpi-icon" style={{ color }}>{icon}</div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
  </div>
);

const Overview = ({ stats, activeAlerts = [], volunteers = [] }) => {
  if (!stats) return <div className="tab-content"><div className="empty-state">Loading stats...</div></div>;

  return (
    <div className="tab-content">
      <h2 className="page-title">Command Center</h2>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard icon="👤" label="Registered Users" value={stats.users.total.toLocaleString()} />
        <KPICard icon="🤝" label="Verified Volunteers" value={stats.volunteers.total} color="#00d68f" />
        <KPICard icon="🚨" label="Active Alerts" value={stats.alerts.active} color="#ff2d55" sub={`${stats.alerts.today} today`} />
        <KPICard icon="⚡" label="Avg Response Time" value={stats.alerts.avgResponseTime} color="#ff9900" />
        <KPICard icon="✅" label="Success Rate" value={stats.alerts.successRate} color="#00d68f" />
        <KPICard icon="📅" label="This Month" value={stats.alerts.thisMonth} sub="alerts triggered" />
      </div>

      {/* Live Map */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 className="section-title" style={{ margin: 0 }}>🗺️ Live Incident Map</h3>
          {stats.alerts.active > 0 && (
            <span style={{ background: 'rgba(255,45,85,0.15)', color: '#ff2d55', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
              🔴 {stats.alerts.active} ACTIVE
            </span>
          )}
        </div>

        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: 420 }}>
          <MapContainer center={LPU_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <MapCenter center={LPU_CENTER} />

            {/* Active SOS Alerts */}
            {activeAlerts.map(a => a.location?.coordinates && (
              <Marker key={a._id} position={[a.location.coordinates[1], a.location.coordinates[0]]} icon={sosIcon}>
                <Popup>
                  <strong style={{ color: '#ff2d55' }}>🚨 SOS ALERT</strong><br />
                  👤 {a.user?.name}<br />
                  📞 {a.user?.phone}<br />
                  📍 {a.location?.address || 'Location shared'}<br />
                  ⏱ {new Date(a.createdAt).toLocaleTimeString()}<br />
                  <span style={{ color: '#ff2d55', fontWeight: 700 }}>● {a.status?.toUpperCase()}</span>
                </Popup>
              </Marker>
            ))}

            {/* Volunteers */}
            {volunteers.map(v => v.currentLocation?.coordinates && v.currentLocation.coordinates[0] !== 0 && (
              <Marker key={v._id} position={[v.currentLocation.coordinates[1], v.currentLocation.coordinates[0]]} icon={volunteerIcon}>
                <Popup>
                  <strong>🤝 {v.user?.name}</strong><br />
                  📞 {v.user?.phone}<br />
                  ● {v.availability}
                </Popup>
              </Marker>
            ))}

            {/* Safe Zones */}
            {SAFE_ZONES.map(z => (
              <Marker key={z.id} position={[z.lat, z.lng]} icon={z.type === 'police' ? policeIcon : hospitalIcon}>
                <Popup>
                  <strong>{z.type === 'police' ? '🚔' : '🏥'} {z.name}</strong><br />
                  📞 {z.phone}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 12, padding: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 1, width: '100%' }}>MAP LEGEND</div>
          {[
            { icon: '🆘', label: 'SOS Alert', color: '#ff2d55' },
            { icon: '🤝', label: 'Volunteer', color: '#00d68f' },
            { icon: '🚔', label: 'Police', color: '#1a73e8' },
            { icon: '🏥', label: 'Hospital', color: '#e53935' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{l.icon}</span>
              <span style={{ color: l.color, fontSize: 12, fontWeight: 600 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;