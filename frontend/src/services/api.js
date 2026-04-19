import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.get('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updatePassword: (data) => API.put('/auth/updatepassword', data),
  forgotPassword: (email) => API.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => API.put(`/auth/resetpassword/${token}`, { password }),
};

// ─── Alerts ───────────────────────────────────────────
export const alertAPI = {
  triggerSOS: (data) => API.post('/alerts/sos', data),
  getAlerts: (params) => API.get('/alerts', { params }),
  getAlert: (id) => API.get(`/alerts/${id}`),
  updateLocation: (id, data) => API.put(`/alerts/${id}/location`, data),
  acceptAlert: (id) => API.put(`/alerts/${id}/accept`),
  resolveAlert: (id, data) => API.put(`/alerts/${id}/resolve`, data),
  cancelAlert: (id) => API.put(`/alerts/${id}/cancel`),
  getNearbyAlerts: (params) => API.get('/alerts/nearby', { params }),
};

// ─── Contacts ─────────────────────────────────────────
export const contactAPI = {
  getContacts: () => API.get('/contacts'),
  addContact: (data) => API.post('/contacts', data),
  updateContact: (id, data) => API.put(`/contacts/${id}`, data),
  deleteContact: (id) => API.delete(`/contacts/${id}`),
};

// ─── Users ────────────────────────────────────────────
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  updateLocation: (data) => API.put('/users/location', data),
  getAlertHistory: () => API.get('/users/alert-history'),
};

// ─── Volunteers ───────────────────────────────────────
export const volunteerAPI = {
  getMyProfile: () => API.get('/volunteers/me'),
  updateProfile: (data) => API.put('/volunteers/me', data),
  updateLocation: (data) => API.put('/volunteers/location', data),
  getNearby: (params) => API.get('/volunteers/nearby', { params }),
};

// ─── Safe Zones ───────────────────────────────────────
export const safeZoneAPI = {
  getNearby: (params) => API.get('/safe-zones/nearby', { params }),
  create: (data) => API.post('/safe-zones', data),
  delete: (id) => API.delete(`/safe-zones/${id}`),
};

// ─── Admin ────────────────────────────────────────────
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
  getVolunteers: (params) => API.get('/admin/volunteers', { params }),
  verifyVolunteer: (id, status) => API.put(`/admin/volunteers/${id}/verify`, { status }),
  getReports: (params) => API.get('/admin/reports', { params }),
};

export default API;