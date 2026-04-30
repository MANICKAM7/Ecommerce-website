import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiFacebook, FiYoutube, FiGithub } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">Æ</div>
              <span>Mathesh Shopping Store</span>
            </div>
            <p className="footer__desc">Your premium destination for quality products at unbeatable prices. Shop the latest trends with confidence.</p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link"><FiTwitter /></a>
              <a href="#" className="footer__social-link"><FiInstagram /></a>
              <a href="#" className="footer__social-link"><FiFacebook /></a>
              <a href="#" className="footer__social-link"><FiYoutube /></a>
              <a href="#" className="footer__social-link"><FiGithub /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Shop</h4>
            <Link to="/products" className="footer__link">All Products</Link>
            <Link to="/products?featured=true" className="footer__link">Featured</Link>
            <Link to="/products?category=electronics" className="footer__link">Electronics</Link>
            <Link to="/products?category=fashion" className="footer__link">Fashion</Link>
            <Link to="/products?category=home-living" className="footer__link">Home & Living</Link>
          </div>

          {/* Account */}
          <div className="footer__col">
            <h4 className="footer__col-title">Account</h4>
            <Link to="/login" className="footer__link">Login</Link>
            <Link to="/register" className="footer__link">Register</Link>
            <Link to="/orders" className="footer__link">My Orders</Link>
            <Link to="/wishlist" className="footer__link">Wishlist</Link>
            <Link to="/profile" className="footer__link">Profile</Link>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <div className="footer__contact-item"><FiMail /> support@aecommerce.com</div>
            <div className="footer__contact-item"><FiPhone /> +91 98765 43210</div>
            <div className="footer__contact-item"><FiMapPin /> Bangalore, India</div>

            <div className="footer__newsletter">
              <h5 className="footer__newsletter-title">Get Updates</h5>
              <div className="footer__newsletter-form">
                <input type="email" placeholder="Enter your email" className="footer__newsletter-input" />
                <button className="btn btn-primary btn-sm">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2024 Mathesh Shopping Store. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Service</a>
            <a href="#" className="footer__bottom-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
