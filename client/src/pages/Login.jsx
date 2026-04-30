import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    }
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

        <h1 className="auth-card__title">Welcome back!</h1>
        <p className="auth-card__subtitle">Sign in to continue shopping</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-input-icon" />
              <input
                type="email"
                className="form-input auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="auth-form__hint">
            <span className="auth-hint">Admin: <strong>admin@aecommerce.com</strong> / <strong>Admin@123</strong></span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
