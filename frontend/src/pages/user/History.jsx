import { statusColor } from './constants';

const History = ({ alertHistory }) => {
  return (
    <div className="tab-content">
      <h2 className="page-title">Alert History</h2>
      {alertHistory.length === 0 ? (
        <div className="empty-state">No alert history</div>
      ) : (
        <div className="history-table">
          <div className="table-header">
            <span>Type</span>
            <span>Location</span>
            <span>Date</span>
            <span>Status</span>
            <span>Response Time</span>
          </div>
          {alertHistory.map(a => (
            <div key={a._id} className="table-row">
              <span>{a.type}</span>
              <span>{a.location?.address?.slice(0, 20) || 'N/A'}</span>
              <span>{new Date(a.createdAt).toLocaleDateString()}</span>
              <span className="status-badge" style={{ color: statusColor(a.status) }}>{a.status}</span>
              <span>{a.responseTime ? `${a.responseTime}s` : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;