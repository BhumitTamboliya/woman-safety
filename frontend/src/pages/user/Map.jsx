import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LPU_CENTER, NEARBY_PLACES, getZoneIcon } from './constants';
import { userIcon, volunteerIcon, policeIcon, hospitalIcon, shelterIcon } from './mapIcons';
import MapCenterUpdater from './MapCenterUpdater';

const Map = ({ location, volunteers, safeZones }) => {
  const [mapFilter, setMapFilter] = useState({
    volunteers: true, police: true, hospitals: true, shelters: true,
  });

  const mapCenter = location ? [location.latitude, location.longitude] : LPU_CENTER;

  return (
    <div className="tab-content">
      <h2 className="page-title">🗺️ Live Safety Map</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16 }}>
        📍 LPU & Phagwara Area — Punjab
      </p>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'volunteers', label: '🤝 Volunteers', color: '#00d68f' },
          { key: 'police', label: '🚔 Police', color: '#1a73e8' },
          { key: 'hospitals', label: '🏥 Hospitals', color: '#e53935' },
          { key: 'shelters', label: '🛡️ Shelters', color: '#ff9900' },
        ].map(f => (
          <button key={f.key}
            onClick={() => setMapFilter(prev => ({ ...prev, [f.key]: !prev[f.key] }))}
            style={{
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: mapFilter[f.key] ? `${f.color}22` : 'rgba(255,255,255,0.05)',
              color: mapFilter[f.key] ? f.color : 'rgba(255,255,255,0.4)',
              border: `1px solid ${mapFilter[f.key] ? f.color + '44' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.2s',
            }}>{f.label}
          </button>
        ))}
      </div>

      {/* Full Map */}
      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: 500 }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          <MapCenterUpdater center={mapCenter} />

          {/* User Location */}
          <Marker position={mapCenter} icon={userIcon}>
            <Popup>
              <strong>📍 Your Location</strong><br />
              {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'LPU Campus, Phagwara'}
            </Popup>
          </Marker>

          {/* Safety Radius */}
          <Circle center={mapCenter} radius={2000}
            pathOptions={{ color: '#ff2d55', fillColor: '#ff2d55', fillOpacity: 0.05, weight: 1, dashArray: '5,5' }} />

          {/* Volunteers from DB */}
          {mapFilter.volunteers && volunteers.map(v =>
            v.currentLocation?.coordinates && v.currentLocation.coordinates[0] !== 0 && (
              <Marker key={v._id} position={[v.currentLocation.coordinates[1], v.currentLocation.coordinates[0]]} icon={volunteerIcon}>
                <Popup>
                  <strong>🤝 {v.user?.name}</strong><br />
                  ⭐ {v.rating?.toFixed(1)} · {v.totalResponses} responses<br />
                  Status: {v.availability}
                </Popup>
              </Marker>
            )
          )}

          {/* Police Stations */}
          {mapFilter.police && NEARBY_PLACES.police.map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={policeIcon}>
              <Popup>
                <strong>🚔 {p.name}</strong><br />📞 {p.phone}<br />
                <a href={`tel:${p.phone}`} style={{ color: '#1a73e8' }}>Call Now</a>
              </Popup>
            </Marker>
          ))}

          {/* Hospitals */}
          {mapFilter.hospitals && NEARBY_PLACES.hospitals.map(h => (
            <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
              <Popup>
                <strong>🏥 {h.name}</strong><br />📞 {h.phone}<br />
                <a href={`tel:${h.phone}`} style={{ color: '#e53935' }}>Call Now</a>
              </Popup>
            </Marker>
          ))}

          {/* Shelters */}
          {mapFilter.shelters && NEARBY_PLACES.shelters.map(s => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={shelterIcon}>
              <Popup>
                <strong>🛡️ {s.name}</strong><br />📞 {s.phone}<br />
                <a href={`tel:${s.phone}`} style={{ color: '#ff9900' }}>Call Now</a>
              </Popup>
            </Marker>
          ))}

          {/* Safe Zones from DB */}
          {safeZones.map(z => z.location?.coordinates && z.location.coordinates.length >= 2 && (
            <Marker key={z._id} position={[z.location.coordinates[1], z.location.coordinates[0]]} icon={shelterIcon}>
              <Popup>
                <strong>{getZoneIcon(z.type)} {z.name}</strong><br />
                📍 {z.location?.address}<br />
                {z.phone && `📞 ${z.phone}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 1, width: '100%' }}>MAP LEGEND</div>
        {[
          { icon: '👤', label: 'Your Location', color: '#ff2d55' },
          { icon: '🤝', label: 'Volunteer', color: '#00d68f' },
          { icon: '🚔', label: 'Police Station', color: '#1a73e8' },
          { icon: '🏥', label: 'Hospital', color: '#e53935' },
          { icon: '🛡️', label: 'Safe Zone', color: '#ff9900' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>{l.icon}</span>
            <span style={{ color: l.color, fontSize: 12, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Emergency Numbers */}
      <div className="section" style={{ marginTop: 20 }}>
        <h3 className="section-title">Emergency Numbers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '🚔', name: 'Police', number: '100', color: '#1a73e8' },
            { icon: '🚑', name: 'Ambulance', number: '108', color: '#e53935' },
            { icon: '👩', name: 'Women Helpline', number: '1091', color: '#ff2d55' },
            { icon: '🆘', name: 'Emergency', number: '112', color: '#ff9900' },
          ].map(e => (
            <a key={e.number} href={`tel:${e.number}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: `${e.color}11`, border: `1px solid ${e.color}33`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 24 }}>{e.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                  <div style={{ color: e.color, fontSize: 18, fontWeight: 700 }}>{e.number}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;