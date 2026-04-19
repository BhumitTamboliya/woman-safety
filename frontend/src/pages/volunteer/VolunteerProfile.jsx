const VolunteerProfile = ({ user, myProfile }) => {
  if (!myProfile) return (
    <div className="tab-content">
      <div className="empty-state">Loading profile...</div>
    </div>
  );

  return (
    <div className="tab-content">
      <h2 className="page-title">My Volunteer Profile</h2>

      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d68f, #007a4d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: '0 0 20px rgba(0,214,143,0.4)',
          }}>
            {user?.name?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, margin: '0 0 4px' }}>{user?.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 2px' }}>{user?.email}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>📞 {user?.phone}</p>
          </div>
          <div className={`verification-badge ${myProfile.verificationStatus}`}>
            {myProfile.verificationStatus === 'verified' ? '✅ Verified' : '⏳ Pending Verification'}
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="pstat">
            <span className="pstat-value">{myProfile.totalResponses}</span>
            <span className="pstat-label">Total Responses</span>
          </div>
          <div className="pstat">
            <span className="pstat-value">{myProfile.successfulResponses}</span>
            <span className="pstat-label">Successful</span>
          </div>
          <div className="pstat">
            <span className="pstat-value">⭐ {myProfile.rating?.toFixed(1) || 0}</span>
            <span className="pstat-label">Rating</span>
          </div>
          <div className="pstat">
            <span className="pstat-value">{(myProfile.serviceRadius / 1000).toFixed(1)} km</span>
            <span className="pstat-label">Service Radius</span>
          </div>
        </div>

        {/* Specializations */}
        {myProfile.specializations?.length > 0 && (
          <div className="specializations" style={{ marginTop: 20 }}>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
              Specializations
            </h4>
            <div className="tags">
              {myProfile.specializations.map(s => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {myProfile.bio && (
          <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
              About
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>{myProfile.bio}</p>
          </div>
        )}

        {/* Organization */}
        {myProfile.organization && (
          <div style={{ marginTop: 12, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
              Organization
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>🏢 {myProfile.organization}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerProfile;