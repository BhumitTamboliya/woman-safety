import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icons
const volunteerIcon = new L.DivIcon({
    html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#00d68f,#007a4d);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 15px rgba(0,214,143,0.6);">🤝</div>`,
    className: '', iconSize: [36, 36], iconAnchor: [18, 18],
});

const sosIcon = new L.DivIcon({
    html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff2d55,#8b0000);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 20px rgba(255,45,85,0.8);animation:sosPulse 1s infinite;">🆘</div>
  <style>@keyframes sosPulse{0%,100%{box-shadow:0 0 20px rgba(255,45,85,0.8)}50%{box-shadow:0 0 35px rgba(255,45,85,1)}}</style>`,
    className: '', iconSize: [36, 36], iconAnchor: [18, 18],
});

const policeIcon = new L.DivIcon({
    html: `<div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#1a73e8,#0d47a1);border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;">🚔</div>`,
    className: '', iconSize: [30, 30], iconAnchor: [15, 15],
});

const hospitalIcon = new L.DivIcon({
    html: `<div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#ff6b35,#e53935);border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;">🏥</div>`,
    className: '', iconSize: [30, 30], iconAnchor: [15, 15],
});

const LPU_CENTER = [31.2547, 75.7052];

const NEARBY_PLACES = {
    police: [
        { id: 'p1', name: 'Phagwara City Police Station', lat: 31.2240, lng: 75.7730, phone: '01824-260100' },
        { id: 'p2', name: 'LPU Campus Security', lat: 31.2547, lng: 75.7052, phone: '01824-517000' },
    ],
    hospitals: [
        { id: 'h1', name: 'Lovely Hospital (LPU)', lat: 31.2561, lng: 75.7067, phone: '01824-517000' },
        { id: 'h2', name: 'Civil Hospital Phagwara', lat: 31.2230, lng: 75.7710, phone: '01824-260200' },
    ],
};

function MapCenterUpdater({ center }) {
    const map = useMap();
    useEffect(() => { if (center) map.setView(center, 14); }, [center, map]);
    return null;
}

const VolunteerMap = ({ location, nearbyAlerts }) => {
    const mapCenter = location ? [location.latitude, location.longitude] : LPU_CENTER;

    return (
        <div className="tab-content">
            <h2 className="page-title">🗺️ Live Alert Map</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16 }}>
                📍 Your location + Active SOS alerts nearby
            </p>

            {/* Alert Count */}
            {nearbyAlerts.length > 0 && (
                <div style={{
                    background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.4)',
                    borderRadius: 12, padding: '12px 16px', marginBottom: 16,
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <span style={{ fontSize: 20 }}>🚨</span>
                    <span style={{ color: '#ff2d55', fontWeight: 700 }}>
                        {nearbyAlerts.length} Active Alert{nearbyAlerts.length > 1 ? 's' : ''} Nearby!
                    </span>
                </div>
            )}

            {/* Map */}
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: 500 }}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <MapCenterUpdater center={mapCenter} />

                    {/* Volunteer location */}
                    <Marker position={mapCenter} icon={volunteerIcon}>
                        <Popup>
                            <strong>🤝 Your Location</strong><br />
                            {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'LPU Campus'}
                        </Popup>
                    </Marker>

                    {/* Service radius */}
                    <Circle center={mapCenter} radius={5000}
                        pathOptions={{ color: '#00d68f', fillColor: '#00d68f', fillOpacity: 0.05, weight: 1, dashArray: '5,5' }} />

                    {/* Active SOS Alerts */}
                    {nearbyAlerts.map(a => (
                        a.location?.coordinates && (
                            <Marker
                                key={a._id}
                                position={[a.location.coordinates[1], a.location.coordinates[0]]}
                                icon={sosIcon}
                            >
                                <Popup>
                                    <div style={{ minWidth: 180 }}>
                                        <strong style={{ color: '#ff2d55' }}>🚨 SOS ALERT</strong><br />
                                        <strong>{a.user?.name || 'User'}</strong><br />
                                        📞 {a.user?.phone}<br />
                                        {a.user?.bloodGroup && <>🩸 {a.user.bloodGroup}<br /></>}
                                        📍 {a.location?.address || 'Location shared'}<br />
                                        ⏱ {new Date(a.createdAt).toLocaleTimeString()}<br />
                                        <span style={{
                                            background: '#ff2d5522', color: '#ff2d55',
                                            padding: '2px 8px', borderRadius: 10, fontSize: 11,
                                        }}>● {a.priority?.toUpperCase()}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}

                    {/* Police Stations */}
                    {NEARBY_PLACES.police.map(p => (
                        <Marker key={p.id} position={[p.lat, p.lng]} icon={policeIcon}>
                            <Popup><strong>🚔 {p.name}</strong><br />📞 {p.phone}</Popup>
                        </Marker>
                    ))}

                    {/* Hospitals */}
                    {NEARBY_PLACES.hospitals.map(h => (
                        <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
                            <Popup><strong>🏥 {h.name}</strong><br />📞 {h.phone}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div style={{
                marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.04)',
                borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexWrap: 'wrap', gap: 16,
            }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 1, width: '100%' }}>MAP LEGEND</div>
                {[
                    { icon: '🤝', label: 'Your Location', color: '#00d68f' },
                    { icon: '🆘', label: 'SOS Alert', color: '#ff2d55' },
                    { icon: '🚔', label: 'Police Station', color: '#1a73e8' },
                    { icon: '🏥', label: 'Hospital', color: '#e53935' },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16 }}>{l.icon}</span>
                        <span style={{ color: l.color, fontSize: 12, fontWeight: 600 }}>{l.label}</span>
                    </div>
                ))}
            </div>

            {/* Nearby Alerts List */}
            {nearbyAlerts.length > 0 && (
                <div className="section" style={{ marginTop: 20 }}>
                    <h3 className="section-title">Active SOS Alerts on Map</h3>
                    <div className="alert-list">
                        {nearbyAlerts.map(a => (
                            <div key={a._id} className="alert-item" style={{ borderLeft: '3px solid #ff2d55' }}>
                                <div>
                                    <div className="alert-type">🚨 {a.user?.name}</div>
                                    <div className="alert-location">📍 {a.location?.address || 'Location shared'}</div>
                                    <div className="alert-time">⏱ {new Date(a.createdAt).toLocaleTimeString()}</div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps?q=${a.location?.coordinates?.[1]},${a.location?.coordinates?.[0]}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        background: '#ff2d55', color: '#fff', padding: '6px 12px',
                                        borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none',
                                    }}
                                >
                                    Navigate 📍
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerMap;