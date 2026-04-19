const IncomingAlert = ({ incomingAlert, onAccept, onDecline, loading }) => {
  if (!incomingAlert) return null;

  return (
    <div className="incoming-alert-overlay">
      <div className="incoming-alert-modal">
        <div className="incoming-badge">🚨 NEW EMERGENCY ALERT</div>
        <h2>{incomingAlert.user?.name || 'User'} needs help!</h2>
        <p className="incoming-location">
          📍 {incomingAlert.location?.address || 'Location being fetched...'}
        </p>
        {incomingAlert.message && (
          <p className="incoming-message">"{incomingAlert.message}"</p>
        )}
        <div className="incoming-actions">
          <button
            className="btn-accept"
            onClick={() => onAccept(incomingAlert.alertId)}
            disabled={loading}
          >
            {loading ? 'Accepting...' : '✓ ACCEPT & RESPOND'}
          </button>
          <button className="btn-decline" onClick={onDecline}>✗ Decline</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingAlert;