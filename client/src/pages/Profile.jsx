import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', city: user?.city || '', country: user?.country || '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      updateUser(form);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <h1 className="profile-page__title"><FiUser /> My Profile</h1>
        <div className="profile-layout">
          {/* Avatar Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email"><FiMail size={13} /> {user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-success'}`} style={{ marginTop: 8 }}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
            </span>
          </div>

          {/* Edit Form */}
          <div className="profile-form-card">
            <h2 className="profile-form__title">Account Information</h2>
            <form className="profile-form" onSubmit={handleSave}>
              <div className="profile-form__grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="profile-input-wrap">
                    <FiUser className="profile-input-icon" />
                    <input name="name" className="form-input profile-input" value={form.name} onChange={handleChange} placeholder="Your full name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="profile-input-wrap">
                    <FiMail className="profile-input-icon" />
                    <input className="form-input profile-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="profile-input-wrap">
                    <FiPhone className="profile-input-icon" />
                    <input name="phone" className="form-input profile-input" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <div className="profile-input-wrap">
                    <FiMapPin className="profile-input-icon" />
                    <input name="city" className="form-input profile-input" value={form.city} onChange={handleChange} placeholder="Bangalore" />
                  </div>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Street Address</label>
                  <textarea name="address" className="form-input" value={form.address} onChange={handleChange} placeholder="Your full address..." rows={3} style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select name="country" className="form-input" value={form.country} onChange={handleChange}>
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
