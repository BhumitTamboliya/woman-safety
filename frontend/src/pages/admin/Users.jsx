const Users = ({ users, userSearch, setUserSearch, onSearch, onToggle }) => {
  return (
    <div className="tab-content">
      <div className="page-header">
        <h2 className="page-title">User Management</h2>
        <input
          className="search-input"
          placeholder="Search by name, email, phone..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
        />
      </div>

      <div className="table-container">
        <div className="table-header admin-user-header">
          <span>Name</span><span>Email</span><span>Phone</span><span>Alerts</span><span>Status</span><span>Action</span>
        </div>
        {users.map(u => (
          <div key={u._id} className="table-row admin-user-row">
            <span className="td-name">{u.name}</span>
            <span className="td-email">{u.email}</span>
            <span>{u.phone}</span>
            <span>{u.alertCount || 0}</span>
            <span className={`status-badge ${u.isActive ? 'active-badge' : 'inactive-badge'}`}>
              {u.isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              className={u.isActive ? 'btn-deactivate' : 'btn-activate'}
              onClick={() => onToggle(u._id)}
            >
              {u.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
        {users.length === 0 && <div className="empty-state">No users found</div>}
      </div>
    </div>
  );
};

export default Users;