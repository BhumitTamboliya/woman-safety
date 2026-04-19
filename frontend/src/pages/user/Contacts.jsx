import { useState } from 'react';
import { contactAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Contacts = ({ contacts, onRefresh }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', relation: 'family', isPrimary: false });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await contactAPI.addContact(form);
      setForm({ name: '', phone: '', email: '', relation: 'family', isPrimary: false });
      setShowForm(false);
      onRefresh();
      toast.success('Contact added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await contactAPI.deleteContact(id);
      onRefresh();
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div className="tab-content">
      <div className="page-header">
        <h2 className="page-title">Emergency Contacts</h2>
        <button className="btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Contact'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="add-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Contact name" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/, '').slice(0, 10) })} required placeholder="10-digit phone" />
            </div>
            <div className="form-group">
              <label>Email (optional)</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Relation</label>
              <select value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}>
                {['family', 'friend', 'colleague', 'neighbor', 'other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.isPrimary} onChange={e => setForm({ ...form, isPrimary: e.target.checked })} />
            Set as primary contact
          </label>
          <button type="submit" className="btn-primary" disabled={adding}>
            {adding ? 'Adding...' : 'Add Contact'}
          </button>
        </form>
      )}

      {contacts.length === 0 ? (
        <div className="empty-state">No emergency contacts added. Add up to 5 contacts.</div>
      ) : (
        <div className="contact-list">
          {contacts.map(c => (
            <div key={c._id} className="contact-card">
              <div className="contact-avatar">{c.name?.[0]}</div>
              <div className="contact-info">
                <div className="contact-name">
                  {c.name} {c.isPrimary && <span className="primary-badge">Primary</span>}
                </div>
                <div className="contact-phone">📞 {c.phone}</div>
                {c.email && <div className="contact-email">✉️ {c.email}</div>}
                <div className="contact-relation">{c.relation}</div>
              </div>
              <button className="btn-delete" onClick={() => handleDelete(c._id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;