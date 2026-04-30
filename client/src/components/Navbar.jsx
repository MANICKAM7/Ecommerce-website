import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiLogOut, FiMenu, FiX, FiPackage, FiSettings, FiGrid } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">Æ</div>
          <span className="navbar__logo-text">Mathesh Shopping Store</span>
        </Link>

        {/* Search */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <FiSearch className="navbar__search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="navbar__search-input"
          />
          <button type="submit" className="navbar__search-btn">Search</button>
        </form>

        {/* Nav Links */}
        <div className="navbar__links">
          <Link to="/products" className="navbar__link">Products</Link>
          {isAdmin && (
            <Link to="/admin" className="navbar__link navbar__link--admin">
              <FiGrid size={14} /> Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {user && (
            <Link to="/wishlist" className="navbar__action-btn" title="Wishlist">
              <FiHeart size={20} />
            </Link>
          )}

          <Link to="/cart" className="navbar__action-btn navbar__cart-btn" title="Cart">
            <FiShoppingCart size={20} />
            {cart.count > 0 && (
              <span className="navbar__cart-badge">{cart.count > 99 ? '99+' : cart.count}</span>
            )}
          </Link>

          {user ? (
            <div className="navbar__user" ref={userMenuRef}>
              <button className="navbar__user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="navbar__avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="navbar__username">{user.name.split(' ')[0]}</span>
              </button>

              {userMenuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <div className="navbar__dropdown-avatar">{user.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <div className="navbar__dropdown-name">{user.name}</div>
                      <div className="navbar__dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link to="/orders" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <Link to="/wishlist" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiHeart size={15} /> Wishlist
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="navbar__dropdown-divider" />
                      <Link to="/admin" className="navbar__dropdown-item navbar__dropdown-item--admin" onClick={() => setUserMenuOpen(false)}>
                        <FiSettings size={15} /> Admin Panel
                      </Link>
                    </>
                  )}
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={() => { logout(); setUserMenuOpen(false); }}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <form className="navbar__mobile-search" onSubmit={handleSearch}>
            <FiSearch />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          <Link to="/products" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Products</Link>
          {user && (
            <>
              <Link to="/orders" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <Link to="/wishlist" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              {isAdmin && <Link to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                <FiLogOut size={15} /> Logout
              </button>
            </>
          )}
          {!user && (
            <div className="navbar__mobile-auth">
              <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
