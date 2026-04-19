// Shared constants for User pages

export const LPU_CENTER = [31.2547, 75.7052];

export const NEARBY_PLACES = {
  police: [
    { id: 'p1', name: 'Phagwara City Police Station', lat: 31.2240, lng: 75.7730, phone: '01824-260100' },
    { id: 'p2', name: 'Nawanshahr Police Station', lat: 31.1250, lng: 75.9700, phone: '01823-220100' },
    { id: 'p3', name: 'Kapurthala Police Station', lat: 31.3800, lng: 75.3800, phone: '01822-232100' },
  ],
  hospitals: [
    { id: 'h1', name: 'Lovely Hospital (LPU)', lat: 31.2561237, lng: 75.7067126, phone: '01824-517000' },
    { id: 'h2', name: 'Civil Hospital Phagwara', lat: 31.2230, lng: 75.7710, phone: '01824-260200' },
    { id: 'h3', name: 'Shri Satya Sai Hospital', lat: 31.2100, lng: 75.7600, phone: '01824-261000' },
  ],
  shelters: [
    { id: 's1', name: 'LPU Security Office', lat: 31.2547, lng: 75.7052, phone: '01824-517000' },
    { id: 's2', name: 'Phagwara Women Helpline Center', lat: 31.2200, lng: 75.7680, phone: '1091' },
  ],
};

export const statusColor = (s) => ({
  active: '#ff2d55',
  responding: '#ff9900',
  resolved: '#00d68f',
  cancelled: '#666'
}[s] || '#888');

export const getZoneIcon = (type) => ({
  police_station: '🚔',
  hospital: '🏥',
  shelter: '🏠',
  fire_station: '🚒',
  ngo: '🤝',
  public_safe_zone: '🛡️'
}[type] || '📍');