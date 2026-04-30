import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--nav-height))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      textAlign: 'center',
      padding: 40,
    }} className="page-enter">
      <div style={{ fontSize: '120px', fontFamily: "'Outfit', sans-serif", fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</div>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800 }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 400 }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-secondary" onClick={() => window.history.back()}><FiArrowLeft /> Go Back</button>
        <Link to="/" className="btn btn-primary"><FiHome /> Go Home</Link>
      </div>
    </div>
  );
}
