const priorityColor = (p) => ({ critical: '#ff2d55', high: '#ff6b35', medium: '#ff9900', low: '#00d68f' }[p] || '#888');
const statusColor = (s) => ({ active: '#ff2d55', responding: '#ff9900', resolved: '#00d68f' }[s] || '#888');

const AlertsList = ({ nearbyAlerts, availability, onAccept, onResolve, onRefresh, loading, user }) => {
  return (
    <div className="tab-content">
      <div className="page-header">
        <h2 className="page-title">Nearby Emergencies</h2>
        <button className="btn-secondary btn-sm" onClick={onRefresh}>🔄 Refresh</button>
      </div>

      {availability !== 'available' && (
        <div className="status-notice">
          ⚠️ You are currently offline. Toggle availability to receive alerts.
        </div>
      )}

      {nearbyAlerts.length === 0 ? (
        <div className="empty-state">
          {availability === 'available'
            ? '✅ No active alerts in your area'
            : 'Go online to see nearby alerts'}
        </div>
      ) : (
        <div className="alert-list">
          {nearbyAlerts.map(a => (
            <div key={a._id} className="alert-card volunteer-alert">
              <div className="alert-card-header">
                <div>
                  <span className="priority-tag" style={{
                    background: `${priorityColor(a.priority)}22`,
                    color: priorityColor(a.priority),
                  }}>
                    {a.priority?.toUpperCase()}
                  </span>
                  <h3>{a.user?.name || 'User'}</h3>
                  <p className="alert-phone">📞 {a.user?.phone}</p>
                </div>
                <span className="status-badge" style={{ color: statusColor(a.status) }}>
                  ● {a.status}
                </span>
              </div>

              <div className="alert-details">
                <p>📍 {a.location?.address || 'Location shared'}</p>
                {a.user?.bloodGroup && <p>🩸 Blood Group: {a.user.bloodGroup}</p>}
                {a.user?.medicalInfo && <p>⚕️ {a.user.medicalInfo}</p>}
                <p>⏱ {new Date(a.createdAt).toLocaleTimeString()}</p>
              </div>

              <div className="alert-actions">
                {a.status === 'active' && (
                  <button
                    className="btn-accept-sm"
                    onClick={() => onAccept(a._id)}
                    disabled={loading}
                  >
                    ✓ Accept
                  </button>
                )}
                {a.status === 'responding' && a.assignedResponder === user?.id && (
                  <button className="btn-resolve" onClick={() => onResolve(a._id)}>
                    ✅ Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsList;