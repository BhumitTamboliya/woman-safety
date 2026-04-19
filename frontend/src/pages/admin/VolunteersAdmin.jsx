const VolunteersAdmin = ({ volunteers, volFilter, setVolFilter, onVerify }) => {
  return (
    <div className="tab-content">
      <div className="page-header">
        <h2 className="page-title">Volunteer Verification</h2>
        <div className="filter-tabs">
          {['pending', 'verified', 'rejected'].map(s => (
            <button key={s}
              className={`filter-tab ${volFilter === s ? 'active' : ''}`}
              onClick={() => setVolFilter(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="volunteer-list">
        {volunteers.map(v => (
          <div key={v._id} className="volunteer-admin-card">
            <div className="vol-avatar">{v.user?.name?.[0]}</div>
            <div className="vol-info">
              <div className="vol-name">{v.user?.name}</div>
              <div className="vol-meta">{v.user?.email} · {v.user?.phone}</div>
              <div className="vol-meta">Joined: {new Date(v.user?.createdAt).toLocaleDateString()}</div>
              <div className="vol-stats">⭐ {v.rating?.toFixed(1)} · {v.totalResponses} responses</div>
              {v.specializations?.length > 0 && (
                <div className="vol-tags" style={{ marginTop: 4 }}>
                  {v.specializations.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              )}
            </div>
            <div className="vol-actions">
              {volFilter === 'pending' && (
                <>
                  <button className="btn-verify" onClick={() => onVerify(v._id, 'verified')}>✓ Verify</button>
                  <button className="btn-reject" onClick={() => onVerify(v._id, 'rejected')}>✗ Reject</button>
                </>
              )}
              {volFilter === 'verified' && (
                <button className="btn-deactivate" onClick={() => onVerify(v._id, 'suspended')}>Suspend</button>
              )}
              {volFilter === 'rejected' && (
                <button className="btn-verify" onClick={() => onVerify(v._id, 'verified')}>Re-verify</button>
              )}
              <span className={`status-badge ${v.verificationStatus}`}>{v.verificationStatus}</span>
            </div>
          </div>
        ))}
        {volunteers.length === 0 && (
          <div className="empty-state">No volunteers with status: {volFilter}</div>
        )}
      </div>
    </div>
  );
};

export default VolunteersAdmin;