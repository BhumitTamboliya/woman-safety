import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const userIcon = new L.DivIcon({
  html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff2d55,#8b0000);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 15px rgba(255,45,85,0.6);">👤</div>`,
  className: '', iconSize: [36, 36], iconAnchor: [18, 18],
});

export const volunteerIcon = new L.DivIcon({
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#00d68f,#007a4d);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 10px rgba(0,214,143,0.5);">🤝</div>`,
  className: '', iconSize: [32, 32], iconAnchor: [16, 16],
});

export const policeIcon = new L.DivIcon({
  html: `<div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#1a73e8,#0d47a1);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;">🚔</div>`,
  className: '', iconSize: [32, 32], iconAnchor: [16, 16],
});

export const hospitalIcon = new L.DivIcon({
  html: `<div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#ff6b35,#e53935);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;">🏥</div>`,
  className: '', iconSize: [32, 32], iconAnchor: [16, 16],
});

export const shelterIcon = new L.DivIcon({
  html: `<div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#ff9900,#e65100);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;">🛡️</div>`,
  className: '', iconSize: [32, 32], iconAnchor: [16, 16],
});