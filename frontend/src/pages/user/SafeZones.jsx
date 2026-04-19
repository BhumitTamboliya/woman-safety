import { NEARBY_PLACES } from './constants';

const SafeZones = ({ safeZones }) => {
  return (
    <div className="tab-content">
      <h2 className="page-title">Safe Zones Nearby</h2>

      <h3 className="section-title" style={{ marginBottom: 12 }}>Police Stations</h3>
      <div className="zone-list" style={{ marginBottom: 20 }}>
        {NEARBY_PLACES.police.map(p => (
          <div key={p.id} className="zone-card">
            <div className="zone-icon">🚔</div>
            <div>
              <div className="zone-name">{p.name}</div>
              <div className="zone-phone">📞 {p.phone}</div>
              <div className="zone-hours">🕐 24/7</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-title" style={{ marginBottom: 12 }}>Hospitals</h3>
      <div className="zone-list" style={{ marginBottom: 20 }}>
        {NEARBY_PLACES.hospitals.map(h => (
          <div key={h.id} className="zone-card">
            <div className="zone-icon">🏥</div>
            <div>
              <div className="zone-name">{h.name}</div>
              <div className="zone-phone">📞 {h.phone}</div>
              <div className="zone-hours">🕐 24/7</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-title" style={{ marginBottom: 12 }}>Shelters & Help Centers</h3>
      <div className="zone-list">
        {NEARBY_PLACES.shelters.map(s => (
          <div key={s.id} className="zone-card">
            <div className="zone-icon">🛡️</div>
            <div>
              <div className="zone-name">{s.name}</div>
              <div className="zone-phone">📞 {s.phone}</div>
              <div className="zone-hours">🕐 24/7</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafeZones;