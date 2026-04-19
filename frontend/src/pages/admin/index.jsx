import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, alertAPI, volunteerAPI } from '../../services/api';
import { toast } from 'react-toastify';

import Overview from './Overview';
import Users from './Users';
import VolunteersAdmin from './VolunteersAdmin';
import Reports from './Reports';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [reports, setReports] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [nearbyVolunteers, setNearbyVolunteers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [volFilter, setVolFilter] = useState('pending');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchReports();
    fetchActiveAlerts();
    fetchVolunteersForMap();
  }, []);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'volunteers') fetchVolunteers();
  }, [tab, volFilter]);

  const fetchStats = async () => {
    try { const { data } = await adminAPI.getStats(); setStats(data.data); } catch {}
  };

  const fetchReports = async () => {
    try { const { data } = await adminAPI.getReports(); setReports(data.data); } catch {}
  };

  const fetchActiveAlerts = async () => {
    try {
      const { data } = await alertAPI.getAlerts({ status: 'active', limit: 50 });
      setActiveAlerts(data.data || []);
    } catch {}
  };

  const fetchVolunteersForMap = async () => {
    try {
      // Get all verified volunteers for map
      const { data } = await adminAPI.getVolunteers({ status: 'verified', limit: 50 });
      setNearbyVolunteers(data.data || []);
    } catch {}
  };

  const fetchUsers = async () => {
    try { const { data } = await adminAPI.getUsers({ search: userSearch, role: 'user' }); setUsers(data.data || []); } catch {}
  };

  const fetchVolunteers = async () => {
    try { const { data } = await adminAPI.getVolunteers({ status: volFilter }); setVolunteers(data.data || []); } catch {}
  };

  const handleToggleUser = async (id) => {
    try { await adminAPI.toggleUser(id); toast.success('User status updated'); fetchUsers(); }
    catch { toast.error('Failed to update user'); }
  };

  const handleVerifyVolunteer = async (id, status) => {
    try { await adminAPI.verifyVolunteer(id, status); toast.success(`Volunteer ${status}!`); fetchVolunteers(); }
    catch { toast.error('Action failed'); }
  };

  const navItems = [
    ['overview', '📊', 'Overview'],
    ['users', '👤', 'Users'],
    ['volunteers', '🤝', 'Volunteers'],
    ['reports', '📈', 'Reports'],
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

        {/* Active alerts badge */}
        {activeAlerts.length > 0 && (
          <div style={{
            background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.3)',
            borderRadius: 10, padding: '8px 12px', margin: '8px 0',
            color: '#ff2d55', fontSize: 12, fontWeight: 700, textAlign: 'center',
          }}>
            🚨 {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}!
          </div>
        )}

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">Admin</div>
          </div>
          <button className="btn-logout" onClick={logout}>↩</button>
        </div>
      </aside>

      <main className="main-content">
        {tab === 'overview' && (
          <Overview
            stats={stats}
            activeAlerts={activeAlerts}
            volunteers={nearbyVolunteers}
          />
        )}

        {tab === 'users' && (
          <Users
            users={users}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            onSearch={fetchUsers}
            onToggle={handleToggleUser}
          />
        )}

        {tab === 'volunteers' && (
          <VolunteersAdmin
            volunteers={volunteers}
            volFilter={volFilter}
            setVolFilter={setVolFilter}
            onVerify={handleVerifyVolunteer}
          />
        )}

        {tab === 'reports' && (
          <Reports reports={reports} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;