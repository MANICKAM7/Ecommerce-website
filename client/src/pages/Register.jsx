import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      import('react-hot-toast').then(({ default: toast }) => toast.error('Passwords do not match.'));
      return;
    }
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) navigate('/');
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg-orb auth-bg-orb--1" />
      <div className="auth-bg-orb auth-bg-orb--2" />

      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-logo-icon">Æ</div>
          <span>Mathesh Shopping Store</span>
        </div>

        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join thousands of happy shoppers</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="auth-input-wrap">
              <FiUser className="auth-input-icon" />
              <input name="name" type="text" className="form-input auth-input" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-input-icon" />
              <input name="email" type="email" className="form-input auth-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="auth-input-wrap">
              <FiPhone className="auth-input-icon" />
              <input name="phone" type="tel" className="form-input auth-input" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input name="password" type={showPass ? 'text' : 'password'} className="form-input auth-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input name="confirm" type="password" className="form-input auth-input" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
