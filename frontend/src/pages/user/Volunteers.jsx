const Volunteers = ({ volunteers }) => {
  return (
    <div className="tab-content">
      <h2 className="page-title">Nearby Volunteers</h2>
      {volunteers.length === 0 ? (
        <div className="empty-state">No volunteers found nearby. Allow location access.</div>
      ) : (
        <div className="volunteer-list">
          {volunteers.map(v => (
            <div key={v._id} className="volunteer-card">
              <div className="vol-avatar">{v.user?.name?.[0] || '?'}</div>
              <div className="vol-info">
                <div className="vol-name">{v.user?.name}</div>
                <div className="vol-meta">⭐ {v.rating?.toFixed(1)} · {v.totalResponses} responses</div>
                <div className="vol-tags">
                  {v.specializations?.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
              <span className="status-badge available">{v.availability}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Volunteers;