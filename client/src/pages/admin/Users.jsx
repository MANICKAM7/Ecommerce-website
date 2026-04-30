import { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.users)).finally(() => setLoading(false));
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.success('Role updated!');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch { toast.error('Failed.'); }
  };

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title"><FiUsers style={{ marginRight: 8 }} />Users</h1>
            <p className="admin-subtitle">{users.length} registered users</p>
          </div>
        </div>

        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <div className="admin-full-table">
            <div className="admin-full-table__head" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr 100px' }}>
              <span>Name</span><span>Email</span><span>Phone</span><span>Joined</span><span>Role</span>
            </div>
            {users.map(user => (
              <div className="admin-full-table__row" key={user.id} style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr 100px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 13, flexShrink: 0 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{user.name}</span>
                </div>
                <span style={{ fontSize: 13 }}>{user.email}</span>
                <span>{user.phone || '-'}</span>
                <span>{new Date(user.created_at).toLocaleDateString('en-IN')}</span>
                <select
                  className="form-input"
                  style={{ fontSize: 12, padding: '6px 8px' }}
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
